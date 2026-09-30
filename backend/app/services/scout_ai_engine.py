"""
FutMatch Pro — ScoutAI Machine Learning Engine & Football Manager Role Profiler
Implements ScoutAI (Muzzarino et al., 2026) hybrid ML scoring across all 18 Football Manager roles,
mapping complete FBref & WyScout Per-90 metrics, role-based statistical suitability (S_Fit),
predicted ML rating (S_ML), K-Means player archetypes, and formation suitability.
"""

import math
from typing import Dict, List, Any

# Football Manager / WyScout Granular Tactical Role Definitions & Per-90 KPI Weighting Matrices (All 18 Roles)
ROLE_DEFINITIONS = {
    # 1. Torwart (GK)
    "SWEEPER_KEEPER": {
        "label": "Mitspielender Torwart (Sweeper Keeper / SK)",
        "group": "GK",
        "primary_positions": ["TW"],
        "description": "Fungiert als 11. Feldspieler im Aufbau, bricht Pressinglinien durch Passoptionen und fängt lange Bälle 20-30m vor dem Tor ab.",
        "kpis": {
            "defensive_actions_outside_penalty_area_per_90": 0.35,
            "launches_completion_pct": 0.25,
            "passed_launches_pct": 0.20,
            "save_pct": 0.20
        }
    },
    "CLASSIC_GOALKEEPER": {
        "label": "Klassischer Torwart (Goalkeeper / G)",
        "group": "GK",
        "primary_positions": ["TW"],
        "description": "Konzentriert sich rein auf Shot-Stopping, Linienbeherrschung und Risikominimierung im Low Block.",
        "kpis": {
            "save_pct": 0.40,
            "psxg_net_per_90": 0.35,
            "crosses_stopped_pct": 0.25
        }
    },

    # 2. Innenverteidiger (CB)
    "BALL_PLAYING_DEFENDER": {
        "label": "Spielgestaltender Innenverteidiger (Ball-Playing Defender / BPD)",
        "group": "DEF",
        "primary_positions": ["IV"],
        "description": "Herzstück des Spielaufbaus: spielt vertikale Laser-Pässe ins Zentrum oder Flugbälle auf aufrückende Außenverteidiger.",
        "kpis": {
            "progressive_passes_per_90": 0.30,
            "passes_into_final_third_per_90": 0.25,
            "pass_completion_pct": 0.25,
            "interceptions_per_90": 0.20
        }
    },
    "NO_NONSENSE_CB": {
        "label": "Zentraler / Kompromissloser Verteidiger (Central Defender / No-Nonsense CB)",
        "group": "DEF",
        "primary_positions": ["IV"],
        "description": "Klassischer Zweikämpfer und Lufthoheit-Verteidiger, der das direkte Duell sucht und risikolos abräumt.",
        "kpis": {
            "aerial_duels_won_pct": 0.35,
            "tackles_won_pct": 0.35,
            "clearances_per_90": 0.30
        }
    },
    "WIDE_CENTRE_BACK": {
        "label": "Breiter Innenverteidiger (Wide Centre-Back / WCB)",
        "group": "DEF",
        "primary_positions": ["IV"],
        "description": "Fächert in 3er-/5er-Ketten weit auf, rückt in Halbräume vor und überlädt mit dem Flügelspieler die Seitenlinie.",
        "kpis": {
            "progressive_carries_per_90": 0.30,
            "crosses_per_90": 0.25,
            "tackles_plus_interceptions_per_90": 0.25,
            "pass_completion_pct": 0.20
        }
    },

    # 3. Außenverteidiger (FB / WB)
    "WING_BACK": {
        "label": "Flügelverteidiger / Schienenspieler (Wing-Back / WB)",
        "group": "DEF",
        "primary_positions": ["LV", "RV"],
        "description": "Beackert die gesamte Seitenlinie, hinterläuft Flügelspieler und schlägt scharfe Flanken.",
        "kpis": {
            "crosses_per_90": 0.30,
            "progressive_carries_per_90": 0.25,
            "xa_per_90": 0.25,
            "padj_tackles_per_90": 0.20
        }
    },
    "INVERTED_WING_BACK": {
        "label": "Invertierter Außenverteidiger (Inverted Full-Back / IFB / IWB)",
        "group": "DEF",
        "primary_positions": ["LV", "RV"],
        "description": "Rückt im Aufbau ins defensive Mittelfeld ein (Doppel-Sechs) oder schiebt zur 3er-Restabsicherung ein.",
        "kpis": {
            "passes_into_penalty_area_per_90": 0.30,
            "progressive_passes_per_90": 0.30,
            "interceptions_per_90": 0.20,
            "tackles_won_pct": 0.20
        }
    },

    # 4. Defensives Mittelfeld (DM)
    "ANCHOR_BWM": {
        "label": "Tiefer Sechser / Abräumer (Anchor / Ball-Winning Midfielder)",
        "group": "MID",
        "primary_positions": ["DM", "ZM"],
        "description": "Lebensversicherung vor der Kette: gewinnt zweite Bälle, sichert Räume ab und unterbindet Konter sofort.",
        "kpis": {
            "padj_tackles_per_90": 0.35,
            "interceptions_per_90": 0.30,
            "tackles_won_pct": 0.20,
            "recoveries_per_90": 0.15
        }
    },
    "DEEP_LYING_PLAYMAKER": {
        "label": "Tiefliegender Spielmacher (Deep Lying Playmaker / DLP)",
        "group": "MID",
        "primary_positions": ["DM", "ZM"],
        "description": "Taktgeber & Metronom: holt sich den Ball tief ab und diktiert das Spiel wie Pirlo, Busquets oder Kroos.",
        "kpis": {
            "progressive_passes_per_90": 0.35,
            "pass_completion_pct": 0.30,
            "key_passes_per_90": 0.20,
            "passes_into_final_third_per_90": 0.15
        }
    },
    "SEGUNDO_VOLANTE": {
        "label": "Halbflügelspieler / Segundo Volante (SV)",
        "group": "MID",
        "primary_positions": ["DM", "ZM"],
        "description": "Dynamischer Box-to-Box-Sechser: startet tief, schiebt im Ballbesitz aber explosionsartig in den gegnerischen Strafraum nach.",
        "kpis": {
            "progressive_carries_per_90": 0.30,
            "xg_per_90": 0.25,
            "touches_in_box_per_90": 0.25,
            "padj_tackles_per_90": 0.20
        }
    },

    # 5. Zentrales Mittelfeld (CM)
    "BOX_TO_BOX_MIDFIELDER": {
        "label": "Box-to-Box-Mittelfeldspieler (Box-to-Box Midfielder / BBM)",
        "group": "MID",
        "primary_positions": ["ZM"],
        "description": "Vertikaler Motor: verteidigt am eigenen Sechzehner, überbrückt das Zentrum und taucht vorne im Strafraum auf.",
        "kpis": {
            "progressive_carries_per_90": 0.25,
            "key_passes_per_90": 0.25,
            "padj_tackles_per_90": 0.25,
            "interceptions_per_90": 0.25
        }
    },
    "ADVANCED_PLAYMAKER_MEZZALA": {
        "label": "Vorgeschobener Spielmacher / Mezzala (AP / MEZ)",
        "group": "MID",
        "primary_positions": ["ZM", "OM"],
        "description": "Kreativknotenpunkt & Halbraum-Drifter: zieht aus dem Zentrum in die Halbräume nach außen und reißt Ketten auf.",
        "kpis": {
            "xa_per_90": 0.30,
            "key_passes_per_90": 0.30,
            "sca_per_90": 0.20,
            "progressive_passes_per_90": 0.20
        }
    },

    # 6. Flügelspieler / Offensives Mittelfeld (AM / W / IF)
    "INSIDE_FORWARD_IW": {
        "label": "Invertierter Flügelstürmer (Inside Forward / IF / IW)",
        "group": "FWD",
        "primary_positions": ["LF", "RF", "OM"],
        "description": "Zieht mit dem Ball auf seinen starken Fuß nach innen, schließt ab und zieht Außenverteidiger mit.",
        "kpis": {
            "xg_per_90": 0.35,
            "shots_per_90": 0.25,
            "dribble_success_pct": 0.20,
            "touches_in_box_per_90": 0.20
        }
    },
    "CLASSIC_WINGER": {
        "label": "Klassischer Flügelspieler (Winger / W)",
        "group": "FWD",
        "primary_positions": ["LF", "RF"],
        "description": "Breitenhalter nah an der Seitenlinie: isoliert Außenverteidiger im 1-gegen-1 und schlägt Flanken.",
        "kpis": {
            "crosses_per_90": 0.35,
            "dribble_success_pct": 0.30,
            "xa_per_90": 0.20,
            "progressive_carries_per_90": 0.15
        }
    },
    "SHADOW_STRIKER": {
        "label": "Schattenstürmer (Shadow Striker / SS)",
        "group": "FWD",
        "primary_positions": ["OM", "MS"],
        "description": "Vertikale Waffe auf der Zehn: attackiert gezielt die Tiefe, sobald der Mittelstürmer Abwehrspieler herauszieht.",
        "kpis": {
            "xg_per_90": 0.40,
            "touches_in_box_per_90": 0.30,
            "shots_per_90": 0.20,
            "key_passes_per_90": 0.10
        }
    },

    # 7. Mittelstürmer (ST)
    "ADVANCED_FORWARD": {
        "label": "Kompletter Stürmer / Stoßstürmer (Advanced Forward / AF)",
        "group": "FWD",
        "primary_positions": ["MS"],
        "description": "Attackiert Schnittstellen der Abwehrkette, presst gegnerische IVs und bindet permanent zwei Verteidiger.",
        "kpis": {
            "xg_per_90": 0.40,
            "shots_per_90": 0.30,
            "touches_in_box_per_90": 0.20,
            "dribble_success_pct": 0.10
        }
    },
    "FALSE_NINE_DLF": {
        "label": "Falsche Neun / Hängende Spitze (False Nine / F9 / DLF)",
        "group": "FWD",
        "primary_positions": ["MS", "OM"],
        "description": "Lässt sich ins Mittelfeld fallen, zieht IVs heraus und kreiert Schnittstellen für Inside Forwards.",
        "kpis": {
            "key_passes_per_90": 0.30,
            "xa_per_90": 0.30,
            "progressive_passes_per_90": 0.25,
            "xg_per_90": 0.15
        }
    },
    "TARGET_FORWARD": {
        "label": "Zielspieler / Physischer Anker (Target Forward / TF)",
        "group": "FWD",
        "primary_positions": ["MS"],
        "description": "Gewinnt Kopfballduelle nach langen Bällen, behauptet das Leder mit dem Rücken zum Tor und legt ab.",
        "kpis": {
            "aerial_duels_won_pct": 0.40,
            "xg_per_90": 0.30,
            "touches_in_box_per_90": 0.20,
            "shots_per_90": 0.10
        }
    }
}

class ScoutAIEngine:

    @staticmethod
    def calculate_statistical_fit(player_metrics: Dict[str, float], role_key: str) -> float:
        """
        Calculates S_Fit (Role-Based Statistical Suitability Score) using weighted KPIs.
        """
        role_def = ROLE_DEFINITIONS.get(role_key, ROLE_DEFINITIONS["WING_BACK"])
        kpis = role_def["kpis"]
        
        fit_score = 0.0
        total_weight = 0.0
        
        for kpi, weight in kpis.items():
            val = player_metrics.get(kpi, 50.0)
            if "pct" in kpi or val > 15:
                norm_val = min(max(val / 100.0, 0.0), 1.0)
            else:
                norm_val = min(max(val / 5.0, 0.0), 1.0)
                
            fit_score += norm_val * weight
            total_weight += weight
            
        return round((fit_score / total_weight if total_weight > 0 else 0.70), 4)

    @staticmethod
    def predict_ml_rating(player_metrics: Dict[str, float], base_rating: float = 78.0) -> float:
        """
        Model A (XGBoost Regressor Simulation): Predicts normalized player rating (S_ML).
        """
        prog_passes = player_metrics.get("progressive_passes_per_90", 3.5)
        prog_carries = player_metrics.get("progressive_carries_per_90", 2.8)
        xa = player_metrics.get("xa_per_90", 0.18)
        xg = player_metrics.get("xg_per_90", 0.22)
        duels_pct = player_metrics.get("tackles_won_pct", 58.0)
        
        feature_score = (prog_passes * 0.15) + (prog_carries * 0.15) + (xa * 2.0) + (xg * 1.5) + (duels_pct * 0.01)
        ml_rating = base_rating + (feature_score * 2.5)
        
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
        
        pos = str(position).upper()
        
        if pos in ["LV", "RV", "AV"]:
            if prog_carries > 3.2 and xa > 0.18:
                return "Elite High-Carrier Wing-Back (Davies/Frimpong)"
            elif prog_passes > 4.0:
                return "Inverted Playmaking Full-Back (Grimaldo)"
            else:
                return "Zweikampfstarker Schienenspieler"
        elif pos in ["IV", "CB"]:
            if prog_passes > 4.5:
                return "Spielaufbauender Innenverteidiger (BPD: Tah/Schlotterbeck)"
            else:
                return "Stopper / Physischer Zweikämpfer"
        elif pos in ["ZM", "DM", "OM"]:
            if xa > 0.25 or prog_passes > 5.0:
                return "Kreativer Taktgeber / Deep-Lying Playmaker (DLP: Xhaka/Kroos)"
            else:
                return "Box-To-Box Allrounder (BBM: Musiala/Kimmich)"
        elif pos in ["MS", "FWD", "ST"]:
            if xg > 0.45:
                return "Zielspieler & Strafraum-Knipser (AF/TF: Kane/Guirassy)"
            else:
                return "Pressingstarker Umschaltstürmer (F9/SS)"
        return "Vielseitiger Profi-Athlet"

    @staticmethod
    def evaluate_formation_suitability(player_metrics: Dict[str, float], role_key: str) -> Dict[str, float]:
        """
        Model C (Extra Trees Classifier Simulation): Evaluates candidate fit across tactical formations.
        """
        s_fit = ScoutAIEngine.calculate_statistical_fit(player_metrics, role_key)
        
        return {
            "4-2-3-1": round(min(s_fit * 100 + 4, 99.0), 1),
            "3-4-2-1": round(min(s_fit * 100 + (6 if "WING" in role_key else 2), 99.0), 1),
            "4-3-3":   round(min(s_fit * 100 + 3, 99.0), 1),
            "4-1-4-1": round(min(s_fit * 100 + 1, 99.0), 1),
            "3-4-1-2": round(min(s_fit * 100 + (5 if "WING" in role_key else 0), 99.0), 1)
        }
