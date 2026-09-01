/**
 * TIYATROTIST — Full-Screen "404" Dot Breaker (Easter Egg)
 *
 * Full-screen edge-to-edge arena where destructible target bricks form
 * the exact shape of a giant "404" made out of small dot matrix typography.
 *
 * Features:
 * - 100vw × 100vh full-screen responsive playfield.
 * - Destructible small dots arranged into giant "4", "0", "4" numbers.
 * - Power-up capsules (MULTI BALL, WIDE PADDLE, SLOW MOTION, 2X, LASER).
 * - Paddle physics with angle deflection and laser cannons.
 * - Burst -> Scatter particle destruction and shockwaves.
 * - Zero "Error" or "Page Not Found" UI.
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

interface GameDot {
  id: number;
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  active: boolean;
  type: 'NORMAL' | 'SPECIAL' | 'POWERUP' | 'MYSTERY';
  powerType?: 'MULTI' | 'WIDE' | 'SLOW' | '2X' | 'LASER';
  points: number;
  hitTimer: number;
  seed: number;
  digit: '4' | '0' | 'HALO';
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  speed: number;
  active: boolean;
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
  active: boolean;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  alpha: number;
}

import { textToDots } from '@/engine/DotTypography';

interface GameDot {
  id: number;
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  active: boolean;
  type: 'NORMAL' | 'SPECIAL' | 'POWERUP' | 'MYSTERY';
  powerType?: 'MULTI' | 'WIDE' | 'SLOW' | '2X' | 'LASER';
  points: number;
  hitTimer: number;
  seed: number;
  digit: '4' | '0' | 'HALO';
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  speed: number;
  active: boolean;
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
  active: boolean;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  alpha: number;
}

export default function FullScreenDotBreaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [hasStarted, setHasStarted] = useState(false);
  const [gameState, setGameState] = useState<'PLAYING' | 'WIN' | 'GAMEOVER'>('PLAYING');
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);
  const [secretToast, setSecretToast] = useState<string | null>(null);

  // Input state refs
  const leftPressed = useRef(false);
  const rightPressed = useRef(false);
  const pointerX = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  // Core full-screen game state
  const stateRef = useRef({
    width: 0,
    height: 0,
    balls: [] as Ball[],
    paddle: {
      x: 0,
      y: 0,
      width: 140,
      baseWidth: 140,
      height: 8,
      speed: 12,
    },
    dots: [] as GameDot[],
    particles: [] as Particle[],
    powerUps: [] as PowerUpPill[],
    lasers: [] as LaserBullet[],
    floatingTexts: [] as FloatingText[],
    timeOffset: 0,
    score: 0,
    lives: 3,
    multiplier: 1,
    combo: 0,
    laserTimer: 0,
    wideTimer: 0,
    slowTimer: 0,
    doubleTimer: 0,
    baseBallSpeed: 7.8,
    maxBallSpeed: 16.0,
    hasStarted: false,
    gameState: 'PLAYING' as 'PLAYING' | 'WIN' | 'GAMEOVER',
  });

  // Construct target dots forming massive, 2x larger "404" using DotTypography
  const init404DotField = useCallback((w: number, h: number): GameDot[] => {
    const isMobile = w < 768;
    const isSmallMobile = w < 480;

    // 2x LARGER font size for 404
    const fontSize = isSmallMobile ? 110 : isMobile ? 180 : 280;
    const gridSpacing = isSmallMobile ? 9 : isMobile ? 10 : 12;
    const dotRadius = isMobile ? 3.5 : 4.8;

    const layout = textToDots('404', {
      fontSize,
      fontWeight: '900', // Massive bold weight
      gridSpacing,
      alphaThreshold: 80,
    });

    const centerX = w / 2;
    const centerY = h * 0.32;

    const dots: GameDot[] = [];
    let id = 0;

    layout.dots.forEach((dotCoords, index) => {
      const x = dotCoords.x + centerX;
      const y = dotCoords.y + centerY;

      let type: GameDot['type'] = 'NORMAL';
      let powerType: GameDot['powerType'] = undefined;
      let points = 50;
      let radius = dotRadius;

      // Power-Up dots (~10% chance)
      if (index % 10 === 0) {
        type = 'POWERUP';
        const ptypes: GameDot['powerType'][] = ['MULTI', 'WIDE', 'SLOW', '2X', 'LASER'];
        powerType = ptypes[index % ptypes.length];
        radius = dotRadius * 1.2;
        points = 120;
      } else if (index % 23 === 0) {
        type = 'MYSTERY';
        points = 404;
        radius = dotRadius * 1.35;
      }

      dots.push({
        id: ++id,
        x,
        y,
        originX: x,
        originY: y,
        vx: 0,
        vy: 0,
        radius,
        active: true,
        type,
        powerType,
        points,
        hitTimer: 0,
        seed: Math.random() * 100,
        digit: '4',
      });
    });

    return dots;
  }, []);

  // Brief subtle pop effect in place when dot is destroyed (classic Brick Breaker style)
  const spawnBurst = (x: number, y: number, count: number, baseRadius = 2.0) => {
    if (reducedMotionRef.current) return;
    const parts: Particle[] = [];
    // Small in-place pop/flash, zero scattering across screen
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5; // Very slow local pop
      parts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * baseRadius + 0.5,
        alpha: 0.9,
        decay: 0.08, // Quick disappear in place
      });
    }
    stateRef.current.particles.push(...parts);
  };


  // Reset ball attached to paddle
  const resetBallOnPaddle = useCallback(() => {
    const s = stateRef.current;
    const p = s.paddle;
    s.balls = [
      {
        x: p.x + p.width / 2,
        y: p.y - 12,
        vx: (Math.random() - 0.5) * 4.0,
        vy: -s.baseBallSpeed,
        radius: 6.5,
        speed: s.baseBallSpeed,
        active: true,
      },
    ];
  }, []);

  // Restart match
  const restartGame = useCallback(() => {
    const s = stateRef.current;
    s.score = 0;
    s.lives = 3;
    s.multiplier = 1;
    s.combo = 0;
    s.laserTimer = 0;
    s.wideTimer = 0;
    s.slowTimer = 0;
    s.doubleTimer = 0;
    s.paddle.width = s.paddle.baseWidth;
    s.particles = [];
    s.powerUps = [];
    s.lasers = [];
    s.floatingTexts = [];
    s.dots = init404DotField(s.width, s.height);
    s.gameState = 'PLAYING';
    s.hasStarted = true;

    setScore(0);
    setLives(3);
    setGameState('PLAYING');
    setHasStarted(true);
    setActivePowerUp(null);
    setSecretToast(null);

    resetBallOnPaddle();
  }, [init404DotField, resetBallOnPaddle]);

  // Keyboard controls
  useEffect(() => {
    reducedMotionRef.current = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        leftPressed.current = true;
        if (!stateRef.current.hasStarted) {
          stateRef.current.hasStarted = true;
          setHasStarted(true);
        }
      }
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        rightPressed.current = true;
        if (!stateRef.current.hasStarted) {
          stateRef.current.hasStarted = true;
          setHasStarted(true);
        }
      }
      if (e.code === 'Space') {
        if (!stateRef.current.hasStarted) {
          stateRef.current.hasStarted = true;
          setHasStarted(true);
        }
        if (stateRef.current.gameState !== 'PLAYING') {
          restartGame();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        leftPressed.current = false;
      }
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        rightPressed.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [restartGame]);

  // Canvas & Physics Loop across Full Viewport
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

      // Position paddle at bottom of screen
      s.paddle.baseWidth = Math.min(Math.max(w * 0.14, 120), 200);
      s.paddle.width = s.wideTimer > 0 ? s.paddle.baseWidth * 1.5 : s.paddle.baseWidth;
      s.paddle.x = (w - s.paddle.width) / 2;
      s.paddle.y = h - (w < 768 ? 65 : 55);

      if (s.dots.length === 0) {
        s.dots = init404DotField(w, h);
        resetBallOnPaddle();
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Global Pointer tracking
    const handleGlobalPointerMove = (e: PointerEvent) => {
      pointerX.current = e.clientX;
      if (!stateRef.current.hasStarted) {
        stateRef.current.hasStarted = true;
        setHasStarted(true);
      }
    };

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });

    // Main animation & game loop
    const loop = () => {
      animId = requestAnimationFrame(loop);

      const s = stateRef.current;
      const w = s.width;
      const h = s.height;
      const p = s.paddle;

      s.timeOffset += 0.016;

      // ─── 1. PADDLE MOVEMENT ────────────────────────
      if (pointerX.current !== null) {
        const targetX = pointerX.current - p.width / 2;
        p.x += (targetX - p.x) * 0.35;
      } else {
        if (leftPressed.current) p.x -= p.speed;
        if (rightPressed.current) p.x += p.speed;
      }

      // Clamp paddle
      p.x = Math.max(16, Math.min(w - 16 - p.width, p.x));

      // ─── 2. POWER-UP TIMERS ────────────────────────
      if (s.wideTimer > 0) {
        s.wideTimer -= 0.016;
        if (s.wideTimer <= 0) {
          p.width = p.baseWidth;
          setActivePowerUp(null);
        }
      }
      if (s.doubleTimer > 0) {
        s.doubleTimer -= 0.016;
        s.multiplier = 2;
        if (s.doubleTimer <= 0) {
          s.multiplier = 1;
          setActivePowerUp(null);
        }
      }
      if (s.slowTimer > 0) {
        s.slowTimer -= 0.016;
        if (s.slowTimer <= 0) setActivePowerUp(null);
      }
      if (s.laserTimer > 0) {
        s.laserTimer -= 0.016;
        if (Math.random() < 0.15) {
          s.lasers.push(
            { x: p.x + 12, y: p.y - 4, vy: -12, active: true },
            { x: p.x + p.width - 12, y: p.y - 4, vy: -12, active: true }
          );
        }
        if (s.laserTimer <= 0) setActivePowerUp(null);
      }

      // ─── 3. LASER BULLETS ──────────────────────────
      for (let i = s.lasers.length - 1; i >= 0; i--) {
        const l = s.lasers[i];
        l.y += l.vy;

        if (l.y < 10) {
          s.lasers.splice(i, 1);
          continue;
        }

        // Check collision with dots
        for (const dot of s.dots) {
          if (!dot.active) continue;
          const dx = l.x - dot.x;
          const dy = l.y - dot.y;
          if (dx * dx + dy * dy < (dot.radius + 5) * (dot.radius + 5)) {
            dot.active = false;
            l.active = false;
            s.score += dot.points * s.multiplier;
            setScore(s.score);
            spawnBurst(dot.x, dot.y, 14, dot.radius);
            s.lasers.splice(i, 1);
            break;
          }
        }
      }

      // ─── 4. POWER-UP PILLS ─────────────────────────
      for (let i = s.powerUps.length - 1; i >= 0; i--) {
        const pill = s.powerUps[i];
        pill.y += pill.vy;

        // Catch power-up with paddle
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
                { x: b.x, y: b.y, vx: b.vx - 2.5, vy: b.vy, radius: b.radius, speed: b.speed, active: true },
                { x: b.x, y: b.y, vx: b.vx + 2.5, vy: b.vy, radius: b.radius, speed: b.speed, active: true }
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
            y: p.y - 12,
            text: `+ ${pill.label}`,
            alpha: 1,
          });

          spawnBurst(pill.x, pill.y, 10, 2.5);
          s.powerUps.splice(i, 1);
          continue;
        }

        if (pill.y > h + 20) {
          s.powerUps.splice(i, 1);
        }
      }

      // ─── 5. BALLS PHYSICS & 404 DOT DESTRUCTION ────
      if (s.hasStarted && s.gameState === 'PLAYING') {
        for (let bi = s.balls.length - 1; bi >= 0; bi--) {
          const b = s.balls[bi];
          if (!b.active) continue;

          b.x += b.vx;
          b.y += b.vy;

          // Left & Right screen edges
          if (b.x - b.radius < 0) {
            b.x = b.radius;
            b.vx = Math.abs(b.vx);
            spawnBurst(b.x, b.y, 4, 1.5);
          } else if (b.x + b.radius > w) {
            b.x = w - b.radius;
            b.vx = -Math.abs(b.vx);
            spawnBurst(b.x, b.y, 4, 1.5);
          }

          // Top screen edge
          if (b.y - b.radius < 0) {
            b.y = b.radius;
            b.vy = Math.abs(b.vy);
            spawnBurst(b.x, b.y, 5, 1.8);
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
            const maxAngle = (Math.PI / 180) * 62;
            const angle = hitOffset * maxAngle;

            const currentSpeed = Math.min(b.speed + 0.12, s.maxBallSpeed);
            b.speed = currentSpeed;
            b.vx = Math.sin(angle) * currentSpeed;
            b.vy = -Math.cos(angle) * currentSpeed;

            s.combo = 0;
            spawnBurst(b.x, p.y, 10, 2.5);

            // Upward shockwave ripple to 404 dots
            s.dots.forEach((dot) => {
              if (!dot.active) return;
              const dy = dot.y - p.y;
              if (Math.abs(dy) < 240) {
                dot.vy -= 2.8 * (1 - Math.abs(dy) / 240);
              }
            });
          }

          // "404" Dot Collision
          for (const dot of s.dots) {
            if (!dot.active) continue;

            const dx = b.x - dot.x;
            const dy = b.y - dot.y;
            const distSq = dx * dx + dy * dy;
            const minDist = dot.radius + b.radius;

            if (distSq < minDist * minDist) {
              // Destroy Dot (Vanish cleanly in place like classic Brick Breaker)
              dot.active = false;

              // Elastic bounce
              const dist = Math.sqrt(distSq) || 0.001;
              const nx = dx / dist;
              const ny = dy / dist;
              const dotProduct = b.vx * nx + b.vy * ny;
              b.vx = b.vx - 2 * dotProduct * nx;
              b.vy = b.vy - 2 * dotProduct * ny;

              // Add Score
              s.combo++;
              const gained = (dot.points + s.combo * 15) * s.multiplier;
              s.score += gained;
              setScore(s.score);

              // Floating score
              s.floatingTexts.push({
                id: Math.random(),
                x: dot.x,
                y: dot.y - 10,
                text: `+${gained}`,
                alpha: 1,
              });

              // Subtle pop ring in place
              spawnBurst(dot.x, dot.y, 6, dot.radius);

              // Mystery Dot Secret
              if (dot.type === 'MYSTERY') {
                setSecretToast('✦ CORE 404 MATRIX SHATTERED ✦');
                spawnBurst(w / 2, h * 0.25, 20, 4);
              }

              // Power-up Drop
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
                  vy: 2.4,
                  type: dot.powerType,
                  label: labels[dot.powerType] || 'POWER',
                  radius: 8,
                });
              }

              if (s.combo === 8) {
                setSecretToast('COMBO x8: 404 RESONANCE');
              }

              break;
            }
          }

          // Ball fell below screen bottom
          if (b.y > h + 30) {
            s.balls.splice(bi, 1);
          }
        }

        // Life lost
        if (s.balls.length === 0) {
          s.lives--;
          setLives(s.lives);

          if (s.lives <= 0) {
            s.gameState = 'GAMEOVER';
            setGameState('GAMEOVER');
          } else {
            resetBallOnPaddle();
          }
        }

        // Win condition: All 404 dots destroyed
        const remaining = s.dots.filter((d) => d.active).length;
        if (remaining === 0 && s.gameState === 'PLAYING') {
          s.gameState = 'WIN';
          setGameState('WIN');
          setSecretToast("You found something that wasn't supposed to be here.");
          spawnBurst(w / 2, h / 2, 40, 6);
        }
      }

      // ─── 6. STATIC 404 TARGET DOT POSITIONING (NO SCATTER) ──
      s.dots.forEach((dot) => {
        if (!dot.active) return;
        dot.x = dot.originX;
        dot.y = dot.originY;
      });

      // ─── 7. RENDER FULL-SCREEN ARENA ───────────────
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      // Draw "404" Small Dots
      s.dots.forEach((dot) => {
        if (!dot.active) return;

        const pulse = dot.hitTimer * 3.0;
        const r = dot.radius + pulse;

        if (dot.type === 'MYSTERY') {
          // Central mystery dot
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, r * 2.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
          ctx.fill();
        } else if (dot.type === 'POWERUP') {
          // Power-up dot with outer ring
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, r + 2.5, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
          ctx.fill();
        } else if (dot.type === 'SPECIAL') {
          // Special dot
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Standard "404" small dot
          ctx.fillStyle = dot.digit === 'HALO' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.85)';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Power-Up Falling Pills
      s.powerUps.forEach((pill) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
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

      // Draw Lasers
      ctx.fillStyle = '#ffffff';
      s.lasers.forEach((l) => {
        ctx.fillRect(l.x - 1, l.y, 2.5, 10);
      });

      // Draw Sleek Minimal Paddle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect?.(p.x, p.y, p.width, p.height, 3);
      ctx.fill();

      // Draw Balls
      s.balls.forEach((b) => {
        if (!b.active) return;

        // Glow
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * 2.4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Burst Particles
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

      // Draw Floating Scores
      for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
        const ft = s.floatingTexts[i];
        ft.y -= 0.8;
        ft.alpha -= 0.025;

        if (ft.alpha <= 0) {
          s.floatingTexts.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${ft.alpha})`;
        ctx.font = '500 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handleGlobalPointerMove);
    };
  }, [init404DotField, resetBallOnPaddle]);

  return (
    <div className="fs-breaker-root">
      {/* Full Screen Viewport Canvas */}
      <canvas ref={canvasRef} className="fs-breaker-canvas" />

      {/* Secret Toast if triggered */}
      {secretToast && (
        <div className="fs-breaker-toast">
          <span>{secretToast}</span>
        </div>
      )}

      {/* Minimal Top HUD Bar */}
      <div className="fs-breaker-hud">
        <div className="fs-breaker-stat">
          <span className="fs-breaker-stat__label">SCORE</span>
          <span className="fs-breaker-stat__val">{score.toString().padStart(5, '0')}</span>
        </div>

        {activePowerUp && (
          <div className="fs-breaker-badge">
            <span>[ {activePowerUp} ]</span>
          </div>
        )}

        <div className="fs-breaker-stat">
          <span className="fs-breaker-stat__val fs-breaker-lives">
            {'● '.repeat(Math.max(0, lives)).trim() || '○'}
          </span>
        </div>
      </div>

      {/* Subtle "Move to play" initial cue */}
      {!hasStarted && gameState === 'PLAYING' && (
        <div className="fs-breaker-hint">
          <span className="fs-breaker-hint__text">Move to play</span>
        </div>
      )}

      {/* Minimal "One more?" Game Over Overlay */}
      {gameState === 'GAMEOVER' && (
        <div className="fs-breaker-overlay">
          <h2 className="fs-breaker-overlay__prompt">One more?</h2>
          <div className="fs-breaker-btn-group">
            <button onClick={restartGame} className="fs-breaker-btn" data-cursor="expand">
              Play
            </button>
            <Link href="/" className="fs-breaker-btn fs-breaker-btn--secondary" data-cursor="expand">
              Return
            </Link>
          </div>
        </div>
      )}

      {/* Completion Easter Egg Overlay */}
      {gameState === 'WIN' && (
        <div className="fs-breaker-overlay">
          <h2 className="fs-breaker-overlay__secret">
            “You found something that wasn&apos;t supposed to be here.”
          </h2>
          <div className="fs-breaker-btn-group">
            <button onClick={restartGame} className="fs-breaker-btn" data-cursor="expand">
              Play again
            </button>
            <Link href="/" className="fs-breaker-btn fs-breaker-btn--secondary" data-cursor="expand">
              Index
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
