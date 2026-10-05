import soccerdata as sd
import pandas as pd

print("[Barca Analytics] Testing FBref player season stats aggregation per team...")
fbref = sd.FBref(leagues=["GER-Bundesliga"], seasons=["2024-2025"])

try:
    print("Reading player passing stats...")
    df_pass = fbref.read_player_season_stats(stat_type="passing")
    print("Player passing columns MultiIndex:")
    print(df_pass.columns)
    print("\nSample rows:")
    print(df_pass.head(3))
    
    print("\nReading player possession stats...")
    df_poss = fbref.read_player_season_stats(stat_type="possession")
    print("Player possession columns MultiIndex:")
    print(df_poss.columns)
except Exception as e:
    print("Error:", e)
