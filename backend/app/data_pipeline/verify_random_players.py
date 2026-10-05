import sys
import json
import random
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent.parent))
from app.db.supabase_client import get_supabase_client

def main():
    client = get_supabase_client()
    if not client:
        print("[ERROR] Supabase client unavailable.")
        return

    # Select 10 clubs across 1. Bundesliga, 2. Bundesliga, 3. Liga
    res = client.table("clubs").select("id, name, league, squad_profile").limit(10).execute()
    clubs = res.data or []

    print("=========================================================================")
    print("[Verification Test] Inspecting Random Live Supabase Player Profiles")
    print("=========================================================================")

    checked_players = 0
    for club in clubs:
        c_name = club.get("name")
        league = club.get("league")
        squad = club.get("squad_profile", {}).get("full_squad_2027", [])
        if not squad:
            continue

        player = random.choice(squad)
        p_name = player.get("name")
        pos = player.get("position", "F")
        detailed = player.get("detailed_stats", {})
        sample = detailed.get("sample", {})
        offense = detailed.get("offense", {})
        match_agg = detailed.get("season_matchday_aggregation", {})
        logs = match_agg.get("matchday_logs", [])

        print(f"\n[PLAYER #{checked_players + 1}] {p_name} ({c_name} | {league} | Position: {pos})")
        print(f"   - Captured Match Logs: {len(logs)} games")
        print(f"   - Total Minutes: {sample.get('total_minutes', 0)} min")
        print(f"   - Calculated Goals/90: {offense.get('goals_per_90', 0.0)} (Pos League Avg: {offense.get('goals_league_avg', 0.0)})")
        print(f"   - Calculated xG/90: {offense.get('xg_per_90', 0.0)} (Pos League Avg: {offense.get('xg_league_avg', 0.0)})")
        print(f"   - Calculated Shots/90: {offense.get('shots_per_90', 0.0)} (Pos League Avg: {offense.get('shots_league_avg', 0.0)})")
        checked_players += 1
        if checked_players >= 5:
            break

if __name__ == "__main__":
    main()
