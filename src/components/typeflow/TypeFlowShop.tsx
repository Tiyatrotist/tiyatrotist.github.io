/**
 * TYPEFLOW — Duolingo-Style Shop & Currency Store Component
 * Features dual-currency economy:
 * 1. In-App Real Currency Purchases (₺/TL and $) for Gems & Super Subscriptions
 * 2. Virtual Gem Exchange for Utilities (Streak Freezes, Energy Refills, Themes, Switch Sounds)
 */

'use client';

import React, { useState } from 'react';
import { Locale } from '@/dictionaries';
import { UserProfile, ShopItem, TypeFlowTheme, SoundType } from './types';
import { getShopCatalog } from './duolingoData';
import { PAID_PACKAGES, PaidPackage, TypeFlowCheckoutModal } from './TypeFlowCheckoutModal';
import { TypeFlowGoogleAd } from './TypeFlowGoogleAd';

interface TypeFlowShopProps {
  lang: Locale;
  profile: UserProfile;
  onBuyItem: (item: ShopItem) => void;
  onSelectTheme: (theme: TypeFlowTheme) => void;
  onSelectSound: (sound: SoundType) => void;
  onProfileUpdate?: (profile: UserProfile) => void;
  onOpenSuperModal?: () => void;
  onOpenAdModal?: () => void;
  onGoToCheckout?: (packageId: string) => void;
}

export default function TypeFlowShop({
  lang,
  profile,
  onBuyItem,
  onSelectTheme,
  onSelectSound,
  onProfileUpdate,
  onOpenSuperModal,
  onOpenAdModal,
  onGoToCheckout,
}: TypeFlowShopProps) {
  const isTr = lang === 'tr';
  const catalog = getShopCatalog(lang);
  const [purchaseAlert, setPurchaseAlert] = useState<string | null>(null);
  const [checkoutPkg, setCheckoutPkg] = useState<PaidPackage | null>(null);

  const handleBuyWithGems = (item: ShopItem) => {
    if ((profile.gems || 0) < item.cost) {
      setPurchaseAlert(
        isTr
          ? 'Yetersiz Elmas! Aşağıdaki elmas paketlerinden alabilir veya antrenman yaparak elmas kazanabilirsin.'
          : 'Not enough gems! Grab a gem pack below or grind practice drills to earn gems.'
      );
      setTimeout(() => setPurchaseAlert(null), 3500);
      return;
    }

    onBuyItem(item);
    setPurchaseAlert(isTr ? `🎉 Tebrikler! ${item.name} başarıyla satın alındı.` : `🎉 Success! ${item.name} purchased.`);
    setTimeout(() => setPurchaseAlert(null), 3000);
  };

  const handlePaymentSuccess = (pkg: PaidPackage) => {
    console.debug('[TypeFlow:Shop] Paid package delivered:', pkg.id);
    if (!onProfileUpdate) return;

    let updated: UserProfile = { ...profile };

    if (pkg.gemsReward) {
      updated.gems = (updated.gems || 0) + pkg.gemsReward;
    }
    if (pkg.freezesReward) {
      updated.streakFreezes = (updated.streakFreezes || 0) + pkg.freezesReward;
    }
    if (pkg.energyReward) {
      updated.energy = 5;
      updated.hearts = 5;
    }
    if (pkg.isSuper) {
      updated.isPremium = true;
      updated.energy = 5;
      updated.hearts = 5;
    }

    try {
      localStorage.setItem('tf_user_profile', JSON.stringify(updated));
    } catch {}

    onProfileUpdate(updated);
    setPurchaseAlert(
      isTr
        ? `✨ Ödeme Alındı! ${pkg.nameTr} hesabınıza anında tanımlandı.`
        : `✨ Payment Verified! ${pkg.nameEn} has been added to your account.`
    );
    setTimeout(() => setPurchaseAlert(null), 4000);
  };

  return (
    <div className="tf-shop-wrapper">
      {/* 1. Header Banner & Gems Balance */}
      <div style={{
        background: 'var(--tf-surface)',
        border: '1px solid var(--tf-border)',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.75rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.35rem 0' }}>
            {isTr ? '🛍️ TypeFlow Mağazası' : '🛍️ TypeFlow Shop'}
          </h2>
          <p style={{ color: 'var(--tf-text-secondary)', margin: 0, fontSize: '0.9rem' }}>
            {isTr
              ? 'Elmaslarınla veya gerçek para paketleriyle dilediğin avantajın kilidini aç.'
              : 'Unlock premium upgrades using your earned gems or instant payment bundles.'}
          </p>
        </div>

        {/* Gems Balance Badge */}
        <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', padding: '0.6rem 1.25rem', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, fontFamily: 'var(--tf-font-mono)' }}>
            {isTr ? 'MEVCUT BAKİYEN' : 'CURRENT BALANCE'}
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>
            {profile.gems || 0} 💎
          </div>
        </div>
      </div>

      {/* Alert toast */}
      {purchaseAlert && (
        <div style={{
          background: 'rgba(56, 189, 248, 0.15)',
          border: '1px solid #38bdf8',
          color: '#38bdf8',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          fontWeight: 700,
          textAlign: 'center',
          fontSize: '0.92rem'
        }}>
          {purchaseAlert}
        </div>
      )}

      {/* 2. REAL MONEY PACKAGES SECTION (₺ / TL) */}
      <div className="tf-section-heading" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>💳</span>
          <span>{isTr ? 'Gerçek Para ile Satın Alım Paketleri (₺ / TL)' : 'Direct In-App Packages (USD / EUR)'}</span>
        </div>
        {onGoToCheckout && (
          <button
            type="button"
            className="tf-btn-pushable"
            onClick={() => onGoToCheckout('super_yearly')}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              border: 'none',
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              fontFamily: 'var(--tf-font-mono)',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            💳 {isTr ? 'Ödeme Sayfasına Git ↗' : 'Go to Checkout ↗'}
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem'
      }}>
        {PAID_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className="tf-shop-card"
            style={{
              position: 'relative',
              border: pkg.badgeTr ? '2px solid #eab308' : '1px solid var(--tf-border)',
              background: pkg.badgeTr ? 'rgba(234, 179, 8, 0.04)' : 'var(--tf-surface)',
            }}
          >
            {pkg.badgeTr && (
              <span style={{
                position: 'absolute',
                top: '-10px',
                right: '12px',
                background: '#eab308',
                color: '#000',
                fontSize: '0.65rem',
                fontWeight: 900,
                fontFamily: 'var(--tf-font-mono)',
                padding: '0.2rem 0.5rem',
                borderRadius: '9999px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}>
                {isTr ? pkg.badgeTr : pkg.badgeEn}
              </span>
            )}

            <div className="tf-shop-top">
              <div className="tf-shop-icon" style={{ fontSize: '2.2rem' }}>{pkg.icon}</div>
              <div className="tf-shop-info">
                <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{isTr ? pkg.nameTr : pkg.nameEn}</h4>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#10b981', fontFamily: 'var(--tf-font-mono)' }}>
                  {isTr ? pkg.priceTr : pkg.priceEn}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="tf-btn-primary tf-btn-pushable"
              onClick={() => {
                if (onGoToCheckout) {
                  onGoToCheckout(pkg.id);
                } else {
                  setCheckoutPkg(pkg);
                }
              }}
              style={{
                width: '100%',
                padding: '0.65rem',
                fontWeight: 800,
                fontSize: '0.85rem',
                marginTop: '1rem',
                background: pkg.isSuper ? 'linear-gradient(135deg, #f59e0b, #eab308)' : '#10b981',
                color: pkg.isSuper ? '#000' : '#fff',
                border: 'none',
              }}
            >
              🛒 {isTr ? `${pkg.priceTr} ile Satın Al` : `Buy for ${pkg.priceEn}`}
            </button>
          </div>
        ))}
      </div>

      {/* 3. VIRTUAL GEMS SHOP SECTION */}
      <div className="tf-section-heading" style={{ marginBottom: '1rem' }}>
        <span>💎</span>
        <span>{isTr ? 'Elmas ile Alınabilir Öğeler & Temalar' : 'Gem Exchange: Utilities & Themes'}</span>
      </div>

      <div className="tf-shop-grid" style={{ marginBottom: '2.5rem' }}>
        {catalog.map((item) => {
          let isOwned = false;
          if (item.id === 'streak-freeze') {
            isOwned = (profile.streakFreezes || 0) > 0;
          } else if (item.category === 'theme' && item.value) {
            isOwned = profile.unlockedThemes?.includes(item.value) || item.owned;
          } else if (item.category === 'sound' && item.value) {
            isOwned = profile.unlockedSounds?.includes(item.value) || item.owned;
          }

          const canAfford = (profile.gems || 0) >= item.cost;

          return (
            <div key={item.id} className="tf-shop-card">
              <div className="tf-shop-top">
                <div className="tf-shop-icon">{item.icon}</div>
                <div className="tf-shop-info">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                </div>
              </div>

              <div>
                {item.id === 'streak-freeze' && (
                  <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'var(--tf-font-mono)', marginBottom: '0.5rem' }}>
                    {isTr ? `Mevcut Dondurucu: ${profile.streakFreezes || 0}` : `Owned Freezes: ${profile.streakFreezes || 0}`}
                  </div>
                )}
                {item.id === 'refill-energy' && (
                  <div style={{ fontSize: '0.75rem', color: '#10b981', fontFamily: 'var(--tf-font-mono)', marginBottom: '0.5rem' }}>
                    {isTr ? `Mevcut Enerji: ${profile.energy ?? profile.hearts ?? 5}/5` : `Current Battery: ${profile.energy ?? profile.hearts ?? 5}/5`}
                  </div>
                )}

                {isOwned && item.category !== 'utility' ? (
                  <button
                    className="tf-shop-buy-btn owned"
                    onClick={() => {
                      if (item.category === 'theme' && item.value) onSelectTheme(item.value as TypeFlowTheme);
                      if (item.category === 'sound' && item.value) onSelectSound(item.value as SoundType);
                    }}
                  >
                    ✓ {isTr ? 'Seçildi / Sahipsin' : 'Active / Owned'}
                  </button>
                ) : (
                  <button
                    className={`tf-shop-buy-btn tf-btn-pushable ${!canAfford ? 'disabled' : ''}`}
                    onClick={() => handleBuyWithGems(item)}
                    disabled={!canAfford}
                  >
                    <span>💎</span>
                    <span>{item.cost} {isTr ? 'Elmas' : 'Gems'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Persistent Google AdSense Banner */}
      <TypeFlowGoogleAd
        lang={lang}
        profile={profile}
        onRewardClaim={(energy, gems) => {
          if (!onProfileUpdate) return;
          const curEnergy = profile.energy ?? profile.hearts ?? 0;
          const updated = {
            ...profile,
            energy: Math.min(5, curEnergy + energy),
            hearts: Math.min(5, curEnergy + energy),
            gems: (profile.gems || 0) + gems,
          };
          try { localStorage.setItem('tf_user_profile', JSON.stringify(updated)); } catch {}
          onProfileUpdate(updated);
          setPurchaseAlert(isTr ? `⚡ +${energy} Enerji ve +${gems} Elmas şarj edildi!` : `⚡ Recharged +${energy} Energy & +${gems} Gems!`);
        }}
        onOpenSuperModal={onOpenSuperModal}
      />

      {/* Checkout Modal */}
      <TypeFlowCheckoutModal
        isOpen={Boolean(checkoutPkg)}
        pkg={checkoutPkg}
        onClose={() => setCheckoutPkg(null)}
        lang={lang}
        profile={profile}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
