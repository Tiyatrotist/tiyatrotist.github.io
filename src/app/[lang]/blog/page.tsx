/**
 * TIYATROTIST — Public Blog Listing Page
 *
 * Showcases technical thoughts, architectural manifestos, and project logs.
 * Pure monochrome aesthetic, responsive layout, real-time search, and tag filtering.
 * Queries unified blog service: local Git-tracked Markdown files merged with Supabase.
 */

import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogListView from '@/components/BlogListView';
import { Locale, getDictionary } from '@/dictionaries';
import { getAllBlogPosts } from '@/lib/blog-service';

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const isTr = currentLang === 'tr';
  const blogUrl = `https://tiyatrotist.com.tr/${currentLang}/blog`;
  const description = isTr
    ? 'Sistem mimarisi, Linux çekirdeği, C++20/Qt 6, Rust ve açık kaynak üzerine derinlemesine teknik yazılar ve notlar.'
    : 'In-depth technical essays on systems architecture, Linux kernel, C++20/Qt 6, Rust, and open source.';

  return {
    title: 'Blog',
    description,
    alternates: {
      canonical: blogUrl,
      languages: {
        tr: '/tr/blog',
        en: '/en/blog',
      },
    },
    openGraph: {
      type: 'website',
      title: 'Blog | TIYATROTIST',
      description,
      url: blogUrl,
      images: [
        {
          url: 'https://tiyatrotist.com.tr/icon.svg',
          width: 512,
          height: 512,
          alt: 'TIYATROTIST Blog',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: 'Blog | TIYATROTIST',
      description,
      creator: '@tiyatrotist',
      images: ['https://tiyatrotist.com.tr/icon.svg'],
    },
  };
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
  const isTr = currentLang === 'tr';
  const dict = getDictionary(currentLang);
  const b = dict.blogPage;

  console.debug(`[public/blog] Rendering blog index for language: ${currentLang}`);

  const posts = await getAllBlogPosts();
  const blogUrl = `https://tiyatrotist.com.tr/${currentLang}/blog`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${blogUrl}#collection`,
        url: blogUrl,
        name: isTr ? 'TIYATROTIST Blog' : 'TIYATROTIST Technical Blog',
        description: isTr
          ? 'Sistem mimarisi, Linux çekirdeği, C++20/Qt 6, Rust ve açık kaynak üzerine derinlemesine teknik yazılar ve notlar.'
          : 'In-depth technical essays on systems architecture, Linux kernel, C++20/Qt 6, Rust, and open source.',
        inLanguage: currentLang === 'tr' ? 'tr-TR' : 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${blogUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isTr ? 'Ana Sayfa' : 'Home',
            item: `https://tiyatrotist.com.tr/${currentLang}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: blogUrl,
          },
        ],
      },
    ],
  };

  return (
    <main className="main-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
