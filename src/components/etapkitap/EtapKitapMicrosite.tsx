/**
 * ETAPKITAP — Main Product Microsite Container
 *
 * Renders the independent 3D scrollytelling microsite for EtapKitap:
 * - Three.js 3D Procedural Smart Board & Interactive Textbook
 * - Lenis Smooth Momentum Scrolling
 * - GSAP ScrollTrigger Timeline Scrubbing
 * - Interactive Smart Board Tools Simulator (Spotlight, Curtain, Whiteboards)
 */

'use client';

import { useEffect } from 'react';
import { Locale, Dictionary } from '@/dictionaries';
import EtapKitapScrollExperience from './EtapKitapScrollExperience';
import { recordProjectEvent } from '@/lib/project-analytics';

interface EtapKitapMicrositeProps {
  lang: Locale;
  dict: Dictionary;
}

export default function EtapKitapMicrosite({ lang, dict }: EtapKitapMicrositeProps) {
  useEffect(() => {
    console.debug('[EtapKitap:Microsite] Tracking anonymous guest session visit');
    recordProjectEvent({
      projectSlug: 'etapkitap',
      event_type: 'page_view',
      event_name: 'EtapKitap 3D Scrollytelling Ziyareti',
      is_guest: true,
      metadata: { lang, timestamp: Date.now() },
    });
  }, [lang]);

  return <EtapKitapScrollExperience lang={lang} dict={dict} />;
}
