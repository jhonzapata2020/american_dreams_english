-- =========================================================================
-- ESQUEMA DE ALMACENAMIENTO PARA AVATARES (SUPABASE STORAGE)
-- Convierte y almacena avatares WebP de estudiantes y docentes en la nube
-- =========================================================================

-- 1. Crear el Bucket público 'avatars' si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Permitir lectura pública de cualquier avatar
DROP POLICY IF EXISTS "Allow public read avatars" ON storage.objects;
CREATE POLICY "Allow public read avatars" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

-- 3. Permitir subida y actualización de avatares
DROP POLICY IF EXISTS "Allow public upload avatars" ON storage.objects;
CREATE POLICY "Allow public upload avatars" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Allow public update avatars" ON storage.objects;
CREATE POLICY "Allow public update avatars" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'avatars');
