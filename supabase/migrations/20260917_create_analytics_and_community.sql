-- ==============================================================================
-- TIYATROTIST — Analytics, Community Reactions & Newsletter Schema
-- Execute in Supabase SQL Editor if using cloud database.
-- ==============================================================================

-- 1. Extend blog_posts with metrics
ALTER TABLE public.blog_posts 
  ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0 NOT NULL;

-- 2. Page Views & Analytics Table (Privacy-focused: No IP, No Personal Data)
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  device TEXT DEFAULT 'desktop',
  session_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow public to insert view records
DROP POLICY IF EXISTS "Public can insert page views" ON public.page_views;
CREATE POLICY "Public can insert page views"
  ON public.page_views
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated admins to read page views
DROP POLICY IF EXISTS "Admins can view page views" ON public.page_views;
CREATE POLICY "Admins can view page views"
  ON public.page_views
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  lang TEXT DEFAULT 'tr',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public to subscribe (insert only)
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public can subscribe to newsletter"
  ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated admins full access to subscribers
DROP POLICY IF EXISTS "Admins can manage newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can manage newsletter subscribers"
  ON public.newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Atomic Increment RPC Functions
CREATE OR REPLACE FUNCTION public.increment_blog_likes(post_slug TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.blog_posts
  SET likes_count = likes_count + 1
  WHERE slug = post_slug
  RETURNING likes_count INTO new_count;
  
  RETURN coalesce(new_count, 0);
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_blog_views(post_slug TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.blog_posts
  SET views_count = views_count + 1
  WHERE slug = post_slug
  RETURNING views_count INTO new_count;
  
  RETURN coalesce(new_count, 0);
END;
$$;
