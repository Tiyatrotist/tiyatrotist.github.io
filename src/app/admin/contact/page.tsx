/**
 * TIYATROTIST — Admin Contact Links Manager
 *
 * CRUD for contact links with label, url, icon, sort order, and enabled toggle.
 */

'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { getAdminDict, AdminLocale } from '@/lib/admin-i18n';
import FormField from '@/components/admin/FormField';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

interface ContactLink {
  id: string;
  label: string;
  url: string;
  icon: string;
  sort_order: number;
  enabled: boolean;
}

const ICON_OPTIONS = [
  { value: 'mail', label: 'Mail' },
  { value: 'github', label: 'GitHub' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'discord', label: 'Discord' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'globe', label: 'Website' },
  { value: 'other', label: 'Other' },
];

const emptyForm = {
  label: '',
  url: '',
  icon: 'mail',
  sort_order: '0',
  enabled: true,
};

export default function ContactPage() {
  const [links, setLinks] = useState<ContactLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ContactLink | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContactLink | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [locale] = useState<AdminLocale>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('admin_locale') as AdminLocale) || 'tr';
    return 'tr';
  });

  const dict = getAdminDict(locale);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      console.debug('[admin/contact] Fetching contact links…');
      const { data, error } = await supabase
        .from('contact_links')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) console.debug('[admin/contact] Query error:', error);
      setLinks(data || []);
    } catch (err) {
      console.debug('[admin/contact] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setCreating(true);
    setError('');
  };

  const startEdit = (link: ContactLink) => {
    setCreating(false);
    setEditing(link);
    setForm({
      label: link.label,
      url: link.url,
      icon: link.icon,
      sort_order: String(link.sort_order),
      enabled: link.enabled,
    });
    setError('');
  };

  const cancelForm = () => {
    setCreating(false);
    setEditing(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      label: form.label,
      url: form.url,
      icon: form.icon,
      sort_order: parseInt(form.sort_order) || 0,
      enabled: form.enabled,
    };

    try {
      if (editing) {
        console.debug('[admin/contact] Updating link:', editing.id);
        const { error } = await supabase.from('contact_links').update(payload).eq('id', editing.id);
        if (error) { setError(dict.common.error); console.debug('[admin/contact] Update error:', error); }
        else { cancelForm(); fetchLinks(); }
      } else {
        console.debug('[admin/contact] Creating link:', form.label);
        const { error } = await supabase.from('contact_links').insert(payload);
        if (error) { setError(dict.common.error); console.debug('[admin/contact] Create error:', error); }
        else { cancelForm(); fetchLinks(); }
      }
    } catch {
      setError(dict.common.error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from('contact_links').delete().eq('id', deleteTarget.id);
    if (error) console.debug('[admin/contact] Delete error:', error);
    else setLinks((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    setDeleting(false);
    setDeleteTarget(null);
  };

  const toggleEnabled = async (link: ContactLink) => {
    const { error } = await supabase
      .from('contact_links')
      .update({ enabled: !link.enabled })
      .eq('id', link.id);
    if (!error) {
      setLinks((prev) => prev.map((l) => l.id === link.id ? { ...l, enabled: !l.enabled } : l));
    }
  };

  if (loading) return <LoadingSpinner text={dict.common.loading} large />;

  if (creating || editing) {
    return (
      <>
        <div className="admin-page-header">
          <h1>{editing ? dict.contact.edit : dict.contact.newLink}</h1>
          <button onClick={cancelForm} className="admin-btn admin-btn-ghost" style={{ marginTop: '0.5rem' }} type="button">
            ← {dict.common.cancel}
          </button>
        </div>

        {error && <div className="admin-login-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-row">
            <FormField
              label={dict.contact.label}
              name="label"
              value={form.label}
              onChange={(v) => setForm((p) => ({ ...p, label: v }))}
              required
              placeholder="GitHub"
            />
            <FormField
              label={dict.contact.url}
              name="url"
              type="url"
              value={form.url}
              onChange={(v) => setForm((p) => ({ ...p, url: v }))}
              required
              placeholder="https://github.com/..."
            />
          </div>

          <div className="admin-form-row">
            <FormField
              label={dict.contact.icon}
              name="icon"
              type="select"
              value={form.icon}
              onChange={(v) => setForm((p) => ({ ...p, icon: v }))}
              options={ICON_OPTIONS}
            />
            <FormField
              label={dict.contact.sortOrder}
              name="sort_order"
              type="number"
              value={form.sort_order}
              onChange={(v) => setForm((p) => ({ ...p, sort_order: v }))}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label className="admin-toggle" aria-label={dict.contact.enabled}>
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm((p) => ({ ...p, enabled: e.target.checked }))}
              />
              <span className="admin-toggle-slider" />
            </label>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{dict.contact.enabled}</span>
          </div>

          <div className="admin-actions" style={{ marginTop: '1rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving || !form.label || !form.url}>
              {saving ? dict.contact.saving : dict.contact.save}
            </button>
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>{dict.contact.title}</h1>
      </div>

      <div className="admin-toolbar">
        <div />
        <button onClick={startCreate} className="admin-btn admin-btn-primary" type="button">
          + {dict.contact.newLink}
        </button>
      </div>

      {links.length === 0 ? (
        <div className="admin-empty">{dict.contact.noLinks}</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{dict.contact.label}</th>
                <th>{dict.contact.url}</th>
                <th>{dict.contact.icon}</th>
                <th>{dict.contact.sortOrder}</th>
                <th>{dict.contact.enabled}</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id}>
                  <td style={{ fontWeight: 500, color: '#fff' }}>{link.label}</td>
                  <td style={{ fontSize: '0.75rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {link.url}
                  </td>
                  <td>{link.icon}</td>
                  <td>{link.sort_order}</td>
                  <td>
                    <label className="admin-toggle">
                      <input type="checkbox" checked={link.enabled} onChange={() => toggleEnabled(link)} />
                      <span className="admin-toggle-slider" />
                    </label>
                  </td>
                  <td>
                    <div className="admin-actions" style={{ justifyContent: 'flex-end' }}>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => startEdit(link)} type="button">
                        {dict.contact.edit}
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setDeleteTarget(link)} type="button">
                        {dict.contact.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={dict.contact.delete}
        message={dict.contact.deleteConfirm}
        confirmLabel={dict.common.confirm}
        cancelLabel={dict.common.cancel}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
