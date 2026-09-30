import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent / "backend"))

from app.db.supabase_client import get_supabase_client

client = get_supabase_client()
res = client.table("clubs").select("name, squad_profile").execute()

for club in res.data:
    squad = club.get("squad_profile", {}).get("full_squad_2027", [])
    for p in squad:
        name = p.get("name", "")
        if "karl" in name.lower() or "saibari" in name.lower():
            print(f"{name:20s} | {p.get('position'):22s} | {p.get('role_distribution_label')} | {p.get('archetype')}")
