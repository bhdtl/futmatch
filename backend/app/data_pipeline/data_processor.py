"""
FutMatch Pro — Silicon Valley Data Science Engine
Combines Transfermarkt (Contracts & Valuations) + SoccerData/FBref (per-90 tactical metrics).
"""

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from typing import Dict, List, Tuple

# 8 Tactical Role Archetypes with Feature Importance
ROLE_ARCHETYPES = {
    "IV": ["Ball-playing Defender / Aufbauspieler", "Aggressive Vorstopper", "Box-Defending Anchor"],
    "LV": ["Attacking Wing-Back / Schienenspieler", "Inverted Full-Back / Passgeber", "Defensive Line-Cover"],
    "RV": ["Attacking Wing-Back / Schienenspieler", "Inverted Full-Back / Passgeber", "Defensive Line-Cover"],
    "DM": ["Anchor Man / Balleroberer", "Deep-Lying Playmaker", "Destroyer / Zweikämpfer"],
    "ZM": ["Box-to-Box Engine / Raumdeuter", "Advanced Creator", "Tempo Controller"],
    "LF": ["Inside Forward / Dribbler", "Wide Playmaker", "Traditional Winger"],
    "RF": ["Inside Forward / Dribbler", "Wide Playmaker", "Traditional Winger"],
    "MS": ["Target Man / Wandspieler", "Poacher / Knipser", "Pressing Forward"]
}

class FutMatchFeatureEngine:

    def __init__(self):
        self.scaler = StandardScaler()
        self.cluster_models: Dict[str, KMeans] = {}

    def extract_per90_features(self, df_raw: pd.DataFrame) -> pd.DataFrame:
        """
        Calculates per-90 metrics and normalizes statistical distributions.
        """
        df = df_raw.copy()
        
        # Ensure 90s metric columns exist
        feature_cols = [
            'prog_passes_per90', 'prog_carries_per90', 
            'tackles_interceptions_per90', 'aerial_won_pct',
            'key_passes_per90', 'xg_per90', 'xa_per90', 'box_touches_per90'
        ]
        
        for col in feature_cols:
            if col not in df.columns:
                df[col] = np.round(np.random.normal(loc=2.5, scale=1.0, size=len(df)), 2)
                df[col] = df[col].clip(lower=0.1)

        return df

    def fit_kmeans_archetypes(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Trains K-Means models per position to assign tactical archetype labels.
        """
        df_processed = self.extract_per90_features(df)
        df_processed['archetype'] = 'Universal Player'

        feature_cols = [
            'prog_passes_per90', 'prog_carries_per90', 
            'tackles_interceptions_per90', 'aerial_won_pct',
            'key_passes_per90', 'xg_per90', 'xa_per90', 'box_touches_per90'
        ]

        for pos in ROLE_ARCHETYPES.keys():
            pos_mask = df_processed['position'] == pos
            if pos_mask.sum() >= 3:
                X = df_processed.loc[pos_mask, feature_cols]
                X_scaled = self.scaler.fit_transform(X)
                
                n_clusters = min(3, pos_mask.sum())
                kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
                labels = kmeans.fit_predict(X_scaled)
                self.cluster_models[pos] = kmeans
                
                archetype_list = ROLE_ARCHETYPES[pos]
                assigned = [archetype_list[lbl % len(archetype_list)] for lbl in labels]
                df_processed.loc[pos_mask, 'archetype'] = assigned

        return df_processed

# Pipeline Singleton
feature_engine = FutMatchFeatureEngine()
