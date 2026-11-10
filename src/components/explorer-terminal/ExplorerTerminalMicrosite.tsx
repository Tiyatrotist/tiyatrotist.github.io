/**
 * EXPLORER-TERMINAL — Main Product Microsite Container
 *
 * Renders the independent 3D scrollytelling microsite for explorer-terminal:
 * - Three.js 3D Procedural Windows 11 Explorer & Reparented Console
 * - Lenis Smooth Momentum Scrolling
 * - GSAP ScrollTrigger Timeline Scrubbing
 * - Interactive Explorer & Directory Sync Simulator
 */

'use client';

import { useEffect } from 'react';
import { Locale, Dictionary } from '@/dictionaries';
import ExplorerTerminalScrollExperience from './ExplorerTerminalScrollExperience';
import { recordProjectEvent } from '@/lib/project-analytics';

interface ExplorerTerminalMicrositeProps {
  lang: Locale;
  dict: Dictionary;
}

export default function ExplorerTerminalMicrosite({ lang, dict }: ExplorerTerminalMicrositeProps) {
  useEffect(() => {
    console.debug('[ExplorerTerminal:Microsite] Tracking anonymous guest session visit');
    recordProjectEvent({
      projectSlug: 'explorer-terminal',
      event_type: 'page_view',
      event_name: 'explorer-terminal 3D Scrollytelling Ziyareti',
      is_guest: true,
      metadata: { lang, timestamp: Date.now() },
    });
  }, [lang]);

  return <ExplorerTerminalScrollExperience lang={lang} dict={dict} />;
}
