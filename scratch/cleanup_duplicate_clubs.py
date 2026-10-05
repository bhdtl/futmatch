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

print(f"Total clubs before cleanup: {len(clubs)}")

# Legacy static string IDs that have numeric CLB-<tm_id> replacements
legacy_ids_to_remove = [
    "CLB-F95", "CLB-RWE", "CLB-FCS", "CLB-DSC", "CLB-SGD", "CLB-M60",
    "CLB-SVS", "CLB-REG", "CLB-SVW", "CLB-AUE", "CLB-VIK", "CLB-VFL",
    "CLB-FCH", "CLB-SCV", "CLB-FCI"
]

removed_count = 0
for legacy_id in legacy_ids_to_remove:
    # Check if this ID exists
    matching = [c for c in clubs if c["id"] == legacy_id]
    if matching:
        client.table("clubs").delete().eq("id", legacy_id).execute()
        removed_count += 1
        print(f"Deleted legacy duplicate: {legacy_id} ({matching[0]['name']})")

res_after = client.table("clubs").select("*").execute()
print(f"Total clubs after cleanup: {len(res_after.data)}")
