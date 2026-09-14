/**
 * BOOKOS — Main Product Microsite Container Component
 * Renders the independent BookOS operating system microsite experience.
 */

'use client';

import { useEffect } from 'react';
import { Locale, Dictionary } from '@/dictionaries';
import BookOSHeader from './BookOSHeader';
import BookOSHero from './BookOSHero';
import BookOSShowcase from './BookOSShowcase';
import BookOSFeatures from './BookOSFeatures';
import BookOSTechnical from './BookOSTechnical';
import BookOSReleases from './BookOSReleases';
import BookOSDownload from './BookOSDownload';
import BookOSFooter from './BookOSFooter';
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
      event_name: 'BookOS Çalışma Alanı Ziyareti',
      is_guest: true,
      metadata: { lang, timestamp: Date.now() },
    });
  }, [lang]);

  return (
    <div className="bookos-microsite">
      <BookOSHeader lang={lang} dict={dict} />
      <main>
        <BookOSHero lang={lang} dict={dict} />
        <BookOSShowcase dict={dict} />
        <BookOSFeatures dict={dict} />
        <BookOSTechnical dict={dict} />
        <BookOSReleases dict={dict} />
        <BookOSDownload dict={dict} />
      </main>
      <BookOSFooter lang={lang} dict={dict} />
    </div>
  );
}
