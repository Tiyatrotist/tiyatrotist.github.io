'use client';

import { useEffect } from 'react';

export default function DevToolsNotice() {
  useEffect(() => {
    /* eslint-disable no-console */
    console.log(
      '%c[!] TIYATROTIST // DEVELOPER CONSOLE DETECTED',
      'color: #ffffff; background: #000000; font-size: 14px; font-weight: bold; padding: 6px 12px; border: 1px solid #333; border-radius: 4px;'
    );
    console.log(
      '%cBut since you\'re here… welcome, developer.\nExplore the particle nervous system, BookOS microsite, and secret terminal commands.',
      'color: #999999; font-size: 11px; font-style: italic; line-height: 1.5;'
    );
    /* eslint-enable no-console */
  }, []);

  return null;
}
