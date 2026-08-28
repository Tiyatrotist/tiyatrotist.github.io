/**
 * TIYATROTIST — Isolated Translation Service
 *
 * Pluggable provider abstraction for bilingual CMS content translation.
 * - Technical token masking and restoration
 * - Caching layer
 * - Explicitly configurable provider: returns clear "provider not configured" error
 *   when no backend endpoint is configured (no fake AI simulation).
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
 * Remote API Translation Provider
 * Connects to a backend translation endpoint (Cloudflare Worker / Supabase Edge Function / External API).
 */
export class RemoteApiTranslationProvider implements ITranslationProvider {
  readonly name = 'Remote API Provider';

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
      throw new Error(
        'Çeviri sağlayıcısı yapılandırılmamış. Lütfen bir çeviri uç noktası (TRANSLATION_API_URL) tanımlayın veya backend servisini bağlayın.'
      );
    }

    // 1. Mask technical tokens before sending to provider
    const { maskedText, tokens } = maskTechnicalContent(req.text);

    console.debug('[translation] Sending masked text to remote provider:', {
      source: req.sourceLanguage,
      target: req.targetLanguage,
      tokenCount: tokens.size,
      endpoint: this.endpointUrl,
    });

    const response = await fetch(this.endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: maskedText,
        sourceLanguage: req.sourceLanguage,
        targetLanguage: req.targetLanguage,
        context: req.context || 'software developer portfolio & technical CMS',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Çeviri servisi hatası (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawTranslated = data.translatedText || data.translation || '';

    // 2. Unmask technical tokens
    const restoredText = unmaskTechnicalContent(rawTranslated, tokens);

    return {
      translatedText: restoredText,
      provider: this.name,
    };
  }
}

/**
 * Main Translation Service
 */
class TranslationService {
  private provider: ITranslationProvider;

  constructor() {
    this.provider = new RemoteApiTranslationProvider();
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

    // 2. Execute translation via provider
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
