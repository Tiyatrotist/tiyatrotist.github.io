import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'PROJECTS — TIYATROTIST',
  description: 'Selected experimental digital works and software architectures.',
};

const PROJECTS = [
  {
    slug: 'bookos',
    title: 'BookOS',
    description: 'An experimental digital operating system & workspace concept.',
    year: '2026',
  },
];

export default function ProjectsPage() {
  return (
    <main className="main-container">
      <Header />
      <div className="page-container">
        <header className="page-header">
          <span className="page-tag">[ INDEX // WORK ]</span>
          <h1 className="page-title">PROJECTS</h1>
          <p className="page-subtitle">
            Experimental digital environments, software systems, and interactive architectures.
          </p>
        </header>

        <div className="project-card-list">
          {PROJECTS.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="project-card-item"
              data-cursor="expand"
            >
              <div className="project-card-info">
                <h2 className="project-card-title">{project.title}</h2>
                <p className="project-card-desc">{project.description}</p>
              </div>
              <span className="project-card-link">ENTER ENVIRONMENT →</span>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
