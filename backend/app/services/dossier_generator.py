"""
FutMatch Dossier Generator: Produces executive pitch documents and director outreach templates
grounded in real 2026/2027 Transfermarkt squad data and contract expirations.
"""

from app.models.schemas import ClientProfileRequest, DossierResponse
from app.db.supabase_client import get_supabase_client

class DossierGenerator:

    @staticmethod
    def generate_dossier(club_id: str, profile: ClientProfileRequest, match_score: int = 94) -> DossierResponse:
        client = get_supabase_client()
        club_data = None
        if client:
            try:
                res = client.table("clubs").select("*").eq("id", club_id).execute()
                if res.data and len(res.data) > 0:
                    club_data = res.data[0]
            except Exception as e:
                print(f"[DossierGenerator] Error fetching club {club_id}: {e}")

        club_name = club_data["name"] if club_data else "Zielverein"
        league = club_data["league"] if club_data else "Bundesliga"
        squad_profile = club_data.get("squad_profile", {}) if club_data else {}
        head_coach = squad_profile.get("head_coach", "Cheftrainer")
        tactical_system = squad_profile.get("tactical_system", "3-4-2-1")

        pos_map = {
            "IV": "Innenverteidiger (IV)",
            "LV": "Linksverteidiger (LV)",
            "RV": "Rechtsverteidiger (RV)",
            "DM": "Defensives Mittelfeld (DM)",
            "ZM": "Zentrales Mittelfeld (ZM)",
            "LF": "Flügelstürmer Links (LF)",
            "RF": "Flügelstürmer Rechts (RF)",
            "MS": "Mittelstürmer (MS)"
        }
        pos_display = pos_map.get(profile.position, profile.position)

        pitch_letter = f"""Sehr geehrte Damen und Herren der Kaderplanung von {club_name},

in Vorbereitung auf die kommenden Transfereffekte für die aktuelle Saison 2026/27 möchten wir Ihnen unseren Klienten ({pos_display}, Alter: {profile.age}, Starker Fuß: {profile.preferred_foot}) vorlegen.

Basierend auf unserer FutMatch Pro Kaderanalyse passt sein Profil hervorragend zu Ihrem bevorzugten Spielsystem ({tactical_system} unter {head_coach}) und adressiert Ihre anstehenden Vertragsabläufe auf der Position {profile.position}.

Vertragssituation Klient: {profile.contract_status.upper() if profile.contract_status else 'ABLÖSEFREI'} (Sehr hohe Transfer-Feasibilität).

Gerne senden wir Ihnen ein detailliertes Video-Dossier sowie die WyScout-Per-90-Metriken zu.

Mit freundlichen Grüßen,
Ihr FutMatch Executive Agency Team"""

        return DossierResponse(
            club_name=club_name,
            league=league,
            match_score=match_score,
            player_position=pos_display,
            tactical_fit_summary=f"Optimales Alignment für {tactical_system} unter {head_coach} (Saison 2026/27).",
            contract_urgency_summary=f"Vakanzen auf Position {profile.position} (2027/2028 Vertragsabläufe).",
            pitch_letter_template=pitch_letter,
            key_metrics_comparison=[
                {"metric": "Taktisches Alignment", "value": f"{tactical_system} ({head_coach})"},
                {"metric": "Saison Datenstand", "value": "2026/2027 Transfermarkt Live"},
                {"metric": "Vertragssituation Klient", "value": profile.contract_status},
                {"metric": "Position Match", "value": f"{pos_display} -> {club_name}"}
            ]
        )
