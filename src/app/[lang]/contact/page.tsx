import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Locale, getDictionary } from '@/dictionaries';

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);
  const c = dict.contactPage;

  return (
    <main className="main-container">
      <Header lang={currentLang} dict={dict} />
      <div className="page-container">
        <header className="page-header">
          <span className="page-tag">{c.tag}</span>
          <h1 className="page-title">{c.title}</h1>
          <p className="page-subtitle">{c.subtitle}</p>
        </header>

        <section className="page-content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <span className="page-tag">{c.directLabel}</span>
              <p style={{ marginTop: '0.5rem', fontSize: '1.25rem', color: '#ffffff' }}>
                contact@tiyatrotist.com
              </p>
            </div>

            <div>
              <span className="page-tag">{c.networksLabel}</span>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <a
                  href="https://github.com/Tiyatrotist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-link"
                  data-cursor="expand"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://x.com/Tiyatrotist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-link"
                  data-cursor="expand"
                >
                  X / Twitter ↗
                </a>
                <a
                  href="https://instagram.com/Tiyatrotist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-link"
                  data-cursor="expand"
                >
                  Instagram ↗
                </a>
                <a
                  href="https://youtube.com/@Tiyatrotist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-link"
                  data-cursor="expand"
                >
                  YouTube ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer lang={currentLang} dict={dict} />
    </main>
  );
}
