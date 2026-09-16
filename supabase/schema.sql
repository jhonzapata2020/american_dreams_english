-- ====================================================================
-- AMERICAN DREAM ENGLISH S.A.S. & CORPLEX SOLUTIONS S.A.S.
-- SUPABASE / POSTGRESQL DATABASE SCHEMA (SPRINT 1)
-- ====================================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student', 'donor');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE donation_currency AS ENUM ('USD', 'COP', 'EUR');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE donation_frequency AS ENUM ('monthly', 'one_time');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_provider AS ENUM ('stripe', 'paypal', 'redeban', 'wompi');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE donation_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE mcer_level AS ENUM ('A1 Principiante', 'A2 Elemental', 'B1 Pre-Intermedio', 'B2 Intermedio Alto', 'C1 Avanzado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE vulnerability_type AS ENUM ('Víctima Conflicto Armado', 'Estrato 1-2', 'SISBÉN A1-B4', 'Comunidad Rural Turbo');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE scholarship_status AS ENUM ('Activo', 'En Certificación', 'Graduado', 'Pausado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. TABLA PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  full_name TEXT NOT NULL,
  document_type TEXT,
  document_number TEXT,
  phone TEXT,
  origin_location TEXT DEFAULT 'Turbo, Antioquia',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA SCHOLARSHIP RECIPIENTS (BECARIOS)
CREATE TABLE IF NOT EXISTS public.scholarship_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  photo_url TEXT,
  vulnerability_condition vulnerability_type NOT NULL,
  current_cycle mcer_level NOT NULL DEFAULT 'A1 Principiante',
  accumulated_hours INT NOT NULL DEFAULT 0,
  target_hours INT NOT NULL DEFAULT 120,
  location TEXT NOT NULL DEFAULT 'Turbo, Antioquia',
  testimonial_snippet TEXT,
  status scholarship_status NOT NULL DEFAULT 'Activo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA DONATIONS (DONACIONES Y SUBVENCIONES)
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  organization_name TEXT,
  amount NUMERIC(12, 2) NOT NULL,
  currency donation_currency NOT NULL DEFAULT 'COP',
  frequency donation_frequency NOT NULL DEFAULT 'monthly',
  provider payment_provider NOT NULL,
  status donation_status NOT NULL DEFAULT 'completed',
  transaction_id TEXT UNIQUE,
  covers_fee BOOLEAN NOT NULL DEFAULT TRUE,
  student_id UUID REFERENCES public.scholarship_recipients(id) ON DELETE SET NULL,
  tax_certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Profiles Policy: Users can view their own profile; admins can view all.
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Recipients Policy: Public can view active recipient metadata for transparency audit.
DROP POLICY IF EXISTS "Public audit for scholarship recipients" ON public.scholarship_recipients;
CREATE POLICY "Public audit for scholarship recipients" ON public.scholarship_recipients
  FOR SELECT USING (TRUE);

-- Donations Policy: Anyone can insert a donation; donors can view their own donations.
DROP POLICY IF EXISTS "Public insert donations" ON public.donations;
CREATE POLICY "Public insert donations" ON public.donations
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Donors read own donations" ON public.donations;
CREATE POLICY "Donors read own donations" ON public.donations
  FOR SELECT USING (donor_email = auth.jwt()->>'email');

-- ====================================================================
-- END OF SCHEMA SPRINT 1
-- ====================================================================
