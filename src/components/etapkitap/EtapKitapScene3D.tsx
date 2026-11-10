/**
 * ETAPKITAP — 3D Smart Board & Interactive Textbook Scene (Three.js)
 *
 * Renders a procedural 3D interactive classroom smart board & digital textbook:
 * - Brushed anodized aluminum smart board chassis with 1px specular bevels
 * - Dynamic high-res HTML5 Canvas texture displaying real ETAP 23 textbook interfaces
 * - Low-latency vector stylus pen with dynamic floating animations
 * - Mathematically continuous C^0 Euler rotation & position spline across 5 sections
 * - Responsive mobile camera adaptation & zero-dependency WebGL performance.
 */

'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface EtapKitapScene3DProps {
  progressRef: React.MutableRefObject<number>;
  reducedMotion?: boolean;
}

export default function EtapKitapScene3D({ progressRef, reducedMotion = false }: EtapKitapScene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Group and mesh refs
  const boardGroupRef = useRef<THREE.Group | null>(null);
  const chassisMeshRef = useRef<THREE.Mesh | null>(null);
  const screenMeshRef = useRef<THREE.Mesh | null>(null);
  const penGroupRef = useRef<THREE.Group | null>(null);
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
    camera.position.set(0, 0, isMobile ? 10.5 : 8.0);
    cameraRef.current = camera;

    // 3. High-Performance WebGL Renderer
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

    // 4. Studio Lighting System (Brutal monochrome & specular rim)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const topKeyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    topKeyLight.position.set(4, 9, 7);
    scene.add(topKeyLight);

    const sideRimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sideRimLight.position.set(-7, -2, -3);
    scene.add(sideRimLight);

    const bottomFill = new THREE.DirectionalLight(0x444455, 0.6);
    bottomFill.position.set(0, -6, 4);
    scene.add(bottomFill);

    // 5. Dynamic Procedural Screen Canvas (16:9 Smart Board Aspect Ratio)
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 900;
    screenCanvasRef.current = canvas;
    const ctx = canvas.getContext('2d');

    const updateScreenCanvas = (mode: 'book' | 'hotspot' | 'presentation' | 'chalkboard') => {
      if (!ctx) return;
      ctx.fillStyle = '#0a0a0d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (mode === 'book') {
        // Mode 1: Interactive MEB/OGM Textbook Double Page
        // Header Bar
        ctx.fillStyle = '#141418';
        ctx.fillRect(0, 0, canvas.width, 64);
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 24px monospace';
        ctx.fillText('ETAPKITAP // PARDUS ETAP 23 — FİZİK DERSİ (ÜNİTE 3: OPTİK)', 40, 42);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '400 18px monospace';
        ctx.fillText('SAYFA: 84 / 240', canvas.width - 220, 42);

        // Book Page Dividers
        const midX = canvas.width / 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(midX, 80);
        ctx.lineTo(midX, canvas.height - 40);
        ctx.stroke();

        // Left Page Content (Text & Diagram)
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 32px sans-serif';
        ctx.fillText('3.2. Işığın Kırılması ve Snell Yasası', 60, 130);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '400 22px sans-serif';
        const leftLines = [
          'Farklı kırıcılık indisine sahip saydam ortamlardan geçen ışık,',
          'ortam ayrılma yüzeyinde doğrultusunu değiştirir. Bu olaya',
          'ışığın kırılması adı verilir. Gelen ışın, normal ve kırılan ışın',
          'aynı düzlemdedir ve bağıntı şu formülle ifade edilir:',
        ];
        let y = 180;
        for (const line of leftLines) {
          ctx.fillText(line, 60, y);
          y += 38;
        }

        // Formula Box
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.fillRect(60, 360, 620, 90);
        ctx.strokeRect(60, 360, 620, 90);

        ctx.fillStyle = '#ffffff';
        ctx.font = '700 28px monospace';
        ctx.fillText('n₁ · sin(θ₁) = n₂ · sin(θ₂)', 200, 415);

        // Interactive Hotspot Pills
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#ffffff';
        ctx.fillRect(60, 490, 160, 44);
        ctx.fillStyle = '#000000';
        ctx.font = '700 16px monospace';
        ctx.fillText('▶ VİDEO ÇÖZÜM', 75, 518);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.strokeRect(240, 490, 180, 44);
        ctx.fillRect(240, 490, 180, 44);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('ℹ FORMÜL KARTI', 260, 518);

        // Right Page Content (Interactive Quiz / Practice)
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 30px sans-serif';
        ctx.fillText('Örnek Soru 14 (MEB Kazanım)', midX + 50, 130);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '400 22px sans-serif';
        const rightLines = [
          'Hava ortamından (n=1.0) suya (n=1.33) 45° açıyla giren bir',
          'ışık demetinin kırılma açısının sinüs değerini hesaplayınız.',
          '',
          'A) 0.531           B) 0.620           C) 0.707',
          'D) 0.450           E) 0.812',
        ];
        y = 180;
        for (const line of rightLines) {
          ctx.fillText(line, midX + 50, y);
          y += 38;
        }

        // Progressive Reveal Box (Teacher Mode)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(midX + 50, 420, 660, 160);
        ctx.strokeRect(midX + 50, 420, 660, 160);

        ctx.fillStyle = '#ffffff';
        ctx.font = '600 20px monospace';
        ctx.fillText('[ÖĞRETMEN MODU: ÇÖZÜM ADIMI ADIM AÇIK]', midX + 80, 465);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.font = '400 18px monospace';
        ctx.fillText('1 · sin(45°) = 1.33 · sin(θ₂)', midX + 80, 510);
        ctx.fillText('sin(θ₂) = 0.707 / 1.33 = 0.531 → DOĞRU CEVAP: A', midX + 80, 550);
      } else if (mode === 'hotspot') {
        // Mode 2: Normalized Coordinate Hotspot Debug Grid ([0.0, 1.0])
        ctx.fillStyle = '#0f1015';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Coordinate Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= canvas.width; x += 100) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += 100) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = '700 28px monospace';
        ctx.fillText('.AKBOOK // NORMALIZED COORDINATE ENGINE [0.0, 1.0]', 60, 80);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '400 20px monospace';
        ctx.fillText('Dinamik ekran çözünürlüğünden bağımsız vektör hotspot eşleme', 60, 120);

        // Highlight hotspot targets
        const targets = [
          { x: 300, y: 350, label: 'hotspot_01: { x: 0.187, y: 0.388, type: "video" }' },
          { x: 950, y: 280, label: 'hotspot_02: { x: 0.593, y: 0.311, type: "quiz" }' },
          { x: 750, y: 620, label: 'hotspot_03: { x: 0.468, y: 0.688, type: "formula" }' },
        ];

        for (const t of targets) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(t.x - 30, t.y - 30, 60, 60);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.fillRect(t.x - 30, t.y - 30, 60, 60);

          ctx.fillStyle = '#ffffff';
          ctx.font = '600 18px monospace';
          ctx.fillText(t.label, t.x + 45, t.y + 6);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.beginPath();
          ctx.moveTo(t.x, t.y);
          ctx.lineTo(t.x + 40, t.y);
          ctx.stroke();
        }
      } else if (mode === 'presentation') {
        // Mode 3: Spotlight & Presentation Overlay
        ctx.fillStyle = '#050507';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Targeted Spotlight Circle
        const spotX = 800;
        const spotY = 450;
        const radius = 240;

        const grad = ctx.createRadialGradient(spotX, spotY, radius * 0.4, spotX, spotY, radius);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
        grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.02)');
        grad.addColorStop(1, 'rgba(5, 5, 7, 0.95)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(spotX, spotY, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(spotX, spotY, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '700 36px monospace';
        ctx.fillText('AKILLI TAHTA SUNUM ARAÇLARI', 500, 390);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '400 24px monospace';
        ctx.fillText('SPOTLIGHT • PERDE • LAZER İŞARETÇİ • KARALAMA', 440, 440);

        ctx.fillStyle = '#ffffff';
        ctx.font = '600 20px monospace';
        ctx.fillText('Öğrenci dikkatini soruya odaklayan donanımsal katman', 480, 500);
      } else {
        // Mode 4: Low-Latency Chalkboard / Scratchpad Grid
        ctx.fillStyle = '#0a100d'; // Deep classroom chalkboard dark tint
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Chalkboard Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= canvas.width; x += 60) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += 60) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Live Stylus Vector Curves (Bezier smoothing)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(180, 600);
        ctx.bezierCurveTo(320, 200, 540, 800, 780, 360);
        ctx.bezierCurveTo(920, 180, 1100, 520, 1380, 320);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '700 32px monospace';
        ctx.fillText('C++20 & QT 6 DÜŞÜK GECİKMELİ STYLUS ÇİZİM MOTORU', 180, 140);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '400 22px monospace';
        ctx.fillText('Bezier eğrisi yumuşatma • Palm Rejection • 6 Farklı Tahta Şablonu', 180, 190);
      }
    };

    updateScreenCanvas('book');

    const screenTexture = new THREE.CanvasTexture(canvas);
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;
    screenTextureRef.current = screenTexture;

    // 6. Build 3D Smart Board Model
    const boardGroup = new THREE.Group();
    boardGroupRef.current = boardGroup;
    scene.add(boardGroup);

    // Board Dimensions (Modern 65" 16:9 interactive display)
    const boardW = 6.4;
    const boardH = 3.6;
    const frameDepth = 0.22;

    // Brushed Metallic Chassis
    const chassisGeo = new THREE.BoxGeometry(boardW + 0.24, boardH + 0.24, frameDepth);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x18181c,
      metalness: 0.9,
      roughness: 0.28,
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    chassisMeshRef.current = chassisMesh;
    boardGroup.add(chassisMesh);

    // 1px Precision Outer Hairline Border
    const edgesGeo = new THREE.EdgesGeometry(chassisGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    chassisMesh.add(edgesMesh);

    // Front Active Display Surface
    const screenGeo = new THREE.PlaneGeometry(boardW, boardH);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      toneMapped: false,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = frameDepth / 2 + 0.005;
    screenMeshRef.current = screenMesh;
    boardGroup.add(screenMesh);

    // 7. Interactive Stylus Pen Model
    const penGroup = new THREE.Group();
    penGroupRef.current = penGroup;
    boardGroup.add(penGroup);

    const penBodyGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.4, 24);
    const penBodyMat = new THREE.MeshStandardMaterial({
      color: 0x24242a,
      metalness: 0.85,
      roughness: 0.25,
    });
    const penBodyMesh = new THREE.Mesh(penBodyGeo, penBodyMat);
    penGroup.add(penBodyMesh);

    const penTipGeo = new THREE.ConeGeometry(0.045, 0.16, 24);
    const penTipMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.2,
    });
    const penTipMesh = new THREE.Mesh(penTipGeo, penTipMat);
    penTipMesh.position.y = -0.78;
    penTipMesh.rotation.x = Math.PI;
    penGroup.add(penTipMesh);

    penGroup.position.set(3.4, 0, 0.45);
    penGroup.rotation.z = Math.PI / 5;

    // 8. Mouse Parallax Listeners
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX * 0.4;
      mouseRef.current.targetY = normY * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const mobile = w < 768;
      cameraRef.current.aspect = w / h;
      cameraRef.current.position.z = mobile ? 10.5 : 8.0;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 9. Animation Loop (Mathematically Continuous Splines & Idle Physics)
    let animationId: number;
    let smoothedP = 0;
    let clock = 0;
    let lastRenderMode = 'book';

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      clock += 0.015;

      // Mouse lerp with deceleration
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Smooth scroll lerp (removes stutter and stepped jumps)
      const targetP = progressRef.current || 0;
      smoothedP += (targetP - smoothedP) * 0.075;
      const p = Math.max(0, Math.min(1, smoothedP));

      if (boardGroupRef.current) {
        const group = boardGroupRef.current;
        const pen = penGroupRef.current;

        const isMobileScreen = window.innerWidth < 768;
        const xFactor = isMobileScreen ? 0.35 : 1.0;
        const idleFloat = Math.sin(clock * 1.5) * 0.03;

        // Continuous Spline Across 5 Sections
        if (p < 0.22) {
          // SECTION 1: 0.00 - 0.22 (Hero / Native C++20 Smart Board)
          const t = p / 0.22;
          group.position.x = THREE.MathUtils.lerp(0.4, 1.15, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(0.0, -0.06, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.0, 0.4, t);

          group.rotation.x = THREE.MathUtils.lerp(0.08, 0.04, t) + mouseRef.current.y * 0.2;
          group.rotation.y = THREE.MathUtils.lerp(-0.25, -0.15, t) + mouseRef.current.x * 0.3;
          group.rotation.z = THREE.MathUtils.lerp(0.02, 0.0, t);

          if (pen) {
            pen.position.x = THREE.MathUtils.lerp(3.4, 2.9, t) * xFactor;
            pen.position.y = Math.sin(clock * 2.0) * 0.05;
          }

          if (lastRenderMode !== 'book') {
            updateScreenCanvas('book');
            if (screenTextureRef.current) screenTextureRef.current.needsUpdate = true;
            lastRenderMode = 'book';
          }
        } else if (p >= 0.22 && p < 0.48) {
          // SECTION 2: 0.22 - 0.48 (.akbook Package Architecture & Hotspot Engine)
          const t = (p - 0.22) / 0.26;
          group.position.x = THREE.MathUtils.lerp(1.15, -0.9, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(-0.06, 0.06, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.4, 0.8, t);

          group.rotation.x = THREE.MathUtils.lerp(0.04, 0.08, t) + mouseRef.current.y * 0.18;
          group.rotation.y = THREE.MathUtils.lerp(-0.15, 0.22, t) + mouseRef.current.x * 0.25;
          group.rotation.z = THREE.MathUtils.lerp(0.0, -0.02, t);

          if (pen) {
            pen.position.x = THREE.MathUtils.lerp(2.9, 3.2, t) * xFactor;
            pen.position.y = Math.sin(clock * 2.0) * 0.05;
          }

          if (lastRenderMode !== 'hotspot') {
            updateScreenCanvas('hotspot');
            if (screenTextureRef.current) screenTextureRef.current.needsUpdate = true;
            lastRenderMode = 'hotspot';
          }
        } else if (p >= 0.48 && p < 0.72) {
          // SECTION 3: 0.48 - 0.72 (Presentation Suite: Spotlight & Curtain)
          const t = (p - 0.48) / 0.24;
          group.position.x = THREE.MathUtils.lerp(-0.9, 0.0, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(0.06, -0.02, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.8, 0.3, t);

          group.rotation.x = THREE.MathUtils.lerp(0.08, 0.02, t) + mouseRef.current.y * 0.15;
          group.rotation.y = THREE.MathUtils.lerp(0.22, 0.0, t) + mouseRef.current.x * 0.2;
          group.rotation.z = THREE.MathUtils.lerp(-0.02, 0.0, t);

          if (pen) {
            pen.position.x = THREE.MathUtils.lerp(3.2, 3.5, t) * xFactor;
            pen.position.y = Math.sin(clock * 2.0) * 0.05;
          }

          if (lastRenderMode !== 'presentation') {
            updateScreenCanvas('presentation');
            if (screenTextureRef.current) screenTextureRef.current.needsUpdate = true;
            lastRenderMode = 'presentation';
          }
        } else if (p >= 0.72 && p < 0.90) {
          // SECTION 4: 0.72 - 0.90 (Chalkboard Canvas & Low-Latency Stylus Engine)
          const t = (p - 0.72) / 0.18;
          group.position.x = THREE.MathUtils.lerp(0.0, 1.05, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(-0.02, 0.04, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.3, 0.55, t);

          group.rotation.x = THREE.MathUtils.lerp(0.02, 0.06, t) + mouseRef.current.y * 0.18;
          group.rotation.y = THREE.MathUtils.lerp(0.0, -0.25, t) + mouseRef.current.x * 0.24;
          group.rotation.z = THREE.MathUtils.lerp(0.0, 0.02, t);

          // Stylus touches screen drawing lines
          if (pen) {
            pen.position.x = THREE.MathUtils.lerp(3.5, 1.8, t) * xFactor;
            pen.position.y = THREE.MathUtils.lerp(0.05, -0.4, t);
            pen.position.z = 0.25;
            pen.rotation.z = THREE.MathUtils.lerp(Math.PI / 5, Math.PI / 8, t);
          }

          if (lastRenderMode !== 'chalkboard') {
            updateScreenCanvas('chalkboard');
            if (screenTextureRef.current) screenTextureRef.current.needsUpdate = true;
            lastRenderMode = 'chalkboard';
          }
        } else {
          // SECTION 5: 0.90 - 1.00 (Ecosystem & Quick Start Call)
          const t = (p - 0.90) / 0.10;
          group.position.x = THREE.MathUtils.lerp(1.05, 0.0, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(0.04, 0.08, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.55, 0.2, t);

          group.rotation.x = THREE.MathUtils.lerp(0.06, 0.05, t) + mouseRef.current.y * 0.15;
          group.rotation.y = THREE.MathUtils.lerp(-0.25, 0.0, t) + mouseRef.current.x * 0.2;
          group.rotation.z = 0;

          if (pen) {
            pen.position.x = THREE.MathUtils.lerp(1.8, 3.4, t) * xFactor;
            pen.position.y = 0;
            pen.position.z = 0.45;
          }

          if (lastRenderMode !== 'book') {
            updateScreenCanvas('book');
            if (screenTextureRef.current) screenTextureRef.current.needsUpdate = true;
            lastRenderMode = 'book';
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
