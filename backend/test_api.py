import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent))

from app.models.schemas import ClientProfileRequest
from app.services.matching_engine import MatchingEngine
from app.services.dossier_generator import DossierGenerator

def run_tests():
    print("--- TESTING MATCHING ENGINE ---")
    req = ClientProfileRequest(
        position="IV",
        age=23,
        age_group="22-25",
        preferred_foot="Links",
        contract_status="summer2025"
    )
    
    matches = MatchingEngine.calculate_matches(req)
    print(f"Successfully calculated {len(matches)} matches.")
    for m in matches[:3]:
        print(f" -> {m.club_name} ({m.league}): {m.match_score}% | {m.tactical_fit_reason}")

    print("\n--- TESTING DOSSIER GENERATOR ---")
    dossier = DossierGenerator.generate_dossier(matches[0].club_id, req, matches[0].match_score)
    print(f"Generated Dossier for: {dossier.club_name}")
    print(f"Pitch Summary: {dossier.tactical_fit_summary}")
    print("ALL BACKEND TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
