import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Locale, getDictionary } from '@/dictionaries';

interface NowPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: NowPageProps): Promise<Metadata> {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const isTr = currentLang === 'tr';
  const nowUrl = `https://tiyatrotist.com.tr/${currentLang}/now`;
  const description = isTr
    ? 'Şu anda üzerinde çalışılan sistemler, araştırmalar ve güncel odak noktası (/now sayfası).'
    : 'What is currently being built, researched, and refined (/now page).';

  return {
    title: isTr ? 'Şu An' : 'Now',
    description,
    alternates: {
      canonical: nowUrl,
      languages: {
        tr: '/tr/now',
        en: '/en/now',
      },
    },
    openGraph: {
      type: 'website',
      title: (isTr ? 'Şu An' : 'Now') + ' | TIYATROTIST',
      description,
      url: nowUrl,
      images: [
        {
          url: 'https://tiyatrotist.com.tr/icon.svg',
          width: 512,
          height: 512,
          alt: 'TIYATROTIST Now',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: (isTr ? 'Şu An' : 'Now') + ' | TIYATROTIST',
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

export default async function NowPage({ params }: NowPageProps) {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const isTr = currentLang === 'tr';
  const dict = getDictionary(currentLang);
  const n = dict.nowPage;
  const nowUrl = `https://tiyatrotist.com.tr/${currentLang}/now`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${nowUrl}#webpage`,
        url: nowUrl,
        name: isTr ? 'Şu An' : 'Now',
        description: isTr
          ? 'Şu anda üzerinde çalışılan sistemler, araştırmalar ve güncel odak noktası.'
          : 'What is currently being built, researched, and refined.',
        inLanguage: currentLang === 'tr' ? 'tr-TR' : 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${nowUrl}#breadcrumb`,
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
            name: isTr ? 'Şu An' : 'Now',
            item: nowUrl,
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
      <div className="page-container">
        <header className="page-header">
          <span className="page-tag">{n.tag}</span>
          <h1 className="page-title">{n.title}</h1>
          <p className="page-subtitle">{n.subtitle}</p>
        </header>

        <section className="page-content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span className="page-tag">{n.buildingLabel}</span>
              <p style={{ marginTop: '0.5rem' }}>{n.buildingDesc}</p>
            </div>

            <div>
              <span className="page-tag">{n.researchingLabel}</span>
              <p style={{ marginTop: '0.5rem' }}>{n.researchingDesc}</p>
            </div>

            <div>
              <span className="page-tag">{n.locationLabel}</span>
              <p style={{ marginTop: '0.5rem' }}>{n.locationDesc}</p>
            </div>
          </div>
        </section>
      </div>
      <Footer lang={currentLang} dict={dict} />
    </main>
  );
}
