import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Locale, getDictionary } from '@/dictionaries';

import { SYSTEM_PROJECTS } from '@/config/projects';

interface ProjectsPageProps {
  params: Promise<{ lang: string }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);

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
