/**
 * TIYATROTIST — Page Builder Stats Section
 *
 * High-contrast metric counters.
 */

import { SectionBlock } from '@/types/builder';

interface SectionProps {
  section: SectionBlock;
  locale: 'tr' | 'en';
}

export default function StatsSection({ section, locale }: SectionProps) {
  const { content } = section;
  const stats = content.stats || [];

  if (stats.length === 0) return null;

  return (
    <section
      className="builder-section builder-stats"
      style={{
        padding: '3rem 1.5rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {stats.map((stat, idx) => (
          <div
            key={idx}
            style={{
              padding: '1.75rem',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace', marginBottom: '0.25rem' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {locale === 'tr' ? stat.label_tr : stat.label_en}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
