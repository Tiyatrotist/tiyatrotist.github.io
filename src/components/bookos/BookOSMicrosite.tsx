/**
 * BOOKOS — Main Product Microsite Container Component
 *
 * Renders the state-of-the-art 3D interactive scrollytelling experience:
 * - Lenis momentum scrolling
 * - GSAP ScrollTrigger timeline scrubbing
 * - Three.js 3D monolithic device transformations
 * - Phase 1 (Mobile & Web) + Phase 2 (Pardus-Surpassing Smart Board OS) roadmap.
 */

'use client';

import { useEffect } from 'react';
import { Locale, Dictionary } from '@/dictionaries';
import BookOSScrollExperience from './BookOSScrollExperience';
import { recordProjectEvent } from '@/lib/project-analytics';
import '@/styles/bookos.css';

interface BookOSMicrositeProps {
  lang: Locale;
  dict: Dictionary;
}

export default function BookOSMicrosite({ lang, dict }: BookOSMicrositeProps) {
  useEffect(() => {
    console.debug('[BookOS:Microsite] Tracking anonymous guest session visit');
    recordProjectEvent({
      projectSlug: 'bookos',
      event_type: 'page_view',
      event_name: 'BookOS 3D Scrollytelling Ziyareti',
      is_guest: true,
      metadata: { lang, timestamp: Date.now() },
    });
  }, [lang]);

  return <BookOSScrollExperience lang={lang} dict={dict} />;
}
