/**
 * TIYATROTIST — Page Builder Media Gallery Section
 *
 * Responsive media vitrine supporting images and video previews.
 */

import { SectionBlock } from '@/types/builder';

interface SectionProps {
  section: SectionBlock;
  locale: 'tr' | 'en';
}

export default function MediaGallerySection({ section, locale }: SectionProps) {
  const { content } = section;
  const tag = locale === 'tr' ? content.tag_tr : content.tag_en;
  const title = locale === 'tr' ? content.title_tr : content.title_en;
  const mediaUrls = content.media_urls || [];

  return (
    <section
      className="builder-section builder-media-gallery"
      style={{
        padding: '3rem 1.5rem',
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
            marginBottom: '0.75rem',
          }}
        >
          {tag}
        </span>
      )}

      {title && (
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', margin: '0 0 1.5rem 0' }}>
          {title}
        </h2>
      )}

      {mediaUrls.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
          {locale === 'tr' ? 'Henüz medya eklenmedi.' : 'No media added yet.'}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {mediaUrls.map((url, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Media ${idx + 1}`}
                loading="lazy"
                style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
