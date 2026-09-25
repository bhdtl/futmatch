-- ============================================================
-- FutMatch Pro — Supabase Security & Admin Authorization RLS
-- Authorized Admin Email: phinampham3@gmail.com
-- ============================================================

-- 1. Table for Demo Requests / Lead Inquiries (Public Insertable)
CREATE TABLE IF NOT EXISTS public.demo_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    agency_name TEXT NOT NULL,
    client_count TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on demo_requests
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on demo_requests" ON public.demo_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read on demo_requests" ON public.demo_requests FOR SELECT USING (auth.jwt() ->> 'email' = 'phinampham3@gmail.com');

-- 2. Restrict Clubs & Matching Tables to Admin Email (phinampham3@gmail.com)
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dossiers ENABLE ROW LEVEL SECURITY;

-- Drop previous open policies
DROP POLICY IF EXISTS "Allow public read access to clubs" ON public.clubs;
DROP POLICY IF EXISTS "Allow public all on client_profiles" ON public.client_profiles;
DROP POLICY IF EXISTS "Allow public all on match_history" ON public.match_history;
DROP POLICY IF EXISTS "Allow public all on dossiers" ON public.dossiers;

-- Strict Admin Only Policies for phinampham3@gmail.com
CREATE POLICY "Admin full access on clubs" ON public.clubs 
    FOR ALL USING (auth.jwt() ->> 'email' = 'phinampham3@gmail.com');

CREATE POLICY "Admin full access on client_profiles" ON public.client_profiles 
    FOR ALL USING (auth.jwt() ->> 'email' = 'phinampham3@gmail.com');

CREATE POLICY "Admin full access on match_history" ON public.match_history 
    FOR ALL USING (auth.jwt() ->> 'email' = 'phinampham3@gmail.com');

CREATE POLICY "Admin full access on dossiers" ON public.dossiers 
    FOR ALL USING (auth.jwt() ->> 'email' = 'phinampham3@gmail.com');
