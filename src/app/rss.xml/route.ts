/**
 * TIYATROTIST — Global RSS 2.0 Feed Route Handler
 * Endpoint: /rss.xml
 * Incorporates all unified blog posts (Markdown & database)
 */

import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/blog-service';

export const dynamic = 'force-static';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const siteUrl = 'https://tiyatrotist.com.tr';

  let itemsXml = '';

  try {
    const posts = await getAllBlogPosts();

    if (posts && posts.length > 0) {
      itemsXml = posts
        .map((p) => {
          const title = escapeXml(p.title_tr || p.title_en || p.slug);
          const excerpt = escapeXml(p.excerpt_tr || p.excerpt_en || '');
          const link = `${siteUrl}/tr/blog/${p.slug}`;
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
    console.debug('[rss.xml] Error building RSS items:', err);
  }

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TIYATROTIST — Sistem Mühendisliği, Çekirdek ve Açık Kaynak</title>
    <link>${siteUrl}</link>
    <description>Sistem mimarisi, Linux çekirdeği, C++20, Qt 6, Rust, dağıtık simülasyon ve açık kaynak projeler.</description>
    <language>tr-TR</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
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
