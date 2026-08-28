/**
 * TIYATROTIST — Admin About Page Editor
 *
 * Edit the About page title and content in Turkish and English
 * with Translation Actions.
 */

'use client';

import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { getAdminDict, AdminLocale } from '@/lib/admin-i18n';
import FormField from '@/components/admin/FormField';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import TranslationAction from '@/components/admin/TranslationAction';

export default function AboutPage() {
  const [form, setForm] = useState({
    id: '',
    title_tr: '',
    title_en: '',
    content_tr: '',
    content_en: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [locale] = useState<AdminLocale>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('admin_locale') as AdminLocale) || 'tr';
    return 'tr';
  });

  const dict = getAdminDict(locale);

  useEffect(() => {
    const fetch = async () => {
      console.debug('[admin/about] Fetching about data…');
      const { data, error } = await supabase.from('site_about').select('*').limit(1).single();

      if (error) {
        console.debug('[admin/about] Fetch error (may not exist yet):', error);
      }
      if (data) {
        setForm({
          id: data.id,
          title_tr: data.title_tr || '',
          title_en: data.title_en || '',
          content_tr: data.content_tr || '',
          content_en: data.content_en || '',
        });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (form.id) {
        console.debug('[admin/about] Updating about…');
        const { error } = await supabase
          .from('site_about')
          .update({
            title_tr: form.title_tr,
            title_en: form.title_en,
            content_tr: form.content_tr,
            content_en: form.content_en,
          })
          .eq('id', form.id);

        if (error) {
          console.debug('[admin/about] Update error:', error);
          setError(dict.common.error);
        } else {
          setSuccess(dict.common.success);
        }
      } else {
        console.debug('[admin/about] Creating about entry…');
        const { data, error } = await supabase
          .from('site_about')
          .insert({
            title_tr: form.title_tr,
            title_en: form.title_en,
            content_tr: form.content_tr,
            content_en: form.content_en,
          })
          .select()
          .single();

        if (error) {
          console.debug('[admin/about] Create error:', error);
          setError(dict.common.error);
        } else {
          setForm((prev) => ({ ...prev, id: data.id }));
          setSuccess(dict.common.success);
        }
      }
    } catch {
      setError(dict.common.error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text={dict.common.loading} large />;

  return (
    <>
      <div className="admin-page-header">
        <h1>{dict.about.title}</h1>
      </div>

      {error && <div className="admin-login-error" role="alert">{error}</div>}
      {success && (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '4px',
          padding: '0.6rem 0.8rem',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.7)',
          marginBottom: '1rem',
        }} role="status">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="admin-form" style={{ maxWidth: '800px' }}>
        <div>
          <div className="admin-form-row">
            <FormField
              label={dict.about.titleTr}
              name="title_tr"
              value={form.title_tr}
              onChange={(v) => { setForm((p) => ({ ...p, title_tr: v })); setSuccess(''); }}
            />
            <FormField
              label={dict.about.titleEn}
              name="title_en"
              value={form.title_en}
              onChange={(v) => { setForm((p) => ({ ...p, title_en: v })); setSuccess(''); }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <TranslationAction
              sourceText={form.title_tr}
              targetText={form.title_en}
              sourceLang="tr"
              targetLang="en"
              context="about page heading"
              onTranslated={(v) => setForm((p) => ({ ...p, title_en: v }))}
            />
            <TranslationAction
              sourceText={form.title_en}
              targetText={form.title_tr}
              sourceLang="en"
              targetLang="tr"
              context="about page heading"
              onTranslated={(v) => setForm((p) => ({ ...p, title_tr: v }))}
            />
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <FormField
            label={dict.about.contentTr}
            name="content_tr"
            type="textarea"
            value={form.content_tr}
            onChange={(v) => { setForm((p) => ({ ...p, content_tr: v })); setSuccess(''); }}
          />
          <TranslationAction
            sourceText={form.content_tr}
            targetText={form.content_en}
            sourceLang="tr"
            targetLang="en"
            context="about developer profile markdown"
            onTranslated={(v) => setForm((p) => ({ ...p, content_en: v }))}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <FormField
            label={dict.about.contentEn}
            name="content_en"
            type="textarea"
            value={form.content_en}
            onChange={(v) => { setForm((p) => ({ ...p, content_en: v })); setSuccess(''); }}
          />
          <TranslationAction
            sourceText={form.content_en}
            targetText={form.content_tr}
            sourceLang="en"
            targetLang="tr"
            context="about developer profile markdown"
            onTranslated={(v) => setForm((p) => ({ ...p, content_tr: v }))}
          />
        </div>

        <div className="admin-actions" style={{ marginTop: '1.5rem' }}>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? dict.about.saving : dict.about.save}
          </button>
        </div>
      </form>
    </>
  );
}
