import soccerdata as sd
import pandas as pd

print("=== FutMatch Pro: FBref / SoccerData Advanced Team & Player Metrics Engine ===")

try:
    # Initialize FBref for Bundesliga
    fbref = sd.FBref(leagues="GER-Bundesliga", seasons="2025")
    print("\n[FBref] Fetching team tactical stats (Passes, Possession, Defensive Actions)...")
    
    # Team Passing & Possession stats
    passing_df = fbref.read_team_match_stats(stat_type="passing")
    print("Team Passing Stats Shape:", passing_df.shape)
    print(passing_df.head(5))

except Exception as e:
    print("Notice on FBref fetch:", e)
