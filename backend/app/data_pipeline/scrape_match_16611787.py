import json
import time
from pathlib import Path
from seleniumbase import Driver

def main():
    match_id = 16611787 # MSV Duisburg vs SV Meppen on 2026-08-08 (Round 1)
    print(f"[Sofascore Scraper] Fetching exact match events for Match ID {match_id} (08. August 2026)...")
    
    driver = Driver(uc=True, headless=True)
    try:
        # 1. Fetch Shotmap
        shotmap_url = f"https://www.sofascore.com/api/v1/event/{match_id}/shotmap"
        print(f"[1/3] Fetching Shotmap: {shotmap_url}")
        driver.get(shotmap_url)
        time.sleep(2)
        shotmap_json = json.loads(driver.find_element("tag name", "body").text)
        
        all_shots = shotmap_json.get("shotmap", [])
        print(f"Total shots in match 16611787: {len(all_shots)}")
        
        # Save raw shotmap
        out_shotmap = Path(__file__).parent / "sofascore_match_16611787_shotmap_raw.json"
        out_shotmap.write_text(json.dumps(shotmap_json, indent=2), encoding="utf-8")
        
        # Print details of every single shot in this match
        for idx, shot in enumerate(all_shots, 1):
            player = shot.get("player", {})
            p_name = player.get("name", "Unknown")
            p_id = player.get("id")
            time_min = shot.get("time")
            outcome = shot.get("shotType")
            situation = shot.get("situation")
            body_part = shot.get("bodyPart")
            xg = shot.get("xg")
            xgot = shot.get("xgot", 0.0)
            print(f"Shot #{idx}: Min {time_min}' | Player: {p_name} (ID: {p_id}) | Outcome: {outcome} | Situation: {situation} | Body: {body_part} | xG: {xg} | xGOT: {xgot}")

        # 2. Fetch Lineups / Player Stats
        lineups_url = f"https://www.sofascore.com/api/v1/event/{match_id}/lineups"
        print(f"\n[2/3] Fetching Lineups: {lineups_url}")
        driver.get(lineups_url)
        time.sleep(2)
        lineups_json = json.loads(driver.find_element("tag name", "body").text)
        
        out_lineups = Path(__file__).parent / "sofascore_match_16611787_lineups_raw.json"
        out_lineups.write_text(json.dumps(lineups_json, indent=2), encoding="utf-8")

        # 3. Fetch Player Statistics
        stats_url = f"https://www.sofascore.com/api/v1/event/{match_id}/player/924069/statistics"
        print(f"\n[3/3] Fetching Akono Stats: {stats_url}")
        driver.get(stats_url)
        time.sleep(2)
        stats_json = json.loads(driver.find_element("tag name", "body").text)
        
        out_stats = Path(__file__).parent / "sofascore_match_16611787_akono_stats.json"
        out_stats.write_text(json.dumps(stats_json, indent=2), encoding="utf-8")
        print(f"[DONE] All authentic match logs saved successfully!")

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
