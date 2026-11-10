/**
 * TIYATROTIST — Blog Studio Generator Form
 *
 * Allows generating new structured visual drafts from pre-engineered templates
 * or from custom user topics.
 */

'use client';

import React, { useState } from 'react';
import { BLOG_STUDIO_PRESETS, generateBlogStudioDraft } from '@/lib/blog-studio/generator';
import { BlogStudioDraft } from '@/types/blog-studio';

interface StudioGeneratorFormProps {
  onDraftGenerated: (draft: BlogStudioDraft) => void;
  onCancel?: () => void;
}

export default function StudioGeneratorForm({ onDraftGenerated, onCancel }: StudioGeneratorFormProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>(BLOG_STUDIO_PRESETS[0].id);
  const [customTopic, setCustomTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('Kıdemli Geliştiriciler & Mimarlar');
  const [category, setCategory] = useState('Engineering');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  const isCustom = selectedPreset === 'custom';

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulated progress steps for great UX
    setGenerationStep('Bölüm yapısı ve mimari taslak planlanıyor...');
    await new Promise((r) => setTimeout(r, 400));

    setGenerationStep('Ekran görüntüsü alınacak kritik arayüzler taranıyor...');
    await new Promise((r) => setTimeout(r, 450));

    setGenerationStep('Banana 2 / Midjourney için izometrik monokrom promptlar üretiliyor...');
    await new Promise((r) => setTimeout(r, 400));

    const draft = generateBlogStudioDraft({
      presetId: selectedPreset,
      customTopic: isCustom ? customTopic : undefined,
      category,
      targetAudience,
    });

    setIsGenerating(false);
    onDraftGenerated(draft);
  };

  return (
    <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.4)',
            marginBottom: '0.5rem',
            display: 'block',
          }}
        >
          ŞABLON VEYA ÖZEL KONU SEÇİMİ
        </label>

        {/* Preset Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {BLOG_STUDIO_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => setSelectedPreset(preset.id)}
                style={{
                  padding: '1rem',
                  borderRadius: '6px',
                  border: isSelected
                    ? '1px solid #ffffff'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.015)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontFamily: 'monospace',
                      letterSpacing: '0.15em',
                      color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                      background: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '2px',
                    }}
                  >
                    [ {preset.badge} ]
                  </span>
                  {isSelected && <span style={{ color: '#ffffff', fontSize: '0.8rem' }}>●</span>}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                  {preset.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)', lineHeight: 1.4 }}>
                  {preset.description}
                </div>
              </div>
            );
          })}

          {/* Custom Topic Card */}
          <div
            onClick={() => setSelectedPreset('custom')}
            style={{
              padding: '1rem',
              borderRadius: '6px',
              border: isCustom
                ? '1px solid #ffffff'
                : '1px solid rgba(255, 255, 255, 0.08)',
              background: isCustom ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.015)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '0.6rem',
                  fontFamily: 'monospace',
                  letterSpacing: '0.15em',
                  color: isCustom ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                  background: isCustom ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '2px',
                }}
              >
                [ SERBEST KONU ]
              </span>
              {isCustom && <span style={{ color: '#ffffff', fontSize: '0.8rem' }}>●</span>}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
              ✦ Kendi Özel Konunu Gir
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)', lineHeight: 1.4 }}>
              İstediğiniz başlığı yazın; sistem ekran görüntüsü ve Banana 2 promptlarını otomatik üretir.
            </div>
          </div>
        </div>
      </div>

      {/* Custom Topic Details Input */}
      {isCustom && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.25rem',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="admin-field">
            <label>Yazı Konusu & Ana Fikir</label>
            <input
              type="text"
              required
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Örn: Yeni Nesil Supabase Edge Functions Mimarisi veya Pinball Fizik Motoru..."
              className="admin-search"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-field">
              <label>Hedef Kitle</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Örn: Kıdemli Mühendisler, Tasarımcılar..."
                className="admin-search"
                style={{ width: '100%' }}
              />
            </div>
            <div className="admin-field">
              <label>Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="admin-search"
                style={{ width: '100%', background: '#0f0f0f' }}
              >
                <option value="Engineering">Engineering</option>
                <option value="Architecture">Architecture</option>
                <option value="Design">Design</option>
                <option value="Retrospective">Retrospective</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons & Loading State */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isGenerating}
            className="admin-btn admin-btn-ghost"
          >
            İptal
          </button>
        )}
        <button
          type="submit"
          disabled={isGenerating || (isCustom && !customTopic.trim())}
          className="admin-btn admin-btn-primary"
        >
          {isGenerating ? '✦ Taslak Üretiliyor...' : '✦ Blog Taslağı & Görsel Hattını Üret'}
        </button>
      </div>

      {isGenerating && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: '#ffffff',
            fontFamily: 'monospace',
          }}
        >
          {generationStep}
        </div>
      )}
    </form>
  );
}
