-- =========================================================================
-- AMERICAN DREAM ENGLISH - PLATAFORMA LMS 2.0
-- ESQUEMA DE BASE DE DATOS Y STORAGE PARA FORO ACADÉMICO COLABORATIVO
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

-- 2. Tabla de Respuestas en Hilo
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'student',
  author_avatar TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_forum_posts_course_id ON public.forum_posts(course_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post_id ON public.forum_replies(post_id);

-- 4. Habilitar Seguridad por Fila (Row Level Security)
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para estudiantes matriculados
CREATE POLICY "Public read forum_posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Public insert forum_posts" ON public.forum_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read forum_replies" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Public insert forum_replies" ON public.forum_replies FOR INSERT WITH CHECK (true);

-- 5. Bucket de Supabase Storage para Adjuntos
-- INSERT INTO storage.buckets (id, name, public) VALUES ('forum-attachments', 'forum-attachments', true) ON CONFLICT DO NOTHING;
