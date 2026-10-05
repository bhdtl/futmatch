import soccerdata as sd

us = sd.Understat(leagues=["GER-Bundesliga"], seasons=["2024-2025"])
df = us.read_team_match_stats()

print("Index names:", df.index.names)
print("Index sample:", df.index[:5])
print("Columns:", df.columns)

print("\nSample row:")
print(df[["home_team", "away_team", "home_ppda", "away_ppda"]].head(10))
