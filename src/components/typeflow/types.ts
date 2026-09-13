/**
 * TYPEFLOW — Core Type Definitions
 * Strict TypeScript interfaces for typing modes, themes, audio, metrics,
 * and Duolingo-grade SaaS gamification (Path, Units, Leagues, Hearts, Gems, Quests, Shop).
 */

export type TypeFlowMode = 'words' | 'story' | 'dev' | 'lesson';

export type TypeFlowTheme = 'carbon' | 'amber' | 'emerald' | 'slate' | 'violet' | 'rose' | 'cyber';

export type SoundType = 'thock' | 'clicky' | 'tactile' | 'synth' | 'off';

export type WordCountOption = 15 | 25 | 50 | 100;

export type TimeOption = 15 | 30 | 60 | 120;

export type DevCategory = 'all' | 'powershell' | 'terminal' | 'code' | 'mixed';

export type StoryGenre = 'all' | 'cyberpunk' | 'retro' | 'philosophy' | 'tech';

export type TestStatus = 'idle' | 'running' | 'completed';

export type CharacterStatus = 'untyped' | 'correct' | 'incorrect' | 'extra';

export interface LetterState {
  char: string;
  status: CharacterStatus;
}

export interface WordState {
  original: string;
  letters: LetterState[];
  isCurrent: boolean;
  isComplete: boolean;
  hasError: boolean;
  typedValue?: string;
  isCorrect?: boolean;
}

export interface SecondMetric {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface KeyStat {
  count: number;
  errors: number;
}

export type KeyHeatmapData = Record<string, KeyStat>;

export interface TestResult {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  cpm: number;
  consistency: number;
  elapsedSeconds: number;
  totalChars: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  correctWords: number;
  incorrectWords: number;
  mode: TypeFlowMode;
  modeConfig: string;
  theme: TypeFlowTheme;
  history: SecondMetric[];
  keyStats: KeyHeatmapData;
  isPersonalBest: boolean;
  timestamp: number;
  lessonId?: string;
  earnedXp?: number;
  earnedGems?: number;
  stars?: number;
}

// ─── Duolingo SaaS Navigation Tabs ──────────────────────────────────────────
export type SaaSTab = 'path' | 'test' | 'leagues' | 'quests' | 'shop' | 'profile' | 'checkout';

// ─── Duolingo Gamification: Leagues ─────────────────────────────────────────
export type LeagueTier = 'bronze' | 'silver' | 'gold' | 'sapphire' | 'diamond';

export interface LeagueMember {
  id: string;
  username: string;
  avatar: string;
  weeklyXp: number;
  rank: number;
  isCurrentUser?: boolean;
}

// ─── Duolingo Gamification: Daktilo Akademisi (Units & Lessons) ─────────────
export type LessonStatus = 'locked' | 'active' | 'completed';

export interface LessonStage {
  stageIndex: number; // 1, 2, 3
  title: string;
  description: string;
  type: 'drill' | 'words' | 'sentences' | 'boss';
  targetChars: string[];
  words: string[];
  minWpm: number;
  minAccuracy: number;
}

export interface Lesson {
  id: string;
  unitId: number;
  title: string;
  description: string;
  icon: string;
  targetChars: string[];
  words: string[];
  stages?: LessonStage[];
  stars: number; // 0 to 3
  status: LessonStatus;
  minWpm: number;
  minAccuracy: number;
  xpReward: number;
  gemReward: number;
}

export interface Unit {
  id: number;
  title: string;
  description: string;
  themeColor: string;
  lessons: Lesson[];
}

// ─── Duolingo Gamification: Quests & Achievements ───────────────────────────
export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  current: number;
  target: number;
  xpReward: number;
  gemReward: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  current: number;
  target: number;
  isUnlocked: boolean;
  rewardGems: number;
  unlockedDate?: string;
}

// ─── Duolingo Gamification: Shop ────────────────────────────────────────────
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  category: 'utility' | 'theme' | 'sound';
  owned: boolean;
  value?: string;
}

// ─── SaaS Monetization & Sponsored Ads ──────────────────────────────────────
export interface TechAd {
  id: string;
  sponsor: string;
  tagline: string;
  badge: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  rewardEnergy: number;
  icon: string;
}

// ─── User Profile with Duolingo Gamification ────────────────────────────────
export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  bio?: string;
  isGuest: boolean;
  avatar: string;
  level: number;
  xp: number;
  streakDays: number;
  lastActiveDate: string; // 'YYYY-MM-DD'
  dailyTestsCompleted: number;
  dailyGoal: number;
  totalTests: number;
  avgWpm: number;
  topWpm: number;
  keyStats: KeyHeatmapData;

  // Odak Enerjisi (Focus Battery 🔋) & Super TypeFlow
  energy: number; // 0 to 5
  maxEnergy: number;
  isPremium: boolean; // Super TypeFlow (Unlimited Energy ♾️, Zero Ads)
  premiumExpiresAt?: string;

  // Subscription & Free Trial Lifecycle
  subscriptionStatus?: 'free' | 'trialing' | 'active' | 'cancelled' | 'expired';
  subscriptionPlan?: 'trial' | 'monthly' | 'yearly';
  trialStartedAt?: string;
  trialEndsAt?: string;
  paymentMethodBrand?: string; // 'visa' | 'mastercard' | 'troy' | 'amex'
  paymentMethodLast4?: string;
  lastOrderId?: string;

  // Legacy fallback
  hearts?: number;
  maxHearts?: number;

  gems: number;
  streakFreezes: number;
  league: LeagueTier;
  weeklyXp: number;
  completedLessons: Record<string, number>; // lessonId -> stars (1-3)
  unlockedThemes: string[];
  unlockedSounds: string[];
  claimedQuests: string[];
  unlockedAchievements: string[];
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  wpm: number;
  accuracy: number;
  mode: string;
  date: string;
  rank?: number;
  avatar?: string;
}

export interface TypeFlowPreferences {
  theme: TypeFlowTheme;
  sound: SoundType;
  soundVolume: number;
  caretStyle: 'line' | 'block' | 'underline';
  smoothCaret: boolean;
  quickRestart: boolean;
  personalBests: Record<string, number>;
}
