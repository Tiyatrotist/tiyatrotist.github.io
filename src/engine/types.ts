/**
 * TIYATROTIST — Dot Engine Types
 * Shared TypeScript interfaces for the particle/dot system.
 */

export type IndividualParticleState = 'REST' | 'BURST' | 'SCATTERED' | 'RETURNING' | 'SETTLED';

/** Tek bir parçacığı temsil eder (Represents a single particle) */
export interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  opacity: number;
  targetOpacity: number;
  size: number;
  /** Parçacığın aktif olup olmadığını belirtir */
  active: boolean;
  /** Ambient drift & micro-variation seed */
  seed: number;

  // Particle State Machine Properties
  state: IndividualParticleState;
  stateTimer: number;
  holdDuration: number;
  cooldownTimer: number;
}

/** Section preset modes for contextual particle behavior */
export type SectionMode = 'hero' | 'intro' | 'projects' | 'about' | 'now' | 'contact' | 'footer';

/** Section Preset configuration values for Burst → Hold → Return physics */
export interface SectionPresetConfig {
  burstStrength: number;
  scatterRadius: number;
  holdDurationMin: number;
  holdDurationMax: number;
  returnSpring: number;
  returnDamping: number;
  velocityDamping: number;
  reentryCooldown: number;
  ambientOpacity: number;
  speedMultiplier: number;
}

/** DotEngine yapılandırma seçenekleri */
export interface DotEngineConfig {
  /** Canvas element to render on */
  canvas: HTMLCanvasElement;
  /** Base particle color (default: white) */
  particleColor?: string;
  /** Maximum number of particles */
  maxParticles?: number;
  /** Base particle size in pixels */
  baseSize?: number;
  /** Mouse burst strength */
  burstStrength?: number;
  /** Mouse scatter interaction radius in pixels */
  scatterRadius?: number;
  /** Hold duration before return begins (ms) */
  holdDurationMin?: number;
  holdDurationMax?: number;
  /** Spring constant for returning to target */
  returnSpring?: number;
  /** Friction coefficient */
  velocityDamping?: number;
  /** Whether to enable mouse interaction */
  enableMouseInteraction?: boolean;
  /** Whether reduced motion is preferred */
  reducedMotion?: boolean;
  /** Device pixel ratio override */
  dpr?: number;
  /** Listen to global window mouse events instead of canvas element */
  useGlobalMouse?: boolean;
  /** Current section mode */
  sectionMode?: SectionMode;
}

/** Metin düzeni bilgisi (Text layout information) */
export interface TextLayout {
  /** Dot coordinates relative to text bounds */
  dots: Array<{ x: number; y: number }>;
  /** Width of the text bounds */
  width: number;
  /** Height of the text bounds */
  height: number;
}

/** Mouse pozisyonu ve hız takibi */
export interface MousePosition {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  speed: number;
  active: boolean;
  lastUpdate: number;
}
