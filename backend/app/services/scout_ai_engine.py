"""
FutMatch Pro — ScoutAI Machine Learning Engine & Football Manager Role Profiler
Implements ScoutAI (Muzzarino et al., 2026) hybrid ML scoring, FM granular tactical roles,
role-based statistical suitability (S_Fit), predicted rating (S_ML), K-Means player archetypes,
and multi-position familiarity & formation compatibility.
"""

import math
from typing import Dict, List, Any

# Football Manager / WyScout Granular Tactical Role Definitions & Per-90 KPI Weighting Matrices
ROLE_DEFINITIONS = {
    "ATTACKING_WINGBACK": {
        "label": "Offensiver Schienenspieler (Complete Wing-Back)",
        "group": "DEF",
        "primary_positions": ["LV", "RV"],
        "kpis": {
            "progressive_carries_per_90": 0.25,
            "xa_per_90": 0.20,
            "dribble_success_pct": 0.20,
            "padj_tackles_per_90": 0.20,
            "crosses_per_90": 0.15
        }
    },
    "INVERTED_WINGBACK": {
        "label": "Einrückender Außenverteidiger (Inverted Wing-Back)",
        "group": "DEF",
        "primary_positions": ["LV", "RV"],
        "kpis": {
            "passes_into_penalty_area_per_90": 0.30,
            "progressive_passes_per_90": 0.25,
            "interceptions_per_90": 0.25,
            "tackles_won_pct": 0.20
        }
    },
    "BALL_PLAYING_DEFENDER": {
        "label": "Spielgestaltender Innenverteidiger (Ball-Playing Defender)",
        "group": "DEF",
        "primary_positions": ["IV"],
        "kpis": {
            "progressive_passes_per_90": 0.30,
            "pass_completion_pct": 0.25,
            "interceptions_per_90": 0.25,
            "aerial_duels_won_pct": 0.20
        }
    },
    "STOPPER_IV": {
        "label": "Zweikampfstarker Stopper (Stopper / Defensive IV)",
        "group": "DEF",
        "primary_positions": ["IV"],
        "kpis": {
            "aerial_duels_won_pct": 0.35,
            "tackles_won_pct": 0.35,
            "clearances_per_90": 0.30
        }
    },
    "DEEP_LYING_PLAYMAKER": {
        "label": "Tiefstehender Spielmacher (Deep-Lying Playmaker / 6er)",
        "group": "MID",
        "primary_positions": ["DM", "ZM"],
        "kpis": {
            "progressive_passes_per_90": 0.35,
            "pass_completion_pct": 0.30,
            "key_passes_per_90": 0.20,
            "interceptions_per_90": 0.15
        }
    },
    "BOX_TO_BOX_ENGINE": {
        "label": "Dynamischer Allrounder (Box-To-Box Engine / 8er)",
        "group": "MID",
        "primary_positions": ["ZM"],
        "kpis": {
            "progressive_carries_per_90": 0.25,
            "padj_tackles_per_90": 0.25,
            "key_passes_per_90": 0.25,
            "interceptions_per_90": 0.25
        }
    },
    "INSIDE_FORWARD": {
        "label": "Torgefährlicher Flügelstürmer (Inside Forward)",
        "group": "FWD",
        "primary_positions": ["LF", "RF"],
        "kpis": {
            "xg_per_90": 0.35,
            "shots_per_90": 0.25,
            "dribble_success_pct": 0.20,
            "key_passes_per_90": 0.20
        }
    },
    "TARGET_FORWARD": {
        "label": "Robustes Zielspiel / Knipser (Target Forward / Pressing MS)",
        "group": "FWD",
        "primary_positions": ["MS"],
        "kpis": {
            "xg_per_90": 0.35,
            "aerial_duels_won_pct": 0.30,
            "touches_in_box_per_90": 0.20,
            "shots_per_90": 0.15
        }
    }
}

class ScoutAIEngine:

    @staticmethod
    def calculate_statistical_fit(player_metrics: Dict[str, float], role_key: str) -> float:
        """
        Calculates S_Fit (Role-Based Statistical Suitability Score) using weighted KPIs.
        """
        role_def = ROLE_DEFINITIONS.get(role_key, ROLE_DEFINITIONS["ATTACKING_WINGBACK"])
        kpis = role_def["kpis"]
        
        fit_score = 0.0
        total_weight = 0.0
        
        for kpi, weight in kpis.items():
            val = player_metrics.get(kpi, 50.0)
            # Normalize percentage values (0-100) vs per-90 metrics (0-10 scale)
            if "pct" in kpi or val > 15:
                norm_val = min(max(val / 100.0, 0.0), 1.0)
            else:
                norm_val = min(max(val / 5.0, 0.0), 1.0) # Assume 5.0 per 90 is elite
                
            fit_score += norm_val * weight
            total_weight += weight
            
        return round((fit_score / total_weight if total_weight > 0 else 0.70), 4)

    @staticmethod
    def predict_ml_rating(player_metrics: Dict[str, float], base_rating: float = 78.0) -> float:
        """
        Model A (XGBoost Regressor Simulation): Predicts normalized player rating (S_ML).
        """
        # Composite feature weights representing ML feature importances
        prog_passes = player_metrics.get("progressive_passes_per_90", 3.5)
        prog_carries = player_metrics.get("progressive_carries_per_90", 2.8)
        xa = player_metrics.get("xa_per_90", 0.18)
        xg = player_metrics.get("xg_per_90", 0.22)
        duels_pct = player_metrics.get("tackles_won_pct", 58.0)
        
        feature_score = (prog_passes * 0.15) + (prog_carries * 0.15) + (xa * 2.0) + (xg * 1.5) + (duels_pct * 0.01)
        ml_rating = base_rating + (feature_score * 2.5)
        
        # Normalize S_ML between 0.0 and 1.0
        s_ml = min(max(ml_rating / 100.0, 0.50), 0.99)
        return round(s_ml, 4)

    @staticmethod
    def compute_scouting_score(s_ml: float, s_fit: float) -> float:
        """
        ScoutAI Core Formula: Scouting Score = (0.65 * S_ML + 0.35 * S_Fit) * 100
        """
        score = (0.65 * s_ml + 0.35 * s_fit) * 100.0
        return round(score, 1)

    @staticmethod
    def classify_player_archetype(player_metrics: Dict[str, float], position: str) -> str:
        """
        K-Means Clustering Simulation: Returns tactical archetype label.
        """
        prog_carries = player_metrics.get("progressive_carries_per_90", 2.5)
        prog_passes = player_metrics.get("progressive_passes_per_90", 3.0)
        xa = player_metrics.get("xa_per_90", 0.15)
        xg = player_metrics.get("xg_per_90", 0.20)
        tackles = player_metrics.get("padj_tackles_per_90", 2.0)
        
        pos = str(position).upper()
        
        if pos in ["LV", "RV", "AV"]:
            if prog_carries > 3.2 and xa > 0.18:
                return "Elite High-Carrier Wing-Back (Davies-Typ)"
            elif prog_passes > 4.0:
                return "Inverted Playmaking Full-Back (Grimaldo-Typ)"
            else:
                return "Zweikampfstarker Schienenspieler"
        elif pos in ["IV", "CB"]:
            if prog_passes > 4.5:
                return "Spielaufbauender Innenverteidiger (Tah/Schlotterbeck)"
            else:
                return "Stopper / Physischer Zweikämpfer"
        elif pos in ["ZM", "DM", "OM"]:
            if xa > 0.25 or prog_passes > 5.0:
                return "Kreativer Taktgeber / Deep-Lying Playmaker (Xhaka-Typ)"
            else:
                return "Box-To-Box Allrounder (Musiala/Kimmich-Typ)"
        elif pos in ["MS", "FWD", "ST"]:
            if xg > 0.45:
                return "Zielspieler & Strafraum-Knipser (Kane/Guirassy)"
            else:
                return "Pressingstarker Umschaltstürmer"
        return "Vielseitiger Profi-Athlet"

    @staticmethod
    def evaluate_formation_suitability(player_metrics: Dict[str, float], role_key: str) -> Dict[str, float]:
        """
        Model C (Extra Trees Classifier Simulation): Evaluates candidate fit across tactical formations.
        """
        s_fit = ScoutAIEngine.calculate_statistical_fit(player_metrics, role_key)
        
        # Base compatibility scores
        return {
            "4-2-3-1": round(min(s_fit * 100 + 4, 99.0), 1),
            "3-4-2-1": round(min(s_fit * 100 + (6 if "WINGBACK" in role_key else 2), 99.0), 1),
            "4-3-3":   round(min(s_fit * 100 + 3, 99.0), 1),
            "4-1-4-1": round(min(s_fit * 100 + 1, 99.0), 1),
            "3-4-1-2": round(min(s_fit * 100 + (5 if "WINGBACK" in role_key else 0), 99.0), 1)
        }
