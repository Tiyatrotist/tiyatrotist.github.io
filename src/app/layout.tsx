import type { Metadata } from 'next';
import DevToolsNotice from '@/components/DevToolsNotice';
import './globals.css';

const siteUrl = 'https://tiyatrotist.com.tr';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'TIYATROTIST — Sistem Geliştiricisi & Açık Kaynak Portfolyo',
    template: '%s | TIYATROTIST',
  },
  description: 'Buğra Dere (Tiyatrotist). Sistem mimarisi, C++20, Qt 6, Linux dağıtım altyapısı ve açık kaynak projeler.',
  keywords: [
    'Tiyatrotist',
    'Buğra Dere',
    'Sistem Mühendisliği',
    'Açık Kaynak',
    'C++20',
    'Qt 6',
    'Linux',
    'Rust',
    'E.D.I.T.H',
    'EtapKitap',
    'explorer-terminal',
    'OpenPet',
  ],
  authors: [{ name: 'Buğra Dere (Tiyatrotist)', url: siteUrl }],
  creator: 'Tiyatrotist',
  publisher: 'Tiyatrotist',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'tr-TR': `${siteUrl}/tr`,
      'en-US': `${siteUrl}/en`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    alternateLocale: 'en_US',
    url: siteUrl,
    siteName: 'TIYATROTIST',
    title: 'TIYATROTIST — Sistem Geliştiricisi & Açık Kaynak Portfolyo',
    description: 'Buğra Dere (Tiyatrotist). Sistem mimarisi, C++20, Qt 6, Linux dağıtım altyapısı ve açık kaynak projeler.',
    images: [
      {
        url: `${siteUrl}/icon.svg`,
        width: 512,
        height: 512,
        alt: 'TIYATROTIST Icon Mark',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'TIYATROTIST — Sistem Geliştiricisi & Açık Kaynak Portfolyo',
    description: 'Buğra Dere (Tiyatrotist). Sistem mimarisi, C++20, Qt 6, Linux dağıtım altyapısı ve açık kaynak projeler.',
    creator: '@tiyatrotist',
    images: [`${siteUrl}/icon.svg`],
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '4Q_G-sample-verification',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* RSS 2.0 Feeds */}
        <link rel="alternate" type="application/rss+xml" title="TIYATROTIST RSS Feed" href="/rss.xml" />
        <link rel="alternate" type="application/rss+xml" title="TIYATROTIST RSS Feed (TR)" href="/tr/rss.xml" />
        <link rel="alternate" type="application/rss+xml" title="TIYATROTIST RSS Feed (EN)" href="/en/rss.xml" />
      </head>
      <body>
        <DevToolsNotice />
        {children}
      </body>
    </html>
  );
}
