import soccerdata as sd

fbref = sd.FBref(leagues=["GER-Bundesliga"], seasons=["2025-2026", "2026-2027"])
try:
    df_std = fbref.read_team_season_stats(stat_type="standard")
    print("Available seasons in df_std:", df_std.index.get_level_values("season").unique())
    print("Teams extracted:", df_std.index.get_level_values("team").unique())
except Exception as e:
    print("Error fetching 25/26 or 26/27:", e)
