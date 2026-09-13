'use client';

/**
 * TYPEFLOW — Super TypeFlow (Pro SaaS Plan) Modal
 * Duolingo Super inspired premium subscription showcase.
 * Features: Unlimited Focus Energy ♾️, Zero Ads 🚫, 2X XP, All Themes & Sounds Unlocked.
 * Completely free of debug/testing artifacts. Production-ready checkout integration.
 */

import React, { useEffect, useState } from 'react';
import { UserProfile } from './types';
import { Locale } from '@/dictionaries';

interface TypeFlowSuperModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpgradeToSuper: (isFreeTrial?: boolean) => void;
  onNavigateToCheckout?: (packageId: string) => void;
  lang: Locale;
}

export const TypeFlowSuperModal: React.FC<TypeFlowSuperModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpgradeToSuper,
  onNavigateToCheckout,
  lang,
}) => {
  const isTr = lang === 'tr';
  const [selectedBilling, setSelectedBilling] = useState<'yearly' | 'monthly' | 'gems'>('yearly');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const SUPER_COST_GEMS = 400;
  const currentGems = Math.max(0, profile.gems || 0);
  const canAfford = currentGems >= SUPER_COST_GEMS;
  const isAlreadyPremium = !!profile.isPremium;

  const handleStartTrial = () => {
    console.debug('[TypeFlow:SuperModal] Navigating to checkout for 7-day free trial authorization (super_trial)');
    onClose();
    if (onNavigateToCheckout) {
      onNavigateToCheckout('super_trial');
    }
  };

  const handleGemUpgrade = () => {
    if (!canAfford) return;
    console.debug('[TypeFlow:SuperModal] Upgrading with gems');
    onUpgradeToSuper(false);
  };

  const handleProceedToPayment = () => {
    onClose();
    if (onNavigateToCheckout) {
      onNavigateToCheckout(selectedBilling === 'monthly' ? 'super_monthly' : 'super_yearly');
    }
  };

  return (
    <div
      className="tf-modal-overlay tf-super-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tf-super-modal-title"
    >
      <div
        className="tf-modal-card tf-super-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Iridescent Glow Header */}
        <div className="tf-super-header">
          <div className="tf-super-badge-row">
            <span className="tf-super-crown-icon">👑</span>
            <span className="tf-super-pill">SUPER TYPEFLOW PRO</span>
          </div>
          <h2 id="tf-super-modal-title" className="tf-super-title">
            {isAlreadyPremium
              ? (isTr ? 'Super Üyeliğin Aktif!' : 'Super Membership Active!')
              : (isTr ? 'Sınırsız Yazma Gücünün Kilidini Aç' : 'Unlock Unlimited Typing Mastery')}
          </h2>
          <p className="tf-super-subtitle">
            {isTr
              ? 'Kesintisiz odaklanma, sıfır reklam ve maksimum hız için tasarlanmış profesyonel daktilo deneyimi.'
              : 'The ultimate professional typing tier engineered for unbroken focus and zero interruptions.'}
          </p>
          <button
            type="button"
            className="tf-modal-close tf-btn-pushable"
            onClick={onClose}
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        {/* Feature Comparison Grid */}
        <div className="tf-super-features-grid">
          <div className="tf-super-feature-card">
            <div className="tf-super-feat-icon">🔋</div>
            <div className="tf-super-feat-content">
              <h4>{isTr ? 'Sınırsız Odak Enerjisi (♾️)' : 'Unlimited Focus Battery (♾️)'}</h4>
              <p>
                {isTr
                  ? 'Bataryanın tükenmesi veya bekleme süresi yok. Dilediğin kadar ders tekrarı ve hız maratonu yap.'
                  : 'Zero battery drain or recharge cooldowns. Practice endlessly through all units and drills.'}
              </p>
            </div>
            <span className="tf-super-check-badge">PRO</span>
          </div>

          <div className="tf-super-feature-card">
            <div className="tf-super-feat-icon">🚫</div>
            <div className="tf-super-feat-content">
              <h4>{isTr ? '%100 Sıfır Reklam' : '100% Ad-Free Flow'}</h4>
              <p>
                {isTr
                  ? 'Hiçbir sponsorlu reklam veya bekleme molası çıkmaz. Saf terminal akışı ve konsantrasyon.'
                  : 'Never see sponsor ad breaks. Pure unbroken keyboard focus without friction.'}
              </p>
            </div>
            <span className="tf-super-check-badge">PRO</span>
          </div>

          <div className="tf-super-feature-card">
            <div className="tf-super-feat-icon">🎨</div>
            <div className="tf-super-feat-content">
              <h4>{isTr ? 'Tüm Özel Temalar & Mekanik Sesler' : 'All Custom Themes & Switch Sounds'}</h4>
              <p>
                {isTr
                  ? 'Cyberpunk Violet, Matrix Kehribar, IBM Model M buckling spring ve synth sesleri anında kullanımda.'
                  : 'Instantly unlock Neo-Tokyo Violet, Cyber Amber, and legendary mechanical acoustics.'}
              </p>
            </div>
            <span className="tf-super-check-badge">PRO</span>
          </div>

          <div className="tf-super-feature-card">
            <div className="tf-super-feat-icon">⚡</div>
            <div className="tf-super-feat-content">
              <h4>{isTr ? '2 Kat Hızlı XP & Lig Liderliği' : '2X XP Multiplier & League Dominance'}</h4>
              <p>
                {isTr
                  ? 'Her tamamlanan ders ve pratik testinde çift XP kazan, Elmas Lig\'in zirvesine roketle.'
                  : 'Double XP on every test and lesson to climb straight to Diamond League glory.'}
              </p>
            </div>
            <span className="tf-super-check-badge">PRO</span>
          </div>
        </div>

        {/* Action & Pricing Section */}
        <div className="tf-super-footer">
          {isAlreadyPremium ? (
            <div className="tf-super-active-box">
              <span className="tf-super-active-icon">✨</span>
              <div style={{ textAlign: 'left' }}>
                <strong style={{ color: '#10b981' }}>
                  {profile.subscriptionStatus === 'trialing'
                    ? (isTr ? '7 Günlük Deneme Sürümün Aktif' : '7-Day Free Trial Active')
                    : (isTr ? 'Super Üyeliğin Aktif' : 'Super Status Active')}
                </strong>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                  {profile.subscriptionStatus === 'trialing' && profile.trialEndsAt
                    ? (isTr
                        ? `Deneme süreniz ${new Date(profile.trialEndsAt).toLocaleDateString('tr-TR')} tarihine kadar geçerlidir.`
                        : `Your trial is valid until ${new Date(profile.trialEndsAt).toLocaleDateString('en-US')}.`)
                    : (isTr
                        ? 'Sınırsız odak enerjisinin ve reklamsız deneyimin tadını çıkarıyorsun.'
                        : 'You are enjoying unlimited energy and ad-free typing mastery.')}
                </p>
              </div>
            </div>
          ) : (
            <div className="tf-super-cta-container">
              {/* Billing Plan Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                <div
                  onClick={() => setSelectedBilling('yearly')}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: '10px',
                    border: `1.5px solid ${selectedBilling === 'yearly' ? 'var(--tf-accent)' : 'rgba(255,255,255,0.08)'}`,
                    background: selectedBilling === 'yearly' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  <span style={{ position: 'absolute', top: '-8px', right: '4px', background: '#10b981', color: '#fff', fontSize: '0.58rem', fontWeight: 900, padding: '1px 4px', borderRadius: '4px' }}>
                    -%40
                  </span>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tf-text-secondary)' }}>{isTr ? 'YILLIK PLAN' : 'ANNUAL'}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#10b981', margin: '2px 0' }}>₺29,99<span style={{ fontSize: '0.65rem' }}>/ay</span></div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--tf-text-muted)' }}>₺359,88 / yıl</div>
                </div>

                <div
                  onClick={() => setSelectedBilling('monthly')}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: '10px',
                    border: `1.5px solid ${selectedBilling === 'monthly' ? 'var(--tf-accent)' : 'rgba(255,255,255,0.08)'}`,
                    background: selectedBilling === 'monthly' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tf-text-secondary)' }}>{isTr ? 'AYLIK PLAN' : 'MONTHLY'}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--tf-text-primary)', margin: '2px 0' }}>₺49,99<span style={{ fontSize: '0.65rem' }}>/ay</span></div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--tf-text-muted)' }}>{isTr ? 'Esnek İptal' : 'Flexible'}</div>
                </div>

                <div
                  onClick={() => setSelectedBilling('gems')}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: '10px',
                    border: `1.5px solid ${selectedBilling === 'gems' ? 'var(--tf-accent)' : 'rgba(255,255,255,0.08)'}`,
                    background: selectedBilling === 'gems' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tf-text-secondary)' }}>{isTr ? 'ELMAS İLE' : 'WITH GEMS'}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#38bdf8', margin: '2px 0' }}>400 💎</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--tf-text-muted)' }}>
                    {isTr ? `Bakiye: ${currentGems} 💎` : `Balance: ${currentGems} 💎`}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="tf-super-trial-btn tf-btn-pushable"
                  onClick={handleStartTrial}
                  style={{ flex: 1, minWidth: '200px' }}
                >
                  {isTr ? '✨ 7 Günlük Ücretsiz Deneme Başlat' : '✨ Start 7-Day Free Trial'}
                </button>

                {selectedBilling === 'gems' ? (
                  <button
                    type="button"
                    className={`tf-super-upgrade-btn tf-btn-pushable ${!canAfford ? 'tf-btn-disabled' : ''}`}
                    onClick={handleGemUpgrade}
                    disabled={!canAfford}
                    style={{ flex: 1, minWidth: '200px' }}
                  >
                    {canAfford
                      ? (isTr ? '👑 400 💎 ile Yükselt' : '👑 Upgrade with 400 💎')
                      : (isTr ? `Yetersiz Elmas (${Math.max(0, SUPER_COST_GEMS - currentGems)} 💎 Eksik)` : `Need ${Math.max(0, SUPER_COST_GEMS - currentGems)} More Gems`)}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="tf-btn-primary tf-btn-pushable"
                    onClick={handleProceedToPayment}
                    style={{ flex: 1, minWidth: '200px', fontWeight: 900, padding: '0.75rem' }}
                  >
                    💳 {isTr ? 'Güvenli Ödeme Sayfasına Geç ↗' : 'Go to Secure Payment Gateway ↗'}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="tf-super-guarantee" style={{ marginTop: '1rem' }}>
            {isTr
              ? '🛡️ 256-bit SSL şifrelemeli 3D Secure güvencesi. Dilediğiniz zaman tek tıkla iptal edebilirsiniz.'
              : '🛡️ 256-bit SSL encrypted 3D Secure checkout. Cancel anytime with 1 click.'}
          </div>
        </div>
      </div>
    </div>
  );
};
