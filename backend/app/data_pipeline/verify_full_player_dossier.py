import sys
import json
import random
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent.parent))
from app.db.supabase_client import get_supabase_client

def main():
    client = get_supabase_client()
    if not client:
        print("[ERROR] Supabase client unavailable.")
        return

    # Select a club
    res = client.table("clubs").select("id, name, league, squad_profile").limit(5).execute()
    clubs = res.data or []

    for club in clubs:
        squad = club.get("squad_profile", {}).get("full_squad_2027", [])
        if not squad:
            continue

        player = squad[0]
        p_name = player.get("name")
        c_name = club.get("name")
        league = club.get("league")
        pos = player.get("position", "F")
        detailed = player.get("detailed_stats", {})

        print("=========================================================================")
        print(f"[Full Dossier Inspection] Player: {p_name} ({c_name} | {league} | Pos: {pos})")
        print("=========================================================================")

        categories = ["sample", "offense", "passing", "duels", "defense", "tracking"]
        for cat in categories:
            cat_data = detailed.get(cat, {})
            print(f"\n--- Category: {cat.upper()} ---")
            for k, v in cat_data.items():
                safe_val = str(v).encode('ascii', 'ignore').decode('ascii') if isinstance(v, str) else str(v)
                print(f"   - {k}: {safe_val}")
        break

if __name__ == "__main__":
    main()
