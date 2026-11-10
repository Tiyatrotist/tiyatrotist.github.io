/**
 * E.D.I.T.H — Main Product Microsite Container
 *
 * Renders the independent 3D scrollytelling microsite for E.D.I.T.H:
 * - Three.js 3D Procedural Neural Core
 * - Lenis Smooth Momentum Scrolling
 * - GSAP ScrollTrigger Timeline Scrubbing
 * - Interactive Multi-Agent Terminal Sandbox
 */

'use client';

import { useEffect } from 'react';
import { Locale, Dictionary } from '@/dictionaries';
import EdithScrollExperience from './EdithScrollExperience';
import { recordProjectEvent } from '@/lib/project-analytics';

interface EdithMicrositeProps {
  lang: Locale;
  dict: Dictionary;
}

export default function EdithMicrosite({ lang, dict }: EdithMicrositeProps) {
  useEffect(() => {
    console.debug('[Edith:Microsite] Tracking anonymous guest session visit');
    recordProjectEvent({
      projectSlug: 'edith',
      event_type: 'page_view',
      event_name: 'E.D.I.T.H 3D Scrollytelling Ziyareti',
      is_guest: true,
      metadata: { lang, timestamp: Date.now() },
    });
  }, [lang]);

  return <EdithScrollExperience lang={lang} dict={dict} />;
}
