/**
 * TIYATROTIST — Page Builder Project Grid Section
 *
 * Responsive project showcase grid.
 */

import Link from 'next/link';
import { SectionBlock } from '@/types/builder';

interface SectionProps {
  section: SectionBlock;
  locale: 'tr' | 'en';
}

export default function ProjectGridSection({ section, locale }: SectionProps) {
  const { content } = section;
  const tag = locale === 'tr' ? content.tag_tr : content.tag_en;
  const title = locale === 'tr' ? content.title_tr : content.title_en;
  const subtitle = locale === 'tr' ? content.subtitle_tr : content.subtitle_en;

  return (
    <section
      className="builder-section builder-project-grid"
      style={{
        padding: '4rem 1.5rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      <div style={{ marginBottom: '2.5rem' }}>
        {tag && (
          <span
            className="page-tag"
            style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '0.75rem',
            }}
          >
            {tag}
          </span>
        )}

        {title && (
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem 0' }}>
            {title}
          </h2>
        )}

        {subtitle && (
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <Link
          href={`/${locale}/projects/bookos`}
          className="project-card-item"
          data-cursor="expand"
          style={{
            display: 'block',
            textDecoration: 'none',
            padding: '1.75rem',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#ff6a00' }}>[ PROJE 01 ]</span>
            <span className="admin-badge admin-badge-published" style={{ fontSize: '0.6rem' }}>★ STABLE</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', margin: '0 0 0.5rem 0' }}>
            BookOS
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
            {locale === 'tr'
              ? 'Modern, hafif ve minimalist işletim sistemi projesi.'
              : 'Modern, lightweight and minimalist operating system project.'}
          </p>
          <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>
            {locale === 'tr' ? 'Projeyi İncele →' : 'View Project →'}
          </span>
        </Link>
      </div>
    </section>
  );
}
