/**
 * TIYATROTIST — Next-Gen Blog Studio & Visual Pipeline
 *
 * Route: /admin/blog/studio
 *
 * Integrated workflow for long-form, visual-rich editorial blog posts:
 * 1. AI Content & Structure Generator (Presets & Custom Topics)
 * 2. Visual Pipeline Station:
 *    - SCREENSHOT_REQUIRED: Informs user what to screenshot, resolution & target screen
 *    - AI_IMAGE_PROMPT: Ready-to-copy Banana 2 / Midjourney monochrome prompts
 * 3. Live Synchronized Markdown Editor & Editorial Preview
 * 4. Automatic One-Click Publishing to Supabase blog_posts
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BlogStudioDraft, VisualAsset } from '@/types/blog-studio';
import { generateBlogStudioDraft, syncMarkdownWithAssets, generateSlug } from '@/lib/blog-studio/generator';
import VisualPipelineStation from '@/components/admin/blog-studio/VisualPipelineStation';
import StudioLiveArticle from '@/components/admin/blog-studio/StudioLiveArticle';
import StudioGeneratorForm from '@/components/admin/blog-studio/StudioGeneratorForm';

const STORAGE_KEY = 'tiyatrotist_blog_studio_draft_v1';

type StudioTab = 'pipeline' | 'preview' | 'settings';

export default function BlogStudioPage() {
  const [activeTab, setActiveTab] = useState<StudioTab>('pipeline');
  const [draft, setDraft] = useState<BlogStudioDraft | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.title_tr) {
            return parsed;
          }
        }
      } catch (err) {
        console.debug('[BlogStudio] Failed to load cached draft:', err);
      }
    }
    return generateBlogStudioDraft({ presetId: 'edith-autonomous-agent' });
  });

  const [showGenModal, setShowGenModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Save to localStorage on changes
  useEffect(() => {
    if (draft && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      } catch {
        // ignore
      }
    }
  }, [draft]);

  const handleAssetUpdated = useCallback((updatedAsset: VisualAsset) => {
    setDraft((prev) => {
      if (!prev) return null;
      const nextAssets = prev.visualAssets.map((a) =>
        a.id === updatedAsset.id ? updatedAsset : a
      );

      // If cover_image is empty and this asset is ready, use it as cover
      let cover = prev.cover_image;
      if (!cover && updatedAsset.imageUrl) {
        cover = updatedAsset.imageUrl;
      }

      return {
        ...prev,
        visualAssets: nextAssets,
        cover_image: cover,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const handleDraftGenerated = (newDraft: BlogStudioDraft) => {
    setDraft(newDraft);
    setShowGenModal(false);
    setActiveTab('pipeline');
    setSuccessMessage('Yeni blog taslağı ve görsel iş akışı başarıyla oluşturuldu.');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  /**
   * Save or publish to Supabase blog_posts
   */
  const handleSaveToDatabase = async (publishLive: boolean) => {
    if (!draft) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    if (publishLive) {
      setPublishing(true);
    } else {
      setSaving(true);
    }

    try {
      // 1. Resolve markdown content with uploaded image URLs
      const finalContentTr = syncMarkdownWithAssets(draft.content_tr, draft.visualAssets);
      const finalContentEn = syncMarkdownWithAssets(draft.content_en, draft.visualAssets);

      // 2. Pick cover image (either explicitly set, or first ready asset, or empty)
      const firstReadyAsset = draft.visualAssets.find((a) => a.imageUrl && a.status === 'ready');
      const finalCover = draft.cover_image || firstReadyAsset?.imageUrl || null;

      const postSlug = draft.slug || generateSlug(draft.title_tr || draft.title_en);
      const now = new Date().toISOString();

      console.debug('[BlogStudio] Saving post to Supabase:', postSlug, 'Publish:', publishLive);

      // Check if post with slug exists
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', postSlug)
        .limit(1);

      let dbError: { message: string } | null = null;

      if (existing && existing.length > 0) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title_tr: draft.title_tr || null,
            title_en: draft.title_en || null,
            excerpt_tr: draft.excerpt_tr || null,
            excerpt_en: draft.excerpt_en || null,
            content_tr: finalContentTr,
            content_en: finalContentEn,
            cover_image: finalCover,
            category: draft.category || 'Engineering',
            tags: draft.tags || ['Tech'],
            published: publishLive,
            featured: draft.featured,
            published_at: publishLive ? now : null,
            updated_at: now,
          })
          .eq('slug', postSlug);
        dbError = error;
      } else {
        // Insert new post
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            slug: postSlug,
            title_tr: draft.title_tr || null,
            title_en: draft.title_en || null,
            excerpt_tr: draft.excerpt_tr || null,
            excerpt_en: draft.excerpt_en || null,
            content_tr: finalContentTr,
            content_en: finalContentEn,
            cover_image: finalCover,
            category: draft.category || 'Engineering',
            tags: draft.tags || ['Tech'],
            published: publishLive,
            featured: draft.featured,
            published_at: publishLive ? now : null,
            created_at: now,
            updated_at: now,
          });
        dbError = error;
      }

      if (dbError) {
        console.debug('[BlogStudio] Supabase write notice/error:', dbError);
        setSuccessMessage('Taslak yerel tarayıcı belleğine kaydedildi. "📥 .md İndir" butonuyla dosyayı doğrudan alabilirsiniz.');
        setErrorMessage(`Supabase uyarısı: ${dbError.message} (Yerel kopya günceldir)`);
      } else {
        setPublishedSlug(postSlug);
        if (publishLive) {
          setSuccessMessage('Makale başarıyla yayınlandı ve canlıya alındı!');
          setDraft((prev) => (prev ? { ...prev, published: true } : null));
        } else {
          setSuccessMessage('Taslak başarıyla kaydedildi.');
          setDraft((prev) => (prev ? { ...prev, published: false } : null));
        }
      }
    } catch (err: unknown) {
      console.debug('[BlogStudio] Exception:', err);
      setSuccessMessage('Taslak yerel bellekte korundu.');
      setErrorMessage(err instanceof Error ? err.message : 'Beklenmeyen bir hata oluştu.');
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  };

  const generateMarkdownFile = (lang: 'tr' | 'en' = 'tr') => {
    if (!draft) return '';
    const finalContent = syncMarkdownWithAssets(
      lang === 'tr' ? draft.content_tr : draft.content_en,
      draft.visualAssets
    );
    const postSlug = draft.slug || generateSlug(draft.title_tr || draft.title_en);
    const firstReadyAsset = draft.visualAssets.find((a) => a.imageUrl && a.status === 'ready');
    const finalCover = draft.cover_image || firstReadyAsset?.imageUrl || '';

    return `---
slug: "${postSlug}"
title_tr: "${(draft.title_tr || '').replace(/"/g, '\\"')}"
title_en: "${(draft.title_en || '').replace(/"/g, '\\"')}"
excerpt_tr: "${(draft.excerpt_tr || '').replace(/"/g, '\\"')}"
excerpt_en: "${(draft.excerpt_en || '').replace(/"/g, '\\"')}"
category: "${draft.category || 'Mühendislik'}"
tags: ${JSON.stringify(draft.tags || ['Tech'])}
cover_image: "${finalCover}"
published: ${draft.published}
featured: ${draft.featured}
date: "${draft.createdAt || new Date().toISOString()}"
---

${finalContent}
`;
  };

  const handleDownloadMarkdown = (lang: 'tr' | 'en' = 'tr') => {
    if (!draft) return;
    const md = generateMarkdownFile(lang);
    const postSlug = draft.slug || generateSlug(draft.title_tr || draft.title_en);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${postSlug}.${lang}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSuccessMessage(`"${postSlug}.${lang}.md" dosyası indirildi! Doğrudan content/posts/ içine taşıyabilirsiniz.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleCopyMarkdown = async (lang: 'tr' | 'en' = 'tr') => {
    if (!draft) return;
    const md = generateMarkdownFile(lang);
    try {
      await navigator.clipboard.writeText(md);
      setSuccessMessage(`Markdown içeriği (${lang.toUpperCase()}) panoya kopyalandı.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch {
      // ignore
    }
  };

  if (!draft) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>
        Blog Studio başlatılıyor...
      </div>
    );
  }

  const readyAssetsCount = draft.visualAssets.filter((a) => a.status === 'ready').length;
  const totalAssetsCount = draft.visualAssets.length;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Studio Top Navigation Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                color: 'rgba(255, 255, 255, 0.4)',
                textTransform: 'uppercase',
              }}
            >
              [ PIPELINE STUDIO // ]
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                padding: '0.15rem 0.45rem',
                borderRadius: '3px',
                background: draft.published ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                fontFamily: 'monospace',
              }}
            >
              {draft.published ? 'CANLI YAYINDA' : 'TASLAK'}
            </span>
          </div>

          <h1
            style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              color: '#ffffff',
              margin: '0.3rem 0 0 0',
              letterSpacing: '0.05em',
            }}
          >
            Blog Studio: Görsel Destekli Yayın Hattı
          </h1>
        </div>

        {/* Global Studio Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <Link href="/admin/blog" className="admin-btn admin-btn-ghost admin-btn-sm">
            ← Blog Listesi
          </Link>

          <button
            type="button"
            onClick={() => setShowGenModal(true)}
            className="admin-btn admin-btn-secondary admin-btn-sm"
          >
            ✦ Yeni AI Taslak
          </button>

          <button
            type="button"
            onClick={() => handleDownloadMarkdown('tr')}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            title="Markdown ve frontmatter dosyasını doğrudan indir"
          >
            📥 .md İndir
          </button>

          <button
            type="button"
            onClick={() => handleCopyMarkdown('tr')}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            title="Markdown içeriğini panoya kopyala"
          >
            📋 MD Kopyala
          </button>

          <button
            type="button"
            onClick={() => handleSaveToDatabase(false)}
            disabled={saving || publishing}
            className="admin-btn admin-btn-secondary admin-btn-sm"
          >
            {saving ? 'Kaydediliyor...' : 'Taslak Kaydet'}
          </button>

          <button
            type="button"
            onClick={() => handleSaveToDatabase(true)}
            disabled={saving || publishing}
            className="admin-btn admin-btn-primary admin-btn-sm"
            style={{ fontWeight: 600 }}
          >
            {publishing ? 'Yayına Alınıyor...' : '✦ Otomatik Yayına Al'}
          </button>
        </div>
      </div>

      {/* Notifications / Feedback */}
      {successMessage && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 500 }}>
            ✓ {successMessage}
          </div>
          {publishedSlug && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href={`/tr/blog/${publishedSlug}`}
                target="_blank"
                rel="noreferrer"
                className="admin-btn admin-btn-primary admin-btn-sm"
                style={{ fontSize: '0.7rem' }}
              >
                Canlı Makaleyi Görüntüle ↗
              </a>
              <Link href="/admin/blog" className="admin-btn admin-btn-secondary admin-btn-sm" style={{ fontSize: '0.7rem' }}>
                Blog Yönetimi
              </Link>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '6px',
            background: 'rgba(231, 76, 60, 0.08)',
            border: '1px solid rgba(231, 76, 60, 0.3)',
            color: '#e74c3c',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="admin-tabs" style={{ marginBottom: '1.75rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('pipeline')}
          className={`admin-tab ${activeTab === 'pipeline' ? 'active' : ''}`}
        >
          1. Görsel İş Akışı & İstasyon ({readyAssetsCount}/{totalAssetsCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`admin-tab ${activeTab === 'preview' ? 'active' : ''}`}
        >
          2. Canlı Makale & Markdown Düzenleyici
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
        >
          3. Yayın Ayarları & SEO Meta
        </button>
      </div>

      {/* Tab 1: Visual Pipeline Station */}
      {activeTab === 'pipeline' && (
        <VisualPipelineStation
          assets={draft.visualAssets}
          onAssetUpdated={handleAssetUpdated}
          onNavigateToPreview={() => setActiveTab('preview')}
        />
      )}

      {/* Tab 2: Live Article & Markdown Editor */}
      {activeTab === 'preview' && (
        <StudioLiveArticle draft={draft} onUpdateDraft={setDraft} />
      )}

      {/* Tab 3: Settings & Metadata */}
      {activeTab === 'settings' && (
        <div
          style={{
            maxWidth: '720px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div className="admin-field">
            <label>Makale Başlığı (Türkçe)</label>
            <input
              type="text"
              value={draft.title_tr}
              onChange={(e) => {
                const val = e.target.value;
                setDraft((prev) =>
                  prev ? { ...prev, title_tr: val, slug: prev.slug || generateSlug(val) } : null
                );
              }}
              className="admin-search"
              style={{ width: '100%' }}
            />
          </div>

          <div className="admin-field">
            <label>Article Title (English)</label>
            <input
              type="text"
              value={draft.title_en}
              onChange={(e) => {
                const val = e.target.value;
                setDraft((prev) => (prev ? { ...prev, title_en: val } : null));
              }}
              className="admin-search"
              style={{ width: '100%' }}
            />
          </div>

          <div className="admin-field">
            <label>URL Slug</label>
            <input
              type="text"
              value={draft.slug}
              onChange={(e) => {
                const val = e.target.value;
                setDraft((prev) => (prev ? { ...prev, slug: generateSlug(val) } : null));
              }}
              className="admin-search"
              style={{ width: '100%' }}
            />
          </div>

          <div className="admin-field">
            <label>Özet / Excerpt (Türkçe)</label>
            <textarea
              rows={3}
              value={draft.excerpt_tr}
              onChange={(e) => {
                const val = e.target.value;
                setDraft((prev) => (prev ? { ...prev, excerpt_tr: val } : null));
              }}
              className="admin-search"
              style={{ width: '100%', fontFamily: 'inherit' }}
            />
          </div>

          <div className="admin-field">
            <label>Summary / Excerpt (English)</label>
            <textarea
              rows={3}
              value={draft.excerpt_en}
              onChange={(e) => {
                const val = e.target.value;
                setDraft((prev) => (prev ? { ...prev, excerpt_en: val } : null));
              }}
              className="admin-search"
              style={{ width: '100%', fontFamily: 'inherit' }}
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-field">
              <label>Kategori</label>
              <input
                type="text"
                value={draft.category}
                onChange={(e) => {
                  const val = e.target.value;
                  setDraft((prev) => (prev ? { ...prev, category: val } : null));
                }}
                className="admin-search"
                style={{ width: '100%' }}
              />
            </div>

            <div className="admin-field">
              <label>Kapak Görseli URL</label>
              <input
                type="text"
                value={draft.cover_image}
                onChange={(e) => {
                  const val = e.target.value;
                  setDraft((prev) => (prev ? { ...prev, cover_image: val } : null));
                }}
                placeholder="https://..."
                className="admin-search"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <label className="admin-toggle">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => {
                  const val = e.target.checked;
                  setDraft((prev) => (prev ? { ...prev, featured: val } : null));
                }}
              />
              <span className="admin-toggle-slider" />
            </label>
            <span style={{ fontSize: '0.8rem', color: '#ffffff' }}>Öne Çıkan Makale (Featured)</span>
          </div>

          <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => handleSaveToDatabase(false)}
              className="admin-btn admin-btn-secondary"
            >
              Taslak Kaydet
            </button>
            <button
              type="button"
              onClick={() => handleSaveToDatabase(true)}
              className="admin-btn admin-btn-primary"
            >
              ✦ Otomatik Yayına Al
            </button>
          </div>
        </div>
      )}

      {/* Generator Modal */}
      {showGenModal && (
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
          onClick={() => setShowGenModal(false)}
        >
          <div
            style={{
              background: '#0e0e0e',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              maxWidth: '780px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff', letterSpacing: '0.05em' }}>
                  ✦ AI Blog Taslağı & Görsel Hattı Üret
                </h3>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                  Konuyu seçin; sistem görsel yerleşimli, ekran görüntüsü görevli ve Banana 2 promptlu taslağı hazırlar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGenModal(false)}
                className="admin-btn admin-btn-ghost admin-btn-sm"
              >
                ✕ Kapat
              </button>
            </div>

            <StudioGeneratorForm
              onDraftGenerated={handleDraftGenerated}
              onCancel={() => setShowGenModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
