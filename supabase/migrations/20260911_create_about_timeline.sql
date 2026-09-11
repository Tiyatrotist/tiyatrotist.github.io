-- ==============================================================================
-- Migration: Create about_timeline table for About Page schematic timeline
-- Date: 2026-09-11
-- ==============================================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.about_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL DEFAULT '01',
  year VARCHAR(10) NOT NULL DEFAULT '2026',
  period_tr VARCHAR(100) NOT NULL,
  period_en VARCHAR(100) NOT NULL,
  title_tr VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  desc_tr TEXT NOT NULL,
  desc_en TEXT NOT NULL,
  status_tr VARCHAR(50) NOT NULL DEFAULT 'YAYINLANDI',
  status_en VARCHAR(50) NOT NULL DEFAULT 'RELEASED',
  tag VARCHAR(50) DEFAULT 'SOFTWARE',
  side VARCHAR(10) NOT NULL DEFAULT 'right' CHECK (side IN ('left', 'right')),
  sort_order INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_about_timeline_sort ON public.about_timeline(sort_order ASC, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_about_timeline_enabled ON public.about_timeline(enabled);

-- 3. Enable RLS
ALTER TABLE public.about_timeline ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Public can read enabled milestones
DROP POLICY IF EXISTS "Public can view enabled about milestones" ON public.about_timeline;
CREATE POLICY "Public can view enabled about milestones"
  ON public.about_timeline
  FOR SELECT
  USING (enabled = true);

-- Authenticated users (admin) have full CRUD access
DROP POLICY IF EXISTS "Authenticated users can manage about milestones" ON public.about_timeline;
CREATE POLICY "Authenticated users can manage about milestones"
  ON public.about_timeline
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Seed initial 6 milestones if empty
INSERT INTO public.about_timeline (code, year, period_tr, period_en, title_tr, title_en, desc_tr, desc_en, status_tr, status_en, tag, side, sort_order, enabled)
SELECT '01', '2026', '2026 // AĞUSTOS', '2026 // AUGUST', 'BookOS v1.2.0 Kararlı Sürümü', 'BookOS v1.2.0 Stable Release', 'Edebiyat, derin odaklanma ve dokunsal bilgi sentezi için bağımsız masaüstü çalışma alanı işletim sistemi mimarisi.', 'Independent desktop operating system environment engineered for deep focus, literature, and tactile knowledge synthesis.', 'YAYINLANDI', 'RELEASED', 'SOFTWARE', 'right', 1, true
WHERE NOT EXISTS (SELECT 1 FROM public.about_timeline WHERE code = '01');

INSERT INTO public.about_timeline (code, year, period_tr, period_en, title_tr, title_en, desc_tr, desc_en, status_tr, status_en, tag, side, sort_order, enabled)
SELECT '02', '2026', '2026 // MAYIS', '2026 // MAY', 'Tiyatrotist Parçacık Tipografi Motoru', 'Tiyatrotist Particle Typography Engine', 'Geleneksel piksel kutu modelini baypas eden, 60 FPS hızında çalışan sıfır bağımlılıklı canvas parçacık fiziği motoru.', 'Zero-dependency canvas particle engine rendering dynamic typography at 60 FPS, bypassing conventional DOM box models.', 'ÇALIŞIYOR', 'ACTIVE', 'ARCHITECTURE', 'left', 2, true
WHERE NOT EXISTS (SELECT 1 FROM public.about_timeline WHERE code = '02');

INSERT INTO public.about_timeline (code, year, period_tr, period_en, title_tr, title_en, desc_tr, desc_en, status_tr, status_en, tag, side, sort_order, enabled)
SELECT '03', '2025', '2025 // KASIM', '2025 // NOVEMBER', 'Sistem Mimarisi Hackathonu Birinciliği', 'System Architecture Hackathon 1st Place', '48 saatlik yarışmada geliştirilen düşük gecikmeli dağıtık veri akışı ve istemci senkronizasyon protokolü ile 1.lik ödülü.', 'Awarded 1st place for designing a low-latency distributed stream protocol and zero-cost client state synchronization.', '1.LİK ÖDÜLÜ', '1ST PRIZE', 'ACHIEVEMENT', 'right', 3, true
WHERE NOT EXISTS (SELECT 1 FROM public.about_timeline WHERE code = '03');

INSERT INTO public.about_timeline (code, year, period_tr, period_en, title_tr, title_en, desc_tr, desc_en, status_tr, status_en, tag, side, sort_order, enabled)
SELECT '04', '2025', '2025 // TEMMUZ', '2025 // JULY', 'Blok Tabanlı Headless CMS & Builder', 'Block-Based Headless CMS & Builder', 'Monokrom tasarım sistemine adanmış dinamik şablonlar ve yapay zeka destekli çift dilli çeviri motoru mimarisi.', 'Custom headless block builder tailored for monochrome digital environments with automated bilingual caching.', 'TAMAMLANDI', 'VERIFIED', 'ENGINE', 'left', 4, true
WHERE NOT EXISTS (SELECT 1 FROM public.about_timeline WHERE code = '04');

INSERT INTO public.about_timeline (code, year, period_tr, period_en, title_tr, title_en, desc_tr, desc_en, status_tr, status_en, tag, side, sort_order, enabled)
SELECT '05', '2024', '2024 // EYLÜL', '2024 // SEPTEMBER', 'Web Tabanlı Etkileşimli Terminal Emülatörü', 'Web-Based Interactive Terminal Emulator', 'Tarayıcıda Unix boru hatları, sanal dosya sistemi ve CLI komut çalıştırma kabiliyetine sahip ultra hafif terminal çekirdeği.', 'Ultra-lightweight browser terminal emulator featuring Unix-style pipes, filesystem navigation, and custom command evaluation.', 'AÇIK KAYNAK', 'OPEN SOURCE', 'SOFTWARE', 'right', 5, true
WHERE NOT EXISTS (SELECT 1 FROM public.about_timeline WHERE code = '05');

INSERT INTO public.about_timeline (code, year, period_tr, period_en, title_tr, title_en, desc_tr, desc_en, status_tr, status_en, tag, side, sort_order, enabled)
SELECT '06', '2024', '2024 // OCAK', '2024 // JANUARY', 'TIYATROTIST Stüdyosu & Manifestosu', 'TIYATROTIST Studio & Manifesto Founded', '“Kod ve sahne arasında” mottosuyla; saf tipografi, mantık ve mekanın tek bir sessiz monokrom ortamda buluştuğu atölye.', 'Experimental digital studio established under the ethos "between code & stage" — uniting pure logic and monochrome space.', 'TEMEL TAŞI', 'FOUNDATION', 'FOUNDING', 'left', 6, true
WHERE NOT EXISTS (SELECT 1 FROM public.about_timeline WHERE code = '06');
