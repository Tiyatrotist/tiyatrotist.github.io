/**
 * TIYATROTIST — Page Builder Download Section
 *
 * Binary download action with platform links.
 */

import { SectionBlock } from '@/types/builder';

interface SectionProps {
  section: SectionBlock;
  locale: 'tr' | 'en';
}

export default function DownloadSection({ section, locale }: SectionProps) {
  const { content } = section;
  const tag = locale === 'tr' ? content.tag_tr : content.tag_en;
  const title = locale === 'tr' ? content.title_tr : content.title_en;
  const subtitle = locale === 'tr' ? content.subtitle_tr : content.subtitle_en;
  const btnLabel = locale === 'tr' ? content.button_label_tr : content.button_label_en;

  return (
    <section
      className="builder-section builder-download"
      style={{
        padding: '4rem 1.5rem',
        maxWidth: '850px',
        margin: '0 auto',
        textAlign: 'center',
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
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', margin: '0 auto 2rem auto', maxWidth: '600px' }}>
          {subtitle}
        </p>
      )}

      {btnLabel && content.button_url && (
        <a
          href={content.button_url}
          target="_blank"
          rel="noopener noreferrer"
          className="project-intro__enter-btn"
          data-cursor="expand"
          style={{ display: 'inline-block' }}
        >
          ↓ {btnLabel}
        </a>
      )}
    </section>
  );
}
