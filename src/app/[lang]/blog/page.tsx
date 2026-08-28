import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Locale, getDictionary } from '@/dictionaries';
import { supabase } from '@/lib/supabase';

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [
    { lang: 'tr' },
    { lang: 'en' },
  ];
}

interface BlogPost {
  id: string;
  slug: string;
  title_tr?: string;
  title_en?: string;
  excerpt_tr?: string;
  excerpt_en?: string;
  cover_image?: string;
  published: boolean;
  featured: boolean;
  published_at?: string;
}

export default async function PublicBlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);

  // Fetch published blog posts from Supabase directly
  let posts: BlogPost[] = [];
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    posts = data || [];
  } catch (err) {
    console.debug('[public/blog] Fetch error:', err);
  }

  const tag = currentLang === 'tr' ? '[ GÜNCELLEMELER // DÜŞÜNCELER ]' : '[ UPDATES // THOUGHTS ]';
  const title = currentLang === 'tr' ? 'Blog & Yazılar' : 'Blog & Articles';
  const subtitle = currentLang === 'tr'
    ? 'Yazılım, tasarım ve açık kaynak projeler üzerine düşünceler.'
    : 'Thoughts on software, design, and open-source projects.';
  const emptyText = currentLang === 'tr' ? 'Henüz yayınlanmış yazı bulunmuyor.' : 'No published articles yet.';

  return (
    <main className="main-container">
      <Header lang={currentLang} dict={dict} />
      <div className="page-container">
        <header className="page-header">
          <span className="page-tag">{tag}</span>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </header>

        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            {emptyText}
          </div>
        ) : (
          <div className="project-card-list">
            {posts.map((post) => {
              const displayTitle = (currentLang === 'tr' ? post.title_tr : post.title_en) || post.title_tr || post.title_en || post.slug;
              const displayExcerpt = (currentLang === 'tr' ? post.excerpt_tr : post.excerpt_en) || post.excerpt_tr || post.excerpt_en || '';
              const dateStr = post.published_at
                ? new Date(post.published_at).toLocaleDateString(currentLang === 'tr' ? 'tr-TR' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : '';

              return (
                <Link
                  key={post.slug}
                  href={`/${currentLang}/blog/${post.slug}`}
                  className="project-card-item"
                  data-cursor="expand"
                  style={{ display: 'block', textDecoration: 'none', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', marginBottom: '1.25rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}>
                      {dateStr}
                    </span>
                    {post.featured && (
                      <span style={{ fontSize: '0.65rem', color: '#f1c40f', border: '1px solid rgba(241,196,15,0.4)', padding: '0.15rem 0.4rem', borderRadius: '3px' }}>
                        ★ {currentLang === 'tr' ? 'Öne Çıkan' : 'Featured'}
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff', margin: '0 0 0.5rem 0' }}>
                    {displayTitle}
                  </h2>
                  {displayExcerpt && (
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>
                      {displayExcerpt}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer lang={currentLang} dict={dict} />
    </main>
  );
}
