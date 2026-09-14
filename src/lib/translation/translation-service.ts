/**
 * TIYATROTIST — Isolated Translation Service
 *
 * Pluggable provider abstraction for bilingual CMS content translation.
 * - Technical token masking and restoration (Markdown, code, links, protected terms)
 * - Multi-tier translation pipeline:
 *   1. Remote API Provider (if explicitly configured via NEXT_PUBLIC_TRANSLATION_API_URL)
 *   2. Google Translate Engine (Free public GTX endpoint, zero setup, ~100ms latency)
 *   3. MyMemory Neural Translation (Free fallback provider)
 * - In-memory and session caching layer
 */

import {
  ITranslationProvider,
  TranslationRequest,
  TranslationResponse,
  TranslationCompleteness,
} from './types';
import { maskTechnicalContent, unmaskTechnicalContent } from './tokenizer';
import { translationCache } from './cache';

/**
 * 1. Google Translate Public Engine
 * Uses the standard zero-configuration client endpoint for instant, high-quality bilingual translation.
 */
export class GoogleTranslatePublicProvider implements ITranslationProvider {
  readonly name = 'Google Translate Engine';

  isAvailable(): boolean {
    return true;
  }

  async translate(req: TranslationRequest): Promise<TranslationResponse> {
    const { maskedText, tokens } = maskTechnicalContent(req.text);

    console.debug('[translation:google] Initiating translation request:', {
      source: req.sourceLanguage,
      target: req.targetLanguage,
      length: maskedText.length,
    });

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${req.sourceLanguage}&tl=${req.targetLanguage}&dt=t&q=${encodeURIComponent(
      maskedText
    )}`;

    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Google Translate HTTP error (${response.status})`);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data[0])) {
      throw new Error('Google Translate returned an unexpected data structure');
    }

    // Concatenate all translated chunks
    const rawTranslated = data[0].map((chunk: any) => chunk[0] || '').join('');
    if (!rawTranslated) {
      throw new Error('Google Translate returned an empty translation result');
    }

    const restoredText = unmaskTechnicalContent(rawTranslated, tokens);

    return {
      translatedText: restoredText,
      provider: this.name,
    };
  }
}

/**
 * 2. MyMemory Translation Provider
 * High-reliability fallback provider when Google endpoints are throttled or offline.
 */
export class MyMemoryPublicProvider implements ITranslationProvider {
  readonly name = 'MyMemory Translate Engine';

  isAvailable(): boolean {
    return true;
  }

  async translate(req: TranslationRequest): Promise<TranslationResponse> {
    const { maskedText, tokens } = maskTechnicalContent(req.text);

    console.debug('[translation:mymemory] Initiating fallback translation request:', {
      source: req.sourceLanguage,
      target: req.targetLanguage,
      length: maskedText.length,
    });

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      maskedText
    )}&langpair=${req.sourceLanguage}|${req.targetLanguage}`;

    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`MyMemory HTTP error (${response.status})`);
    }

    const data = await response.json();
    const rawTranslated = data.responseData?.translatedText || '';

    if (!rawTranslated || data.responseStatus !== 200) {
      throw new Error(data.responseDetails || 'MyMemory translation failed');
    }

    const restoredText = unmaskTechnicalContent(rawTranslated, tokens);

    return {
      translatedText: restoredText,
      provider: this.name,
    };
  }
}

/**
 * 3. Custom Remote API Translation Provider
 * Connects to a custom backend endpoint if defined in environment.
 */
export class RemoteApiTranslationProvider implements ITranslationProvider {
  readonly name = 'Custom Remote API';

  private endpointUrl: string | null;

  constructor(endpointUrl?: string) {
    this.endpointUrl =
      endpointUrl ||
      (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TRANSLATION_API_URL || null : null);
  }

  isAvailable(): boolean {
    return Boolean(this.endpointUrl);
  }

  async translate(req: TranslationRequest): Promise<TranslationResponse> {
    if (!this.isAvailable() || !this.endpointUrl) {
      throw new Error('Custom translation API URL is not configured.');
    }

    const { maskedText, tokens } = maskTechnicalContent(req.text);

    const response = await fetch(this.endpointUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: maskedText,
        sourceLanguage: req.sourceLanguage,
        targetLanguage: req.targetLanguage,
        context: req.context || 'software developer portfolio & technical CMS',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Custom API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawTranslated = data.translatedText || data.translation || '';
    const restoredText = unmaskTechnicalContent(rawTranslated, tokens);

    return {
      translatedText: restoredText,
      provider: this.name,
    };
  }
}

/**
 * 4. Composite Multi-Tier Translation Provider
 * Tries Remote API -> Google Translate -> MyMemory sequentially.
 */
export class CompositeTranslationProvider implements ITranslationProvider {
  readonly name = 'Composite Translation Engine';

  private providers: ITranslationProvider[];

  constructor() {
    this.providers = [
      new RemoteApiTranslationProvider(),
      new GoogleTranslatePublicProvider(),
      new MyMemoryPublicProvider(),
    ];
  }

  isAvailable(): boolean {
    return true;
  }

  async translate(req: TranslationRequest): Promise<TranslationResponse> {
    let lastError: Error | null = null;

    for (const provider of this.providers) {
      if (!provider.isAvailable()) continue;

      try {
        const result = await provider.translate(req);
        if (result && result.translatedText && result.translatedText.trim()) {
          console.debug(`[translation:composite] Succeeded with provider: ${provider.name}`);
          return result;
        }
      } catch (err: any) {
        console.warn(`[translation:composite] Provider "${provider.name}" failed, falling back:`, err?.message || err);
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    throw lastError || new Error('Tüm çeviri servisleri meşgul. Lütfen tekrar deneyin.');
  }
}

/**
 * Main Translation Service Singleton
 */
class TranslationService {
  private provider: ITranslationProvider;

  constructor() {
    this.provider = new CompositeTranslationProvider();
  }

  /**
   * Set custom provider
   */
  setProvider(provider: ITranslationProvider) {
    this.provider = provider;
  }

  /**
   * Check if a translation provider is actively configured
   */
  isConfigured(): boolean {
    return this.provider.isAvailable();
  }

  /**
   * Translate text with technical preservation and caching
   */
  async translate(req: TranslationRequest): Promise<TranslationResponse> {
    if (!req.text || !req.text.trim()) {
      return { translatedText: '', provider: 'none' };
    }

    // 1. Check cache
    const cached = translationCache.get(req);
    if (cached !== null) {
      console.debug('[translation] Returning cached translation for:', req.sourceLanguage, '->', req.targetLanguage);
      return {
        translatedText: cached,
        provider: 'cache',
        cached: true,
      };
    }

    // 2. Execute translation via composite provider
    const result = await this.provider.translate(req);

    // 3. Save to cache
    if (result.translatedText) {
      translationCache.set(req, result.translatedText);
    }

    return result;
  }

  /**
   * Helper to compute translation completeness status for a bilingual field
   */
  computeStatus(
    textTr?: string | null,
    textEn?: string | null,
    sourceUpdatedAt?: string | null,
    targetUpdatedAt?: string | null
  ): TranslationCompleteness {
    const hasTr = Boolean(textTr && textTr.trim());
    const hasEn = Boolean(textEn && textEn.trim());

    if (!hasTr && !hasEn) return 'EMPTY';
    if (hasTr && !hasEn) return 'MISSING_ENGLISH';
    if (!hasTr && hasEn) return 'MISSING_TURKISH';

    // If both exist, check if source was updated after target
    if (sourceUpdatedAt && targetUpdatedAt) {
      const sourceTime = new Date(sourceUpdatedAt).getTime();
      const targetTime = new Date(targetUpdatedAt).getTime();
      if (sourceTime > targetTime + 60000) { // 1 min buffer
        return 'OUTDATED';
      }
    }

    return 'TRANSLATED';
  }
}

export const translationService = new TranslationService();
