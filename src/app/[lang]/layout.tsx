import type { Metadata } from 'next';
import CustomCursor from '@/components/CustomCursor';
import GlobalDotCanvas from '@/components/GlobalDotCanvas';
import CommandPalette from '@/components/CommandPalette';
import PageViewTracker from '@/components/PageViewTracker';
import MaintenancePage from '@/app/maintenance/page';
import MaintenanceGuard from '@/components/MaintenanceGuard';
import { SITE_CONFIG } from '@/config/site';
import { Locale, getDictionary } from '@/dictionaries';
import '../globals.css';

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'tr' }, { lang: 'en' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);

  const title = currentLang === 'tr'
    ? 'TIYATROTIST — Sistem Geliştiricisi & Açık Kaynak Portfolyo'
    : 'TIYATROTIST — Systems Developer & Open Source Portfolio';

  const description = currentLang === 'tr'
    ? 'Buğra Dere (Tiyatrotist). Sistem mimarisi, Linux çekirdeği, C++20, Qt 6, Rust ve açık kaynak otonom yapay zekâ projeleri.'
    : 'Buğra Dere (Tiyatrotist). Systems architecture, Linux kernel, C++20, Qt 6, Rust, and open-source autonomous AI projects.';

  return {
    metadataBase: new URL('https://tiyatrotist.com.tr'),
    title: {
      default: title,
      template: '%s | TIYATROTIST',
    },
    description,
    authors: [{ name: 'Buğra Dere (Tiyatrotist)', url: 'https://tiyatrotist.com.tr' }],
    creator: 'Tiyatrotist',
    publisher: 'Tiyatrotist',
    keywords: [
      'Tiyatrotist',
      'Buğra Dere',
      'Sistem Mühendisliği',
      'Linux Dağıtımı',
      'C++20',
      'Qt 6',
      'Rust',
      'E.D.I.T.H',
      'EtapKitap',
      'explorer-terminal',
      'OpenPet',
      'BookOS',
      'Pardus ETAP',
      'Windhawk',
    ],
    icons: {
      icon: '/icon.svg',
      apple: '/icon.svg',
    },
    alternates: {
      canonical: `/${currentLang}`,
      languages: {
        tr: '/tr',
        en: '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: currentLang === 'tr' ? 'tr_TR' : 'en_US',
      url: `https://tiyatrotist.com.tr/${currentLang}`,
      siteName: 'TIYATROTIST',
      title,
      description,
      images: [
        {
          url: '/icon.svg',
          width: 512,
          height: 512,
          alt: 'TIYATROTIST',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      creator: '@tiyatrotist',
      images: ['/icon.svg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  const validLang = (lang === 'tr' ? 'tr' : 'en') as Locale;

  if (SITE_CONFIG.maintenanceMode) {
    return <MaintenancePage />;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://tiyatrotist.com.tr/#website',
        url: 'https://tiyatrotist.com.tr',
        name: 'TIYATROTIST',
        description:
          validLang === 'tr'
            ? 'Buğra Dere (Tiyatrotist). Sistem mimarisi, C++20, Qt 6, Rust ve açık kaynak projeler.'
            : 'Buğra Dere (Tiyatrotist). Systems architecture, C++20, Qt 6, Rust, and open-source projects.',
        inLanguage: validLang === 'tr' ? 'tr-TR' : 'en-US',
      },
      {
        '@type': 'Person',
        '@id': 'https://tiyatrotist.com.tr/#author',
        name: 'Buğra Dere',
        alternateName: 'Tiyatrotist',
        url: 'https://tiyatrotist.com.tr',
        image: 'https://tiyatrotist.com.tr/icon.svg',
        jobTitle: validLang === 'tr' ? 'Sistem Geliştiricisi' : 'Systems Developer',
        sameAs: [
          'https://github.com/Tiyatrotist',
          'https://tiyatrotist.com.tr',
        ],
      },
    ],
  };

  return (
    <div lang={validLang} className="lang-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GlobalDotCanvas />
      <CustomCursor />
      <CommandPalette />
      <PageViewTracker />

      <MaintenanceGuard lang={validLang}>
        {children}
      </MaintenanceGuard>
    </div>
  );
}
