import sys
import getpass
from pathlib import Path
sys.path.append(str(Path(__file__).parent))

from app.db.supabase_client import get_supabase_client

ADMIN_EMAIL = "phinampham3@gmail.com"

def create_admin_account(password: str):
    client = get_supabase_client()
    if not client:
        print("[ERROR] Supabase client is not initialized.")
        return False

    print(f"[Supabase Admin] Creating official Admin Account for: {ADMIN_EMAIL}...")

    try:
        # Create user via Supabase Admin Auth API using service role key
        res = client.auth.admin.create_user({
            "email": ADMIN_EMAIL,
            "password": password,
            "email_confirm": True
        })
        print(f"[SUCCESS] Admin account created successfully for {ADMIN_EMAIL}!")
        print("  User ID:", res.user.id)
        return True
    except Exception as e:
        print(f"[NOTICE] Admin account creation notice: {e}")
        print("  (If the user already exists in Supabase, you can log in directly or reset password in Supabase Dashboard.)")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        pwd = sys.argv[1]
    else:
        pwd = input("Enter strong password for phinampham3@gmail.com: ")
    create_admin_account(pwd)
