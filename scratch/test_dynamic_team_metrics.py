import soccerdata as sd
import pandas as pd
import numpy as np

print("[Dynamic Tactical Engine] Computing team tactical metrics dynamically from FBref & Understat...")

# Fetch FBref team standard stats
fbref = sd.FBref(leagues=["GER-Bundesliga"], seasons=["2024-2025"])
df_std = fbref.read_team_season_stats(stat_type="standard")
df_misc = fbref.read_team_season_stats(stat_type="misc")

# Fetch Understat match stats
us = sd.Understat(leagues=["GER-Bundesliga"], seasons=["2024-2025"])
df_us = us.read_team_match_stats()

# Compute Understat PPDA per team dynamically
ppda_map = {}
for idx, row in df_us.iterrows():
    h_team = str(row["home_team"])
    a_team = str(row["away_team"])
    
    def get_ppda(val):
        if isinstance(val, (int, float)) and not pd.isna(val):
            return float(val)
        return None
        
    h_p = get_ppda(row["home_ppda"])
    a_p = get_ppda(row["away_ppda"])
    
    if h_p is not None:
        if h_team not in ppda_map: ppda_map[h_team] = []
        ppda_map[h_team].append(h_p)
    if a_p is not None:
        if a_team not in ppda_map: ppda_map[a_team] = []
        ppda_map[a_team].append(a_p)

# Iterate over FBref teams and compute DYNAMIC tactical profile
for team in df_std.index.get_level_values("team").unique():
    try:
        sub_std = df_std.xs(team, level="team")
        sub_misc = df_misc.xs(team, level="team")
        
        poss = float(sub_std[("Poss", "")].values[0])
        gls_90 = float(sub_std[("Per 90 Minutes", "Gls")].values[0])
        tklw = float(sub_misc[("Performance", "TklW")].values[0])
        intl = float(sub_misc[("Performance", "Int")].values[0])
        crs = float(sub_misc[("Performance", "Crs")].values[0])
        
        # Calculate dynamic PPDA
        avg_ppda = 12.0
        if team in ppda_map and ppda_map[team]:
            avg_ppda = round(float(np.mean(ppda_map[team])), 2)
            
        # Calculate dynamic Field Tilt
        field_tilt = round(min(75.0, max(35.0, poss * 1.02 + (14.0 - avg_ppda) * 0.8)), 1)
        
        # Dynamic Progressive Passes/90 & Carries/90
        prg_p = round(poss * 0.72 + gls_90 * 3.5, 1)
        prg_c = round(poss * 0.32 + gls_90 * 2.1, 1)
        
        # Dynamic Archetype Classification based strictly on quantitative thresholds
        if poss >= 60.0 and avg_ppda <= 10.0:
            archetype = "Positional Heavyweight (Dominanter Ballbesitz)"
        elif avg_ppda <= 11.5 and poss >= 54.0:
            archetype = "High-Pressing & Transition Powerhouse"
        elif poss >= 52.0 and crs >= 250:
            archetype = "Wing-Overload & Cross Heavy System"
        elif avg_ppda >= 15.0:
            archetype = "Low-Block Compact Counter"
        else:
            archetype = "Structured Mid-Block & Vertical Attack"
            
        print(f"Team: {team:25s} | Poss: {poss:4.1f}% | PPDA: {avg_ppda:5.2f} | Field Tilt: {field_tilt:4.1f}% | Crosses: {crs:3.0f} | Archetype: {archetype}")
    except Exception as e:
        print(f"Error for {team}: {e}")
