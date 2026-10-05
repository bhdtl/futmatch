import soccerdata as sd
import pandas as pd
import json

print("[FBref Pipeline] Reading team tactical metrics...")
fbref_b1 = sd.FBref(leagues=["GER-Bundesliga"], seasons=["2024-2025"]) # or latest active season
fbref_b2 = sd.FBref(leagues=["GER-2. Bundesliga"], seasons=["2024-2025"])

df_std_1 = fbref_b1.read_team_season_stats(stat_type="standard")
df_misc_1 = fbref_b1.read_team_season_stats(stat_type="misc")

df_std_2 = fbref_b2.read_team_season_stats(stat_type="standard")
df_misc_2 = fbref_b2.read_team_season_stats(stat_type="misc")

df_std = pd.concat([df_std_1, df_std_2])
df_misc = pd.concat([df_misc_1, df_misc_2])

print("\n--- Extracted Teams ---")
for team_name in df_std.index.get_level_values("team").unique():
    try:
        poss = float(df_std.xs(team_name, level="team")[("Poss", "")].values[0])
        gls_90 = float(df_std.xs(team_name, level="team")[("Per 90 Minutes", "Gls")].values[0])
        tklw = float(df_misc.xs(team_name, level="team")[("Performance", "TklW")].values[0])
        intl = float(df_misc.xs(team_name, level="team")[("Performance", "Int")].values[0])
        crs = float(df_misc.xs(team_name, level="team")[("Performance", "Crs")].values[0])
        fls = float(df_misc.xs(team_name, level="team")[("Performance", "Fls")].values[0])
        
        print(f"Team: {team_name:25s} | Poss: {poss:.1f}% | Gls/90: {gls_90:.2f} | TklW: {tklw:.0f} | Int: {intl:.0f} | Crs: {crs:.0f} | Fouls: {fls:.0f}")
    except Exception as e:
        print(f"Team: {team_name} | Error: {e}")
