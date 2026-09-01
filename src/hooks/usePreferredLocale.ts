'use client';

import { useSyncExternalStore } from 'react';
import { Locale } from '@/dictionaries/types';

const DEFAULT_LOCALE: Locale = 'tr';

function getPreferredLocale(): Locale {
  const stored = localStorage.getItem('preferred_lang');
  if (stored === 'tr' || stored === 'en') return stored;
  return navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en';
}

function subscribeToLocaleChanges(onStoreChange: () => void): () => void {
  window.addEventListener('storage', onStoreChange);
  return () => window.removeEventListener('storage', onStoreChange);
}

export function usePreferredLocale(): Locale {
  return useSyncExternalStore(
    subscribeToLocaleChanges,
    getPreferredLocale,
    () => DEFAULT_LOCALE,
  );
}
