from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.schemas import ClientProfileRequest, ClubMatchResponse, DossierRequest, DossierResponse
from app.services.matching_engine import MatchingEngine
from app.services.dossier_generator import DossierGenerator
from app.db.supabase_client import get_supabase_client

router = APIRouter()

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

@router.post("/match-clubs", response_model=List[ClubMatchResponse])
def match_clubs(profile: ClientProfileRequest):
    """
    FutMatch Pro Inverted ML Matching Engine:
    Queries real clubs & vacancies from Supabase database.
    """
    try:
        return MatchingEngine.calculate_matches(profile)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-dossier", response_model=DossierResponse)
def generate_dossier(req: DossierRequest):
    """
    Generates executive pitch dossier for sporting director outreach.
    """
    try:
        matches = MatchingEngine.calculate_matches(req.client_profile)
        club_match = next((m for m in matches if m.club_id == req.club_id), None)
        score = club_match.match_score if club_match else 90
        return DossierGenerator.generate_dossier(req.club_id, req.client_profile, score)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/clubs")
def get_clubs():
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
def add_club(club: AddClubRequest):
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
def delete_club(club_id: str):
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

@router.delete("/reset-database")
def reset_database():
    """
    Clears all database entries from Supabase.
    """
    client = get_supabase_client()
    if not client:
        raise HTTPException(status_code=500, detail="Supabase client is not connected")

    try:
        client.table("clubs").delete().neq("id", "none_dummy_id_000").execute()
        client.table("client_profiles").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        return {"status": "success", "message": "All Supabase records reset to 0"}
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
