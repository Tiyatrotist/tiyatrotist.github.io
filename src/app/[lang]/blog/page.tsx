/**
 * TIYATROTIST — Public Blog Listing Page
 *
 * Showcases technical thoughts, architectural manifestos, and project logs.
 * Pure monochrome aesthetic, responsive layout, real-time search, and tag filtering.
 * Queries directly from Supabase blog_posts table with zero fake posts.
 */

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogListView from '@/components/BlogListView';
import { Locale, getDictionary } from '@/dictionaries';
import { supabase } from '@/lib/supabase';
import { BlogPostItem } from '@/types/blog';

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [
    { lang: 'tr' },
    { lang: 'en' },
  ];
}

export default async function PublicBlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);
  const b = dict.blogPage;

  console.debug(`[public/blog] Rendering blog index for language: ${currentLang}`);

  let posts: BlogPostItem[] = [];

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.debug('[public/blog] Supabase query notice:', error.message);
    } else if (data && data.length > 0) {
      console.debug(`[public/blog] Fetched ${data.length} published posts from Supabase`);
      posts = data.map((d) => ({
        id: d.id,
        slug: d.slug,
        title_tr: d.title_tr || '',
        title_en: d.title_en || '',
        excerpt_tr: d.excerpt_tr || '',
        excerpt_en: d.excerpt_en || '',
        content_tr: d.content_tr || '',
        content_en: d.content_en || '',
        cover_image: d.cover_image,
        category: d.category || 'General',
        tags: d.tags || ['Tech'],
        read_time_tr: '4 dk okuma',
        read_time_en: '4 min read',
        published: d.published,
        featured: d.featured || false,
        published_at: d.published_at || d.created_at || new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.debug('[public/blog] Exception fetching posts:', err);
  }

  return (
    <main className="main-container">
      <Header lang={currentLang} dict={dict} />
      <div className="page-container" style={{ maxWidth: '920px' }}>
        <header className="page-header">
          <span className="page-tag">{b.tag}</span>
          <h1 className="page-title">{b.title}</h1>
          <p className="page-subtitle">{b.subtitle}</p>
        </header>

        <section className="page-content" style={{ marginTop: '1.5rem' }}>
          <BlogListView posts={posts} lang={currentLang} dict={dict} />
        </section>
      </div>
      <Footer lang={currentLang} dict={dict} />
    </main>
  );
}
