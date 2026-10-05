import soccerdata as sd
import pandas as pd
import numpy as np

print("[Current Season Pipeline] Testing live current season match data retrieval...")

# Test current season parameter in FBref & Understat
try:
    print("Fetching FBref current season team stats...")
    fbref_current = sd.FBref(leagues=["GER-Bundesliga"], seasons=["2024-2025"]) # or latest active season
    df_std = fbref_current.read_team_season_stats(stat_type="standard")
    print("FBref team stats teams count:", len(df_std))
    
    print("\nFetching Understat current season match stats...")
    us_current = sd.Understat(leagues=["GER-Bundesliga"], seasons=["2024-2025"])
    df_us = us_current.read_team_match_stats()
    print("Understat matches count:", len(df_us))
    
    # Compute rolling average of last 5 matches for each team
    team_last5_ppda = {}
    for idx, row in df_us.iterrows():
        h_team = str(row["home_team"])
        a_team = str(row["away_team"])
        h_p = float(row["home_ppda"]) if not pd.isna(row["home_ppda"]) else None
        a_p = float(row["away_ppda"]) if not pd.isna(row["away_ppda"]) else None
        
        if h_p:
            if h_team not in team_last5_ppda: team_last5_ppda[h_team] = []
            team_last5_ppda[h_team].append(h_p)
        if a_p:
            if a_team not in team_last5_ppda: team_last5_ppda[a_team] = []
            team_last5_ppda[a_team].append(a_p)

    print("\nCurrent Season Rolling Match Averages (Last Matches):")
    for team, vals in team_last5_ppda.items():
        last_5 = vals[-5:] # Last 5 matches
        avg_last_5 = float(np.mean(last_5))
        print(f"Team: {team:25s} | Last 5 Matches PPDA: {avg_last_5:.2f} (Full Season Avg: {np.mean(vals):.2f})")

except Exception as e:
    print("Error:", e)
