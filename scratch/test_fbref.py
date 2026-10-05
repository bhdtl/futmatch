import soccerdata as sd
import pandas as pd

fbref = sd.FBref(leagues="GER-Bundesliga", seasons="2024-2025") # or 2425/latest available season
print("Reading team standard stats...")
df_standard = fbref.read_team_season_stats(stat_type="standard")
print("Columns standard:", df_standard.columns)
print(df_standard.head(3))

print("Reading team misc stats...")
df_misc = fbref.read_team_season_stats(stat_type="misc")
print("Columns misc:", df_misc.columns)
print(df_misc.head(3))
