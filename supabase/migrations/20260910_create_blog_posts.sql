-- ==============================================================================
-- TIYATROTIST — Blog Posts Table Schema & RLS Policies
-- Execute this SQL script in your Supabase SQL Editor.
-- ==============================================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_tr TEXT,
  title_en TEXT,
  excerpt_tr TEXT,
  excerpt_en TEXT,
  content_tr TEXT,
  content_en TEXT,
  cover_image TEXT,
  category TEXT DEFAULT 'Engineering',
  tags TEXT[] DEFAULT ARRAY['Tech'],
  published BOOLEAN DEFAULT false NOT NULL,
  featured BOOLEAN DEFAULT false NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Create Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies:
-- Allow anyone (public anon) to read only PUBLISHED articles
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;
CREATE POLICY "Public can view published blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (published = true);

-- Allow authenticated admins full access (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Authenticated users full access to blog posts" ON public.blog_posts;
CREATE POLICY "Authenticated users full access to blog posts"
  ON public.blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Optional Seed Data
INSERT INTO public.blog_posts (
  slug,
  title_tr,
  title_en,
  excerpt_tr,
  excerpt_en,
  content_tr,
  content_en,
  category,
  tags,
  published,
  featured,
  published_at
) VALUES (
  'monokrom-dijital-deneyimler-arayuz-kilif-degildir',
  'Monokrom Dijital Deneyimler: Arayüz Bir Kılıf Değildir',
  'Monochrome Digital Experiences: The Interface Is Not a Wrapper',
  'Web arayüzlerini renkli kutular ve şablonlar olarak görmek yerine; tipografi, saf mantık ve mekanın tek bir sessiz ortamda birleştiği canlı bir kompozisyon olarak ele almak.',
  'Rather than treating web interfaces as colorful templates and boxes, we view every canvas as a living composition where typography, pure logic, and space converge.',
  '# Monokrom Dijital Deneyimler\n\nArayüz bir kılıf değildir. Tipografi, kod ve mekanın tek bir sessiz ortamda birleştiği canlı bir tuvaldir.',
  '# Monochrome Digital Experiences\n\nThe interface is not a wrapper. It is a living canvas where typography, code, and space converge in a quiet medium.',
  'Design Discipline',
  ARRAY['Manifesto', 'Monochrome', 'Design Discipline'],
  true,
  true,
  now()
) ON CONFLICT (slug) DO NOTHING;
