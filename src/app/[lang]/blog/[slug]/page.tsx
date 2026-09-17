/**
 * TIYATROTIST — Public Blog Article Detail Page
 *
 * Editorial layout with:
 * - High-fidelity zero-dependency Markdown rendering (headers, code blocks, lists, quotes)
 * - Meta information (date, read time, featured badge)
 * - Queries directly from Supabase blog_posts table with zero fake posts
 * - Pure monochrome aesthetic matching Tiyatrotist design guidelines.
 */

import BlogReadingProgress from '@/components/blog/BlogReadingProgress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import BlogAdBanner from '@/components/blog/BlogAdBanner';
import BlogTableOfContents from '@/components/blog/BlogTableOfContents';
import BlogAudioPlayer from '@/components/blog/BlogAudioPlayer';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';
import { Locale, getDictionary } from '@/dictionaries';
import { supabase } from '@/lib/supabase';
import { BlogPostItem } from '@/types/blog';

interface BlogPostDetailPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const staticParams: { lang: string; slug: string }[] = [];

  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('published', true);

    if (data && data.length > 0) {
      for (const post of data) {
        if (post.slug) {
          staticParams.push({ lang: 'tr', slug: post.slug });
          staticParams.push({ lang: 'en', slug: post.slug });
        }
      }
    }
  } catch {
    // ignore
  }

  // Next.js output: 'export' requires at least one path definition per dynamic route
  if (staticParams.length === 0) {
    staticParams.push({ lang: 'tr', slug: 'not-found' });
    staticParams.push({ lang: 'en', slug: 'not-found' });
  }

  return staticParams;
}

export default async function BlogPostDetailPage({ params }: BlogPostDetailPageProps) {
  const { lang, slug } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);
  const b = dict.blogPage;

  console.debug(`[public/blog/slug] Fetching article: ${slug} (${currentLang})`);

  let post: BlogPostItem | null = null;
  let otherPosts: BlogPostItem[] = [];

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .limit(1)
      .single();

    if (!error && data) {
      post = {
        id: data.id,
        slug: data.slug,
        title_tr: data.title_tr || '',
        title_en: data.title_en || '',
        excerpt_tr: data.excerpt_tr || '',
        excerpt_en: data.excerpt_en || '',
        content_tr: data.content_tr || '',
        content_en: data.content_en || '',
        cover_image: data.cover_image,
        tags: data.tags || ['Tech'],
        read_time_tr: '4 dk okuma',
        read_time_en: '4 min read',
        published: data.published,
        featured: data.featured || false,
        likes_count: data.likes_count || 0,
        views_count: data.views_count || 0,
        published_at: data.published_at || data.created_at,
      };

      // Query other published posts for recommendations
      const { data: recs } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .neq('slug', slug)
        .order('published_at', { ascending: false })
        .limit(2);

      if (recs) {
        otherPosts = recs.map((r) => ({
          id: r.id,
          slug: r.slug,
          title_tr: r.title_tr,
          title_en: r.title_en,
          excerpt_tr: r.excerpt_tr,
          excerpt_en: r.excerpt_en,
          published: r.published,
          featured: r.featured || false,
        }));
      }
    }
  } catch (err) {
    console.debug('[public/blog/slug] Supabase lookup error:', err);
  }

  // 404 state if article not found
  if (!post) {
    return (
      <main className="main-container">
        <Header lang={currentLang} dict={dict} />
        <div className="page-container" style={{ maxWidth: '800px' }}>
          <header className="page-header">
            <span className="page-tag">[ 404 // NOT FOUND ]</span>
            <h1 className="page-title">{b.notFoundTitle}</h1>
            <p className="page-subtitle">{b.notFoundSubtitle}</p>
          </header>

          <Link
            href={`/${currentLang}/blog`}
            className="project-intro__enter-btn"
            style={{ width: 'fit-content', marginTop: '1.5rem' }}
            data-cursor="expand"
          >
            {b.backBtn}
          </Link>
        </div>
        <Footer lang={currentLang} dict={dict} />
      </main>
    );
  }

  const displayTitle = (currentLang === 'tr' ? post.title_tr : post.title_en) || post.title_tr || post.title_en || post.slug;
  const displayContent = (currentLang === 'tr' ? post.content_tr : post.content_en) || post.content_tr || post.content_en || '';
  const readTime = (currentLang === 'tr' ? post.read_time_tr : post.read_time_en) || (currentLang === 'tr' ? '4 dk okuma' : '4 min read');
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString(currentLang === 'tr' ? 'tr-TR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <main className="main-container">
      {/* Top Editorial Reading Progress Bar */}
      <BlogReadingProgress />

      <Header lang={currentLang} dict={dict} />
      <div className="page-container" style={{ maxWidth: '1080px' }}>
        {/* Back navigation */}
        <nav style={{ marginBottom: '1.5rem' }}>
          <Link
            href={`/${currentLang}/blog`}
            style={{
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              letterSpacing: '0.15em',
              color: 'rgba(255, 255, 255, 0.5)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'color 0.2s ease',
            }}
            data-cursor="expand"
          >
            {b.backBtn}
          </Link>
        </nav>

        {/* Article Header */}
        <header className="page-header" style={{ marginBottom: '2.5rem', gap: '0.75rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
            <span className="page-tag" style={{ color: 'rgba(255,255,255,0.45)' }}>
              [ BLOG // {dateStr} // {readTime.toUpperCase()} ]
            </span>
            {post.featured && (
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'monospace',
                  letterSpacing: '0.12em',
                  color: '#000000',
                  background: '#ffffff',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '2px',
                  fontWeight: 700,
                }}
              >
                [ {b.featured.toUpperCase()} ]
              </span>
            )}
          </div>

          <h1
            className="page-title"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.25,
              fontWeight: 500,
              letterSpacing: '-0.02em',
            }}
          >
            {displayTitle}
          </h1>
        </header>

        {/* Cover Image if present */}
        {post.cover_image && (
          <div
            style={{
              marginBottom: '2.5rem',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_image} alt={displayTitle} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}

        {/* 2-Column Responsive Layout: Article Body + Table of Contents */}
        <div
          className="blog-detail-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 240px',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Main Article Column */}
          <div style={{ minWidth: 0 }}>
            {/* Editorial Audio Player & Podcast Synthesis */}
            <BlogAudioPlayer
              content={displayContent}
              title={displayTitle}
              lang={currentLang}
              estimatedMinutes={4}
            />

            {/* Article Body (Rendered with MarkdownRenderer) */}
            <article className="blog-article-body" style={{ minHeight: '300px' }}>
              <MarkdownRenderer content={displayContent} />
            </article>

            {/* End of Transmission Architectural Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '4rem 0 2rem 0',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '1px',
                  borderTop: '1px dashed rgba(255, 255, 255, 0.12)',
                }}
              />
              <span
                style={{
                  position: 'relative',
                  background: 'var(--color-bg, #0a0a0a)',
                  padding: '0 1.25rem',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: '0.68rem',
                  letterSpacing: '0.22em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  textTransform: 'uppercase',
                }}
              >
                [ // {currentLang === 'tr' ? 'MAKALE SONU // KAYIT TAMAMLANDI' : 'END OF TRANSMISSION // ARCHIVE LOG CLOSED'} // ]
              </span>
            </div>

            {/* Archival Colophon / Metadata Card */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.015)',
                borderRadius: '4px',
                fontSize: '0.74rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                color: 'rgba(255, 255, 255, 0.55)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span>
                  <strong style={{ color: '#ffffff', fontWeight: 600 }}>{currentLang === 'tr' ? 'Yazar:' : 'Author:'}</strong> Buğra // Tiyatrotist
                </span>
                <span>
                  <strong style={{ color: '#ffffff', fontWeight: 600 }}>{currentLang === 'tr' ? 'Kayıt Tarihi:' : 'Recorded:'}</strong> {dateStr}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span>
                  <strong style={{ color: '#ffffff', fontWeight: 600 }}>{currentLang === 'tr' ? 'Lisans:' : 'License:'}</strong> Creative Commons BY-NC 4.0
                </span>
                <span>
                  <strong style={{ color: '#ffffff', fontWeight: 600 }}>{currentLang === 'tr' ? 'Okuma Süresi:' : 'Reading Time:'}</strong> {readTime}
                </span>
              </div>
            </div>

            {/* Official Google AdSense In-Article Banner */}
            <BlogAdBanner lang={currentLang} variant="in-article" />

            {/* Newsletter Subscription Box */}
            <NewsletterSubscribe lang={currentLang} />
          </div>

          {/* Sticky Table of Contents Column */}
          <div className="blog-toc-column">
            <BlogTableOfContents content={displayContent} lang={currentLang} />
          </div>
        </div>

        {/* Post Footer & Related Posts */}
        <div
          style={{
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '3rem',
            }}
          >
            <Link
              href={`/${currentLang}/blog`}
              className="project-intro__enter-btn"
              data-cursor="expand"
            >
              {b.backBtn}
            </Link>
          </div>

          {/* Related Articles (Only shown if real other posts exist) */}
          {otherPosts.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  letterSpacing: '0.2em',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '1.25rem',
                }}
              >
                [ {b.relatedTitle} ]
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {otherPosts.map((rPost) => {
                  const rTitle = (currentLang === 'tr' ? rPost.title_tr : rPost.title_en) || rPost.title_tr;
                  const rExcerpt = (currentLang === 'tr' ? rPost.excerpt_tr : rPost.excerpt_en) || '';
                  return (
                    <Link
                      key={rPost.slug}
                      href={`/${currentLang}/blog/${rPost.slug}`}
                      style={{
                        display: 'block',
                        textDecoration: 'none',
                        padding: '1.25rem',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '4px',
                        transition: 'border-color 0.2s ease',
                      }}
                      data-cursor="expand"
                    >
                      <h3 style={{ fontSize: '1rem', fontWeight: 500, color: '#fff', marginBottom: '0.5rem' }}>
                        {rTitle}
                      </h3>
                      {rExcerpt && (
                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>
                          {rExcerpt.slice(0, 100)}...
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer lang={currentLang} dict={dict} />
    </main>
  );
}
