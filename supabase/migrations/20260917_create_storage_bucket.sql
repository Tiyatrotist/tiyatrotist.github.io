-- ==============================================================================
-- TIYATROTIST — Supabase Storage: 'site-media' Bucket & RLS Policies
-- Run this SQL in your Supabase Dashboard > SQL Editor to enable Media Uploads.
-- ==============================================================================

-- 1. Create the 'site-media' public storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-media',
  'site-media',
  true,
  52428800, -- 50 MB
  ARRAY[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'video/mp4',
    'video/webm'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'video/mp4',
    'video/webm'
  ];

-- 2. Allow public read access to all files in 'site-media'
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public can view site-media" ON storage.objects;
CREATE POLICY "Public can view site-media"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'site-media');

-- 3. Allow authenticated admins to upload files to 'site-media'
DROP POLICY IF EXISTS "Authenticated can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload site-media" ON storage.objects;
CREATE POLICY "Authenticated users can upload site-media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-media');

-- 4. Allow authenticated admins to update files in 'site-media'
DROP POLICY IF EXISTS "Authenticated can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update site-media" ON storage.objects;
CREATE POLICY "Authenticated users can update site-media"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-media');

-- 5. Allow authenticated admins to delete files from 'site-media'
DROP POLICY IF EXISTS "Authenticated can delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete site-media" ON storage.objects;
CREATE POLICY "Authenticated users can delete site-media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-media');
