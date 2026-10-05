import sys
import json
import time
from pathlib import Path
from typing import Dict, Any, List
from seleniumbase import Driver

def main():
    print("=========================================================================")
    print("[Sofascore Master Scraper] Starting Multi-League 2026/2027 Live Data Batch Scraper")
    print("=========================================================================")

    leagues = [
        {"name": "1. Bundesliga", "tournament_id": 35, "season_id": 97464, "total_rounds": 6},
        {"name": "2. Bundesliga", "tournament_id": 44, "season_id": 97406, "total_rounds": 6},
        {"name": "3. Liga", "tournament_id": 491, "season_id": 98012, "total_rounds": 7}
    ]

    driver = Driver(uc=True, headless=True)
    all_scraped_data = {}

    try:
        for lg in leagues:
            lg_name = lg["name"]
            print(f"\n[LEAGUE] Scraping {lg_name} (Season ID: {lg['season_id']})...")
            lg_matches = []
            
            for r in range(1, lg["total_rounds"] + 1):
                url = f"https://www.sofascore.com/api/v1/unique-tournament/{lg['tournament_id']}/season/{lg['season_id']}/events/round/{r}"
                print(f"   Fetching Round {r}/{lg['total_rounds']}: {url}")
                driver.get(url)
                time.sleep(1.5)
                
                try:
                    body = driver.find_element("tag name", "body").text
                    data = json.loads(body)
                    events = data.get("events", [])
                    print(f"   -> Round {r}: {len(events)} matches found")
                    for ev in events:
                        m_id = ev.get("id")
                        h_team = ev.get("homeTeam", {}).get("name")
                        a_team = ev.get("awayTeam", {}).get("name")
                        lg_matches.append({
                            "match_id": m_id,
                            "round": r,
                            "home_team": h_team,
                            "away_team": a_team,
                            "date": time.strftime('%Y-%m-%d', time.localtime(ev.get("startTimestamp", 0)))
                        })
                except Exception as e:
                    print(f"   [WARN] Error round {r}: {e}")

            print(f"   [SUMMARY] {lg_name}: Total {len(lg_matches)} matches captured across {lg['total_rounds']} rounds.")
            
            # Fetch detailed shotmaps & lineups for top matches
            match_details = []
            for idx, m in enumerate(lg_matches[:12], 1):
                m_id = m["match_id"]
                print(f"      [{idx}/12] Scraping match details for {m['home_team']} vs {m['away_team']} (ID: {m_id})...")
                
                # Shotmap
                shotmap_url = f"https://www.sofascore.com/api/v1/event/{m_id}/shotmap"
                driver.get(shotmap_url)
                time.sleep(1.2)
                shots_raw = []
                try:
                    shots_raw = json.loads(driver.find_element("tag name", "body").text).get("shotmap", [])
                except Exception as e:
                    pass

                # Lineups / Player statistics
                lineups_url = f"https://www.sofascore.com/api/v1/event/{m_id}/lineups"
                driver.get(lineups_url)
                time.sleep(1.2)
                lineups_raw = {}
                try:
                    lineups_raw = json.loads(driver.find_element("tag name", "body").text)
                except Exception as e:
                    pass

                match_details.append({
                    "meta": m,
                    "shots": shots_raw,
                    "lineups": lineups_raw
                })

            all_scraped_data[lg_name] = {
                "league_name": lg_name,
                "matches": lg_matches,
                "scraped_match_details": match_details
            }

        # Save Master Batch Database
        out_file = Path(__file__).parent / "scraped_2026_season_database.json"
        out_file.write_text(json.dumps(all_scraped_data, indent=2), encoding="utf-8")
        print(f"\n[SUCCESS] Master 2026/2027 Season Database saved to: {out_file}")

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
