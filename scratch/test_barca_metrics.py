import soccerdata as sd
import pandas as pd

print("[Barca Analytics] Testing FBref detailed stat types...")
fbref = sd.FBref(leagues=["GER-Bundesliga"], seasons=["2024-2025"])

try:
    print("Fetching 'passing' stats...")
    df_pass = fbref.read_team_season_stats(stat_type="passing")
    print("Passing columns:", [c for c in df_pass.columns if "1/3" in str(c) or "PPA" in str(c) or "CPA" in str(c) or "PrgP" in str(c)])

    print("Fetching 'possession' stats...")
    df_poss = fbref.read_team_season_stats(stat_type="possession")
    print("Possession columns:", [c for c in df_poss.columns if "Touches" in str(c) or "Att Pen" in str(c) or "PrgC" in str(c)])

    print("Fetching 'shooting' stats...")
    df_shoot = fbref.read_team_season_stats(stat_type="shooting")
    print("Shooting columns:", [c for c in df_shoot.columns if "Dist" in str(c) or "SoT" in str(c) or "Sh" in str(c)])

    print("Fetching 'defense' stats...")
    df_def = fbref.read_team_season_stats(stat_type="defense")
    print("Defense columns:", [c for c in df_def.columns if "Att 3rd" in str(c) or "Mid 3rd" in str(c) or "Tkl" in str(c)])

except Exception as e:
    print("Error:", e)
