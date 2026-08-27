import type { Metadata } from 'next';
import CustomCursor from '@/components/CustomCursor';
import GlobalDotCanvas from '@/components/GlobalDotCanvas';
import PortalEasterEgg from '@/components/PortalEasterEgg';
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

  return {
    title: 'TIYATROTIST — Digital Environment',
    description: dict.manifesto.paragraph1,
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

  return (
    <div lang={validLang} className="lang-wrapper">
      <GlobalDotCanvas />
      <CustomCursor />
      <PortalEasterEgg />
      {children}
    </div>
  );
}
