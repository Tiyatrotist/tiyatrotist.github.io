/**
 * TIYATROTIST — Web App Manifest (PWA)
 * Next.js App Router Metadata Manifest
 */

import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TIYATROTIST — Monochrome Digital Environment',
    short_name: 'TIYATROTIST',
    description: 'A pure monochrome, typography-driven digital environment and experimental laboratory.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
