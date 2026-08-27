/**
 * TIYATROTIST — DotEngine
 * Single, reusable Canvas-based particle physics engine.
 *
 * FINE-TUNED PHYSICAL INTERACTION (BURST → HOLD → SLOW RETURN → SETTLE):
 * 1. Small interaction radius (35-50% smaller) — tiny local stone disturbance.
 * 2. Reduced initial burst velocity (35-50% slower) — smooth, weighted, controlled spread.
 * 3. Quadratic falloff curve — strong center, soft edge, zero hard cutoffs.
 * 4. Velocity clamping & early damping — weighted physical motion without chaotic explosions.
 * 5. 100% Independent Particles — Zero neighbor physics, zero cloth/mesh simulation.
 */

import {
  Particle,
  DotEngineConfig,
  MousePosition,
  SectionMode,
  SectionPresetConfig,
} from './types';

/** Default configuration values */
const DEFAULTS: Required<Omit<DotEngineConfig, 'canvas'>> = {
  particleColor: '#ffffff',
  maxParticles: 3000,
  baseSize: 1.5,
  burstStrength: 240,
  scatterRadius: 70,
  holdDurationMin: 1.2,
  holdDurationMax: 2.2,
  returnSpring: 0.045,
  velocityDamping: 0.90,
  enableMouseInteraction: true,
  reducedMotion: false,
  dpr: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1,
  useGlobalMouse: false,
  sectionMode: 'hero',
};

/** Section Mode Presets for fine-tuned physical behavior */
const SECTION_PRESETS: Record<SectionMode, SectionPresetConfig> = {
  hero: {
    burstStrength: 260,
    scatterRadius: 72,
    holdDurationMin: 1.2,
    holdDurationMax: 2.4,
    returnSpring: 0.042,
    returnDamping: 0.90,
    velocityDamping: 0.90,
    reentryCooldown: 0.35,
    ambientOpacity: 0.25,
    speedMultiplier: 1.0,
  },
  intro: {
    burstStrength: 190,
    scatterRadius: 55,
    holdDurationMin: 1.0,
    holdDurationMax: 2.0,
    returnSpring: 0.048,
    returnDamping: 0.89,
    velocityDamping: 0.89,
    reentryCooldown: 0.35,
    ambientOpacity: 0.15,
    speedMultiplier: 0.6,
  },
  projects: {
    burstStrength: 230,
    scatterRadius: 65,
    holdDurationMin: 1.1,
    holdDurationMax: 2.2,
    returnSpring: 0.045,
    returnDamping: 0.90,
    velocityDamping: 0.89,
    reentryCooldown: 0.35,
    ambientOpacity: 0.20,
    speedMultiplier: 0.8,
  },
  about: {
    burstStrength: 150,
    scatterRadius: 45,
    holdDurationMin: 0.9,
    holdDurationMax: 1.8,
    returnSpring: 0.052,
    returnDamping: 0.88,
    velocityDamping: 0.88,
    reentryCooldown: 0.40,
    ambientOpacity: 0.10,
    speedMultiplier: 0.4,
  },
  now: {
    burstStrength: 130,
    scatterRadius: 40,
    holdDurationMin: 0.8,
    holdDurationMax: 1.6,
    returnSpring: 0.055,
    returnDamping: 0.88,
    velocityDamping: 0.88,
    reentryCooldown: 0.40,
    ambientOpacity: 0.08,
    speedMultiplier: 0.3,
  },
  contact: {
    burstStrength: 210,
    scatterRadius: 60,
    holdDurationMin: 1.0,
    holdDurationMax: 2.0,
    returnSpring: 0.048,
    returnDamping: 0.89,
    velocityDamping: 0.89,
    reentryCooldown: 0.35,
    ambientOpacity: 0.22,
    speedMultiplier: 0.9,
  },
  footer: {
    burstStrength: 100,
    scatterRadius: 35,
    holdDurationMin: 0.7,
    holdDurationMax: 1.4,
    returnSpring: 0.060,
    returnDamping: 0.87,
    velocityDamping: 0.87,
    reentryCooldown: 0.45,
    ambientOpacity: 0.08,
    speedMultiplier: 0.3,
  },
};

export class DotEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: Required<Omit<DotEngineConfig, 'canvas'>>;

  private particles: Particle[] = [];
  private activeCount = 0;

  private mouse: MousePosition = {
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    active: false,
  };

  private isHoveringInteractive = false;
  private animationId: number | null = null;
  private lastTime = 0;
  private timeOffset = 0;
  private isVisible = true;
  private observer: IntersectionObserver | null = null;

  /** Canvas dimensions in CSS pixels */
  private width = 0;
  private height = 0;

  /** Scroll offset set by external layout handlers */
  private scrollOffset = 0;

  /** Global opacity multiplier for page transitions */
  private globalOpacity = 1;

  constructor(config: DotEngineConfig) {
    const ctx = config.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('[DotEngine] Canvas 2D context creation failed');
    }

    this.canvas = config.canvas;
    this.ctx = ctx;
    this.config = { ...DEFAULTS, ...config } as Required<Omit<DotEngineConfig, 'canvas'>>;

    this.initParticlePool();
    this.resize();
    this.bindEvents();
    this.setupVisibilityObserver();
  }

  // ─── INITIALIZATION ──────────────────────────────────────────

  private initParticlePool(): void {
    this.particles = [];
    for (let i = 0; i < this.config.maxParticles; i++) {
      this.particles.push({
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        originX: 0,
        originY: 0,
        vx: 0,
        vy: 0,
        opacity: 0,
        targetOpacity: 0,
        size: this.config.baseSize,
        active: false,
        seed: Math.random() * 100,
        state: 'REST',
        stateTimer: 0,
        holdDuration: 1.5,
        cooldownTimer: 0,
      });
    }
  }

  // ─── SIZING ──────────────────────────────────────────────────

  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * this.config.dpr;
    this.canvas.height = this.height * this.config.dpr;
    this.ctx.scale(this.config.dpr, this.config.dpr);
  }

  // ─── SECTION PRESETS ─────────────────────────────────────────

  setSectionMode(mode: SectionMode): void {
    this.config.sectionMode = mode;
    const preset = SECTION_PRESETS[mode];
    if (preset) {
      this.config.burstStrength = preset.burstStrength;
      this.config.scatterRadius = preset.scatterRadius;
      this.config.holdDurationMin = preset.holdDurationMin;
      this.config.holdDurationMax = preset.holdDurationMax;
      this.config.returnSpring = preset.returnSpring;
      this.config.velocityDamping = preset.velocityDamping;
    }
  }

  // ─── PARTICLE HOME COORD MANAGEMENT ──────────────────────────

  setTargets(
    targets: Array<{ x: number; y: number }>,
    centerX: number,
    centerY: number,
    scatter: boolean = true
  ): void {
    const count = Math.min(targets.length, this.config.maxParticles);
    this.activeCount = count;

    for (let i = 0; i < this.config.maxParticles; i++) {
      const p = this.particles[i];

      if (i < count) {
        const t = targets[i];
        p.targetX = t.x + centerX;
        p.targetY = t.y + centerY;
        p.originX = p.targetX;
        p.originY = p.targetY;
        p.targetOpacity = 1;
        p.active = true;
        p.state = 'REST';
        p.stateTimer = 0;
        p.cooldownTimer = 0;

        if (scatter) {
          p.x = centerX + (Math.random() - 0.5) * this.width * 1.5;
          p.y = centerY + (Math.random() - 0.5) * this.height * 1.5;
          p.opacity = 0;
          p.vx = 0;
          p.vy = 0;
        } else {
          p.x = p.targetX;
          p.y = p.targetY;
        }

        if (this.config.reducedMotion) {
          p.x = p.targetX;
          p.y = p.targetY;
          p.opacity = 1;
        }
      } else {
        p.active = false;
        p.targetOpacity = 0;
      }
    }
  }

  addAmbientParticles(count: number, bounds?: { x: number; y: number; w: number; h: number }): void {
    const bx = bounds?.x ?? 0;
    const by = bounds?.y ?? 0;
    const bw = bounds?.w ?? this.width;
    const bh = bounds?.h ?? this.height;

    let added = 0;
    for (let i = 0; i < this.config.maxParticles && added < count; i++) {
      const p = this.particles[i];
      if (!p.active) {
        const x = bx + Math.random() * bw;
        const y = by + Math.random() * bh;

        p.x = x;
        p.y = y;
        p.targetX = x;
        p.targetY = y;
        p.originX = x;
        p.originY = y;
        p.vx = 0;
        p.vy = 0;
        p.opacity = 0;
        p.targetOpacity = Math.random() * 0.25 + 0.05;
        p.size = this.config.baseSize * (Math.random() * 0.6 + 0.4);
        p.active = true;
        p.state = 'REST';
        p.stateTimer = 0;
        p.cooldownTimer = 0;
        added++;
      }
    }

    this.activeCount += added;
  }

  scatterAll(force: number = 1): void {
    for (let i = 0; i < this.activeCount; i++) {
      const p = this.particles[i];
      if (!p.active) continue;

      const angle = Math.random() * Math.PI * 2;
      const dist = (Math.random() * 200 + 100) * force;
      p.targetX = p.originX + Math.cos(angle) * dist;
      p.targetY = p.originY + Math.sin(angle) * dist;
    }
  }

  reformAll(): void {
    for (let i = 0; i < this.config.maxParticles; i++) {
      const p = this.particles[i];
      if (!p.active) continue;

      p.targetX = p.originX;
      p.targetY = p.originY;
    }
  }

  setScrollOffset(offset: number): void {
    this.scrollOffset = offset;
  }

  setGlobalOpacity(opacity: number): void {
    this.globalOpacity = Math.max(0, Math.min(1, opacity));
  }

  setScatterProgress(progress: number): void {
    const p0 = Math.max(0, Math.min(1, progress));

    for (let i = 0; i < this.config.maxParticles; i++) {
      const particle = this.particles[i];
      if (!particle.active) continue;

      const angle = (particle.originX * 0.01 + particle.originY * 0.013) % (Math.PI * 2);
      const dist = 300 * p0;

      particle.targetX = particle.originX + Math.cos(angle) * dist;
      particle.targetY = particle.originY + Math.sin(angle) * dist;
      particle.targetOpacity = 1 - p0 * 0.7;
    }
  }

  // ─── MOUSE TRACKING ───────────────────────────────────────────

  updateMouse(x: number, y: number): void {
    const now = performance.now();
    const dt = Math.max((now - ((this.mouse as any).lastUpdate || now - 16)) / 1000, 0.001);
    (this.mouse as any).lastUpdate = now;

    const dx = x - this.mouse.x;
    const dy = y - this.mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    this.mouse.vx = dx / dt;
    this.mouse.vy = dy / dt;

    const currentSpeed = dist / dt;
    this.mouse.speed = this.mouse.speed * 0.75 + currentSpeed * 0.25;

    this.mouse.prevX = this.mouse.x;
    this.mouse.prevY = this.mouse.y;
    this.mouse.x = x;
    this.mouse.y = y;
    this.mouse.active = true;
  }

  clearMouse(): void {
    this.mouse.active = false;
    this.mouse.speed = 0;
    this.mouse.vx = 0;
    this.mouse.vy = 0;
  }

  // ─── ANIMATION LOOP ──────────────────────────────────────────

  start(): void {
    if (this.animationId !== null) return;
    this.lastTime = performance.now();
    this.tick(this.lastTime);
  }

  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private tick = (time: number): void => {
    this.animationId = requestAnimationFrame(this.tick);

    if (!this.isVisible) return;

    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    this.timeOffset += dt;

    this.update(dt);
    this.render();
  };

  /**
   * FINE-TUNED INDEPENDENT PARTICLE PHYSICS & STATE MACHINE UPDATE
   * BURST → HOLD (SCATTERED) → SLOW RETURN → SETTLE → REST
   * - Reduced burst speed (~40% slower)
   * - Reduced interaction radius (~40% smaller)
   * - Quadratic falloff curve (strong center, soft edge)
   * - Max velocity capping for smooth weighted physical movement
   */
  private update(dt: number): void {
    const { enableMouseInteraction, reducedMotion } = this.config;

    if (reducedMotion) {
      for (let i = 0; i < this.config.maxParticles; i++) {
        const p = this.particles[i];
        if (!p.active) continue;
        p.x = p.targetX;
        p.y = p.targetY;
        p.opacity = p.targetOpacity;
      }
      return;
    }

    const mouseActive = enableMouseInteraction && this.mouse.active;

    // Mouse position relative to canvas
    const rect = this.canvas.getBoundingClientRect();
    const mx = this.mouse.x - rect.left;
    const my = this.mouse.y - rect.top;

    const preset = SECTION_PRESETS[this.config.sectionMode] || SECTION_PRESETS.hero;

    const radius = preset.scatterRadius * (this.isHoveringInteractive ? 1.2 : 1.0);
    const radiusSq = radius * radius;

    const speedFactor = 1 + Math.min(this.mouse.speed * 0.0006, 0.6);
    const effBurstStrength = preset.burstStrength * speedFactor * (this.isHoveringInteractive ? 1.2 : 1.0);

    const maxVel = 260; // Max velocity cap (px/s) for smooth weighted movement

    for (let i = 0; i < this.activeCount; i++) {
      const p = this.particles[i];
      if (!p.active) continue;

      p.stateTimer += dt;
      if (p.cooldownTimer > 0) {
        p.cooldownTimer -= dt;
      }

      // Organic per-particle micro-variations (balanced range)
      const pBurstMult = 0.85 + ((p.seed % 7) * 0.05); // 0.85 ~ 1.15
      const pHoldDuration = preset.holdDurationMin + ((p.seed % 9) * 0.13); // 1.0s ~ 2.2s
      const pSpring = preset.returnSpring + ((p.seed % 5) * 0.002);
      const pDamping = preset.velocityDamping;

      // ─────────────────────────────────────────────────────────
      // TRIGGER CHECK: CURSOR BURST (QUADRATIC FALLOFF)
      // ─────────────────────────────────────────────────────────
      if (mouseActive && p.cooldownTimer <= 0) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const distSq = dx * dx + dy * dy;

        if (distSq < radiusSq && distSq > 0.001) {
          const dist = Math.sqrt(distSq);
          // Quadratic falloff: strong center, soft edge, zero hard cutoff
          const forceRatio = Math.pow(1.0 - dist / radius, 2);

          const dirX = dx / dist;
          const dirY = dy / dist;

          const impulseMag = forceRatio * effBurstStrength * pBurstMult;
          p.vx += dirX * impulseMag * dt * 60;
          p.vy += dirY * impulseMag * dt * 60;

          // Swipe momentum addition if cursor is moving fast
          if (this.mouse.speed > 50) {
            p.vx += (this.mouse.vx * 0.015) * forceRatio;
            p.vy += (this.mouse.vy * 0.015) * forceRatio;
          }

          // Trigger particle state change
          p.state = 'BURST';
          p.stateTimer = 0;
          p.holdDuration = pHoldDuration;
          p.cooldownTimer = preset.reentryCooldown;
        }
      }

      // Velocity Capping for weighted physical control
      const velSq = p.vx * p.vx + p.vy * p.vy;
      if (velSq > maxVel * maxVel) {
        const scale = maxVel / Math.sqrt(velSq);
        p.vx *= scale;
        p.vy *= scale;
      }

      // ─────────────────────────────────────────────────────────
      // INDEPENDENT STATE MACHINE LOGIC
      // ─────────────────────────────────────────────────────────
      switch (p.state) {
        case 'REST': {
          // Stable at home position with micro ambient drift
          const driftX = Math.sin(this.timeOffset * 0.7 + p.seed) * 0.35 * preset.speedMultiplier;
          const driftY = Math.cos(this.timeOffset * 0.5 + p.seed * 1.4) * 0.35 * preset.speedMultiplier;

          const homeDx = (p.targetX + driftX) - p.x;
          const homeDy = (p.targetY + driftY) - p.y;

          p.vx += homeDx * 0.08;
          p.vy += homeDy * 0.08;
          p.vx *= pDamping;
          p.vy *= pDamping;
          p.x += p.vx;
          p.y += p.vy;
          break;
        }

        case 'BURST': {
          // Controlled initial outward burst movement
          p.vx *= pDamping;
          p.vy *= pDamping;
          p.x += p.vx;
          p.y += p.vy;

          if (p.stateTimer > 0.2) {
            p.state = 'SCATTERED';
          }
          break;
        }

        case 'SCATTERED': {
          // Particle remains visibly displaced away from home (1.0 - 2.2s)
          // ZERO home return spring force during hold phase! Particle drifts freely.
          p.vx *= pDamping;
          p.vy *= pDamping;
          p.x += p.vx;
          p.y += p.vy;

          if (p.stateTimer >= p.holdDuration) {
            p.state = 'RETURNING';
            p.stateTimer = 0;
          }
          break;
        }

        case 'RETURNING': {
          // Particle slowly travels back toward its OWN home coordinate
          const homeDx = p.targetX - p.x;
          const homeDy = p.targetY - p.y;
          const distToHome = Math.sqrt(homeDx * homeDx + homeDy * homeDy);

          p.vx += homeDx * pSpring;
          p.vy += homeDy * pSpring;
          p.vx *= preset.returnDamping;
          p.vy *= preset.returnDamping;

          p.x += p.vx;
          p.y += p.vy;

          // Close to home -> SETTLED
          if (distToHome < 0.8 && Math.abs(p.vx) < 0.1 && Math.abs(p.vy) < 0.1) {
            p.state = 'SETTLED';
            p.stateTimer = 0;
          }
          break;
        }

        case 'SETTLED': {
          // Precise final settling into home coordinates
          p.x += (p.targetX - p.x) * 0.15;
          p.y += (p.targetY - p.y) * 0.15;
          p.vx = 0;
          p.vy = 0;

          if (p.stateTimer > 0.3) {
            p.state = 'REST';
          }
          break;
        }
      }

      // Smooth opacity lerp
      p.opacity += (p.targetOpacity - p.opacity) * 0.06;
    }
  }

  private render(): void {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < this.activeCount; i++) {
      const p = this.particles[i];
      if (!p.active) continue;

      const finalOpacity = p.opacity * this.globalOpacity;
      if (finalOpacity < 0.01) continue;

      const px = p.x;
      const py = p.y - this.scrollOffset;
      if (px < -20 || px > w + 20 || py < -20 || py > h + 20) continue;

      ctx.globalAlpha = finalOpacity;
      ctx.fillStyle = this.config.particleColor;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  // ─── EVENT LISTENERS ──────────────────────────────────────────

  private handleMouseMove = (e: MouseEvent): void => {
    this.updateMouse(e.clientX, e.clientY);
  };

  private handleMouseOver = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button') ||
      target.dataset.cursor === 'expand'
    ) {
      this.isHoveringInteractive = true;
    }
  };

  private handleMouseOut = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button') ||
      target.dataset.cursor === 'expand'
    ) {
      this.isHoveringInteractive = false;
    }
  };

  private handleMouseLeave = (): void => {
    this.clearMouse();
  };

  private handleResize = (): void => {
    this.resize();
  };

  private bindEvents(): void {
    if (this.config.useGlobalMouse) {
      window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
      document.addEventListener('mouseleave', this.handleMouseLeave);
      document.addEventListener('mouseover', this.handleMouseOver);
      document.addEventListener('mouseout', this.handleMouseOut);
    } else {
      this.canvas.addEventListener('mousemove', this.handleMouseMove, { passive: true });
      this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
      document.addEventListener('mouseover', this.handleMouseOver);
      document.addEventListener('mouseout', this.handleMouseOut);
    }
    window.addEventListener('resize', this.handleResize);
  }

  private unbindEvents(): void {
    if (this.config.useGlobalMouse) {
      window.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseleave', this.handleMouseLeave);
      document.removeEventListener('mouseover', this.handleMouseOver);
      document.removeEventListener('mouseout', this.handleMouseOut);
    } else {
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
      document.removeEventListener('mouseover', this.handleMouseOver);
      document.removeEventListener('mouseout', this.handleMouseOut);
    }
    window.removeEventListener('resize', this.handleResize);
  }

  // ─── VISIBILITY OBSERVER ──────────────────────────────────────

  private setupVisibilityObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        this.isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    this.observer.observe(this.canvas);
  }

  // ─── CLEANUP ──────────────────────────────────────────────────

  destroy(): void {
    this.stop();
    this.unbindEvents();
    this.observer?.disconnect();
    this.particles = [];
  }

  // ─── GETTERS ──────────────────────────────────────────────────

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getActiveCount(): number {
    return this.activeCount;
  }
}
