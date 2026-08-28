/**
 * TIYATROTIST — Explicit 404 Route (/tr/404 and /en/404)
 */

import type { Metadata } from 'next';
import BrickBreaker404 from '@/components/BrickBreaker404';
import { Locale, getDictionary } from '@/dictionaries';

interface Explicit404PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  return {
    title: currentLang === 'tr' ? 'TIYATROTIST — Sayfa Bulunamadı (404)' : 'TIYATROTIST — Page Not Found (404)',
  };
}

export async function generateStaticParams() {
  return [{ lang: 'tr' }, { lang: 'en' }];
}

export default async function Explicit404Page({ params }: Explicit404PageProps) {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);

  return <BrickBreaker404 lang={currentLang} dict={dict} />;
}
