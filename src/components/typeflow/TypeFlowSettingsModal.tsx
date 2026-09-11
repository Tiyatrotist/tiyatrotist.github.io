/**
 * TYPEFLOW — Advanced SaaS Settings Modal Component
 * Comprehensive settings dashboard for:
 * - 🎨 Themes & Visual Swatches (Carbon, Amber, Matrix, Slate, Violet, Rose, Cyber)
 * - 🔊 Mechanical Switch Acoustic & Live Audio Test Button
 * - ⌨️ Caret Style & Animation Customization
 * - 🎯 Daily Goals & Keyboard Layouts
 * - 👤 Account, Cloud Sync & Data Management
 */

'use client';

import React, { useState } from 'react';
import { Locale } from '@/dictionaries';
import { TypeFlowTheme, SoundType, UserProfile } from './types';
import { soundEngine } from './TypeFlowSoundEngine';

interface TypeFlowSettingsModalProps {
  isOpen: boolean;
  lang: Locale;
  theme: TypeFlowTheme;
  sound: SoundType;
  volume: number;
  profile: UserProfile;
  onClose: () => void;
  onThemeChange: (t: TypeFlowTheme) => void;
  onSoundChange: (s: SoundType) => void;
  onVolumeChange: (v: number) => void;
  onProfileUpdate: (p: UserProfile) => void;
  onOpenShop: () => void;
}

type SettingsCategory = 'themes' | 'sound' | 'typing' | 'goals' | 'account';

const THEMES_CONFIG: { id: TypeFlowTheme; nameTr: string; nameEn: string; bg: string; surface: string; accent: string }[] = [
  { id: 'carbon', nameTr: 'Carbon (Monokrom)', nameEn: 'Carbon (Monochrome)', bg: '#000000', surface: '#141418', accent: '#ffffff' },
  { id: 'amber', nameTr: 'Cyber Amber (Kehribar)', nameEn: 'Cyber Amber', bg: '#0a0804', surface: '#1e180d', accent: '#f59e0b' },
  { id: 'emerald', nameTr: 'Matrix Emerald (Zümrüt)', nameEn: 'Matrix Emerald', bg: '#040906', surface: '#0e2014', accent: '#10b981' },
  { id: 'slate', nameTr: 'Nordic Slate (Kutup Buz)', nameEn: 'Nordic Slate', bg: '#060b13', surface: '#142036', accent: '#38bdf8' },
  { id: 'violet', nameTr: 'Tokyo Violet (Siber Gece)', nameEn: 'Tokyo Violet', bg: '#090612', surface: '#1c1438', accent: '#a855f7' },
  { id: 'rose', nameTr: 'Rose Quartz (Kuvars)', nameEn: 'Rose Quartz', bg: '#0f070b', surface: '#26121f', accent: '#fb7185' },
  { id: 'cyber', nameTr: 'Cyberpunk Neon (Siyan)', nameEn: 'Cyberpunk Neon', bg: '#030712', surface: '#111d3e', accent: '#22d3ee' },
];

const SOUNDS_CONFIG: { id: SoundType; nameTr: string; nameEn: string; descTr: string; descEn: string; icon: string }[] = [
  { id: 'thock', nameTr: 'Thock (Lubed Linear)', nameEn: 'Thock (Lubed Linear)', descTr: 'Derin, tok ve yağlanmış özel mekanik ses.', descEn: 'Deep, muted lubed linear switch acoustics.', icon: '⌨️' },
  { id: 'clicky', nameTr: 'IBM Model M Clicky', nameEn: 'IBM Model M Clicky', descTr: 'Efsanevi 1985 buckling spring daktilo sesi.', descEn: 'Iconic tactile buckling spring acoustic.', icon: '🔊' },
  { id: 'tactile', nameTr: 'Holy Panda Tactile', nameEn: 'Holy Panda Tactile', descTr: 'Tatmin edici mekanik basış hissi.', descEn: 'Crisp tactile bump with clack bottom out.', icon: '🐼' },
  { id: 'synth', nameTr: 'Cyberwave Synth', nameEn: 'Cyberwave Synth', descTr: 'Fütüristik melodik tonlar ve müzikal akış.', descEn: 'Synthesized melodic musical chimes.', icon: '🎹' },
  { id: 'off', nameTr: 'Sessiz (Off)', nameEn: 'Muted (Off)', descTr: 'Tamamen sessiz yazım ortamı.', descEn: 'Completely silent typing experience.', icon: '🔇' },
];

export default function TypeFlowSettingsModal({
  isOpen,
  lang,
  theme,
  sound,
  volume,
  profile,
  onClose,
  onThemeChange,
  onSoundChange,
  onVolumeChange,
  onProfileUpdate,
  onOpenShop,
}: TypeFlowSettingsModalProps) {
  const isTr = lang === 'tr';
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('themes');
  const [testCaretStyle, setTestCaretStyle] = useState<'line' | 'block' | 'underline'>('line');
  const [dailyGoalInput, setDailyGoalInput] = useState<number>(profile.dailyGoal || 3);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestSound = (type: SoundType) => {
    soundEngine.setSoundType(type);
    soundEngine.playKey(false, false);
    console.debug('[TypeFlow:Settings] Tested sound switch:', type);
  };

  const handleGoalSave = (goal: number) => {
    setDailyGoalInput(goal);
    const updated = { ...profile, dailyGoal: goal };
    onProfileUpdate(updated);
    setAlertMsg(isTr ? 'Günlük hedef güncellendi!' : 'Daily goal updated!');
    setTimeout(() => setAlertMsg(null), 2500);
  };

  return (
    <div className="tf-settings-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="tf-settings-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tf-settings-header">
          <div className="tf-settings-title">
            <span>⚙️</span>
            <span>{isTr ? 'Ayarlar ve Tercihler' : 'Settings & Preferences'}</span>
          </div>
          <button className="tf-settings-close-btn" onClick={onClose} aria-label="Close settings">
            ✕
          </button>
        </div>

        {/* Body with Sidebar and Panel */}
        <div className="tf-settings-body">
          {/* Left Category Sidebar */}
          <nav className="tf-settings-sidebar">
            <button
              className={`tf-settings-nav-btn ${activeCategory === 'themes' ? 'active' : ''}`}
              onClick={() => setActiveCategory('themes')}
            >
              <span>🎨</span>
              <span>{isTr ? 'Görünüm & Temalar' : 'Appearance'}</span>
            </button>

            <button
              className={`tf-settings-nav-btn ${activeCategory === 'sound' ? 'active' : ''}`}
              onClick={() => setActiveCategory('sound')}
            >
              <span>🔊</span>
              <span>{isTr ? 'Ses & Akustik' : 'Sound & Audio'}</span>
            </button>

            <button
              className={`tf-settings-nav-btn ${activeCategory === 'typing' ? 'active' : ''}`}
              onClick={() => setActiveCategory('typing')}
            >
              <span>⌨️</span>
              <span>{isTr ? 'Caret & Yazım' : 'Caret & Typing'}</span>
            </button>

            <button
              className={`tf-settings-nav-btn ${activeCategory === 'goals' ? 'active' : ''}`}
              onClick={() => setActiveCategory('goals')}
            >
              <span>🎯</span>
              <span>{isTr ? 'Hedefler & Lig' : 'Goals & League'}</span>
            </button>

            <button
              className={`tf-settings-nav-btn ${activeCategory === 'account' ? 'active' : ''}`}
              onClick={() => setActiveCategory('account')}
            >
              <span>👤</span>
              <span>{isTr ? 'Hesap & Veri' : 'Account & Data'}</span>
            </button>
          </nav>

          {/* Right Main Settings Panel */}
          <div className="tf-settings-panel">
            {/* Feedback alert */}
            {alertMsg && (
              <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#22c55e', padding: '0.6rem 0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {alertMsg}
              </div>
            )}

            {/* 1. CATEGORY: THEMES */}
            {activeCategory === 'themes' && (
              <div>
                <div className="tf-settings-group-title">
                  {isTr ? 'Görsel Temalar' : 'Color Themes'}
                </div>
                <div className="tf-settings-group-desc">
                  {isTr
                    ? 'Yazım alanının kontrast ve renk paletini belirle. Mağazadan yeni temalar açabilirsin.'
                    : 'Choose your desired color aesthetic and contrast palette.'}
                </div>

                <div className="tf-settings-theme-grid">
                  {THEMES_CONFIG.map((t) => {
                    const isEquipped = theme === t.id;
                    const isUnlocked = profile.unlockedThemes?.includes(t.id) || ['carbon', 'amber', 'emerald', 'slate', 'violet'].includes(t.id);

                    return (
                      <div
                        key={t.id}
                        className={`tf-theme-card ${isEquipped ? 'active' : ''}`}
                        onClick={() => {
                          if (isUnlocked) onThemeChange(t.id);
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                            {isTr ? t.nameTr : t.nameEn}
                          </span>
                          {isEquipped && (
                            <span style={{ fontSize: '0.7rem', background: 'var(--tf-accent)', color: '#000', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                              {isTr ? 'AKTİF' : 'ACTIVE'}
                            </span>
                          )}
                        </div>

                        {/* Visual Color Swatches */}
                        <div className="tf-theme-swatches">
                          <div className="tf-swatch" style={{ background: t.bg }} title="Background" />
                          <div className="tf-swatch" style={{ background: t.surface }} title="Surface" />
                          <div className="tf-swatch" style={{ background: t.accent }} title="Accent" />
                        </div>

                        <div>
                          {isEquipped ? (
                            <span style={{ fontSize: '0.78rem', color: 'var(--tf-accent)' }}>
                              {isTr ? 'Kullanılıyor ✓' : 'Equipped ✓'}
                            </span>
                          ) : isUnlocked ? (
                            <button
                              className="tf-btn"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', background: 'var(--tf-surface)', border: '1px solid var(--tf-border)' }}
                              onClick={() => onThemeChange(t.id)}
                            >
                              {isTr ? 'Seç' : 'Select'}
                            </button>
                          ) : (
                            <button
                              className="tf-btn"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid #38bdf8' }}
                              onClick={() => {
                                onClose();
                                onOpenShop();
                              }}
                            >
                              {isTr ? 'Mağazadan Aç 💎' : 'Unlock in Shop 💎'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. CATEGORY: SOUND */}
            {activeCategory === 'sound' && (
              <div>
                <div className="tf-settings-group-title">
                  {isTr ? 'Mekanik Klavye Sesleri' : 'Mechanical Audio Switches'}
                </div>
                <div className="tf-settings-group-desc">
                  {isTr
                    ? 'Yazarken gerçek mekanik klavye hissi veren Web Audio API sentezleyicisi.'
                    : 'Tactile sound synthesizers for an authentic mechanical typing experience.'}
                </div>

                <div>
                  {SOUNDS_CONFIG.map((s) => {
                    const isSelected = sound === s.id;
                    return (
                      <div
                        key={s.id}
                        className={`tf-sound-card ${isSelected ? 'active' : ''}`}
                        onClick={() => onSoundChange(s.id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                              {isTr ? s.nameTr : s.nameEn}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--tf-text-secondary)' }}>
                              {isTr ? s.descTr : s.descEn}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          {s.id !== 'off' && (
                            <button
                              className="tf-sound-test-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTestSound(s.id);
                              }}
                              title={isTr ? "Sesi Test Et" : "Test Sound"}
                            >
                              🎵 {isTr ? 'Test Et' : 'Listen'}
                            </button>
                          )}
                          <span style={{ fontSize: '0.85rem', color: isSelected ? 'var(--tf-accent)' : 'var(--tf-text-muted)', fontWeight: 700 }}>
                            {isSelected ? '✓' : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Volume Slider */}
                <div className="tf-slider-wrapper">
                  <div className="tf-slider-label">
                    <span>{isTr ? 'Ses Düzeyi' : 'Sound Volume'}</span>
                    <span style={{ fontFamily: 'var(--tf-font-mono)', color: 'var(--tf-accent)' }}>
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    className="tf-slider"
                    value={volume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      onVolumeChange(v);
                      soundEngine.playKey(false, false);
                    }}
                  />
                </div>
              </div>
            )}

            {/* 3. CATEGORY: TYPING & CARET */}
            {activeCategory === 'typing' && (
              <div>
                <div className="tf-settings-group-title">
                  {isTr ? 'Caret ve Yazım Ayarları' : 'Caret & Typing Behavior'}
                </div>
                <div className="tf-settings-group-desc">
                  {isTr
                    ? 'Yazım kutusundaki imleç stili ve kısayol ayarlarını kişiselleştir.'
                    : 'Customize caret visual styles and keyboard shortcuts.'}
                </div>

                {/* Caret Style Box */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--tf-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                    {isTr ? 'CARET (İMLEÇ) STİLİ' : 'CARET STYLE'}
                  </label>
                  <div className="tf-options-row">
                    <div
                      className={`tf-option-box ${testCaretStyle === 'line' ? 'active' : ''}`}
                      onClick={() => setTestCaretStyle('line')}
                    >
                      | {isTr ? 'Çizgi (Line)' : 'Line'}
                    </div>
                    <div
                      className={`tf-option-box ${testCaretStyle === 'block' ? 'active' : ''}`}
                      onClick={() => setTestCaretStyle('block')}
                    >
                      ▮ {isTr ? 'Blok (Block)' : 'Block'}
                    </div>
                    <div
                      className={`tf-option-box ${testCaretStyle === 'underline' ? 'active' : ''}`}
                      onClick={() => setTestCaretStyle('underline')}
                    >
                      _ {isTr ? 'Alt Çizgi' : 'Underline'}
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="tf-setting-toggle-row">
                  <div className="tf-setting-toggle-info">
                    <h5>{isTr ? 'Tab / Esc ile Hızlı Yeniden Başlatma' : 'Quick Restart (Tab / Esc)'}</h5>
                    <p>{isTr ? 'Test esnasında Tab veya Esc tuşuna basarak anında sıfırla.' : 'Instantly restart typing test on Tab or Esc.'}</p>
                  </div>
                  <input type="checkbox" className="tf-checkbox-switch" defaultChecked />
                </div>

                <div className="tf-setting-toggle-row">
                  <div className="tf-setting-toggle-info">
                    <h5>{isTr ? 'Caps Lock Uyarısı' : 'Caps Lock Alert'}</h5>
                    <p>{isTr ? 'Büyük harf kilidi açıkken kırmızı görsel uyarı göster.' : 'Show prominent alert when Caps Lock is enabled.'}</p>
                  </div>
                  <input type="checkbox" className="tf-checkbox-switch" defaultChecked />
                </div>

                <div className="tf-setting-toggle-row">
                  <div className="tf-setting-toggle-info">
                    <h5>{isTr ? 'Canlı Hata Vurgulama' : 'Live Typo Mismatch Glow'}</h5>
                    <p>{isTr ? 'Hatalı harf girildiğinde yazım kutusunun kırmızı parıldaması.' : 'Glow red when current input deviates from target word.'}</p>
                  </div>
                  <input type="checkbox" className="tf-checkbox-switch" defaultChecked />
                </div>
              </div>
            )}

            {/* 4. CATEGORY: GOALS & LEAGUE */}
            {activeCategory === 'goals' && (
              <div>
                <div className="tf-settings-group-title">
                  {isTr ? 'Günlük Hedefler ve Lig' : 'Daily Goals & League'}
                </div>
                <div className="tf-settings-group-desc">
                  {isTr
                    ? 'Her gün tamamlamak istediğin test sayısını belirle ve serini büyüt.'
                    : 'Set your daily practice target and track streak habits.'}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--tf-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                    {isTr ? 'GÜNLÜK TEST HEDEFİ' : 'DAILY PRACTICE TARGET'}
                  </label>
                  <div className="tf-options-row">
                    {[2, 3, 5, 10].map((goal) => (
                      <div
                        key={goal}
                        className={`tf-option-box ${dailyGoalInput === goal ? 'active' : ''}`}
                        onClick={() => handleGoalSave(goal)}
                      >
                        🎯 {goal} {isTr ? 'Test' : 'Tests'}
                      </div>
                    ))}
                  </div>
                </div>

                {/* League status info */}
                <div style={{ background: 'var(--tf-surface-elevated)', border: '1px solid var(--tf-border)', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2rem' }}>🏆</span>
                    <div>
                      <h4 style={{ margin: 0, textTransform: 'capitalize' }}>
                        {profile.league || 'Bronz'} {isTr ? 'Ligi' : 'League'}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--tf-text-secondary)' }}>
                        {isTr ? `Haftalık Toplanan XP: ${profile.weeklyXp || 0} XP` : `Weekly Earned XP: ${profile.weeklyXp || 0} XP`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. CATEGORY: ACCOUNT & DATA */}
            {activeCategory === 'account' && (
              <div>
                <div className="tf-settings-group-title">
                  {isTr ? 'Hesap, Bulut ve Veri Yönetimi' : 'Account & Data Management'}
                </div>
                <div className="tf-settings-group-desc">
                  {isTr
                    ? 'Kullanıcı profilini düzenle, Supabase ile buluta bağla veya verileri sıfırla.'
                    : 'Manage profile details, cloud sync, and local data storage.'}
                </div>

                <div style={{ background: 'var(--tf-surface-elevated)', border: '1px solid var(--tf-border)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2.5rem' }}>{profile.avatar}</span>
                    <div>
                      <h4 style={{ margin: 0 }}>{profile.username}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--tf-text-muted)', fontFamily: 'var(--tf-font-mono)' }}>
                        {profile.isGuest ? (isTr ? 'Misafir Kullanıcı (Yerel Saklama)' : 'Guest Typist (Local)') : profile.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Local Storage Reset Button */}
                <div style={{ borderTop: '1px solid var(--tf-border)', paddingTop: '1.25rem' }}>
                  <button
                    className="tf-btn"
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', fontSize: '0.85rem' }}
                    onClick={() => {
                      if (confirm(isTr ? 'Tüm yerel istatistikleri ve ayarları sıfırlamak istediğinize emin misiniz?' : 'Are you sure you want to reset all local typing statistics?')) {
                        try {
                          localStorage.removeItem('tf_user_profile');
                          localStorage.removeItem('tf_local_leaderboard');
                          window.location.reload();
                        } catch {}
                      }
                    }}
                  >
                    🗑️ {isTr ? 'Yerel İstatistikleri Sıfırla' : 'Reset Local Data'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
