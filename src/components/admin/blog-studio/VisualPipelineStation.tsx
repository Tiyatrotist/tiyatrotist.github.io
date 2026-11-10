/**
 * TIYATROTIST — Visual Pipeline Station
 *
 * Overview and management station for all visual assets in the current blog draft.
 * Features progress metrics, filter tabs, batch prompt modal, and asset cards.
 */

'use client';

import React, { useState } from 'react';
import { VisualAsset } from '@/types/blog-studio';
import VisualAssetCard from './VisualAssetCard';

interface VisualPipelineStationProps {
  assets: VisualAsset[];
  onAssetUpdated: (updated: VisualAsset) => void;
  onNavigateToPreview: () => void;
}

type FilterTab = 'all' | 'pending_screenshot' | 'pending_ai' | 'ready';

export default function VisualPipelineStation({
  assets,
  onAssetUpdated,
  onNavigateToPreview,
}: VisualPipelineStationProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [copiedBatch, setCopiedBatch] = useState(false);

  const totalCount = assets.length;
  const readyCount = assets.filter((a) => a.status === 'ready').length;
  const pendingScreenshots = assets.filter(
    (a) => a.type === 'SCREENSHOT_REQUIRED' && a.status === 'pending'
  ).length;
  const pendingAi = assets.filter(
    (a) => a.type === 'AI_IMAGE_PROMPT' && a.status === 'pending'
  ).length;

  const percent = totalCount > 0 ? Math.round((readyCount / totalCount) * 100) : 0;

  const filteredAssets = assets.filter((asset) => {
    if (activeFilter === 'pending_screenshot') {
      return asset.type === 'SCREENSHOT_REQUIRED' && asset.status === 'pending';
    }
    if (activeFilter === 'pending_ai') {
      return asset.type === 'AI_IMAGE_PROMPT' && asset.status === 'pending';
    }
    if (activeFilter === 'ready') {
      return asset.status === 'ready';
    }
    return true;
  });

  const handleCopyAllPrompts = async () => {
    const aiAssets = assets.filter((a) => a.type === 'AI_IMAGE_PROMPT' && a.specs?.prompt);
    const combined = aiAssets
      .map(
        (a, i) =>
          `// --- PROMPT ${i + 1}: ${a.title} ---\n${a.specs.prompt}\n`
      )
      .join('\n');

    try {
      await navigator.clipboard.writeText(combined);
      setCopiedBatch(true);
      setTimeout(() => setCopiedBatch(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Pipeline Status Banner */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.4)' }}>
              GÖRSEL İŞ AKIŞI DURUMU
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>
              {readyCount} / {totalCount} Görsel Tamamlandı ({percent}%)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {assets.some((a) => a.type === 'AI_IMAGE_PROMPT') && (
              <button
                type="button"
                onClick={() => setShowBatchModal(true)}
                className="admin-btn admin-btn-secondary admin-btn-sm"
                style={{ fontSize: '0.7rem' }}
              >
                ✦ Tüm Banana 2 Promptlarını Gör
              </button>
            )}
            <button
              type="button"
              onClick={onNavigateToPreview}
              className="admin-btn admin-btn-primary admin-btn-sm"
              style={{ fontSize: '0.7rem' }}
            >
              Canlı Önizlemeyi Aç ↗
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: '4px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${percent}%`,
              background: '#ffffff',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Quick Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
            paddingTop: '0.5rem',
          }}
        >
          <div
            onClick={() => setActiveFilter('pending_screenshot')}
            style={{
              padding: '0.6rem 0.8rem',
              borderRadius: '4px',
              background: activeFilter === 'pending_screenshot' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase' }}>
              Ekran Görüntüsü
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: pendingScreenshots > 0 ? '#ffffff' : 'rgba(255,255,255,0.4)' }}>
              {pendingScreenshots} Bekliyor
            </div>
          </div>

          <div
            onClick={() => setActiveFilter('pending_ai')}
            style={{
              padding: '0.6rem 0.8rem',
              borderRadius: '4px',
              background: activeFilter === 'pending_ai' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase' }}>
              Banana 2 Prompt
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: pendingAi > 0 ? '#ffffff' : 'rgba(255,255,255,0.4)' }}>
              {pendingAi} Bekliyor
            </div>
          </div>

          <div
            onClick={() => setActiveFilter('ready')}
            style={{
              padding: '0.6rem 0.8rem',
              borderRadius: '4px',
              background: activeFilter === 'ready' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase' }}>
              Hazır & Yüklendi
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: readyCount > 0 ? '#ffffff' : 'rgba(255,255,255,0.4)' }}>
              {readyCount} Görsel
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`admin-tab ${activeFilter === 'all' ? 'active' : ''}`}
        >
          Tüm Görevler ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('pending_screenshot')}
          className={`admin-tab ${activeFilter === 'pending_screenshot' ? 'active' : ''}`}
        >
          📸 Bekleyen Ekran Görüntüleri ({pendingScreenshots})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('pending_ai')}
          className={`admin-tab ${activeFilter === 'pending_ai' ? 'active' : ''}`}
        >
          ✦ Bekleyen Banana 2 Promptları ({pendingAi})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('ready')}
          className={`admin-tab ${activeFilter === 'ready' ? 'active' : ''}`}
        >
          ✓ Hazır ({readyCount})
        </button>
      </div>

      {/* Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredAssets.length === 0 ? (
          <div
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              borderRadius: '6px',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '0.8rem',
            }}
          >
            Seçili filtreye uygun görsel görevi bulunamadı.
          </div>
        ) : (
          filteredAssets.map((asset, idx) => (
            <VisualAssetCard
              key={asset.id}
              asset={asset}
              index={idx}
              onAssetUpdated={onAssetUpdated}
            />
          ))
        )}
      </div>

      {/* Batch Prompt Modal */}
      {showBatchModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setShowBatchModal(false)}
        >
          <div
            style={{
              background: '#0e0e0e',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              maxWidth: '720px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>
                  Tüm Banana 2 / AI Görsel Promptları
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                  Bu yazı için tasarlanmış tüm görsel promptları. Tek tıkla topluca kopyalayabilirsiniz.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBatchModal(false)}
                className="admin-btn admin-btn-ghost admin-btn-sm"
              >
                ✕ Kapat
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {assets
                .filter((a) => a.type === 'AI_IMAGE_PROMPT' && a.specs?.prompt)
                .map((a, i) => (
                  <div
                    key={a.id}
                    style={{
                      padding: '1rem',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
                      #{i + 1} — {a.title}
                    </div>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.75)',
                        lineHeight: 1.5,
                        background: '#050505',
                        padding: '0.75rem',
                        borderRadius: '3px',
                      }}
                    >
                      {a.specs.prompt}
                    </div>
                  </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handleCopyAllPrompts}
                className="admin-btn admin-btn-primary"
              >
                {copiedBatch ? '✓ Tüm Promptlar Kopyalandı' : 'Tümünü Kopyala (Batch) 📋'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
