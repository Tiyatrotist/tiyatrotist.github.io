/**
 * TIYATROTIST — Page Builder CTA Section
 *
 * Call to action block with primary button.
 */

import Link from 'next/link';
import { SectionBlock } from '@/types/builder';

interface SectionProps {
  section: SectionBlock;
  locale: 'tr' | 'en';
}

export default function CTASection({ section, locale }: SectionProps) {
  const { content } = section;
  const tag = locale === 'tr' ? content.tag_tr : content.tag_en;
  const title = locale === 'tr' ? content.title_tr : content.title_en;
  const subtitle = locale === 'tr' ? content.subtitle_tr : content.subtitle_en;
  const btnLabel = locale === 'tr' ? content.button_label_tr : content.button_label_en;

  return (
    <section
      className="builder-section builder-cta"
      style={{
        padding: '5rem 1.5rem',
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          padding: '3rem 2rem',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.02)',
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
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#fff', margin: '0 0 0.75rem 0' }}>
            {title}
          </h2>
        )}

        {subtitle && (
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', maxWidth: '550px', margin: '0 auto 1.75rem auto' }}>
            {subtitle}
          </p>
        )}

        {btnLabel && content.button_url && (
          <Link
            href={content.button_url}
            className="project-intro__enter-btn"
            data-cursor="expand"
            style={{ display: 'inline-block' }}
          >
            {btnLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
