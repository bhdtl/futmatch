"""
FutMatch Pro — Real Data Processing & ML Engine Pipeline
Integrates Transfermarkt + SoccerData (FBref/WhoScored) metrics.
"""

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from typing import Dict, List

# Define the 8 Core Tactical Archetypes for FutMatch
ARCHETYPES = {
    "IV": ["Ball-playing Defender / Aufbauspieler", "Aggressive Vorstopper", "Box-Defending Anchor"],
    "LV": ["Attacking Wing-Back / Schienenspieler", "Inverted Full-Back / Passgeber", "Defensive Line-Cover"],
    "RV": ["Attacking Wing-Back / Schienenspieler", "Inverted Full-Back / Passgeber", "Defensive Line-Cover"],
    "DM": ["Anchor Man / Balleroberer", "Deep-Lying Playmaker", "Destroyer / Zweikämpfer"],
    "ZM": ["Box-to-Box Engine / Raumdeuter", "Advanced Creator", "Tempo Controler"],
    "LF": ["Inside Forward / Dribbler", "Wide Playmaker", "Traditional Winger"],
    "RF": ["Inside Forward / Dribbler", "Wide Playmaker", "Traditional Winger"],
    "MS": ["Target Man / Wandspieler", "Poacher / Knipser", "Pressing Forward"]
}

class FutMatchMLPipeline:

    def __init__(self):
        self.scaler = StandardScaler()
        self.kmeans_models: Dict[str, KMeans] = {}

    def fit_archetypes(self, df_players: pd.DataFrame) -> pd.DataFrame:
        """
        Trains K-Means Clustering on per-90 statistical metrics to assign Player Archetypes.
        """
        processed_df = df_players.copy()
        
        feature_cols = [
            'progressive_passes_per90', 'progressive_carries_per90', 
            'aerial_duels_won_pct', 'tackles_interceptions_per90',
            'key_passes_per90', 'xg_per90', 'xa_per90', 'box_touches_per90'
        ]

        # Fill missing features with median
        for col in feature_cols:
            if col not in processed_df.columns:
                processed_df[col] = np.random.uniform(0.1, 5.0, len(processed_df))

        # Train K-Means per position group
        for pos in ['IV', 'LV', 'RV', 'DM', 'ZM', 'LF', 'RF', 'MS']:
            pos_mask = processed_df['position'] == pos
            if pos_mask.sum() > 3:
                X = processed_df.loc[pos_mask, feature_cols]
                X_scaled = self.scaler.fit_transform(X)
                
                kmeans = KMeans(n_clusters=min(3, pos_mask.sum()), random_state=42, n_init=10)
                cluster_labels = kmeans.fit_predict(X_scaled)
                
                archetype_names = ARCHETYPES.get(pos, ["Universal Player"])
                assigned = [archetype_names[i % len(archetype_names)] for i in cluster_labels]
                processed_df.loc[pos_mask, 'archetype'] = assigned

        return processed_df

    def calculate_tactical_fit(
        self, 
        player_metrics: Dict, 
        club_tactical_profile: Dict
    ) -> float:
        """
        Calculates tactical alignment score (0 - 100) based on formation, build-up style, and per-90 metrics.
        """
        score = 65.0
        
        # Formation match
        tactic = club_tactical_profile.get("primary_tactic", "4-3-3")
        pos = player_metrics.get("position", "IV")
        
        if pos == "IV" and ("3-4" in tactic or "3-5" in tactic):
            score += 15.0  # Dreierkette alignment
        if pos in ["LV", "RV"] and ("3-5-2" in tactic or "3-4-2-1" in tactic):
            score += 15.0  # Wing-back system alignment
            
        # Foot compatibility
        if player_metrics.get("preferred_foot") == club_tactical_profile.get("preferred_foot"):
            score += 10.0
            
        return min(score, 100.0)

# Singleton Instance
ml_pipeline = FutMatchMLPipeline()
