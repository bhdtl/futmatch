import json
import time
from pathlib import Path
from seleniumbase import Driver

def main():
    json_path = Path(__file__).parent / "sofascore_cyrill_akono_real.json"
    if not json_path.exists():
        print("[ERROR] JSON file not found!")
        return
        
    data = json.loads(json_path.read_text(encoding="utf-8"))
    events = data.get("events", [])
    print(f"[Scraper] Loaded {len(events)} real Sofascore events for Cyrill Akono.")
    
    driver = Driver(uc=True, headless=True)
    all_akono_shots = []
    
    try:
        for idx, ev in enumerate(events[:10], 1): # Top 10 recent matches
            m_id = ev.get("id")
            h_team = ev.get("homeTeam", {}).get("name")
            a_team = ev.get("awayTeam", {}).get("name")
            tourn = ev.get("tournament", {}).get("name")
            round_num = ev.get("roundInfo", {}).get("round", "")
            
            shotmap_url = f"https://www.sofascore.com/api/v1/event/{m_id}/shotmap"
            driver.get(shotmap_url)
            time.sleep(1.5)
            
            try:
                body_text = driver.find_element("tag name", "body").text
                shotmap_json = json.loads(body_text)
                shots = shotmap_json.get("shotmap", [])
                
                # Filter for Akono (ID: 924069)
                akono_shots = [s for s in shots if s.get("player", {}).get("id") == 924069]
                
                print(f"Match #{idx} ({tourn} Rd {round_num}): {h_team} vs {a_team} (ID: {m_id}) -> Total Shots: {len(shots)}, Akono Shots: {len(akono_shots)}")
                for s in akono_shots:
                    s["match_info"] = f"{h_team} vs {a_team}"
                    s["match_id"] = m_id
                    all_akono_shots.append(s)
            except Exception as e:
                print(f"   [No Shotmap Available for Match {m_id}]: {e}")

        # Save authentic shotmaps
        out_shotmap_path = Path(__file__).parent / "sofascore_akono_authentic_shotmap.json"
        out_shotmap_path.write_text(json.dumps(all_akono_shots, indent=2), encoding="utf-8")
        print(f"\n[DONE] Saved {len(all_akono_shots)} authentic shotmap events to: {out_shotmap_path}")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
