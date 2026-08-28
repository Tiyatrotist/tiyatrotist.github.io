/**
 * TIYATROTIST — Admin Site Settings
 *
 * Manage site title (TR/EN), description (TR/EN) with Translation Actions,
 * and maintenance mode.
 */

'use client';

import { useEffect, useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { getAdminDict, AdminLocale } from '@/lib/admin-i18n';
import FormField from '@/components/admin/FormField';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import TranslationAction from '@/components/admin/TranslationAction';

export default function SettingsPage() {
  const [form, setForm] = useState({
    id: '',
    site_title_tr: '',
    site_title_en: '',
    site_description_tr: '',
    site_description_en: '',
    maintenance_mode: false,
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
      console.debug('[admin/settings] Fetching site settings…');
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();

      if (error) console.debug('[admin/settings] Fetch error:', error);
      if (data) {
        setForm({
          id: data.id,
          site_title_tr: data.site_title_tr || '',
          site_title_en: data.site_title_en || '',
          site_description_tr: data.site_description_tr || '',
          site_description_en: data.site_description_en || '',
          maintenance_mode: data.maintenance_mode || false,
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

    const payload = {
      site_title_tr: form.site_title_tr,
      site_title_en: form.site_title_en,
      site_description_tr: form.site_description_tr,
      site_description_en: form.site_description_en,
      maintenance_mode: form.maintenance_mode,
    };

    try {
      if (form.id) {
        console.debug('[admin/settings] Updating settings…');
        const { error } = await supabase.from('site_settings').update(payload).eq('id', form.id);
        if (error) { setError(dict.common.error); console.debug('[admin/settings] Update error:', error); }
        else setSuccess(dict.common.success);
      } else {
        console.debug('[admin/settings] Creating settings entry…');
        const { data, error } = await supabase.from('site_settings').insert(payload).select().single();
        if (error) { setError(dict.common.error); console.debug('[admin/settings] Create error:', error); }
        else { setForm((p) => ({ ...p, id: data.id })); setSuccess(dict.common.success); }
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
        <h1>{dict.settings.title}</h1>
      </div>

      {error && <div className="admin-login-error" role="alert">{error}</div>}
      {success && (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '4px', padding: '0.6rem 0.8rem',
          fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem',
        }} role="status">{success}</div>
      )}

      <form onSubmit={handleSave} className="admin-form" style={{ maxWidth: '800px' }}>
        <div>
          <div className="admin-form-row">
            <FormField
              label={dict.settings.siteTitleTr}
              name="site_title_tr"
              value={form.site_title_tr}
              onChange={(v) => { setForm((p) => ({ ...p, site_title_tr: v })); setSuccess(''); }}
              placeholder="TIYATROTIST — Dijital Ortam"
            />
            <FormField
              label={dict.settings.siteTitleEn}
              name="site_title_en"
              value={form.site_title_en}
              onChange={(v) => { setForm((p) => ({ ...p, site_title_en: v })); setSuccess(''); }}
              placeholder="TIYATROTIST — Digital Environment"
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <TranslationAction
              sourceText={form.site_title_tr}
              targetText={form.site_title_en}
              sourceLang="tr"
              targetLang="en"
              context="website meta title"
              onTranslated={(v) => setForm((p) => ({ ...p, site_title_en: v }))}
            />
            <TranslationAction
              sourceText={form.site_title_en}
              targetText={form.site_title_tr}
              sourceLang="en"
              targetLang="tr"
              context="website meta title"
              onTranslated={(v) => setForm((p) => ({ ...p, site_title_tr: v }))}
            />
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <FormField
            label={dict.settings.siteDescTr}
            name="site_description_tr"
            type="textarea"
            value={form.site_description_tr}
            onChange={(v) => { setForm((p) => ({ ...p, site_description_tr: v })); setSuccess(''); }}
          />
          <TranslationAction
            sourceText={form.site_description_tr}
            targetText={form.site_description_en}
            sourceLang="tr"
            targetLang="en"
            context="website meta description"
            onTranslated={(v) => setForm((p) => ({ ...p, site_description_en: v }))}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <FormField
            label={dict.settings.siteDescEn}
            name="site_description_en"
            type="textarea"
            value={form.site_description_en}
            onChange={(v) => { setForm((p) => ({ ...p, site_description_en: v })); setSuccess(''); }}
          />
          <TranslationAction
            sourceText={form.site_description_en}
            targetText={form.site_description_tr}
            sourceLang="en"
            targetLang="tr"
            context="website meta description"
            onTranslated={(v) => setForm((p) => ({ ...p, site_description_tr: v }))}
          />
        </div>

        {/* Maintenance Mode Toggle */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
          background: form.maintenance_mode ? 'rgba(231,76,60,0.05)' : 'rgba(255,255,255,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', color: '#fff', marginBottom: '0.25rem' }}>
                {dict.settings.maintenanceMode}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                {form.maintenance_mode ? dict.settings.maintenanceOn : dict.settings.maintenanceOff}
              </div>
            </div>
            <label className="admin-toggle" aria-label={dict.settings.maintenanceMode}>
              <input
                type="checkbox"
                checked={form.maintenance_mode}
                onChange={(e) => { setForm((p) => ({ ...p, maintenance_mode: e.target.checked })); setSuccess(''); }}
              />
              <span className="admin-toggle-slider" />
            </label>
          </div>
        </div>

        <div className="admin-actions" style={{ marginTop: '1.5rem' }}>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? dict.settings.saving : dict.settings.save}
          </button>
        </div>
      </form>
    </>
  );
}
