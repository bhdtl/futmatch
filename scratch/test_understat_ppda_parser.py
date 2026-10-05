import soccerdata as sd
import pandas as pd
import json

us = sd.Understat(leagues=["GER-Bundesliga"], seasons=["2024-2025"])
df = us.read_team_match_stats()

print("Analyzing PPDA per team...")

team_ppdas = {}

for idx, row in df.iterrows():
    h_team = str(row["home_team"])
    a_team = str(row["away_team"])
    
    h_ppda = row["home_ppda"]
    a_ppda = row["away_ppda"]
    
    # Extract numerical value if dict or float
    def extract_val(val):
        if isinstance(val, dict):
            att = val.get("att", 0)
            def_act = val.get("def", 0)
            if def_act > 0:
                return att / def_act
            return None
        elif isinstance(val, (int, float)) and not pd.isna(val):
            return float(val)
        return None

    h_val = extract_val(h_ppda)
    a_val = extract_val(a_ppda)
    
    if h_val is not None:
        if h_team not in team_ppdas:
            team_ppdas[h_team] = []
        team_ppdas[h_team].append(h_val)

    if a_val is not None:
        if a_team not in team_ppdas:
            team_ppdas[a_team] = []
        team_ppdas[a_team].append(a_val)

for team, vals in team_ppdas.items():
    avg_ppda = sum(vals) / len(vals)
    print(f"Team: {team:30s} | Avg PPDA: {avg_ppda:.2f} (from {len(vals)} matches)")
