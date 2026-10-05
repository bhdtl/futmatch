import json
import time
from pathlib import Path
from seleniumbase import Driver

def main():
    player_id = 924069 # Cyrill Akono
    tournament_id = 491 # 3. Liga
    season_id = 98012 # 2026/2027 season
    
    driver = Driver(uc=True, headless=True)
    try:
        # 1. Fetch Overall Season Statistics
        url_overall = f"https://www.sofascore.com/api/v1/player/{player_id}/unique-tournament/{tournament_id}/season/{season_id}/statistics/overall"
        print(f"[1/2] Fetching Overall Season Statistics: {url_overall}")
        driver.get(url_overall)
        time.sleep(2)
        overall_json = json.loads(driver.find_element("tag name", "body").text)
        
        # 2. Fetch Per 90 Season Statistics
        url_per90 = f"https://www.sofascore.com/api/v1/player/{player_id}/unique-tournament/{tournament_id}/season/{season_id}/statistics/per90"
        print(f"[2/2] Fetching Per 90 Season Statistics: {url_per90}")
        driver.get(url_per90)
        time.sleep(2)
        per90_json = json.loads(driver.find_element("tag name", "body").text)
        
        out_file = Path(__file__).parent / "sofascore_akono_official_season_stats.json"
        payload = {
            "player_id": player_id,
            "overall": overall_json,
            "per90": per90_json
        }
        out_file.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        print(f"[SUCCESS] Saved raw official Sofascore season stats to: {out_file}")
        
        # Print all top-level keys
        print("\n[OVERALL STATS KEYS]:", list(overall_json.get("statistics", {}).keys()))
        print("\n[PER90 STATS KEYS]:", list(per90_json.get("statistics", {}).keys()))

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
