/**
 * TIYATROTIST — Hidden Dot Breaker 404 Easter Egg
 *
 * Expansive, widescreen dot brick breaker where the target dots are
 * arranged in the shape of giant "4 0 4" dot typography.
 * Monochrome, physics, power-ups, paddle controls, particle bursts, and easter eggs.
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

interface TargetDot {
  id: number;
  x: number;
  y: number;
  originX: number;
  originY: number;
  radius: number;
  active: boolean;
  type: 'NORMAL' | 'SPECIAL' | 'POWERUP' | 'MYSTERY';
  powerType?: 'MULTI' | 'WIDE' | 'SLOW' | '2X' | 'LASER';
  points: number;
  hitTimer: number;
  pulseOffset: number;
  glyph?: string;
  charLabel?: '4' | '0' | 'DECOR';
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

interface TargetDot {
  id: number;
  x: number;
  y: number;
  originX: number;
  originY: number;
  radius: number;
  active: boolean;
  type: 'NORMAL' | 'SPECIAL' | 'POWERUP' | 'MYSTERY';
  powerType?: 'MULTI' | 'WIDE' | 'SLOW' | '2X' | 'LASER';
  points: number;
  hitTimer: number;
  pulseOffset: number;
  glyph?: string;
  charLabel?: '4' | '0' | 'DECOR';
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

export default function DotBreakerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [hasStarted, setHasStarted] = useState(false);
  const [gameState, setGameState] = useState<'PLAYING' | 'WIN' | 'GAMEOVER'>('PLAYING');
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);
  const [secretToast, setSecretToast] = useState<string | null>(null);

  // Key & Pointer tracking
  const leftPressed = useRef(false);
  const rightPressed = useRef(false);
  const touchX = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  // Core Game State Ref
  const stateRef = useRef({
    width: 860,
    height: 640,
    balls: [] as Ball[],
    paddle: {
      x: 380,
      y: 590,
      width: 110,
      baseWidth: 110,
      height: 8,
      speed: 9.5,
    },
    targetDots: [] as TargetDot[],
    particles: [] as Particle[],
    powerUps: [] as PowerUpPill[],
    lasers: [] as LaserBullet[],
    floatingTexts: [] as FloatingText[],
    score: 0,
    lives: 3,
    multiplier: 1,
    combo: 0,
    laserTimer: 0,
    wideTimer: 0,
    slowTimer: 0,
    doubleTimer: 0,
    baseBallSpeed: 6.2,
    maxBallSpeed: 13.0,
    hasStarted: false,
    gameState: 'PLAYING' as 'PLAYING' | 'WIN' | 'GAMEOVER',
  });

  // Construct target dots forming massive 2x larger "404" using DotTypography
  const initDots = useCallback((w: number, h: number): TargetDot[] => {
    const isMobile = w < 768;
    const isSmallMobile = w < 480;

    // 2x LARGER font size for 404
    const fontSize = isSmallMobile ? 100 : isMobile ? 160 : 250;
    const gridSpacing = isSmallMobile ? 9 : isMobile ? 10 : 12;
    const dotRadius = isMobile ? 3.5 : 4.8;

    const layout = textToDots('404', {
      fontSize,
      fontWeight: '900', // Massive bold weight
      gridSpacing,
      alphaThreshold: 80,
    });

    const centerX = w / 2;
    const centerY = h * 0.30;

    const dots: TargetDot[] = [];
    let id = 0;

    layout.dots.forEach((dotCoords, index) => {
      const x = dotCoords.x + centerX;
      const y = dotCoords.y + centerY;

      let type: TargetDot['type'] = 'NORMAL';
      let powerType: TargetDot['powerType'] = undefined;
      let points = 60;
      let radius = dotRadius;

      if (index % 10 === 0) {
        type = 'POWERUP';
        const ptypes: TargetDot['powerType'][] = ['MULTI', 'WIDE', 'SLOW', '2X', 'LASER'];
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
        radius,
        active: true,
        type,
        powerType,
        points,
        hitTimer: 0,
        pulseOffset: Math.random() * Math.PI * 2,
        charLabel: '4',
      });
    });

    return dots;
  }, []);

  // Subtle pop effect in place when dot is destroyed (classic Brick Breaker style)
  const spawnDotBurst = (x: number, y: number, count: number, baseRadius = 2.0) => {
    if (reducedMotionRef.current) return;
    const parts: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5;
      parts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * baseRadius + 0.5,
        alpha: 0.9,
        decay: 0.08,
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
        y: p.y - 10,
        vx: (Math.random() - 0.5) * 3.5,
        vy: -s.baseBallSpeed,
        radius: 5.5,
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
    s.targetDots = initDots(s.width, s.height);
    s.gameState = 'PLAYING';
    s.hasStarted = true;

    setScore(0);
    setLives(3);
    setGameState('PLAYING');
    setHasStarted(true);
    setActivePowerUp(null);
    setSecretToast(null);

    resetBallOnPaddle();
  }, [initDots, resetBallOnPaddle]);

  // Keyboard events
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

  // Canvas & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const w = Math.min(rect.width, 920);
      const h = Math.min(Math.max(window.innerHeight * 0.72, 600), 720);

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

      // Position paddle
      s.paddle.baseWidth = Math.min(w * 0.16, 120);
      s.paddle.width = s.wideTimer > 0 ? s.paddle.baseWidth * 1.5 : s.paddle.baseWidth;
      s.paddle.x = (w - s.paddle.width) / 2;
      s.paddle.y = h - 38;

      if (s.targetDots.length === 0) {
        s.targetDots = initDots(w, h);
        resetBallOnPaddle();
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Main animation loop
    const loop = () => {
      animId = requestAnimationFrame(loop);

      const s = stateRef.current;
      const w = s.width;
      const h = s.height;
      const p = s.paddle;

      // ─── 1. PADDLE MOVEMENT ────────────────────────
      if (touchX.current !== null) {
        const targetX = touchX.current - p.width / 2;
        p.x += (targetX - p.x) * 0.35;
      } else {
        if (leftPressed.current) p.x -= p.speed;
        if (rightPressed.current) p.x += p.speed;
      }

      // Clamp paddle inside boundaries
      p.x = Math.max(14, Math.min(w - 14 - p.width, p.x));

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
        if (Math.random() < 0.14) {
          s.lasers.push(
            { x: p.x + 10, y: p.y - 4, vy: -11, active: true },
            { x: p.x + p.width - 10, y: p.y - 4, vy: -11, active: true }
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

        // Collision with dots
        for (const dot of s.targetDots) {
          if (!dot.active) continue;
          const dx = l.x - dot.x;
          const dy = l.y - dot.y;
          if (dx * dx + dy * dy < (dot.radius + 5) * (dot.radius + 5)) {
            dot.active = false;
            l.active = false;
            s.score += dot.points * s.multiplier;
            setScore(s.score);
            spawnDotBurst(dot.x, dot.y, 14, dot.radius);
            s.lasers.splice(i, 1);
            break;
          }
        }
      }

      // ─── 4. POWER-UP PILLS ─────────────────────────
      for (let i = s.powerUps.length - 1; i >= 0; i--) {
        const pill = s.powerUps[i];
        pill.y += pill.vy;

        // Catch power-up
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

          spawnDotBurst(pill.x, pill.y, 10, 2.5);
          s.powerUps.splice(i, 1);
          continue;
        }

        if (pill.y > h + 20) {
          s.powerUps.splice(i, 1);
        }
      }

      // ─── 5. BALLS PHYSICS & "404" DOT COLLISIONS ───
      if (s.hasStarted && s.gameState === 'PLAYING') {
        for (let bi = s.balls.length - 1; bi >= 0; bi--) {
          const b = s.balls[bi];
          if (!b.active) continue;

          b.x += b.vx;
          b.y += b.vy;

          // Wall Collisions
          if (b.x - b.radius < 14) {
            b.x = 14 + b.radius;
            b.vx = Math.abs(b.vx);
            spawnDotBurst(b.x, b.y, 4, 1.8);
          } else if (b.x + b.radius > w - 14) {
            b.x = w - 14 - b.radius;
            b.vx = -Math.abs(b.vx);
            spawnDotBurst(b.x, b.y, 4, 1.8);
          }

          // Ceiling Collision
          if (b.y - b.radius < 14) {
            b.y = 14 + b.radius;
            b.vy = Math.abs(b.vy);
            spawnDotBurst(b.x, b.y, 5, 1.8);
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

            const currentSpeed = Math.min(b.speed + 0.15, s.maxBallSpeed);
            b.speed = currentSpeed;
            b.vx = Math.sin(angle) * currentSpeed;
            b.vy = -Math.cos(angle) * currentSpeed;

            s.combo = 0;
            spawnDotBurst(b.x, p.y, 10, 2.5);
          }

          // "404" Dot Collision
          for (const dot of s.targetDots) {
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

              // Subtle pop in place
              spawnDotBurst(dot.x, dot.y, 6, dot.radius);

              // Mystery Dot Secret
              if (dot.type === 'MYSTERY') {
                setSecretToast('✦ CORE 404 MATRIX SHATTERED ✦');
                spawnDotBurst(w / 2, h * 0.3, 20, 4);
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

          // Ball Fell (Drain)
          if (b.y > h + 20) {
            s.balls.splice(bi, 1);
          }
        }

        // Life lost check
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

        // Win check: All 404 dots destroyed
        const remaining = s.targetDots.filter((d) => d.active).length;
        if (remaining === 0 && s.gameState === 'PLAYING') {
          s.gameState = 'WIN';
          setGameState('WIN');
          setSecretToast('You found it.');
          spawnDotBurst(w / 2, h / 2, 40, 6);
        }
      }

      // ─── 6. STATIC 404 TARGET DOT POSITIONING (NO SCATTER) ──
      s.targetDots.forEach((dot) => {
        if (!dot.active) return;
        dot.x = dot.originX;
        dot.y = dot.originY;
      });

      // ─── 7. RENDER ─────────────────────────────────
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      // Playfield Border Frame
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(12, 12, w - 24, h - 24);

      // Draw "404" Target Dots
      const time = performance.now() * 0.003;
      s.targetDots.forEach((dot) => {
        if (!dot.active) return;

        const pulse = Math.sin(time + dot.pulseOffset) * 0.6;
        const currentR = dot.radius + pulse + dot.hitTimer * 2.5;

        if (dot.type === 'MYSTERY') {
          // Central mystery glyph dot
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, currentR + 3, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, currentR, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#000000';
          ctx.font = '600 10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(dot.glyph || '✦', dot.x, dot.y + 0.5);
        } else if (dot.type === 'POWERUP') {
          // Power-up dot with outer ring
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, currentR + 3, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, currentR, 0, Math.PI * 2);
          ctx.fill();
        } else if (dot.type === 'SPECIAL') {
          // Inner core dot
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, currentR, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Standard "404" dot
          ctx.fillStyle = dot.charLabel === 'DECOR' ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, currentR, 0, Math.PI * 2);
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

      // Draw Paddle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect?.(p.x, p.y, p.width, p.height, 4);
      ctx.fill();

      // Paddle Laser emitters if active
      if (s.laserTimer > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.x + 8, p.y - 4, 3, 4);
        ctx.fillRect(p.x + p.width - 11, p.y - 4, 3, 4);
      }

      // Draw Balls
      s.balls.forEach((b) => {
        if (!b.active) return;
        // Glow
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * 2.2, 0, Math.PI * 2);
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
        ft.y -= 0.65;
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
    };
  }, [initDots, resetBallOnPaddle]);

  // Pointer / Touch tracking
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    touchX.current = e.clientX - rect.left;

    if (!hasStarted) {
      setHasStarted(true);
      stateRef.current.hasStarted = true;
    }
  };

  const handlePointerLeave = () => {
    touchX.current = null;
  };

  return (
    <div className="breaker-container">
      {/* Secret Toast */}
      {secretToast && (
        <div className="breaker-secret-toast">
          <span>{secretToast}</span>
        </div>
      )}

      {/* Minimal HUD: SCORE 01240  |  LIVES ● ● ● */}
      <div className="breaker-hud">
        <div className="breaker-stat">
          <span className="breaker-stat__label">SCORE</span>
          <span className="breaker-stat__val">{score.toString().padStart(5, '0')}</span>
        </div>

        {activePowerUp && (
          <div className="breaker-powerup-badge">
            <span>[ {activePowerUp} ]</span>
          </div>
        )}

        <div className="breaker-stat">
          <span className="breaker-stat__label">LIVES</span>
          <span className="breaker-stat__val breaker-lives">
            {'● '.repeat(Math.max(0, lives)).trim() || '○'}
          </span>
        </div>
      </div>

      {/* Main Expansive Canvas Playfield */}
      <div className="breaker-canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="breaker-canvas"
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        />

        {/* Start / Move to Play Hint */}
        {!hasStarted && gameState === 'PLAYING' && (
          <div className="breaker-hint-overlay">
            <span className="breaker-hint-text">Move to play</span>
            <div className="breaker-hint-sub">A / D or Drag to Break the 404 Dots</div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'GAMEOVER' && (
          <div className="breaker-overlay">
            <span className="breaker-overlay__tag">TERMINATED</span>
            <div className="breaker-overlay__score">
              SCORE: {score.toString().padStart(5, '0')}
            </div>
            <div className="breaker-btn-group">
              <button onClick={restartGame} className="breaker-btn" data-cursor="expand">
                Play again
              </button>
              <Link href="/" className="breaker-btn breaker-btn--secondary" data-cursor="expand">
                Index
              </Link>
            </div>
          </div>
        )}

        {/* Win / Completion Screen */}
        {gameState === 'WIN' && (
          <div className="breaker-overlay breaker-overlay--win">
            <span className="breaker-overlay__secret">“You found it.”</span>
            <div className="breaker-overlay__sub">
              404 DOT MATRIX CLEARED — SCORE: {score.toString().padStart(5, '0')}
            </div>
            <div className="breaker-btn-group">
              <button onClick={restartGame} className="breaker-btn" data-cursor="expand">
                Play again
              </button>
              <Link href="/" className="breaker-btn breaker-btn--secondary" data-cursor="expand">
                Index
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Touch Controls */}
      <div className="breaker-mobile-bar">
        <button
          className="breaker-touch-btn"
          onTouchStart={() => {
            leftPressed.current = true;
            if (!hasStarted) setHasStarted(true);
          }}
          onTouchEnd={() => (leftPressed.current = false)}
          onMouseDown={() => {
            leftPressed.current = true;
            if (!hasStarted) setHasStarted(true);
          }}
          onMouseUp={() => (leftPressed.current = false)}
        >
          ◄ LEFT
        </button>

        <button
          className="breaker-touch-btn"
          onTouchStart={() => {
            rightPressed.current = true;
            if (!hasStarted) setHasStarted(true);
          }}
          onTouchEnd={() => (rightPressed.current = false)}
          onMouseDown={() => {
            rightPressed.current = true;
            if (!hasStarted) setHasStarted(true);
          }}
          onMouseUp={() => (rightPressed.current = false)}
        >
          RIGHT ►
        </button>
      </div>

      {/* Minimal Footer Home Link */}
      <div className="breaker-footer">
        <Link href="/" className="breaker-home-link" data-cursor="expand">
          ← Index
        </Link>
      </div>
    </div>
  );
}
