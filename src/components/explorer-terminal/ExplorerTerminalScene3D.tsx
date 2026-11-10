/**
 * EXPLORER-TERMINAL — 3D Windows 11 Docked Console Scene (Three.js)
 *
 * Renders a procedural 3D Windows 11 File Explorer window with a real-time docked terminal:
 * - Acrylic / Mica specular glass chassis with Windows 11 rounded corners and hairline border
 * - Top pane: File Explorer breadcrumb, file list and ribbon
 * - Bottom pane: Real-time docked PowerShell console with dynamic command output
 * - Exploded isometric architectural view showing Win32 hook layers (Host frame, reparented conhost, directory monitor)
 * - Mathematically continuous C^0 Euler rotation & position spline across 5 sections.
 */

'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ExplorerTerminalScene3DProps {
  progressRef: React.MutableRefObject<number>;
  reducedMotion?: boolean;
}

export default function ExplorerTerminalScene3D({ progressRef, reducedMotion = false }: ExplorerTerminalScene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Group and mesh refs
  const windowGroupRef = useRef<THREE.Group | null>(null);
  const explorerFrameRef = useRef<THREE.Mesh | null>(null);
  const screenMeshRef = useRef<THREE.Mesh | null>(null);
  const conhostLayerRef = useRef<THREE.Mesh | null>(null);
  const screenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const screenTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // Mouse parallax state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x09090b, 0.045);

    // 2. Camera Setup (Responsive for mobile viewports)
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 10.5 : 8.2);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const topKeyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    topKeyLight.position.set(5, 9, 7);
    scene.add(topKeyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.6);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    // 5. Dynamic 2D Canvas Texture for Windows 11 Explorer Window
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 950;
    screenCanvasRef.current = canvas;
    const ctx = canvas.getContext('2d');

    const updateScreenCanvas = (mode: 'docked' | 'sync' | 'exploded' | 'terminal_focus') => {
      if (!ctx) return;
      ctx.fillStyle = '#101014';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Titlebar / Mica Header
      ctx.fillStyle = '#18181f';
      ctx.fillRect(0, 0, canvas.width, 56);

      // Window Control Buttons (Minimize, Maximize, Close)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(canvas.width - 130, 22, 14, 2);
      ctx.strokeRect(canvas.width - 90, 18, 12, 12);
      ctx.beginPath();
      ctx.moveTo(canvas.width - 50, 18);
      ctx.lineTo(canvas.width - 38, 30);
      ctx.moveTo(canvas.width - 38, 18);
      ctx.lineTo(canvas.width - 50, 30);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Explorer Address Bar & Breadcrumb
      ctx.fillStyle = '#22222b';
      ctx.fillRect(70, 12, canvas.width - 240, 32);
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 15px monospace';
      ctx.fillText('This PC  >  Local Disk (C:)  >  Projects  >  explorer-terminal', 90, 33);

      // Top Pane: File Explorer Item Grid
      const topHeight = mode === 'terminal_focus' ? 180 : 420;
      ctx.fillStyle = '#121217';
      ctx.fillRect(0, 56, canvas.width, topHeight);

      // Sample Files in Directory
      const files = [
        { name: 'docs', isDir: true, size: '--' },
        { name: 'tests', isDir: true, size: '--' },
        { name: 'explorer-terminal.wh.cpp', isDir: false, size: '60.3 KB' },
        { name: 'CHANGELOG.md', isDir: false, size: '1.2 KB' },
        { name: 'LICENSE', isDir: false, size: '1.1 KB' },
        { name: 'README.md', isDir: false, size: '11.6 KB' },
      ];

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '400 14px monospace';
      ctx.fillText('Name', 40, 90);
      ctx.fillText('Type', 420, 90);
      ctx.fillText('Size', 620, 90);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(30, 105);
      ctx.lineTo(canvas.width - 30, 105);
      ctx.stroke();

      let rowY = 135;
      for (const f of files) {
        if (rowY > topHeight + 30) break;
        ctx.fillStyle = f.isDir ? '#ffffff' : 'rgba(255, 255, 255, 0.85)';
        ctx.font = f.isDir ? '700 15px monospace' : '400 15px monospace';
        ctx.fillText((f.isDir ? '📁 ' : '📄 ') + f.name, 40, rowY);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(f.isDir ? 'File folder' : 'C++ Source / Document', 420, rowY);
        ctx.fillText(f.size, 620, rowY);
        rowY += 36;
      }

      // Splitter Bar (Dock Divider with Resize Handle)
      const splitterY = 56 + topHeight;
      ctx.fillStyle = '#282834';
      ctx.fillRect(0, splitterY, canvas.width, 24);

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 12px monospace';
      ctx.fillText('DOCK DIVIDER (DRAG TO RESIZE)  •  CTRL+J TOGGLE', 40, splitterY + 16);

      // Bottom Pane: Docked PowerShell Terminal
      const termY = splitterY + 24;
      const termHeight = canvas.height - termY;
      ctx.fillStyle = '#08080a';
      ctx.fillRect(0, termY, canvas.width, termHeight);

      // Terminal Output lines
      ctx.fillStyle = '#ffffff';
      ctx.font = '500 16px monospace';

      const terminalLines = [
        'Windows PowerShell',
        'Copyright (C) Microsoft Corporation. All rights reserved.',
        '',
        'PS C:\\Projects\\explorer-terminal> git status',
        'On branch main',
        'Your branch is up to date with \'origin/main\'.',
        'nothing to commit, working tree clean',
        '',
        'PS C:\\Projects\\explorer-terminal> cl.exe /O2 /LD explorer-terminal.wh.cpp',
        'Microsoft (R) C/C++ Optimizing Compiler Version 19.38 for x64',
        'explorer-terminal.wh.cpp -> explorer-terminal.wh.dll',
        'PS C:\\Projects\\explorer-terminal> _',
      ];

      let termLineY = termY + 36;
      for (const line of terminalLines) {
        if (termLineY > canvas.height - 20) break;
        if (line.startsWith('PS ')) {
          ctx.fillStyle = '#ffffff';
        } else if (line.startsWith('nothing') || line.startsWith('Your branch')) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        }
        ctx.fillText(line, 40, termLineY);
        termLineY += 28;
      }
    };

    updateScreenCanvas('docked');

    const screenTexture = new THREE.CanvasTexture(canvas);
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;
    screenTextureRef.current = screenTexture;

    // 6. Build 3D Window Mesh
    const windowGroup = new THREE.Group();
    windowGroupRef.current = windowGroup;
    scene.add(windowGroup);

    const winW = 6.2;
    const winH = 4.2;
    const winD = 0.18;

    // Chassis Backplate (Mica dark texture)
    const chassisGeo = new THREE.BoxGeometry(winW, winH, winD);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x141418,
      metalness: 0.85,
      roughness: 0.25,
    });
    const explorerFrame = new THREE.Mesh(chassisGeo, chassisMat);
    explorerFrameRef.current = explorerFrame;
    windowGroup.add(explorerFrame);

    // 1px Outer Hairline Bevel
    const wireGeo = new THREE.EdgesGeometry(chassisGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    explorerFrame.add(wireMesh);

    // Front Screen Active Plane
    const screenGeo = new THREE.PlaneGeometry(winW - 0.05, winH - 0.05);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      toneMapped: false,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = winD / 2 + 0.005;
    screenMeshRef.current = screenMesh;
    windowGroup.add(screenMesh);

    // Reparented Conhost Virtual Substrate (for Exploded Architecture View)
    const conhostGeo = new THREE.BoxGeometry(winW * 0.95, winH * 0.42, 0.04);
    const conhostMat = new THREE.MeshStandardMaterial({
      color: 0x222228,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9,
    });
    const conhostLayer = new THREE.Mesh(conhostGeo, conhostMat);
    conhostLayer.position.set(0, -winH * 0.24, -0.15);
    conhostLayerRef.current = conhostLayer;
    windowGroup.add(conhostLayer);

    // 7. Mouse Parallax Listeners
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX * 0.4;
      mouseRef.current.targetY = normY * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Window Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const mobile = w < 768;
      cameraRef.current.aspect = w / h;
      cameraRef.current.position.z = mobile ? 10.5 : 8.2;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationId: number;
    let smoothedP = 0;
    let clock = 0;
    let lastRenderMode = 'docked';

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      clock += 0.015;

      // Mouse lerp with fluid inertia
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Smooth scroll lerp (removes stutter and stepped jumps)
      const targetP = progressRef.current || 0;
      smoothedP += (targetP - smoothedP) * 0.075;
      const p = Math.max(0, Math.min(1, smoothedP));

      if (windowGroupRef.current) {
        const group = windowGroupRef.current;
        const conhost = conhostLayerRef.current;

        const isMobileScreen = window.innerWidth < 768;
        const xFactor = isMobileScreen ? 0.35 : 1.0;
        const idleFloat = Math.sin(clock * 1.5) * 0.03;

        // Continuous Spline Across 5 Sections
        if (p < 0.22) {
          // SECTION 1: 0.00 - 0.22 (Hero / Docked Terminal in Explorer)
          const t = p / 0.22;
          group.position.x = THREE.MathUtils.lerp(0.3, 1.15, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(0.0, -0.06, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.0, 0.35, t);

          group.rotation.x = THREE.MathUtils.lerp(0.08, 0.05, t) + mouseRef.current.y * 0.2;
          group.rotation.y = THREE.MathUtils.lerp(-0.3, -0.2, t) + mouseRef.current.x * 0.3;
          group.rotation.z = THREE.MathUtils.lerp(0.02, 0.0, t);

          if (conhost) conhost.position.z = -0.15;

          if (lastRenderMode !== 'docked') {
            updateScreenCanvas('docked');
            if (screenTextureRef.current) screenTextureRef.current.needsUpdate = true;
            lastRenderMode = 'docked';
          }
        } else if (p >= 0.22 && p < 0.48) {
          // SECTION 2: 0.22 - 0.48 (Win32 Hooking & conhost.exe Reparenting)
          const t = (p - 0.22) / 0.26;
          group.position.x = THREE.MathUtils.lerp(1.15, -0.95, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(-0.06, 0.06, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.35, 0.75, t);

          group.rotation.x = THREE.MathUtils.lerp(0.05, 0.18, t) + mouseRef.current.y * 0.18;
          group.rotation.y = THREE.MathUtils.lerp(-0.2, 0.25, t) + mouseRef.current.x * 0.25;
          group.rotation.z = THREE.MathUtils.lerp(0.0, -0.04, t);

          // Explode conhost layer backward in Z space to illustrate injection
          if (conhost) {
            conhost.position.z = THREE.MathUtils.lerp(-0.15, -0.65, t);
          }

          if (lastRenderMode !== 'exploded') {
            updateScreenCanvas('exploded');
            if (screenTextureRef.current) screenTextureRef.current.needsUpdate = true;
            lastRenderMode = 'exploded';
          }
        } else if (p >= 0.48 && p < 0.72) {
          // SECTION 3: 0.48 - 0.72 (Directory Tracking & Real-Time Sync)
          const t = (p - 0.48) / 0.24;
          group.position.x = THREE.MathUtils.lerp(-0.95, 0.0, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(0.06, -0.02, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.75, 0.3, t);

          group.rotation.x = THREE.MathUtils.lerp(0.18, 0.03, t) + mouseRef.current.y * 0.15;
          group.rotation.y = THREE.MathUtils.lerp(0.25, 0.0, t) + mouseRef.current.x * 0.2;
          group.rotation.z = THREE.MathUtils.lerp(-0.04, 0.0, t);

          if (conhost) {
            conhost.position.z = THREE.MathUtils.lerp(-0.65, -0.15, t);
          }

          if (lastRenderMode !== 'sync') {
            updateScreenCanvas('sync');
            if (screenTextureRef.current) screenTextureRef.current.needsUpdate = true;
            lastRenderMode = 'sync';
          }
        } else if (p >= 0.72 && p < 0.90) {
          // SECTION 4: 0.72 - 0.90 (Live Interactive Terminal Focus)
          const t = (p - 0.72) / 0.18;
          group.position.x = THREE.MathUtils.lerp(0.0, 1.1, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(-0.02, 0.04, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.3, 0.55, t);

          group.rotation.x = THREE.MathUtils.lerp(0.03, 0.06, t) + mouseRef.current.y * 0.18;
          group.rotation.y = THREE.MathUtils.lerp(0.0, -0.28, t) + mouseRef.current.x * 0.24;
          group.rotation.z = THREE.MathUtils.lerp(0.0, 0.02, t);

          if (conhost) conhost.position.z = -0.15;

          if (lastRenderMode !== 'terminal_focus') {
            updateScreenCanvas('terminal_focus');
            if (screenTextureRef.current) screenTextureRef.current.needsUpdate = true;
            lastRenderMode = 'terminal_focus';
          }
        } else {
          // SECTION 5: 0.90 - 1.00 (Ecosystem & Quick Start Call)
          const t = (p - 0.90) / 0.10;
          group.position.x = THREE.MathUtils.lerp(1.1, 0.0, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(0.04, 0.08, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.55, 0.2, t);

          group.rotation.x = THREE.MathUtils.lerp(0.06, 0.05, t) + mouseRef.current.y * 0.15;
          group.rotation.y = THREE.MathUtils.lerp(-0.28, 0.0, t) + mouseRef.current.x * 0.2;
          group.rotation.z = 0;

          if (conhost) conhost.position.z = -0.15;

          if (lastRenderMode !== 'docked') {
            updateScreenCanvas('docked');
            if (screenTextureRef.current) screenTextureRef.current.needsUpdate = true;
            lastRenderMode = 'docked';
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [progressRef, reducedMotion]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
}
