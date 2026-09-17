/**
 * TIYATROTIST — Admin Image Crop & WebP Optimizer Modal
 *
 * Lets admins visually crop images to standard aspect ratios (16:9, 4:3, 1:1),
 * adjust quality, inspect the resulting file size, and upload directly to Supabase.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { optimizeImageToWebP, OptimizationResult, formatBytes } from '@/lib/image-optimizer';

interface ImageCropModalProps {
  file: File | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (optimizedFile: File) => void;
  defaultAspectRatio?: number; // e.g. 16/9
}

type AspectRatioPreset = 'free' | '16:9' | '4:3' | '1:1';

export default function ImageCropModal({
  file,
  isOpen,
  onClose,
  onConfirm,
  defaultAspectRatio = 16 / 9,
}: ImageCropModalProps) {
  const [preset, setPreset] = useState<AspectRatioPreset>(() => {
    if (Math.abs(defaultAspectRatio - 16 / 9) < 0.01) return '16:9';
    if (Math.abs(defaultAspectRatio - 4 / 3) < 0.01) return '4:3';
    if (Math.abs(defaultAspectRatio - 1) < 0.01) return '1:1';
    return 'free';
  });

  const [quality, setQuality] = useState<number>(0.85);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Process image whenever file, preset, or quality changes
  useEffect(() => {
    if (!file || !isOpen) {
      setResult(null);
      setError(null);
      return;
    }

    let ratio: number | undefined = undefined;
    if (preset === '16:9') ratio = 16 / 9;
    else if (preset === '4:3') ratio = 4 / 3;
    else if (preset === '1:1') ratio = 1;

    setIsProcessing(true);
    setError(null);

    optimizeImageToWebP(file, {
      aspectRatio: ratio,
      quality,
      maxWidth: 1920,
      maxHeight: 1080,
    })
      .then((res) => {
        setResult(res);
      })
      .catch((err) => {
        setError(err.message || 'Optimizasyon hatası.');
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }, [file, isOpen, preset, quality]);

  if (!isOpen || !file) return null;

  const handleConfirm = () => {
    if (result) {
      onConfirm(result.file);
      onClose();
    }
  };

  return (
    <div
      className="admin-modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="admin-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          background: '#0a0a0a',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '8px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.9)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
              Görsel Kırpma & WebP Optimizasyonu
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.45)' }}>
              Yüklenmeden önce tarayıcıda otomatik sıkıştırılır ve WebP formatına dönüştürülür.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="admin-btn admin-btn-ghost admin-btn-sm"
            style={{ fontSize: '0.85rem' }}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
          {/* Controls: Aspect Ratio & Quality */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {/* Aspect Ratio Presets */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', marginBottom: '0.4rem' }}>
                EN-BOY ORANI (ASPECT RATIO)
              </label>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {(['16:9', '4:3', '1:1', 'free'] as AspectRatioPreset[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPreset(r)}
                    className={`admin-btn admin-btn-sm ${preset === r ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                    style={{ fontSize: '0.72rem', flex: 1, padding: '0.3rem 0.4rem' }}
                  >
                    {r === 'free' ? 'Serbest' : r}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Slider */}
            <div style={{ width: '180px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', marginBottom: '0.4rem' }}>
                <span>WEBP KALİTESİ</span>
                <span>{Math.round(quality * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#ffffff', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Preview Image Frame */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '260px',
              maxHeight: '340px',
              backgroundColor: '#050505',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {isProcessing ? (
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                WebP optimizasyonu hesaplanıyor…
              </span>
            ) : result ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={result.dataUrl}
                alt="WebP Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '340px',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            ) : error ? (
              <span style={{ color: '#ff4d4f', fontSize: '0.8rem' }}>{error}</span>
            ) : null}
          </div>

          {/* Compression Metrics Banner */}
          {result && (
            <div
              style={{
                marginTop: '1rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.75rem',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '0.75rem 1rem',
              }}
            >
              <div>
                <span style={{ display: 'block', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                  ORİJİNAL BOYUT
                </span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                  {formatBytes(result.originalSize)}
                </span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                  WEBP BOYUTU
                </span>
                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
                  {formatBytes(result.optimizedSize)}
                </span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                  BOYUT TASARRUFU
                </span>
                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
                  %{result.savedPercent} DAHA KÜÇÜK
                </span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                  ÇÖZÜNÜRLÜK
                </span>
                <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>
                  {result.width} × {result.height}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!result || isProcessing}
            className="admin-btn admin-btn-primary admin-btn-sm"
            style={{ fontWeight: 600 }}
          >
            {isProcessing ? 'İşleniyor…' : '✓ Optimize Et ve Kullan'}
          </button>
        </div>
      </div>
    </div>
  );
}
