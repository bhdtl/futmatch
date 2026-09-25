"""
FutMatch Pro Matching Engine: Integrated with Supabase Cloud DB (ID: xrytnuhucuqmyoytdtch)
Processes real 2026/2027 Transfermarkt live squad profiles, coach tactical systems, 
and exact 2027/2028 contract expirations to compute inverted match scores (0-100%).
"""

from typing import List
from app.models.schemas import ClientProfileRequest, ClubMatchResponse
from app.db.supabase_client import get_supabase_client

class MatchingEngine:

    @staticmethod
    def get_clubs_source():
        """Loads real 2026/2027 squad profiles from Supabase database."""
        client = get_supabase_client()
        if client:
            try:
                res = client.table("clubs").select("*").execute()
                if res.data and len(res.data) > 0:
                    return res.data
            except Exception as e:
                print(f"[MatchingEngine] Error loading clubs from Supabase: {e}")
        return []

    @staticmethod
    def calculate_matches(profile: ClientProfileRequest) -> List[ClubMatchResponse]:
        clubs_data = MatchingEngine.get_clubs_source()
        results = []

        pos = profile.position.upper() if profile.position else "IV"

        for club in clubs_data:
            squad_profile = club.get("squad_profile", {})
            head_coach = squad_profile.get("head_coach", "Cheftrainer")
            tactical_system = squad_profile.get("tactical_system", club.get("primary_tactics", ["4-3-3"])[0])
            active_squad_size = squad_profile.get("active_squad_size", 28)
            expiring_map = squad_profile.get("expiring_contracts_2027_2028", {})

            # Contract expiring counts per position group
            expiring_count_map = club.get("contract_expiring_count", {})
            
            expiring_def = expiring_count_map.get("IV", 0)
            expiring_mid = expiring_count_map.get("ZM", 0)
            expiring_att = expiring_count_map.get("MS", 0)

            # Determine relevant expirations for selected position
            relevant_expiring_count = 0
            relevant_players_str = ""

            if pos in ["IV", "LV", "RV", "CB", "LB", "RB"]:
                relevant_expiring_count = expiring_def
                players_list = expiring_map.get("defenders", [])
                relevant_players_str = ", ".join(players_list[:2]) if players_list else "Auslaufende Verträge in der Abwehr"
            elif pos in ["ZM", "DM", "OM", "CM", "CAM", "CDM"]:
                relevant_expiring_count = expiring_mid
                players_list = expiring_map.get("midfielders", [])
                relevant_players_str = ", ".join(players_list[:2]) if players_list else "Auslaufende Verträge im Mittelfeld"
            else:
                relevant_expiring_count = expiring_att
                players_list = expiring_map.get("attackers", [])
                relevant_players_str = ", ".join(players_list[:2]) if players_list else "Auslaufende Verträge im Sturm"

            # 1. Tactical Score (40%)
            tactical_score = 65
            primary_tactics = club.get("primary_tactics", [tactical_system])
            
            if pos in ["IV", "LV", "RV"] and any("3-" in t for t in primary_tactics):
                tactical_score += 25
            elif pos in ["ZM", "DM"] and any("4-2-3-1" in t or "4-3-3" in t for t in primary_tactics):
                tactical_score += 20
            elif pos in ["MS", "LF", "RF"] and any("3-4-2-1" in t or "4-3-3" in t for t in primary_tactics):
                tactical_score += 20
            else:
                tactical_score += 15

            tactical_score = min(tactical_score, 98)

            # 2. Vacancy Score (35%)
            vacancy_score = 50
            if relevant_expiring_count >= 2:
                vacancy_score += 45
            elif relevant_expiring_count == 1:
                vacancy_score += 30
            else:
                vacancy_score += 15

            if profile.contract_status in ["summer2025", "free"]:
                vacancy_score += 10

            vacancy_score = min(vacancy_score, 100)

            # 3. Attribute / Age Fit Score (25%)
            attribute_score = 70
            ideal_min = club.get("ideal_age_min", 19)
            ideal_max = club.get("ideal_age_max", 28)
            
            if ideal_min <= profile.age <= ideal_max:
                attribute_score += 20
            else:
                attribute_score += 10

            attribute_score = min(attribute_score, 98)

            # Final Score Calculation (40% Tactical + 35% Vacancy + 25% Attribute)
            final_score = int(0.40 * tactical_score + 0.35 * vacancy_score + 0.25 * attribute_score)
            final_score = max(68, min(final_score, 98))

            # Reasoning Note
            if relevant_expiring_count > 0:
                fit_reason = f"Dringende Vakanz: {relevant_expiring_count} Vertrag/Verträge laufen 2027/28 aus ({relevant_players_str}). System {tactical_system} von {head_coach} sucht Verstärkung."
            else:
                fit_reason = f"Taktischer Fit im System {tactical_system} unter {head_coach}. Kader-Ergänzung ({active_squad_size} Profis im Kader 2026/27)."

            urgency = "Sehr Hoch" if relevant_expiring_count >= 2 or profile.contract_status in ["summer2025", "free"] else "Normal"

            results.append(ClubMatchResponse(
                club_id=club["id"],
                club_name=club["name"],
                logo_short=club.get("logo_short", club["id"][-3:]),
                league=club.get("league", "Bundesliga"),
                match_score=final_score,
                tactical_fit_reason=fit_reason,
                tactical_alignment=f"{tactical_system} ({head_coach})",
                contract_urgency=urgency,
                archetype_fit_percentage=attribute_score
            ))

        results.sort(key=lambda x: x.match_score, reverse=True)
        return results
