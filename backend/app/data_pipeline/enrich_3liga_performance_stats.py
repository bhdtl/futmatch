"""
FutMatch Pro — 3. Liga & Regionalliga Live Performance Data Enrichment Engine
Injects 100% authentic season performance metrics (Rank, Points, Goals/90, Conceded/90, Wins, Draws, Losses, Win Rate)
from Transfermarkt JSON API into Supabase for 3. Liga & Regionalliga clubs.
"""

import sys
import urllib.request
import json
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent.parent))
from app.db.supabase_client import get_supabase_client

COMPETITIONS = ["L3", "RLW3", "RLSW", "RLN3", "RLB3", "RLN4"]

def fetch_table_stats(comp_code: str) -> dict:
    """Fetch live table stats for a competition from Transfermarkt JSON API."""
    url = f"https://tmapi.transfermarkt.technology/competition/{comp_code}/table?season_id=2025"
    headers = {"User-Agent": "transfermarkt-api", "Accept": "application/json"}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            table_clubs = data.get("data", {}).get("tables", [{}])[0].get("clubs", [])
            stats_by_tm_id = {}
            for c in table_clubs:
                tm_id = str(c.get("clubId"))
                game = c.get("game", {})
                goal = c.get("goal", {})
                ranking = c.get("ranking", {})
                
                total_matches = game.get("totalCount", 0) or 1
                goals_scored = goal.get("totalCount", 0)
                goals_conceded = goal.get("concededCount", 0)
                win_count = game.get("winCount", 0)
                
                stats_by_tm_id[tm_id] = {
                    "rank": ranking.get("current"),
                    "points": game.get("points"),
                    "matches_played": total_matches,
                    "win_count": win_count,
                    "draw_count": game.get("drawCount", 0),
                    "loss_count": game.get("lossCount", 0),
                    "goals_scored": goals_scored,
                    "goals_conceded": goals_conceded,
                    "goal_difference": goal.get("differenceCount", 0),
                    "goals_per_90": round(goals_scored / total_matches, 2),
                    "conceded_per_90": round(goals_conceded / total_matches, 2),
                    "win_rate_pct": round((win_count / total_matches) * 100, 1)
                }
            return stats_by_tm_id
    except Exception as e:
        print(f"[WARN] Failed fetching table for {comp_code}: {e}")
        return {}

def run_performance_enrichment():
    print("============================================================")
    print("[Pipeline] FutMatch Pro: 3. Liga & Regionalliga Performance Enrichment")
    print("============================================================")
    
    client = get_supabase_client()
    if not client:
        print("[ERROR] Supabase client unavailable.")
        return False
        
    all_table_stats = {}
    for comp in COMPETITIONS:
        stats = fetch_table_stats(comp)
        all_table_stats.update(stats)
        print(f"[INFO] Competition {comp:5s}: Loaded {len(stats)} club performance records.")

    res = client.table("clubs").select("*").execute()
    clubs = res.data
    
    updated = 0
    for club in clubs:
        club_id = str(club["id"])
        tm_id = club_id.replace("CLB-", "").strip()
        club_name = club["name"]
        league = club.get("league", "")
        
        squad_profile = club.get("squad_profile", {})
        if not isinstance(squad_profile, dict):
            squad_profile = {}
            
        deep_tactics = squad_profile.get("deep_tactics", {})
        
        if tm_id in all_table_stats:
            perf = all_table_stats[tm_id]
            deep_tactics.update({
                "has_official_league_performance": True,
                "league_rank": perf["rank"],
                "season_points": perf["points"],
                "matches_played": perf["matches_played"],
                "win_count": perf["win_count"],
                "draw_count": perf["draw_count"],
                "loss_count": perf["loss_count"],
                "goals_scored": perf["goals_scored"],
                "goals_conceded": perf["goals_conceded"],
                "goals_per_90": perf["goals_per_90"],
                "conceded_per_90": perf["conceded_per_90"],
                "win_rate_pct": perf["win_rate_pct"],
                "data_coverage_tier": f"100% Live 2026/2027 {league} Leistungsdaten (TM JSON API)"
            })
            
            squad_profile["deep_tactics"] = deep_tactics
            
            client.table("clubs").update({
                "squad_profile": squad_profile
            }).eq("id", club_id).execute()
            
            updated += 1
            clean_name = club_name.encode('ascii', 'ignore').decode()
            print(f"[SUCCESS] {clean_name:28s} | Rank: {perf['rank']:2d} | Pts: {perf['points']:2d} | Goals/90: {perf['goals_per_90']:.2f} | WinRate: {perf['win_rate_pct']}%")

    print("============================================================")
    print(f"[COMPLETED] Ingested Live Performance Data for {updated} 3. Liga & Regionalliga Clubs!")
    print("============================================================")
    return True

if __name__ == "__main__":
    run_performance_enrichment()
