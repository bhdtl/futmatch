import sys
import os
from pathlib import Path

sys.path.append(str(Path(__file__).parent))
from app.db.supabase_client import get_supabase_client

client = get_supabase_client()
res = client.table("clubs").select("*").execute()

for club in res.data:
    sp = club.get("squad_profile", {})
    form = sp.get("last_match_formation", "4-2-3-1")
    most_form = sp.get("most_used_formation_2027", "4-2-3-1")
    squad = sp.get("full_squad_2027", [])
    print(f"\n=== {club['name']} (Formation: {form} | Most: {most_form}) | Squad size: {len(squad)} ===")
    for p in squad:
        print(f"   {p.get('name', ''):28s} | {p.get('position', ''):28s} | MV: {p.get('market_value', ''):12s}")
