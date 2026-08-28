/**
 * TIYATROTIST — Full-Featured Dynamic Arcade 404 Game
 *
 * High-density dot matrix 404 Brick Breaker with:
 * - Hundreds of small high-density target dots forming 404 (smaller & more numerous).
 * - Lives system (Can barı).
 * - Live Score & floating score texts.
 * - Falling Upgrade / Power-up Pills (MULTI BALL, WIDE PADDLE, SLOW MO, LASER, 2X SCORE).
 * - Laser Cannon bullets.
 * - Particle burst effects & shockwave rings upon dot impact.
 * - ZERO mouse-to-dot scatter (404 bricks stay 100% stable until hit by ball/laser).
 * - Full desktop (mouse) & mobile (touch drag) support.
 * - Pure monochrome Tiyatrotist design identity.
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { textToDots } from '@/engine/DotTypography';
import { Locale, Dictionary } from '@/dictionaries';
import CustomCursor from '@/components/CustomCursor';

interface BrickBreaker404Props {
  lang: Locale;
  dict: Dictionary;
}

interface GameDot {
  id: number;
  x: number;
  y: number;
  radius: number;
  active: boolean;
  type: 'NORMAL' | 'POWERUP' | 'SPECIAL';
  powerType?: 'MULTI' | 'WIDE' | 'SLOW' | '2X' | 'LASER';
  points: number;
}

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  speed: number;
  active: boolean;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
}

interface PowerUpPill {
  id: number;
  x: number;
  y: number;
  vy: number;
  type: 'MULTI' | 'WIDE' | 'SLOW' | '2X' | 'LASER';
  label: string;
  radius: number;
}

interface LaserBullet {
  x: number;
  y: number;
  vy: number;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  alpha: number;
}

export default function BrickBreaker404({ lang, dict }: BrickBreaker404Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'READY' | 'PLAYING' | 'GAME_OVER' | 'COMPLETED'>('READY');
  const [hasStarted, setHasStarted] = useState(false);
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);

  const pointerXRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  // Core Game Loop State
  const stateRef = useRef({
    width: 0,
    height: 0,
    balls: [] as Ball[],
    paddle: {
      x: 0,
      y: 0,
      width: 140,
      baseWidth: 140,
      height: 9,
      vx: 0,
    },
    dots: [] as GameDot[],
    particles: [] as Particle[],
    powerUps: [] as PowerUpPill[],
    lasers: [] as LaserBullet[],
    floatingTexts: [] as FloatingText[],
    score: 0,
    lives: 3,
    multiplier: 1,
    combo: 0,
    wideTimer: 0,
    slowTimer: 0,
    doubleTimer: 0,
    laserTimer: 0,
    lastTime: 0,
    hasStarted: false,
    gameState: 'READY' as 'READY' | 'PLAYING' | 'GAME_OVER' | 'COMPLETED',
  });

  // Construct target 404 dot field using DotTypography (HIGH DENSITY: SMALLER & MUCH MORE NUMEROUS DOTS)
  const init404Field = useCallback((w: number, h: number): GameDot[] => {
    const isMobile = w < 768;
    const isSmallMobile = w < 480;

    // Small, high-density dot matrix (hundreds of tiny dots forming 404)
    const fontSize = isSmallMobile ? 110 : isMobile ? 170 : 280;
    const gridSpacing = isSmallMobile ? 5 : isMobile ? 6 : 6;
    const dotRadius = isSmallMobile ? 1.6 : isMobile ? 2.0 : 2.5;

    const layout = textToDots('404', {
      fontSize,
      fontWeight: '900',
      gridSpacing,
      alphaThreshold: 75,
    });

    const centerX = w / 2;
    const centerY = h * 0.33;

    const dots: GameDot[] = [];
    let id = 0;

    layout.dots.forEach((dot, index) => {
      const x = dot.x + centerX;
      const y = dot.y + centerY;

      let type: GameDot['type'] = 'NORMAL';
      let powerType: GameDot['powerType'] = undefined;
      let points = 25;

      // ~10% Power-up dots
      if (index % 12 === 0) {
        type = 'POWERUP';
        const ptypes: GameDot['powerType'][] = ['MULTI', 'WIDE', 'SLOW', '2X', 'LASER'];
        powerType = ptypes[index % ptypes.length];
        points = 75;
      } else if (index % 25 === 0) {
        type = 'SPECIAL';
        points = 150;
      }

      dots.push({
        id: ++id,
        x,
        y,
        radius: dotRadius,
        active: true,
        type,
        powerType,
        points,
      });
    });

    return dots;
  }, []);

  // Spawn particle explosion when dot/brick is hit
  const spawnBurst = (x: number, y: number, count: number, baseRadius = 2.0) => {
    if (reducedMotionRef.current) return;
    const parts: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 1.2;
      parts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * baseRadius + 0.8,
        alpha: 1,
        decay: Math.random() * 0.04 + 0.02,
      });
    }
    stateRef.current.particles.push(...parts);
  };

  // Launch / Reset Ball attached to paddle top center
  const resetBallOnPaddle = useCallback(() => {
    const s = stateRef.current;
    const p = s.paddle;
    const speed = s.width < 768 ? 10.5 : 13.5;
    const angle = (-Math.PI / 3) + (Math.random() - 0.5) * (Math.PI / 3);

    s.balls = [
      {
        id: Math.random(),
        x: p.x + p.width / 2,
        y: p.y - 8,
        vx: Math.cos(angle) * speed,
        vy: -Math.abs(Math.sin(angle) * speed),
        radius: 6,
        speed,
        active: true,
        trail: [],
      },
    ];
  }, []);

  // Restart match cleanly
  const restartGame = useCallback(() => {
    const s = stateRef.current;
    s.score = 0;
    s.lives = 3;
    s.multiplier = 1;
    s.combo = 0;
    s.wideTimer = 0;
    s.slowTimer = 0;
    s.doubleTimer = 0;
    s.laserTimer = 0;
    s.particles = [];
    s.powerUps = [];
    s.lasers = [];
    s.floatingTexts = [];
    s.paddle.width = s.paddle.baseWidth;
    s.dots = init404Field(s.width, s.height);
    s.gameState = 'READY';

    setScore(0);
    setLives(3);
    setGameState('READY');
    setHasStarted(false);
    setActivePowerUp(null);

    resetBallOnPaddle();
  }, [init404Field, resetBallOnPaddle]);

  // Handle pointer interactions (mouse & touch)
  useEffect(() => {
    reducedMotionRef.current = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

    const handlePointerMove = (e: PointerEvent) => {
      pointerXRef.current = e.clientX;

      if (!stateRef.current.hasStarted && stateRef.current.gameState === 'READY') {
        stateRef.current.hasStarted = true;
        stateRef.current.gameState = 'PLAYING';
        setHasStarted(true);
        setGameState('PLAYING');
      }
    };

    const handlePointerDown = () => {
      if (!stateRef.current.hasStarted && stateRef.current.gameState === 'READY') {
        stateRef.current.hasStarted = true;
        stateRef.current.gameState = 'PLAYING';
        setHasStarted(true);
        setGameState('PLAYING');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        if (stateRef.current.gameState === 'GAME_OVER' || stateRef.current.gameState === 'COMPLETED') {
          restartGame();
        } else if (stateRef.current.gameState === 'READY') {
          stateRef.current.hasStarted = true;
          stateRef.current.gameState = 'PLAYING';
          setHasStarted(true);
          setGameState('PLAYING');
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [restartGame]);

  // Main Canvas & Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);

      const s = stateRef.current;
      s.width = w;
      s.height = h;

      // Position paddle at bottom
      s.paddle.baseWidth = Math.min(Math.max(w * 0.18, 130), 220);
      s.paddle.width = s.wideTimer > 0 ? s.paddle.baseWidth * 1.5 : s.paddle.baseWidth;
      s.paddle.height = 9;
      s.paddle.x = (w - s.paddle.width) / 2;
      s.paddle.y = h - (w < 768 ? 75 : 65);

      if (s.dots.length === 0) {
        s.dots = init404Field(w, h);
        resetBallOnPaddle();
      }
    };

    resize();
    window.addEventListener('resize', resize);

    stateRef.current.lastTime = performance.now();

    // ─── TICK & RENDER ───────────────────────────────
    const loop = (time: number) => {
      animId = requestAnimationFrame(loop);

      const s = stateRef.current;
      const dt = Math.min((time - s.lastTime) / 1000, 0.033);
      s.lastTime = time;

      const w = s.width;
      const h = s.height;
      const p = s.paddle;

      // 1. PADDLE MOVEMENT
      if (pointerXRef.current !== null) {
        const targetX = pointerXRef.current - p.width / 2;
        p.vx = targetX - p.x;
        p.x += (targetX - p.x) * 0.85; // Snappy 1:1 tracking
      }
      p.x = Math.max(12, Math.min(w - 12 - p.width, p.x));

      // 2. POWER-UP TIMERS
      if (s.wideTimer > 0) {
        s.wideTimer -= dt;
        if (s.wideTimer <= 0) {
          p.width = p.baseWidth;
          setActivePowerUp(null);
        }
      }
      if (s.doubleTimer > 0) {
        s.doubleTimer -= dt;
        s.multiplier = 2;
        if (s.doubleTimer <= 0) {
          s.multiplier = 1;
          setActivePowerUp(null);
        }
      }
      if (s.slowTimer > 0) {
        s.slowTimer -= dt;
        if (s.slowTimer <= 0) setActivePowerUp(null);
      }
      if (s.laserTimer > 0) {
        s.laserTimer -= dt;
        if (Math.random() < 0.18) {
          s.lasers.push(
            { x: p.x + 12, y: p.y - 4, vy: -14 },
            { x: p.x + p.width - 12, y: p.y - 4, vy: -14 }
          );
        }
        if (s.laserTimer <= 0) setActivePowerUp(null);
      }

      // 3. LASER BULLETS
      for (let i = s.lasers.length - 1; i >= 0; i--) {
        const l = s.lasers[i];
        l.y += l.vy;

        if (l.y < 10) {
          s.lasers.splice(i, 1);
          continue;
        }

        // Collision with dots
        for (const dot of s.dots) {
          if (!dot.active) continue;
          const dx = l.x - dot.x;
          const dy = l.y - dot.y;
          if (dx * dx + dy * dy < (dot.radius + 6) * (dot.radius + 6)) {
            dot.active = false;
            s.score += dot.points * s.multiplier;
            setScore(s.score);
            spawnBurst(dot.x, dot.y, 8, dot.radius);
            s.lasers.splice(i, 1);
            break;
          }
        }
      }

      // 4. POWER-UP PILLS FALLING & CATCHING
      for (let i = s.powerUps.length - 1; i >= 0; i--) {
        const pill = s.powerUps[i];
        pill.y += pill.vy;

        // Catch with paddle
        if (
          pill.y + pill.radius >= p.y &&
          pill.y - pill.radius <= p.y + p.height &&
          pill.x >= p.x - 6 &&
          pill.x <= p.x + p.width + 6
        ) {
          if (pill.type === 'MULTI') {
            const extraBalls: Ball[] = [];
            s.balls.forEach((b) => {
              extraBalls.push(
                { id: Math.random(), x: b.x, y: b.y, vx: b.vx - 3, vy: b.vy, radius: b.radius, speed: b.speed, active: true, trail: [] },
                { id: Math.random(), x: b.x, y: b.y, vx: b.vx + 3, vy: b.vy, radius: b.radius, speed: b.speed, active: true, trail: [] }
              );
            });
            s.balls.push(...extraBalls);
            setActivePowerUp('MULTI BALL');
          } else if (pill.type === 'WIDE') {
            s.wideTimer = 10;
            p.width = p.baseWidth * 1.5;
            setActivePowerUp('WIDE PADDLE');
          } else if (pill.type === 'SLOW') {
            s.slowTimer = 8;
            s.balls.forEach((b) => {
              b.vx *= 0.65;
              b.vy *= 0.65;
            });
            setActivePowerUp('SLOW MOTION');
          } else if (pill.type === '2X') {
            s.doubleTimer = 12;
            setActivePowerUp('2X SCORE');
          } else if (pill.type === 'LASER') {
            s.laserTimer = 8;
            setActivePowerUp('LASER CANNON');
          }

          s.floatingTexts.push({
            id: Math.random(),
            x: pill.x,
            y: p.y - 14,
            text: `+ ${pill.label}`,
            alpha: 1,
          });

          spawnBurst(pill.x, pill.y, 12, 3);
          s.powerUps.splice(i, 1);
          continue;
        }

        if (pill.y > h + 20) {
          s.powerUps.splice(i, 1);
        }
      }

      // 5. BALL PHYSICS & COLLISIONS (ONLY IN PLAYING STATE)
      if (s.gameState === 'READY') {
        if (s.balls.length > 0) {
          s.balls[0].x = p.x + p.width / 2;
          s.balls[0].y = p.y - s.balls[0].radius - 2;
          s.balls[0].trail = [];
        }
      } else if (s.gameState === 'PLAYING') {
        const steps = 4;
        const subDt = dt / steps;

        for (let bi = s.balls.length - 1; bi >= 0; bi--) {
          const b = s.balls[bi];
          if (!b.active) continue;

          b.trail.push({ x: b.x, y: b.y, alpha: 0.6 });
          if (b.trail.length > 6) b.trail.shift();
          b.trail.forEach((t) => (t.alpha -= 0.08));

          for (let step = 0; step < steps; step++) {
            b.x += b.vx * (subDt * 60);
            b.y += b.vy * (subDt * 60);

            // Left Wall
            if (b.x - b.radius < 10) {
              b.x = 10 + b.radius;
              b.vx = Math.abs(b.vx);
              spawnBurst(b.x, b.y, 4, 1.5);
            }
            // Right Wall
            else if (b.x + b.radius > w - 10) {
              b.x = w - 10 - b.radius;
              b.vx = -Math.abs(b.vx);
              spawnBurst(b.x, b.y, 4, 1.5);
            }

            // Top Wall
            if (b.y - b.radius < 10) {
              b.y = 10 + b.radius;
              b.vy = Math.abs(b.vy);
              spawnBurst(b.x, b.y, 4, 1.5);
            }

            // Paddle Collision
            if (
              b.y + b.radius >= p.y &&
              b.y - b.radius <= p.y + p.height &&
              b.x >= p.x - b.radius &&
              b.x <= p.x + p.width + b.radius &&
              b.vy > 0
            ) {
              b.y = p.y - b.radius;

              const hitOffset = (b.x - (p.x + p.width / 2)) / (p.width / 2);
              const maxAngle = (Math.PI / 180) * 65;
              const angle = hitOffset * maxAngle;

              b.speed = Math.min(b.speed + 0.15, w < 768 ? 16 : 20);

              b.vx = Math.sin(angle) * b.speed + p.vx * 0.15;
              b.vy = -Math.abs(Math.cos(angle) * b.speed);

              s.combo = 0;
              spawnBurst(b.x, p.y, 8, 2);
            }

            // 404 Dot Collision (NO CURSOR SCATTER — STABLE 404 GRID DOTS)
            for (let i = 0; i < s.dots.length; i++) {
              const dot = s.dots[i];
              if (!dot.active) continue;

              const dx = b.x - dot.x;
              const dy = b.y - dot.y;
              const distSq = dx * dx + dy * dy;
              const minDist = dot.radius + b.radius;

              if (distSq < minDist * minDist) {
                // Destroy Dot
                dot.active = false;

                // Add Score & Multiplier
                s.combo++;
                const gained = (dot.points + s.combo * 5) * s.multiplier;
                s.score += gained;
                setScore(s.score);

                // Floating score text
                s.floatingTexts.push({
                  id: Math.random(),
                  x: dot.x,
                  y: dot.y - 10,
                  text: `+${gained}`,
                  alpha: 1,
                });

                // Particle explosion burst
                spawnBurst(dot.x, dot.y, 10, dot.radius * 1.2);

                // Drop Upgrade Pill (~10% chance)
                if (dot.type === 'POWERUP' && dot.powerType) {
                  const labels: Record<string, string> = {
                    MULTI: 'MULTI',
                    WIDE: 'WIDE',
                    SLOW: 'SLOW',
                    '2X': '2X',
                    LASER: 'LASER',
                  };
                  s.powerUps.push({
                    id: Math.random(),
                    x: dot.x,
                    y: dot.y,
                    vy: 2.5,
                    type: dot.powerType,
                    label: labels[dot.powerType] || 'POWER',
                    radius: 8,
                  });
                }

                // Bounce angle reflection
                const dist = Math.sqrt(distSq) || 0.001;
                const nx = dx / dist;
                const ny = dy / dist;
                const dotProduct = b.vx * nx + b.vy * ny;
                b.vx = b.vx - 2 * dotProduct * nx;
                b.vy = b.vy - 2 * dotProduct * ny;

                break;
              }
            }

            // Ball fell below screen
            if (b.y > h + 30) {
              s.balls.splice(bi, 1);
            }
          }
        }

        // Life Loss Check
        if (s.balls.length === 0) {
          s.lives--;
          setLives(s.lives);

          if (s.lives <= 0) {
            s.gameState = 'GAME_OVER';
            setGameState('GAME_OVER');
          } else {
            resetBallOnPaddle();
          }
        }

        // Check Completion (All 404 dots destroyed)
        const remaining = s.dots.filter((d) => d.active).length;
        if (remaining === 0) {
          s.gameState = 'COMPLETED';
          setGameState('COMPLETED');
        }
      }

      // ─── 6. RENDER PURE BLACK ARENA ─────────────────
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      // Render Ball Motion Trail
      s.balls.forEach((b) => {
        b.trail.forEach((t) => {
          if (t.alpha <= 0) return;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, t.alpha * 0.35)})`;
          ctx.beginPath();
          ctx.arc(t.x, t.y, b.radius * 0.7, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // Render 404 Dots (Stable position — NO cursor scatter!)
      s.dots.forEach((dot) => {
        if (!dot.active) return;
        if (dot.type === 'POWERUP') {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius + 1.5, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Render Falling Upgrade Pills
      s.powerUps.forEach((pill) => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect?.(pill.x - 20, pill.y - 8, 40, 16, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '600 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pill.label, pill.x, pill.y + 0.5);
      });

      // Render Laser Bullets
      ctx.fillStyle = '#ffffff';
      s.lasers.forEach((l) => {
        ctx.fillRect(l.x - 1.5, l.y, 3, 10);
      });

      // Render Particle Burst Explosions
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const pt = s.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= pt.decay;

        if (pt.alpha <= 0) {
          s.particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${pt.alpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Floating Score Texts
      for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
        const ft = s.floatingTexts[i];
        ft.y -= 0.8;
        ft.alpha -= 0.03;

        if (ft.alpha <= 0) {
          s.floatingTexts.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${ft.alpha})`;
        ctx.font = '500 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
      }

      // Render Balls
      if (s.gameState === 'READY' || s.gameState === 'PLAYING') {
        s.balls.forEach((b) => {
          if (!b.active) return;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Render Minimal Paddle
      if (s.gameState === 'READY' || s.gameState === 'PLAYING') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.x, p.y, p.width, p.height);
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [init404Field, resetBallOnPaddle]);

  const n = dict.notFound;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#000000',
        touchAction: 'none',
      }}
    >
      <CustomCursor />

      {/* Canvas view for 404 Brick Breaker */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      {/* HUD Bar (Score, Powerup, Lives/Can Barı) */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          left: 0,
          width: '100%',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 5,
          pointerEvents: 'none',
          fontFamily: 'monospace',
        }}
      >
        {/* Score */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(255, 255, 255, 0.4)' }}>
            SCORE
          </span>
          <span style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', letterSpacing: '0.1em' }}>
            {score.toString().padStart(5, '0')}
          </span>
        </div>

        {/* Active Upgrade Badge */}
        {activePowerUp && (
          <div
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: '#ffffff',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '0.3rem 0.8rem',
              borderRadius: '4px',
            }}
          >
            [ {activePowerUp} ]
          </div>
        )}

        {/* Lives (Can Barı) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(255, 255, 255, 0.4)' }}>
            LIVES
          </span>
          <span style={{ fontSize: '0.9rem', color: '#ffffff', letterSpacing: '0.2em' }}>
            {'● '.repeat(Math.max(0, lives)).trim() || '○'}
          </span>
        </div>
      </div>

      {/* Top Tag Header */}
      <div
        style={{
          position: 'absolute',
          top: '2.5rem',
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.3em',
            color: 'rgba(255, 255, 255, 0.3)',
          }}
        >
          {n.tag}
        </span>
      </div>

      {/* Static Non-Interactive Subtitle Under 404 */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(35vh + 120px)',
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontSize: '0.9rem',
            fontWeight: 300,
            letterSpacing: '0.25em',
            color: 'rgba(255, 255, 255, 0.45)',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {lang === 'tr' ? 'SAYFA BULUNAMADI' : 'PAGE NOT FOUND'}
        </p>
      </div>

      {/* READY state cue */}
      {!hasStarted && gameState === 'READY' && (
        <div
          style={{
            position: 'absolute',
            bottom: '12vh',
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: 'rgba(255, 255, 255, 0.35)',
            }}
          >
            {lang === 'tr' ? '[ BAŞLAMAK İÇİN DOKUN / HAREKET ETTİR ]' : '[ TAP / MOVE TO PLAY ]'}
          </span>
        </div>
      )}

      {/* GAME_OVER Overlay */}
      {gameState === 'GAME_OVER' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              color: 'rgba(255, 255, 255, 0.4)',
            }}
          >
            {n.tag}
          </span>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 300,
              letterSpacing: '0.1em',
              color: '#ffffff',
            }}
          >
            {n.survivedMessage}
          </h2>

          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <button
              onClick={restartGame}
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                padding: '0.75rem 1.75rem',
                background: 'none',
                cursor: 'pointer',
              }}
              data-cursor="expand"
            >
              {n.restartBtn}
            </button>
            <Link
              href={`/${lang}`}
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
                color: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '0.75rem 1.75rem',
                textDecoration: 'none',
              }}
              data-cursor="expand"
            >
              {n.returnHomeBtn}
            </Link>
          </div>
        </div>
      )}

      {/* COMPLETED Overlay */}
      {gameState === 'COMPLETED' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            backgroundColor: '#000000',
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              color: 'rgba(255, 255, 255, 0.4)',
            }}
          >
            {n.tag}
          </span>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 300,
              letterSpacing: '0.1em',
              color: '#ffffff',
            }}
          >
            {n.completedMessage}
          </h2>

          <Link
            href={`/${lang}`}
            style={{
              fontSize: '0.8rem',
              letterSpacing: '0.2em',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              padding: '0.85rem 2rem',
              textDecoration: 'none',
            }}
            data-cursor="expand"
          >
            {n.returnHomeBtn}
          </Link>
        </div>
      )}
    </div>
  );
}
