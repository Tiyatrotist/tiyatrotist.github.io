import type { Metadata } from 'next';
import CustomCursor from '@/components/CustomCursor';
import GlobalDotCanvas from '@/components/GlobalDotCanvas';
import PortalEasterEgg from '@/components/PortalEasterEgg';
import MaintenancePage from '@/app/maintenance/page';
import MaintenanceGuard from '@/components/MaintenanceGuard';
import { SITE_CONFIG } from '@/config/site';
import { Locale, getDictionary } from '@/dictionaries';
import '../globals.css';

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'tr' }, { lang: 'en' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);

  const title = currentLang === 'tr' ? 'TIYATROTIST — Saf Monokrom Dijital Ortam' : 'TIYATROTIST — Pure Monochrome Digital Environment';

  return {
    title,
    description: dict.manifesto.paragraph1,
    icons: {
      icon: '/icon.svg',
    },
    alternates: {
      canonical: `/${currentLang}`,
      languages: {
        tr: '/tr',
        en: '/en',
      },
    },
  };
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  const validLang = (lang === 'tr' ? 'tr' : 'en') as Locale;

  if (SITE_CONFIG.maintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <div lang={validLang} className="lang-wrapper">
      <GlobalDotCanvas />
      <CustomCursor />
      <PortalEasterEgg />
      <MaintenanceGuard lang={validLang}>
        {children}
      </MaintenanceGuard>
    </div>
  );
}

