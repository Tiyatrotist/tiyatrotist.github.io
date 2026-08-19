/**
 * TIYATROTIST — Dot Engine Types
 * Shared TypeScript interfaces for the particle/dot system.
 */

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
  /** Mouse repulsion radius in pixels */
  mouseRadius?: number;
  /** Mouse repulsion force multiplier */
  mouseForce?: number;
  /** Friction coefficient (0-1, lower = more friction) */
  friction?: number;
  /** Spring constant for returning to target */
  springForce?: number;
  /** Whether to enable mouse interaction */
  enableMouseInteraction?: boolean;
  /** Whether reduced motion is preferred */
  reducedMotion?: boolean;
  /** Device pixel ratio override */
  dpr?: number;
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

/** Parçacık durumu geçişi (Particle state transition) */
export type ParticleState = 'idle' | 'forming' | 'scattered' | 'transitioning';

/** Mouse pozisyonu */
export interface MousePosition {
  x: number;
  y: number;
  active: boolean;
}
