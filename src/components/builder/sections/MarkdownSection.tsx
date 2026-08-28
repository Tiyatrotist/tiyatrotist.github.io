/**
 * TIYATROTIST — Page Builder Markdown Article Section
 *
 * Renders rich text/markdown body.
 */

import { SectionBlock } from '@/types/builder';

interface SectionProps {
  section: SectionBlock;
  locale: 'tr' | 'en';
}

export default function MarkdownSection({ section, locale }: SectionProps) {
  const { content } = section;
  const body = locale === 'tr' ? content.body_tr : content.body_en;

  if (!body) return null;

  return (
    <section
      className="builder-section builder-markdown"
      style={{
        padding: '3rem 1.5rem',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          fontSize: '0.95rem',
          lineHeight: 1.8,
          color: 'rgba(255,255,255,0.85)',
          whiteSpace: 'pre-wrap',
        }}
      >
        {body}
      </div>
    </section>
  );
}
