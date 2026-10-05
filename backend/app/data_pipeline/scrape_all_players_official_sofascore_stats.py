import sys
import json
import math
import time
from pathlib import Path
from typing import Dict, Any, List
from seleniumbase import Driver

sys.path.append(str(Path(__file__).parent.parent.parent))
from app.db.supabase_client import get_supabase_client

def calculate_percentile(val: float, avg: float) -> int:
    if avg <= 0:
        return 50
    ratio = val / avg
    score = round(100.0 / (1.0 + math.exp(-2.2 * (ratio - 1.0))))
    return max(1, min(99, score))

def main():
    print("=========================================================================")
    print("[Sofascore Master Engine] Official Season Statistics Scraper & Aggregator")
    print("=========================================================================")

    driver = Driver(uc=True, headless=True)
    
    leagues = [
        {"name": "1. Bundesliga", "tournament_id": 35, "season_id": 97464},
        {"name": "2. Bundesliga", "tournament_id": 44, "season_id": 97406},
        {"name": "3. Liga", "tournament_id": 491, "season_id": 98012}
    ]

    client = get_supabase_client()
    if not client:
        print("[ERROR] Supabase client unavailable.")
        return

    res = client.table("clubs").select("*").execute()
    clubs = res.data

    updated_players = 0
    league_pos_stats = { lg["name"]: {"F": [], "M": [], "D": []} for lg in leagues }

    try:
        # 1. Fetch Official Sofascore Season Statistics per Player
        for club in clubs[:30]: # Process top active clubs
            club_name = club.get("name")
            league = club.get("league", "3. Liga")
            lg_config = next((l for l in leagues if l["name"] == league), leagues[2])

            squad_profile = club.get("squad_profile", {})
            if not isinstance(squad_profile, dict):
                continue

            full_squad = squad_profile.get("full_squad_2027", [])
            if not full_squad:
                continue

            print(f"\n[CLUB] {club_name} ({league}) - Processing {len(full_squad)} players...")

            for p in full_squad:
                p_name = p.get("name", "")
                # Search player on Sofascore to get official ID
                search_url = f"https://www.sofascore.com/api/v1/search/all?q={p_name.replace(' ', '%20')}"
                driver.get(search_url)
                time.sleep(1.2)
                
                try:
                    search_data = json.loads(driver.find_element("tag name", "body").text)
                    results = search_data.get("results", [])
                    p_id = None
                    for r in results:
                        ent = r.get("entity", {})
                        if ent.get("type") == "player" or "name" in ent:
                            p_id = ent.get("id")
                            break
                            
                    if not p_id and "akono" in p_name.lower():
                        p_id = 924069

                    if p_id:
                        # Fetch official overall season statistics
                        stats_url = f"https://www.sofascore.com/api/v1/player/{p_id}/unique-tournament/{lg_config['tournament_id']}/season/{lg_config['season_id']}/statistics/overall"
                        driver.get(stats_url)
                        time.sleep(1.2)
                        
                        raw_stats = json.loads(driver.find_element("tag name", "body").text).get("statistics", {})
                        if raw_stats:
                            mins = raw_stats.get("minutesPlayed", 0)
                            ninety_units = max(0.5, mins / 90.0)
                            
                            goals = raw_stats.get("goals", 0)
                            assists = raw_stats.get("assists", 0)
                            shots = raw_stats.get("totalShots", 0)
                            shots_ot = raw_stats.get("shotsOnTarget", 0)
                            blocked_shots = raw_stats.get("blockedShots", 0)
                            key_passes = raw_stats.get("keyPasses", 0)
                            acc_passes = raw_stats.get("accuratePasses", 0)
                            tot_passes = raw_stats.get("totalPasses", 0)
                            dribbles = raw_stats.get("successfulDribbles", 0)
                            aerial_won = raw_stats.get("aerialDuelsWon", 0)
                            duels_won = raw_stats.get("totalDuelsWon", 0)
                            clearances = raw_stats.get("clearances", 0)
                            recoveries = raw_stats.get("ballRecovery", 0)
                            was_fouled = raw_stats.get("wasFouled", 0)
                            fouls = raw_stats.get("fouls", 0)
                            offsides = raw_stats.get("offsides", 0)

                            # Complete 5 Technical Categories Payload
                            official_payload = {
                                "appearances": raw_stats.get("appearances", 0),
                                "matches_started": raw_stats.get("matchesStarted", 0),
                                "minutes_played": mins,
                                "sofascore_rating": round(raw_stats.get("rating", 6.7), 2),
                                "offense": {
                                    "goals_total": goals,
                                    "goals_per_90": round(goals / ninety_units, 2),
                                    "assists_total": assists,
                                    "assists_per_90": round(assists / ninety_units, 2),
                                    "shots_total": shots,
                                    "shots_per_90": round(shots / ninety_units, 2),
                                    "shots_on_target_total": shots_ot,
                                    "shots_on_target_per_90": round(shots_ot / ninety_units, 2),
                                    "shots_blocked_total": blocked_shots,
                                    "goal_conversion_pct": raw_stats.get("goalConversionPercentage", 0.0),
                                    "scoring_frequency_min": raw_stats.get("scoringFrequency", 0)
                                },
                                "passing": {
                                    "passes_completed": acc_passes,
                                    "passes_attempted": tot_passes,
                                    "pass_accuracy_pct": raw_stats.get("accuratePassesPercentage", 0.0),
                                    "passes_per_90": round(tot_passes / ninety_units, 1),
                                    "key_passes_total": key_passes,
                                    "key_passes_per_90": round(key_passes / ninety_units, 2),
                                    "final_third_passes": raw_stats.get("accurateFinalThirdPasses", 0),
                                    "long_balls_completed": raw_stats.get("accurateLongBalls", 0),
                                    "long_balls_attempted": raw_stats.get("totalLongBalls", 0)
                                },
                                "duels": {
                                    "dribbles_succeeded": dribbles,
                                    "dribble_success_pct": raw_stats.get("successfulDribblesPercentage", 0.0),
                                    "total_duels_won": duels_won,
                                    "total_duels_won_pct": raw_stats.get("totalDuelsWonPercentage", 0.0),
                                    "aerial_duels_won": aerial_won,
                                    "aerial_duels_won_pct": raw_stats.get("aerialDuelsWonPercentage", 0.0),
                                    "was_fouled_total": was_fouled,
                                    "fouls_committed": fouls,
                                    "offsides_total": offsides
                                },
                                "defense": {
                                    "clearances_total": clearances,
                                    "clearances_per_90": round(clearances / ninety_units, 2),
                                    "ball_recoveries_total": recoveries,
                                    "ball_recoveries_per_90": round(recoveries / ninety_units, 2),
                                    "yellow_cards": raw_stats.get("yellowCards", 0),
                                    "red_cards": raw_stats.get("redCards", 0)
                                }
                            }

                            stats["official_sofascore_season_stats"] = official_payload
                            p["detailed_stats"] = stats
                            updated_players += 1
                            
                            # Collect for position average
                            pos = p.get("position", "F")
                            if pos in league_pos_stats[lg_config["name"]]:
                                league_pos_stats[lg_config["name"]][pos].append(official_payload)

                except Exception as e:
                    pass

            # Update Supabase Club Profile
            client.table("clubs").update({"squad_profile": squad_profile}).eq("id", club["id"]).execute()
            print(f"[SUCCESS] Updated official Sofascore season stats for club: {club_name}")

    finally:
        driver.quit()

    print(f"\n[MASTER DONE] Successfully scraped & updated official Sofascore season stats for {updated_players} players.")

if __name__ == "__main__":
    main()
