import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'NOW — TIYATROTIST',
  description: 'Current focus, active explorations, and status.',
};

export default function NowPage() {
  return (
    <main className="main-container">
      <Header />
      <div className="page-container">
        <header className="page-header">
          <span className="page-tag">[ STATUS // CURRENT FOCUS ]</span>
          <h1 className="page-title">NOW</h1>
          <p className="page-subtitle">
            What is currently being explored, built, and refined.
          </p>
        </header>

        <section className="page-content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span className="page-tag">[ BUILDING ]</span>
              <p style={{ marginTop: '0.5rem' }}>
                Refining particle state engines and performance optimizations for large-scale web canvas graphics.
              </p>
            </div>

            <div>
              <span className="page-tag">[ RESEARCHING ]</span>
              <p style={{ marginTop: '0.5rem' }}>
                Monochrome digital environments, zero-overhead client routing, and tactile interaction design.
              </p>
            </div>

            <div>
              <span className="page-tag">[ LOCATION ]</span>
              <p style={{ marginTop: '0.5rem' }}>
                Digital Space — GMT+3
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
