/**
 * TIYATROTIST — Section Editor Modal
 *
 * Visual property editor for Section Blocks with:
 * - Content Tab: Bilingual TR / EN fields + Translation Actions
 * - Style & Layout Tab: Layout, Animation, Responsive controls
 * - Block-specific tools (Code snippets, Media URLs, Stats counters)
 */

'use client';

import { useState } from 'react';
import { SectionBlock, LayoutType, AnimationType, ResponsiveBehavior } from '@/types/builder';
import FormField from '@/components/admin/FormField';
import TranslationAction from '@/components/admin/TranslationAction';

interface SectionEditorModalProps {
  section: SectionBlock;
  open: boolean;
  onClose: () => void;
  onSave: (updated: SectionBlock) => void;
}

export default function SectionEditorModal({
  section,
  open,
  onClose,
  onSave,
}: SectionEditorModalProps) {
  const [form, setForm] = useState<SectionBlock>({ ...section });
  const [activeTab, setActiveTab] = useState<'content' | 'layout'>('content');
  const [langTab, setLangTab] = useState<'tr' | 'en'>('tr');

  if (!open) return null;

  const updateContent = (key: string, value: unknown) => {
    setForm((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="admin-badge admin-badge-published" style={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
              {form.type}
            </span>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Bölüm Düzenleyici</h3>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className={`admin-btn ${activeTab === 'content' ? 'admin-btn-primary' : 'admin-btn-ghost'} admin-btn-sm`}
              onClick={() => setActiveTab('content')}
            >
              İçerik (TR/EN)
            </button>
            <button
              type="button"
              className={`admin-btn ${activeTab === 'layout' ? 'admin-btn-primary' : 'admin-btn-ghost'} admin-btn-sm`}
              onClick={() => setActiveTab('layout')}
            >
              Yerleşim & Animasyon
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
          {/* TAB 1: CONTENT */}
          {activeTab === 'content' && (
            <div>
              {/* Language Switcher Tabs */}
              <div className="admin-tabs" role="tablist" style={{ marginBottom: '1rem' }}>
                <button
                  type="button"
                  className={`admin-tab ${langTab === 'tr' ? 'active' : ''}`}
                  onClick={() => setLangTab('tr')}
                >
                  🇹🇷 Türkçe İçerik
                </button>
                <button
                  type="button"
                  className={`admin-tab ${langTab === 'en' ? 'active' : ''}`}
                  onClick={() => setLangTab('en')}
                >
                  🇬🇧 English Content
                </button>
              </div>

              {/* Tag & Title */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <FormField
                  label={langTab === 'tr' ? 'Etiket (TR)' : 'Tag (EN)'}
                  name="tag"
                  value={langTab === 'tr' ? form.content.tag_tr || '' : form.content.tag_en || ''}
                  onChange={(v) => updateContent(langTab === 'tr' ? 'tag_tr' : 'tag_en', v)}
                  placeholder="[ SAHNE 01 ]"
                />

                <FormField
                  label={langTab === 'tr' ? 'Başlık (TR)' : 'Title (EN)'}
                  name="title"
                  value={langTab === 'tr' ? form.content.title_tr || '' : form.content.title_en || ''}
                  onChange={(v) => updateContent(langTab === 'tr' ? 'title_tr' : 'title_en', v)}
                  placeholder="Bölüm Başlığı"
                />
              </div>

              {/* Translation Action for Title */}
              <TranslationAction
                sourceText={langTab === 'tr' ? form.content.title_tr || '' : form.content.title_en || ''}
                targetText={langTab === 'tr' ? form.content.title_en || '' : form.content.title_tr || ''}
                sourceLang={langTab}
                targetLang={langTab === 'tr' ? 'en' : 'tr'}
                context="builder section title"
                onTranslated={(v) => updateContent(langTab === 'tr' ? 'title_en' : 'title_tr', v)}
              />

              {/* Subtitle */}
              <FormField
                label={langTab === 'tr' ? 'Alt Başlık / Spot (TR)' : 'Subtitle (EN)'}
                name="subtitle"
                type="textarea"
                value={langTab === 'tr' ? form.content.subtitle_tr || '' : form.content.subtitle_en || ''}
                onChange={(v) => updateContent(langTab === 'tr' ? 'subtitle_tr' : 'subtitle_en', v)}
              />

              {/* Translation Action for Subtitle */}
              <TranslationAction
                sourceText={langTab === 'tr' ? form.content.subtitle_tr || '' : form.content.subtitle_en || ''}
                targetText={langTab === 'tr' ? form.content.subtitle_en || '' : form.content.subtitle_tr || ''}
                sourceLang={langTab}
                targetLang={langTab === 'tr' ? 'en' : 'tr'}
                context="builder section subtitle"
                onTranslated={(v) => updateContent(langTab === 'tr' ? 'subtitle_en' : 'subtitle_tr', v)}
              />

              {/* Body Text for Manifesto / Markdown */}
              {(form.type === 'manifesto' || form.type === 'markdownArticle') && (
                <div style={{ marginTop: '1rem' }}>
                  <FormField
                    label={langTab === 'tr' ? 'Gövde Metni (TR - Markdown)' : 'Body Content (EN - Markdown)'}
                    name="body"
                    type="textarea"
                    value={langTab === 'tr' ? form.content.body_tr || '' : form.content.body_en || ''}
                    onChange={(v) => updateContent(langTab === 'tr' ? 'body_tr' : 'body_en', v)}
                  />

                  <TranslationAction
                    sourceText={langTab === 'tr' ? form.content.body_tr || '' : form.content.body_en || ''}
                    targetText={langTab === 'tr' ? form.content.body_en || '' : form.content.body_tr || ''}
                    sourceLang={langTab}
                    targetLang={langTab === 'tr' ? 'en' : 'tr'}
                    context="builder section markdown article body"
                    onTranslated={(v) => updateContent(langTab === 'tr' ? 'body_en' : 'body_tr', v)}
                  />
                </div>
              )}

              {/* CTA Buttons */}
              {(form.type === 'hero' || form.type === 'cta') && (
                <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                    Aksiyon Butonları
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <FormField
                      label={langTab === 'tr' ? 'Buton Metni (TR)' : 'Button Label (EN)'}
                      name="button_label"
                      value={langTab === 'tr' ? form.content.button_label_tr || '' : form.content.button_label_en || ''}
                      onChange={(v) => updateContent(langTab === 'tr' ? 'button_label_tr' : 'button_label_en', v)}
                    />
                    <FormField
                      label="Buton Bağlantısı (URL)"
                      name="button_url"
                      value={form.content.button_url || ''}
                      onChange={(v) => updateContent('button_url', v)}
                      placeholder="/projects veya https://..."
                    />
                  </div>
                </div>
              )}

              {/* Terminal Code Snippet */}
              {form.type === 'terminal' && (
                <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}>
                  <FormField
                    label="Kod Dili (Language)"
                    name="code_language"
                    value={form.content.code_language || 'bash'}
                    onChange={(v) => updateContent('code_language', v)}
                    placeholder="bash, typescript, json..."
                  />
                  <FormField
                    label="Kod / Komut Bloğu"
                    name="code_snippet"
                    type="textarea"
                    value={form.content.code_snippet || ''}
                    onChange={(v) => updateContent('code_snippet', v)}
                    placeholder="npm install..."
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LAYOUT & ANIMATION */}
          {activeTab === 'layout' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormField
                  label="Yerleşim Tipi (Layout)"
                  name="layout"
                  type="select"
                  value={form.layout}
                  onChange={(v) => setForm((p) => ({ ...p, layout: v as LayoutType }))}
                  options={[
                    { label: 'Ortalanmış (Centered)', value: 'centered' },
                    { label: '50/50 Bölünmüş (Split)', value: 'split' },
                    { label: 'Tam Genişlik (Full Width)', value: 'fullWidth' },
                    { label: 'Izgara (Grid)', value: 'grid' },
                  ]}
                />

                <FormField
                  label="Animasyon Efekti"
                  name="animation"
                  type="select"
                  value={form.animation}
                  onChange={(v) => setForm((p) => ({ ...p, animation: v as AnimationType }))}
                  options={[
                    { label: 'Yok (None)', value: 'none' },
                    { label: 'Yukarı Kayma (Slide Up)', value: 'slideUp' },
                    { label: 'Belirme (Fade In)', value: 'fadeIn' },
                    { label: 'DotMatrix Parçacık Patlaması', value: 'dotMatrixBurst' },
                    { label: 'Daktilo (Typewriter)', value: 'typewriter' },
                  ]}
                />
              </div>

              <FormField
                label="Mobil Duyarlılık (Responsive)"
                name="responsive"
                type="select"
                value={form.responsive}
                onChange={(v) => setForm((p) => ({ ...p, responsive: v as ResponsiveBehavior }))}
                options={[
                  { label: 'Normal (Otomatik)', value: 'normal' },
                  { label: 'Mobilde Dikey İstif (Stacked)', value: 'stackedMobile' },
                  { label: 'Mobilde Gizle (Hide on Mobile)', value: 'hideMobile' },
                  { label: 'Mobilde Kaydırılabilir (Carousel)', value: 'carouselMobile' },
                ]}
              />
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="admin-modal-actions" style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>
            İptal
          </button>
          <button type="button" className="admin-btn admin-btn-primary" onClick={handleSave}>
            Kaydet ve Uygula
          </button>
        </div>
      </div>
    </div>
  );
}
