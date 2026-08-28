/**
 * TIYATROTIST — Page Builder Contact Section
 *
 * Contact details and network links block.
 */

import { SectionBlock } from '@/types/builder';

interface SectionProps {
  section: SectionBlock;
  locale: 'tr' | 'en';
}

export default function ContactSection({ section, locale }: SectionProps) {
  const { content } = section;
  const tag = locale === 'tr' ? content.tag_tr : content.tag_en;
  const title = locale === 'tr' ? content.title_tr : content.title_en;
  const email = content.contact_email || 'contact@tiyatrotist.com';
  const links = content.contact_links || [
    { label: 'GitHub', url: 'https://github.com' },
    { label: 'X / Twitter', url: 'https://x.com' },
    { label: 'Instagram', url: 'https://instagram.com' },
  ];

  return (
    <section
      className="builder-section builder-contact"
      style={{
        padding: '4rem 1.5rem',
        maxWidth: '900px',
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
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
            {title}
          </h2>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <span className="page-tag" style={{ fontSize: '0.7rem' }}>
            {locale === 'tr' ? '[ DOĞRUDAN // DIRECT ]' : '[ DIRECT // DOĞRUDAN ]'}
          </span>
          <p style={{ marginTop: '0.5rem', fontSize: '1.25rem', color: '#ffffff', fontFamily: 'monospace' }}>
            {email}
          </p>
        </div>

        <div>
          <span className="page-tag" style={{ fontSize: '0.7rem' }}>
            {locale === 'tr' ? '[ AĞLAR // NETWORKS ]' : '[ NETWORKS // AĞLAR ]'}
          </span>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card-link"
                data-cursor="expand"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
