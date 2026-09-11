import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Locale, getDictionary } from '@/dictionaries';

interface NowPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [
    { lang: 'tr' },
    { lang: 'en' },
  ];
}

export default async function NowPage({ params }: NowPageProps) {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);
  const n = dict.nowPage;

  return (
    <main className="main-container">
      <Header lang={currentLang} dict={dict} />
      <div className="page-container">
        <header className="page-header">
          <span className="page-tag">{n.tag}</span>
          <h1 className="page-title">{n.title}</h1>
          <p className="page-subtitle">{n.subtitle}</p>
        </header>

        <section className="page-content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span className="page-tag">{n.buildingLabel}</span>
              <p style={{ marginTop: '0.5rem' }}>{n.buildingDesc}</p>
            </div>

            <div>
              <span className="page-tag">{n.researchingLabel}</span>
              <p style={{ marginTop: '0.5rem' }}>{n.researchingDesc}</p>
            </div>

            <div>
              <span className="page-tag">{n.locationLabel}</span>
              <p style={{ marginTop: '0.5rem' }}>{n.locationDesc}</p>
            </div>
          </div>
        </section>
      </div>
      <Footer lang={currentLang} dict={dict} />
    </main>
  );
}
