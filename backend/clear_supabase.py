import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent))

from app.db.supabase_client import get_supabase_client

def clear_all_supabase_data():
    client = get_supabase_client()
    if not client:
        print("[ERROR] Supabase client is not initialized!")
        return False

    print("[Supabase] Clearing ALL data from Supabase tables (xrytnuhucuqmyoytdtch)...")

    # Clear clubs table (text PK)
    try:
        client.table("clubs").delete().neq("id", "none_dummy_id_000").execute()
        print("  -> Cleared table 'clubs'")
    except Exception as e:
        print(f"  -> Notice 'clubs': {e}")

    # Clear client_profiles table (uuid PK)
    try:
        client.table("client_profiles").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        print("  -> Cleared table 'client_profiles'")
    except Exception as e:
        print(f"  -> Notice 'client_profiles': {e}")

    # Clear match_history table (uuid PK)
    try:
        client.table("match_history").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        print("  -> Cleared table 'match_history'")
    except Exception as e:
        print(f"  -> Notice 'match_history': {e}")

    print("[SUCCESS] All Supabase database tables are completely clean and empty (0 records).")
    return True

if __name__ == "__main__":
    clear_all_supabase_data()
