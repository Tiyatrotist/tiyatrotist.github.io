import type { Metadata } from 'next';
import Script from 'next/script';
import DevToolsNotice from '@/components/DevToolsNotice';
import { GOOGLE_ADSENSE_CONFIG } from '@/config/ads';
import './globals.css';

export const metadata: Metadata = {
  title: 'TIYATROTIST — Digital Environment',
  description: 'A black-and-white, dot-typography-driven digital environment and landing experience.',
  icons: {
    icon: '/icon.svg',
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
    <html lang="en">
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
