/**
 * TIYATROTIST — Page Builder Manifesto Section
 *
 * Bold typographic statement block.
 */

import { SectionBlock } from '@/types/builder';

interface SectionProps {
  section: SectionBlock;
  locale: 'tr' | 'en';
}

export default function ManifestoSection({ section, locale }: SectionProps) {
  const { content, layout } = section;
  const tag = locale === 'tr' ? content.tag_tr : content.tag_en;
  const title = locale === 'tr' ? content.title_tr : content.title_en;
  const body = locale === 'tr' ? content.body_tr : content.body_en;

  const isSplit = layout === 'split';

  return (
    <section
      className="builder-section builder-manifesto"
      style={{
        padding: '4rem 1.5rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      {tag && (
        <span
          className="page-tag"
          style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '1.25rem',
          }}
        >
          {tag}
        </span>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isSplit ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
          gap: '2.5rem',
          alignItems: 'center',
        }}
      >
        {title && (
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.25,
              margin: 0,
            }}
          >
            {title}
          </h2>
        )}

        {body && (
          <div
            style={{
              fontSize: '1rem',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            {body}
          </div>
        )}
      </div>
    </section>
  );
}
