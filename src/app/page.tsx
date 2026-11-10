'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SITE_CONFIG } from '@/config/site';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // 0. Check global maintenance mode
    if (SITE_CONFIG.maintenanceMode) {
      router.replace('/maintenance');
      return;
    }

    // 1. Check stored preference in localStorage
    const stored = localStorage.getItem('preferred_lang');
    if (stored === 'tr' || stored === 'en') {
      router.replace(`/${stored}`);
      return;
    }

    // 2. Check browser navigator language
    const navLang = navigator.language || (navigator as any).userLanguage || '';
    if (navLang.toLowerCase().startsWith('tr')) {
      router.replace('/tr');
    } else {
      router.replace('/en');
    }
  }, [router]);

  return (
    <main
      style={{
        background: '#000000',
        minHeight: '100vh',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'monospace',
      }}
    >
      <header>
        <h1 style={{ fontSize: '1.5rem', letterSpacing: '0.15em', marginBottom: '1rem' }}>
          TIYATROTIST
        </h1>
        <p style={{ maxWidth: '600px', opacity: 0.8, lineHeight: 1.6, marginBottom: '2rem' }}>
          between code &amp; stage — kod ve sahne arasında sistem mühendisliği ve açık kaynak portfolyo.
        </p>
      </header>

      <nav aria-label="Dil Seçimi / Language Selection" style={{ display: 'flex', gap: '1.5rem' }}>
        <Link
          href="/tr"
          style={{
            color: '#ffffff',
            border: '1px solid #333333',
            padding: '0.5rem 1.25rem',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          [TR] Giriş
        </Link>
        <Link
          href="/en"
          style={{
            color: '#ffffff',
            border: '1px solid #333333',
            padding: '0.5rem 1.25rem',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          [EN] Enter
        </Link>
      </nav>

      <noscript>
        <p style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.6 }}>
          JavaScript devre dışı ise lütfen yukarıdaki bağlantılardan dilinizi seçiniz.
        </p>
      </noscript>
    </main>
  );
}
