/**
 * TIYATROTIST — Visual Asset Task Card
 *
 * Handles both:
 * 1. SCREENSHOT_REQUIRED: Informs user what screen to capture, resolution, and elements.
 * 2. AI_IMAGE_PROMPT: Displays Banana 2 / AI prompt with one-click copy and upload slot.
 *
 * Includes automatic WebP optimization and Supabase Storage upload (with DataURL fallback).
 */

'use client';

import React, { useState, useRef } from 'react';
import { VisualAsset } from '@/types/blog-studio';
import { optimizeImageToWebP, formatBytes } from '@/lib/image-optimizer';
import { supabase } from '@/lib/supabase';

interface VisualAssetCardProps {
  asset: VisualAsset;
  onAssetUpdated: (updated: VisualAsset) => void;
  index: number;
}

export default function VisualAssetCard({ asset, onAssetUpdated, index }: VisualAssetCardProps) {
  const [copying, setCopying] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isScreenshot = asset.type === 'SCREENSHOT_REQUIRED';

  const handleCopyPrompt = async () => {
    if (!asset.specs.prompt) return;
    try {
      await navigator.clipboard.writeText(asset.specs.prompt);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      // 1. Optimize on client-side to WebP
      const optResult = await optimizeImageToWebP(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.88,
      });

      let finalUrl = optResult.dataUrl;

      // 2. Attempt Supabase upload if available
      try {
        const safeName = `studio-${asset.id}-${Date.now()}.webp`;
        const { error: uploadErr } = await supabase.storage
          .from('site-media')
          .upload(safeName, optResult.file, {
            contentType: 'image/webp',
            cacheControl: '3600',
            upsert: true,
          });

        if (!uploadErr) {
          const { data } = supabase.storage.from('site-media').getPublicUrl(safeName);
          if (data?.publicUrl) {
            finalUrl = data.publicUrl;
          }
        } else {
          console.debug('[VisualAssetCard] Storage upload fallback to DataURL:', uploadErr.message);
        }
      } catch (storageErr) {
        console.debug('[VisualAssetCard] Supabase storage exception:', storageErr);
      }

      // 3. Update asset status
      onAssetUpdated({
        ...asset,
        status: 'ready',
        imageUrl: finalUrl,
        fileName: file.name,
        fileSize: optResult.optimizedSize,
        uploadedAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Görsel işlenirken hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    } else {
      setError('Lütfen geçerli bir görsel dosyası (PNG, JPG, WebP) sürükleyin.');
    }
  };

  const handleRemove = () => {
    onAssetUpdated({
      ...asset,
      status: 'pending',
      imageUrl: null,
      fileName: undefined,
      fileSize: undefined,
      uploadedAt: undefined,
    });
  };

  return (
    <div
      style={{
        borderRadius: '6px',
        border: asset.status === 'ready'
          ? '1px solid rgba(255, 255, 255, 0.25)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        background: asset.status === 'ready' ? 'rgba(255, 255, 255, 0.025)' : 'rgba(255, 255, 255, 0.015)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.65rem',
              color: 'rgba(255, 255, 255, 0.35)',
            }}
          >
            #{String(index + 1).padStart(2, '0')}
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '0.2rem 0.5rem',
              borderRadius: '3px',
              fontWeight: 600,
              fontFamily: 'ui-monospace, monospace',
              background: isScreenshot ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: isScreenshot ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            {isScreenshot ? '📸 EKRAN GÖRÜNTÜSÜ GÖREVİ' : '✦ BANANA 2 / AI PROMPT'}
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              padding: '0.15rem 0.4rem',
              borderRadius: '2px',
              fontFamily: 'monospace',
              background: asset.status === 'ready' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: asset.status === 'ready' ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
            }}
          >
            {asset.status === 'ready' ? '✓ HAZIR' : 'BEKLİYOR'}
          </span>
        </div>

        {/* Aspect Ratio Badge */}
        <span
          style={{
            fontSize: '0.65rem',
            fontFamily: 'monospace',
            color: 'rgba(255, 255, 255, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.15rem 0.4rem',
            borderRadius: '2px',
          }}
        >
          {asset.aspectRatio || '16:9'}
        </span>
      </div>

      {/* Asset Title & Context */}
      <div>
        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
          {asset.title}
        </h4>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', lineHeight: 1.5 }}>
          {asset.context}
        </p>
      </div>

      {/* Screenshot Specific Specs */}
      {isScreenshot && asset.specs && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
        >
          {asset.specs.targetInterface && (
            <div>
              <strong style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Hedef Arayüz: </strong>
              <span style={{ color: '#ffffff', fontFamily: 'monospace' }}>{asset.specs.targetInterface}</span>
            </div>
          )}
          {asset.specs.resolution && (
            <div>
              <strong style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Önerilen Çözünürlük: </strong>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: 'monospace' }}>{asset.specs.resolution}</span>
            </div>
          )}
          {asset.specs.detailsToCapture && (
            <div>
              <strong style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Çekim İpucu: </strong>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{asset.specs.detailsToCapture}</span>
            </div>
          )}
        </div>
      )}

      {/* AI Prompt Specific Specs & Copy Action */}
      {!isScreenshot && asset.specs?.prompt && (
        <div
          style={{
            borderRadius: '4px',
            background: '#070707',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '0.4rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.65rem',
              fontFamily: 'monospace',
              color: 'rgba(255, 255, 255, 0.4)',
            }}
          >
            <span>{asset.specs.styleEngine || 'Banana 2 / Midjourney Prompt'}</span>
            <button
              type="button"
              onClick={handleCopyPrompt}
              style={{
                background: copying ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                color: copying ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.2rem 0.6rem',
                borderRadius: '3px',
                fontSize: '0.65rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '0.05em',
                transition: 'all 0.2s ease',
              }}
            >
              {copying ? '✓ PROMPT KOPYALANDI' : 'PROMPTU KOPYALA 📋'}
            </button>
          </div>
          <div
            style={{
              padding: '0.75rem',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.75rem',
              lineHeight: 1.5,
              color: '#d0d0d0',
              maxHeight: '120px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {asset.specs.prompt}
          </div>
        </div>
      )}

      {/* Upload Zone / Active Preview */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            if (e.target) e.target.value = '';
          }}
        />

        {asset.status === 'ready' && asset.imageUrl ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              padding: '0.6rem 0.8rem',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Thumbnail */}
              <div
                style={{
                  width: '64px',
                  height: '42px',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: '#000',
                  flexShrink: 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.imageUrl}
                  alt={asset.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#ffffff' }}>
                  {asset.fileName || 'Görsel Yüklendi'}
                </div>
                {asset.fileSize && (
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'monospace' }}>
                    WebP Optimize: {formatBytes(asset.fileSize)}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="admin-btn admin-btn-secondary admin-btn-sm"
                style={{ fontSize: '0.65rem', padding: '0.25rem 0.6rem' }}
              >
                Değiştir
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="admin-btn admin-btn-danger admin-btn-sm"
                style={{ fontSize: '0.65rem', padding: '0.25rem 0.6rem' }}
              >
                Kaldır
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: dragOver
                ? '1px dashed #ffffff'
                : '1px dashed rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              padding: '1.25rem 1rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {uploading ? (
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                ⚡ Görsel WebP olarak optimize ediliyor ve yükleniyor...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 500 }}>
                  {isScreenshot
                    ? '📸 Ekran görüntüsünü buraya sürükleyin veya dosya seçin'
                    : '✦ Banana 2 görselini buraya sürükleyin veya dosya seçin'}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                  PNG, JPG, WebP formatları otomatik optimize edilir (Maks 1920x1080 WebP)
                </span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#e74c3c' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
