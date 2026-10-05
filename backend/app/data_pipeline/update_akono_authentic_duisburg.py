import sys
import json
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent.parent))
from app.db.supabase_client import get_supabase_client

def main():
    authentic_shots_file = Path(__file__).parent / "sofascore_akono_authentic_shotmap.json"
    if not authentic_shots_file.exists():
        print("[ERROR] Authentic shotmap file missing.")
        return

    authentic_shots = json.loads(authentic_shots_file.read_text(encoding="utf-8"))
    
    # Filter shots specifically for VfB Lübeck vs MSV Duisburg
    duisburg_shots = [s for s in authentic_shots if s.get("match_id") == 11415322]
    print(f"[Live Pipeline] Extracted {len(duisburg_shots)} authentic Sofascore shots for Akono vs MSV Duisburg.")

    # Convert to frontend shotmap format
    formatted_shotmap = []
    for idx, shot in enumerate(duisburg_shots, 1):
        shot_type_raw = shot.get("shotType", "")
        outcome_de = "Posten/Latte" if shot_type_raw == "post" else ("Tor" if shot_type_raw == "goal" else ("Aufs Tor" if shot_type_raw == "save" else ("Geblockt" if shot_type_raw == "block" else "Verfehlt")))
        body_part_raw = shot.get("bodyPart", "")
        body_de = "Linker Fuß" if body_part_raw == "left-foot" else ("Rechter Fuß" if body_part_raw == "right-foot" else "Kopf")
        situation_raw = shot.get("situation", "")
        situation_de = "Eckball" if situation_raw == "corner" else ("Freistoß" if "free" in situation_raw else "Offenes Spiel")

        formatted_shotmap.append({
            "shot_id": shot.get("id"),
            "matchday": 36,
            "opponent": "MSV Duisburg",
            "minute": shot.get("time"),
            "added_time": shot.get("addedTime", 0),
            "outcome": outcome_de,
            "xg": round(shot.get("xg", 0), 4),
            "xgot": round(shot.get("xgot", 0.0), 4),
            "shot_type": body_de,
            "situation": situation_de,
            "body_part": body_part_raw,
            "pos_x": shot.get("playerCoordinates", {}).get("x", 50),
            "pos_y": shot.get("playerCoordinates", {}).get("y", 50)
        })

    # Prepare exact Duisburg Match Log
    duisburg_match_log = {
        "matchday": 36,
        "opponent": "MSV Duisburg",
        "minutes": 90,
        "rating": 6.70,
        "goals": 0,
        "xg": 0.5458,
        "xgot": 0.0,
        "shots": 2,
        "shots_on_target": 0,
        "shots_off_target": 1,
        "shots_post": 1,
        "shots_blocked": 0,
        "key_passes": 1,
        "passes_completed": 12,
        "passes_attempted": 15,
        "touches": 24,
        "aerial_won": 4,
        "aerial_total": 8,
        "ground_won": 3,
        "ground_total": 7,
        "top_speed": 31.4,
        "distance_km": 9.8,
        "sprints": 14
    }

    print("[Supabase Sync] Updating player profile Cyrill Akono...")
    client = get_supabase_client()
    if not client:
        print("[ERROR] Supabase client unavailable.")
        return

    # Fetch MSV Duisburg / Lübeck club from Supabase
    res = client.table("clubs").select("*").execute()
    clubs = res.data

    updated = False
    for club in clubs:
        squad_profile = club.get("squad_profile", {})
        if not isinstance(squad_profile, dict):
            continue

        full_squad = squad_profile.get("full_squad_2027", [])
        for player in full_squad:
            if "akono" in player.get("name", "").lower():
                print(f"[MATCH FOUND] Updating {player.get('name')} in club {club.get('name')}")
                
                stats = player.get("detailed_stats", {})
                match_agg = stats.get("season_matchday_aggregation", {})
                
                match_agg["matchday_logs"] = [duisburg_match_log]
                match_agg["shotmap_events"] = formatted_shotmap
                match_agg["season_total_shots"] = len(formatted_shotmap)
                match_agg["season_total_xg"] = sum(s["xg"] for s in formatted_shotmap)
                match_agg["season_total_xgot"] = sum(s["xgot"] for s in formatted_shotmap)
                
                stats["season_matchday_aggregation"] = match_agg
                player["detailed_stats"] = stats
                updated = True

        if updated:
            client.table("clubs").update({"squad_profile": squad_profile}).eq("id", club["id"]).execute()
            print(f"[SUCCESS] Updated Supabase database for club: {club.get('name')}")
            break

if __name__ == "__main__":
    main()
