/**
 * TIYATROTIST — Translation Action Component
 *
 * Provides translation controls with:
 * - Direction toggle (TR -> EN or EN -> TR)
 * - Loading and error states with retry
 * - Overwrite confirmation safeguard
 * - Translation status badge (Translated / Missing / Outdated)
 */

'use client';

import { useState } from 'react';
import { translationService } from '@/lib/translation/translation-service';
import { SupportedLanguage } from '@/lib/translation/types';
import ConfirmDialog from './ConfirmDialog';

interface TranslationActionProps {
  sourceText: string;
  targetText: string;
  sourceLang: SupportedLanguage;
  targetLang: SupportedLanguage;
  context?: string;
  onTranslated: (translatedText: string) => void;
  label?: string;
  sourceUpdatedAt?: string | null;
  targetUpdatedAt?: string | null;
}

export default function TranslationAction({
  sourceText,
  targetText,
  sourceLang,
  targetLang,
  context,
  onTranslated,
  label,
  sourceUpdatedAt,
  targetUpdatedAt,
}: TranslationActionProps) {
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const status = translationService.computeStatus(
    sourceLang === 'tr' ? sourceText : targetText,
    sourceLang === 'tr' ? targetText : sourceText,
    sourceUpdatedAt,
    targetUpdatedAt
  );

  const executeTranslation = async () => {
    if (!sourceText || !sourceText.trim()) {
      setError(sourceLang === 'tr' ? 'Kaynak Türkçe metin boş.' : 'Source English text is empty.');
      return;
    }

    setTranslating(true);
    setError(null);
    setSuccessMsg(null);

    try {
      console.debug('[translation-action] Requesting translation:', {
        sourceLang,
        targetLang,
        length: sourceText.length,
        context,
      });

      const response = await translationService.translate({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        text: sourceText,
        context: context || 'software portfolio CMS',
      });

      if (response.translatedText) {
        onTranslated(response.translatedText);
        setSuccessMsg(`✓ Çevrildi (${response.provider})`);
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err: unknown) {
      console.error('[translation-action] Translation failed:', err);
      const msg = err instanceof Error ? err.message : 'Çeviri işlemi başarısız oldu.';
      setError(msg);
    } finally {
      setTranslating(false);
      setShowConfirm(false);
    }
  };

  const handleTranslateClick = () => {
    if (!sourceText || !sourceText.trim()) {
      setError(sourceLang === 'tr' ? 'Lütfen önce kaynak metni girin.' : 'Please enter source text first.');
      return;
    }

    // Check if target text already exists -> trigger overwrite confirmation
    if (targetText && targetText.trim()) {
      setShowConfirm(true);
    } else {
      executeTranslation();
    }
  };

  const buttonLabel =
    label ||
    (targetLang === 'en'
      ? '🇬🇧 İngilizceye Çevir →'
      : '🇹🇷 Türkçeye Çevir →');

  const statusBadge = () => {
    switch (status) {
      case 'TRANSLATED':
        return <span className="admin-badge admin-badge-published" style={{ fontSize: '0.6rem' }}>✓ ÇEVRİLDİ</span>;
      case 'MISSING_ENGLISH':
        return <span className="admin-badge admin-badge-draft" style={{ fontSize: '0.6rem' }}>EKSİK İNGİLİZCE</span>;
      case 'MISSING_TURKISH':
        return <span className="admin-badge admin-badge-draft" style={{ fontSize: '0.6rem' }}>EKSİK TÜRKÇE</span>;
      case 'OUTDATED':
        return <span className="admin-badge admin-badge-featured" style={{ fontSize: '0.6rem' }}>⚠️ ÇEVİRİ ESKİ OLABİLİR</span>;
      default:
        return null;
    }
  };

  return (
    <div className="admin-translation-action-wrap" style={{ margin: '0.5rem 0 1rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={handleTranslateClick}
            disabled={translating || !sourceText}
            style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}
          >
            {translating ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span className="admin-spinner" style={{ width: '10px', height: '10px', borderWidth: '1.5px' }} />
                Çevriliyor…
              </span>
            ) : (
              buttonLabel
            )}
          </button>
          {statusBadge()}
          {successMsg && (
            <span
              style={{
                fontSize: '0.68rem',
                color: '#10b981',
                fontWeight: 600,
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              {successMsg}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div
          className="admin-login-error"
          style={{ marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={executeTranslation}
            className="admin-btn admin-btn-ghost admin-btn-sm"
            style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', border: '1px solid rgba(231,76,60,0.5)' }}
          >
            Yeniden Dene
          </button>
        </div>
      )}

      {/* Overwrite Confirmation Modal */}
      <ConfirmDialog
        open={showConfirm}
        title="Mevcut Çevirinin Üzerine Yaz"
        message={`Hedef ${targetLang === 'en' ? 'İngilizce' : 'Türkçe'} metin zaten mevcut. Otomatik çeviri ile üzerine yazmak istediğinizden emin misiniz?`}
        confirmLabel="Üzerine Yaz"
        cancelLabel="İptal"
        loading={translating}
        onConfirm={executeTranslation}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
