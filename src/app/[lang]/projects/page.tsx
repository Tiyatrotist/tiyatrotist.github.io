import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Locale, getDictionary } from '@/dictionaries';

interface ProjectsPageProps {
  params: Promise<{ lang: string }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);

  const projects = [
    {
      slug: 'bookos',
      title: 'BookOS',
      description: dict.projectIntro.description,
      year: '2026',
    },
  ];

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
                <h2 className="project-card-title">{project.title}</h2>
                <p className="project-card-desc">{project.description}</p>
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
