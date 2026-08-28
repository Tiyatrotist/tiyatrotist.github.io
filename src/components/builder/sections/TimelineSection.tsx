/**
 * TIYATROTIST — Page Builder Timeline Section
 *
 * Chronological history / milestones display.
 */

import { SectionBlock } from '@/types/builder';

interface SectionProps {
  section: SectionBlock;
  locale: 'tr' | 'en';
}

export default function TimelineSection({ section, locale }: SectionProps) {
  const { content } = section;
  const tag = locale === 'tr' ? content.tag_tr : content.tag_en;
  const title = locale === 'tr' ? content.title_tr : content.title_en;
  const timeline = content.timeline || [];

  return (
    <section
      className="builder-section builder-timeline"
      style={{
        padding: '4rem 1.5rem',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      {(tag || title) && (
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
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              {title}
            </h2>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '1.5rem' }}>
        {timeline.map((item, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '-1.85rem',
                top: '0.35rem',
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: '#ffffff',
              }}
            />
            <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem' }}>
              {locale === 'tr' ? item.date_tr : item.date_en}
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: '0 0 0.25rem 0' }}>
              {locale === 'tr' ? item.title_tr : item.title_en}
            </h3>
            {(item.description_tr || item.description_en) && (
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>
                {locale === 'tr' ? item.description_tr : item.description_en}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
