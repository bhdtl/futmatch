"""
Dossier Generator: Produces executive pitch documents and director outreach templates.
"""

from app.models.schemas import ClientProfileRequest, DossierResponse
from app.data.clubs_database import CLUBS_DATABASE

class DossierGenerator:

    @staticmethod
    def generate_dossier(club_id: str, profile: ClientProfileRequest, match_score: int = 94) -> DossierResponse:
        club = next((c for c in CLUBS_DATABASE if c["id"] == club_id), CLUBS_DATABASE[0])

        pos_map = {
            "IV": "Innenverteidiger (IV)",
            "LV": "Linksverteidiger (LV)",
            "RV": "Rechtsverteidiger (RV)",
            "DM": "Defensives Mittelfeld (DM / 6er)",
            "ZM": "Zentrales Mittelfeld (ZM / 8er)",
            "LF": "Flügelstürmer Links (LF)",
            "RF": "Flügelstürmer Rechts (RF)",
            "MS": "Mittelstürmer (MS / Target Man)"
        }
        pos_display = pos_map.get(profile.position, profile.position)

        pitch_letter = f"""Sehr geehrte Damen und Herren der Kaderplanung von {club['name']},

in Vorbereitung auf die kommenden Transfereffekte für die Saison 2025/26 möchten wir Ihnen unseren Klienten ({pos_display}, Alter: {profile.age}, Starker Fuß: {profile.preferred_foot}) vorlegen.

Basierend auf unserer datengestützten Analyse passt sein Profil hervorragend zu Ihrem bevorzugten Spielsystem ({club['primary_tactics'][0]}) und adressiert Ihre anstehende Vakanz auf der Position {profile.position}.

Vertragssituation: {profile.contract_status.capitalize()} (Sehr hohe Transfer-Feasibilitaet).

Gerne senden wir Ihnen ein detailliertes Video-Dossier sowie die WyScout-Metriken zu.

Mit freundlichen Grüßen,
Ihr Performance Advisor Team"""

        return DossierResponse(
            club_name=club["name"],
            league=club["league"],
            match_score=match_score,
            player_position=pos_display,
            tactical_fit_summary=f"Optimales Alignment für {club['primary_tactics'][0]} mit Fokus auf {club['squad_profile']['build_up_style']}.",
            contract_urgency_summary=club["squad_profile"]["vacancies"],
            pitch_letter_template=pitch_letter,
            key_metrics_comparison=[
                {"metric": "Taktisches Alignment", "value": club['primary_tactics'][0]},
                {"metric": "Pressing-Intensität", "value": club['squad_profile']['pressing_intensity']},
                {"metric": "Vertragssituation Klient", "value": profile.contract_status},
                {"metric": "Starker Fuß Kompatibilität", "value": f"{profile.preferred_foot} vs. Bedarf: {club['preferred_foot']}"}
            ]
        )
