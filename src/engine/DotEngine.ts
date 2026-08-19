/**
 * TIYATROTIST — DotEngine
 * Tek, yeniden kullanılabilir Canvas tabanlı parçacık motoru.
 * (Single, reusable Canvas-based particle engine)
 *
 * Tüm görsel sistemi güçlendirir:
 * - Hero tipografisi
 * - Arka plan parçacıkları
 * - Geçişler
 * - Fare etkileşimleri
 * - Kaydırma geçişleri
 */

import { Particle, DotEngineConfig, MousePosition } from './types';

/** Varsayılan yapılandırma değerleri */
const DEFAULTS: Required<Omit<DotEngineConfig, 'canvas'>> = {
  particleColor: '#ffffff',
  maxParticles: 3000,
  baseSize: 1.5,
  mouseRadius: 100,
  mouseForce: 0.3,
  friction: 0.85,
  springForce: 0.08,
  enableMouseInteraction: true,
  reducedMotion: false,
  dpr: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1,
};

export class DotEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: Required<Omit<DotEngineConfig, 'canvas'>>;

  private particles: Particle[] = [];
  private activeCount = 0;

  private mouse: MousePosition = { x: 0, y: 0, active: false };
  private animationId: number | null = null;
  private lastTime = 0;
  private isVisible = true;
  private observer: IntersectionObserver | null = null;

  /** Canvas boyutları (CSS piksel cinsinden) */
  private width = 0;
  private height = 0;

  /** Scroll offset — dış bileşenler tarafından ayarlanır */
  private scrollOffset = 0;

  /** Global opasite çarpanı (geçişler için) */
  private globalOpacity = 1;

  constructor(config: DotEngineConfig) {
    const ctx = config.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('[DotEngine] Canvas 2D context oluşturulamadı');
    }

    this.canvas = config.canvas;
    this.ctx = ctx;
    this.config = { ...DEFAULTS, ...config } as Required<Omit<DotEngineConfig, 'canvas'>>;

    // Debug log
    console.debug('[DotEngine] Initialized with config:', {
      maxParticles: this.config.maxParticles,
      baseSize: this.config.baseSize,
      reducedMotion: this.config.reducedMotion,
    });

    // Parçacık havuzunu ön-tahsis et
    this.initParticlePool();

    // Canvas boyutunu ayarla
    this.resize();

    // Event listener'ları bağla
    this.bindEvents();

    // Viewport gözlemcisini ayarla
    this.setupVisibilityObserver();
  }

  // ─── BAŞLATMA (Initialization) ────────────────────────────────

  /** Parçacık havuzunu ön-tahsis eder */
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
      });
    }
  }

  // ─── BOYUTLANDIRMA (Sizing) ───────────────────────────────────

  /** Canvas'ı container boyutlarına göre yeniden boyutlandırır */
  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    // HiDPI desteği
    this.canvas.width = this.width * this.config.dpr;
    this.canvas.height = this.height * this.config.dpr;
    this.ctx.scale(this.config.dpr, this.config.dpr);

    console.debug(`[DotEngine] Resized to ${this.width}x${this.height} (dpr: ${this.config.dpr})`);
  }

  // ─── PARÇACIK YÖNETİMİ (Particle Management) ─────────────────

  /**
   * Parçacıkları belirtilen hedef pozisyonlarına ayarlar.
   * (Sets particles to specified target positions)
   *
   * @param targets - Hedef koordinatlar dizisi [{x, y}]
   * @param centerX - Hedeflerin merkezleneceği X (canvas koordinatlarında)
   * @param centerY - Hedeflerin merkezleneceği Y
   * @param scatter - true ise parçacıklar rastgele başlangıç pozisyonlarından animasyonlanır
   */
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

        if (scatter) {
          // Rastgele başlangıç pozisyonu (ekranın farklı yerlerinden)
          p.x = centerX + (Math.random() - 0.5) * this.width * 1.5;
          p.y = centerY + (Math.random() - 0.5) * this.height * 1.5;
          p.opacity = 0;
          p.vx = 0;
          p.vy = 0;
        }

        if (this.config.reducedMotion) {
          // Azaltılmış hareket: doğrudan hedefe ışınlan
          p.x = p.targetX;
          p.y = p.targetY;
          p.opacity = 1;
        }
      } else {
        p.active = false;
        p.targetOpacity = 0;
      }
    }

    console.debug(`[DotEngine] setTargets: ${count} particles activated, scatter: ${scatter}`);
  }

  /**
   * Ambient (arka plan) parçacıkları ekler.
   * (Adds ambient/background particles)
   */
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
        p.targetOpacity = Math.random() * 0.3 + 0.05;
        p.size = this.config.baseSize * (Math.random() * 0.6 + 0.4);
        p.active = true;
        added++;
      }
    }

    this.activeCount += added;
    console.debug(`[DotEngine] addAmbientParticles: ${added} ambient particles added`);
  }

  /**
   * Tüm parçacıkları dağıtır (scatter).
   */
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

  /**
   * Tüm parçacıkları orijinal pozisyonlarına geri toplar.
   */
  reformAll(): void {
    for (let i = 0; i < this.config.maxParticles; i++) {
      const p = this.particles[i];
      if (!p.active) continue;

      p.targetX = p.originX;
      p.targetY = p.originY;
    }
  }

  /**
   * Parçacıkları scroll offset'e göre dikey kaydırır.
   */
  setScrollOffset(offset: number): void {
    this.scrollOffset = offset;
  }

  /**
   * Global opasite çarpanını ayarlar (0-1).
   */
  setGlobalOpacity(opacity: number): void {
    this.globalOpacity = Math.max(0, Math.min(1, opacity));
  }

  /**
   * Scatter progress: 0 = formed, 1 = fully scattered
   * Kaydırma geçişleri için kullanılır.
   */
  setScatterProgress(progress: number): void {
    const p0 = Math.max(0, Math.min(1, progress));

    for (let i = 0; i < this.config.maxParticles; i++) {
      const particle = this.particles[i];
      if (!particle.active) continue;

      // Her parçacık için deterministik scatter yönü (origin tabanlı)
      const angle = (particle.originX * 0.01 + particle.originY * 0.013) % (Math.PI * 2);
      const dist = 300 * p0;

      particle.targetX = particle.originX + Math.cos(angle) * dist;
      particle.targetY = particle.originY + Math.sin(angle) * dist;
      particle.targetOpacity = 1 - p0 * 0.7;
    }
  }

  // ─── FARE ETKİLEŞİMİ (Mouse Interaction) ─────────────────────

  /** Fare pozisyonunu günceller (CSS piksel cinsinden, canvas'a göre) */
  updateMouse(x: number, y: number): void {
    this.mouse.x = x;
    this.mouse.y = y;
    this.mouse.active = true;
  }

  /** Fare etkileşimini devre dışı bırakır */
  clearMouse(): void {
    this.mouse.active = false;
  }

  // ─── ANİMASYON DÖNGÜSÜ (Animation Loop) ──────────────────────

  /** Animasyon döngüsünü başlatır */
  start(): void {
    if (this.animationId !== null) return;
    this.lastTime = performance.now();
    this.tick(this.lastTime);
    console.debug('[DotEngine] Animation loop started');
  }

  /** Animasyon döngüsünü durdurur */
  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      console.debug('[DotEngine] Animation loop stopped');
    }
  }

  /** Ana animasyon tick'i */
  private tick = (time: number): void => {
    this.animationId = requestAnimationFrame(this.tick);

    // Viewport dışındaysa hesaplama yapma
    if (!this.isVisible) return;

    // Delta time hesapla (saniye cinsinden, max 50ms)
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    this.update(dt);
    this.render();
  };

  /** Fizik güncelleme adımı */
  private update(dt: number): void {
    const { friction, springForce, mouseRadius, mouseForce, enableMouseInteraction, reducedMotion } = this.config;

    // Azaltılmış hareket modunda fizik atla
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
    const mx = this.mouse.x;
    const my = this.mouse.y;
    const mr2 = mouseRadius * mouseRadius;

    for (let i = 0; i < this.config.maxParticles; i++) {
      const p = this.particles[i];
      if (!p.active) continue;

      // Spring force — hedefe doğru çek
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      p.vx += dx * springForce;
      p.vy += dy * springForce;

      // Mouse repulsion
      if (mouseActive) {
        const mdx = p.x - mx;
        const mdy = p.y - my;
        const dist2 = mdx * mdx + mdy * mdy;

        if (dist2 < mr2 && dist2 > 0.01) {
          const dist = Math.sqrt(dist2);
          const force = (1 - dist / mouseRadius) * mouseForce;
          p.vx += (mdx / dist) * force * 60 * dt;
          p.vy += (mdy / dist) * force * 60 * dt;
        }
      }

      // Friction
      p.vx *= friction;
      p.vy *= friction;

      // Pozisyon güncelle
      p.x += p.vx;
      p.y += p.vy;

      // Opasite yumuşak geçiş
      p.opacity += (p.targetOpacity - p.opacity) * 0.05;
    }
  }

  /** Canvas'ı temizle ve parçacıkları çiz */
  private render(): void {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Temizle
    ctx.clearRect(0, 0, w, h);

    // Parçacıkları çiz
    for (let i = 0; i < this.config.maxParticles; i++) {
      const p = this.particles[i];
      if (!p.active) continue;

      const finalOpacity = p.opacity * this.globalOpacity;
      if (finalOpacity < 0.01) continue;

      // Ekran dışındaki parçacıkları atla
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

  // ─── OLAY DİNLEYİCİLERİ (Event Listeners) ────────────────────

  private handleMouseMove = (e: MouseEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    this.updateMouse(e.clientX - rect.left, e.clientY - rect.top);
  };

  private handleMouseLeave = (): void => {
    this.clearMouse();
  };

  private handleResize = (): void => {
    this.resize();
  };

  private bindEvents(): void {
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
    window.addEventListener('resize', this.handleResize);
  }

  private unbindEvents(): void {
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    window.removeEventListener('resize', this.handleResize);
  }

  // ─── GÖRÜNÜRLÜK GÖZLEMCİSİ (Visibility Observer) ─────────────

  private setupVisibilityObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        this.isVisible = entries[0]?.isIntersecting ?? true;
        console.debug(`[DotEngine] Visibility changed: ${this.isVisible}`);
      },
      { threshold: 0 }
    );
    this.observer.observe(this.canvas);
  }

  // ─── TEMİZLİK (Cleanup) ──────────────────────────────────────

  /** Motoru tamamen temizler ve kaynakları serbest bırakır */
  destroy(): void {
    this.stop();
    this.unbindEvents();
    this.observer?.disconnect();
    this.particles = [];
    console.debug('[DotEngine] Destroyed');
  }

  // ─── GETTER'LAR ───────────────────────────────────────────────

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
