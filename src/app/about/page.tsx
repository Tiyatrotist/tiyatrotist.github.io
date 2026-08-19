import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'ABOUT — TIYATROTIST',
  description: 'Philosophy, architecture, and statement.',
};

export default function AboutPage() {
  return (
    <main className="main-container">
      <Header />
      <div className="page-container">
        <header className="page-header">
          <span className="page-tag">[ PERSPECTIVE // STATEMENT ]</span>
          <h1 className="page-title">ABOUT</h1>
          <p className="page-subtitle">
            Software development as a discipline of form, restraint, and performance.
          </p>
        </header>

        <section className="page-content">
          <p>
            TIYATROTIST is a digital environment built around the intersection of code, typography, and space.
            Rather than treating web applications as containers for cards and colorful templates, every interface is approached as a living digital composition.
          </p>
          <p>
            Key principles:
          </p>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Pure monochrome aesthetics and controlled visual contrast.</li>
            <li>Particle-driven typography engines instead of static pixel grids.</li>
            <li>Restraint over noise — every animation serves a physical structure.</li>
          </ul>
        </section>
      </div>
      <Footer />
    </main>
  );
}
