/**
 * TIYATROTIST — Translation Cache
 *
 * In-memory & Session-based translation caching.
 * Keyed by: sourceLang + targetLang + context + textHash.
 */

import { TranslationRequest } from './types';

const memoryCache = new Map<string, string>();

function generateKey(req: TranslationRequest): string {
  const normalized = req.text.trim();
  const contextKey = (req.context || 'general').trim();
  return `${req.sourceLanguage}:${req.targetLanguage}:${contextKey}:${normalized}`;
}

export const translationCache = {
  get(req: TranslationRequest): string | null {
    const key = generateKey(req);
    // 1. Check in-memory cache
    if (memoryCache.has(key)) {
      return memoryCache.get(key)!;
    }

    // 2. Check sessionStorage if available
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const item = window.sessionStorage.getItem(`tr_cache_${key}`);
        if (item) {
          memoryCache.set(key, item);
          return item;
        }
      } catch {
        // Ignore storage exceptions
      }
    }

    return null;
  },

  set(req: TranslationRequest, translatedText: string): void {
    const key = generateKey(req);
    memoryCache.set(key, translatedText);

    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        window.sessionStorage.setItem(`tr_cache_${key}`, translatedText);
      } catch {
        // Ignore storage quota exceptions
      }
    }
  },

  clear(): void {
    memoryCache.clear();
  },
};
