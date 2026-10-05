import json
import time
from pathlib import Path
from seleniumbase import Driver

def main():
    match_id = 16596600 # SV Meppen vs 1. FC Saarbrücken on 2026-09-05 (Round 4)
    print(f"[Sofascore Scraper] Fetching match ID {match_id} (05. September 2026 vs 1. FC Saarbrücken)...")
    
    driver = Driver(uc=True, headless=True)
    try:
        # 1. Fetch Shotmap
        shotmap_url = f"https://www.sofascore.com/api/v1/event/{match_id}/shotmap"
        print(f"[1/2] Fetching Shotmap: {shotmap_url}")
        driver.get(shotmap_url)
        time.sleep(2)
        shotmap_json = json.loads(driver.find_element("tag name", "body").text)
        
        shots = shotmap_json.get("shotmap", [])
        print(f"Total shots in match {match_id}: {len(shots)}")
        
        # Filter for Cyrill Akono (ID 924069)
        akono_shots = [s for s in shots if s.get("player", {}).get("id") == 924069]
        print(f"Cyrill Akono shots in match: {len(akono_shots)}")
        
        # Save raw shotmap
        out_file = Path(__file__).parent / "sofascore_match_16596600_saarbruecken.json"
        payload = {
            "match_id": match_id,
            "match_name": "SV Meppen vs 1. FC Saarbrücken",
            "date": "2026-09-05",
            "all_shots_count": len(shots),
            "akono_shots": akono_shots,
            "raw_shotmap": shots
        }
        out_file.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        
        # Print each shot details
        for idx, shot in enumerate(shots, 1):
            p = shot.get("player", {})
            p_name = p.get("name", "Unknown")
            p_id = p.get("id")
            m = shot.get("time")
            st = shot.get("shotType")
            sit = shot.get("situation")
            bp = shot.get("bodyPart")
            xg = shot.get("xg")
            xgot = shot.get("xgot", 0.0)
            is_akono = " *** AKONO ***" if p_id == 924069 else ""
            print(f"Shot #{idx}{is_akono}: Min {m}' | Player: {p_name} | Outcome: {st} | Situation: {sit} | Body: {bp} | xG: {xg} | xGOT: {xgot}")

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
