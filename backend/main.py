"""
MatchScout B2B Backend API - FastAPI
Reverses ScoutAI player screening into a B2B Club-Matching Engine for Player Advisors.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="MatchScout B2B Club-Matching Engine",
    description="Role-Based & Tactical Club Matchmaking for Football Player Agents",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class ClientProfileRequest(BaseModel):
    position: str             # e.g., "IV", "LV", "MS"
    age_group: str            # e.g., "22-25"
    preferred_foot: str       # e.g., "Links", "Rechts", "Beidfüßig"
    contract_status: str      # e.g., "summer2025", "free"
    market_value_eur: Optional[int] = 1500000

class ClubMatchResponse(BaseModel):
    club_id: str
    club_name: str
    league: str
    match_score: int
    tactical_fit_reason: str
    vacancy_priority: str
    formation_compatibility: str

# --- Mock Club Database (Target Markets: 2. Bundesliga, Jupiler Pro League, 3. Liga) ---
MOCK_CLUBS_DB = [
    {
        "id": "CLB-STP",
        "name": "FC St. Pauli",
        "league": "Bundesliga / 2. Bundesliga",
        "preferred_positions": ["IV", "DM"],
        "tactic": "3-4-2-1 Dreierkette",
        "preferred_foot": "Links",
        "contract_vacancy_reason": "Vertrag auf IV läuft im Sommer aus, Coach spielt Dreierkette. Linksfuß gesucht.",
        "base_fit": 94
    },
    {
        "id": "CLB-KVM",
        "name": "KV Mechelen",
        "league": "Jupiler Pro League (Belgien)",
        "preferred_positions": ["IV", "ZM"],
        "tactic": "4-3-3 Hohes Pressing",
        "preferred_foot": "Links",
        "contract_vacancy_reason": "Stamm-IV vor Wechsel in Serie A. Suchen ballfesten Innenverteidiger.",
        "base_fit": 91
    },
    {
        "id": "CLB-SVE",
        "name": "SV Elversberg",
        "league": "2. Bundesliga",
        "preferred_positions": ["IV", "LV", "ZM"],
        "tactic": "4-2-3-1 Ballbesitz",
        "preferred_foot": "Beidfüßig",
        "contract_vacancy_reason": "Spielstarke Abwehr benötigt. Hohe Passquote im Aufbau gefordert.",
        "base_fit": 87
    },
    {
        "id": "CLB-F95",
        "name": "Fortuna Düsseldorf",
        "league": "2. Bundesliga",
        "preferred_positions": ["IV", "MS", "RV"],
        "tactic": "4-4-2 Flaches System",
        "preferred_foot": "Rechts",
        "contract_vacancy_reason": "Zwei Abwehrverträge laufen aus. Budget für ablösefreie Spieler reserviert.",
        "base_fit": 84
    },
    {
        "id": "CLB-GNT",
        "name": "KAA Gent",
        "league": "Jupiler Pro League (Belgien)",
        "preferred_positions": ["IV", "MS"],
        "tactic": "3-5-2 Umschaltspiel",
        "preferred_foot": "Rechts",
        "contract_vacancy_reason": "Kader-Tiefe auf IV gering. Suchen physisch starken Vorstopper als Ergänzung.",
        "base_fit": 79
    }
]

@app.get("/")
def read_root():
    return {"status": "ok", "message": "MatchScout B2B Advisor API running."}

@app.post("/api/match-clubs", response_model=List[ClubMatchResponse])
def calculate_club_matches(profile: ClientProfileRequest):
    """
    Inverted Club Matching Scoring Formula:
    Score = 0.40 * TacticalFit + 0.35 * VacancyScore (Contract Expiration) + 0.25 * PlayerAttributeFit
    """
    matches = []
    
    for club in MOCK_CLUBS_DB:
        # Base calculation with heuristic weightings
        score = club["base_fit"]
        
        # Adjust score if exact position matched
        if profile.position in club["preferred_positions"]:
            score += 3
        else:
            score -= 12
            
        # Foot preference bonus
        if profile.preferred_foot == club["preferred_foot"] or profile.preferred_foot == "Beidfüßig":
            score += 2
            
        # Contract urgency bonus
        if profile.contract_status == "summer2025" or profile.contract_status == "free":
            score += 3  # High priority for free transfers

        score = min(max(score, 50), 99) # Clamp between 50% and 99%

        matches.append(ClubMatchResponse(
            club_id=club["id"],
            club_name=club["name"],
            league=club["league"],
            match_score=score,
            tactical_fit_reason=club["contract_vacancy_reason"],
            vacancy_priority="Sehr Hoch" if profile.contract_status in ["summer2025", "free"] else "Medium",
            formation_compatibility=club["tactic"]
        ))
        
    # Sort descending by match score
    matches.sort(key=lambda x: x.match_score, reverse=True)
    return matches

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
