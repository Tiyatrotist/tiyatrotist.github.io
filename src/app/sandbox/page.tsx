'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SITE_CONFIG } from '@/config/site';

/**
 * Direct shortcut route: /sandbox
 * Automatically resolves user's language preference and routes to /{lang}/projects/sandbox
 */
export default function SandboxShortcutPage() {
  const router = useRouter();

  useEffect(() => {
    if (SITE_CONFIG.maintenanceMode) {
      router.replace('/maintenance');
      return;
    }

    const stored = typeof window !== 'undefined' ? localStorage.getItem('preferred_lang') : null;
    let lang = 'tr';
    if (stored === 'tr' || stored === 'en') {
      lang = stored;
    } else if (typeof navigator !== 'undefined') {
      const navLang = navigator.language || (navigator as any).userLanguage || '';
      lang = navLang.toLowerCase().startsWith('tr') ? 'tr' : 'en';
    }

    router.replace(`/${lang}/projects/sandbox`);
  }, [router]);

  return (
    <div style={{ background: '#050505', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'monospace', color: '#71717a', fontSize: '0.875rem' }}>
        [ LOADING PARTICLE SANDBOX... ]
      </div>
    </div>
  );
}
