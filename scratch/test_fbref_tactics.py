import soccerdata as sd
import pandas as pd

fbref = sd.FBref(leagues="GER-Bundesliga", seasons="2025")

print("[FBref] Fetching team passing & possession tactical stats...")
passing = fbref.read_team_season_stats(stat_type="passing")
possession = fbref.read_team_season_stats(stat_type="possession")
defense = fbref.read_team_season_stats(stat_type="defense")

print("\n--- Passing Columns ---")
print(passing.columns.tolist()[:15])

print("\n--- Possession Columns ---")
print(possession.columns.tolist()[:15])

print("\n--- Defense Columns ---")
print(defense.columns.tolist()[:15])
