"""
Matching Engine: Reverses ScoutAI perspective from player ranking to club matchmaking for advisors.
"""

from typing import List
from app.models.schemas import ClientProfileRequest, ClubMatchResponse
from app.data.clubs_database import CLUBS_DATABASE

class MatchingEngine:

    @staticmethod
    def calculate_matches(profile: ClientProfileRequest) -> List[ClubMatchResponse]:
        results = []

        for club in CLUBS_DATABASE:
            # 1. Tactical Fit Score (0 - 100)
            tactical_score = 60
            if profile.position in club["target_positions"]:
                tactical_score += 25
            
            # Position-specific tactical alignment
            if profile.position == "IV" and any("3-" in t for t in club["primary_tactics"]):
                tactical_score += 15  # Dreierkette bonus for IV
            elif profile.position in ["LV", "RV"] and any("3-5-2" in t or "3-4" in t for t in club["primary_tactics"]):
                tactical_score += 15  # Wing-back bonus
            elif profile.position == "MS" and any("4-4-2" in t or "3-4-1-2" in t for t in club["primary_tactics"]):
                tactical_score += 10
            
            tactical_score = min(tactical_score, 100)

            # 2. Vacancy & Contract Urgency Score (0 - 100)
            vacancy_score = 50
            expiring_count = club["contract_expiring_count"].get(profile.position, 0)
            if expiring_count >= 2:
                vacancy_score += 40
            elif expiring_count == 1:
                vacancy_score += 25

            if profile.contract_status in ["summer2025", "free"]:
                vacancy_score += 10  # High transfer feasibility for free agent / summer expiry

            vacancy_score = min(vacancy_score, 100)

            # 3. Player Attribute & Foot Fit Score (0 - 100)
            attribute_score = 70
            if profile.preferred_foot == club["preferred_foot"] or profile.preferred_foot == "Beidfüßig":
                attribute_score += 15

            # Age match
            min_age, max_age = club["ideal_age_range"]
            if min_age <= profile.age <= max_age:
                attribute_score += 15

            attribute_score = min(attribute_score, 100)

            # 4. Final Weighted Formula:
            # Match Score = 0.40 * Tactical + 0.35 * Vacancy + 0.25 * Attribute
            final_score = int(0.40 * tactical_score + 0.35 * vacancy_score + 0.25 * attribute_score)
            final_score = max(55, min(final_score, 98))

            # Determine badge styling
            urgency_str = "Sehr Hoch" if expiring_count >= 1 or profile.contract_status in ["summer2025", "free"] else "Normal"

            results.append(ClubMatchResponse(
                club_id=club["id"],
                club_name=club["name"],
                logo_short=club["logo_short"],
                league=club["league"],
                match_score=final_score,
                tactical_fit_reason=club["squad_profile"]["vacancies"],
                tactical_alignment=f"{club['primary_tactics'][0]} System ({club['squad_profile']['build_up_style']})",
                contract_urgency=urgency_str,
                archetype_fit_percentage=attribute_score
            ))

        # Sort descending by match score
        results.sort(key=lambda x: x.match_score, reverse=True)
        return results
