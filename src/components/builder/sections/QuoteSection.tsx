/**
 * TIYATROTIST — Page Builder Quote Section
 *
 * High-impact pullquote / testimonial block.
 */

import { SectionBlock } from '@/types/builder';

interface SectionProps {
  section: SectionBlock;
  locale: 'tr' | 'en';
}

export default function QuoteSection({ section, locale }: SectionProps) {
  const { content } = section;
  const quote = locale === 'tr' ? content.body_tr : content.body_en;
  const author = locale === 'tr' ? content.quote_author_tr : content.quote_author_en;
  const role = locale === 'tr' ? content.quote_role_tr : content.quote_role_en;

  if (!quote) return null;

  return (
    <section
      className="builder-section builder-quote"
      style={{
        padding: '5rem 1.5rem',
        maxWidth: '850px',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <blockquote
        style={{
          margin: 0,
          padding: 0,
        }}
      >
        <p
          style={{
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            fontWeight: 500,
            lineHeight: 1.5,
            color: '#ffffff',
            letterSpacing: '-0.01em',
            margin: '0 0 1.5rem 0',
          }}
        >
          “{quote}”
        </p>

        {(author || role) && (
          <footer style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
            {author && <strong style={{ color: '#fff', display: 'block', marginBottom: '0.2rem' }}>{author}</strong>}
            {role && <span>{role}</span>}
          </footer>
        )}
      </blockquote>
    </section>
  );
}
