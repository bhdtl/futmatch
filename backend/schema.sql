-- ============================================================
-- FutMatch Pro — Supabase Database Schema
-- Project Reference: xrytnuhucuqmyoytdtch
-- ============================================================

-- 1. Clubs Table
CREATE TABLE IF NOT EXISTS public.clubs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo_short TEXT NOT NULL,
    league TEXT NOT NULL,
    primary_tactics TEXT[] NOT NULL DEFAULT '{}',
    target_positions TEXT[] NOT NULL DEFAULT '{}',
    preferred_foot TEXT NOT NULL DEFAULT 'Rechts',
    ideal_age_min INT NOT NULL DEFAULT 18,
    ideal_age_max INT NOT NULL DEFAULT 35,
    contract_expiring_count JSONB NOT NULL DEFAULT '{}'::jsonb,
    squad_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
    base_rating INT NOT NULL DEFAULT 80,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Client Profiles Table
CREATE TABLE IF NOT EXISTS public.client_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT,
    position TEXT NOT NULL,
    age INT NOT NULL,
    age_group TEXT NOT NULL,
    preferred_foot TEXT NOT NULL,
    contract_status TEXT NOT NULL,
    market_value_eur BIGINT DEFAULT 1000000,
    archetype TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Match History Table
CREATE TABLE IF NOT EXISTS public.match_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_profile_id UUID REFERENCES public.client_profiles(id) ON DELETE CASCADE,
    club_id TEXT REFERENCES public.clubs(id) ON DELETE CASCADE,
    match_score INT NOT NULL,
    tactical_fit_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Generated Dossiers Table
CREATE TABLE IF NOT EXISTS public.dossiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id TEXT REFERENCES public.clubs(id) ON DELETE CASCADE,
    client_profile_id UUID REFERENCES public.client_profiles(id) ON DELETE CASCADE,
    pitch_letter_template TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Enablement
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dossiers ENABLE ROW LEVEL SECURITY;

-- Public read access policies for anon role
CREATE POLICY "Allow public read access to clubs" ON public.clubs FOR SELECT USING (true);
CREATE POLICY "Allow public all on client_profiles" ON public.client_profiles FOR ALL USING (true);
CREATE POLICY "Allow public all on match_history" ON public.match_history FOR ALL USING (true);
CREATE POLICY "Allow public all on dossiers" ON public.dossiers FOR ALL USING (true);
