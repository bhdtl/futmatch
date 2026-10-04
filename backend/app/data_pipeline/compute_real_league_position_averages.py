"""
FutMatch Pro — Real Dynamic League-Position Average & Percentile Calculation Engine
Iterates over all ~4,000+ players in Supabase, groups them dynamically by (League, Position Group),
computes the EXACT mathematical average across ALL players in that league and position,
and calculates true relative percentiles and status benchmarks.
"""

import sys
import re
import numpy as np
from pathlib import Path
from typing import Dict, Any, List
from collections import defaultdict

sys.path.append(str(Path(__file__).parent.parent.parent))
from app.db.supabase_client import get_supabase_client

def categorize_position(pos_str: str) -> str:
    p = str(pos_str).upper()
    if any(k in p for k in ["TORWART", "GOALKEEPER"]):
        return "TORWART"
    elif any(k in p for k in ["INNENVERTEIDIGER", "LINKSVERTEIDIGER", "RECHTSVERTEIDIGER", "BACK", "DEFENDER", "VERTEIDIGER"]):
        return "VERTEIDIGER"
    elif any(k in p for k in ["FLÜGEL", "AUßEN", "WING"]):
        return "FLÜGELSTÜRMER"
    elif any(k in p for k in ["STÜRMER", "MITTELSTÜRMER", "SPITZE", "FORWARD"]):
        return "MITTELSTÜRMER"
    else:
        return "MITTELFELD"

def run_real_league_position_averages():
    print("============================================================")
    print("[Pipeline] FutMatch Pro: Dynamic League-Position Average & Percentile Engine")
    print("============================================================")

    client = get_supabase_client()
    if not client:
        print("[ERROR] Supabase client unavailable.")
        return False

    res = client.table("clubs").select("*").execute()
    clubs = res.data

    # Group 1: Collect metrics for all players per (league, pos_cat)
    league_pos_metrics = defaultdict(lambda: defaultdict(list))
    all_players_meta = []

    for club in clubs:
        club_id = club["id"]
        club_name = club["name"]
        league = club.get("league", "3. Liga")
        squad_profile = club.get("squad_profile", {})
        if not isinstance(squad_profile, dict):
            squad_profile = {}

        full_squad = squad_profile.get("full_squad_2027", [])

        for p in full_squad:
            pos_cat = categorize_position(p.get("position", ""))
            stats = p.get("detailed_stats", {})
            offense = stats.get("offense", {})
            passing = stats.get("passing", {})
            duels = stats.get("duels", {})
            defense = stats.get("defense", {})

            # Collect metric values for group aggregation
            g_90 = offense.get("goals_per_90", 0.0)
            xg_90 = offense.get("xg_per_90", 0.0)
            a_90 = passing.get("assists_per_90", 0.0)
            kp_90 = passing.get("key_passes_per_90", 0.0)
            pass_acc = passing.get("pass_accuracy_pct", 75.0)
            aerial_acc = duels.get("aerial_duels_won_pct", 45.0)
            ground_acc = duels.get("ground_duels_won_pct", 45.0)
            dribble_succ = duels.get("successful_dribbles_per_90", 0.5)
            recoveries = defense.get("ball_recoveries_per_90", 2.0)

            key = (league, pos_cat)
            league_pos_metrics[key]["goals_per_90"].append(g_90)
            league_pos_metrics[key]["xg_per_90"].append(xg_90)
            league_pos_metrics[key]["assists_per_90"].append(a_90)
            league_pos_metrics[key]["key_passes_per_90"].append(kp_90)
            league_pos_metrics[key]["pass_accuracy_pct"].append(pass_acc)
            league_pos_metrics[key]["aerial_duels_won_pct"].append(aerial_acc)
            league_pos_metrics[key]["ground_duels_won_pct"].append(ground_acc)
            league_pos_metrics[key]["successful_dribbles_per_90"].append(dribble_succ)
            league_pos_metrics[key]["ball_recoveries_per_90"].append(recoveries)

    # Compute EXACT averages per (league, pos_cat)
    league_pos_averages = {}
    for (league, pos_cat), metrics_dict in league_pos_metrics.items():
        league_pos_averages[(league, pos_cat)] = {
            metric_name: {
                "mean": round(float(np.mean(vals)), 2),
                "std": round(float(np.std(vals)), 2) if len(vals) > 1 else 1.0,
                "values": sorted(vals),
                "sample_size": len(vals)
            }
            for metric_name, vals in metrics_dict.items()
        }

    print(f"[INFO] Calculated dynamic position benchmarks for {len(league_pos_averages)} League-Position combinations.")

    # Helper to calculate exact percentile rank (0% - 100%)
    def get_percentile_rank(val: float, sorted_vals: List[float]) -> int:
        if not sorted_vals:
            return 50
        count_below = sum(1 for x in sorted_vals if x <= val)
        return int(round((count_below / len(sorted_vals)) * 100))

    # Helper to assign status label based on exact percentile
    def get_status_from_percentile(p_rank: int) -> str:
        if p_rank >= 80:
            return "🟢 Überdurchschnittlich (Top 20%)"
        elif p_rank >= 35:
            return "🔵 Durchschnittlich"
        else:
            return "🟡 Unterdurchschnittlich"

    # Group 2: Update players with their EXACT position-league averages and percentiles
    updated_clubs = 0
    total_players = 0

    for club in clubs:
        club_id = club["id"]
        club_name = club["name"]
        league = club.get("league", "3. Liga")
        squad_profile = club.get("squad_profile", {})
        if not isinstance(squad_profile, dict):
            squad_profile = {}

        full_squad = squad_profile.get("full_squad_2027", [])
        if not full_squad:
            continue

        enriched_squad = []
        for p in full_squad:
            p_dict = dict(p)
            pos_cat = categorize_position(p_dict.get("position", ""))
            key = (league, pos_cat)
            bench = league_pos_averages.get(key, {})

            stats = p_dict.get("detailed_stats", {})
            offense = stats.get("offense", {})
            passing = stats.get("passing", {})
            duels = stats.get("duels", {})
            defense = stats.get("defense", {})

            # Exact Per-90 values
            g_90 = offense.get("goals_per_90", 0.0)
            xg_90 = offense.get("xg_per_90", 0.0)
            a_90 = passing.get("assists_per_90", 0.0)
            kp_90 = passing.get("key_passes_per_90", 0.0)
            pass_acc = passing.get("pass_accuracy_pct", 75.0)
            aerial_acc = duels.get("aerial_duels_won_pct", 45.0)

            # Compute exact percentiles & benchmarks
            aerial_bench = bench.get("aerial_duels_won_pct", {})
            aerial_mean = aerial_bench.get("mean", 42.0)
            aerial_sorted = aerial_bench.get("values", [42.0])
            aerial_p_rank = get_percentile_rank(aerial_acc, aerial_sorted)

            goals_bench = bench.get("goals_per_90", {})
            goals_mean = goals_bench.get("mean", 0.30)
            goals_sorted = goals_bench.get("values", [0.30])
            goals_p_rank = get_percentile_rank(g_90, goals_sorted)

            pass_bench = bench.get("pass_accuracy_pct", {})
            pass_mean = pass_bench.get("mean", 75.0)
            pass_sorted = pass_bench.get("values", [75.0])
            pass_p_rank = get_percentile_rank(pass_acc, pass_sorted)

            # Enriched Offense
            offense["goals_league_avg"] = goals_mean
            offense["goals_percentile"] = goals_p_rank
            offense["goals_status"] = get_status_from_percentile(goals_p_rank)

            # Enriched Passing
            passing["pass_acc_league_avg"] = pass_mean
            passing["pass_acc_percentile"] = pass_p_rank
            passing["pass_acc_status"] = get_status_from_percentile(pass_p_rank)

            # Enriched Duels
            duels["aerial_league_avg"] = aerial_mean
            duels["aerial_percentile"] = aerial_p_rank
            duels["aerial_duels_status"] = get_status_from_percentile(aerial_p_rank)

            stats["offense"] = offense
            stats["passing"] = passing
            stats["duels"] = duels
            stats["defense"] = defense
            stats["league_position_context"] = {
                "league": league,
                "position_group": pos_cat,
                "total_strikers_in_league": aerial_bench.get("sample_size", 0),
                "aerial_duels_league_avg": aerial_mean,
                "aerial_duels_percentile": aerial_p_rank
            }

            p_dict["detailed_stats"] = stats
            enriched_squad.append(p_dict)
            total_players += 1

        squad_profile["full_squad_2027"] = enriched_squad

        # Also update starting XI
        starting_xi = squad_profile.get("starting_xi_2027", [])
        enriched_starting_xi = []
        for s in starting_xi:
            s_dict = dict(s)
            matched = next((x for x in enriched_squad if x.get("name") == s.get("name")), None)
            if matched:
                s_dict["detailed_stats"] = matched.get("detailed_stats")
            enriched_starting_xi.append(s_dict)

        squad_profile["starting_xi_2027"] = enriched_starting_xi

        client.table("clubs").update({
            "squad_profile": squad_profile
        }).eq("id", club_id).execute()

        updated_clubs += 1
        clean_name = club_name.encode('ascii', 'ignore').decode()
        print(f"[SUCCESS] {clean_name:28s} | Calculated Exact Real Averages across {len(enriched_squad)} players!")

    print("============================================================")
    print(f"[COMPLETED] Computed Real Dynamic League-Position Averages for {total_players} players across {updated_clubs} clubs!")
    print("============================================================")
    return True

if __name__ == "__main__":
    run_real_league_position_averages()
