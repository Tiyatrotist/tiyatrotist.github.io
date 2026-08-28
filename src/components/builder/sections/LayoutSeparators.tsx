/**
 * TIYATROTIST — Page Builder Spacer & Divider Sections
 */

import { SectionBlock } from '@/types/builder';

export function SpacerSection({ section }: { section: SectionBlock }) {
  const height = section.content.spacer_height || 48;
  return <div style={{ height: `${height}px`, width: '100%' }} aria-hidden="true" />;
}

export function DividerSection({ section }: { section: SectionBlock }) {
  const isCentered = section.layout === 'centered';
  return (
    <div
      style={{
        maxWidth: isCentered ? '900px' : '100%',
        margin: '0 auto',
        padding: '1.5rem 1.5rem',
      }}
      aria-hidden="true"
    >
      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: 0 }} />
    </div>
  );
}
