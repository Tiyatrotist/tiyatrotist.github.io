/**
 * TIYATROTIST — Page Builder Release & Changelog Section
 *
 * Standalone release display card with changelog and release date.
 */

import { SectionBlock } from '@/types/builder';

interface SectionProps {
  section: SectionBlock;
  locale: 'tr' | 'en';
}

export default function ReleaseSection({ section, locale }: SectionProps) {
  const { content } = section;
  const tag = locale === 'tr' ? content.tag_tr : content.tag_en;
  const title = locale === 'tr' ? content.title_tr : content.title_en;
  const changelog = locale === 'tr' ? content.body_tr : content.body_en;
  const btnLabel = locale === 'tr' ? content.button_label_tr : content.button_label_en;

  return (
    <section
      className="builder-section builder-release"
      style={{
        padding: '3rem 1.5rem',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          padding: '2rem',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            {tag && (
              <span className="page-tag" style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.25rem' }}>
                {tag}
              </span>
            )}
            {title && <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>{title}</h2>}
          </div>

          {btnLabel && content.button_url && (
            <a
              href={content.button_url}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-primary admin-btn-sm"
            >
              {btnLabel}
            </a>
          )}
        </div>

        {changelog && (
          <div
            style={{
              marginTop: '1.25rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.7)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {changelog}
          </div>
        )}
      </div>
    </section>
  );
}
