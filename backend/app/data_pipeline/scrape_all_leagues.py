"""
FutMatch Pro — Automatic Multi-League Competition Scraper (ALL 3. Liga & Regionalliga Clubs)
Scrapes 100% of clubs from competition tables (3. Liga + Regionalliga West/Südwest/Nordost/Bayern/Nord + 2. BL + BL),
fetching ~100+ real clubs and 3,000+ players with full 2026/2027 Transfermarkt squad data.
"""

import sys
import re
import time
import requests
from bs4 import BeautifulSoup
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

sys.path.append(str(Path(__file__).parent.parent.parent))

from app.db.supabase_client import get_supabase_client

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

COMPETITIONS = [
    {"code": "L3", "league": "3. Liga", "name": "3. Liga"},
    {"code": "RLW3", "league": "Regionalliga", "name": "Regionalliga West"},
    {"code": "RLSW", "league": "Regionalliga", "name": "Regionalliga Südwest"},
    {"code": "RLN3", "league": "Regionalliga", "name": "Regionalliga Nordost"},
    {"code": "RLB3", "league": "Regionalliga", "name": "Regionalliga Bayern"},
    {"code": "RLN4", "league": "Regionalliga", "name": "Regionalliga Nord"},
    {"code": "L2", "league": "2. Bundesliga", "name": "2. Bundesliga"},
    {"code": "L1", "league": "Bundesliga", "name": "Bundesliga"},
]

def fetch_clubs_from_competition(code, league_name):
    url = f"https://www.transfermarkt.de/wettbewerb/startseite/wettbewerb/{code}/saison_id/2026"
    print(f"\n[Competition Scraper] Fetching all clubs from {league_name} ({url})...")
    
    try:
        resp = requests.get(url, headers=HEADERS, timeout=25)
        if resp.status_code != 200:
            print(f"[ERROR] HTTP {resp.status_code} for competition {code}")
            return []
            
        soup = BeautifulSoup(resp.content, 'html.parser')
        table = soup.find('table', {'class': 'items'})
        if not table:
            print(f"[ERROR] Could not find items table for competition {code}")
            return []

        discovered = []
        seen_slugs = set()

        for a in table.find_all('a', href=lambda h: h and '/verein/' in h and '/startseite/' in h):
            href = a['href']
            cname = a.text.strip()
            if not cname:
                continue

            parts = href.split('/')
            if len(parts) >= 5:
                slug = parts[1]
                tm_id = parts[4]

                if slug not in seen_slugs:
                    seen_slugs.add(slug)
                    cid = f"CLB-{tm_id}"
                    discovered.append({
                        "id": cid,
                        "tm_id": int(tm_id),
                        "slug": slug,
                        "name": cname,
                        "league": league_name,
                        "system": "4-2-3-1"
                    })

        print(f"[SUCCESS] Discovered {len(discovered)} clubs in {league_name}!")
        return discovered
    except Exception as e:
        print(f"[ERROR] Competition scraper failed for {code}: {e}")
        return []

def scrape_club_squad(club_info):
    tm_id = club_info["tm_id"]
    slug = club_info["slug"]
    url = f"https://www.transfermarkt.de/{slug}/kader/verein/{tm_id}/saison_id/2026/plus/1"
    
    print(f"  -> Scraping 2026/27 squad for {club_info['name']} ({slug})...")
    try:
        resp = requests.get(url, headers=HEADERS, timeout=25)
        if resp.status_code != 200:
            return None

        soup = BeautifulSoup(resp.content, 'html.parser')
        table = soup.find('table', {'class': 'items'})
        if not table:
            return None

        squad_players = []
        rows = table.find_all('tr', {'class': ['odd', 'even']})

        for r in rows:
            hauptlink = r.find('td', {'class': 'hauptlink'})
            if not hauptlink:
                continue
                
            a_tag = hauptlink.find('a')
            if not a_tag or not a_tag.text.strip():
                continue
                
            player_name = a_tag.text.strip()
            player_link = a_tag['href']

            pos_tr = r.find_all('tr')
            position = pos_tr[1].text.strip() if len(pos_tr) > 1 else "Unbekannt"

            mv_td = r.find('td', {'class': 'rechts hauptlink'})
            market_val = mv_td.text.strip() if mv_td else "-"

            tds = [td.text.strip() for td in r.find_all('td')]
            
            age_str = ""
            for td_t in tds:
                if "(" in td_t and ")" in td_t and len(td_t) < 20:
                    age_str = td_t
                    break

            foot = "Unbekannt"
            if len(tds) >= 10:
                potential_foot = tds[9].lower()
                if "rechts" in potential_foot:
                    foot = "Rechts"
                elif "links" in potential_foot:
                    foot = "Links"
                elif "beidfüßig" in potential_foot or "beid" in potential_foot:
                    foot = "Beidfüßig"

            contract_until = "Unbekannt"
            for td_t in reversed(tds):
                if re.search(r'\d{2}\.\d{2}\.\d{4}', td_t):
                    contract_until = td_t
                    break

            profile_url = f"https://www.transfermarkt.de{player_link}" if player_link.startswith('/') else player_link

            squad_players.append({
                "name": player_name,
                "position": position,
                "age": age_str,
                "market_value": market_val,
                "foot": foot,
                "contract_until": contract_until,
                "profile_url": profile_url
            })

        return squad_players
    except Exception as e:
        print(f"     [ERROR] Failed squad scrape for {slug}: {e}")
        return None

def run_master_competition_ingestion():
    print("============================================================")
    print("[Pipeline] FutMatch Pro: ALL 3. Liga & Regionalliga Competition Ingestion")
    print("============================================================")

    client = get_supabase_client()
    if not client:
        print("[ERROR] Supabase client unavailable.")
        return False

    all_clubs = []
    for comp in COMPETITIONS:
        c_list = fetch_clubs_from_competition(comp["code"], comp["league"])
        all_clubs.extend(c_list)
        time.sleep(1)

    print(f"\n============================================================")
    print(f"[DISCOVERY COMPLETED] Discovered {len(all_clubs)} TOTAL clubs across all leagues!")
    print("============================================================")

    upserted_count = 0
    total_players_scraped = 0

    for club in all_clubs:
        existing_res = client.table("clubs").select("*").eq("id", club["id"]).execute()
        existing_profile = {}
        if existing_res.data and len(existing_res.data) > 0:
            existing_profile = existing_res.data[0].get("squad_profile", {})
            if not isinstance(existing_profile, dict):
                existing_profile = {}

        squad = scrape_club_squad(club)
        if not squad:
            continue

        head_coach = existing_profile.get("head_coach") or "Cheftrainer"
        tactical_system = existing_profile.get("tactical_system") or club["system"]

        defenders_exp = [p["name"] + f" ({p['contract_until']})" for p in squad if any(pos in p["position"].lower() for pos in ["verteidiger", "iv", "lv", "rv", "torwart"]) and ("2027" in p["contract_until"] or "2028" in p["contract_until"])]
        midfielders_exp = [p["name"] + f" ({p['contract_until']})" for p in squad if any(pos in p["position"].lower() for pos in ["mittelfeld", "zm", "dm", "om"]) and ("2027" in p["contract_until"] or "2028" in p["contract_until"])]
        attackers_exp = [p["name"] + f" ({p['contract_until']})" for p in squad if any(pos in p["position"].lower() for pos in ["stürmer", "flügel", "linksaußen", "rechtsaußen", "ms"]) and ("2027" in p["contract_until"] or "2028" in p["contract_until"])]

        starting_xi_names = [p["name"] for p in squad[:11]]
        starting_xi = [{"name": name, "position": squad[idx]["position"], "slot": f"SLOT_{idx+1}"} for idx, name in enumerate(starting_xi_names)]

        squad_profile = {
            "head_coach": head_coach,
            "tactical_system": tactical_system,
            "tactical_formation_2027": f"{tactical_system} (Haupt-System)",
            "full_squad_2027": squad,
            "starting_xi_2027": starting_xi,
            "active_squad_size": len(squad),
            "expiring_contracts_2027_2028": {
                "defenders": defenders_exp,
                "midfielders": midfielders_exp,
                "attackers": attackers_exp
            },
            "deep_tactics": existing_profile.get("deep_tactics", {}),
            "positional_role_tactics": existing_profile.get("positional_role_tactics", {})
        }

        logo_short = "".join([w[0] for w in club["name"].split()[:3]]).upper()

        db_payload = {
            "id": club["id"],
            "name": club["name"],
            "logo_short": logo_short[:4],
            "league": club["league"],
            "primary_tactics": [tactical_system],
            "target_positions": ["IV", "ZM", "MS"],
            "ideal_age_min": 19,
            "ideal_age_max": 28,
            "contract_expiring_count": {
                "IV": len(defenders_exp),
                "ZM": len(midfielders_exp),
                "MS": len(attackers_exp)
            },
            "squad_profile": squad_profile,
            "base_rating": 80
        }

        client.table("clubs").upsert(db_payload).execute()
        upserted_count += 1
        total_players_scraped += len(squad)
        print(f"  [SUCCESS] {club['name']:30s} | {club['league']:15s} | {len(squad)} Players Upserted!")
        time.sleep(0.5)

    print("============================================================")
    print(f"[ALL LEAGUES COMPLETED] Ingested {upserted_count} clubs & {total_players_scraped} players into Supabase!")
    print("============================================================")
    return True

if __name__ == "__main__":
    run_master_competition_ingestion()
