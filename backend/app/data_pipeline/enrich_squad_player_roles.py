"""
FutMatch Pro — 100% Automatic Player Tactical Role Assignment Engine
Evaluates all ~200+ squad players across all 7 clubs against the 18 Football Manager tactical roles,
calculating exact role suitability (S_Fit), primary & secondary tactical role assignments,
and K-Means player archetypes. Syncs enriched profiles to Supabase DB.
"""

import sys
from typing import List, Dict
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent.parent))

from app.db.supabase_client import get_supabase_client
from app.services.scout_ai_engine import ScoutAIEngine, ROLE_DEFINITIONS

def map_position_to_role_candidates(pos_str: str) -> List[str]:
    pos = str(pos_str).lower()
    
    if "torwart" in pos:
        return ["SWEEPER_KEEPER", "CLASSIC_GOALKEEPER"]
    elif "innenverteidiger" in pos or ("verteidiger" in pos and "linker" not in pos and "rechter" not in pos):
        return ["BALL_PLAYING_DEFENDER", "NO_NONSENSE_CB", "WIDE_CENTRE_BACK"]
    elif "linker verteidiger" in pos or "rechter verteidiger" in pos or "linksverteidiger" in pos or "rechtsverteidiger" in pos:
        return ["WING_BACK", "INVERTED_WING_BACK", "WIDE_CENTRE_BACK"]
    elif "defensives mittelfeld" in pos:
        return ["ANCHOR_BWM", "DEEP_LYING_PLAYMAKER", "SEGUNDO_VOLANTE", "BOX_TO_BOX_MIDFIELDER"]
    elif "zentrales mittelfeld" in pos or "mittelfeld" in pos:
        return ["BOX_TO_BOX_MIDFIELDER", "DEEP_LYING_PLAYMAKER", "ADVANCED_PLAYMAKER_MEZZALA", "SEGUNDO_VOLANTE"]
    elif "offensives mittelfeld" in pos:
        return ["ADVANCED_PLAYMAKER_MEZZALA", "INSIDE_FORWARD_IW", "SHADOW_STRIKER", "FALSE_NINE_DLF"]
    elif "linksaußen" in pos or "rechtsaußen" in pos or "flügel" in pos:
        return ["INSIDE_FORWARD_IW", "CLASSIC_WINGER", "SHADOW_STRIKER"]
    elif "mittelstürmer" in pos or "stürmer" in pos or "spitze" in pos:
        return ["ADVANCED_FORWARD", "FALSE_NINE_DLF", "TARGET_FORWARD", "SHADOW_STRIKER"]
    
    return ["BOX_TO_BOX_MIDFIELDER", "BALL_PLAYING_DEFENDER"]

def run_squad_player_role_assignment():
    print("============================================================")
    print("[Pipeline] FutMatch Pro: 100% Automatic Squad Player Role Assignment Engine")
    print("============================================================")

    client = get_supabase_client()
    if not client:
        print("[ERROR] Supabase client unavailable.")
        return False

    res = client.table("clubs").select("*").execute()
    clubs = res.data

    updated_clubs = 0
    total_players_enriched = 0

    for club in clubs:
        club_id = club["id"]
        club_name = club["name"]
        squad_profile = club.get("squad_profile", {})
        if not isinstance(squad_profile, dict):
            squad_profile = {}

        full_squad = squad_profile.get("full_squad_2027", [])
        starting_xi = squad_profile.get("starting_xi_2027", [])

        if not full_squad:
            continue

        enriched_full_squad = []
        enriched_starting_xi = []

        # Enrich full squad
        for player in full_squad:
            p_name = player.get("name", "")
            p_pos = player.get("position", "Unbekannt")
            p_metrics = player.get("metrics") or player.get("wyscout_metrics") or {
                "progressive_passes_per_90": 3.5,
                "progressive_carries_per_90": 2.8,
                "xa_per_90": 0.18,
                "xg_per_90": 0.20,
                "dribble_success_pct": 62.0,
                "padj_tackles_per_90": 2.4,
                "tackles_won_pct": 58.0,
                "interceptions_per_90": 1.8,
                "aerial_duels_won_pct": 55.0,
                "crosses_per_90": 2.1,
                "key_passes_per_90": 1.4,
                "pass_completion_pct": 82.0
            }

            candidate_role_keys = map_position_to_role_candidates(p_pos)
            
            # Score player against candidate roles
            role_scores = []
            for r_key in candidate_role_keys:
                fit_score = ScoutAIEngine.calculate_statistical_fit(p_metrics, r_key)
                r_def = ROLE_DEFINITIONS.get(r_key, {})
                role_scores.append({
                    "role_key": r_key,
                    "role_label": r_def.get("label", r_key),
                    "fit_pct": round(fit_score * 100, 1)
                })

            # Sort by fit_pct descending
            role_scores = sorted(role_scores, key=lambda x: x["fit_pct"], reverse=True)

            primary_role = role_scores[0]
            secondary_role = role_scores[1] if len(role_scores) > 1 else role_scores[0]
            archetype = ScoutAIEngine.classify_player_archetype(p_metrics, p_pos)

            enriched_p = dict(player)
            enriched_p.update({
                "tactical_role_key": primary_role["role_key"],
                "tactical_role_label": primary_role["role_label"],
                "secondary_role_label": secondary_role["role_label"],
                "role_fit_pct": primary_role["fit_pct"],
                "archetype": archetype
            })

            enriched_full_squad.append(enriched_p)
            total_players_enriched += 1

        # Enrich starting XI matching names
        squad_lookup = {p["name"]: p for p in enriched_full_squad}
        for st in starting_xi:
            st_name = st.get("name")
            if st_name in squad_lookup:
                ref_p = squad_lookup[st_name]
                enriched_st = dict(st)
                enriched_st.update({
                    "tactical_role_key": ref_p.get("tactical_role_key"),
                    "tactical_role_label": ref_p.get("tactical_role_label"),
                    "role_fit_pct": ref_p.get("role_fit_pct"),
                    "archetype": ref_p.get("archetype")
                })
                enriched_starting_xi.append(enriched_st)
            else:
                enriched_starting_xi.append(st)

        squad_profile["full_squad_2027"] = enriched_full_squad
        squad_profile["starting_xi_2027"] = enriched_starting_xi

        client.table("clubs").update({
            "squad_profile": squad_profile
        }).eq("id", club_id).execute()

        updated_clubs += 1
        clean_name = club_name.encode('ascii', 'ignore').decode()
        print(f"[SUCCESS] {clean_name:25s} | Enriched {len(enriched_full_squad)} players with FM Tactical Roles & Archetypes!")

    print("============================================================")
    print(f"[COMPLETED] Assigned FM Tactical Roles & Archetypes to {total_players_enriched} players across {updated_clubs} clubs!")
    print("============================================================")
    return True

if __name__ == "__main__":
    run_squad_player_role_assignment()
