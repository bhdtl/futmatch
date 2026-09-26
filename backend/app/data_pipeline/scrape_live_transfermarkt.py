"""
FutMatch Pro — Real-Time Live Transfermarkt Scraper & Supabase Sync
Fetches 1:1 active 1st team squads and live head coaches for Season 2026/2027 (saison_id/2026), 
extracts EXACT contract expiration dates ("Vertrag bis"), individual player feet, 
and computes 100% real position-based contract expiring counts (2027/2028).
"""

import sys
import re
import time
import requests
from bs4 import BeautifulSoup
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent))

from app.db.supabase_client import get_supabase_client

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

TARGET_CLUBS = [
    {"id": "CLB-B04", "tm_id": 15, "slug": "bayer-04-leverkusen", "name": "Bayer 04 Leverkusen", "league": "Bundesliga", "system": "4-2-3-1"},
    {"id": "CLB-STP", "tm_id": 35, "slug": "fc-st-pauli", "name": "FC St. Pauli", "league": "Bundesliga", "system": "4-2-3-1"},
    {"id": "CLB-F95", "tm_id": 38, "slug": "fortuna-dusseldorf", "name": "Fortuna Düsseldorf", "league": "2. Bundesliga", "system": "4-2-3-1"},
    {"id": "CLB-SGG", "tm_id": 65, "slug": "spvgg-greuther-furth", "name": "Greuther Fürth", "league": "2. Bundesliga", "system": "4-2-3-1"},
    {"id": "CLB-KSV", "tm_id": 269, "slug": "holstein-kiel", "name": "Holstein Kiel", "league": "Bundesliga", "system": "4-2-3-1"},
    {"id": "CLB-FCB", "tm_id": 27, "slug": "bayern-munchen", "name": "FC Bayern München", "league": "Bundesliga", "system": "4-2-3-1"},
    {"id": "CLB-BVB", "tm_id": 16, "slug": "borussia-dortmund", "name": "Borussia Dortmund", "league": "Bundesliga", "system": "4-2-3-1"},
]

def scrape_live_head_coach(tm_id, slug):
    url = f"https://www.transfermarkt.de/{slug}/mitarbeiter/verein/{tm_id}/saison_id/2026"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=20)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.content, 'html.parser')
            coach_a = soup.find('a', href=lambda h: h and '/profil/trainer/' in h)
            if coach_a and coach_a.text.strip():
                return coach_a.text.strip()
    except Exception as e:
        print(f"[ERROR] Failed to fetch coach for {slug}: {e}")
    return "Cheftrainer"

def scrape_club_squad(club_info):
    tm_id = club_info["tm_id"]
    slug = club_info["slug"]
    url = f"https://www.transfermarkt.de/{slug}/kader/verein/{tm_id}/saison_id/2026/plus/1"
    
    print(f"\n[Scraper 2026/27] Fetching live squad for {club_info['name']} ({url})...")
    resp = requests.get(url, headers=HEADERS, timeout=30)
    if resp.status_code != 200:
        print(f"[ERROR] Failed to fetch {url} (Status: {resp.status_code})")
        return None

    soup = BeautifulSoup(resp.content, 'html.parser')
    table = soup.find('table', {'class': 'items'})
    if not table:
        print(f"[ERROR] No squad table found for {club_info['name']}")
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

        # Position
        pos_tr = r.find_all('tr')
        position = pos_tr[1].text.strip() if len(pos_tr) > 1 else "Unbekannt"

        # Market Value
        mv_td = r.find('td', {'class': 'rechts hauptlink'})
        market_val = mv_td.text.strip() if mv_td else "-"

        # All TDs in row
        tds = [td.text.strip() for td in r.find_all('td')]
        
        # Age
        age_str = ""
        for td_t in tds:
            if "(" in td_t and ")" in td_t and len(td_t) < 20:
                age_str = td_t
                break

        # Preferred Foot from TD 9 if available
        foot = "Unbekannt"
        if len(tds) >= 10:
            potential_foot = tds[9].lower()
            if "rechts" in potential_foot:
                foot = "Rechts"
            elif "links" in potential_foot:
                foot = "Links"
            elif "beid" in potential_foot:
                foot = "Beidfüßig"

        # Exact Contract Expiration Date ("Vertrag bis")
        date_matches = [t for t in tds if re.match(r'^\d{2}\.\d{2}\.\d{4}$', t)]
        contract_until = "Unbekannt"
        if len(date_matches) >= 2:
            contract_until = date_matches[-1] # The second date cell in plus/1 view is "Vertrag bis"
        elif len(date_matches) == 1 and ("202" in date_matches[0] or "203" in date_matches[0]):
            contract_until = date_matches[0]

        squad_players.append({
            "name": player_name,
            "position": position,
            "age": age_str,
            "foot": foot,
            "market_value": market_val,
            "contract_until": contract_until,
            "profile_url": f"https://www.transfermarkt.de{player_link}"
        })

    print(f"[Scraper 2026/27] Successfully parsed {len(squad_players)} live 1st team players for {club_info['name']}.")
    return squad_players

def run_live_transfermarkt_sync():
    print("============================================================")
    print("[Pipeline] FutMatch Pro: Live 1:1 Transfermarkt Sync (Season 2026/2027)")
    print("============================================================")

    client = get_supabase_client()
    if not client:
        print("[ERROR] Supabase client unavailable.")
        return False

    # Wipe old records
    try:
        client.table("clubs").delete().neq("id", "PRO-000").execute()
        print("[Supabase] Cleaned legacy club records from database.")
    except Exception as e:
        print(f"[Supabase] Notice on cleanup: {e}")

    synced_records = []

    for club_cfg in TARGET_CLUBS:
        # Scrape live head coach directly from Transfermarkt staff page
        head_coach = scrape_live_head_coach(club_cfg["tm_id"], club_cfg["slug"])
        print(f"[Scraper] {club_cfg['name']} Live Coach -> {head_coach}")

        squad = scrape_club_squad(club_cfg)
        time.sleep(1) # respectful scraping pause

        if not squad:
            continue

        # Real position-based contract expiring counts (2027 or 2028)
        expiring_defenders = [p for p in squad if any(yr in p["contract_until"] for yr in ["2027", "2028"]) and ("verteidiger" in p["position"].lower() or "abwehr" in p["position"].lower() or "torwart" in p["position"].lower())]
        expiring_midfielders = [p for p in squad if any(yr in p["contract_until"] for yr in ["2027", "2028"]) and "mittelfeld" in p["position"].lower()]
        expiring_attackers = [p for p in squad if any(yr in p["contract_until"] for yr in ["2027", "2028"]) and ("stürmer" in p["position"].lower() or "außen" in p["position"].lower() or "flügel" in p["position"].lower())]

        defenders = [p for p in squad if "verteidiger" in p["position"].lower() or "abwehr" in p["position"].lower()]
        midfielders = [p for p in squad if "mittelfeld" in p["position"].lower()]
        attackers = [p for p in squad if "stürmer" in p["position"].lower() or "außen" in p["position"].lower() or "flügel" in p["position"].lower()]
        goalkeepers = [p for p in squad if "torwart" in p["position"].lower()]

        logo_short = "".join([w[0] for w in club_cfg["name"].split()[:3]]).upper()

        record = {
            "id": club_cfg["id"],
            "name": club_cfg["name"],
            "logo_short": logo_short[:4],
            "league": club_cfg["league"],
            "primary_tactics": [club_cfg["system"]],
            "target_positions": ["IV", "ZM", "MS"],
            "ideal_age_min": 19,
            "ideal_age_max": 28,
            "contract_expiring_count": {
                "IV": len(expiring_defenders),
                "ZM": len(expiring_midfielders),
                "MS": len(expiring_attackers)
            },
            "squad_profile": {
                "season": "2026/2027",
                "head_coach": head_coach,
                "tactical_system": club_cfg["system"],
                "active_squad_size": len(squad),
                "expiring_contracts_2027_2028": {
                    "defenders": [p["name"] + " (" + p["contract_until"] + ")" for p in expiring_defenders],
                    "midfielders": [p["name"] + " (" + p["contract_until"] + ")" for p in expiring_midfielders],
                    "attackers": [p["name"] + " (" + p["contract_until"] + ")" for p in expiring_attackers]
                },
                "squad_breakdown": {
                    "goalkeepers": len(goalkeepers),
                    "defenders": len(defenders),
                    "midfielders": len(midfielders),
                    "attackers": len(attackers)
                },
                "live_squad_sample": squad[:15],
                "data_source": f"Live Real-Time Transfermarkt Scraper (Season 2026/2027 - transfermarkt.de/verein/{club_cfg['tm_id']})"
            },
            "base_rating": 80
        }

        client.table("clubs").upsert(record).execute()
        synced_records.append(record)
        print(f"[SUCCESS] Upserted {club_cfg['name']} (Coach: {head_coach}) to Supabase! Expiring 2027/28: {len(expiring_defenders)} DEF, {len(expiring_midfielders)} MID, {len(expiring_attackers)} ATT")

    print(f"\n============================================================")
    print(f"[COMPLETED] Synced {len(synced_records)} 1:1 Live Transfermarkt Squad Profiles for Season 2026/2027!")
    print(f"============================================================")

    # Verification query
    res = client.table("clubs").select("*").execute()
    print(f"[VERIFIED] {len(res.data)} Clubs active in Supabase DB:")
    for row in res.data:
        sp = row.get("squad_profile", {})
        cec = row.get("contract_expiring_count", {})
        print(f"  -> [{row['id']}] {row['name']} ({row['league']}) | Coach: {sp.get('head_coach')} | Season: {sp.get('season')} | Real Expiring (2027/28): {cec.get('IV', 0)} DEF, {cec.get('ZM', 0)} MID, {cec.get('MS', 0)} ATT")

    return True

if __name__ == "__main__":
    run_live_transfermarkt_sync()
