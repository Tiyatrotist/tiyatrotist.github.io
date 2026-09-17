/**
 * TYPEFLOW — Duolingo-Style Daktilo Akademisi (Learn Path)
 * Serpentine progression path with Units, interactive lesson nodes, star ratings,
 * and lesson launching.
 */

'use client';

import React, { useState } from 'react';
import {
  Check,
  Lock,
  Star,
  Map,
  Zap,
  Gem,
  Gauge,
  Target,
  Play,
  RotateCcw,
  X,
  Battery,
  Award,
  Flag,
  Waves,
  ArrowUp,
  Edit3,
  Hash,
  Rocket,
  BookOpen,
  Code2,
  Trophy,
  Crown,
  ShoppingBag,
} from 'lucide-react';
import { Locale } from '@/dictionaries';
import { Unit, Lesson, UserProfile } from './types';
import { getUnitsForLang } from './duolingoData';

const UNIT_ICONS = [Flag, Zap, Waves, ArrowUp, Edit3, Hash, Rocket, BookOpen, Code2, Trophy];

interface TypeFlowLearnPathProps {
  lang: Locale;
  profile: UserProfile;
  onStartLesson: (lesson: Lesson) => void;
  onOpenShop: () => void;
  onOpenSuperModal?: () => void;
  onOpenAdModal?: () => void;
}

export default function TypeFlowLearnPath({
  lang,
  profile,
  onStartLesson,
  onOpenShop,
  onOpenSuperModal,
  onOpenAdModal,
}: TypeFlowLearnPathProps) {
  const isTr = lang === 'tr';
  const units = getUnitsForLang(lang);

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Close modal on Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedLesson) {
        setSelectedLesson(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLesson]);

  const handleNodeClick = (lesson: Lesson, status: string) => {
    if (status === 'locked') {
      console.debug('[TypeFlow:LearnPath] Locked lesson clicked:', lesson.id);
      return;
    }
    setSelectedLesson(lesson);
  };

  const isBatteryEmpty = (profile.energy ?? profile.hearts ?? 5) <= 0 && !profile.isPremium;

  const handleLaunch = () => {
    if (!selectedLesson) return;
    if (isBatteryEmpty) {
      console.debug('[TypeFlow:LearnPath] Blocked: Focus battery depleted');
      return;
    }
    const lessonToStart = selectedLesson;
    console.debug('[TypeFlow:LearnPath] Starting lesson:', lessonToStart.id);
    setSelectedLesson(null);
    onStartLesson(lessonToStart);
  };

  return (
    <div className="tf-path-wrapper">
      {/* 1. Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Map size={24} color="#38bdf8" />
          <span>{isTr ? 'Daktilo Akademisi' : 'Typing Academy'}</span>
        </h2>
        <p style={{ color: 'var(--tf-text-secondary)', margin: 0, fontSize: '0.95rem' }}>
          {isTr
            ? '3 Kademeli Ustalık Müfredatı: Kas hafızası drilleri, kelime inşası ve akıcı cümle sınavları.'
            : '3-Stage Mastery Curriculum: Muscle memory drills, core vocabulary, and fluid sentence tests.'}
        </p>
      </div>

      {/* 2. Units Loop */}
      {units.map((unit, unitIdx) => {
        const UnitIconComp = UNIT_ICONS[unitIdx % UNIT_ICONS.length] || Trophy;

        return (
          <div key={unit.id} className="tf-unit-card">
            {/* Unit Header */}
            <div className="tf-unit-header-banner">
              <div>
                <span className="tf-unit-badge">{isTr ? `Bölüm ${unitIdx + 1}` : `Unit ${unitIdx + 1}`}</span>
                <h3 className="tf-unit-title">{unit.title}</h3>
                <p className="tf-unit-desc">{unit.description}</p>
              </div>
              <div style={{ color: 'var(--tf-accent)', display: 'flex', alignItems: 'center' }}>
                <UnitIconComp size={32} />
              </div>
            </div>

            {/* Serpentine Node Path */}
            <div className="tf-unit-path-river">
              {unit.lessons.map((lesson, lessonIdx) => {
                // Determine completion & lock status based on userProfile
                const userStars = profile.completedLessons?.[lesson.id] || 0;
                const isCompleted = userStars > 0;

                // First lesson is active by default; others require previous lesson completed
                let isLocked = false;
                if (unitIdx === 0 && lessonIdx === 0) {
                  isLocked = false;
                } else {
                  // Check if previous lesson was completed
                  const prevLessonId =
                    lessonIdx > 0
                      ? unit.lessons[lessonIdx - 1].id
                      : units[unitIdx - 1]?.lessons[units[unitIdx - 1].lessons.length - 1]?.id;
                  if (prevLessonId && !(profile.completedLessons?.[prevLessonId] > 0)) {
                    isLocked = true;
                  }
                }

                const isActive = !isLocked && !isCompleted;

                // Offset positions for Duolingo snake river look
                const rowPos = lessonIdx % 3 === 0 ? 'pos-center' : lessonIdx % 3 === 1 ? 'pos-left' : 'pos-right';

                return (
                  <div key={lesson.id} className={`tf-node-row ${rowPos}`}>
                    <div className="tf-node-anchor">
                      {/* Bouncing Duolingo "BAŞLA!" Badge on active node */}
                      {isActive && (
                        <div className="tf-active-node-badge">
                          <span>{isTr ? 'BAŞLA!' : 'START!'}</span>
                        </div>
                      )}

                      <button
                        className={`tf-path-node-btn tf-btn-pushable ${isCompleted ? 'node-completed' : ''} ${isActive ? 'node-active' : ''} ${isLocked ? 'node-locked' : ''}`}
                        onClick={() => handleNodeClick(lesson, isLocked ? 'locked' : 'open')}
                        disabled={isLocked}
                        title={lesson.title}
                        aria-label={lesson.title}
                      >
                        {isCompleted ? (
                          <Check size={22} color="#fff" strokeWidth={3} />
                        ) : isLocked ? (
                          <Lock size={18} color="#64748b" />
                        ) : (
                          <Play size={18} color="#fff" fill="#fff" />
                        )}
                      </button>

                      {/* Stars Rating */}
                      <div className="tf-node-stars" style={{ display: 'flex', gap: '3px', justifyContent: 'center' }}>
                        <Star size={13} fill={userStars >= 1 ? '#eab308' : 'none'} color={userStars >= 1 ? '#eab308' : '#475569'} />
                        <Star size={13} fill={userStars >= 2 ? '#eab308' : 'none'} color={userStars >= 2 ? '#eab308' : '#475569'} />
                        <Star size={13} fill={userStars >= 3 ? '#eab308' : 'none'} color={userStars >= 3 ? '#eab308' : '#475569'} />
                      </div>

                      {/* Lesson Short Label */}
                      <span className="tf-node-label">{lesson.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* 3. Lesson Preview Modal */}
      {selectedLesson && (
        <div
          className="tf-lesson-modal-overlay"
          onClick={() => setSelectedLesson(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="tf-lesson-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="tf-lesson-modal-close tf-btn-pushable"
              onClick={() => setSelectedLesson(null)}
              aria-label={isTr ? "Kapat" : "Close"}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={16} />
            </button>

            <div className="tf-lesson-modal-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={28} color="#38bdf8" fill="#38bdf8" />
            </div>
            <h3 className="tf-lesson-modal-title">{selectedLesson.title}</h3>
            <p className="tf-lesson-modal-desc">
              {selectedLesson.description}
            </p>

            {/* Target Keys Pill */}
            <div className="tf-lesson-target-box">
              <div className="tf-lesson-box-label">
                {isTr ? 'HEDEF HARFLER & ODAK TUŞLARI' : 'TARGET KEYS & FOCUS'}
              </div>
              <div className="tf-lesson-keys-row">
                {selectedLesson.targetChars.map((ch, idx) => (
                  <kbd key={idx} className="tf-lesson-kbd">
                    {ch === ' ' ? 'Space' : ch.toUpperCase()}
                  </kbd>
                ))}
              </div>
            </div>

            {/* 3-Stage Mastery Curriculum Preview */}
            {selectedLesson.stages && selectedLesson.stages.length > 0 && (
              <div className="tf-lesson-stages-preview">
                <div className="tf-lesson-box-label">
                  {isTr ? '3 AŞAMALI KADEMELİ USTALIK' : '3-STAGE MASTERY PROGRESSION'}
                </div>
                <div className="tf-stages-list">
                  {selectedLesson.stages.map((st) => (
                    <div key={st.stageIndex} className="tf-stage-row-item">
                      <span className="tf-stage-number">{st.stageIndex}</span>
                      <div className="tf-stage-info">
                        <span className="tf-stage-title-text">{st.title}</span>
                        <span className="tf-stage-desc-text">{st.description}</span>
                      </div>
                      <span className="tf-stage-target-tag">{st.minWpm} WPM</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements & Rewards */}
            <div className="tf-lesson-meta-grid">
              <div className="tf-lesson-meta-item">
                <span className="tf-lesson-meta-lbl">{isTr ? 'USTALIK BARAJI' : 'MASTERY CRITERIA'}</span>
                <span className="tf-lesson-meta-val">
                  {selectedLesson.minWpm} WPM / %{selectedLesson.minAccuracy}
                </span>
              </div>
              <div className="tf-lesson-meta-item">
                <span className="tf-lesson-meta-lbl">{isTr ? 'ÖDÜL' : 'REWARD'}</span>
                <span className="tf-lesson-meta-val reward" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>+{profile.isPremium ? selectedLesson.xpReward * 2 : selectedLesson.xpReward} XP / +{selectedLesson.gemReward}</span>
                  <Gem size={12} color="#38bdf8" />
                  {profile.isPremium && <span style={{ color: '#f59e0b', marginLeft: '4px', fontSize: '0.72rem' }}>(2X PRO)</span>}
                </span>
              </div>
            </div>

            {/* Completed Badge Indicator */}
            {profile.completedLessons?.[selectedLesson.id] > 0 && (
              <div style={{ margin: '0.75rem 0', padding: '0.6rem 0.8rem', background: 'rgba(34, 197, 94, 0.12)', border: '1px solid #22c55e', borderRadius: '10px', textAlign: 'center', fontSize: '0.85rem', color: '#16a34a', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Check size={16} />
                <span>
                  {isTr
                    ? `Bu ders tamamlandı (${profile.completedLessons[selectedLesson.id]} / 3 Yıldız). Hızınızı pekiştirmek için tekrar oynayabilirsiniz!`
                    : `Completed (${profile.completedLessons[selectedLesson.id]} / 3 Stars). Replay anytime to beat your score!`}
                </span>
              </div>
            )}

            {/* Battery Depleted Warning or Launch */}
            {isBatteryEmpty ? (
              <div className="tf-lesson-hearts-empty">
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Battery size={16} color="#ef4444" />
                  <span>
                    {isTr
                      ? 'Odak Bataryan tükendi! Teknoloji reklamı izleyerek hemen +1 enerji şarj edebilir veya Super\'a geçebilirsin.'
                      : 'Focus battery depleted! Watch a tech sponsor break to recharge +1 energy or upgrade to Super.'}
                  </span>
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {onOpenAdModal && (
                    <button
                      className="tf-lesson-shop-btn tf-btn-pushable"
                      style={{ background: '#3b82f6', color: '#fff', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => {
                        setSelectedLesson(null);
                        onOpenAdModal();
                      }}
                    >
                      <Zap size={14} />
                      <span>{isTr ? 'Reklam İzle (+1 Enerji)' : 'Watch Ad (+1 Energy)'}</span>
                    </button>
                  )}
                  {onOpenSuperModal && (
                    <button
                      className="tf-lesson-shop-btn tf-btn-pushable"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #eab308)', color: '#000', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => {
                        setSelectedLesson(null);
                        onOpenSuperModal();
                      }}
                    >
                      <Crown size={14} />
                      <span>{isTr ? 'Super\'a Geç (Sınırsız)' : 'Get Super (Unlimited)'}</span>
                    </button>
                  )}
                  <button
                    className="tf-lesson-shop-btn tf-btn-pushable"
                    onClick={() => {
                      setSelectedLesson(null);
                      onOpenShop();
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ShoppingBag size={14} />
                    <span>{isTr ? 'Mağazada Doldur' : 'Shop Refill'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="tf-lesson-actions">
                <button
                  className="tf-lesson-cancel-btn tf-btn-pushable"
                  onClick={() => setSelectedLesson(null)}
                >
                  {isTr ? 'Vazgeç' : 'Cancel'}
                </button>
                <button
                  className="tf-lesson-launch-btn tf-btn-pushable"
                  onClick={handleLaunch}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  {profile.completedLessons?.[selectedLesson.id] > 0 ? (
                    <>
                      <RotateCcw size={15} />
                      <span>{isTr ? 'Dersi Tekrarla' : 'Replay Lesson'}</span>
                    </>
                  ) : (
                    <>
                      <Play size={15} fill="currentColor" />
                      <span>{isTr ? 'Dersi Başlat' : 'Start Lesson'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
