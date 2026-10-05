import json
import time
from pathlib import Path
from seleniumbase import Driver

def main():
    print("[Sofascore Pipeline] Inspecting 1. Bundesliga, 2. Bundesliga & 3. Liga 2026/2027 Season IDs...")
    driver = Driver(uc=True, headless=True)
    
    tournaments = [
        {"name": "1. Bundesliga", "id": 35},
        {"name": "2. Bundesliga", "id": 44},
        {"name": "3. Liga", "id": 491}
    ]
    
    results = {}
    try:
        for t in tournaments:
            url = f"https://www.sofascore.com/api/v1/unique-tournament/{t['id']}/seasons"
            driver.get(url)
            time.sleep(1.5)
            data = json.loads(driver.find_element("tag name", "body").text)
            seasons = data.get("seasons", [])
            s_2026 = [s for s in seasons if "26/27" in s.get("name", "") or "2026" in s.get("name", "")]
            print(f"[{t['name']}] Found {len(seasons)} seasons. 2026/2027 Season: {s_2026}")
            results[t['name']] = {
                "tournament_id": t['id'],
                "seasons": seasons,
                "current_season": s_2026[0] if s_2026 else seasons[0]
            }
            
        out_path = Path(__file__).parent / "sofascore_german_leagues_seasons.json"
        out_path.write_text(json.dumps(results, indent=2), encoding="utf-8")
        print(f"[DONE] Saved league season mapping to: {out_path}")

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
