-- =========================================================================
-- AMERICAN DREAM ENGLISH & CORPLEX SOLUTIONS
-- ESQUEMA COMPLETO DE ALMACENAMIENTO Y PERFILES PARA AVATARES (SUPABASE)
-- Permite sincronización multiplataforma y entre dispositivos de fotos de perfil
-- =========================================================================

-- 1. ASEGURAR COLUMNAS EN TABLA public.profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mcer_level TEXT;
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

-- Edición de perfil propio
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Inserción de perfil propio
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
-- 4.1 Lectura pública de avatares (permite que cualquier compañero en otra PC vea la foto)
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
CREATE POLICY "Public can view avatars" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- 4.2 Subida de avatares
DROP POLICY IF EXISTS "Allow avatar uploads" ON storage.objects;
CREATE POLICY "Allow avatar uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'avatars');

-- 4.3 Actualización de avatares existentes
DROP POLICY IF EXISTS "Allow avatar updates" ON storage.objects;
CREATE POLICY "Allow avatar updates" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'avatars');

-- 4.4 Eliminación de avatares
DROP POLICY IF EXISTS "Allow avatar deletes" ON storage.objects;
CREATE POLICY "Allow avatar deletes" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'avatars');

-- 5. REGISTRAR O ACTUALIZAR PERFIL DEMO OFICIAL DE VALERIA MORALES
INSERT INTO public.profiles (
  id,
  role,
  full_name,
  document_type,
  document_number,
  phone,
  email,
  mcer_level,
  origin_location
)
VALUES (
  'a1111111-1111-1111-1111-111111111111',
  'student',
  'Valeria Morales Montoya',
  'C.C.',
  '1.040.892.341',
  '+57 300 892 3410',
  'valeria.morales@americandream.edu.co',
  'A1 Principiante',
  'Turbo, Antioquia'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = 'Valeria Morales Montoya',
  document_number = '1.040.892.341',
  email = 'valeria.morales@americandream.edu.co';
