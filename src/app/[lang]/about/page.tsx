import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutTimeline from '@/components/AboutTimeline';
import { Locale, getDictionary } from '@/dictionaries';

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);
  const a = dict.aboutPage;

  return (
    <main className="main-container">
      <Header lang={currentLang} dict={dict} />
      <div className="page-container" style={{ maxWidth: '960px' }}>
        <header className="page-header">
          <span className="page-tag">{a.tag}</span>
          <h1 className="page-title">{a.title}</h1>
          <p className="page-subtitle">{a.subtitle}</p>
        </header>

        <section className="page-content">
          <p>{a.p1}</p>
          <p>{a.p2}</p>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {a.principles.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Vertical Schematic Timeline (Achievements & Journey) */}
        <AboutTimeline lang={currentLang} />
      </div>
      <Footer lang={currentLang} dict={dict} />
    </main>
  );
}
