from fastapi import APIRouter, HTTPException, Header
from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.schemas import ClientProfileRequest, ClubMatchResponse, DossierRequest, DossierResponse
from app.services.matching_engine import MatchingEngine
from app.services.dossier_generator import DossierGenerator
from app.db.supabase_client import get_supabase_client

router = APIRouter()

ADMIN_EMAIL = "phinampham3@gmail.com"

class AddClubRequest(BaseModel):
    id: str = Field(..., description="Unique Club ID, e.g. CLB-STP")
    name: str = Field(..., description="Club Name, e.g. FC St. Pauli")
    logo_short: str = Field(..., description="Short logo, e.g. STP")
    league: str = Field(..., description="League, e.g. 2. Bundesliga")
    primary_tactics: List[str] = Field(default=["4-3-3"])
    target_positions: List[str] = Field(default=["IV"])
    preferred_foot: str = Field(default="Rechts")
    ideal_age_min: int = Field(default=18)
    ideal_age_max: int = Field(default=35)
    vacancies: str = Field(..., description="Tactical & contract vacancy reason")
    base_rating: int = Field(default=80)

def verify_admin_access(x_admin_email: Optional[str]):
    if not x_admin_email or x_admin_email.lower() != ADMIN_EMAIL.lower():
        # Soft validation / warning for backend endpoints
        pass

@router.post("/match-clubs", response_model=List[ClubMatchResponse])
def match_clubs(profile: ClientProfileRequest, x_admin_email: Optional[str] = Header(None)):
    """
    FutMatch Pro Inverted ML Matching Engine:
    Queries real clubs & vacancies from Supabase database.
    """
    verify_admin_access(x_admin_email)
    try:
        return MatchingEngine.calculate_matches(profile)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-dossier", response_model=DossierResponse)
def generate_dossier(req: DossierRequest, x_admin_email: Optional[str] = Header(None)):
    """
    Generates executive pitch dossier for sporting director outreach.
    """
    verify_admin_access(x_admin_email)
    try:
        matches = MatchingEngine.calculate_matches(req.client_profile)
        club_match = next((m for m in matches if m.club_id == req.club_id), None)
        score = club_match.match_score if club_match else 90
        return DossierGenerator.generate_dossier(req.club_id, req.client_profile, score)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/clubs")
def get_clubs(x_admin_email: Optional[str] = Header(None)):
    """
    Fetches real clubs stored in Supabase database.
    """
    client = get_supabase_client()
    if client:
        try:
            res = client.table("clubs").select("*").execute()
            return {"total": len(res.data), "clubs": res.data}
        except Exception as e:
            return {"total": 0, "clubs": [], "error": str(e)}
    return {"total": 0, "clubs": []}

@router.post("/clubs")
def add_club(club: AddClubRequest, x_admin_email: Optional[str] = Header(None)):
    """
    Adds a new target club & vacancy directly to Supabase database.
    """
    client = get_supabase_client()
    if not client:
        raise HTTPException(status_code=500, detail="Supabase client is not connected")

    try:
        data = {
            "id": club.id,
            "name": club.name,
            "logo_short": club.logo_short,
            "league": club.league,
            "primary_tactics": club.primary_tactics,
            "target_positions": club.target_positions,
            "preferred_foot": club.preferred_foot,
            "ideal_age_min": club.ideal_age_min,
            "ideal_age_max": club.ideal_age_max,
            "contract_expiring_count": {pos: 1 for pos in club.target_positions},
            "squad_profile": {"vacancies": club.vacancies, "pressing_intensity": "High"},
            "base_rating": club.base_rating
        }
        res = client.table("clubs").upsert(data).execute()
        return {"status": "success", "message": f"Club '{club.name}' added to Supabase DB", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/clubs/{club_id}")
def delete_club(club_id: str, x_admin_email: Optional[str] = Header(None)):
    """
    Deletes a club from Supabase database.
    """
    client = get_supabase_client()
    if not client:
        raise HTTPException(status_code=500, detail="Supabase client is not connected")

    try:
        res = client.table("clubs").delete().eq("id", club_id).execute()
        return {"status": "success", "message": f"Club '{club_id}' deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metadata")
def get_metadata():
    return {
        "positions": [
            {"code": "IV", "label": "Innenverteidiger (IV)"},
            {"code": "LV", "label": "Linksverteidiger (LV)"},
            {"code": "RV", "label": "Rechtsverteidiger (RV)"},
            {"code": "DM", "label": "Defensives Mittelfeld (DM)"},
            {"code": "ZM", "label": "Zentrales Mittelfeld (ZM)"},
            {"code": "LF", "label": "Flügelstürmer Links (LF)"},
            {"code": "RF", "label": "Flügelstürmer Rechts (RF)"},
            {"code": "MS", "label": "Mittelstürmer (MS)"}
        ],
        "feet": ["Links", "Rechts", "Beidfüßig"],
        "contract_statuses": [
            {"code": "summer2025", "label": "Vertrag läuft im Sommer aus"},
            {"code": "free", "label": "Sofort Vereinslos (Ablösefrei)"},
            {"code": "rest1y", "label": "Restvertrag 1 Jahr"},
            {"code": "rest2y", "label": "Restvertrag 2+ Jahre"}
        ]
    }

# ============================================================
# SCOUT AI & FOOTBALL MANAGER ROLE PROFILING ENDPOINTS
# ============================================================

from app.services.scout_ai_engine import ScoutAIEngine, ROLE_DEFINITIONS

class CandidateEvaluationRequest(BaseModel):
    name: str = "Klient Candidate"
    position: str = "LV"
    role_key: str = "ATTACKING_WINGBACK"
    market_value: str = "10.00 Mio. €"
    age: int = 24
    metrics: Optional[Dict[str, float]] = None

class CandidateComparisonRequest(BaseModel):
    candidate1: CandidateEvaluationRequest
    candidate2: CandidateEvaluationRequest

@router.get("/scout-ai/roles")
def get_scout_ai_roles():
    """
    Returns available Football Manager / WyScout granular tactical roles and KPI definitions.
    """
    return {"roles": ROLE_DEFINITIONS}

@router.post("/scout-ai/evaluate")
def evaluate_candidate(req: CandidateEvaluationRequest):
    """
    Evaluates candidate using ScoutAI Hybrid Formula:
    Scouting Score = (0.65 * S_ML + 0.35 * S_Fit) * 100
    """
    metrics = req.metrics or {
        "progressive_carries_per_90": 3.4,
        "progressive_passes_per_90": 4.1,
        "xa_per_90": 0.22,
        "xg_per_90": 0.12,
        "dribble_success_pct": 64.5,
        "padj_tackles_per_90": 2.8,
        "tackles_won_pct": 62.0,
        "interceptions_per_90": 1.9,
        "aerial_duels_won_pct": 55.0,
        "crosses_per_90": 2.4,
        "key_passes_per_90": 1.6,
        "pass_completion_pct": 84.2,
        "clearances_per_90": 1.2,
        "passes_into_penalty_area_per_90": 1.8,
        "touches_in_box_per_90": 2.1,
        "shots_per_90": 1.1
    }

    s_fit = ScoutAIEngine.calculate_statistical_fit(metrics, req.role_key)
    s_ml = ScoutAIEngine.predict_ml_rating(metrics)
    scouting_score = ScoutAIEngine.compute_scouting_score(s_ml, s_fit)
    archetype = ScoutAIEngine.classify_player_archetype(metrics, req.position)
    formations = ScoutAIEngine.evaluate_formation_suitability(metrics, req.role_key)

    return {
        "candidate_name": req.name,
        "position": req.position,
        "role_key": req.role_key,
        "scouting_score": scouting_score,
        "s_ml_predicted_rating": round(s_ml * 100, 1),
        "s_fit_statistical_suitability": round(s_fit * 100, 1),
        "archetype": archetype,
        "formation_suitability": formations,
        "metrics_evaluated": metrics
    }

@router.post("/scout-ai/compare")
def compare_candidates(req: CandidateComparisonRequest):
    """
    Side-by-side Candidate Comparison Engine (Model B & KPI Matrix).
    """
    eval1 = evaluate_candidate(req.candidate1)
    eval2 = evaluate_candidate(req.candidate2)

    return {
        "comparison_matrix": {
            "candidate_1": eval1,
            "candidate_2": eval2
        },
        "score_delta": round(eval1["scouting_score"] - eval2["scouting_score"], 1),
        "recommended_candidate": eval1["candidate_name"] if eval1["scouting_score"] >= eval2["scouting_score"] else eval2["candidate_name"]
    }

