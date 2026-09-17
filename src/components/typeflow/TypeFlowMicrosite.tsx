/**
 * TYPEFLOW — Master Microsite Orchestrator
 * Full Duolingo-Grade Speed Typing SaaS Platform:
 * - 6 SaaS Tabs: Learn Path (Akademi), Practice (Serbest Yazım), Leagues (Ligler), Quests (Görevler), Shop (Mağaza), Profile (İstatistik & Isı Haritası)
 * - Duolingo Gamification: Hearts (Canlar ❤️), Gems (Elmaslar 💎), Daily Streak (🔥), XP Levels (⚡), Star Ratings (⭐)
 * - Strict Zero-Hydration-Mismatch Architecture (Deterministic defaults + Client-only hydration)
 * - Normal theme-appropriate cursor & responsive typing engine.
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Locale, Dictionary } from '@/dictionaries';
import {
  TypeFlowMode,
  TypeFlowTheme,
  SoundType,
  WordCountOption,
  TimeOption,
  TestStatus,
  WordState,
  SecondMetric,
  TestResult,
  KeyHeatmapData,
  SaaSTab,
  UserProfile,
  Lesson,
  ShopItem,
} from './types';
import {
  generateCommonWords,
  getDevSnippet,
} from './typeflowData';
import { generateDynamicStory, getTheatricalSnippet } from './StoryGenerator';
import { soundEngine } from './TypeFlowSoundEngine';
import TypeFlowHeader from './TypeFlowHeader';
import TypeFlowControls from './TypeFlowControls';
import TypeFlowTypingArea from './TypeFlowTypingArea';
import TypeFlowResults from './TypeFlowResults';
import TypeFlowProfileView from './TypeFlowProfileView';
import TypeFlowAuthModal from './TypeFlowAuthModal';
import TypeFlowLearnPath from './TypeFlowLearnPath';
import TypeFlowLeagues from './TypeFlowLeagues';
import TypeFlowQuests from './TypeFlowQuests';
import TypeFlowShop from './TypeFlowShop';
import TypeFlowSettingsModal from './TypeFlowSettingsModal';
import TypeFlowProfileDrawer from './TypeFlowProfileDrawer';
import { TypeFlowSuperModal } from './TypeFlowSuperModal';
import { TypeFlowAdBreakModal } from './TypeFlowAdBreakModal';
import { TypeFlowPracticeHub, PracticeDrillConfig } from './TypeFlowPracticeHub';
import { TypeFlowGoogleAd } from './TypeFlowGoogleAd';
import TypeFlowCheckoutPage, { CheckoutPackage, PaymentDetails, CHECKOUT_PACKAGES } from './TypeFlowCheckoutPage';
import { getTechAds, getUnitsForLang } from './duolingoData';
import { supabase } from '@/lib/supabase';
import { recordProjectEvent } from '@/lib/project-analytics';
import '@/styles/typeflow.css';

interface TypeFlowMicrositeProps {
  lang: Locale;
  dict: Dictionary;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'guest_user',
  username: 'Daktilocu',
  bio: 'Hızlı ve ritmik on parmak daktilo pratiği.',
  isGuest: true,
  avatar: '⚡',
  level: 1,
  xp: 0,
  streakDays: 0,
  lastActiveDate: '',
  dailyTestsCompleted: 0,
  dailyGoal: 3,
  totalTests: 0,
  avgWpm: 0,
  topWpm: 0,
  keyStats: {},

  // Odak Enerjisi (Focus Battery 🔋) & Super TypeFlow
  energy: 5,
  maxEnergy: 5,
  isPremium: false,

  // Duolingo Gamification
  hearts: 5,
  maxHearts: 5,
  gems: 10,
  streakFreezes: 0,
  league: 'bronze',
  weeklyXp: 0,
  completedLessons: {},
  unlockedThemes: ['carbon', 'amber', 'emerald', 'slate', 'violet', 'rose', 'cyber'],
  unlockedSounds: ['thock', 'clicky', 'tactile', 'synth'],
  claimedQuests: [],
  unlockedAchievements: [],
};

export default function TypeFlowMicrosite({ lang: initialLang }: TypeFlowMicrositeProps) {
  const router = useRouter();
  const [lang, setLang] = useState<Locale>(initialLang);

  // ─── SaaS Navigation State ─────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<SaaSTab>('path');
  const [selectedCheckoutPkgId, setSelectedCheckoutPkgId] = useState<string>('super_yearly');
  const [practiceSubView, setPracticeSubView] = useState<'hub' | 'typing'>('hub');
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState<boolean>(false);
  const [isSuperModalOpen, setIsSuperModalOpen] = useState<boolean>(false);
  const [isAdBreakModalOpen, setIsAdBreakModalOpen] = useState<boolean>(false);
  const [currentAdIndex, setCurrentAdIndex] = useState<number>(0);
  const [activeLessonStage, setActiveLessonStage] = useState<number>(1);

  // ─── Audit Fix States: Toast, Onboarding, Level-Up ──────────────────────────
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'info' | 'warning' | 'error' }[]>([]);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showLevelUp, setShowLevelUp] = useState<{ from: number; to: number } | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [activeDrillConfig, setActiveDrillConfig] = useState<PracticeDrillConfig | null>(null);
  const toastIdRef = useRef<number>(0);

  // ─── User Preferences State ────────────────────────────────────────────────
  const [theme, setTheme] = useState<TypeFlowTheme>('carbon');
  const [sound, setSound] = useState<SoundType>('thock');
  const [volume, setVolume] = useState<number>(0.6);

  // ─── Mode & Configuration State (Simplified) ───────────────────────────────
  const [mode, setMode] = useState<TypeFlowMode>('words');
  const [wordModeType, setWordModeType] = useState<'words' | 'time'>('time');
  const [wordCount, setWordCount] = useState<WordCountOption>(25);
  const [timeLimit, setTimeLimit] = useState<TimeOption>(60);

  // Active Lesson Metadata
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Practice Lenient Casing & Punctuation Settings (Optional in practice mode)
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);

  // Lesson Mistake Tracking (3 Mistakes Limit)
  const [lessonMistakes, setLessonMistakes] = useState<number>(0);
  const [isLessonFailed, setIsLessonFailed] = useState<boolean>(false);

  // Normalization helper for lenient practice typing
  const normalizeWord = (text: string, isStrictCase: boolean, isStrictPunct: boolean): string => {
    let res = text;
    if (!isStrictCase) {
      res = res.toLowerCase();
    }
    if (!isStrictPunct) {
      res = res.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, '');
    }
    return res;
  };

  // Metadata for current Story or Dev snippet
  const [activeSnippetTitle, setActiveSnippetTitle] = useState<string>('');
  const [activeSnippetSub, setActiveSnippetSub] = useState<string>('');

  // ─── Engine State ──────────────────────────────────────────────────────────
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [words, setWords] = useState<WordState[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [isMismatch, setIsMismatch] = useState<boolean>(false);
  const [correctWordsCount, setCorrectWordsCount] = useState<number>(0);
  const [incorrectWordsCount, setIncorrectWordsCount] = useState<number>(0);
  const [capsLockActive, setCapsLockActive] = useState<boolean>(false);

  // Live Metrics
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [liveWpm, setLiveWpm] = useState<number>(0);
  const [liveAccuracy, setLiveAccuracy] = useState<number>(100);
  const [liveStreak, setLiveStreak] = useState<number>(0);
  const [history, setHistory] = useState<SecondMetric[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  // Key heatmap tracking for current session
  const sessionKeyStats = useRef<KeyHeatmapData>({});
  const currentSecondErrors = useRef<number>(0);
  const totalCorrectCharsRef = useRef<number>(0);
  const totalIncorrectCharsRef = useRef<number>(0);

  // ─── 1. Load Stored Preferences & Profile on Mount ──────────────────────────
  // ─── Toast System (Audit Fix #8) ──────────────────────────────────────────
  const addToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
    console.debug('[TypeFlow:Toast]', type, message);
  }, []);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('tf_theme') as TypeFlowTheme | null;
      if (savedTheme) setTheme(savedTheme);

      const savedSound = localStorage.getItem('tf_sound') as SoundType | null;
      if (savedSound) {
        setSound(savedSound);
        soundEngine.setSoundType(savedSound);
      }

      const savedVol = localStorage.getItem('tf_volume');
      if (savedVol) {
        const v = parseFloat(savedVol);
        setVolume(v);
        soundEngine.setVolume(v);
      }

      // Load Profile or create first-time client guest profile
      const savedProfile = localStorage.getItem('tf_user_profile');
      if (savedProfile) {
        const parsed: UserProfile = JSON.parse(savedProfile);
        // Guarantee Duolingo & Focus Battery defaults if missing in older schema
        parsed.energy = Math.max(0, Math.min(5, parsed.energy ?? (parsed.hearts ?? 5)));
        parsed.maxEnergy = 5;
        parsed.isPremium = Boolean(parsed.isPremium);
        parsed.hearts = parsed.energy;
        parsed.maxHearts = 5;
        parsed.gems = Math.max(0, parsed.gems ?? 10);
        parsed.league = parsed.league || 'bronze';
        parsed.weeklyXp = parsed.weeklyXp ?? 0;
        parsed.completedLessons = parsed.completedLessons || {};
        parsed.streakFreezes = parsed.streakFreezes ?? 0;
        parsed.unlockedThemes = parsed.unlockedThemes || ['carbon', 'amber', 'emerald', 'slate', 'violet', 'rose', 'cyber'];
        parsed.unlockedSounds = parsed.unlockedSounds || ['thock', 'clicky', 'tactile', 'synth'];
        parsed.claimedQuests = parsed.claimedQuests || [];
        parsed.unlockedAchievements = parsed.unlockedAchievements || [];

        // ─── Audit Fix #6: Time-Based Energy Recharge (3 hours = +1 energy) ────
        if (!parsed.isPremium && (parsed.energy ?? 5) < 5) {
          const lastRechargeStr = localStorage.getItem('tf_last_energy_time');
          const lastRecharge = lastRechargeStr ? parseInt(lastRechargeStr, 10) : Date.now();
          const hoursSince = (Date.now() - lastRecharge) / (1000 * 60 * 60);
          const rechargeUnits = Math.floor(hoursSince / 3);
          if (rechargeUnits > 0) {
            const oldEnergy = parsed.energy ?? 0;
            parsed.energy = Math.min(5, oldEnergy + rechargeUnits);
            parsed.hearts = parsed.energy;
            localStorage.setItem('tf_last_energy_time', String(Date.now()));
            console.debug('[TypeFlow:Energy] Passive recharge:', { oldEnergy, recharged: rechargeUnits, newEnergy: parsed.energy });
          }
        }

        // Free Trial Expiration Check
        if (parsed.subscriptionStatus === 'trialing' && parsed.trialEndsAt) {
          const trialEnd = new Date(parsed.trialEndsAt).getTime();
          if (Date.now() > trialEnd) {
            console.debug('[TypeFlow:Subscription] Free trial has expired! Reverting to free tier.');
            parsed.isPremium = false;
            parsed.subscriptionStatus = 'expired';
            try { localStorage.setItem('tf_user_profile', JSON.stringify(parsed)); } catch {}
          }
        }

        // ─── Audit Fix #7: Weekly League XP Reset (Monday 00:00) ────
        const now = new Date();
        const lastWeekResetStr = localStorage.getItem('tf_week_reset');
        const lastWeekReset = lastWeekResetStr ? new Date(lastWeekResetStr) : new Date(0);
        const isSameWeek = (a: Date, b: Date): boolean => {
          const getWeekStart = (d: Date) => {
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            return new Date(d.getFullYear(), d.getMonth(), diff).toISOString().split('T')[0];
          };
          return getWeekStart(a) === getWeekStart(b);
        };
        if (!isSameWeek(now, lastWeekReset)) {
          // Determine league promotion/demotion based on weeklyXp
          const tiers: Array<'bronze' | 'silver' | 'gold' | 'sapphire' | 'diamond'> = ['bronze', 'silver', 'gold', 'sapphire', 'diamond'];
          const currentTierIdx = tiers.indexOf(parsed.league || 'bronze');
          if ((parsed.weeklyXp || 0) >= 500 && currentTierIdx < tiers.length - 1) {
            parsed.league = tiers[currentTierIdx + 1];
            console.debug('[TypeFlow:League] Promoted to:', parsed.league);
          } else if ((parsed.weeklyXp || 0) < 100 && currentTierIdx > 0) {
            parsed.league = tiers[currentTierIdx - 1];
            console.debug('[TypeFlow:League] Demoted to:', parsed.league);
          }
          parsed.weeklyXp = 0;
          localStorage.setItem('tf_week_reset', now.toISOString());
          console.debug('[TypeFlow:League] Weekly XP reset. New league:', parsed.league);
        }

        // Check streak maintenance
        const today = new Date().toISOString().split('T')[0];
        const lastDate = parsed.lastActiveDate || today;

        const diffDays = Math.round(
          (new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          console.debug('[TypeFlow:Streak] Maintained streak of:', parsed.streakDays);
        } else if (diffDays > 1) {
          // Check if user had a Streak Freeze
          if (parsed.streakFreezes > 0) {
            parsed.streakFreezes -= 1;
            parsed.lastActiveDate = today;
            console.debug('[TypeFlow:Streak] Streak Freeze consumed! Streak preserved:', parsed.streakDays);
          } else {
            parsed.streakDays = 1;
            parsed.dailyTestsCompleted = 0;
            parsed.lastActiveDate = today;
            console.debug('[TypeFlow:Streak] Streak reset to 1 day');
          }
        }

        setProfile(parsed);
        try { localStorage.setItem('tf_user_profile', JSON.stringify(parsed)); } catch {}
      } else {
        const initialGuest: UserProfile = {
          ...DEFAULT_PROFILE,
          id: 'guest_' + Math.random().toString(36).substring(2, 9),
          username: 'Typist_' + Math.floor(Math.random() * 900 + 100),
          lastActiveDate: new Date().toISOString().split('T')[0],
        };
        setProfile(initialGuest);
        setShowOnboarding(true); // Audit Fix #4: Show onboarding for first-time users
        try {
          localStorage.setItem('tf_user_profile', JSON.stringify(initialGuest));
        } catch {}
      }

      setIsHydrated(true); // Audit Fix #5: Mark hydration complete
      console.debug('[TypeFlow:Microsite] Preferences & Duolingo SaaS profile initialized');
    } catch (e) {
      console.warn('[TypeFlow:Microsite] Error loading state from localStorage:', e);
      setIsHydrated(true);
    }

    // ─── Real Supabase Auth State Synchronization ────────────────────────────
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.debug('[TypeFlow:Auth] Supabase auth state changed:', event, session?.user?.email);
      if (session?.user) {
        setProfile((prev) => {
          const userEmail = session.user.email || '';
          const metaName = session.user.user_metadata?.username || session.user.user_metadata?.full_name || userEmail.split('@')[0];
          const updated: UserProfile = {
            ...prev,
            id: session.user.id,
            email: userEmail,
            username: metaName,
            isGuest: false,
          };
          try {
            localStorage.setItem('tf_user_profile', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      } else if (event === 'SIGNED_OUT') {
        setProfile((prev) => {
          const updated: UserProfile = {
            ...prev,
            isGuest: true,
            email: undefined,
            username: 'Daktilocu_' + Math.floor(Math.random() * 900 + 100),
          };
          try {
            localStorage.setItem('tf_user_profile', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Save Preferences
  const handleThemeChange = (newTheme: TypeFlowTheme) => {
    setTheme(newTheme);
    try { localStorage.setItem('tf_theme', newTheme); } catch {}
  };

  const handleSoundChange = (newSound: SoundType) => {
    setSound(newSound);
    soundEngine.setSoundType(newSound);
    try { localStorage.setItem('tf_sound', newSound); } catch {}
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundEngine.setVolume(newVol);
    try { localStorage.setItem('tf_volume', String(newVol)); } catch {}
  };

  const handleLangChange = (newLang: Locale) => {
    setLang(newLang);
    router.replace(`/${newLang}/projects/typeflow`);
  };

  // Audit Fix #16: Memoize handleProfileUpdate to prevent unnecessary re-renders
  const handleProfileUpdate = useCallback((updated: UserProfile) => {
    setProfile(updated);
    try {
      localStorage.setItem('tf_user_profile', JSON.stringify(updated));
    } catch {}
    console.debug('[TypeFlow:Microsite] User profile saved:', updated.username);
  }, []);

  // ─── 2. Word & Dynamic Story Preparation ───────────────────────────────────
  const buildWordStates = (rawWords: string[]): WordState[] => {
    return rawWords.map((w, idx) => ({
      original: w,
      letters: w.split('').map((char) => ({ char, status: 'untyped' })),
      isCurrent: idx === 0,
      isComplete: false,
      hasError: false,
    }));
  };

  const initializeTest = useCallback(() => {
    console.debug('[TypeFlow:Microsite] Initializing test', { mode, wordModeType, wordCount, timeLimit, lang });

    let wordList: string[] = [];

    if (mode === 'lesson' && activeLesson) {
      const stages = activeLesson.stages || [];
      const currentStage = stages[activeLessonStage - 1];
      wordList = (currentStage && currentStage.words && currentStage.words.length > 0)
        ? currentStage.words
        : activeLesson.words;
      setActiveSnippetTitle(currentStage ? currentStage.title : activeLesson.title);
      setActiveSnippetSub(currentStage ? currentStage.description : activeLesson.description);
    } else if (mode === 'words') {
      const count = wordModeType === 'words' ? wordCount : 250;
      wordList = generateCommonWords(lang, count, false, false);
      setActiveSnippetTitle('');
      setActiveSnippetSub('');
    } else if (mode === 'story') {
      const story = generateDynamicStory(lang);
      wordList = story.words;
      setActiveSnippetTitle(story.title);
      setActiveSnippetSub(lang === 'tr' ? 'Algoritmik Dinamik Anlatı' : 'Algorithmic Narrative Stream');
    } else if (mode === 'dev') {
      const snippet = getDevSnippet('all');
      wordList = snippet.code.split(' ');
      setActiveSnippetTitle(snippet.title);
      setActiveSnippetSub(snippet.explanation);
    }

    setWords(buildWordStates(wordList));
    setCurrentWordIndex(0);
    setCurrentInput('');
    setIsMismatch(false);
    setCorrectWordsCount(0);
    setIncorrectWordsCount(0);
    setTestStatus('idle');
    setStartTime(null);
    setElapsedSeconds(0);
    setTimeLeft(mode === 'lesson' ? 240 : timeLimit);
    setLiveWpm(0);
    setLiveAccuracy(100);
    setLiveStreak(0);
    setLessonMistakes(0);
    setIsLessonFailed(false);
    setHistory([]);
    setTestResult(null);

    sessionKeyStats.current = {};
    currentSecondErrors.current = 0;
    totalCorrectCharsRef.current = 0;
    totalIncorrectCharsRef.current = 0;
  }, [mode, wordModeType, wordCount, timeLimit, lang, activeLesson, activeLessonStage]);

  // Reinitialize when settings change
  useEffect(() => {
    initializeTest();
  }, [initializeTest]);

  // ─── 3. Launch Academy Lesson with Multi-Stage Progression ──────────────────
  const handleStartLesson = (lesson: Lesson, stageIdx: number = 1) => {
    console.debug('[TypeFlow:Microsite] Launching lesson:', lesson.id, 'Stage:', stageIdx);
    setActiveLesson(lesson);
    setActiveLessonStage(stageIdx);
    setMode('lesson');

    const stages = lesson.stages || [];
    const currentStage = stages[stageIdx - 1];
    const stageWords = currentStage ? currentStage.words : lesson.words;

    setActiveSnippetTitle(lesson.title);
    setActiveSnippetSub(currentStage ? `${currentStage.title} — ${currentStage.description}` : lesson.description);
    setWords(buildWordStates(stageWords));
    setCurrentWordIndex(0);
    setCurrentInput('');
    setIsMismatch(false);
    setCorrectWordsCount(0);
    setIncorrectWordsCount(0);
    setTestStatus('idle');
    setStartTime(null);
    setElapsedSeconds(0);
    setTimeLeft(120);
    setLiveWpm(0);
    setLiveAccuracy(100);
    setLiveStreak(0);
    setLessonMistakes(0);
    setIsLessonFailed(false);
    setHistory([]);
    setTestResult(null);

    sessionKeyStats.current = {};
    currentSecondErrors.current = 0;
    totalCorrectCharsRef.current = 0;
    totalIncorrectCharsRef.current = 0;

    setActiveTab('test');
  };

  // ─── SaaS Monetization & Focus Battery Handlers ───────────────────────────
  const handleUpgradeToSuper = (isFreeTrial: boolean = false) => {
    if (isFreeTrial) {
      console.debug('[TypeFlow:Microsite] Redirecting free trial request to checkout');
      handleGoToCheckout('super_trial');
      return;
    }
    setProfile((prev) => {
      const remainingGems = Math.max(0, (prev.gems || 0) - 400);
      const updated: UserProfile = {
        ...prev,
        gems: remainingGems,
        isPremium: true,
        subscriptionStatus: 'active',
        subscriptionPlan: 'monthly',
        energy: 5,
        maxEnergy: 5,
        hearts: 5,
      };
      try { localStorage.setItem('tf_user_profile', JSON.stringify(updated)); } catch {}
      console.debug('[TypeFlow:Microsite] Upgraded to Super TypeFlow Pro via 400 Gems!');
      return updated;
    });
    setIsSuperModalOpen(false);
    addToast(isTr ? '👑 400 Elmas ile Super TypeFlow Pro aktif edildi!' : '👑 Super TypeFlow Pro activated with 400 Gems!', 'success');
  };

  const handleGoToCheckout = (packageId: string = 'super_yearly') => {
    setSelectedCheckoutPkgId(packageId);
    setActiveTab('checkout');
    setIsSuperModalOpen(false);
  };

  const handleCheckoutPaymentSuccess = (pkg: CheckoutPackage, details?: PaymentDetails) => {
    console.debug('[TypeFlow:Microsite] Checkout payment verified for:', pkg.id, 'isTrial:', pkg.isTrial);
    const now = Date.now();
    const isTrialPkg = !!pkg.isTrial || pkg.id === 'super_trial';
    const trialDurationMs = 7 * 24 * 60 * 60 * 1000;

    setProfile((prev) => {
      const updated: UserProfile = {
        ...prev,
        gems: Math.max(0, (prev.gems || 0) + (pkg.gemsReward || 0)),
        streakFreezes: (prev.streakFreezes || 0) + (pkg.freezesReward || 0),
        energy: pkg.energyReward || pkg.isSuper ? 5 : (prev.energy ?? 5),
        hearts: pkg.energyReward || pkg.isSuper ? 5 : (prev.hearts ?? 5),
        isPremium: pkg.isSuper ? true : prev.isPremium,
        subscriptionStatus: isTrialPkg ? 'trialing' : (pkg.isSuper ? 'active' : prev.subscriptionStatus || 'free'),
        subscriptionPlan: isTrialPkg ? 'trial' : (pkg.id === 'super_monthly' ? 'monthly' : (pkg.id === 'super_yearly' ? 'yearly' : prev.subscriptionPlan)),
        trialStartedAt: isTrialPkg ? new Date(now).toISOString() : prev.trialStartedAt,
        trialEndsAt: isTrialPkg ? new Date(now + trialDurationMs).toISOString() : prev.trialEndsAt,
        premiumExpiresAt: isTrialPkg ? new Date(now + trialDurationMs).toISOString() : (pkg.isSuper ? new Date(now + 365 * 24 * 60 * 60 * 1000).toISOString() : prev.premiumExpiresAt),
        paymentMethodBrand: details?.brand || 'visa',
        paymentMethodLast4: details?.last4 || '4242',
        lastOrderId: `TF-${now.toString().slice(-8)}`,
      };
      try { localStorage.setItem('tf_user_profile', JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (isTrialPkg) {
      addToast(
        isTr
          ? '✨ 7 Günlük Deneme Sürümü Başlatıldı! Sınırsız Enerji ve Sıfır Reklam aktif.'
          : '✨ 7-Day Free Trial Started! Unlimited Energy & Zero Ads active.',
        'success'
      );
    } else if (pkg.isSuper) {
      addToast(
        isTr
          ? '👑 Super TypeFlow Pro Aktif Edildi! Teşekkür ederiz.'
          : '👑 Super TypeFlow Pro Activated! Thank you.',
        'success'
      );
    } else {
      addToast(
        isTr
          ? `✓ ${pkg.nameTr} başarıyla hesabınıza tanımlandı!`
          : `✓ ${pkg.nameEn} successfully added to your account!`,
        'success'
      );
    }
    setActiveTab('test');
  };

  // Check return from Stripe Checkout / Hosted Gateway Callback
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment_status');
      const sessionId = urlParams.get('session_id');
      const pkgId = urlParams.get('package_id') || 'super_yearly';

      if (paymentStatus === 'success' || sessionId) {
        console.debug('[TypeFlow:Payment] Detected return from Stripe Checkout session:', sessionId, 'package:', pkgId);
        const matchedPkg = CHECKOUT_PACKAGES.find((p) => p.id === pkgId) || CHECKOUT_PACKAGES[1];
        handleCheckoutPaymentSuccess(matchedPkg, {
          brand: 'stripe',
          last4: sessionId ? sessionId.slice(-4) : 'live',
        });
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } catch (err) {
      console.error('[TypeFlow:Payment] Error parsing payment callback params:', err);
    }
  }, []);

  const handleCancelSubscription = () => {
    setProfile((prev) => {
      const updated: UserProfile = {
        ...prev,
        isPremium: false,
        subscriptionStatus: 'cancelled',
        energy: 5,
        hearts: 5,
      };
      try { localStorage.setItem('tf_user_profile', JSON.stringify(updated)); } catch {}
      console.debug('[TypeFlow:Microsite] Subscription cancelled.');
      return updated;
    });
    addToast(
      isTr
        ? 'Aboneliğiniz iptal edildi. Ücretsiz plana geçildi.'
        : 'Your subscription has been cancelled. Reverted to free tier.',
      'info'
    );
  };

  const handleClaimEnergyReward = () => {
    setProfile((prev) => {
      const currentEnergy = prev.energy ?? prev.hearts ?? 0;
      const newEnergy = Math.min(5, currentEnergy + 2);
      const updated: UserProfile = {
        ...prev,
        energy: newEnergy,
        hearts: newEnergy,
        gems: (prev.gems || 0) + 15,
      };
      try { localStorage.setItem('tf_user_profile', JSON.stringify(updated)); } catch {}
      console.debug('[TypeFlow:Microsite] Recharged +2 Focus Energy & +15 Gems via Tech Sponsor');
      return updated;
    });
    setIsAdBreakModalOpen(false);
  };

  const handleClaimGoogleAdReward = (energyAmount: number, gemAmount: number) => {
    setProfile((prev) => {
      const currentEnergy = prev.energy ?? prev.hearts ?? 0;
      const newEnergy = Math.min(5, currentEnergy + energyAmount);
      const updated: UserProfile = {
        ...prev,
        energy: newEnergy,
        hearts: newEnergy,
        gems: (prev.gems || 0) + gemAmount,
      };
      try { localStorage.setItem('tf_user_profile', JSON.stringify(updated)); } catch {}
      console.debug('[TypeFlow:GoogleAd] Claimed ad reward:', { energy: newEnergy, gems: updated.gems });
      return updated;
    });
  };

  const handleTriggerAdBreak = () => {
    if (profile.isPremium) return;
    const ads = getTechAds(lang);
    setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    setIsAdBreakModalOpen(true);
  };

  // ─── 4. Finish Test & Duolingo Progression (XP, Gems, Energy, Heatmap) ─────
  const finishTest = useCallback((finalElapsedSeconds: number) => {
    console.debug('[TypeFlow:Microsite] Finishing test, elapsed:', finalElapsedSeconds);

    const seconds = Math.max(finalElapsedSeconds, 1);
    const minutes = seconds / 60;
    const correctChars = totalCorrectCharsRef.current;
    const incorrectChars = totalIncorrectCharsRef.current;
    const totalTyped = correctChars + incorrectChars;

    const finalWpm = Math.round((correctChars / 5) / minutes);
    const finalRaw = Math.round((totalTyped / 5) / minutes);
    const finalAcc = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 1000) / 10 : 100;
    const finalCpm = Math.round(correctChars / minutes);

    let consistency = 100;
    if (history.length > 2) {
      const wpms = history.map((h) => h.wpm);
      const avg = wpms.reduce((a, b) => a + b, 0) / wpms.length;
      const variance = wpms.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / wpms.length;
      const stdDev = Math.sqrt(variance);
      consistency = Math.max(0, Math.min(100, Math.round(100 - (stdDev / (avg || 1)) * 50)));
    }

    // Duolingo Progression & Gems Calculation
    const isLesson = mode === 'lesson' && Boolean(activeLesson);
    let earnedXp = Math.round(finalWpm * 1.5 + (finalAcc >= 95 ? 40 : 20));
    let earnedGems = 1; // Base gems for completing any drill (strictly scarce economy)
    let stars = 0;

    // High accuracy bonus gems
    if (finalAcc >= 98) {
      earnedGems += 1;
    }

    // Personal Best bonus gems
    const isPb = finalWpm > profile.topWpm && profile.topWpm > 0;
    if (isPb) {
      earnedGems += 2;
    }

    if (isLesson && activeLesson) {
      const totalStages = activeLesson.stages && activeLesson.stages.length > 0 ? activeLesson.stages.length : 1;
      const currentStage = activeLesson.stages?.[activeLessonStage - 1];
      const targetMinWpm = currentStage ? currentStage.minWpm : activeLesson.minWpm;
      const targetMinAcc = currentStage ? currentStage.minAccuracy : activeLesson.minAccuracy;
      const passed = finalWpm >= targetMinWpm && finalAcc >= targetMinAcc;

      console.debug('[TypeFlow:Lesson] Finishing lesson test:', {
        lessonId: activeLesson.id,
        stage: activeLessonStage,
        totalStages,
        finalWpm,
        finalAcc,
        targetMinWpm,
        targetMinAcc,
        passed,
      });

      // Lesson Completion Logic:
      // Completing all words of a lesson awards completion and at least 1 star!
      stars = 1;
      if (finalWpm >= targetMinWpm && finalAcc >= targetMinAcc) {
        stars = 2;
      }
      if (finalWpm >= targetMinWpm + 5 && finalAcc >= 94) {
        stars = 3;
      }
      earnedXp = activeLesson.xpReward * (profile.isPremium ? 2 : 1);
      earnedGems += activeLesson.gemReward;
      console.debug('[TypeFlow:Lesson] Full lesson completed! Stars awarded:', stars, 'XP:', earnedXp, 'Gems:', earnedGems);
    } else {
      // Audit Fix #3: Add drill-specific rewards from activeDrillConfig
      if (activeDrillConfig) {
        earnedXp += (activeDrillConfig.xpReward || 0);
        earnedGems += (activeDrillConfig.gemReward || 0);
        console.debug('[TypeFlow:DrillReward] Drill bonus applied:', { xp: activeDrillConfig.xpReward, gems: activeDrillConfig.gemReward });
      }
      if (profile.isPremium) {
        earnedXp *= 2; // Super TypeFlow 2X XP boost on all tests
      }
    }

    const newTotalTests = profile.totalTests + 1;
    const newTopWpm = Math.max(profile.topWpm, finalWpm);
    const newAvgWpm = Math.round((profile.avgWpm * profile.totalTests + finalWpm) / newTotalTests);

    const today = new Date().toISOString().split('T')[0];
    let newStreak = profile.streakDays;
    let newDailyTests = profile.dailyTestsCompleted;

    if (profile.lastActiveDate !== today) {
      newDailyTests = 1;
      newStreak += 1;
    } else {
      newDailyTests += 1;
    }

    const newXp = profile.xp + earnedXp;
    const xpForNextLevel = profile.level * 200;
    const newLevel = newXp >= xpForNextLevel ? profile.level + 1 : profile.level;
    const newGems = (profile.gems || 0) + earnedGems;
    const newWeeklyXp = (profile.weeklyXp || 0) + earnedXp;

    // Audit Fix #10: Level-Up Celebration
    if (newLevel > profile.level) {
      setShowLevelUp({ from: profile.level, to: newLevel });
      addToast(
        lang === 'tr'
          ? `🎉 SEVİYE ATLADIN! Seviye ${newLevel}'e yükseldin!`
          : `🎉 LEVEL UP! You reached Level ${newLevel}!`,
        'success'
      );
    }

    // Record lesson completion whenever lesson test is completed
    const newCompletedLessons = { ...(profile.completedLessons || {}) };
    if (isLesson && activeLesson && stars > 0) {
      newCompletedLessons[activeLesson.id] = Math.max(newCompletedLessons[activeLesson.id] || 0, stars);
      console.debug('[TypeFlow:Lesson] Saved completion for lesson:', activeLesson.id, 'Stars:', newCompletedLessons[activeLesson.id]);
    }

    // Merge session keyStats into lifetime heatmap
    const mergedKeyStats = { ...profile.keyStats };
    for (const [k, v] of Object.entries(sessionKeyStats.current)) {
      if (!mergedKeyStats[k]) {
        mergedKeyStats[k] = { count: v.count, errors: v.errors };
      } else {
        mergedKeyStats[k] = {
          count: mergedKeyStats[k].count + v.count,
          errors: mergedKeyStats[k].errors + v.errors,
        };
      }
    }

    const updatedProfile: UserProfile = {
      ...profile,
      level: newLevel,
      xp: newXp,
      weeklyXp: newWeeklyXp,
      gems: newGems,
      streakDays: newStreak,
      lastActiveDate: today,
      dailyTestsCompleted: newDailyTests,
      totalTests: newTotalTests,
      avgWpm: newAvgWpm,
      topWpm: newTopWpm,
      keyStats: mergedKeyStats,
      completedLessons: newCompletedLessons,
    };

    handleProfileUpdate(updatedProfile);

    // Sync real test score to Supabase and local community store for live leagues
    (async () => {
      try {
        await supabase.from('typeflow_scores').insert({
          username: profile.username || 'Anonim Daktilocu',
          avatar: profile.avatar || '⚡',
          wpm: finalWpm,
          accuracy: finalAcc,
          mode: mode === 'words' ? 'Kelimeler' : mode === 'story' ? 'Hikaye' : mode === 'dev' ? 'Kod/CLI' : 'Ders',
          created_at: new Date().toISOString(),
        });
        console.debug('[TypeFlow:Leagues] Synced test score to Supabase');
      } catch (err) {
        console.debug('[TypeFlow:Leagues] Supabase sync notice:', err);
      }
    })();

    // Record telemetry event for project analytics (Guest & Authenticated)
    recordProjectEvent({
      projectSlug: 'typeflow',
      event_type: 'test_complete',
      event_name: `Daktilo Testi Tamamlandı: ${finalWpm} WPM (%${finalAcc})`,
      is_guest: profile.isGuest,
      user_identifier: profile.username || (profile.isGuest ? 'Misafir Daktilocu' : 'Kullanıcı'),
      metadata: {
        wpm: finalWpm,
        accuracy: finalAcc,
        mode: mode === 'words' ? 'Kelimeler' : mode === 'story' ? 'Hikaye' : mode === 'dev' ? 'Kod/CLI' : 'Ders',
        earnedXp,
        earnedGems,
      },
    });

    try {
      const communityStr = localStorage.getItem('tf_community_league_members');
      const list = communityStr ? JSON.parse(communityStr) : [];
      const existingIdx = list.findIndex((item: any) => item.username === profile.username);
      if (existingIdx >= 0) {
        list[existingIdx].weeklyXp = newWeeklyXp;
        list[existingIdx].avatar = profile.avatar || '⚡';
      } else {
        list.push({
          id: profile.id,
          username: profile.username,
          avatar: profile.avatar || '⚡',
          weeklyXp: newWeeklyXp,
          rank: 1,
        });
      }
      localStorage.setItem('tf_community_league_members', JSON.stringify(list));
    } catch {}

    const resultObj: TestResult = {
      wpm: finalWpm,
      rawWpm: finalRaw,
      accuracy: finalAcc,
      cpm: finalCpm,
      consistency,
      elapsedSeconds: Math.round(seconds),
      totalChars: totalTyped,
      correctChars,
      incorrectChars,
      extraChars: 0,
      missedChars: 0,
      correctWords: correctWordsCount,
      incorrectWords: incorrectWordsCount,
      mode,
      modeConfig: mode === 'words' ? `${wordModeType}:${wordCount || timeLimit}` : mode,
      theme,
      history,
      keyStats: sessionKeyStats.current,
      isPersonalBest: finalWpm > profile.topWpm && profile.topWpm > 0,
      timestamp: Date.now(),
      lessonId: activeLesson?.id,
      earnedXp,
      earnedGems,
      stars,
    };

    setTestResult(resultObj);
    setTestStatus('completed');
  }, [
    currentWordIndex,
    words,
    history,
    profile,
    correctWordsCount,
    incorrectWordsCount,
    mode,
    wordModeType,
    wordCount,
    timeLimit,
    theme,
    activeLesson,
    activeLessonStage,
    handleProfileUpdate,
    addToast,
    lang,
    activeDrillConfig,
  ]);

  // ─── 5. Live Timer & Metric Interval ─────────────────────────────────────────
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (testStatus === 'running') {
      interval = setInterval(() => {
        if (!startTime) return;
        const now = Date.now();
        const currentElapsed = (now - startTime) / 1000;
        const roundedElapsed = Math.floor(currentElapsed);

        setElapsedSeconds(roundedElapsed);

        if (mode === 'words' && wordModeType === 'time') {
          const remaining = Math.max(0, timeLimit - roundedElapsed);
          setTimeLeft(remaining);
          if (remaining <= 0) {
            finishTest(currentElapsed);
            return;
          }
        }

        const mins = currentElapsed / 60;
        const currentCorrectChars = totalCorrectCharsRef.current;
        const currentTotalTyped = currentCorrectChars + totalIncorrectCharsRef.current;

        const liveWpmVal = mins > 0 ? Math.round((currentCorrectChars / 5) / mins) : 0;
        const rawWpmVal = mins > 0 ? Math.round((currentTotalTyped / 5) / mins) : 0;
        const liveAccVal = currentTotalTyped > 0 ? Math.round((currentCorrectChars / currentTotalTyped) * 1000) / 10 : 100;

        setLiveWpm(liveWpmVal);
        setLiveAccuracy(liveAccVal);

        setHistory((prev) => [
          ...prev,
          {
            second: roundedElapsed,
            wpm: liveWpmVal,
            rawWpm: rawWpmVal,
            errors: currentSecondErrors.current,
          },
        ]);
        currentSecondErrors.current = 0;
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [testStatus, startTime, mode, wordModeType, timeLimit, finishTest]);

  // ─── 6. Real-Time Typing Input Handling ────────────────────────────────────
  const handleInputChange = (val: string) => {
    if (testStatus === 'completed') return;

    if (testStatus === 'idle') {
      setTestStatus('running');
      setStartTime(Date.now());
      console.debug('[TypeFlow:Microsite] Test started');
    }

    if (val.endsWith(' ')) {
      handleSpaceSubmit(val.slice(0, -1));
      return;
    }

    setCurrentInput(val);

    const currentWord = words[currentWordIndex];
    if (!currentWord) return;

    const target = currentWord.original;
    // In practice modes, casing and punctuation are optional/lenient by default
    const isLenient = mode !== 'lesson';
    const normVal = isLenient ? normalizeWord(val, caseSensitive, includePunctuation) : val;
    const normTarget = isLenient ? normalizeWord(target, caseSensitive, includePunctuation) : target;
    const isPrefixMismatch = !normTarget.startsWith(normVal);
    setIsMismatch(isPrefixMismatch);

    // Record character hit in heatmap
    if (val.length > 0) {
      const lastChar = val[val.length - 1].toLowerCase();
      const targetChar = target[val.length - 1]?.toLowerCase();
      const isCharError = lastChar !== targetChar;

      const stat = sessionKeyStats.current[lastChar] || { count: 0, errors: 0 };
      sessionKeyStats.current[lastChar] = {
        count: stat.count + 1,
        errors: stat.errors + (isCharError ? 1 : 0),
      };

      soundEngine.playKey(false, isCharError);
    }

    // Auto-complete immediately if user types the final character of the last word correctly
    const isLastWord = currentWordIndex === words.length - 1;
    if (isLastWord && normVal === normTarget) {
      console.debug('[TypeFlow:Engine] Final word matched without space, auto-submitting');
      handleSpaceSubmit(val);
      return;
    }
  };

  const handleSpaceSubmit = (submittedVal?: string) => {
    if (testStatus === 'completed' || words.length === 0) return;

    const val = (submittedVal ?? currentInput).trim();
    if (!val) return;

    const currentWord = words[currentWordIndex];
    const target = currentWord.original;
    const isLenient = mode !== 'lesson';
    const normVal = isLenient ? normalizeWord(val, caseSensitive, includePunctuation) : val;
    const normTarget = isLenient ? normalizeWord(target, caseSensitive, includePunctuation) : target;
    const isCorrect = normVal === normTarget;

    const newWords = [...words];
    const updatedWord: WordState = {
      ...currentWord,
      isComplete: true,
      isCurrent: false,
      hasError: !isCorrect,
      isCorrect,
      typedValue: val,
    };
    newWords[currentWordIndex] = updatedWord;

    const spaceStat = sessionKeyStats.current['space'] || { count: 0, errors: 0 };
    sessionKeyStats.current['space'] = {
      count: spaceStat.count + 1,
      errors: spaceStat.errors + (isCorrect ? 0 : 1),
    };

    if (isCorrect) {
      setCorrectWordsCount((c) => c + 1);
      totalCorrectCharsRef.current += target.length + 1;
      setLiveStreak((s) => s + 1);
      soundEngine.playKey(true, false);
    } else {
      setIncorrectWordsCount((c) => c + 1);
      totalIncorrectCharsRef.current += Math.max(val.length, target.length) + 1;
      currentSecondErrors.current += 1;
      setLiveStreak(0);
      soundEngine.playKey(true, true);

      if (mode === 'lesson') {
        setLessonMistakes((m) => m + 1);
      }
    }

    setCurrentInput('');
    setIsMismatch(false);

    const nextIndex = currentWordIndex + 1;
    if (nextIndex >= words.length) {
      setWords(newWords);
      const seconds = startTime ? (Date.now() - startTime) / 1000 : 1;
      finishTest(seconds);
    } else {
      newWords[nextIndex] = { ...newWords[nextIndex], isCurrent: true };
      setWords(newWords);
      setCurrentWordIndex(nextIndex);
    }
  };

  const handleBackspaceEmpty = () => {
    if (testStatus === 'completed' || currentWordIndex === 0) return;

    const prevIndex = currentWordIndex - 1;
    const prevWord = words[prevIndex];
    if (!prevWord) return;

    const newWords = [...words];
    newWords[currentWordIndex] = { ...words[currentWordIndex], isCurrent: false };
    newWords[prevIndex] = {
      ...prevWord,
      isCurrent: true,
      isComplete: false,
    };

    if (prevWord.isCorrect) {
      setCorrectWordsCount((c) => Math.max(0, c - 1));
      totalCorrectCharsRef.current = Math.max(0, totalCorrectCharsRef.current - (prevWord.original.length + 1));
    } else {
      setIncorrectWordsCount((c) => Math.max(0, c - 1));
      totalIncorrectCharsRef.current = Math.max(0, totalIncorrectCharsRef.current - ((prevWord.typedValue?.length || prevWord.original.length) + 1));
    }

    setWords(newWords);
    setCurrentWordIndex(prevIndex);
    setCurrentInput(prevWord.typedValue || '');
    setIsMismatch(false);
  };

  // ─── 7. Shop & Quests Actions ──────────────────────────────────────────────
  const handleBuyItem = (item: ShopItem) => {
    setProfile((prev) => {
      const currentGems = Math.max(0, prev.gems || 0);
      if (currentGems < item.cost) {
        console.debug('[TypeFlow:Shop] Purchase blocked: insufficient gems', { currentGems, cost: item.cost });
        return prev;
      }
      const remainingGems = Math.max(0, currentGems - item.cost);
      let updated = { ...prev, gems: remainingGems };

      if (item.id === 'streak-freeze') {
        updated.streakFreezes = (prev.streakFreezes || 0) + 1;
      } else if (item.id === 'refill-energy' || item.id === 'refill-hearts') {
        updated.energy = 5;
        updated.hearts = 5;
      } else if (item.id === 'super-typeflow') {
        updated.isPremium = true;
        updated.energy = 5;
        updated.hearts = 5;
      } else if (item.category === 'theme' && item.value) {
        updated.unlockedThemes = Array.from(new Set([...(prev.unlockedThemes || []), item.value]));
        setTheme(item.value as TypeFlowTheme);
      } else if (item.category === 'sound' && item.value) {
        updated.unlockedSounds = Array.from(new Set([...(prev.unlockedSounds || []), item.value]));
        setSound(item.value as SoundType);
      }

      try { localStorage.setItem('tf_user_profile', JSON.stringify(updated)); } catch {}
      console.debug('[TypeFlow:Shop] Item purchased:', item.id);
      return updated;
    });
  };

  const handleClaimQuest = (questId: string, xpReward: number, gemReward: number) => {
    setProfile((prev) => {
      const updated: UserProfile = {
        ...prev,
        xp: prev.xp + xpReward,
        weeklyXp: (prev.weeklyXp || 0) + xpReward,
        gems: (prev.gems || 0) + gemReward,
        claimedQuests: Array.from(new Set([...(prev.claimedQuests || []), questId])),
      };
      try { localStorage.setItem('tf_user_profile', JSON.stringify(updated)); } catch {}
      console.debug('[TypeFlow:Quests] Quest claimed:', questId);
      return updated;
    });
  };

  const isTr = lang === 'tr';

  const modeLabel = mode === 'lesson'
    ? (activeLesson?.title || (isTr ? 'Akademi Dersi' : 'Academy Lesson'))
    : (mode === 'words'
        ? (wordModeType === 'words' ? (isTr ? `Sık Kullanılan ${wordCount} Kelime` : `Common ${wordCount} Words`) : (isTr ? `Sık Kullanılan Kelimeler (${timeLimit}s)` : `Common Words (${timeLimit}s)`))
        : (mode === 'story'
            ? (activeSnippetTitle || (isTr ? 'Dinamik Hikaye Modu' : 'Dynamic Story Mode'))
            : (activeSnippetTitle || (isTr ? 'PowerShell & Terminal Kodları' : 'PowerShell & CLI Code'))));

  return (
    <div className={`typeflow-microsite theme-${theme}`}>
      {/* 1. Duolingo SaaS Streamlined Header Bar */}
      <TypeFlowHeader
        lang={lang}
        theme={theme}
        sound={sound}
        activeTab={activeTab}
        profile={profile}
        onThemeChange={handleThemeChange}
        onSoundChange={handleSoundChange}
        onTabChange={(tab) => {
          if (tab === 'test' && (mode === 'lesson' || testStatus === 'completed')) {
            setActiveLesson(null);
            setMode('words');
            setPracticeSubView('hub');
            setTestStatus('idle');
            setIsLessonFailed(false);
          } else if (tab === 'path') {
            setActiveLesson(null);
            setMode('words');
            setTestStatus('idle');
            setIsLessonFailed(false);
          }
          setActiveTab(tab);
        }}
        onOpenAuth={() => setIsProfileDrawerOpen(true)}
        onOpenSettings={() => setIsProfileDrawerOpen(true)}
        onOpenProfileDrawer={() => setIsProfileDrawerOpen(true)}
        onLangChange={handleLangChange}
        onOpenSuperModal={() => setIsSuperModalOpen(true)}
        onOpenAdModal={handleTriggerAdBreak}
      />

      {/* 2. TAB: Daktilo Akademisi (Learn Path) */}
      {activeTab === 'path' && (
        <main className="tf-main-wrapper">
          <TypeFlowLearnPath
            lang={lang}
            profile={profile}
            onStartLesson={handleStartLesson}
            onOpenShop={() => setActiveTab('shop')}
            onOpenSuperModal={() => setIsSuperModalOpen(true)}
            onOpenAdModal={handleTriggerAdBreak}
          />
          <TypeFlowGoogleAd
            lang={lang}
            profile={profile}
            onRewardClaim={handleClaimGoogleAdReward}
            onOpenSuperModal={() => setIsSuperModalOpen(true)}
          />
        </main>
      )}

      {/* 3. TAB: Duolingo Ligleri (Leagues) */}
      {activeTab === 'leagues' && (
        <main className="tf-main-wrapper">
          <TypeFlowLeagues
            lang={lang}
            profile={profile}
            onBackToTest={() => setActiveTab('test')}
          />
          <TypeFlowGoogleAd
            lang={lang}
            profile={profile}
            onRewardClaim={handleClaimGoogleAdReward}
            onOpenSuperModal={() => setIsSuperModalOpen(true)}
          />
        </main>
      )}

      {/* 4. TAB: Günlük Görevler & Başarımlar (Quests) */}
      {activeTab === 'quests' && (
        <main className="tf-main-wrapper">
          <TypeFlowQuests
            lang={lang}
            profile={profile}
            onClaimQuest={handleClaimQuest}
            onOpenSuperModal={() => setIsSuperModalOpen(true)}
          />
        </main>
      )}

      {/* 5. TAB: Duolingo Mağazası (Shop) */}
      {activeTab === 'shop' && (
        <main className="tf-main-wrapper">
          <TypeFlowShop
            lang={lang}
            profile={profile}
            onBuyItem={handleBuyItem}
            onSelectTheme={handleThemeChange}
            onSelectSound={handleSoundChange}
            onProfileUpdate={handleProfileUpdate}
            onOpenSuperModal={() => setIsSuperModalOpen(true)}
            onOpenAdModal={handleTriggerAdBreak}
            onGoToCheckout={handleGoToCheckout}
          />
        </main>
      )}

      {/* 5.5 TAB: Güvenli Ödeme & Checkout Sayfası (Dedicated SaaS Gateway) */}
      {activeTab === 'checkout' && (
        <main className="tf-main-wrapper" style={{ maxWidth: '1120px' }}>
          <TypeFlowCheckoutPage
            lang={lang}
            profile={profile}
            initialPackageId={selectedCheckoutPkgId}
            onPaymentSuccess={handleCheckoutPaymentSuccess}
            onReturnToShop={() => setActiveTab('shop')}
          />
        </main>
      )}

      {/* 6. TAB: Profil & Klavye Isı Haritası */}
      {activeTab === 'profile' && (
        <main className="tf-main-wrapper">
          <TypeFlowProfileView
            lang={lang}
            profile={profile}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onBackToTest={() => setActiveTab('test')}
          />
          <TypeFlowGoogleAd
            lang={lang}
            profile={profile}
            onRewardClaim={handleClaimGoogleAdReward}
            onOpenSuperModal={() => setIsSuperModalOpen(true)}
          />
        </main>
      )}

      {/* 7. TAB: Serbest Yazı & Akademi Dersi Ekranı (Practice / Test) */}
      {activeTab === 'test' && (() => {
        const allUnits = getUnitsForLang(lang);
        const allLessons = allUnits.flatMap((u) => u.lessons);
        const currentLessonIndex = activeLesson ? allLessons.findIndex((l) => l.id === activeLesson.id) : -1;
        const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
        const nextLesson = currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

        // When in free practice and user is on the Hub view
        if (mode !== 'lesson' && practiceSubView === 'hub' && testStatus !== 'running') {
          return (
            <main className="tf-main-wrapper">
              <TypeFlowPracticeHub
                lang={lang}
                profile={profile}
                onLaunchDrill={(config: PracticeDrillConfig) => {
                  // Audit Fix #1 & #3: Store drill config, set mode/settings, then
                  // let initializeTest generate words UNLESS drill provides custom words.
                  setActiveDrillConfig(config); // Save for reward tracking in finishTest
                  setMode(config.mode);
                  if (config.timeLimit) {
                    setWordModeType('time');
                    setTimeLimit(config.timeLimit as TimeOption);
                  } else if (config.wordCount) {
                    setWordModeType('words');
                    setWordCount(config.wordCount as WordCountOption);
                  }
                  if (config.caseSensitive !== undefined) {
                    setCaseSensitive(config.caseSensitive);
                  }
                  if (config.includePunctuation !== undefined) {
                    setIncludePunctuation(config.includePunctuation);
                  }
                  setPracticeSubView('typing');
                  // If drill provides custom words (e.g. thematic), use them directly
                  // instead of calling initializeTest which would overwrite them
                  if (config.generatedWords && config.generatedWords.length > 0) {
                    setActiveSnippetTitle(config.title);
                    setActiveSnippetSub(
                      isTr
                        ? `⚡ Antrenman Arenası: +${config.xpReward} XP, +${config.gemReward} 💎`
                        : `⚡ Training Dojo: +${config.xpReward} XP, +${config.gemReward} 💎`
                    );
                    setWords(buildWordStates(config.generatedWords));
                    setCurrentWordIndex(0);
                    setCurrentInput('');
                    setIsMismatch(false);
                    setCorrectWordsCount(0);
                    setIncorrectWordsCount(0);
                    setTestStatus('idle');
                    setStartTime(null);
                    setElapsedSeconds(0);
                    setTimeLeft(config.timeLimit || 60);
                    setLiveWpm(0);
                    setLiveAccuracy(100);
                    setLiveStreak(0);
                    setLessonMistakes(0);
                    setIsLessonFailed(false);
                    setHistory([]);
                    setTestResult(null);
                    sessionKeyStats.current = {};
                    currentSecondErrors.current = 0;
                    totalCorrectCharsRef.current = 0;
                    totalIncorrectCharsRef.current = 0;
                  } else {
                    // No custom words — let initializeTest generate them
                    initializeTest();
                  }
                }}
                onOpenAdModal={handleTriggerAdBreak}
              />
              <TypeFlowGoogleAd
                lang={lang}
                profile={profile}
                onRewardClaim={handleClaimGoogleAdReward}
                onOpenSuperModal={() => setIsSuperModalOpen(true)}
              />
            </main>
          );
        }

        return (
          <>
            {/* Mode Controls Bar (Visible only in free practice, not in active lesson) */}
            {testStatus !== 'completed' && mode !== 'lesson' && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.85rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="tf-ctrl-btn tf-btn-pushable"
                  onClick={() => setPracticeSubView('hub')}
                  style={{ background: 'var(--tf-surface-elevated)', borderColor: 'var(--tf-accent)', color: 'var(--tf-accent)', fontWeight: 700 }}
                  title={isTr ? "Pratik Arenası Menüsüne Dön" : "Back to Practice Hub"}
                >
                  ⚡ {isTr ? 'Pratik Menüsü' : 'Practice Hub'}
                </button>
                <TypeFlowControls
                  lang={lang}
                  mode={mode}
                  wordCount={wordCount}
                  timeLimit={timeLimit}
                  wordModeType={wordModeType}
                  caseSensitive={caseSensitive}
                  includePunctuation={includePunctuation}
                  onModeChange={(m) => setMode(m)}
                  onWordCountChange={setWordCount}
                  onTimeLimitChange={setTimeLimit}
                  onWordModeTypeChange={setWordModeType}
                  onToggleCaseSensitive={() => setCaseSensitive((c) => !c)}
                  onTogglePunctuation={() => setIncludePunctuation((p) => !p)}
                />
              </div>
            )}

            <main className="tf-main-wrapper">
              {testStatus === 'completed' && isLessonFailed ? (
                <>
                  <div className="tf-lesson-failed-card" style={{ maxWidth: '560px', margin: '2rem auto', background: 'var(--tf-surface)', border: '1.5px solid #ef4444', borderRadius: '16px', padding: '2rem', textAlign: 'center', boxShadow: '0 15px 40px rgba(239, 68, 68, 0.2)' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>💔</div>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ef4444', margin: '0 0 0.5rem 0' }}>
                      {isTr ? 'DERS BAŞARISIZ OLDU' : 'LESSON FAILED'}
                    </h3>
                    <p style={{ color: 'var(--tf-text-secondary)', fontSize: '0.92rem', margin: '0 0 1.5rem 0' }}>
                      {isTr
                        ? '3 hata sınırına ulaştınız! Kas hafızanızı pekiştirmek için dersi tekrar deneyebilir veya mağazadan enerji yenileyebilirsiniz.'
                        : 'You reached the 3-mistake limit! Practice again to build muscle memory or recharge in shop.'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                      <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem 1.25rem', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 800, fontFamily: 'var(--tf-font-mono)' }}>{isTr ? 'HATA SAYISI' : 'MISTAKES'}</span>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ef4444' }}>3 / 3 ✗</div>
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.75rem 1.25rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--tf-text-secondary)', fontWeight: 800, fontFamily: 'var(--tf-font-mono)' }}>{isTr ? 'KALAN ENERJİ' : 'FOCUS ENERGY'}</span>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981' }}>
                          {profile.isPremium ? '♾️' : `${profile.energy ?? profile.hearts ?? 0}/5 🔋`}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="tf-btn-primary tf-btn-pushable"
                        onClick={() => {
                          if (activeLesson) handleStartLesson(activeLesson, activeLessonStage);
                        }}
                        style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                      >
                        ↺ {isTr ? 'Dersi Tekrar Dene' : 'Try Again'}
                      </button>
                      <button
                        type="button"
                        className="tf-ctrl-btn tf-btn-pushable"
                        onClick={() => {
                          setActiveLesson(null);
                          setTestStatus('idle');
                          setMode('words');
                          setIsLessonFailed(false);
                          setActiveTab('path');
                        }}
                        style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                      >
                        🗺️ {isTr ? 'Akademiye Dön' : 'Back to Academy'}
                      </button>
                      {(profile.energy ?? profile.hearts ?? 5) <= 1 && !profile.isPremium && (
                        <button
                          type="button"
                          className="tf-btn-pushable"
                          onClick={() => setActiveTab('shop')}
                          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
                        >
                          ⚡ {isTr ? 'Enerji Doldur' : 'Refill Energy'}
                        </button>
                      )}
                    </div>
                  </div>
                  <TypeFlowGoogleAd
                    lang={lang}
                    profile={profile}
                    onRewardClaim={handleClaimGoogleAdReward}
                    onOpenSuperModal={() => setIsSuperModalOpen(true)}
                  />
                </>
              ) : testStatus === 'completed' && testResult ? (
                <>
                  <TypeFlowResults
                    lang={lang}
                    result={testResult}
                    activeLesson={activeLesson}
                    onRestart={initializeTest}
                    onReturnToProjects={() => router.push(`/${lang}/projects`)}
                    onViewLeaderboard={() => setActiveTab('leagues')}
                    onReturnToPath={() => {
                      console.debug('[TypeFlow:Microsite] Returning to Learn Path from Results HUD');
                      setActiveLesson(null);
                      setMode('words');
                      setTestStatus('idle');
                      setIsLessonFailed(false);
                      setActiveTab('path');
                    }}
                    onPrevLesson={prevLesson ? () => handleStartLesson(prevLesson) : undefined}
                    onNextLesson={nextLesson ? () => handleStartLesson(nextLesson) : undefined}
                  />
                  <TypeFlowGoogleAd
                    lang={lang}
                    profile={profile}
                    onRewardClaim={handleClaimGoogleAdReward}
                    onOpenSuperModal={() => setIsSuperModalOpen(true)}
                  />
                </>
              ) : (
                <>
                  {/* Live Stats: WPM, Accuracy, Streak, Focus Energy */}
                  <div className="tf-live-stats">
                    <div className="tf-stat-item">
                      <span className="tf-stat-val">{liveWpm}</span>
                      <span className="tf-stat-lbl">WPM</span>
                    </div>

                    <div className="tf-stat-item">
                      <span className="tf-stat-val">%{liveAccuracy}</span>
                      <span className="tf-stat-lbl">{isTr ? 'Doğruluk' : 'Accuracy'}</span>
                    </div>

                    {liveStreak >= 5 && (
                      <div className="tf-streak-badge">
                        <span>🔥</span>
                        <span>{liveStreak} {isTr ? 'KOMBO' : 'STREAK'}</span>
                      </div>
                    )}

                    {mode === 'lesson' && (
                      <div
                        className="tf-streak-badge"
                        style={{
                          background: 'rgba(16, 185, 129, 0.12)',
                          borderColor: '#10b981',
                          color: '#10b981',
                        }}
                      >
                        <span>🔋</span>
                        <span>
                          {profile.isPremium
                            ? '♾️ ENERJİ'
                            : `${profile.energy ?? profile.hearts ?? 5}/5 ${isTr ? 'ENERJİ' : 'ENERGY'}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Subtitle / Explanation */}
                  {activeSnippetSub && (
                    <div style={{ marginBottom: '0.75rem', textAlign: 'center' }}>
                      <p style={{ fontFamily: 'var(--tf-font-mono)', fontSize: '0.82rem', color: 'var(--tf-text-secondary)' }}>
                        {activeSnippetSub}
                      </p>
                    </div>
                  )}

                  {/* Dual-Box Typing Interface with Persistent Auto-Focus */}
                  <TypeFlowTypingArea
                    lang={lang}
                    words={words}
                    currentWordIndex={currentWordIndex}
                    currentInput={currentInput}
                    isMismatch={isMismatch}
                    correctWordsCount={correctWordsCount}
                    incorrectWordsCount={incorrectWordsCount}
                    timeLeft={timeLeft}
                    totalTime={timeLimit}
                    wordProgress={`${currentWordIndex + 1}/${words.length}`}
                    mode={mode}
                    wordModeType={wordModeType}
                    modeLabel={modeLabel}
                    testStatus={testStatus}
                    capsLockActive={capsLockActive}
                    liveStreak={liveStreak}
                    lessonMistakes={lessonMistakes}
                    maxMistakes={3}
                    caseSensitive={caseSensitive}
                    includePunctuation={includePunctuation}
                    activeStage={
                      mode === 'lesson' && activeLesson?.stages
                        ? {
                            current: activeLessonStage,
                            total: activeLesson.stages.length,
                            title: activeLesson.stages[activeLessonStage - 1]?.title || activeLesson.title,
                            minWpm: activeLesson.stages[activeLessonStage - 1]?.minWpm || activeLesson.minWpm,
                            minAccuracy: activeLesson.stages[activeLessonStage - 1]?.minAccuracy || activeLesson.minAccuracy,
                          }
                        : undefined
                    }
                    onInputChange={handleInputChange}
                    onSpaceSubmit={() => handleSpaceSubmit()}
                    onBackspaceEmpty={handleBackspaceEmpty}
                    onRestart={initializeTest}
                  />
                </>
              )}
            </main>
          </>
        );
      })()}

      {/* 8. Slide-Over Profile & Settings Drawer (Yan Bar) */}
      <TypeFlowProfileDrawer
        isOpen={isProfileDrawerOpen}
        lang={lang}
        theme={theme}
        sound={sound}
        volume={volume}
        profile={profile}
        onClose={() => setIsProfileDrawerOpen(false)}
        onThemeChange={handleThemeChange}
        onSoundChange={handleSoundChange}
        onVolumeChange={handleVolumeChange}
        onLangChange={handleLangChange}
        onProfileUpdate={handleProfileUpdate}
        onNavigateTab={(tab) => {
          setIsProfileDrawerOpen(false);
          setActiveTab(tab);
        }}
        onOpenShop={() => {
          setIsProfileDrawerOpen(false);
          setActiveTab('shop');
        }}
        onOpenSuperModal={() => {
          setIsProfileDrawerOpen(false);
          setIsSuperModalOpen(true);
        }}
        onOpenAdModal={handleTriggerAdBreak}
        onCancelSubscription={handleCancelSubscription}
        onOpenAuth={() => {
          setIsProfileDrawerOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      {/* 9. User Auth & Profile Customization Modal */}
      <TypeFlowAuthModal
        isOpen={isAuthModalOpen}
        lang={lang}
        profile={profile}
        onClose={() => setIsAuthModalOpen(false)}
        onProfileUpdate={handleProfileUpdate}
      />

      {/* 10. Advanced SaaS Settings Modal */}
      <TypeFlowSettingsModal
        isOpen={isSettingsModalOpen}
        lang={lang}
        theme={theme}
        sound={sound}
        volume={volume}
        profile={profile}
        onClose={() => setIsSettingsModalOpen(false)}
        onThemeChange={handleThemeChange}
        onSoundChange={handleSoundChange}
        onVolumeChange={handleVolumeChange}
        onProfileUpdate={handleProfileUpdate}
        onOpenShop={() => {
          setIsSettingsModalOpen(false);
          setActiveTab('shop');
        }}
      />

      {/* 11. Super TypeFlow Pro SaaS Modal */}
      <TypeFlowSuperModal
        isOpen={isSuperModalOpen}
        onClose={() => setIsSuperModalOpen(false)}
        profile={profile}
        onUpgradeToSuper={handleUpgradeToSuper}
        onNavigateToCheckout={handleGoToCheckout}
        lang={lang}
      />

      {/* 12. Sponsorlu Teknoloji Reklam Molası Modal */}
      <TypeFlowAdBreakModal
        isOpen={isAdBreakModalOpen}
        onClose={() => setIsAdBreakModalOpen(false)}
        ad={getTechAds(lang)[currentAdIndex] || getTechAds(lang)[0]}
        onClaimEnergyReward={handleClaimEnergyReward}
        onOpenSuperModal={() => {
          setIsAdBreakModalOpen(false);
          setIsSuperModalOpen(true);
        }}
        lang={lang}
      />

      {/* 13. Toast Notification System (Audit Fix #8) */}
      {toasts.length > 0 && (
        <div className="tf-toast-container" aria-live="polite">
          {toasts.map((toast) => (
            <div key={toast.id} className={`tf-toast tf-toast-${toast.type}`}>
              <span>{toast.message}</span>
              <button
                className="tf-toast-close"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                aria-label="Close notification"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 14. Onboarding Modal (Audit Fix #4) */}
      {showOnboarding && (
        <div className="tf-onboarding-overlay" onClick={() => setShowOnboarding(false)}>
          <div className="tf-onboarding-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', textAlign: 'center' }}>⌨️</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 0.5rem 0', textAlign: 'center', background: 'linear-gradient(135deg, var(--tf-accent), #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {isTr ? "TypeFlow'a Hoş Geldin!" : 'Welcome to TypeFlow!'}
            </h2>
            <p style={{ color: 'var(--tf-text-secondary)', textAlign: 'center', margin: '0 0 1.5rem 0', lineHeight: 1.6 }}>
              {isTr
                ? 'Daktilo ustası olmak için Akademi\'den başla! 3 aşamalı derslerle kas hafızanı geliştir, elmas kazan, liglerde yarış.'
                : 'Start from the Academy to become a typing master! Progress through 3-stage lessons, earn gems, and compete in leagues.'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="tf-btn-primary tf-btn-pushable"
                style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
                onClick={() => {
                  setShowOnboarding(false);
                  setActiveTab('path');
                }}
              >
                🗺️ {isTr ? 'Akademiye Başla' : 'Start Academy'}
              </button>
              <button
                className="tf-ctrl-btn tf-btn-pushable"
                style={{ padding: '0.75rem 1.5rem' }}
                onClick={() => {
                  setShowOnboarding(false);
                  setActiveTab('test');
                }}
              >
                ⚡ {isTr ? 'Serbest Pratik' : 'Free Practice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 15. Level-Up Celebration (Audit Fix #10) */}
      {showLevelUp && (
        <div className="tf-levelup-overlay" onClick={() => setShowLevelUp(null)}>
          <div className="tf-levelup-card" onClick={(e) => e.stopPropagation()}>
            <div className="tf-levelup-stars">🌟✨🌟</div>
            <h2 className="tf-levelup-title">
              {isTr ? 'SEVİYE ATLADIN!' : 'LEVEL UP!'}
            </h2>
            <div className="tf-levelup-number">
              <span className="tf-levelup-from">L{showLevelUp.from}</span>
              <span className="tf-levelup-arrow">→</span>
              <span className="tf-levelup-to">L{showLevelUp.to}</span>
            </div>
            <p style={{ color: 'var(--tf-text-secondary)', marginTop: '0.5rem' }}>
              {isTr ? 'Yeni seviye, yeni hedefler! Pratik yapmaya devam et.' : 'New level, new goals! Keep practicing.'}
            </p>
            <button
              className="tf-btn-primary tf-btn-pushable"
              style={{ marginTop: '1.25rem', padding: '0.75rem 2rem' }}
              onClick={() => setShowLevelUp(null)}
            >
              {isTr ? '🎯 Devam Et' : '🎯 Continue'}
            </button>
          </div>
        </div>
      )}

      {/* 16. SaaS Footer (Audit Fix #15: cleaned up text) */}
      <footer className="tf-footer">
        <div>
          <span>TIYATROTIST LABS // TYPEFLOW v2.0</span>
        </div>
        <div className="tf-footer-links">
          <button
            onClick={() => setActiveTab('path')}
            style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer' }}
          >
            {isTr ? '🗺️ Akademi' : '🗺️ Academy'}
          </button>
          <button
            onClick={() => setActiveTab('leagues')}
            style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer' }}
          >
            {isTr ? '🏆 Ligler' : '🏆 Leagues'}
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer' }}
          >
            {isTr ? '🎯 Görevler' : '🎯 Quests'}
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer' }}
          >
            {isTr ? '🛍️ Mağaza' : '🛍️ Shop'}
          </button>
          <button
            onClick={() => router.push(`/${lang}/projects`)}
            style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer' }}
          >
            {isTr ? 'Projeler' : 'Projects'}
          </button>
        </div>
        {/* Audit Fix #13: Keyboard Shortcuts Guide */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '0.5rem',
          opacity: 0.5,
          fontSize: '0.68rem',
          fontFamily: 'var(--tf-font-mono)',
          color: 'var(--tf-text-muted)',
        }}>
          <span title={isTr ? 'Yeniden başlat' : 'Restart test'}>
            <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '3px', fontSize: '0.65rem' }}>Tab</kbd> / <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '3px', fontSize: '0.65rem' }}>Esc</kbd> {isTr ? 'Yeniden Başlat' : 'Restart'}
          </span>
          <span>·</span>
          <span title={isTr ? 'Kelime gönder' : 'Submit word'}>
            <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '3px', fontSize: '0.65rem' }}>Space</kbd> {isTr ? 'Kelime Gönder' : 'Submit Word'}
          </span>
          <span>·</span>
          <span title={isTr ? 'Menü/drawer kapat' : 'Close menu/drawer'}>
            <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '3px', fontSize: '0.65rem' }}>Esc</kbd> {isTr ? 'Menü Kapat' : 'Close Menu'}
          </span>
        </div>
      </footer>
    </div>
  );
}
