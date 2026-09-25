from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import ClientProfileRequest, ClubMatchResponse, DossierRequest, DossierResponse
from app.services.matching_engine import MatchingEngine
from app.services.dossier_generator import DossierGenerator
from app.data.clubs_database import CLUBS_DATABASE

router = APIRouter()

@router.post("/match-clubs", response_model=List[ClubMatchResponse])
def match_clubs(profile: ClientProfileRequest):
    """
    Inverted ML Club-Matching Algorithm:
    Evaluates Tactical Fit, Squad Expirations/Vacancies, and Player Attributes.
    """
    try:
        return MatchingEngine.calculate_matches(profile)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-dossier", response_model=DossierResponse)
def generate_dossier(req: DossierRequest):
    """
    Generates tailored pitch dossier and director outreach letter.
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
    Returns metadata of available target clubs.
    """
    return {"total": len(CLUBS_DATABASE), "clubs": CLUBS_DATABASE}

@router.get("/metadata")
def get_metadata():
    """
    Returns available positions, age groups, and foot options.
    """
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
