import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://xrytnuhucuqmyoytdtch.supabase.co")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# Initialize Client
supabase: Client = None

try:
    key_to_use = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY
    if SUPABASE_URL and key_to_use:
        supabase = create_client(SUPABASE_URL, key_to_use)
        print("[Supabase] Client initialized successfully for:", SUPABASE_URL)
except Exception as e:
    print(f"[Supabase] Init warning: {e}")

def get_supabase_client() -> Client:
    return supabase
