-- =========================================================================
-- AMERICAN DREAM ENGLISH - PLATAFORMA LMS 2.0
-- ESQUEMA DE BASE DE DATOS Y RETENCIÓN PARA FORO ACADÉMICO COLABORATIVO
-- =========================================================================

-- 1. Tabla de Publicaciones Principales del Foro
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'student',
  author_avatar TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabla de Respuestas en Hilo (con ON DELETE CASCADE)
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'student',
  author_avatar TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Índices de Rendimiento para Búsqueda Rápida
CREATE INDEX IF NOT EXISTS idx_forum_posts_course_id ON public.forum_posts(course_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON public.forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post_id ON public.forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_created_at ON public.forum_replies(created_at ASC);

-- 4. Habilitar Seguridad por Fila (Row Level Security - RLS)
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- Políticas de Acceso: Lectura pública e Inserción para usuarios/estudiantes
DROP POLICY IF EXISTS "Allow read forum_posts" ON public.forum_posts;
CREATE POLICY "Allow read forum_posts" ON public.forum_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert forum_posts" ON public.forum_posts;
CREATE POLICY "Allow insert forum_posts" ON public.forum_posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read forum_replies" ON public.forum_replies;
CREATE POLICY "Allow read forum_replies" ON public.forum_replies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert forum_replies" ON public.forum_replies;
CREATE POLICY "Allow insert forum_replies" ON public.forum_replies FOR INSERT WITH CHECK (true);

-- 5. Función de Auto-Limpieza / Purga por Retención (TTL de 45 días)
-- Elimina automáticamente posts y respuestas con más de 45 días de antigüedad
CREATE OR REPLACE FUNCTION delete_old_forum_posts()
RETURNS void AS $$
BEGIN
  DELETE FROM public.forum_posts
  WHERE created_at < NOW() - INTERVAL '45 days';
END;
$$ LANGUAGE plpgsql;

-- 6. Configuración de Bucket de Almacenamiento (Supabase Storage)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('forum-attachments', 'forum-attachments', true) 
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para el bucket forum-attachments
DROP POLICY IF EXISTS "Allow public read forum attachments" ON storage.objects;
CREATE POLICY "Allow public read forum attachments" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'forum-attachments');

DROP POLICY IF EXISTS "Allow public upload forum attachments" ON storage.objects;
CREATE POLICY "Allow public upload forum attachments" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'forum-attachments');
