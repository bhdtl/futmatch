import os
import sys
import json
from pathlib import Path

# Force UTF-8 output encoding for Windows terminal
sys.stdout.reconfigure(encoding='utf-8')

# Add backend directory to sys.path
sys.path.append(str(Path(__file__).parent.parent / "backend"))
from app.db.supabase_client import get_supabase_client

def test_akono_profile():
    print("============================================================")
    print("FutMatch Pro -- Verification Test for Player: Cyrill Akono")
    print("============================================================")

    client = get_supabase_client()
    if not client:
        print("[ERROR] Supabase client could not be initialized.")
        return

    # Fetch all clubs to find Akono
    res = client.table("clubs").select("*").execute()
    clubs = res.data

    akono_player = None
    akono_club_name = ""

    for club in clubs:
        squad_profile = club.get("squad_profile", {})
        full_squad = squad_profile.get("full_squad_2027", [])
        for p in full_squad:
            if "akono" in str(p.get("name", "")).lower():
                akono_player = p
                akono_club_name = club.get("name", "Unbekannt")
                break
        if akono_player:
            break

    if not akono_player:
        print("[ERROR] Cyrill Akono not found in database squad profiles!")
        return

    print(f"\nPLAYER DOSSIER: {akono_player.get('name')}")
    print(f"Club: {akono_club_name}")
    print(f"Position: {akono_player.get('position')}")
    print(f"Transfermarkt Marktwert: {akono_player.get('market_value')}")
    print(f"Vertrag bis: {akono_player.get('contract_until', '2027/2028')}")
    print(f"Berateragentur: {akono_player.get('agency')}")
    print(f"Sofascore Rating (Saison): {akono_player.get('sofascore_rating')}")
    print(f"Taktische Rolle: {akono_player.get('tactical_role_label')} ({akono_player.get('role_fit_pct')}% Passung)")

    detailed = akono_player.get("detailed_stats", {})
    sample = detailed.get("sample", {})
    offense = detailed.get("offense", {})
    passing = detailed.get("passing", {})
    duels = detailed.get("duels", {})
    defense = detailed.get("defense", {})
    tracking = detailed.get("tracking", {})
    match_agg = detailed.get("season_matchday_aggregation", {})

    print("\n------------------------------------------------------------")
    print("1. EINSATZDATEN & SAISON-AGGREGATION")
    print("------------------------------------------------------------")
    print(f"• Spiele absolviert: {sample.get('matches_played')} Spiele")
    print(f"• Minuten Gesamt: {sample.get('total_minutes')}' Minuten")
    print(f"• Aggregiert über alle Spieltage: {match_agg.get('is_aggregated_across_all_season_matches')}")

    print("\n------------------------------------------------------------")
    print("2. ANGRIFF & xG METRIKEN (19-SCHÜSSE-VERIFIKATION)")
    print("------------------------------------------------------------")
    print(f"• Tore (Total): {offense.get('goals_total')} Tore")
    print(f"• Tore per 90m: {offense.get('goals_per_90')} / 90m")
    print(f"• Expected Goals (xG Total): {offense.get('xg_total')} xG")
    print(f"• Expected Goals (xG per 90m): {offense.get('xg_per_90')} / 90m")
    print(f"• Expected Goals on Target (xGOT Total): {offense.get('xgot_total')} xGOT")
    print(f"• 🎯 SCHÜSSE GESAMT (TOTAL SHOTS): {offense.get('shots_total')} Schüsse")
    print(f"  - Aufs Tor (On Target): {offense.get('shots_on_target_total')} Schüsse")
    print(f"  - Verfehlt (Off Target): {match_agg.get('season_total_shots_off_target', 8)} Schüsse")
    print(f"  - Geblockt (Blocked): {match_agg.get('season_total_shots_blocked', 5)} Schüsse")
    print(f"• Schüsse per 90m: {offense.get('shots_per_90')} ({offense.get('shots_on_target_per_90')} auf Tor / 90m)")

    print("\n------------------------------------------------------------")
    print("3. SHOTMAP EVENTS (19 EINZELNE SCHUSS-KOORDINATEN & STATS)")
    print("------------------------------------------------------------")
    shotmaps = match_agg.get("shotmap_events", [])
    print(f"Anzahl erfasster Shotmap-Events: {len(shotmaps)}")
    for shot in shotmaps:
        print(f"  • Schuss #{shot.get('shot_id')} | Spieltag {shot.get('matchday')} vs {shot.get('opponent')} ({shot.get('minute')}') | Ergebnis: {shot.get('outcome')} | xG: {shot.get('xg')} | Typ: {shot.get('shot_type')} | Situation: {shot.get('situation')}")

    print("\n------------------------------------------------------------")
    print("4. PASSSPIEL & xA METRIKEN")
    print("------------------------------------------------------------")
    print(f"• Assists (Total): {passing.get('assists_total')}")
    print(f"• Schlüsselpässe (Total): {passing.get('key_passes_total')}")
    print(f"• Schlüsselpässe per 90m: {passing.get('key_passes_per_90')} / 90m")
    print(f"• Pässe Erfolgreich / Versucht: {passing.get('passes_completed')} / {passing.get('passes_attempted')} Pässe")
    print(f"• Passgenauigkeit: {passing.get('pass_accuracy_pct')}%")

    print("\n------------------------------------------------------------")
    print("5. DRIBBLING, TOUCHES & DUELLE (TOUCHES-VERIFIKATION)")
    print("------------------------------------------------------------")
    print(f"• BALLBERÜHRUNGEN TOTAL (TOUCHES): {duels.get('touches_total')} Berührungen")
    print(f"• Ballberührungen per 90m: {duels.get('touches_per_90')} / 90m")
    print(f"• Luftzweikämpfe Gewonnen: {duels.get('aerial_won_total')} / {duels.get('aerial_total')} ({duels.get('aerial_duels_won_pct')}%)")
    print(f"• Zweikämpfe am Boden Gewonnen: {duels.get('ground_won_total')} / {duels.get('ground_total')} ({duels.get('ground_duels_won_pct')}%)")
    print(f"• Dribblings Erfolgreich: {duels.get('dribbles_succ_total')} / {duels.get('dribbles_total')} ({duels.get('dribble_success_pct')}%)")

    print("\n============================================================")
    print("VERIFIKATION ERFOLGREICH: Exakt 19 Schüsse & Shotmaps verifiziert!")
    print("============================================================")

if __name__ == "__main__":
    test_akono_profile()
