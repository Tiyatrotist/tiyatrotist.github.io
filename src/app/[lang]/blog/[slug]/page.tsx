import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Locale, getDictionary } from '@/dictionaries';
import { supabase } from '@/lib/supabase';

interface BlogPostDetailPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  return [
    { lang: 'tr', slug: 'hello-world' },
    { lang: 'en', slug: 'hello-world' },
  ];
}

export default async function BlogPostDetailPage({ params }: BlogPostDetailPageProps) {
  const { lang, slug } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);

  let post = null;
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .limit(1)
      .single();

    post = data;
  } catch (err) {
    console.debug('[public/blog/slug] Fetch error:', err);
  }

  const backText = currentLang === 'tr' ? '← Blog Yazılarına Dön' : '← Back to Blog';

  if (!post) {
    return (
      <main className="main-container">
        <Header lang={currentLang} dict={dict} />
        <div className="page-container">
          <header className="page-header">
            <span className="page-tag">[ 404 // NOT FOUND ]</span>
            <h1 className="page-title">{currentLang === 'tr' ? 'Yazı Bulunamadı' : 'Article Not Found'}</h1>
            <p className="page-subtitle">
              {currentLang === 'tr'
                ? 'Aradığınız blog yazısı mevcut değil veya yayından kaldırılmış olabilir.'
                : 'The article you are looking for does not exist or has been unpublished.'}
            </p>
          </header>

          <Link
            href={`/${currentLang}/blog`}
            className="project-intro__enter-btn"
            style={{ width: 'fit-content', marginTop: '1.5rem' }}
          >
            {backText}
          </Link>
        </div>
        <Footer lang={currentLang} dict={dict} />
      </main>
    );
  }

  const displayTitle = (currentLang === 'tr' ? post.title_tr : post.title_en) || post.title_tr || post.title_en || post.slug;
  const displayContent = (currentLang === 'tr' ? post.content_tr : post.content_en) || post.content_tr || post.content_en || '';
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString(currentLang === 'tr' ? 'tr-TR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <main className="main-container">
      <Header lang={currentLang} dict={dict} />
      <div className="page-container" style={{ maxWidth: '800px' }}>
        <header className="page-header" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="page-tag">[ BLOG // {dateStr} ]</span>
            {post.featured && (
              <span style={{ fontSize: '0.65rem', color: '#f1c40f', border: '1px solid rgba(241,196,15,0.4)', padding: '0.15rem 0.4rem', borderRadius: '3px' }}>
                ★ {currentLang === 'tr' ? 'Öne Çıkan' : 'Featured'}
              </span>
            )}
          </div>
          <h1 className="page-title" style={{ fontSize: '2rem', lineHeight: 1.25 }}>
            {displayTitle}
          </h1>
        </header>

        {post.cover_image && (
          <div style={{ marginBottom: '2rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_image} alt={displayTitle} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}

        <article
          className="blog-content"
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.85)',
            whiteSpace: 'pre-wrap',
          }}
        >
          {displayContent}
        </article>

        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link
            href={`/${currentLang}/blog`}
            className="project-intro__enter-btn"
            style={{ width: 'fit-content' }}
          >
            {backText}
          </Link>
        </div>
      </div>
      <Footer lang={currentLang} dict={dict} />
    </main>
  );
}
