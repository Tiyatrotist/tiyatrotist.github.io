/**
 * TIYATROTIST — Localized RSS Feed Route Handler
 * Endpoint: /[lang]/rss.xml
 * Incorporates all unified blog posts (Markdown & database)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/blog-service';

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
  const siteUrl = 'https://tiyatrotist.com.tr';

  let itemsXml = '';

  try {
    const posts = await getAllBlogPosts();

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
          const rawDate = p.published_at || p.created_at;
          const pubDate = rawDate ? new Date(rawDate).toUTCString() : new Date().toUTCString();
          const category = p.category ? `<category>${escapeXml(p.category)}</category>` : '';

          return `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${excerpt}</description>
      <pubDate>${pubDate}</pubDate>
      ${category}
    </item>`;
        })
        .join('');
    }
  } catch (err) {
    console.debug('[lang/rss.xml] Error building RSS items:', err);
  }

  const feedTitle = currentLang === 'tr'
    ? 'TIYATROTIST — Sistem Mühendisliği, Çekirdek ve Açık Kaynak'
    : 'TIYATROTIST — Systems Engineering, Kernel & Open Source';

  const feedDesc = currentLang === 'tr'
    ? 'Sistem mimarisi, Linux çekirdeği, C++20, Qt 6, Rust, dağıtık simülasyon ve açık kaynak projeler.'
    : 'Systems architecture, Linux kernel, C++20, Qt 6, Rust, distributed simulation, and open-source projects.';

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${feedTitle}</title>
    <link>${siteUrl}/${currentLang}</link>
    <description>${feedDesc}</description>
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
