/**
 * TIYATROTIST — 404 Not Found (Root Fallback)
 * Renders the BrickBreaker404 experience with auto-detected locale.
 */

'use client';

import { useEffect, useState } from 'react';
import BrickBreaker404 from '@/components/BrickBreaker404';
import { tr } from '@/dictionaries/tr';
import { en } from '@/dictionaries/en';
import { Locale } from '@/dictionaries/types';

export default function NotFound() {
  const [lang, setLang] = useState<Locale>('tr');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferred_lang') as Locale;
      if (stored === 'tr' || stored === 'en') {
        setLang(stored);
        return;
      }
      const navLang = navigator.language || (navigator as any).userLanguage || '';
      if (navLang.toLowerCase().startsWith('tr')) {
        setLang('tr');
      } else {
        setLang('en');
      }
    }
  }, []);

  const dict = lang === 'tr' ? tr : en;

  return <BrickBreaker404 lang={lang} dict={dict} />;
}
