import sys
from pathlib import Path
from dotenv import load_dotenv

backend_dir = Path(__file__).parent.parent / "backend"
sys.path.append(str(backend_dir))
load_dotenv(backend_dir / ".env")

from app.db.supabase_client import get_supabase_client

client = get_supabase_client()
res_before = client.table("clubs").select("id").execute()
count_before = len(res_before.data)
print(f"Total clubs before wipe: {count_before}")

# Delete all records from clubs table
if count_before > 0:
    for club in res_before.data:
        client.table("clubs").delete().eq("id", club["id"]).execute()

res_after = client.table("clubs").select("id").execute()
count_after = len(res_after.data)
print(f"Total clubs after wipe: {count_after}")
