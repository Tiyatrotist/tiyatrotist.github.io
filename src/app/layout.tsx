import type { Metadata } from 'next';
import Script from 'next/script';
import DevToolsNotice from '@/components/DevToolsNotice';
import { GOOGLE_ADSENSE_CONFIG } from '@/config/ads';
import './globals.css';

const siteUrl = 'https://tiyatrotist.com.tr';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'TIYATROTIST — Digital Environment',
    template: '%s | TIYATROTIST',
  },
  description: 'Kod ve sahne arasında monokrom dijital deneyim, projeler ve düşünceler.',
  keywords: [
    'Tiyatrotist',
    'tiyatro',
    'dijital tiyatro',
    'yazılım ve sanat',
    'creative coding',
    'monochrome design',
    'minimalist portfolio',
    'web development',
    'dijital deneyim',
  ],
  authors: [{ name: 'Tiyatrotist', url: siteUrl }],
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
    title: 'TIYATROTIST — Digital Environment',
    description: 'Kod ve sahne arasında monokrom dijital deneyim, projeler ve düşünceler.',
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
    title: 'TIYATROTIST — Digital Environment',
    description: 'Kod ve sahne arasında monokrom dijital deneyim, projeler ve düşünceler.',
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
  other: {
    'google-adsense-account': GOOGLE_ADSENSE_CONFIG.clientId,
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

        {/* Google AdSense Official Script Integration */}
        <Script
          id="google-adsense-script"
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CONFIG.clientId}`}
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <DevToolsNotice />
        {children}
      </body>
    </html>
  );
}
