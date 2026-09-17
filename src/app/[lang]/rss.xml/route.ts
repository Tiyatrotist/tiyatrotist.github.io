/**
 * TIYATROTIST — Localized RSS Feed Route Handler
 * Endpoint: /[lang]/rss.xml
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ lang: 'tr' }, { lang: 'en' }];
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  const currentLang = lang === 'en' ? 'en' : 'tr';
  const siteUrl = 'https://tiyatrotist.com';

  let itemsXml = '';

  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, title_tr, title_en, excerpt_tr, excerpt_en, published_at, created_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(20);

    if (posts && posts.length > 0) {
      itemsXml = posts
        .map((p) => {
          const title = escapeXml(
            currentLang === 'tr'
              ? p.title_tr || p.title_en || p.slug
              : p.title_en || p.title_tr || p.slug
          );
          const excerpt = escapeXml(
            currentLang === 'tr' ? p.excerpt_tr || p.excerpt_en || '' : p.excerpt_en || p.excerpt_tr || ''
          );
          const link = `${siteUrl}/${currentLang}/blog/${p.slug}`;
          const pubDate = new Date(p.published_at || p.created_at).toUTCString();

          return `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${excerpt}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
        })
        .join('');
    }
  } catch (err) {
    console.debug('[lang/rss.xml] Error building RSS items:', err);
  }

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TIYATROTIST — ${currentLang === 'tr' ? 'Saf Monokrom Dijital Ortam' : 'Pure Monochrome Digital Environment'}</title>
    <link>${siteUrl}/${currentLang}</link>
    <description>${currentLang === 'tr' ? 'Yazılar, mimari analizler ve teknik notlar.' : 'Essays, architectural analyses and technical notes.'}</description>
    <language>${currentLang === 'tr' ? 'tr-TR' : 'en-US'}</language>
    <atom:link href="${siteUrl}/${currentLang}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
