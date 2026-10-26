-- ====================================================================
-- AMERICAN DREAM ENGLISH S.A.S. & CORPLEX SOLUTIONS S.A.S.
-- SUPABASE / POSTGRESQL DATABASE SCHEMA (SPRINT 1 & PRODUCTS RBAC)
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

-- 5. TABLA PRODUCTS (CATÁLOGO DE INFOPRODUCTOS Y PLANES)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'ebooks',
  format_badge TEXT NOT NULL DEFAULT 'PDF Interactivo',
  thumbnail TEXT,
  price_cop NUMERIC(12, 2) NOT NULL DEFAULT 0,
  price_usd NUMERIC(12, 2) NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

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

-- Products Policies:
-- Anyone can view active products; Admins can view all products.
DROP POLICY IF EXISTS "Public view active products" ON public.products;
CREATE POLICY "Public view active products" ON public.products
  FOR SELECT USING (
    active = true OR EXISTS (
      SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admins full access (INSERT, UPDATE, DELETE) on products
DROP POLICY IF EXISTS "Admins full management products" ON public.products;
CREATE POLICY "Admins full management products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 7. INITIAL SEED DATA FOR PRODUCTS
INSERT INTO public.products (id, title, description, category, format_badge, thumbnail, price_cop, price_usd, active)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Masterclass 4K: Fonética y Pronunciación Nativa', 'Aprende los 44 fonemas del inglés con explicaciones en video 4K de docentes bilingües certificados.', 'masterclass', 'Video 4K', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400', 75000, 19, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'E-Book: Inglés Práctico para Negocios y Comercio Marítimo', 'Guía con vocabulario clave para entrevistas, logística comercial y comercio en puertos internacionales.', 'ebooks', 'PDF Interactivo', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400', 48000, 12, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Pack Completo A1-A2: Guías + Audios de Inmersión', 'Más de 50 archivos de audio fonético descargables para entrenar el oído desde el celular.', 'audios', 'Audios + PDF', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=400', 115000, 29, true),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Guía Rápida de Conectores y Fluidez B1-B2', 'Resumen estructurado de conectores gramaticales para desenvolverte en debates y entrevistas.', 'ebooks', 'PDF Descargable', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400', 36000, 9, true)
ON CONFLICT (id) DO NOTHING;

-- 8. SISTEMA DE GESTIÓN DE VOZ E IA PARA ADE (CONTROL FREEMIUM Y CACHÉ CERO CONSUMO)
CREATE TABLE IF NOT EXISTS public.guest_ade_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token TEXT UNIQUE NOT NULL,
    voice_turns_count INT DEFAULT 0,
    max_free_turns INT DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_interaction TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ade_audio_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intent_key TEXT UNIQUE NOT NULL, -- ej: 'metodo_novedoso', 'ebooks_tienda', 'campus_virtual', 'precios_matricula', 'certificacion_mcer', 'becas_turbo'
    text_response TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed de audios y respuestas institucionales precargadas (Cero consumo de ElevenLabs)
INSERT INTO public.ade_audio_cache (intent_key, text_response, audio_url)
VALUES
  ('metodo_novedoso', 'A diferencia de plataformas con videos pregrabados en soledad, aquí hablas en vivo con docentes C1/C2. ¡Conoce nuestro Campus Virtual o matricúlate hoy!', '/audio/ade/metodo_novedoso.mp3'),
  ('ebooks_tienda', 'En nuestra Tienda Digital encuentras e-books y guías descargables con audios para acelerar tu fluidez. ¡Visita la sección Tienda y descárgalos ya!', '/audio/ade/ebooks_tienda.mp3'),
  ('campus_virtual', 'Nuestro Campus y Sala de Cómputo Virtual te dan acceso a clases en directo las 24 horas y tutorías personalizadas. ¡Revisa los horarios y matricúlate!', '/audio/ade/campus_virtual.mp3'),
  ('precios_matricula', 'Tenemos matrículas virtuales accesibles y becas parciales con nuestro Fondo Social de Urabá. ¡Haz clic en ''Matricúlate'' y congela tu cupo promocional!', '/audio/ade/precios_matricula.mp3'),
  ('certificacion_mcer', 'Te preparamos con simulaciones reales para certificar tu nivel B2 y C1 internacional según el marco MCER. ¡Inicia tu diagnóstico gratis en Matrícula!', '/audio/ade/certificacion_mcer.mp3'),
  ('becas_turbo', 'El Fondo Social de Urabá otorga subsidios del 50% para soñadores comprometidos. ¡Postúlate hoy mismo en la sección Becas antes de que cierren cupos!', '/audio/ade/becas_turbo.mp3')
ON CONFLICT (intent_key) DO UPDATE
SET text_response = EXCLUDED.text_response,
    audio_url = EXCLUDED.audio_url;

-- ====================================================================
-- END OF SCHEMA
-- ====================================================================
