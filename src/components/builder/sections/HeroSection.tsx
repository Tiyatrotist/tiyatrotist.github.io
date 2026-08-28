/**
 * TIYATROTIST — Page Builder Hero Section
 *
 * Minimal, typographic Hero section with optional dual CTA buttons.
 */

import Link from 'next/link';
import { SectionBlock } from '@/types/builder';

interface SectionProps {
  section: SectionBlock;
  locale: 'tr' | 'en';
}

export default function HeroSection({ section, locale }: SectionProps) {
  const { content, layout } = section;
  const tag = locale === 'tr' ? content.tag_tr : content.tag_en;
  const title = locale === 'tr' ? content.title_tr : content.title_en;
  const subtitle = locale === 'tr' ? content.subtitle_tr : content.subtitle_en;
  const btnLabel = locale === 'tr' ? content.button_label_tr : content.button_label_en;
  const secBtnLabel = locale === 'tr' ? content.secondary_button_label_tr : content.secondary_button_label_en;

  const isCentered = layout === 'centered';

  return (
    <section
      className={`builder-section builder-hero ${isCentered ? 'builder-hero--centered' : ''}`}
      style={{
        padding: '5rem 1.5rem',
        maxWidth: layout === 'fullWidth' ? '100%' : '1100px',
        margin: '0 auto',
        textAlign: isCentered ? 'center' : 'left',
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
            marginBottom: '1rem',
          }}
        >
          {tag}
        </span>
      )}

      {title && (
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            margin: '0 0 1.25rem 0',
          }}
        >
          {title}
        </h1>
      )}

      {subtitle && (
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: isCentered ? '750px' : '650px',
            margin: isCentered ? '0 auto 2rem auto' : '0 0 2rem 0',
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}

      {(btnLabel || secBtnLabel) && (
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: isCentered ? 'center' : 'flex-start',
            flexWrap: 'wrap',
          }}
        >
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

          {secBtnLabel && content.secondary_button_url && (
            <Link
              href={content.secondary_button_url}
              className="admin-btn admin-btn-ghost"
              data-cursor="expand"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.75rem 1.25rem',
                fontSize: '0.85rem',
              }}
            >
              {secBtnLabel}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
