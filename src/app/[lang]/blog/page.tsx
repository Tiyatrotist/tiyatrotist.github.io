/**
 * TIYATROTIST — Public Blog Listing Page
 *
 * Showcases technical thoughts, architectural manifestos, and project logs.
 * Pure monochrome aesthetic, responsive layout, real-time search, and tag filtering.
 * Queries unified blog service: local Git-tracked Markdown files merged with Supabase.
 */

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogListView from '@/components/BlogListView';
import { Locale, getDictionary } from '@/dictionaries';
import { getAllBlogPosts } from '@/lib/blog-service';

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

  const posts = await getAllBlogPosts();

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
