import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'CONTACT — TIYATROTIST',
  description: 'Transmission and contact portals.',
};

export default function ContactPage() {
  return (
    <main className="main-container">
      <Header />
      <div className="page-container">
        <header className="page-header">
          <span className="page-tag">[ TRANSMISSION // CONTACT ]</span>
          <h1 className="page-title">CONTACT</h1>
          <p className="page-subtitle">
            Initiate communication or explore collaborative technical ventures.
          </p>
        </header>

        <section className="page-content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <span className="page-tag">[ DIRECT TRANSMISSION ]</span>
              <p style={{ marginTop: '0.5rem', fontSize: '1.25rem', color: '#ffffff' }}>
                contact@tiyatrotist.com
              </p>
            </div>

            <div>
              <span className="page-tag">[ PUBLIC NETWORKS ]</span>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-link"
                  data-cursor="expand"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-link"
                  data-cursor="expand"
                >
                  X / Twitter ↗
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-card-link"
                  data-cursor="expand"
                >
                  Instagram ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
