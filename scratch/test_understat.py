import soccerdata as sd

print("[Understat Pipeline] Testing Understat metrics (xG, xGA, PPDA, Deep)...")
try:
    us = sd.Understat(leagues=["GER-Bundesliga"], seasons=["2024-2025"]) # or 2425
    df_team_data = us.read_team_match_stats()
    print("Understat match stats sample:")
    print(df_team_data.head(3))
except Exception as e:
    print("Understat error:", e)
