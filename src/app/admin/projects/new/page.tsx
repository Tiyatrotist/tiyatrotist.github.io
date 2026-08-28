/**
 * TIYATROTIST — New Project Creator (Simplified & Template-Centric)
 *
 * Flow:
 * STEP 1: Project Information (Name, Slug, Descriptions, Links, Accent)
 * STEP 2: Choose Scroll Template (Cinematic, Product, Minimal)
 * STEP 3: Create Project -> Redirect to Workspace
 */

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getAdminDict, AdminLocale } from '@/lib/admin-i18n';
import { ProjectTemplateKey } from '@/types/builder';
import { PROJECT_TEMPLATES } from '@/lib/builder/templates';
import FormField from '@/components/admin/FormField';
import TranslationAction from '@/components/admin/TranslationAction';

export default function NewProjectPage() {
  const router = useRouter();
  const [locale] = useState<AdminLocale>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('admin_locale') as AdminLocale) || 'tr';
    return 'tr';
  });
  const dict = getAdminDict(locale);

  const [step, setStep] = useState<1 | 2>(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [slugError, setSlugError] = useState('');

  const [form, setForm] = useState({
    name: '',
    slug: '',
    short_description_tr: '',
    short_description_en: '',
    description_tr: '',
    description_en: '',
    github_url: '',
    website_url: '',
    accent_color: '#ffffff',
    template: 'product' as ProjectTemplateKey,
    published: false,
    featured: false,
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const updateField = (key: string, value: string | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === 'name' && typeof value === 'string' && !prev.slug) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
    if (key === 'slug') setSlugError('');
  };

  const handleNextToStep2 = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Lütfen proje adını girin.');
      return;
    }
    if (!form.slug.trim()) {
      setSlugError('Lütfen proje için geçerli bir slug belirleyin.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleCreateProject = async () => {
    setSaving(true);
    setError('');

    try {
      console.debug('[admin/projects/new] Checking slug uniqueness:', form.slug);
      const { data: existing } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', form.slug.trim())
        .limit(1);

      if (existing && existing.length > 0) {
        setSlugError(dict.projects.duplicateSlug);
        setStep(1);
        setSaving(false);
        return;
      }

      console.debug('[admin/projects/new] Creating project with template:', form.template);
      const now = new Date().toISOString();
      const { error: insertErr } = await supabase.from('projects').insert({
        name: form.name.trim(),
        slug: form.slug.trim(),
        short_description_tr: form.short_description_tr.trim() || null,
        short_description_en: form.short_description_en.trim() || null,
        description_tr: form.description_tr.trim() || null,
        description_en: form.description_en.trim() || null,
        github_url: form.github_url.trim() || null,
        website_url: form.website_url.trim() || null,
        accent_color: form.accent_color || '#ffffff',
        published: form.published,
        featured: form.featured,
        created_at: now,
        updated_at: now,
      });

      if (insertErr) {
        console.debug('[admin/projects/new] Insert error:', insertErr);
        setError(dict.common.error);
        setSaving(false);
        return;
      }

      // Initialize project scroll template sections in storage
      const selectedTemplate = PROJECT_TEMPLATES[form.template];
      if (selectedTemplate && typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            `project_sections_${form.slug.trim()}`,
            JSON.stringify(selectedTemplate.sections)
          );
          localStorage.setItem(
            `project_template_${form.slug.trim()}`,
            form.template
          );
        } catch {}
      }

      console.debug('[admin/projects/new] Project created successfully');
      router.push(`/admin/projects/edit?slug=${form.slug.trim()}&created=true&tab=page`);
    } catch {
      setError(dict.common.error);
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <h1>{dict.projects.newProject}</h1>
        <Link href="/admin/projects" className="admin-btn admin-btn-ghost" style={{ marginTop: '0.5rem', display: 'inline-block' }}>
          {dict.projects.back}
        </Link>
      </div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', maxWidth: '780px' }}>
        <div
          onClick={() => setStep(1)}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            border: step === 1 ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
            background: step === 1 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', display: 'block', textTransform: 'uppercase' }}>
            Adım 1
          </span>
          <strong style={{ fontSize: '0.85rem', color: '#fff' }}>Proje Bilgileri</strong>
        </div>

        <div
          onClick={() => {
            if (form.name && form.slug) setStep(2);
          }}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            border: step === 2 ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
            background: step === 2 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
            cursor: form.name && form.slug ? 'pointer' : 'not-allowed',
            opacity: form.name && form.slug ? 1 : 0.5,
          }}
        >
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', display: 'block', textTransform: 'uppercase' }}>
            Adım 2
          </span>
          <strong style={{ fontSize: '0.85rem', color: '#fff' }}>Sayfa Şablonu Seçimi</strong>
        </div>
      </div>

      {error && <div className="admin-login-error" role="alert">{error}</div>}

      {/* STEP 1: PROJECT INFORMATION */}
      {step === 1 && (
        <form onSubmit={handleNextToStep2} className="admin-form" style={{ maxWidth: '780px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField
              label={dict.projects.name}
              name="name"
              value={form.name}
              onChange={(v) => updateField('name', v)}
              placeholder="Örn: BookOS"
              required
            />

            <FormField
              label={dict.projects.slug}
              name="slug"
              value={form.slug}
              onChange={(v) => updateField('slug', v)}
              placeholder="bookos"
              required
              error={slugError}
            />
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField
                label={dict.projects.shortDescTr}
                name="short_description_tr"
                value={form.short_description_tr}
                onChange={(v) => updateField('short_description_tr', v)}
                placeholder="Kısa spot açıklama..."
              />
              <FormField
                label={dict.projects.shortDescEn}
                name="short_description_en"
                value={form.short_description_en}
                onChange={(v) => updateField('short_description_en', v)}
                placeholder="Short teaser description..."
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <TranslationAction
                sourceText={form.short_description_tr}
                targetText={form.short_description_en}
                sourceLang="tr"
                targetLang="en"
                context="project short description"
                onTranslated={(v) => updateField('short_description_en', v)}
              />
              <TranslationAction
                sourceText={form.short_description_en}
                targetText={form.short_description_tr}
                sourceLang="en"
                targetLang="tr"
                context="project short description"
                onTranslated={(v) => updateField('short_description_tr', v)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.75rem' }}>
            <FormField
              label={dict.projects.githubUrl}
              name="github_url"
              type="url"
              value={form.github_url}
              onChange={(v) => updateField('github_url', v)}
              placeholder="https://github.com/..."
            />
            <FormField
              label={dict.projects.websiteUrl}
              name="website_url"
              type="url"
              value={form.website_url}
              onChange={(v) => updateField('website_url', v)}
              placeholder="https://..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', alignItems: 'center', marginTop: '0.75rem' }}>
            <FormField
              label={dict.projects.accentColor}
              name="accent_color"
              type="color"
              value={form.accent_color}
              onChange={(v) => updateField('accent_color', v)}
            />
            <div style={{ display: 'flex', gap: '2rem', paddingTop: '1.25rem' }}>
              <label className="admin-toggle" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => updateField('published', e.target.checked)}
                />
                <span className="admin-toggle-slider" />
                <span style={{ fontSize: '0.75rem', color: '#fff' }}>{dict.projects.publish}</span>
              </label>

              <label className="admin-toggle" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateField('featured', e.target.checked)}
                />
                <span className="admin-toggle-slider" />
                <span style={{ fontSize: '0.75rem', color: '#fff' }}>{dict.projects.feature}</span>
              </label>
            </div>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
            Devam Et: Şablon Seçimi →
          </button>
        </form>
      )}

      {/* STEP 2: CHOOSE SCROLL TEMPLATE */}
      {step === 2 && (
        <div style={{ maxWidth: '780px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
            Proje İçin Sayfa Şablonu Seçin
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' }}>
            Şablon, projenizin kamusal sayfasının başlangıç blok yapısını belirler. İstediğiniz zaman blokları düzenleyebilir veya içeriği değiştirebilirsiniz.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {Object.values(PROJECT_TEMPLATES).map((tmpl) => {
              const isSelected = form.template === tmpl.key;
              return (
                <div
                  key={tmpl.key}
                  onClick={() => updateField('template', tmpl.key)}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
                    background: isSelected ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.75rem' }}>{tmpl.icon}</span>
                      <span className="admin-badge admin-badge-published" style={{ fontSize: '0.6rem' }}>
                        {tmpl.badge}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem 0' }}>
                      {tmpl.name_tr}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                      {tmpl.description_tr}
                    </p>
                  </div>

                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                    {tmpl.sections.length} Hazır Bölüm Bloğu
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={() => setStep(1)}
              style={{ flex: 1 }}
            >
              ← Bilgileri Düzenle
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleCreateProject}
              disabled={saving}
              style={{ flex: 2 }}
            >
              {saving ? 'Proje Oluşturuluyor…' : '✓ Projeyi Oluştur ve Çalışma Alanına Geç'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
