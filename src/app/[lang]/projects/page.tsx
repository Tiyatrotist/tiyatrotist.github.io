import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Locale, getDictionary } from '@/dictionaries';

import { SYSTEM_PROJECTS } from '@/config/projects';

interface ProjectsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const isTr = currentLang === 'tr';
  const projectsUrl = `https://tiyatrotist.com.tr/${currentLang}/projects`;
  const description = isTr
    ? 'Açık kaynak sistem araçları, C++20/Qt 6 ve Rust projeleri: E.D.I.T.H, EtapKitap, BookOS, explorer-terminal ve OpenPet.'
    : 'Open source system utilities, C++20/Qt 6 and Rust projects: E.D.I.T.H, EtapKitap, BookOS, explorer-terminal, and OpenPet.';

  return {
    title: isTr ? 'Projeler' : 'Projects',
    description,
    alternates: {
      canonical: projectsUrl,
      languages: {
        tr: '/tr/projects',
        en: '/en/projects',
      },
    },
    openGraph: {
      type: 'website',
      title: isTr ? 'Projeler | TIYATROTIST' : 'Projects | TIYATROTIST',
      description,
      url: projectsUrl,
      images: [
        {
          url: 'https://tiyatrotist.com.tr/icon.svg',
          width: 512,
          height: 512,
          alt: 'TIYATROTIST Projects',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: isTr ? 'Projeler | TIYATROTIST' : 'Projects | TIYATROTIST',
      description,
      creator: '@tiyatrotist',
      images: ['https://tiyatrotist.com.tr/icon.svg'],
    },
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const isTr = currentLang === 'tr';
  const dict = getDictionary(currentLang);
  const projectsUrl = `https://tiyatrotist.com.tr/${currentLang}/projects`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${projectsUrl}#collection`,
        url: projectsUrl,
        name: isTr ? 'TIYATROTIST Projeler' : 'TIYATROTIST Projects',
        description: isTr
          ? 'Açık kaynak sistem araçları, C++20/Qt 6 ve Rust projeleri.'
          : 'Open source system utilities, C++20/Qt 6 and Rust projects.',
        inLanguage: currentLang === 'tr' ? 'tr-TR' : 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${projectsUrl}#breadcrumb`,
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
            name: isTr ? 'Projeler' : 'Projects',
            item: projectsUrl,
          },
        ],
      },
    ],
  };

  const projects = SYSTEM_PROJECTS.map((sp) => ({
    slug: sp.slug,
    title: sp.name,
    description: currentLang === 'tr' ? sp.short_description_tr : sp.short_description_en,
    year: sp.year,
    featured: sp.featured,
    release: sp.latestRelease,
    tags: sp.tags,
  }));

  return (
    <main className="main-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header lang={currentLang} dict={dict} />
      <div className="page-container">
        <header className="page-header">
          <span className="page-tag">{dict.projectsPage.tag}</span>
          <h1 className="page-title">{dict.projectsPage.title}</h1>
          <p className="page-subtitle">{dict.projectsPage.subtitle}</p>
        </header>

        <div className="project-card-list">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/${currentLang}/projects/${project.slug}`}
              className="project-card-item"
              data-cursor="expand"
            >
              <div className="project-card-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <h2 className="project-card-title" style={{ margin: 0 }}>{project.title}</h2>
                  {project.featured && (
                    <span style={{ fontSize: '0.62rem', padding: '0.15rem 0.5rem', borderRadius: '2px', background: '#ffffff', color: '#000000', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                      [ {currentLang === 'tr' ? 'ÖNE ÇIKAN' : 'FEATURED'} ]
                    </span>
                  )}
                  <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', marginLeft: 'auto' }}>
                    {project.release}
                  </span>
                </div>
                <p className="project-card-desc">{project.description}</p>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                  {project.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', borderRadius: '2px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="project-card-link">{dict.projectsPage.enterBtn}</span>
            </Link>
          ))}
        </div>
      </div>
      <Footer lang={currentLang} dict={dict} />
    </main>
  );
}
