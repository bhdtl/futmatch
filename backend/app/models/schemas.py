from pydantic import BaseModel, Field
from typing import List, Optional

class ClientProfileRequest(BaseModel):
    position: str = Field(..., description="Position code: IV, LV, RV, DM, ZM, LF, RF, MS")
    age: int = Field(..., ge=16, le=42, description="Age of the player")
    age_group: Optional[str] = Field("22-25", description="Age category: 18-21, 22-25, 26-29, 30+")
    preferred_foot: str = Field(..., description="Starker Fuß: Links, Rechts, Beidfüßig")
    contract_status: str = Field(..., description="Vertragssituation: summer2025, free, rest1y, rest2y")
    market_value_eur: Optional[int] = Field(1500000, description="Estimated market value in EUR")
    archetype: Optional[str] = Field(None, description="Player Archetype (e.g. Ball-playing Defender)")

class ClubMatchResponse(BaseModel):
    club_id: str
    club_name: str
    logo_short: str
    league: str
    match_score: int
    tactical_fit_reason: str
    tactical_alignment: str
    contract_urgency: str
    archetype_fit_percentage: int

class DossierRequest(BaseModel):
    club_id: str
    client_profile: ClientProfileRequest

class DossierResponse(BaseModel):
    club_name: str
    league: str
    match_score: int
    player_position: str
    tactical_fit_summary: str
    contract_urgency_summary: str
    pitch_letter_template: str
    key_metrics_comparison: List[dict]
