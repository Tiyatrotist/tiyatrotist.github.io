import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ProjectDetailProps {
  params: Promise<{ slug: string }>;
}

const PROJECT_DATA: Record<string, { title: string; subtitle: string; description: string; details: string[] }> = {
  bookos: {
    title: 'BookOS',
    subtitle: 'Experimental Digital Operating System & Workspace Concept',
    description:
      'BookOS explores the convergence of literature, personal knowledge systems, and tactile digital interfaces. Built with a dot-matrix state engine and pure monochrome aesthetics.',
    details: [
      'Monochrome particle UI layout',
      'Distraction-free environment for deep reading and knowledge synthesis',
      'Zero-dependency state engine',
    ],
  },
};

export async function generateStaticParams() {
  return [{ slug: 'bookos' }];
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const project = PROJECT_DATA[slug];

  if (!project) {
    return (
      <main className="main-container">
        <Header />
        <div className="page-container">
          <header className="page-header">
            <span className="page-tag">[ 404 // NOT FOUND ]</span>
            <h1 className="page-title">PROJECT NOT FOUND</h1>
            <p className="page-subtitle">The requested project environment does not exist.</p>
          </header>
          <Link href="/projects" className="project-intro__enter-btn" style={{ width: 'fit-content' }}>
            ← BACK TO PROJECTS
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="main-container">
      <Header />
      <div className="page-container">
        <header className="page-header">
          <span className="page-tag">[ PROJECT // {slug.toUpperCase()} ]</span>
          <h1 className="page-title">{project.title}</h1>
          <p className="page-subtitle">{project.subtitle}</p>
        </header>

        <section className="page-content">
          <p>{project.description}</p>

          <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span className="page-tag">[ HIGHLIGHTS ]</span>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {project.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>

          <Link href="/projects" className="project-intro__enter-btn" style={{ width: 'fit-content', marginTop: '1rem' }}>
            ← BACK TO ALL PROJECTS
          </Link>
        </section>
      </div>
      <Footer />
    </main>
  );
}
