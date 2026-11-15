/**
 * TIYATROTIST — Web App Manifest (PWA)
 * Next.js App Router Metadata Manifest
 */

import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TIYATROTIST — Sistem Geliştiricisi & Açık Kaynak Portfolyo',
    short_name: 'TIYATROTIST',
    description: 'Buğra Dere (Tiyatrotist). Sistem mimarisi, C++20, Qt 6, Linux dağıtım altyapısı ve açık kaynak projeler.',
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
