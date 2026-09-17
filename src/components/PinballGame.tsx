/**
 * TIYATROTIST — 404 Dot Pinball Game
 *
 * An interactive canvas-based dot pinball mini-game for the 404 error page.
 * Strictly adheres to the site's monochrome identity (#000000, white/gray particles,
 * clean typography, geometric flippers, smooth physics, combo scoring, and easter eggs).
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

interface Bumper {
  id: number;
  x: number;
  y: number;
  radius: number;
  points: number;
  hitTimer: number; // For hit pulse animation
  hitCount: number;
  label?: string;
}

interface ParticleEffect {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
}

interface FloatingScore {
  id: number;
  x: number;
  y: number;
  text: string;
  alpha: number;
}

export default function PinballGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE');
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [secretMessage, setSecretMessage] = useState<string | null>(null);

  // Key states
  const leftPressed = useRef(false);
  const rightPressed = useRef(false);
  const touchLeft = useRef(false);
  const touchRight = useRef(false);

  // Sound/VFX toggle / reduced motion
  const reducedMotionRef = useRef(false);

  // Physics state refs
  const stateRef = useRef({
    ball: {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 6.5,
      active: false,
    },
    gravity: 0.28,
    friction: 0.994,
    maxSpeed: 16,
    leftFlipper: {
      x: 0,
      y: 0,
      length: 65,
      angle: 0.35, // Resting angle (radians)
      targetAngle: 0.35,
      restAngle: 0.35,
      activeAngle: -0.55,
      angularVelocity: 0,
    },
    rightFlipper: {
      x: 0,
      y: 0,
      length: 65,
      angle: Math.PI - 0.35,
      targetAngle: Math.PI - 0.35,
      restAngle: Math.PI - 0.35,
      activeAngle: Math.PI + 0.55,
      angularVelocity: 0,
    },
    bumpers: [] as Bumper[],
    particles: [] as ParticleEffect[],
    floatingScores: [] as FloatingScore[],
    lastHitTime: 0,
    comboMultiplier: 1,
    hitSequence: [] as number[],
    width: 420,
    height: 600,
    lives: 3,
    score: 0,
    highScore: 0,
    gameState: 'IDLE' as 'IDLE' | 'PLAYING' | 'GAMEOVER',
  });

  // Load high score from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tiyatrotist_pinball_hi');
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) {
          setHighScore(val);
          stateRef.current.highScore = val;
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Initialize bumpers
  const initBumpers = useCallback((w: number, h: number): Bumper[] => {
    const cx = w / 2;
    return [
      // Top central triangle cluster (Big dot bumpers)
      { id: 1, x: cx, y: h * 0.22, radius: 18, points: 100, hitTimer: 0, hitCount: 0, label: '4' },
      { id: 2, x: cx - 60, y: h * 0.31, radius: 15, points: 150, hitTimer: 0, hitCount: 0, label: '0' },
      { id: 3, x: cx + 60, y: h * 0.31, radius: 15, points: 150, hitTimer: 0, hitCount: 0, label: '4' },

      // Mid side diamond bounce dots
      { id: 4, x: cx - 110, y: h * 0.44, radius: 12, points: 80, hitTimer: 0, hitCount: 0 },
      { id: 5, x: cx + 110, y: h * 0.44, radius: 12, points: 80, hitTimer: 0, hitCount: 0 },

      // Center vortex dot
      { id: 6, x: cx, y: h * 0.46, radius: 14, points: 200, hitTimer: 0, hitCount: 0, label: '●' },

      // Slingshots above flippers
      { id: 7, x: cx - 85, y: h * 0.62, radius: 9, points: 50, hitTimer: 0, hitCount: 0 },
      { id: 8, x: cx + 85, y: h * 0.62, radius: 9, points: 50, hitTimer: 0, hitCount: 0 },

      // Micro satellite dots
      { id: 9, x: cx - 35, y: h * 0.15, radius: 6, points: 30, hitTimer: 0, hitCount: 0 },
      { id: 10, x: cx + 35, y: h * 0.15, radius: 6, points: 30, hitTimer: 0, hitCount: 0 },
    ];
  }, []);

  // Spawn particle burst effect
  const spawnParticles = (x: number, y: number, count: number, maxSpd = 4) => {
    if (reducedMotionRef.current) return;
    const parts: ParticleEffect[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * maxSpd + 1;
      parts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2 + 1,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02,
      });
    }
    stateRef.current.particles.push(...parts);
  };

  // Launch ball
  const launchBall = useCallback(() => {
    const s = stateRef.current;
    if (s.ball.active) return;

    // Launch from right-side shooter lane
    s.ball.x = s.width - 24;
    s.ball.y = s.height * 0.75;
    s.ball.vx = (Math.random() - 0.5) * 1.5;
    s.ball.vy = -(Math.random() * 3 + 12.5); // Fast upward launch
    s.ball.active = true;

    s.gameState = 'PLAYING';
    setGameState('PLAYING');
    spawnParticles(s.ball.x, s.ball.y, 16, 5);
  }, []);

  // Reset ball after drain
  const handleBallDrain = useCallback(() => {
    const s = stateRef.current;
    s.ball.active = false;
    s.comboMultiplier = 1;
    setCombo(1);

    const remainingLives = s.lives - 1;
    s.lives = remainingLives;
    setLives(remainingLives);

    if (remainingLives <= 0) {
      s.gameState = 'GAMEOVER';
      setGameState('GAMEOVER');

      // Check high score update
      if (s.score > s.highScore) {
        s.highScore = s.score;
        setHighScore(s.score);
        try {
          localStorage.setItem('tiyatrotist_pinball_hi', s.score.toString());
        } catch {
          // Ignore
        }
      }
    } else {
      // Auto relaunch after brief delay
      setTimeout(() => {
        if (stateRef.current.lives > 0) {
          launchBall();
        }
      }, 700);
    }
  }, [launchBall]);

  // Restart game
  const restartGame = useCallback(() => {
    const s = stateRef.current;
    s.lives = 3;
    s.score = 0;
    s.comboMultiplier = 1;
    s.hitSequence = [];
    s.bumpers = initBumpers(s.width, s.height);
    s.particles = [];
    s.floatingScores = [];
    s.gameState = 'PLAYING';

    setLives(3);
    setScore(0);
    setCombo(1);
    setGameState('PLAYING');
    setSecretMessage(null);

    launchBall();
  }, [initBumpers, launchBall]);

  // Keyboard controls
  useEffect(() => {
    reducedMotionRef.current = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        leftPressed.current = true;
      }
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        rightPressed.current = true;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (stateRef.current.gameState === 'IDLE') {
          restartGame();
        } else if (stateRef.current.gameState === 'GAMEOVER') {
          restartGame();
        } else if (!stateRef.current.ball.active) {
          launchBall();
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
  }, [launchBall, restartGame]);

  // Canvas resize and render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const updateDimensions = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const w = Math.min(rect.width, 460);
      const h = Math.min(Math.max(window.innerHeight * 0.65, 520), 660);

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

      // Position flippers
      const cx = w / 2;
      const flipperY = h * 0.86;
      const flipperSpacing = 48;
      const flipperLen = Math.min(w * 0.16, 68);

      s.leftFlipper.x = cx - flipperSpacing;
      s.leftFlipper.y = flipperY;
      s.leftFlipper.length = flipperLen;

      s.rightFlipper.x = cx + flipperSpacing;
      s.rightFlipper.y = flipperY;
      s.rightFlipper.length = flipperLen;

      if (s.bumpers.length === 0) {
        s.bumpers = initBumpers(w, h);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Main Physics & Render Loop
    const loop = () => {
      animId = requestAnimationFrame(loop);

      const s = stateRef.current;
      const w = s.width;
      const h = s.height;

      // ─── 1. UPDATE FLIPPERS ─────────────────────────
      const isLeftActive = leftPressed.current || touchLeft.current;
      const isRightActive = rightPressed.current || touchRight.current;

      const lf = s.leftFlipper;
      lf.targetAngle = isLeftActive ? lf.activeAngle : lf.restAngle;
      const prevLeftAngle = lf.angle;
      lf.angle += (lf.targetAngle - lf.angle) * 0.32;
      lf.angularVelocity = (lf.angle - prevLeftAngle) * 60;

      const rf = s.rightFlipper;
      rf.targetAngle = isRightActive ? rf.activeAngle : rf.restAngle;
      const prevRightAngle = rf.angle;
      rf.angle += (rf.targetAngle - rf.angle) * 0.32;
      rf.angularVelocity = (rf.angle - prevRightAngle) * 60;

      // ─── 2. UPDATE BALL PHYSICS ────────────────────
      if (s.ball.active) {
        const b = s.ball;

        // Apply gravity & air drag
        b.vy += s.gravity;
        b.vx *= s.friction;
        b.vy *= s.friction;

        // Velocity clamping
        const spdSq = b.vx * b.vx + b.vy * b.vy;
        if (spdSq > s.maxSpeed * s.maxSpeed) {
          const ratio = s.maxSpeed / Math.sqrt(spdSq);
          b.vx *= ratio;
          b.vy *= ratio;
        }

        b.x += b.vx;
        b.y += b.vy;

        // ─── 3. BOUNDARY COLLISIONS ───────────────────
        const topRadius = 28;
        const leftWall = 16;
        const rightWall = w - 16;

        // Top arc curved ceiling collision
        if (b.y < topRadius + 10) {
          b.y = topRadius + 10;
          b.vy = Math.abs(b.vy) * 0.85;
          spawnParticles(b.x, b.y, 4, 2);
        }

        // Left wall
        if (b.x - b.radius < leftWall) {
          b.x = leftWall + b.radius;
          b.vx = Math.abs(b.vx) * 0.82;
          spawnParticles(b.x, b.y, 3, 2);
        }

        // Right wall
        if (b.x + b.radius > rightWall) {
          b.x = rightWall - b.radius;
          b.vx = -Math.abs(b.vx) * 0.82;
          spawnParticles(b.x, b.y, 3, 2);
        }

        // ─── 4. SIDE GUIDE SLOPES ABOVE FLIPPERS ──────
        const guideY1 = h * 0.65;
        const guideY2 = h * 0.84;
        const guideLeftX1 = leftWall;
        const guideLeftX2 = lf.x - 12;
        const guideRightX1 = rightWall;
        const guideRightX2 = rf.x + 12;

        // Left guide slope line test
        if (b.y > guideY1 && b.y < guideY2) {
          const t = (b.y - guideY1) / (guideY2 - guideY1);
          const expectedX = guideLeftX1 + t * (guideLeftX2 - guideLeftX1);
          if (b.x - b.radius < expectedX) {
            b.x = expectedX + b.radius;
            b.vx = Math.abs(b.vx) * 0.85 + 1.2;
            b.vy *= 0.9;
            spawnParticles(b.x, b.y, 3, 2);
          }
        }

        // Right guide slope line test
        if (b.y > guideY1 && b.y < guideY2) {
          const t = (b.y - guideY1) / (guideY2 - guideY1);
          const expectedX = guideRightX1 + t * (guideRightX2 - guideRightX1);
          if (b.x + b.radius > expectedX) {
            b.x = expectedX - b.radius;
            b.vx = -Math.abs(b.vx) * 0.85 - 1.2;
            b.vy *= 0.9;
            spawnParticles(b.x, b.y, 3, 2);
          }
        }

        // ─── 5. BUMPER COLLISIONS ─────────────────────
        const now = performance.now();
        s.bumpers.forEach((bmp) => {
          const dx = b.x - bmp.x;
          const dy = b.y - bmp.y;
          const distSq = dx * dx + dy * dy;
          const minDist = bmp.radius + b.radius;

          if (distSq < minDist * minDist && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist;

            // Push ball out of bumper
            b.x = bmp.x + nx * minDist;
            b.y = bmp.y + ny * minDist;

            // Reflect velocity with bounce impulse
            const dot = b.vx * nx + b.vy * ny;
            const bounceForce = 7.5;
            b.vx = (b.vx - 2 * dot * nx) + nx * bounceForce;
            b.vy = (b.vy - 2 * dot * ny) + ny * bounceForce;

            // Visual feedback
            bmp.hitTimer = 1.0;
            bmp.hitCount += 1;
            spawnParticles(bmp.x, bmp.y, 14, 4.5);

            // Combo multiplier check (within 2s)
            if (now - s.lastHitTime < 2000) {
              s.comboMultiplier = Math.min(s.comboMultiplier + 1, 8);
            } else {
              s.comboMultiplier = 1;
            }
            s.lastHitTime = now;
            setCombo(s.comboMultiplier);

            // Add score
            const gained = bmp.points * s.comboMultiplier;
            s.score += gained;
            setScore(s.score);

            // Add floating score popup
            s.floatingScores.push({
              id: Math.random(),
              x: bmp.x,
              y: bmp.y - 12,
              text: `+${gained}`,
              alpha: 1,
            });

            // Secret Hit Sequence Tracking
            s.hitSequence.push(bmp.id);
            if (s.hitSequence.length > 3) s.hitSequence.shift();
            // Sequence [1, 2, 3] triggers "404 OVERRIDE"
            if (
              s.hitSequence.length === 3 &&
              s.hitSequence[0] === 1 &&
              s.hitSequence[1] === 2 &&
              s.hitSequence[2] === 3
            ) {
              setSecretUnlocked(true);
              setSecretMessage('SYSTEM OVERRIDE: 404 MATRIX ALIGNED');
              spawnParticles(w / 2, h / 2, 40, 7);
            }

            // High score secret check
            if (s.score >= 500 && !secretUnlocked) {
              setSecretUnlocked(true);
              setSecretMessage('Not bad for a lost page.');
            }
          }
        });

        // ─── 6. FLIPPER LINE SEGMENT COLLISIONS ───────
        const testFlipper = (
          fx: number,
          fy: number,
          angle: number,
          len: number,
          angVel: number,
          isRight = false
        ) => {
          const tipX = fx + Math.cos(angle) * len;
          const tipY = fy + Math.sin(angle) * len;

          const segVx = tipX - fx;
          const segVy = tipY - fy;
          const segLenSq = segVx * segVx + segVy * segVy;

          // Project ball onto line segment
          const bx = b.x - fx;
          const by = b.y - fy;
          let u = (bx * segVx + by * segVy) / segLenSq;
          u = Math.max(0, Math.min(1, u));

          const closestX = fx + u * segVx;
          const closestY = fy + u * segVy;

          const cdx = b.x - closestX;
          const cdy = b.y - closestY;
          const cdistSq = cdx * cdx + cdy * cdy;
          const flipperThickness = 7;

          if (cdistSq < (b.radius + flipperThickness) * (b.radius + flipperThickness)) {
            const cdist = Math.sqrt(cdistSq) || 0.001;
            const cnx = cdx / cdist;
            const cny = cdy / cdist;

            // Push ball out
            b.x = closestX + cnx * (b.radius + flipperThickness);
            b.y = closestY + cny * (b.radius + flipperThickness);

            // Normal reflection + flipper angular punch
            const dot = b.vx * cnx + b.vy * cny;
            b.vx = b.vx - 1.8 * dot * cnx;
            b.vy = b.vy - 1.8 * dot * cny;

            // Add flipper rotational force
            const flipperSpeed = Math.abs(angVel);
            if (flipperSpeed > 0.5) {
              const punchDir = isRight ? -1 : 1;
              b.vy -= flipperSpeed * 0.9 + 5;
              b.vx += punchDir * flipperSpeed * 0.5;
              spawnParticles(closestX, closestY, 8, 3.5);
            }
          }
        };

        testFlipper(lf.x, lf.y, lf.angle, lf.length, lf.angularVelocity, false);
        testFlipper(rf.x, rf.y, rf.angle, rf.length, rf.angularVelocity, true);

        // ─── 7. BALL DRAIN (FALL BELOW FLIPPERS) ──────
        if (b.y > h + 30) {
          handleBallDrain();
        }
      }

      // ─── 8. RENDER ─────────────────────────────────
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      // Playfield Border Frame
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect?.(12, 12, w - 24, h - 24, 16);
      ctx.stroke();

      // Top decorative dot matrix
      for (let i = 0; i < 9; i++) {
        const dtx = w * 0.2 + (i / 8) * (w * 0.6);
        const dty = 24;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.arc(dtx, dty, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Side Guide Slopes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 2;
      // Left slope
      ctx.beginPath();
      ctx.moveTo(16, h * 0.65);
      ctx.lineTo(lf.x - 12, h * 0.84);
      ctx.stroke();
      // Right slope
      ctx.beginPath();
      ctx.moveTo(w - 16, h * 0.65);
      ctx.lineTo(rf.x + 12, h * 0.84);
      ctx.stroke();

      // Draw Bumpers
      s.bumpers.forEach((bmp) => {
        if (bmp.hitTimer > 0) {
          bmp.hitTimer = Math.max(0, bmp.hitTimer - 0.04);
        }

        const pulse = bmp.hitTimer * 6;
        const currentR = bmp.radius + pulse;

        // Outer glow ring
        if (bmp.hitTimer > 0.05) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${bmp.hitTimer * 0.8})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(bmp.x, bmp.y, currentR + 4, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Bumper body
        ctx.fillStyle = bmp.hitTimer > 0.2 ? '#ffffff' : 'rgba(255, 255, 255, 0.06)';
        ctx.beginPath();
        ctx.arc(bmp.x, bmp.y, currentR, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = bmp.hitTimer > 0.1 ? '#ffffff' : 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Bumper label (e.g., '4', '0', '4')
        if (bmp.label) {
          ctx.fillStyle = bmp.hitTimer > 0.2 ? '#000000' : 'rgba(255, 255, 255, 0.85)';
          ctx.font = '600 12px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(bmp.label, bmp.x, bmp.y + 0.5);
        }
      });

      // Draw Flippers
      const drawFlipper = (fx: number, fy: number, angle: number, len: number) => {
        const tipX = fx + Math.cos(angle) * len;
        const tipY = fy + Math.sin(angle) * len;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        // Base pivot dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(fx, fy, 4, 0, Math.PI * 2);
        ctx.fill();
      };

      drawFlipper(lf.x, lf.y, lf.angle, lf.length);
      drawFlipper(rf.x, rf.y, rf.angle, rf.length);

      // Draw Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          s.particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Floating Score popups
      for (let i = s.floatingScores.length - 1; i >= 0; i--) {
        const fs = s.floatingScores[i];
        fs.y -= 0.8;
        fs.alpha -= 0.025;

        if (fs.alpha <= 0) {
          s.floatingScores.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${fs.alpha})`;
        ctx.font = '500 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(fs.text, fs.x, fs.y);
      }

      // Draw Ball
      if (s.ball.active) {
        const b = s.ball;

        // Subtle motion trail
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.arc(b.x - b.vx * 0.8, b.y - b.vy * 0.8, b.radius * 0.85, 0, Math.PI * 2);
        ctx.fill();

        // Main Ball
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [handleBallDrain]);

  return (
    <div className="pinball-container">
      {/* 404 Header Area */}
      <div className="pinball-header">
        <span className="pinball-tag">ERROR 404 // DOT_PINBALL</span>
        <h1 className="pinball-title">404</h1>
        <p className="pinball-subtitle">
          You found a missing page. But you found something else instead.
        </p>
      </div>

      {/* Secret Message Toast */}
      {secretMessage && (
        <div className="pinball-secret-toast">
          <span>[ SECRET ] {secretMessage}</span>
        </div>
      )}

      {/* Pinball HUD & Stats Bar */}
      <div className="pinball-hud">
        <div className="pinball-stat">
          <span className="pinball-stat__label">SCORE</span>
          <span className="pinball-stat__val">{score.toString().padStart(5, '0')}</span>
        </div>

        <div className="pinball-stat">
          <span className="pinball-stat__label">COMBO</span>
          <span className="pinball-stat__val">x{combo}</span>
        </div>

        <div className="pinball-stat">
          <span className="pinball-stat__label">BALLS</span>
          <span className="pinball-stat__val">
            {'● '.repeat(Math.max(0, lives)).trim() || '—'}
          </span>
        </div>

        <div className="pinball-stat">
          <span className="pinball-stat__label">BEST</span>
          <span className="pinball-stat__val">{highScore.toString().padStart(5, '0')}</span>
        </div>
      </div>

      {/* Main Game Screen Canvas */}
      <div className="pinball-canvas-wrapper">
        <canvas ref={canvasRef} className="pinball-canvas" />

        {/* Start / Idle Overlay */}
        {gameState === 'IDLE' && (
          <div className="pinball-overlay">
            <span className="pinball-overlay__tag">DOT PINBALL SYSTEM</span>
            <p className="pinball-overlay__text">
              Press <strong>SPACE</strong> or tap below to launch.
            </p>
            <button
              onClick={restartGame}
              className="pinball-btn"
              data-cursor="expand"
            >
              LAUNCH BALL
            </button>
            <div className="pinball-controls-hint">
              <span>← / A : Left Flipper</span>
              <span>→ / D : Right Flipper</span>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'GAMEOVER' && (
          <div className="pinball-overlay">
            <span className="pinball-overlay__tag">GAME OVER</span>
            <h2 className="pinball-overlay__title">
              Looks like this page is really gone.
            </h2>
            <p className="pinball-overlay__sub">
              Final Score: <strong>{score}</strong>
            </p>
            <div className="pinball-btn-group">
              <button
                onClick={restartGame}
                className="pinball-btn"
                data-cursor="expand"
              >
                PLAY AGAIN
              </button>
              <Link
                href="/"
                className="pinball-btn pinball-btn--secondary"
                data-cursor="expand"
              >
                RETURN HOME
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Touch Screen Controls */}
      <div className="pinball-touch-controls">
        <button
          className="pinball-touch-btn"
          onTouchStart={() => (touchLeft.current = true)}
          onTouchEnd={() => (touchLeft.current = false)}
          onMouseDown={() => (touchLeft.current = true)}
          onMouseUp={() => (touchLeft.current = false)}
        >
          ◄ LEFT
        </button>

        <button
          className="pinball-touch-btn pinball-touch-btn--launch"
          onClick={() => {
            if (gameState === 'GAMEOVER' || gameState === 'IDLE') {
              restartGame();
            } else if (!stateRef.current.ball.active) {
              launchBall();
            }
          }}
        >
          {gameState === 'GAMEOVER' ? 'REPLAY' : 'LAUNCH'}
        </button>

        <button
          className="pinball-touch-btn"
          onTouchStart={() => (touchRight.current = true)}
          onTouchEnd={() => (touchRight.current = false)}
          onMouseDown={() => (touchRight.current = true)}
          onMouseUp={() => (touchRight.current = false)}
        >
          RIGHT ►
        </button>
      </div>

      {/* Footer Navigation Link */}
      <div className="pinball-footer-link">
        <Link href="/" className="pinball-home-link" data-cursor="expand">
          ← Back to Tiyatrotist Main Site
        </Link>
      </div>
    </div>
  );
}
