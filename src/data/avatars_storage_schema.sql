-- =========================================================================
-- AMERICAN DREAM ENGLISH & CORPLEX SOLUTIONS
-- ESQUEMA COMPLETO DE ALMACENAMIENTO Y PERFILES PARA AVATARES (SUPABASE)
-- Sincronización multidispositivo de fotos de perfil (bucket avatars & profiles)
-- =========================================================================

-- 1. ASEGURAR COLUMNAS EN TABLA public.profiles (Resuelve error 42703)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS document_type TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS document_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mcer_level TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS origin_location TEXT DEFAULT 'Turbo, Antioquia';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. HABILITAR ROW LEVEL SECURITY (RLS) EN PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Lectura de perfiles: Compañeros, profesores y administradores pueden ver fotos y nombres
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
CREATE POLICY "Public can view profiles" ON public.profiles
  FOR SELECT TO anon
  USING (true);

-- Edición de perfil propio (USING + WITH CHECK)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Inserción de perfil propio (Sintaxis estricta PostgreSQL: solo WITH CHECK para INSERT)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- 3. CREAR BUCKET PÚBLICO 'avatars' EN SUPABASE STORAGE
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true, 
  10485760, -- 10MB máximo
  ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];

-- 4. POLÍTICAS DE ACCESO PARA SUPABASE STORAGE (storage.objects)
-- 4.1 Lectura pública de avatares (permite que compañeros y profesores vean fotos desde cualquier dispositivo)
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
CREATE POLICY "Public can view avatars" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- 4.2 Subida de avatares (INSERT usa WITH CHECK)
DROP POLICY IF EXISTS "Allow avatar uploads" ON storage.objects;
CREATE POLICY "Allow avatar uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'avatars');

-- 4.3 Actualización de avatares (UPDATE usa USING)
DROP POLICY IF EXISTS "Allow avatar updates" ON storage.objects;
CREATE POLICY "Allow avatar updates" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'avatars');

-- 4.4 Eliminación de avatares (DELETE usa USING)
DROP POLICY IF EXISTS "Allow avatar deletes" ON storage.objects;
CREATE POLICY "Allow avatar deletes" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'avatars');
