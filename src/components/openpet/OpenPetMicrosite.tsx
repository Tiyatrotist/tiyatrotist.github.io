/**
 * OPENPET — Main Product Microsite Container
 *
 * Renders the independent 3D scrollytelling microsite for OpenPet:
 * - Three.js 3D Procedural Cyber-Companion & Telemetry HUD
 * - Lenis Smooth Momentum Scrolling
 * - GSAP ScrollTrigger Timeline Scrubbing
 * - Interactive Behavior FSM & Mood Simulator
 */

'use client';

import { useEffect } from 'react';
import { Locale, Dictionary } from '@/dictionaries';
import OpenPetScrollExperience from './OpenPetScrollExperience';
import { recordProjectEvent } from '@/lib/project-analytics';

interface OpenPetMicrositeProps {
  lang: Locale;
  dict: Dictionary;
}

export default function OpenPetMicrosite({ lang, dict }: OpenPetMicrositeProps) {
  useEffect(() => {
    console.debug('[OpenPet:Microsite] Tracking anonymous guest session visit');
    recordProjectEvent({
      projectSlug: 'openpet',
      event_type: 'page_view',
      event_name: 'OpenPet 3D Scrollytelling Ziyareti',
      is_guest: true,
      metadata: { lang, timestamp: Date.now() },
    });
  }, [lang]);

  return <OpenPetScrollExperience lang={lang} dict={dict} />;
}
