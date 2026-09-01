/**
 * TIYATROTIST — Hidden Dot Ping Pong Game
 *
 * An elegant, secret Ping Pong mini-game embedded into the 404 route.
 * Zero "404" or "Error" text. Incorporates the site's monochrome dot particle
 * visual language, interactive boundary dots, paddle physics, AI tracking,
 * touch/keyboard/mouse support, and subtle easter eggs.
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

interface DotParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
}

interface TrailDot {
  x: number;
  y: number;
  alpha: number;
  radius: number;
}

export default function PingPongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [winner, setWinner] = useState<'PLAYER' | 'AI' | null>(null);
  const [secretToast, setSecretToast] = useState<string | null>(null);

  // Key & Touch input states
  const upPressed = useRef(false);
  const downPressed = useRef(false);
  const touchY = useRef<number | null>(null);

  // Sound/Motion preference
  const reducedMotionRef = useRef(false);

  // Game internal state
  const stateRef = useRef({
    width: 800,
    height: 500,
    ball: {
      x: 400,
      y: 250,
      vx: 4.5,
      vy: 2.0,
      radius: 5,
      speed: 5.5,
      maxSpeed: 14,
    },
    playerPaddle: {
      x: 30,
      y: 200,
      width: 6,
      height: 70,
      vy: 0,
      speed: 7.5,
    },
    aiPaddle: {
      x: 764,
      y: 200,
      width: 6,
      height: 70,
      vy: 0,
      speed: 5.2,
      reactionEase: 0.11,
    },
    boundaryDots: [] as DotParticle[],
    centerDots: [] as DotParticle[],
    burstParticles: [] as { x: number; y: number; vx: number; vy: number; alpha: number; decay: number }[],
    ballTrail: [] as TrailDot[],
    playerScore: 0,
    aiScore: 0,
    rally: 0,
    hasStarted: false,
    winner: null as 'PLAYER' | 'AI' | null,
    winningScore: 5,
    lastScoredTime: 0,
  });

  // Initialize table dots (center dashed net & boundaries)
  const initTableDots = useCallback((w: number, h: number) => {
    const center: DotParticle[] = [];
    const boundary: DotParticle[] = [];

    // Center divider dots
    const centerCount = Math.floor(h / 20);
    for (let i = 0; i < centerCount; i++) {
      const y = (i + 0.5) * (h / centerCount);
      center.push({
        x: w / 2,
        y,
        originX: w / 2,
        originY: y,
        vx: 0,
        vy: 0,
        radius: 1.5,
        alpha: 0.25,
        targetAlpha: 0.25,
      });
    }

    // Top & Bottom boundary dots
    const horizCount = Math.floor(w / 18);
    for (let i = 0; i < horizCount; i++) {
      const x = (i + 0.5) * (w / horizCount);
      // Top row
      boundary.push({
        x,
        y: 12,
        originX: x,
        originY: 12,
        vx: 0,
        vy: 0,
        radius: 1.2,
        alpha: 0.18,
        targetAlpha: 0.18,
      });
      // Bottom row
      boundary.push({
        x,
        y: h - 12,
        originX: x,
        originY: h - 12,
        vx: 0,
        vy: 0,
        radius: 1.2,
        alpha: 0.18,
        targetAlpha: 0.18,
      });
    }

    stateRef.current.centerDots = center;
    stateRef.current.boundaryDots = boundary;
  }, []);

  // Spawn particle burst on paddle / wall hit or score
  const spawnBurst = (x: number, y: number, count: number, maxSpd = 3) => {
    if (reducedMotionRef.current) return;
    const parts = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * maxSpd + 0.8;
      parts.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        alpha: 1,
        decay: Math.random() * 0.04 + 0.02,
      });
    }
    stateRef.current.burstParticles.push(...parts);
  };

  // Reset ball to center
  const resetBall = (servingToPlayer = false) => {
    const s = stateRef.current;
    s.ball.x = s.width / 2;
    s.ball.y = s.height / 2;
    s.ball.speed = 5.5;

    const angle = (Math.random() * 0.7 - 0.35) * Math.PI;
    const dir = servingToPlayer ? -1 : 1;
    s.ball.vx = Math.cos(angle) * s.ball.speed * dir;
    s.ball.vy = Math.sin(angle) * s.ball.speed;

    s.rally = 0;
  };

  // Start / Restart match
  const restartMatch = useCallback(() => {
    const s = stateRef.current;
    s.playerScore = 0;
    s.aiScore = 0;
    s.winner = null;
    s.hasStarted = true;
    s.burstParticles = [];
    s.ballTrail = [];

    setPlayerScore(0);
    setAiScore(0);
    setWinner(null);
    setHasStarted(true);
    setSecretToast(null);

    resetBall(Math.random() > 0.5);
  }, []);

  // Keyboard controls
  useEffect(() => {
    reducedMotionRef.current = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        upPressed.current = true;
        if (!stateRef.current.hasStarted) {
          stateRef.current.hasStarted = true;
          setHasStarted(true);
        }
      }
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        downPressed.current = true;
        if (!stateRef.current.hasStarted) {
          stateRef.current.hasStarted = true;
          setHasStarted(true);
        }
      }
      if (e.code === 'Space' && stateRef.current.winner) {
        restartMatch();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        upPressed.current = false;
      }
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        downPressed.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [restartMatch]);

  // Main Canvas & Physics Engine
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
      const w = Math.min(rect.width, 860);
      const h = Math.min(Math.max(window.innerHeight * 0.62, 420), 540);

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

      // Adjust paddle positions
      s.playerPaddle.x = 24;
      s.aiPaddle.x = w - 24 - s.aiPaddle.width;

      initTableDots(w, h);
    };

    resize();
    window.addEventListener('resize', resize);

    // Main animation & game physics loop
    const loop = () => {
      animId = requestAnimationFrame(loop);

      const s = stateRef.current;
      const w = s.width;
      const h = s.height;
      const b = s.ball;
      const pp = s.playerPaddle;
      const ap = s.aiPaddle;

      // ─── 1. PLAYER PADDLE MOVEMENT ─────────────────
      if (touchY.current !== null) {
        // Direct touch tracking
        const targetY = touchY.current - pp.height / 2;
        pp.y += (targetY - pp.y) * 0.25;
      } else {
        // Keyboard controls
        if (upPressed.current) pp.y -= pp.speed;
        if (downPressed.current) pp.y += pp.speed;
      }

      // Clamp player paddle inside boundary
      pp.y = Math.max(16, Math.min(h - 16 - pp.height, pp.y));

      // ─── 2. AI PADDLE LOGIC ────────────────────────
      // Predictive tracking with human-like easing
      const aiTargetY = b.y - ap.height / 2 + (Math.sin(performance.now() * 0.003) * 12);
      ap.y += (aiTargetY - ap.y) * ap.reactionEase;
      // Clamp AI paddle
      ap.y = Math.max(16, Math.min(h - 16 - ap.height, ap.y));

      // ─── 3. BALL PHYSICS & COLLISIONS ──────────────
      if (!s.winner) {
        b.x += b.vx;
        b.y += b.vy;

        // Ball Trail
        if (!reducedMotionRef.current && Math.random() > 0.3) {
          s.ballTrail.push({
            x: b.x,
            y: b.y,
            alpha: 0.5,
            radius: b.radius * 0.7,
          });
          if (s.ballTrail.length > 14) s.ballTrail.shift();
        }

        // Top & Bottom Boundary Collisions
        if (b.y - b.radius < 14) {
          b.y = 14 + b.radius;
          b.vy = Math.abs(b.vy);
          spawnBurst(b.x, b.y, 6, 2);
        } else if (b.y + b.radius > h - 14) {
          b.y = h - 14 - b.radius;
          b.vy = -Math.abs(b.vy);
          spawnBurst(b.x, b.y, 6, 2);
        }

        // ─── PLAYER PADDLE COLLISION ───────────────────
        if (
          b.x - b.radius <= pp.x + pp.width &&
          b.x + b.radius >= pp.x &&
          b.y >= pp.y - b.radius &&
          b.y <= pp.y + pp.height + b.radius &&
          b.vx < 0
        ) {
          b.x = pp.x + pp.width + b.radius;

          // Compute reflection angle based on hit position
          const hitOffset = (b.y - (pp.y + pp.height / 2)) / (pp.height / 2);
          const maxAngle = (Math.PI / 180) * 55; // 55 degrees max
          const angle = hitOffset * maxAngle;

          // Increase speed slightly per hit
          b.speed = Math.min(b.speed + 0.35, b.maxSpeed);
          b.vx = Math.cos(angle) * b.speed;
          b.vy = Math.sin(angle) * b.speed;

          s.rally++;
          spawnBurst(b.x, b.y, 10, 3.5);

          // Long rally easter egg
          if (s.rally === 10) {
            setSecretToast('RALLY x10: QUANTUM HARMONIC LOCK');
            spawnBurst(w / 2, h / 2, 30, 5);
          }
        }

        // ─── AI PADDLE COLLISION ───────────────────────
        if (
          b.x + b.radius >= ap.x &&
          b.x - b.radius <= ap.x + ap.width &&
          b.y >= ap.y - b.radius &&
          b.y <= ap.y + ap.height + b.radius &&
          b.vx > 0
        ) {
          b.x = ap.x - b.radius;

          const hitOffset = (b.y - (ap.y + ap.height / 2)) / (ap.height / 2);
          const maxAngle = (Math.PI / 180) * 55;
          const angle = hitOffset * maxAngle;

          b.speed = Math.min(b.speed + 0.35, b.maxSpeed);
          b.vx = -Math.cos(angle) * b.speed;
          b.vy = Math.sin(angle) * b.speed;

          s.rally++;
          spawnBurst(b.x, b.y, 10, 3.5);
        }

        // ─── SCORING LOGIC ─────────────────────────────
        // Ball went past player (AI scores)
        if (b.x < -20) {
          s.aiScore++;
          setAiScore(s.aiScore);
          spawnBurst(20, b.y, 25, 4);

          if (s.aiScore >= s.winningScore) {
            s.winner = 'AI';
            setWinner('AI');
          } else {
            resetBall(true);
          }
        }

        // Ball went past AI (Player scores)
        if (b.x > w + 20) {
          s.playerScore++;
          setPlayerScore(s.playerScore);
          spawnBurst(w - 20, b.y, 25, 4);

          // Secret Tie / Score Check
          if (s.playerScore === 4 && s.aiScore === 4) {
            setSecretToast('4 — 4 : YOU FOUND THE VOID.');
          }

          if (s.playerScore >= s.winningScore) {
            s.winner = 'PLAYER';
            setWinner('PLAYER');
          } else {
            resetBall(false);
          }
        }
      }

      // ─── 4. DOT REPULSION & INTERACTION ────────────
      // Ball perturbs nearby center and boundary dots
      const perturbDot = (dot: DotParticle) => {
        const dx = dot.x - b.x;
        const dy = dot.y - b.y;
        const distSq = dx * dx + dy * dy;
        const radius = 60;

        if (distSq < radius * radius && distSq > 0.001) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / radius) * 3;
          dot.vx += (dx / dist) * force;
          dot.vy += (dy / dist) * force;
          dot.targetAlpha = 0.85;
        } else {
          dot.targetAlpha = 0.22;
        }

        // Spring return
        dot.vx += (dot.originX - dot.x) * 0.08;
        dot.vy += (dot.originY - dot.y) * 0.08;
        dot.vx *= 0.88;
        dot.vy *= 0.88;
        dot.x += dot.vx;
        dot.y += dot.vy;

        dot.alpha += (dot.targetAlpha - dot.alpha) * 0.08;
      };

      s.centerDots.forEach(perturbDot);
      s.boundaryDots.forEach(perturbDot);

      // ─── 5. RENDER CANVAS ──────────────────────────
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      // Table Border Frame
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, w - 20, h - 20);

      // Draw Center Divider Dots
      s.centerDots.forEach((dot) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${dot.alpha})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Boundary Dots
      s.boundaryDots.forEach((dot) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${dot.alpha})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Ball Trail
      for (let i = s.ballTrail.length - 1; i >= 0; i--) {
        const tr = s.ballTrail[i];
        tr.alpha -= 0.035;
        if (tr.alpha <= 0) {
          s.ballTrail.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${tr.alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(tr.x, tr.y, tr.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Ball
      if (!s.winner) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // Ball subtle glow
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Paddles
      // Player Paddle
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(pp.x, pp.y, pp.width, pp.height);

      // AI Paddle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(ap.x, ap.y, ap.width, ap.height);

      // Draw Particle Bursts
      for (let i = s.burstParticles.length - 1; i >= 0; i--) {
        const p = s.burstParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          s.burstParticles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [initTableDots]);

  // Touch / Pointer handlers on canvas
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    touchY.current = e.clientY - rect.top;

    if (!hasStarted) {
      setHasStarted(true);
      stateRef.current.hasStarted = true;
    }
  };

  const handlePointerLeave = () => {
    touchY.current = null;
  };

  return (
    <div className="pong-container">
      {/* Secret Toast if unlocked */}
      {secretToast && (
        <div className="pong-secret-toast">
          <span>{secretToast}</span>
        </div>
      )}

      {/* Minimal Score Display: "03 — 02" */}
      <div className="pong-score-bar">
        <span className="pong-score-num">
          {playerScore.toString().padStart(2, '0')}
        </span>
        <span className="pong-score-divider">—</span>
        <span className="pong-score-num">
          {aiScore.toString().padStart(2, '0')}
        </span>
      </div>

      {/* Main Canvas Table */}
      <div className="pong-canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="pong-canvas"
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        />

        {/* Subtle "Move to play" hint */}
        {!hasStarted && !winner && (
          <div className="pong-hint-overlay">
            <span className="pong-hint-text">Move to play</span>
            <div className="pong-hint-sub">W / S or Drag</div>
          </div>
        )}

        {/* Winner / Game Over Overlay */}
        {winner && (
          <div className="pong-overlay">
            <h2 className="pong-overlay__title">
              {winner === 'PLAYER' ? 'VICTORY' : 'DEFEAT'}
            </h2>
            <div className="pong-btn-group">
              <button
                onClick={restartMatch}
                className="pong-btn"
                data-cursor="expand"
              >
                Play again
              </button>
              <Link
                href="/"
                className="pong-btn pong-btn--secondary"
                data-cursor="expand"
              >
                Return
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Touch Area Controls */}
      <div className="pong-mobile-bar">
        <button
          className="pong-touch-btn"
          onTouchStart={() => {
            upPressed.current = true;
            if (!hasStarted) setHasStarted(true);
          }}
          onTouchEnd={() => (upPressed.current = false)}
          onMouseDown={() => {
            upPressed.current = true;
            if (!hasStarted) setHasStarted(true);
          }}
          onMouseUp={() => (upPressed.current = false)}
        >
          ▲ UP
        </button>

        <button
          className="pong-touch-btn"
          onTouchStart={() => {
            downPressed.current = true;
            if (!hasStarted) setHasStarted(true);
          }}
          onTouchEnd={() => (downPressed.current = false)}
          onMouseDown={() => {
            downPressed.current = true;
            if (!hasStarted) setHasStarted(true);
          }}
          onMouseUp={() => (downPressed.current = false)}
        >
          ▼ DOWN
        </button>
      </div>

      {/* Minimal Footer Home Link */}
      <div className="pong-footer">
        <Link href="/" className="pong-home-link" data-cursor="expand">
          ← Index
        </Link>
      </div>
    </div>
  );
}
