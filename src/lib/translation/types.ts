/**
 * TIYATROTIST — Translation Service Types
 *
 * Provider-agnostic interfaces for CMS bilingual workflow.
 */

export type SupportedLanguage = 'tr' | 'en';

export interface TranslationRequest {
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  text: string;
  context?: string;
}

export interface TranslationResponse {
  translatedText: string;
  provider: string;
  cached?: boolean;
}

export interface ITranslationProvider {
  readonly name: string;
  isAvailable(): boolean;
  translate(req: TranslationRequest): Promise<TranslationResponse>;
}

export type TranslationCompleteness =
  | 'TRANSLATED'          // Both TR and EN present and in sync
  | 'MISSING_ENGLISH'     // TR present, EN empty
  | 'MISSING_TURKISH'     // EN present, TR empty
  | 'OUTDATED'            // Source updated after target
  | 'EMPTY';              // Neither present
