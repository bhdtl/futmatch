import sys
import json
import time
from pathlib import Path
from seleniumbase import Driver

def main():
    print("[Sofascore Live Pipeline] Searching for Cyrill Akono specifically...")
    driver = Driver(uc=True, headless=True)
    
    try:
        # Try full search for Cyrill
        search_url = "https://www.sofascore.com/api/v1/search/all?q=Cyrill"
        print(f"[1/4] Fetching: {search_url}")
        driver.get(search_url)
        time.sleep(2)
        search_json = json.loads(driver.find_element("tag name", "body").text)
        
        akono_player = None
        for res in search_json.get("results", []):
            entity = res.get("entity", {})
            name = entity.get("name", "").lower()
            if "akono" in name:
                akono_player = entity
                break
                
        if not akono_player:
            print("[2/4] Searching team MSV Duisburg to find player ID...")
            driver.get("https://www.sofascore.com/api/v1/search/all?q=MSV%20Duisburg")
            time.sleep(2)
            team_search = json.loads(driver.find_element("tag name", "body").text)
            team_id = None
            for res in team_search.get("results", []):
                entity = res.get("entity", {})
                if entity.get("type") == "team" or "duisburg" in entity.get("name", "").lower():
                    team_id = entity.get("id")
                    print(f"[FOUND TEAM] MSV Duisburg (ID: {team_id})")
                    break
                    
            if team_id:
                # Get squad
                squad_url = f"https://www.sofascore.com/api/v1/team/{team_id}/players"
                driver.get(squad_url)
                time.sleep(2)
                squad_json = json.loads(driver.find_element("tag name", "body").text)
                for p in squad_json.get("players", []):
                    player_obj = p.get("player", {})
                    if "akono" in player_obj.get("name", "").lower():
                        akono_player = player_obj
                        print(f"[FOUND PLAYER IN SQUAD] {player_obj.get('name')} (ID: {player_obj.get('id')})")
                        break

        if akono_player:
            p_id = akono_player.get("id")
            p_name = akono_player.get("name")
            print(f"[EXACT PLAYER MATCH] Name: {p_name} | Sofascore ID: {p_id}")
            
            # Fetch last events
            driver.get(f"https://www.sofascore.com/api/v1/player/{p_id}/events/last/0")
            time.sleep(2)
            events_json = json.loads(driver.find_element("tag name", "body").text)
            
            out_file = Path(__file__).parent / "sofascore_cyrill_akono_real.json"
            out_file.write_text(json.dumps({
                "player": akono_player,
                "events": events_json.get("events", [])
            }, indent=2), encoding="utf-8")
            print(f"[SUCCESS] Saved real player events to: {out_file}")
        else:
            print("[INFO] Direct player search output:")
            print(json.dumps(search_json, indent=2)[:800])

    finally:
        driver.quit()

if __name__ == "__main__":
    main()
