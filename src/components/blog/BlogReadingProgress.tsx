/**
 * TIYATROTIST — Editorial Scroll Reading Progress Bar
 *
 * Minimalist 2px pure monochrome progress bar that tracks scroll progress
 * along the article length.
 */

'use client';

import React, { useEffect, useState } from 'react';

export default function BlogReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrollPercent = (totalScroll / windowHeight) * 100;
        setProgress(Math.min(100, Math.max(0, scrollPercent)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        zIndex: 99999,
        background: 'rgba(255, 255, 255, 0.05)',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          background: '#ffffff',
          boxShadow: '0 0 8px rgba(255, 255, 255, 0.6)',
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
}
