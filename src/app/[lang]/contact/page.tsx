import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Locale, getDictionary } from '@/dictionaries';
import { GithubIcon, XIcon, InstagramIcon, YoutubeIcon } from '@/components/SocialIcons';

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const isTr = currentLang === 'tr';
  const contactUrl = `https://tiyatrotist.com.tr/${currentLang}/contact`;
  const description = isTr
    ? 'Açık kaynak iş birlikleri, sistem mimarisi danışmanlığı veya teknik iletişim için doğrudan bağlantılar.'
    : 'Direct links and contact methods for open-source collaborations and systems engineering inquiries.';

  return {
    title: isTr ? 'İletişim' : 'Contact',
    description,
    alternates: {
      canonical: contactUrl,
      languages: {
        tr: '/tr/contact',
        en: '/en/contact',
      },
    },
    openGraph: {
      type: 'website',
      title: (isTr ? 'İletişim' : 'Contact') + ' | TIYATROTIST',
      description,
      url: contactUrl,
      images: [
        {
          url: 'https://tiyatrotist.com.tr/icon.svg',
          width: 512,
          height: 512,
          alt: 'TIYATROTIST İletişim',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: (isTr ? 'İletişim' : 'Contact') + ' | TIYATROTIST',
      description,
      creator: '@tiyatrotist',
      images: ['https://tiyatrotist.com.tr/icon.svg'],
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const isTr = currentLang === 'tr';
  const dict = getDictionary(currentLang);
  const c = dict.contactPage;
  const contactUrl = `https://tiyatrotist.com.tr/${currentLang}/contact`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${contactUrl}#contact`,
        url: contactUrl,
        name: isTr ? 'İletişim' : 'Contact',
        description: isTr
          ? 'TIYATROTIST iletişim sayfası.'
          : 'TIYATROTIST contact page.',
        inLanguage: currentLang === 'tr' ? 'tr-TR' : 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${contactUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isTr ? 'Ana Sayfa' : 'Home',
            item: `https://tiyatrotist.com.tr/${currentLang}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: isTr ? 'İletişim' : 'Contact',
            item: contactUrl,
          },
        ],
      },
    ],
  };

  return (
    <main className="main-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
                <a
                  href="mailto:iletisim@tiyatrotist.com.tr"
                  style={{ color: '#ffffff', textDecoration: 'underline', textUnderlineOffset: '6px' }}
                >
                  iletisim@tiyatrotist.com.tr
                </a>
              </p>
            </div>

            <div>
              <span className="page-tag">{c.networksLabel}</span>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href="https://github.com/Tiyatrotist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-link"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.6rem 1.1rem',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    transition: 'border-color 0.2s ease, background 0.2s ease',
                  }}
                  data-cursor="expand"
                >
                  <GithubIcon size={16} />
                  <span>GitHub</span>
                  <span style={{ opacity: 0.5 }}>↗</span>
                </a>
                <a
                  href="https://x.com/Tiyatrotist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-link"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.6rem 1.1rem',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    transition: 'border-color 0.2s ease, background 0.2s ease',
                  }}
                  data-cursor="expand"
                >
                  <XIcon size={16} />
                  <span>X / Twitter</span>
                  <span style={{ opacity: 0.5 }}>↗</span>
                </a>
                <a
                  href="https://instagram.com/Tiyatrotist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-link"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.6rem 1.1rem',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    transition: 'border-color 0.2s ease, background 0.2s ease',
                  }}
                  data-cursor="expand"
                >
                  <InstagramIcon size={16} />
                  <span>Instagram</span>
                  <span style={{ opacity: 0.5 }}>↗</span>
                </a>
                <a
                  href="https://youtube.com/@Tiyatrotist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-link"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.6rem 1.1rem',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    transition: 'border-color 0.2s ease, background 0.2s ease',
                  }}
                  data-cursor="expand"
                >
                  <YoutubeIcon size={16} />
                  <span>YouTube</span>
                  <span style={{ opacity: 0.5 }}>↗</span>
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
