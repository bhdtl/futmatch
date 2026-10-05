import sys
from pathlib import Path
from dotenv import load_dotenv

backend_dir = Path(__file__).parent.parent / "backend"
sys.path.append(str(backend_dir))
load_dotenv(backend_dir / ".env")

from app.db.supabase_client import get_supabase_client

client = get_supabase_client()
res = client.table("clubs").select("*").execute()
clubs = res.data

print(f"Total clubs in DB: {len(clubs)}")
l3_clubs = [c for c in clubs if "3. liga" in c.get("league", "").lower()]
print(f"Total 3. Liga clubs: {len(l3_clubs)}")
for c in l3_clubs:
    sp = c.get("squad_profile", {})
    squad = sp.get("full_squad_2027", [])
    xi = sp.get("starting_xi_2027", [])
    dt = sp.get("deep_tactics", {})
    print(f"[{c['id']}] {c['name']:30s} | League: {c['league']:15s} | Squad: {len(squad)} | XI: {len(xi)} | Tracking: {dt.get('has_advanced_tracking')}")
