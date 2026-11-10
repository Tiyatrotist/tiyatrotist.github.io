/**
 * BOOKOS — High-Craft 3D Procedural Device Scene (Three.js)
 *
 * Renders an ultra-minimal monolithic computing device with:
 * - Rounded metallic bevels and physical PBR materials
 * - Dual-layer exploded architecture (Digitizer + Core Engine + Substrate)
 * - Dynamic transformation between Mobile Reader, Ultra-Wide Smart Board, and Exploded View
 * - Mouse parallax tilt and specular rim reflections
 * - 100% Procedural, zero external asset downloads, instant offline load.
 */

'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface BookOSScene3DProps {
  progressRef: React.MutableRefObject<number>;
  reducedMotion?: boolean;
}

export default function BookOSScene3D({ progressRef, reducedMotion = false }: BookOSScene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Mesh references for transformation
  const deviceGroupRef = useRef<THREE.Group | null>(null);
  const chassisMeshRef = useRef<THREE.Mesh | null>(null);
  const screenMeshRef = useRef<THREE.Mesh | null>(null);
  const screenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const screenTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const glassLayerRef = useRef<THREE.Mesh | null>(null);
  const circuitLayerRef = useRef<THREE.Group | null>(null);
  const penMeshRef = useRef<THREE.Mesh | null>(null);

  // Mouse interaction state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x09090b, 0.045);

    // 2. Camera Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 9.8 : 7.5);
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

    // 4. Lighting System (Minimalist Studio Specular Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
    rimLight.position.set(-6, -4, -3);
    scene.add(rimLight);

    const bottomFillLight = new THREE.DirectionalLight(0x444455, 0.8);
    bottomFillLight.position.set(0, -6, 4);
    scene.add(bottomFillLight);

    // 5. Build Procedural Monolithic Device Group
    const deviceGroup = new THREE.Group();
    deviceGroupRef.current = deviceGroup;
    scene.add(deviceGroup);

    // Helper: Rounded Rectangle Shape
    const createRoundedRect = (w: number, h: number, r: number) => {
      const shape = new THREE.Shape();
      shape.moveTo(-w / 2 + r, -h / 2);
      shape.lineTo(w / 2 - r, -h / 2);
      shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      shape.lineTo(w / 2, h / 2 - r);
      shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      shape.lineTo(-w / 2 + r, h / 2);
      shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      shape.lineTo(-w / 2, -h / 2 + r);
      shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      return shape;
    };

    // Base Chassis Geometry (Extruded Rounded Box)
    const chassisWidth = 3.2;
    const chassisHeight = 4.4;
    const chassisDepth = 0.16;
    const radius = 0.18;

    const chassisShape = createRoundedRect(chassisWidth, chassisHeight, radius);
    const extrudeSettings = {
      depth: chassisDepth,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    };

    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
    chassisGeo.center();

    // Dark Brushed Titanium Chassis Material
    const chassisMat = new THREE.MeshPhysicalMaterial({
      color: 0x141416,
      metalness: 0.85,
      roughness: 0.28,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      reflectivity: 0.7,
    });

    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    chassisMeshRef.current = chassisMesh;
    deviceGroup.add(chassisMesh);

    // Hairline Border Edge Outline
    const edgesGeo = new THREE.EdgesGeometry(chassisGeo, 24);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.22,
    });
    const edgeLines = new THREE.LineSegments(edgesGeo, edgesMat);
    chassisMesh.add(edgeLines);

    // Screen Texture Generation via Offscreen Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1400;
    screenCanvasRef.current = canvas;
    const ctx = canvas.getContext('2d');

    const updateScreenCanvas = (mode: 'reading' | 'board' | 'core') => {
      if (!ctx) return;
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (mode === 'reading') {
        // Phase 1: Pure Minimal Markdown Reader Surface
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 36px monospace';
        ctx.fillText('BOOKOS // WORKSPACE v1.0', 70, 110);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '400 24px monospace';
        ctx.fillText('FAZ 1: DOKUNMATİK OKUMA & SADE NOTLAR', 70, 160);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(70, 200);
        ctx.lineTo(canvas.width - 70, 200);
        ctx.stroke();

        // Sample text lines
        const lines = [
          '# 01. Sıfır Dikkat Dağıtıcı Arayüz',
          '',
          'İşletim sistemi kabuğu, içeriğin önüne geçmez.',
          'Pencere karmaşası ve bildirim patlamaları',
          'yerine; derin odaklanma ve yüksek kontrastlı',
          'tipografik bir okuma yüzeyi sunar.',
          '',
          '```cpp',
          '// Zero Latency Core Architecture',
          'class BookOSKernel {',
          'public:',
          '    void renderSurface(Canvas& surface);',
          '    void syncClassroomBoard();',
          '};',
          '```',
          '',
          '• Hafif bellek ayak izi (< 32 MB)',
          '• Yerel-öncelikli (Local-First) veri modeli',
          '• Dokunmatik ekranlar için hassas yanıt',
        ];

        ctx.font = '400 28px monospace';
        let y = 270;
        for (const line of lines) {
          if (line.startsWith('#')) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '700 32px sans-serif';
          } else if (line.startsWith('```') || line.startsWith('class') || line.startsWith('public') || line.startsWith('    ')) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.font = '400 24px monospace';
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
            ctx.font = '400 26px sans-serif';
          }
          ctx.fillText(line, 70, y);
          y += 48;
        }
      } else if (mode === 'board') {
        // Phase 2: Smart Board & Classroom Blackboard Mode
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 38px monospace';
        ctx.fillText('BOOKOS // ETAP 23 PLUS (SMART BOARD OS)', 70, 110);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '400 24px monospace';
        ctx.fillText('FAZ 2: PARDUS ETAP\'I AŞAN AKILLI TAHTA SİSTEMİ', 70, 160);

        // Grid lines (Blackboard grid simulation)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 70; x < canvas.width - 70; x += 50) {
          ctx.beginPath();
          ctx.moveTo(x, 220);
          ctx.lineTo(x, canvas.height - 120);
          ctx.stroke();
        }
        for (let y = 220; y < canvas.height - 120; y += 50) {
          ctx.beginPath();
          ctx.moveTo(70, y);
          ctx.lineTo(canvas.width - 70, y);
          ctx.stroke();
        }

        // Live Stylus Curve Simulation
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(120, 480);
        ctx.bezierCurveTo(240, 360, 400, 620, 600, 420);
        ctx.bezierCurveTo(750, 280, 880, 500, 920, 450);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '600 24px monospace';
        ctx.fillText('✓ Düşük Gecikmeli Çizim Motoru (< 8ms Input Lag)', 120, 680);
        ctx.fillText('✓ Dahili Z-Kitap & Ders Notu Entegrasyonu', 120, 730);
        ctx.fillText('✓ Sıfır Çökme / Yerel C++20 Çekirdek Servisleri', 120, 780);
      } else {
        // Phase 3: Core Kernel Architecture
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 36px monospace';
        ctx.fillText('BOOKOS // ARCHITECTURAL SUBSTRATE', 70, 110);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '400 24px monospace';
        ctx.fillText('C++20 / POSIX CORE • ZERO WEBVİEW OVERHEAD', 70, 160);

        // Core blocks
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.strokeRect(100, 260, 824, 180);
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 28px monospace';
        ctx.fillText('[ 01 ] HARDWARE DIGITIZER & MULTI-TOUCH LAYER', 140, 340);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '400 22px monospace';
        ctx.fillText('Raw input events, 120Hz polling, zero event lag', 140, 385);

        ctx.strokeRect(100, 480, 824, 180);
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 28px monospace';
        ctx.fillText('[ 02 ] NATIVE C++20 COMPOSITOR & RUNTIME', 140, 560);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '400 22px monospace';
        ctx.fillText('Hardware-accelerated viewport, memory isolation', 140, 605);

        ctx.strokeRect(100, 700, 824, 180);
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 28px monospace';
        ctx.fillText('[ 03 ] SYNCHRONIZED NOTE REPOSITORY', 140, 780);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '400 22px monospace';
        ctx.fillText('Plain markdown text, cryptographic offline hash verification', 140, 825);
      }
    };

    updateScreenCanvas('reading');

    const screenTexture = new THREE.CanvasTexture(canvas);
    screenTexture.generateMipmaps = true;
    screenTexture.minFilter = THREE.LinearMipmapLinearFilter;
    screenTextureRef.current = screenTexture;

    // Screen Mesh
    const screenGeo = new THREE.PlaneGeometry(chassisWidth - 0.24, chassisHeight - 0.28);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      transparent: true,
      opacity: 0.96,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = chassisDepth / 2 + 0.045;
    screenMeshRef.current = screenMesh;
    chassisMesh.add(screenMesh);

    // Front Glass Layer (Reflective Floating Touch Digitizer)
    const glassGeo = new THREE.PlaneGeometry(chassisWidth - 0.1, chassisHeight - 0.1);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.88,
      ior: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.z = chassisDepth / 2 + 0.08;
    glassLayerRef.current = glassMesh;
    chassisMesh.add(glassMesh);

    // Exploded View Circuit / Substrate Layer (Hidden initially, separates at architecture section)
    const circuitGroup = new THREE.Group();
    circuitLayerRef.current = circuitGroup;

    // Internal Motherboard Substrate Plate
    const circuitPlateGeo = new THREE.PlaneGeometry(chassisWidth - 0.3, chassisHeight - 0.3);
    const circuitPlateMat = new THREE.MeshStandardMaterial({
      color: 0x0f1115,
      metalness: 0.9,
      roughness: 0.4,
    });
    const circuitPlate = new THREE.Mesh(circuitPlateGeo, circuitPlateMat);
    circuitPlate.position.z = -0.05;
    circuitGroup.add(circuitPlate);

    // Subtle Chip Geometries on Motherboard
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x24242b, metalness: 0.8, roughness: 0.3 });
    const cpuChip = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.06), chipMat);
    cpuChip.position.set(0, 0.3, 0);
    circuitGroup.add(cpuChip);

    const memChip1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.04), chipMat);
    memChip1.position.set(-0.8, -0.6, 0);
    circuitGroup.add(memChip1);

    const memChip2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.04), chipMat);
    memChip2.position.set(0.8, -0.6, 0);
    circuitGroup.add(memChip2);

    chassisMesh.add(circuitGroup);
    circuitGroup.position.z = 0;

    // Stylus Pen (Floats beside smart board)
    const penGeo = new THREE.CylinderGeometry(0.045, 0.045, 2.6, 16);
    const penMat = new THREE.MeshPhysicalMaterial({
      color: 0x1f1f24,
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 0.5,
    });
    const penMesh = new THREE.Mesh(penGeo, penMat);
    penMesh.position.set(2.4, 0, 0.4);
    penMesh.rotation.z = Math.PI / 6;
    penMesh.visible = false;
    penMeshRef.current = penMesh;
    deviceGroup.add(penMesh);

    // Mouse Parallax Event Listeners
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX * 0.45;
      mouseRef.current.targetY = normY * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Window Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const mobile = w < 768;
      cameraRef.current.aspect = w / h;
      cameraRef.current.position.z = mobile ? 9.8 : 7.5;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 6. Animation Loop (Driven by Smooth Interpolated Scroll Progress & Mouse Inertia)
    let lastRenderMode: string = 'reading';
    let animationId: number;
    let smoothedP = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Smooth mouse lerp with deceleration
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Smooth scroll progress lerp (removes stutter and stepped jumps)
      const targetP = progressRef.current || 0;
      smoothedP += (targetP - smoothedP) * 0.075;
      const p = Math.max(0, Math.min(1, smoothedP));

      if (deviceGroupRef.current && chassisMeshRef.current) {
        const group = deviceGroupRef.current;
        const chassis = chassisMeshRef.current;
        const glass = glassLayerRef.current;
        const circuit = circuitLayerRef.current;
        const pen = penMeshRef.current;

        // Maintain solid physical proportions (no warping of corner radiuses)
        chassis.scale.set(1, 1, 1);

        const isMobileScreen = window.innerWidth < 768;
        const xFactor = isMobileScreen ? 0.35 : 1.0;

        // Continuous Spline / Motion Paths Across Scroll
        if (p < 0.22) {
          // SECTION 1: Hero / Philosophy
          const t = p / 0.22;
          group.position.x = THREE.MathUtils.lerp(0.3, 0.9, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(0.0, -0.05, t);
          group.position.z = THREE.MathUtils.lerp(0.0, 0.3, t);

          group.rotation.x = THREE.MathUtils.lerp(0.12, 0.06, t) + mouseRef.current.y * 0.25;
          group.rotation.y = THREE.MathUtils.lerp(-0.35, -0.22, t) + mouseRef.current.x * 0.35;
          group.rotation.z = THREE.MathUtils.lerp(0.02, 0.0, t);

          if (glass) glass.position.z = chassisDepth / 2 + 0.08;
          if (circuit) circuit.position.z = 0;
          if (pen) pen.visible = false;

          if (lastRenderMode !== 'reading') {
            updateScreenCanvas('reading');
            if (screenTextureRef.current) screenTextureRef.current.needsUpdate = true;
            lastRenderMode = 'reading';
          }
        } else if (p >= 0.22 && p < 0.48) {
          // SECTION 2: Phase 1 — Mobile & Web Reading Surface
          const t = (p - 0.22) / 0.26;
          group.position.x = THREE.MathUtils.lerp(0.9, -0.7, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(-0.05, 0.0, t);
          group.position.z = THREE.MathUtils.lerp(0.3, 0.9, t);

          group.rotation.x = THREE.MathUtils.lerp(0.06, 0.0, t) + mouseRef.current.y * 0.2;
          group.rotation.y = THREE.MathUtils.lerp(-0.22, 0.12, t) + mouseRef.current.x * 0.3;
          group.rotation.z = 0;

          if (glass) glass.position.z = chassisDepth / 2 + 0.08;
          if (circuit) circuit.position.z = 0;
          if (pen) pen.visible = false;

          if (lastRenderMode !== 'reading') {
            updateScreenCanvas('reading');
            if (screenTextureRef.current) screenTextureRef.current.needsUpdate = true;
            lastRenderMode = 'reading';
          }
        } else if (p >= 0.48 && p < 0.72) {
          // SECTION 3: Phase 2 — Smart Board & PC (Smooth 90deg orientation rotation)
          const t = (p - 0.48) / 0.24;

          group.position.x = THREE.MathUtils.lerp(-0.7, -0.1, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(0.0, 0.1, t);
          group.position.z = THREE.MathUtils.lerp(0.9, 0.4, t);

          // Smoothly turns into landscape interactive board
          group.rotation.x = THREE.MathUtils.lerp(0.0, 0.04, t) + mouseRef.current.y * 0.18;
          group.rotation.y = THREE.MathUtils.lerp(0.12, -0.06, t) + mouseRef.current.x * 0.22;
          group.rotation.z = THREE.MathUtils.lerp(0.0, -Math.PI / 2, t);

          if (glass) glass.position.z = chassisDepth / 2 + 0.08;
          if (circuit) circuit.position.z = 0;

          // Float Stylus Pen alongside board
          if (pen) {
            pen.visible = true;
            pen.position.x = THREE.MathUtils.lerp(2.8, 2.3, t) * xFactor;
            pen.position.y = Math.sin(Date.now() * 0.002) * 0.06;
          }

          if (lastRenderMode !== 'board') {
            updateScreenCanvas('board');
            if (screenTextureRef.current) screenTextureRef.current.needsUpdate = true;
            lastRenderMode = 'board';
          }
        } else if (p >= 0.72 && p < 0.90) {
          // SECTION 4: Architecture — Exploded Z-Space Layers
          const t = (p - 0.72) / 0.18;

          group.position.x = THREE.MathUtils.lerp(-0.1, 0.65, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(0.1, 0.0, t);
          group.position.z = THREE.MathUtils.lerp(0.4, 0.5, t);

          // Smoothly rotates back to portrait isometric exploded view
          group.rotation.x = THREE.MathUtils.lerp(0.04, 0.32, t) + mouseRef.current.y * 0.22;
          group.rotation.y = THREE.MathUtils.lerp(-0.06, -0.45, t) + mouseRef.current.x * 0.28;
          group.rotation.z = THREE.MathUtils.lerp(-Math.PI / 2, 0.0, t);

          // Explode layers physically in Z space
          if (glass) {
            glass.position.z = chassisDepth / 2 + 0.08 + THREE.MathUtils.lerp(0, 0.5, t);
          }
          if (circuit) {
            circuit.position.z = THREE.MathUtils.lerp(0, -0.4, t);
          }
          if (pen) pen.visible = false;

          if (lastRenderMode !== 'core') {
            updateScreenCanvas('core');
            if (screenTextureRef.current) screenTextureRef.current.needsUpdate = true;
            lastRenderMode = 'core';
          }
        } else {
          // SECTION 5: Ecosystem & Call to Action (Lock back together)
          const t = (p - 0.90) / 0.10;

          group.position.x = THREE.MathUtils.lerp(0.65, 0.0, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(0.0, 0.05, t);
          group.position.z = THREE.MathUtils.lerp(0.5, 0.2, t);

          group.rotation.x = THREE.MathUtils.lerp(0.32, 0.1, t) + mouseRef.current.y * 0.2;
          group.rotation.y = THREE.MathUtils.lerp(-0.45, 0.0, t) + mouseRef.current.x * 0.25;
          group.rotation.z = 0;

          if (glass) glass.position.z = chassisDepth / 2 + 0.08;
          if (circuit) circuit.position.z = 0;
          if (pen) pen.visible = false;

          if (lastRenderMode !== 'reading') {
            updateScreenCanvas('reading');
            if (screenTextureRef.current) screenTextureRef.current.needsUpdate = true;
            lastRenderMode = 'reading';
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
