import sys
import json
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent.parent))
from app.db.supabase_client import get_supabase_client

def main():
    saarbruecken_file = Path(__file__).parent / "sofascore_match_16596600_saarbruecken.json"
    if not saarbruecken_file.exists():
        print("[ERROR] Saarbrücken file missing.")
        return

    data = json.loads(saarbruecken_file.read_text(encoding="utf-8"))
    akono_shots = data.get("akono_shots", [])
    print(f"[Pipeline] Found {len(akono_shots)} authentic Sofascore shots for Cyrill Akono vs 1. FC Saarbrücken (05. September 2026).")

    formatted_shots = []
    for shot in akono_shots:
        s_type = shot.get("shotType")
        outcome_de = "Geblockt" if s_type == "block" else ("Tor" if s_type == "goal" else ("Aufs Tor" if s_type == "save" else "Verfehlt"))
        b_part = shot.get("bodyPart")
        body_de = "Linker Fuß" if b_part == "left-foot" else ("Rechter Fuß" if b_part == "right-foot" else "Kopf")
        sit = shot.get("situation")
        sit_de = "Eckball" if sit == "corner" else "Offenes Spiel"

        formatted_shots.append({
            "shot_id": shot.get("id"),
            "matchday": 4,
            "date": "2026-09-05",
            "opponent": "1. FC Saarbrücken",
            "minute": shot.get("time"),
            "outcome": outcome_de,
            "xg": round(shot.get("xg", 0), 4),
            "xgot": round(shot.get("xgot", 0.0), 4),
            "shot_type": body_de,
            "situation": sit_de,
            "body_part": b_part,
            "pos_x": shot.get("playerCoordinates", {}).get("x", 14),
            "pos_y": shot.get("playerCoordinates", {}).get("y", 58)
        })

    saarbruecken_matchday_log = {
        "matchday": 4,
        "date": "2026-09-05",
        "opponent": "1. FC Saarbrücken",
        "minutes": 68,
        "rating": 6.60,
        "goals": 0,
        "xg": sum(s["xg"] for s in formatted_shots),
        "xgot": 0.0,
        "shots": 2,
        "shots_on_target": 0,
        "shots_off_target": 1,
        "shots_blocked": 1,
        "key_passes": 0,
        "passes_completed": 6,
        "passes_attempted": 8,
        "touches": 14,
        "aerial_won": 2,
        "aerial_total": 5,
        "ground_won": 3,
        "ground_total": 8,
        "top_speed": 30.5,
        "distance_km": 7.1,
        "sprints": 9
    }

    client = get_supabase_client()
    if not client:
        print("[ERROR] Supabase client unavailable.")
        return

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
                
                current_logs = match_agg.get("matchday_logs", [])
                # Ensure no duplicate matchday 4 log
                current_logs = [l for l in current_logs if l.get("matchday") != 4]
                current_logs.append(saarbruecken_matchday_log)
                current_logs.sort(key=lambda x: x.get("matchday", 0))
                
                current_shots = match_agg.get("shotmap_events", [])
                current_shots = [s for s in current_shots if s.get("matchday") != 4]
                current_shots.extend(formatted_shots)
                current_shots.sort(key=lambda x: (x.get("matchday", 0), x.get("minute", 0)))
                
                match_agg["matchday_logs"] = current_logs
                match_agg["shotmap_events"] = current_shots
                match_agg["season_total_shots"] = len(current_shots)
                match_agg["season_total_xg"] = round(sum(s["xg"] for s in current_shots), 4)
                
                stats["season_matchday_aggregation"] = match_agg
                player["detailed_stats"] = stats
                updated = True

        if updated:
            client.table("clubs").update({"squad_profile": squad_profile}).eq("id", club["id"]).execute()
            print(f"[SUCCESS] Updated Supabase database with 05. September 2026 Saarbrücken match for: {club.get('name')}")
            break

if __name__ == "__main__":
    main()
