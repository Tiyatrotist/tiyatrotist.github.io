/**
 * TIYATROTIST — Page Builder Feature Section
 *
 * Grid or split list of features with icons and bilingual descriptions.
 */

import { SectionBlock } from '@/types/builder';

interface SectionProps {
  section: SectionBlock;
  locale: 'tr' | 'en';
}

export default function FeatureSection({ section, locale }: SectionProps) {
  const { content, layout } = section;
  const tag = locale === 'tr' ? content.tag_tr : content.tag_en;
  const title = locale === 'tr' ? content.title_tr : content.title_en;
  const subtitle = locale === 'tr' ? content.subtitle_tr : content.subtitle_en;
  const features = content.features || [];

  return (
    <section
      className="builder-section builder-features"
      style={{
        padding: '4rem 1.5rem',
        maxWidth: layout === 'fullWidth' ? '100%' : '1100px',
        margin: '0 auto',
      }}
    >
      {(tag || title || subtitle) && (
        <div style={{ marginBottom: '2.5rem', textAlign: layout === 'centered' ? 'center' : 'left' }}>
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
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', margin: 0, maxWidth: '650px' }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {features.map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: '1.5rem',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {item.icon && <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{item.icon}</div>}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: '0 0 0.5rem 0' }}>
              {locale === 'tr' ? item.title_tr : item.title_en}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>
              {locale === 'tr' ? item.description_tr : item.description_en}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
