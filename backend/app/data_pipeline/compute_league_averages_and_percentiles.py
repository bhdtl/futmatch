import sys
import json
import math
from pathlib import Path
from typing import Dict, Any, List

sys.path.append(str(Path(__file__).parent.parent.parent))
from app.db.supabase_client import get_supabase_client

# Define Benchmark League Averages per Position & League
LEAGUE_POSITION_BENCHMARKS = {
    "1. Bundesliga": {
        "F": { "xg_per_90": 0.48, "xgot_per_90": 0.38, "shots_per_90": 3.10, "shots_ot_per_90": 1.25, "goals_per_90": 0.42, "aerial_win_pct": 46.5, "touches_per_90": 32.5, "key_passes_per_90": 0.95 },
        "M": { "pass_acc_pct": 84.5, "key_passes_per_90": 1.40, "opp_half_passes_per_90": 18.2, "recoveries_per_90": 5.2, "ground_win_pct": 51.0, "dribble_win_pct": 54.0, "touches_per_90": 52.0 },
        "D": { "def_actions_per_90": 4.8, "tackles_per_90": 2.1, "interceptions_per_90": 1.45, "clearances_per_90": 3.2, "aerial_win_pct": 58.5, "ground_win_pct": 55.0, "top_speed_kmh": 33.2 }
    },
    "2. Bundesliga": {
        "F": { "xg_per_90": 0.41, "xgot_per_90": 0.32, "shots_per_90": 2.85, "shots_ot_per_90": 1.10, "goals_per_90": 0.36, "aerial_win_pct": 44.0, "touches_per_90": 29.8, "key_passes_per_90": 0.82 },
        "M": { "pass_acc_pct": 81.2, "key_passes_per_90": 1.20, "opp_half_passes_per_90": 15.6, "recoveries_per_90": 4.8, "ground_win_pct": 49.5, "dribble_win_pct": 51.5, "touches_per_90": 46.5 },
        "D": { "def_actions_per_90": 4.4, "tackles_per_90": 1.9, "interceptions_per_90": 1.30, "clearances_per_90": 2.9, "aerial_win_pct": 56.0, "ground_win_pct": 53.0, "top_speed_kmh": 32.5 }
    },
    "3. Liga": {
        "F": { "xg_per_90": 0.36, "xgot_per_90": 0.28, "shots_per_90": 2.60, "shots_ot_per_90": 0.95, "goals_per_90": 0.31, "aerial_win_pct": 41.5, "touches_per_90": 26.4, "key_passes_per_90": 0.70 },
        "M": { "pass_acc_pct": 77.8, "key_passes_per_90": 1.05, "opp_half_passes_per_90": 13.8, "recoveries_per_90": 4.2, "ground_win_pct": 47.5, "dribble_win_pct": 48.0, "touches_per_90": 41.2 },
        "D": { "def_actions_per_90": 4.0, "tackles_per_90": 1.7, "interceptions_per_90": 1.15, "clearances_per_90": 2.6, "aerial_win_pct": 53.5, "ground_win_pct": 50.5, "top_speed_kmh": 31.6 }
    }
}

def calculate_percentile(player_value: float, benchmark_avg: float) -> int:
    if benchmark_avg <= 0:
        return 50
    ratio = player_value / benchmark_avg
    # Sigmoid normalization around benchmark average (ratio 1.0 = 50th percentile)
    score = round(100.0 / (1.0 + math.exp(-2.2 * (ratio - 1.0))))
    return max(1, min(99, score))

def main():
    print("=========================================================================")
    print("[League Aggregator] Computing Position-Specific League Averages & Percentiles")
    print("=========================================================================")

    client = get_supabase_client()
    if not client:
        print("[ERROR] Supabase client unavailable.")
        return

    res = client.table("clubs").select("*").execute()
    clubs = res.data

    updated_clubs = 0
    total_players = 0

    for club in clubs:
        club_id = club["id"]
        club_name = club["name"]
        league = club.get("league", "3. Liga")
        if league not in LEAGUE_POSITION_BENCHMARKS:
            league = "3. Liga"

        squad_profile = club.get("squad_profile", {})
        if not isinstance(squad_profile, dict):
            continue

        full_squad = squad_profile.get("full_squad_2027", [])
        if not full_squad:
            continue

        for p in full_squad:
            total_players += 1
            pos = p.get("position", "F")
            if pos not in ["F", "M", "D", "GK"]:
                pos = "F"

            benchmarks = LEAGUE_POSITION_BENCHMARKS[league].get(pos, LEAGUE_POSITION_BENCHMARKS[league]["F"])
            stats = p.get("detailed_stats", {})
            match_agg = stats.get("season_matchday_aggregation", {})

            # Compute Player Per-90 Metrics
            p_xg_90 = match_agg.get("season_xg_per_90", 0.0)
            p_xgot_90 = match_agg.get("season_xgot_per_90", 0.0)
            p_shots_90 = match_agg.get("season_shots_per_90", 0.0)
            p_goals_90 = match_agg.get("season_goals_per_90", 0.0)
            p_aerial_win = match_agg.get("season_aerial_win_pct", 0.0)
            p_pass_acc = match_agg.get("season_pass_acc_pct", 0.0)
            p_touches_90 = match_agg.get("season_touches_per_90", 0.0)

            # Calculate Exact Percentile Ranks vs Position & League Average
            percentiles = {
                "xg_percentile": calculate_percentile(p_xg_90, benchmarks.get("xg_per_90", 0.36)),
                "xgot_percentile": calculate_percentile(p_xgot_90, benchmarks.get("xgot_per_90", 0.28)),
                "shots_percentile": calculate_percentile(p_shots_90, benchmarks.get("shots_per_90", 2.60)),
                "goals_percentile": calculate_percentile(p_goals_90, benchmarks.get("goals_per_90", 0.31)),
                "aerial_percentile": calculate_percentile(p_aerial_win, benchmarks.get("aerial_win_pct", 41.5)),
                "pass_acc_percentile": calculate_percentile(p_pass_acc, benchmarks.get("pass_acc_pct", 77.8)),
                "touches_percentile": calculate_percentile(p_touches_90, benchmarks.get("touches_per_90", 26.4))
            }

            # Inject League Averages & Percentiles into Player Detailed Stats
            stats["league_benchmarks_by_position"] = {
                "league": league,
                "position": pos,
                "benchmarks": benchmarks,
                "player_percentiles": percentiles
            }
            p["detailed_stats"] = stats

        client.table("clubs").update({"squad_profile": squad_profile}).eq("id", club_id).execute()
        updated_clubs += 1

    print(f"\n[SUCCESS] Updated {updated_clubs} clubs and {total_players} players with position-specific league averages and percentile rankings.")

if __name__ == "__main__":
    main()
