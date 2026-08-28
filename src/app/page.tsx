'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    <div style={{ background: '#000000', minHeight: '100vh' }} />
  );
}
