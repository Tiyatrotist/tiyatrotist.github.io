import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutTimeline from '@/components/AboutTimeline';
import { Locale, getDictionary } from '@/dictionaries';

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const isTr = currentLang === 'tr';
  const aboutUrl = `https://tiyatrotist.com.tr/${currentLang}/about`;
  const description = isTr
    ? 'Buğra Dere (Tiyatrotist) hakkında bilgi, sistem mimarisi, Linux çekirdeği ve açık kaynak mühendislik prensipleri.'
    : 'About Buğra Dere (Tiyatrotist), systems architecture, Linux kernel, and open-source engineering principles.';

  return {
    title: isTr ? 'Hakkımda' : 'About Me',
    description,
    alternates: {
      canonical: aboutUrl,
      languages: {
        tr: '/tr/about',
        en: '/en/about',
      },
    },
    openGraph: {
      type: 'profile',
      title: (isTr ? 'Hakkımda' : 'About Me') + ' | TIYATROTIST',
      description,
      url: aboutUrl,
      images: [
        {
          url: 'https://tiyatrotist.com.tr/icon.svg',
          width: 512,
          height: 512,
          alt: 'Buğra Dere (Tiyatrotist)',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: (isTr ? 'Hakkımda' : 'About Me') + ' | TIYATROTIST',
      description,
      creator: '@tiyatrotist',
      images: ['https://tiyatrotist.com.tr/icon.svg'],
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const isTr = currentLang === 'tr';
  const dict = getDictionary(currentLang);
  const a = dict.aboutPage;
  const aboutUrl = `https://tiyatrotist.com.tr/${currentLang}/about`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${aboutUrl}#about`,
        url: aboutUrl,
        name: isTr ? 'Hakkımda' : 'About Me',
        description: isTr
          ? 'Buğra Dere (Tiyatrotist) hakkında bilgi, sistem mimarisi ve ilkeler.'
          : 'About Buğra Dere (Tiyatrotist), systems architecture and principles.',
        inLanguage: currentLang === 'tr' ? 'tr-TR' : 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${aboutUrl}#breadcrumb`,
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
            name: isTr ? 'Hakkımda' : 'About Me',
            item: aboutUrl,
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
      <div className="page-container" style={{ maxWidth: '960px' }}>
        <header className="page-header">
          <span className="page-tag">{a.tag}</span>
          <h1 className="page-title">{a.title}</h1>
          <p className="page-subtitle">{a.subtitle}</p>
        </header>

        <section className="page-content">
          <p>{a.p1}</p>
          <p>{a.p2}</p>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {a.principles.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Vertical Schematic Timeline (Achievements & Journey) */}
        <AboutTimeline lang={currentLang} />
      </div>
      <Footer lang={currentLang} dict={dict} />
    </main>
  );
}
