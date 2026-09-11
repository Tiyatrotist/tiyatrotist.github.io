/**
 * TYPEFLOW — Secure Checkout & Real Currency Payment Modal
 * Simulates enterprise SaaS in-app checkout (Credit Card, Google Pay, Apple Pay)
 * for Purchasing Gem Packs, Energy Passes, and Super TypeFlow Subscriptions in ₺/TL.
 */

'use client';

import React, { useState } from 'react';
import { Locale } from '@/dictionaries';
import { UserProfile } from './types';

export interface PaidPackage {
  id: string;
  nameTr: string;
  nameEn: string;
  priceTr: string;
  priceEn: string;
  badgeTr?: string;
  badgeEn?: string;
  gemsReward?: number;
  freezesReward?: number;
  energyReward?: number;
  isSuper?: boolean;
  icon: string;
}

export const PAID_PACKAGES: PaidPackage[] = [
  {
    id: 'pack-500-gems',
    nameTr: '500 Elmas Paketi',
    nameEn: '500 Gems Starter Pack',
    priceTr: '₺29,99',
    priceEn: '$1.99',
    gemsReward: 500,
    icon: '💎',
  },
  {
    id: 'pack-1500-gems',
    nameTr: '1.500 Elmas + 2 Seri Dondurucu',
    nameEn: '1,500 Gems + 2 Streak Freezes',
    priceTr: '₺69,99',
    priceEn: '$3.99',
    badgeTr: 'EN POPÜLER',
    badgeEn: 'MOST POPULAR',
    gemsReward: 1500,
    freezesReward: 2,
    icon: '✨',
  },
  {
    id: 'pack-5000-gems',
    nameTr: '5.000 Mega Elmas Kasası',
    nameEn: '5,000 Mega Gems Vault',
    priceTr: '₺179,99',
    priceEn: '$9.99',
    badgeTr: '%40 İNDİRİMLİ',
    badgeEn: '40% OFF',
    gemsReward: 5000,
    freezesReward: 5,
    icon: '🏆',
  },
  {
    id: 'pack-energy-pass',
    nameTr: '24 Saatlik Sınırsız Enerji Pasaportu',
    nameEn: '24-Hour Unlimited Energy Pass',
    priceTr: '₺19,99',
    priceEn: '$0.99',
    energyReward: 5,
    icon: '🔋',
  },
  {
    id: 'pack-super-yearly',
    nameTr: 'Super TypeFlow PRO — 1 Yıllık VIP',
    nameEn: 'Super TypeFlow PRO — 1 Year VIP',
    priceTr: '₺599,99',
    priceEn: '$29.99',
    badgeTr: 'VIP SAAS',
    badgeEn: 'VIP SAAS',
    isSuper: true,
    icon: '👑',
  },
];

interface TypeFlowCheckoutModalProps {
  isOpen: boolean;
  pkg: PaidPackage | null;
  onClose: () => void;
  lang: Locale;
  profile: UserProfile;
  onPaymentSuccess: (pkg: PaidPackage) => void;
}

export const TypeFlowCheckoutModal: React.FC<TypeFlowCheckoutModalProps> = ({
  isOpen,
  pkg,
  onClose,
  lang,
  profile,
  onPaymentSuccess,
}) => {
  const isTr = lang === 'tr';
  const [payMethod, setPayMethod] = useState<'card' | 'gpay' | 'apple'>('card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('742');
  const [cardHolder, setCardHolder] = useState(profile.username || 'Bugra');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !pkg) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    console.debug('[TypeFlow:Checkout] Processing payment for package:', pkg.id, 'via', payMethod);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onPaymentSuccess(pkg);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="tf-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="tf-modal-card" style={{ maxWidth: '520px', padding: '1.75rem' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💳</span>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
              {isTr ? 'Güvenli Ödeme Noktası' : 'Secure Checkout'}
            </h3>
          </div>
          <button type="button" className="tf-modal-close tf-btn-pushable" onClick={onClose}>
            ✕
          </button>
        </div>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🎉</div>
            <h3 style={{ color: '#10b981', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              {isTr ? 'Ödeme Başarıyla Tamamlandı!' : 'Payment Successful!'}
            </h3>
            <p style={{ color: 'var(--tf-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              {isTr ? `${pkg.nameTr} hesabınıza anında yüklendi.` : `${pkg.nameEn} has been credited to your account.`}
            </p>
          </div>
        ) : (
          <>
            {/* Package Summary Box */}
            <div style={{
              background: 'var(--tf-surface-elevated)',
              border: '1px solid var(--tf-border)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }}>{pkg.icon}</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>
                    {isTr ? pkg.nameTr : pkg.nameEn}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    {isTr ? '✓ Anında Teslimat & Aktif' : '✓ Instant Activation'}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--tf-accent)' }}>
                {isTr ? pkg.priceTr : pkg.priceEn}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button
                type="button"
                className={`tf-ctrl-btn tf-btn-pushable ${payMethod === 'card' ? 'active' : ''}`}
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setPayMethod('card')}
              >
                💳 {isTr ? 'Kredi Kartı' : 'Card'}
              </button>
              <button
                type="button"
                className={`tf-ctrl-btn tf-btn-pushable ${payMethod === 'gpay' ? 'active' : ''}`}
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setPayMethod('gpay')}
              >
                G Pay
              </button>
              <button
                type="button"
                className={`tf-ctrl-btn tf-btn-pushable ${payMethod === 'apple' ? 'active' : ''}`}
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setPayMethod('apple')}
              >
                 Apple Pay
              </button>
            </div>

            {/* Payment Form */}
            <form onSubmit={handlePay}>
              {payMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--tf-text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                      {isTr ? 'Kart Üzerindeki İsim' : 'Cardholder Name'}
                    </label>
                    <input
                      type="text"
                      className="tf-typing-input"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--tf-text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                      {isTr ? 'Kart Numarası' : 'Card Number'}
                    </label>
                    <input
                      type="text"
                      className="tf-typing-input"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--tf-text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                        {isTr ? 'Son Kullanma' : 'Expires'}
                      </label>
                      <input
                        type="text"
                        className="tf-typing-input"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--tf-text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        className="tf-typing-input"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        maxLength={4}
                        required
                        style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {payMethod !== 'card' && (
                <div style={{
                  textAlign: 'center',
                  padding: '1.5rem 1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '10px',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {payMethod === 'gpay' ? '📱' : ''}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--tf-text-secondary)' }}>
                    {isTr
                      ? `${payMethod === 'gpay' ? 'Google Pay' : 'Apple Pay'} cüzdanınızdaki kayıtlı kart ile tek tıkla onaylayın.`
                      : `One-tap checkout with your default ${payMethod === 'gpay' ? 'Google Pay' : 'Apple Pay'} card.`}
                  </p>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="tf-btn-primary tf-btn-pushable"
                disabled={isProcessing}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  border: 'none',
                }}
              >
                {isProcessing
                  ? (isTr ? '⏳ Ödeme Doğrulanıyor (3D Secure)...' : '⏳ Verifying 3D Secure...')
                  : (isTr ? `🔒 ${pkg.priceTr} Güvenle Öde` : `🔒 Pay ${pkg.priceEn} Securely`)}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--tf-text-muted)', marginTop: '0.6rem' }}>
                🛡️ 256-Bit SSL Şifreli Güvenli Ödeme Protokolü
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
