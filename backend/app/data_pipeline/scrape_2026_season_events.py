import json
import time
from pathlib import Path
from seleniumbase import Driver

def main():
    print("[Sofascore Scraper] Fetching 3. Liga 2026/2027 (Season ID: 98012) Events...")
    driver = Driver(uc=True, headless=True)
    
    all_2026_matches = []
    akono_2026_matches = []
    
    try:
        # Check rounds 1 to 10 of 2026/2027 season
        for round_num in range(1, 10):
            url = f"https://www.sofascore.com/api/v1/unique-tournament/491/season/98012/events/round/{round_num}"
            print(f"[Round {round_num}] Fetching: {url}")
            driver.get(url)
            time.sleep(1.5)
            
            try:
                body_text = driver.find_element("tag name", "body").text
                data = json.loads(body_text)
                events = data.get("events", [])
                print(f"   Found {len(events)} matches in Round {round_num}")
                
                for ev in events:
                    all_2026_matches.append(ev)
                    home = ev.get("homeTeam", {}).get("name", "")
                    away = ev.get("awayTeam", {}).get("name", "")
                    start_ts = ev.get("startTimestamp")
                    # Format timestamp if needed
                    date_str = time.strftime('%Y-%m-%d', time.localtime(start_ts)) if start_ts else ""
                    print(f"      Match {ev.get('id')}: {home} vs {away} | Date: {date_str} (Round {round_num})")
            except Exception as e:
                print(f"   Error parsing Round {round_num}: {e}")
                
        # Save all matches for inspection
        out_path = Path(__file__).parent / "sofascore_3liga_2026_matches.json"
        out_path.write_text(json.dumps(all_2026_matches, indent=2), encoding="utf-8")
        print(f"[DONE] Saved {len(all_2026_matches)} matches to: {out_path}")

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
