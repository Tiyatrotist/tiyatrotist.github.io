/**
 * TIYATROTIST — Localized Maintenance Page (/tr/maintenance, /en/maintenance)
 */

import type { Metadata } from 'next';
import MaintenancePage from '@/app/maintenance/page';
import { Locale } from '@/dictionaries';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  return {
    title: currentLang === 'tr' ? 'TIYATROTIST — Sistem Bakımda' : 'TIYATROTIST — System Maintenance',
  };
}

export default async function LocalizedMaintenancePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  return <MaintenancePage initialLang={currentLang} />;
}
