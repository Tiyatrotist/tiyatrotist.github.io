import { Locale, getDictionary } from '@/dictionaries';
import BookOSMicrosite from '@/components/bookos/BookOSMicrosite';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface ProjectDetailPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  return [
    { lang: 'tr', slug: 'bookos' },
    { lang: 'en', slug: 'bookos' },
  ];
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { lang, slug } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);

  if (slug === 'bookos') {
    return <BookOSMicrosite lang={currentLang} dict={dict} />;
  }

  // Fallback 404 for unknown project slugs
  return (
    <main className="main-container">
      <Header lang={currentLang} dict={dict} />
      <div className="page-container">
        <header className="page-header">
          <span className="page-tag">[ 404 // NOT FOUND ]</span>
          <h1 className="page-title">{dict.projectDetail.notFoundTitle}</h1>
          <p className="page-subtitle">{dict.projectDetail.notFoundSubtitle}</p>
        </header>
        <Link href={`/${currentLang}/projects`} className="project-intro__enter-btn" style={{ width: 'fit-content' }}>
          {dict.projectDetail.backBtn}
        </Link>
      </div>
      <Footer lang={currentLang} dict={dict} />
    </main>
  );
}
