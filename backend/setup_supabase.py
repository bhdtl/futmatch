import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent))

from app.db.supabase_client import get_supabase_client
from app.data.clubs_database import CLUBS_DATABASE

def setup_and_seed_supabase():
    client = get_supabase_client()
    if not client:
        print("[ERROR] Supabase client is not configured!")
        return False

    print("[Supabase] Testing connection to Supabase database (xrytnuhucuqmyoytdtch)...")

    try:
        inserted_count = 0
        for club in CLUBS_DATABASE:
            data = {
                "id": club["id"],
                "name": club["name"],
                "logo_short": club["logo_short"],
                "league": club["league"],
                "primary_tactics": club["primary_tactics"],
                "target_positions": club["target_positions"],
                "preferred_foot": club["preferred_foot"],
                "ideal_age_min": club["ideal_age_range"][0],
                "ideal_age_max": club["ideal_age_range"][1],
                "contract_expiring_count": club["contract_expiring_count"],
                "squad_profile": club["squad_profile"],
                "base_rating": club["base_rating"]
            }
            res = client.table("clubs").upsert(data).execute()
            inserted_count += 1

        print(f"[SUCCESS] Successfully seeded/synced {inserted_count} clubs into Supabase DB ('clubs' table)!")

        response = client.table("clubs").select("*").execute()
        print(f"[VERIFIED] {len(response.data)} clubs fetched from Supabase!")
        for c in response.data[:3]:
            print(f"  -> [{c['id']}] {c['name']} ({c['league']})")

        return True

    except Exception as e:
        print(f"[NOTICE] Supabase table sync notice: {e}")
        print("  (Note: If the 'clubs' table does not exist yet, run 'schema.sql' in Supabase SQL Editor.)")
        return False

if __name__ == "__main__":
    setup_and_seed_supabase()
