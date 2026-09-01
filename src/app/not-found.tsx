/**
 * TIYATROTIST — 404 Not Found (Root Fallback)
 * Renders the BrickBreaker404 experience with auto-detected locale.
 */

'use client';

import BrickBreaker404 from '@/components/BrickBreaker404';
import { tr } from '@/dictionaries/tr';
import { en } from '@/dictionaries/en';
import { usePreferredLocale } from '@/hooks/usePreferredLocale';

export default function NotFound() {
  const lang = usePreferredLocale();

  const dict = lang === 'tr' ? tr : en;

  return <BrickBreaker404 lang={lang} dict={dict} />;
}
