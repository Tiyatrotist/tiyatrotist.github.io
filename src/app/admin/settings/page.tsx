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
import { getPendingWireOrders, updatePendingOrderStatus, PendingWireOrder, PAYMENT_CONFIG } from '@/config/payment';

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

  const [pendingOrders, setPendingOrders] = useState<PendingWireOrder[]>([]);

  const dict = getAdminDict(locale);

  useEffect(() => {
    setPendingOrders(getPendingWireOrders());
  }, []);

  const handleApproveOrder = (orderId: string) => {
    updatePendingOrderStatus(orderId, 'approved');
    setPendingOrders(getPendingWireOrders());
    setSuccess(`Sipariş (${orderId}) başarıyla onaylandı ve üyelik aktifleştirildi.`);
  };

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

        {/* Google AdSense Configuration Card */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '6px',
          background: 'rgba(56, 189, 248, 0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', color: '#38bdf8', marginBottom: '0.2rem' }}>
                GOOGLE ADSENSE REKLAM AYARLARI
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>
                TypeFlow ve genel sitede gösterilecek Google AdSense yayıncı kimliğini ve reklam durumunu yönetin.
              </div>
            </div>
            <label className="admin-toggle" aria-label="Google AdSense Reklamlarını Aç / Kapat">
              <input
                type="checkbox"
                checked={form.maintenance_mode ? false : true}
                onChange={(e) => {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('tf_adsense_enabled', String(e.target.checked));
                  }
                  setSuccess(e.target.checked ? 'Google AdSense reklamları etkinleştirildi.' : 'Google AdSense reklamları duraklatıldı.');
                }}
              />
              <span className="admin-toggle-slider" />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem' }}>
                AdSense Yayıncı ID (Publisher ID)
              </label>
              <input
                type="text"
                className="admin-input"
                defaultValue={typeof window !== 'undefined' ? (localStorage.getItem('tf_adsense_client_id') || 'ca-pub-7828284439187298') : 'ca-pub-7828284439187298'}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                onBlur={(e) => {
                  const val = e.target.value.trim();
                  if (val && typeof window !== 'undefined') {
                    localStorage.setItem('tf_adsense_client_id', val);
                    setSuccess('AdSense Yayıncı ID kaydedildi.');
                  }
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem' }}>
                Banner Slot ID
              </label>
              <input
                type="text"
                className="admin-input"
                defaultValue="8172635490"
                placeholder="örn. 8172635490"
              />
            </div>
          </div>
          {/* Blog AdSense Sub-section */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(56, 189, 248, 0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#e2e8f0' }}>
                  Blog Reklamları (Yazı İçi &amp; Blog Akışı)
                </div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                  Blog yazı detaylarında ve blog liste akışında Google AdSense bannerlarını göster.
                </div>
              </div>
              <label className="admin-toggle" aria-label="Blog Reklamlarını Aç / Kapat">
                <input
                  type="checkbox"
                  defaultChecked={typeof window !== 'undefined' ? (localStorage.getItem('blog_ads_enabled') !== 'false') : true}
                  onChange={(e) => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('blog_ads_enabled', String(e.target.checked));
                    }
                    setSuccess(e.target.checked ? 'Blog reklamları aktif edildi.' : 'Blog reklamları duraklatıldı.');
                  }}
                />
                <span className="admin-toggle-slider" />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem' }}>
                  Blog Yazı İçi Slot ID (In-Article)
                </label>
                <input
                  type="text"
                  className="admin-input"
                  defaultValue={typeof window !== 'undefined' ? (localStorage.getItem('blog_ads_slot_in_article') || '6453829102') : '6453829102'}
                  placeholder="örn. 6453829102"
                  onBlur={(e) => {
                    const val = e.target.value.trim();
                    if (val && typeof window !== 'undefined') {
                      localStorage.setItem('blog_ads_slot_in_article', val);
                      setSuccess('Blog Yazı İçi Slot ID kaydedildi.');
                    }
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem' }}>
                  Blog Liste İçi Slot ID (In-Feed)
                </label>
                <input
                  type="text"
                  className="admin-input"
                  defaultValue={typeof window !== 'undefined' ? (localStorage.getItem('blog_ads_slot_in_feed') || '5342718091') : '5342718091'}
                  placeholder="örn. 5342718091"
                  onBlur={(e) => {
                    const val = e.target.value.trim();
                    if (val && typeof window !== 'undefined') {
                      localStorage.setItem('blog_ads_slot_in_feed', val);
                      setSuccess('Blog Liste İçi Slot ID kaydedildi.');
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '0.75rem', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
            ✓ public/ads.txt dosyası aktif: google.com, pub-7828284439187298, DIRECT, f08c47fec0942fa0
          </div>
        </div>

        {/* Payment Gateways Configuration (Stripe, PayTR, FAST Wire) */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', color: '#10b981', marginBottom: '0.2rem' }}>
            ÖDEME ALTYAPISI (STRIPE / PAYTR / FAST HAVALE)
          </div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', marginBottom: '1rem' }}>
            Canlı Stripe Checkout bağlantılarınızı, PayTR ödeme linkinizi ve FAST/Havale hesap bilgilerinizi yönetin.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem' }}>
                Stripe Super Yıllık Linki (buy.stripe.com)
              </label>
              <input
                type="text"
                className="admin-input"
                defaultValue={typeof window !== 'undefined' ? (localStorage.getItem('tf_stripe_link_super_yearly') || PAYMENT_CONFIG.stripePaymentLinks.super_yearly) : PAYMENT_CONFIG.stripePaymentLinks.super_yearly}
                placeholder="https://buy.stripe.com/..."
                onBlur={(e) => {
                  const val = e.target.value.trim();
                  if (val && typeof window !== 'undefined') {
                    localStorage.setItem('tf_stripe_link_super_yearly', val);
                    setSuccess('Stripe Yıllık linki kaydedildi.');
                  }
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem' }}>
                Stripe Super Aylık Linki
              </label>
              <input
                type="text"
                className="admin-input"
                defaultValue={typeof window !== 'undefined' ? (localStorage.getItem('tf_stripe_link_super_monthly') || PAYMENT_CONFIG.stripePaymentLinks.super_monthly) : PAYMENT_CONFIG.stripePaymentLinks.super_monthly}
                placeholder="https://buy.stripe.com/..."
                onBlur={(e) => {
                  const val = e.target.value.trim();
                  if (val && typeof window !== 'undefined') {
                    localStorage.setItem('tf_stripe_link_super_monthly', val);
                    setSuccess('Stripe Aylık linki kaydedildi.');
                  }
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem' }}>
                Banka Havalesi / FAST IBAN
              </label>
              <input
                type="text"
                className="admin-input"
                defaultValue={PAYMENT_CONFIG.bankTransfer.iban}
                readOnly
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem' }}>
                PayTR Güvenli Ödeme URL
              </label>
              <input
                type="text"
                className="admin-input"
                defaultValue={PAYMENT_CONFIG.paytrPaymentUrl}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Pending Wire Orders (Havale / FAST Bildirimleri) */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', color: '#f59e0b', marginBottom: '0.2rem' }}>
                BEKLEYEN HAVALE / FAST ÖDEME BİLDİRİMLERİ ({pendingOrders.filter((o) => o.status === 'pending_verification').length})
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>
                Kullanıcıların TypeFlow üzerinden bildirdiği banka dekontları ve FAST transferleri.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPendingOrders(getPendingWireOrders())}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '4px',
                color: '#fff',
                padding: '4px 8px',
                fontSize: '0.7rem',
                cursor: 'pointer',
              }}
            >
              Yenile
            </button>
          </div>

          {pendingOrders.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '4px' }}>
              Henüz bekleyen havale veya FAST ödeme bildirimi bulunmuyor.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem' }}>Sipariş No</th>
                    <th style={{ padding: '0.5rem' }}>Gönderen</th>
                    <th style={{ padding: '0.5rem' }}>Banka & Dekont</th>
                    <th style={{ padding: '0.5rem' }}>Paket & Tutar</th>
                    <th style={{ padding: '0.5rem' }}>Tarih</th>
                    <th style={{ padding: '0.5rem' }}>Durum</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right' }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order) => (
                    <tr key={order.orderId} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>
                        {order.orderId}
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <div style={{ fontWeight: 600 }}>{order.senderName}</div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>{order.userEmail}</div>
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <div>{order.bankName}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#10b981' }}>{order.referenceNumber}</div>
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <div>{order.packageName}</div>
                        <div style={{ fontWeight: 700, color: '#f59e0b' }}>₺{order.amountTry.toFixed(2)}</div>
                      </td>
                      <td style={{ padding: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem' }}>
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          background: order.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: order.status === 'approved' ? '#10b981' : '#f59e0b',
                        }}>
                          {order.status === 'approved' ? '✓ ONAYLANDI' : 'İNCELENİYOR'}
                        </span>
                      </td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                        {order.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => handleApproveOrder(order.orderId)}
                            style={{
                              background: '#10b981',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 10px',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            ✓ Onayla
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
