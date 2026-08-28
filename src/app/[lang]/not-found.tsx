/**
 * TIYATROTIST — Localized 404 Not Found Page (/tr/not-found or dynamic subpaths)
 */

import BrickBreaker404 from '@/components/BrickBreaker404';
import { Locale, getDictionary } from '@/dictionaries';

interface LangNotFoundProps {
  params?: Promise<{ lang: string }>;
}

export default async function LangNotFound({ params }: LangNotFoundProps) {
  const resolvedParams = params ? await params : undefined;
  const currentLang = (resolvedParams?.lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);

  return <BrickBreaker404 lang={currentLang} dict={dict} />;
}
