"""
FutMatch Pro Matching Engine: Integrated with Supabase Cloud DB (ID: xrytnuhucuqmyoytdtch)
"""

from typing import List
from app.models.schemas import ClientProfileRequest, ClubMatchResponse
from app.data.clubs_database import CLUBS_DATABASE
from app.db.supabase_client import get_supabase_client

class MatchingEngine:

    @staticmethod
    def get_clubs_source():
        """Attempts to load clubs from Supabase database; falls back to CLUBS_DATABASE."""
        client = get_supabase_client()
        if client:
            try:
                res = client.table("clubs").select("*").execute()
                if res.data and len(res.data) > 0:
                    # Convert DB records to internal structure
                    db_clubs = []
                    for row in res.data:
                        db_clubs.append({
                            "id": row["id"],
                            "name": row["name"],
                            "logo_short": row["logo_short"],
                            "league": row["league"],
                            "primary_tactics": row.get("primary_tactics", ["4-3-3"]),
                            "target_positions": row.get("target_positions", ["IV"]),
                            "preferred_foot": row.get("preferred_foot", "Rechts"),
                            "ideal_age_range": (row.get("ideal_age_min", 18), row.get("ideal_age_max", 35)),
                            "contract_expiring_count": row.get("contract_expiring_count", {}),
                            "squad_profile": row.get("squad_profile", {"vacancies": "Kader-Notstand auf dieser Position."}),
                            "base_rating": row.get("base_rating", 80)
                        })
                    return db_clubs
            except Exception as e:
                pass
        return CLUBS_DATABASE

    @staticmethod
    def calculate_matches(profile: ClientProfileRequest) -> List[ClubMatchResponse]:
        clubs_data = MatchingEngine.get_clubs_source()
        results = []

        for club in clubs_data:
            tactical_score = 60
            if profile.position in club["target_positions"]:
                tactical_score += 25
            
            if profile.position == "IV" and any("3-" in t for t in club["primary_tactics"]):
                tactical_score += 15
            elif profile.position in ["LV", "RV"] and any("3-5-2" in t or "3-4" in t for t in club["primary_tactics"]):
                tactical_score += 15
            elif profile.position == "MS" and any("4-4-2" in t or "3-4-1-2" in t for t in club["primary_tactics"]):
                tactical_score += 10
            
            tactical_score = min(tactical_score, 100)

            vacancy_score = 50
            expiring_count = club["contract_expiring_count"].get(profile.position, 0)
            if expiring_count >= 2:
                vacancy_score += 40
            elif expiring_count == 1:
                vacancy_score += 25

            if profile.contract_status in ["summer2025", "free"]:
                vacancy_score += 10

            vacancy_score = min(vacancy_score, 100)

            attribute_score = 70
            if profile.preferred_foot == club["preferred_foot"] or profile.preferred_foot == "Beidfüßig":
                attribute_score += 15

            min_age, max_age = club["ideal_age_range"]
            if min_age <= profile.age <= max_age:
                attribute_score += 15

            attribute_score = min(attribute_score, 100)

            final_score = int(0.40 * tactical_score + 0.35 * vacancy_score + 0.25 * attribute_score)
            final_score = max(55, min(final_score, 98))

            urgency_str = "Sehr Hoch" if expiring_count >= 1 or profile.contract_status in ["summer2025", "free"] else "Normal"

            results.append(ClubMatchResponse(
                club_id=club["id"],
                club_name=club["name"],
                logo_short=club["logo_short"],
                league=club["league"],
                match_score=final_score,
                tactical_fit_reason=club["squad_profile"].get("vacancies", "Vakanz auf dieser Position."),
                tactical_alignment=f"{club['primary_tactics'][0]} System ({club['squad_profile'].get('build_up_style', 'Standard')})",
                contract_urgency=urgency_str,
                archetype_fit_percentage=attribute_score
            ))

        results.sort(key=lambda x: x.match_score, reverse=True)

        # Async log query into Supabase client_profiles if available
        client = get_supabase_client()
        if client:
            try:
                client.table("client_profiles").insert({
                    "position": profile.position,
                    "age": profile.age,
                    "age_group": profile.age_group,
                    "preferred_foot": profile.preferred_foot,
                    "contract_status": profile.contract_status,
                    "market_value_eur": profile.market_value_eur
                }).execute()
            except Exception:
                pass

        return results
