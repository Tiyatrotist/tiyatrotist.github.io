/**
 * TIYATROTIST — Advanced Interactive Monochrome Particle Physics Sandbox
 *
 * High-performance 60 FPS HTML5 Canvas physical simulation laboratory:
 * - 5 Distinct Physical Modes: Galaxy (Keplerian orbit), Flow Field (Perlin vector liquid),
 *   Network (Dynamic neural web mesh), Vortex (Relativistic black hole), Kinetic Sand (Granular collision).
 * - Interactive Mouse Tools: Attract (Gravity Well), Repel (Shockwave), Spawn (Emitter), Connect.
 * - Interactive HUD: Fullscreen mode, particle density controls, vector force toggles.
 * - Zero emojis, pure monochrome contrast, fully localized via Dictionary system.
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Locale, getDictionary } from '@/dictionaries';

export type SandboxMode = 'galaxy' | 'flow' | 'network' | 'vortex' | 'sand';
export type SandboxTool = 'attract' | 'repel' | 'spawn' | 'connect';
export type GravityDir = 'down' | 'up' | 'zero' | 'vortex';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originX?: number;
  originY?: number;
  size: number;
  alpha: number;
  char?: string;
  life: number;
  maxLife: number;
}

interface ParticleSandboxProps {
  lang?: Locale;
}

export default function ParticleSandbox({ lang = 'tr' }: ParticleSandboxProps) {
  const dict = getDictionary(lang);
  const s = dict.sandbox;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<SandboxMode>('galaxy');
  const [tool, setTool] = useState<SandboxTool>('attract');
  const [gravity, setGravity] = useState<GravityDir>('zero');
  const [particleDensity, setParticleDensity] = useState<number>(1000);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.2);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);

  // Mutable animation state references
  const particlesRef = useRef<Particle[]>([]);
  const isMouseDownRef = useRef<boolean>(false);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const frameCounterRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(performance.now());

  // Generate particles based on active mode
  const initModeParticles = useCallback(
    (targetMode: SandboxMode, count: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const centerX = width / 2;
      const centerY = height / 2;

      const particles: Particle[] = [];

      if (targetMode === 'galaxy') {
        // Dual-arm logarithmic spiral galaxy with orbital velocities
        for (let i = 0; i < count; i++) {
          const arm = i % 2 === 0 ? 0 : Math.PI;
          const dist = Math.pow(Math.random(), 1.5) * Math.min(centerX, centerY) * 0.85 + 10;
          const angle = arm + dist * 0.015 + (Math.random() - 0.5) * 0.5;

          const px = centerX + Math.cos(angle) * dist;
          const py = centerY + Math.sin(angle) * dist;

          // Tangential orbital velocity (Keplerian-like)
          const orbitalSpeed = Math.sqrt(Math.max(1, dist)) * 0.12;
          const vx = -Math.sin(angle) * orbitalSpeed;
          const vy = Math.cos(angle) * orbitalSpeed;

          particles.push({
            x: px,
            y: py,
            vx,
            vy,
            originX: px,
            originY: py,
            size: Math.random() < 0.2 ? 2.2 : 1.2,
            alpha: 0.4 + Math.random() * 0.6,
            life: 0,
            maxLife: Infinity,
          });
        }
      } else if (targetMode === 'flow') {
        // Uniform grid of particles ready for vector flow streamlines
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0,
            vy: 0,
            size: 1.3,
            alpha: 0.3 + Math.random() * 0.5,
            life: Math.random() * 400,
            maxLife: 300 + Math.random() * 300,
          });
        }
      } else if (targetMode === 'network') {
        // Nodes floating with slight Brownian motion for dynamic constellation lines
        const nodeCount = Math.min(count, 180);
        for (let i = 0; i < nodeCount; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            size: 2.2 + Math.random() * 2,
            alpha: 0.8,
            life: 0,
            maxLife: Infinity,
          });
        }
      } else if (targetMode === 'vortex') {
        // Swirling vortex accretion disk
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 30 + Math.random() * Math.min(centerX, centerY) * 0.8;
          particles.push({
            x: centerX + Math.cos(angle) * dist,
            y: centerY + Math.sin(angle) * dist,
            vx: -Math.sin(angle) * 1.5,
            vy: Math.cos(angle) * 1.5,
            size: 1.2 + Math.random() * 1.8,
            alpha: 0.5 + Math.random() * 0.5,
            life: 0,
            maxLife: Infinity,
          });
        }
      } else if (targetMode === 'sand') {
        // Granular kinetic sand particles
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * (height * 0.6),
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 2,
            size: 2 + Math.random() * 1.5,
            alpha: 0.85,
            life: 0,
            maxLife: Infinity,
          });
        }
      }

      particlesRef.current = particles;
    },
    []
  );

  // Resize canvas according to device pixel ratio
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  // Update canvas on container resize or mode change
  useEffect(() => {
    handleResize();
    initModeParticles(mode, particleDensity);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize, mode, particleDensity, initModeParticles]);

  // Main 60 FPS Physics & Render Loop
  useEffect(() => {
    let animId: number;

    const render = (time: number) => {
      animId = requestAnimationFrame(render);

      // Measure real FPS
      frameCounterRef.current++;
      if (time - lastFpsUpdateRef.current >= 600) {
        setFps(Math.round((frameCounterRef.current * 1000) / (time - lastFpsUpdateRef.current)));
        frameCounterRef.current = 0;
        lastFpsUpdateRef.current = time;
      }

      if (isPaused) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const centerX = width / 2;
      const centerY = height / 2;

      // Trailing fade for motion blur
      if (mode === 'flow') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      const particles = particlesRef.current;
      const isMouseDown = isMouseDownRef.current;
      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;

      // 1. Spawning via tool
      if (isMouseDown && tool === 'spawn') {
        for (let k = 0; k < 6; k++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 1 + Math.random() * 3;
          particles.push({
            x: mx + (Math.random() - 0.5) * 10,
            y: my + (Math.random() - 0.5) * 10,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            size: 1.5 + Math.random() * 2,
            alpha: 1.0,
            life: 0,
            maxLife: 300,
          });
        }
      }

      // 2. Network connection drawing (Constellation mode)
      if (mode === 'network') {
        ctx.lineWidth = 0.6;
        const maxDist = 95;
        const pLen = particles.length;

        for (let i = 0; i < pLen; i++) {
          const pi = particles[i];
          for (let j = i + 1; j < pLen; j++) {
            const pj = particles[j];
            const dx = pi.x - pj.x;
            const dy = pi.y - pj.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
              const alpha = (1 - dist / maxDist) * 0.45;
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
              ctx.stroke();
            }
          }
        }
      }

      // 3. Physics update & render each particle
      ctx.fillStyle = '#ffffff';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Mode specific internal dynamics
        if (mode === 'galaxy') {
          // Central gravity toward center
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 5) {
            const force = (120 / (dist * dist + 400)) * speedMultiplier;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        } else if (mode === 'flow') {
          // Pseudorandom Perlin-like vector flow
          const scale = 0.0035;
          const angle =
            Math.sin(p.x * scale) * Math.cos(p.y * scale) * Math.PI * 4 +
            (time * 0.0003);
          p.vx += Math.cos(angle) * 0.35 * speedMultiplier;
          p.vy += Math.sin(angle) * 0.35 * speedMultiplier;
          p.vx *= 0.94;
          p.vy *= 0.94;

          p.life++;
          if (p.life > p.maxLife) {
            p.x = Math.random() * width;
            p.y = Math.random() * height;
            p.vx = 0;
            p.vy = 0;
            p.life = 0;
          }
        } else if (mode === 'vortex') {
          // Pull into center and accelerate angularly
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 2) {
            p.vx += (dx / dist) * 0.15 * speedMultiplier;
            p.vy += (dy / dist) * 0.15 * speedMultiplier;
            // Angular spin
            p.vx += (-dy / dist) * 0.35 * speedMultiplier;
            p.vy += (dx / dist) * 0.35 * speedMultiplier;
          } else {
            // Respawn on outer edge
            const ang = Math.random() * Math.PI * 2;
            const r = Math.min(centerX, centerY) * 0.8;
            p.x = centerX + Math.cos(ang) * r;
            p.y = centerY + Math.sin(ang) * r;
            p.vx = -Math.sin(ang) * 1.5;
            p.vy = Math.cos(ang) * 1.5;
          }
        } else if (mode === 'sand') {
          // Bouncing floor/wall physics
          if (p.y > height - p.size) {
            p.y = height - p.size;
            p.vy = -p.vy * 0.35;
            p.vx *= 0.85;
          }
        }

        // Global gravity forces
        if (gravity === 'down') {
          p.vy += 0.14 * speedMultiplier;
        } else if (gravity === 'up') {
          p.vy -= 0.14 * speedMultiplier;
        } else if (gravity === 'vortex') {
          const dx = mx - p.x;
          const dy = my - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > 5 && d < 400) {
            p.vx += (dx / d) * 0.3 * speedMultiplier;
            p.vy += (dy / d) * 0.3 * speedMultiplier;
            p.vx += (-dy / d) * 0.25 * speedMultiplier;
            p.vy += (dx / d) * 0.25 * speedMultiplier;
          }
        }

        // Mouse interactive tool forces
        if (isMouseDown || tool === 'attract' || tool === 'repel') {
          const dx = mx - p.x;
          const dy = my - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const reach = isMouseDown ? 240 : 120;

          if (d > 2 && d < reach) {
            const factor = (1 - d / reach) * (isMouseDown ? 2.2 : 0.8);
            if (tool === 'attract') {
              p.vx += (dx / d) * factor * speedMultiplier;
              p.vy += (dy / d) * factor * speedMultiplier;
            } else if (tool === 'repel') {
              p.vx -= (dx / d) * factor * 2.5 * speedMultiplier;
              p.vy -= (dy / d) * factor * 2.5 * speedMultiplier;
            } else if (tool === 'connect') {
              p.vx += (dx / d) * 0.1;
              p.vy += (dy / d) * 0.1;
            }
          }
        }

        // Friction / damping
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Position integration
        p.x += p.vx;
        p.y += p.vy;

        // Boundary wrapping or bounce
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Render point
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [mode, gravity, tool, isPaused, speedMultiplier]);

  // Mouse / Touch interaction handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    isMouseDownRef.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerUp = () => {
    isMouseDownRef.current = false;
  };

  // Snapshot PNG export
  const handleSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `tiyatrotist-sandbox-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Clear canvas
  const handleClear = () => {
    particlesRef.current = [];
  };

  return (
    <div
      ref={containerRef}
      className={`particle-sandbox-root ${isFullscreen ? 'sandbox-fullscreen' : ''}`}
      style={{
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : undefined,
        zIndex: isFullscreen ? 99999 : 1,
        width: '100%',
        height: isFullscreen ? '100vh' : '620px',
        backgroundColor: '#000000',
        borderRadius: isFullscreen ? 0 : '8px',
        border: isFullscreen ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      }}
    >
      {/* Top Telemetry & Presets Bar */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.65rem 1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(12px)',
          flexWrap: 'wrap',
          gap: '0.5rem',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.45)', letterSpacing: '0.12em' }}>
            {s.tag}
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#ffffff' }}>
            {s.title}
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              color: '#000000',
              background: '#ffffff',
              padding: '0.1rem 0.4rem',
              borderRadius: '2px',
              fontWeight: 700,
            }}
          >
            {fps} FPS
          </span>
          <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>
            // {particlesRef.current.length} {s.controls.particles}
          </span>
        </div>

        {/* Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {(
            [
              { id: 'galaxy', label: s.modes.galaxy },
              { id: 'flow', label: s.modes.flow },
              { id: 'network', label: s.modes.network },
              { id: 'vortex', label: s.modes.vortex },
              { id: 'sand', label: s.modes.sand },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMode(m.id);
                initModeParticles(m.id, particleDensity);
              }}
              data-cursor="expand"
              style={{
                fontSize: '0.68rem',
                padding: '0.25rem 0.55rem',
                borderRadius: '3px',
                border: `1px solid ${mode === m.id ? '#ffffff' : 'rgba(255, 255, 255, 0.12)'}`,
                background: mode === m.id ? '#ffffff' : 'transparent',
                color: mode === m.id ? '#000000' : 'rgba(255, 255, 255, 0.65)',
                fontWeight: mode === m.id ? 700 : 400,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              [ {m.label} ]
            </button>
          ))}
        </div>
      </header>

      {/* Physics Canvas Area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            cursor: tool === 'attract' ? 'crosshair' : tool === 'repel' ? 'cell' : 'pointer',
            touchAction: 'none',
          }}
        />

        {/* Instructional Watermark */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            pointerEvents: 'none',
            fontSize: '0.68rem',
            color: 'rgba(255, 255, 255, 0.35)',
            lineHeight: 1.5,
          }}
        >
          <span>{lang === 'tr' ? 'FARE: Sürükle / Etkileşime Geç' : 'MOUSE: Click & Drag to Interact'}</span>
          <br />
          <span>{lang === 'tr' ? `AKTİF ARAÇ: ${tool.toUpperCase()}` : `ACTIVE TOOL: ${tool.toUpperCase()}`}</span>
        </div>
      </div>

      {/* Bottom Floating Control Dock */}
      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(16px)',
          flexWrap: 'wrap',
          gap: '0.75rem',
          zIndex: 10,
        }}
      >
        {/* Left: Interactive Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginRight: '0.2rem' }}>
            {lang === 'tr' ? 'ARAÇLAR:' : 'TOOLS:'}
          </span>
          {(
            [
              { id: 'attract', label: s.tools.attract },
              { id: 'repel', label: s.tools.repel },
              { id: 'spawn', label: s.tools.spawn },
              { id: 'connect', label: s.tools.connect },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTool(t.id)}
              data-cursor="expand"
              style={{
                fontSize: '0.68rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '3px',
                border: `1px solid ${tool === t.id ? '#ffffff' : 'rgba(255, 255, 255, 0.12)'}`,
                background: tool === t.id ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: tool === t.id ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
                fontWeight: tool === t.id ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Center: Gravity Vectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {(
            [
              { id: 'zero', label: s.gravity.zero },
              { id: 'down', label: s.gravity.down },
              { id: 'up', label: s.gravity.up },
              { id: 'vortex', label: s.gravity.vortex },
            ] as const
          ).map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGravity(g.id)}
              data-cursor="expand"
              style={{
                fontSize: '0.68rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '3px',
                border: `1px solid ${gravity === g.id ? '#ffffff' : 'rgba(255, 255, 255, 0.12)'}`,
                background: gravity === g.id ? '#ffffff' : 'transparent',
                color: gravity === g.id ? '#000000' : 'rgba(255, 255, 255, 0.55)',
                fontWeight: gravity === g.id ? 700 : 400,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Right: Sliders & Window Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Density slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>
              {s.controls.particles}
            </span>
            <input
              type="range"
              min="300"
              max="2200"
              step="100"
              value={particleDensity}
              onChange={(e) => {
                const count = parseInt(e.target.value, 10);
                setParticleDensity(count);
                initModeParticles(mode, count);
              }}
              style={{ width: '55px', accentColor: '#ffffff', cursor: 'pointer' }}
            />
          </div>

          {/* Speed slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>
              {s.controls.speed}
            </span>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.1"
              value={speedMultiplier}
              onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
              style={{ width: '50px', accentColor: '#ffffff', cursor: 'pointer' }}
            />
          </div>

          {/* Actions */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            data-cursor="expand"
            style={{
              fontSize: '0.68rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '3px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'transparent',
              color: '#ffffff',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {isPaused ? s.controls.play : s.controls.pause}
          </button>

          <button
            type="button"
            onClick={handleClear}
            data-cursor="expand"
            style={{
              fontSize: '0.68rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '3px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {s.controls.clear}
          </button>

          <button
            type="button"
            onClick={handleSnapshot}
            data-cursor="expand"
            style={{
              fontSize: '0.68rem',
              padding: '0.25rem 0.55rem',
              borderRadius: '3px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 600,
            }}
          >
            {s.controls.snapshot}
          </button>

          {/* Fullscreen toggle */}
          <button
            type="button"
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              setTimeout(handleResize, 100);
            }}
            data-cursor="expand"
            style={{
              fontSize: '0.68rem',
              padding: '0.25rem 0.55rem',
              borderRadius: '3px',
              border: '1px solid #ffffff',
              background: isFullscreen ? '#ffffff' : 'transparent',
              color: isFullscreen ? '#000000' : '#ffffff',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 700,
            }}
          >
            {s.controls.fullscreen}
          </button>
        </div>
      </footer>
    </div>
  );
}
