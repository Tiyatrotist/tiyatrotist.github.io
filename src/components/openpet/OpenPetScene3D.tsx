/**
 * OPENPET — 3D Desktop Companion & Pet Simulation Scene (Three.js)
 *
 * Renders a procedural 3D cybernetic desktop companion:
 * - Stylized articulated geometric pet chassis (Head, animated ears, expressive OLED visor, segmented tail)
 * - Dynamic 2D canvas displaying real-time Rust state machine telemetry & mood diagnostics
 * - Mathematically continuous C^0 Euler spline trajectory across 5 sections
 * - Responsive mobile viewport compensation ($Z$ camera depth, $X$ scale adaptation)
 * - 100% procedural WebGL, 60 FPS performance, zero external textures.
 */

'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface OpenPetScene3DProps {
  progressRef: React.MutableRefObject<number>;
  reducedMotion?: boolean;
}

export default function OpenPetScene3D({ progressRef, reducedMotion = false }: OpenPetScene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Group and mesh refs
  const petGroupRef = useRef<THREE.Group | null>(null);
  const headMeshRef = useRef<THREE.Mesh | null>(null);
  const earLeftRef = useRef<THREE.Mesh | null>(null);
  const earRightRef = useRef<THREE.Mesh | null>(null);
  const tailRef = useRef<THREE.Group | null>(null);
  const haloRingRef = useRef<THREE.Mesh | null>(null);
  const hudMeshRef = useRef<THREE.Mesh | null>(null);
  const hudCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const hudTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // Mouse parallax state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x09090b, 0.045);

    // 2. Camera Setup (Responsive for mobile)
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 11.0 : 8.5);
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(5, 9, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(-7, -3, -4);
    scene.add(rimLight);

    // 5. Dynamic 2D Diagnostic HUD Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    hudCanvasRef.current = canvas;
    const ctx = canvas.getContext('2d');

    const updateHudCanvas = (stateName: string, moodScore: number, memoryMb: number) => {
      if (!ctx) return;
      ctx.fillStyle = '#0e0e12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // HUD Frame & Bevels
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Header Bar
      ctx.fillStyle = '#181820';
      ctx.fillRect(20, 20, canvas.width - 40, 60);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 24px monospace';
      ctx.fillText('OPENPET // RUST ENGINE TELEMETRY v0.9.0', 45, 58);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '400 18px monospace';
      ctx.fillText('WIN32 DESKTOP COMPANION', canvas.width - 320, 58);

      // Diagnostic Metrics Grid
      const metrics = [
        { label: 'BEHAVIOR FSM STATE', value: stateName },
        { label: 'ACTIVE MOOD METRIC', value: `${moodScore} / 100 [SATISFIED]` },
        { label: 'PROCESS RAM USAGE', value: `${memoryMb} MB (ZERO ELECTRON)` },
        { label: 'WINDOW COLLISION', value: 'TASKBAR_SURFACE [LOCKED]' },
        { label: 'LOCAL DIALOGUE LLM', value: 'QWEN-2.5-CODER (OLLAMA IPC)' },
        { label: 'ANIMATION PACK', value: 'CYBER_FOX_V2 (MODULAR)' },
      ];

      let y = 140;
      for (const m of metrics) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '400 18px monospace';
        ctx.fillText(m.label, 50, y);

        ctx.fillStyle = '#ffffff';
        ctx.font = '700 20px monospace';
        ctx.fillText(m.value, 420, y);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(50, y + 16);
        ctx.lineTo(canvas.width - 50, y + 16);
        ctx.stroke();

        y += 64;
      }

      // Live Oscilloscope Activity Wave
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      let waveX = 50;
      const waveBaseY = 620;
      for (let i = 0; i < 40; i++) {
        const waveY = waveBaseY + Math.sin(i * 0.45) * 35;
        if (i === 0) ctx.moveTo(waveX, waveY);
        else ctx.lineTo(waveX, waveY);
        waveX += (canvas.width - 100) / 40;
      }
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '400 16px monospace';
      ctx.fillText('LIVE RUST EVENT LOOP ACTIVITY (120 FPS NATIVE TICK)', 50, 690);
    };

    updateHudCanvas('IDLE_FLOATING', 94, 11.4);

    const hudTexture = new THREE.CanvasTexture(canvas);
    hudTexture.minFilter = THREE.LinearFilter;
    hudTexture.magFilter = THREE.LinearFilter;
    hudTextureRef.current = hudTexture;

    // 6. Build 3D Pet Companion Model
    const petGroup = new THREE.Group();
    petGroupRef.current = petGroup;
    scene.add(petGroup);

    // Main Body Pod
    const bodyGeo = new THREE.CapsuleGeometry(0.85, 1.2, 16, 32);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x18181c,
      metalness: 0.9,
      roughness: 0.22,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    petGroup.add(bodyMesh);

    // Body Wireframe Accent
    const bodyEdges = new THREE.EdgesGeometry(bodyGeo);
    const bodyLine = new THREE.LineSegments(
      bodyEdges,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 })
    );
    bodyMesh.add(bodyLine);

    // Emotive OLED Visor
    const visorGeo = new THREE.BoxGeometry(0.9, 0.4, 0.6);
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x050508,
      metalness: 0.95,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.55, 0.65);
    petGroup.add(visorMesh);

    // OLED Glowing Eyes
    const eyeGeo = new THREE.PlaneGeometry(0.18, 0.1);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeLeft = new THREE.Mesh(eyeGeo, eyeMat);
    eyeLeft.position.set(-0.24, 0.55, 0.96);
    petGroup.add(eyeLeft);

    const eyeRight = new THREE.Mesh(eyeGeo, eyeMat);
    eyeRight.position.set(0.24, 0.55, 0.96);
    petGroup.add(eyeRight);

    // Articulated Ears
    const earGeo = new THREE.ConeGeometry(0.24, 0.7, 4);
    const earMat = new THREE.MeshStandardMaterial({
      color: 0x282830,
      metalness: 0.85,
      roughness: 0.3,
    });

    const earLeft = new THREE.Mesh(earGeo, earMat);
    earLeft.position.set(-0.55, 1.35, 0.1);
    earLeft.rotation.z = -Math.PI / 8;
    earLeftRef.current = earLeft;
    petGroup.add(earLeft);

    const earRight = new THREE.Mesh(earGeo, earMat);
    earRight.position.set(0.55, 1.35, 0.1);
    earRight.rotation.z = Math.PI / 8;
    earRightRef.current = earRight;
    petGroup.add(earRight);

    // Floating Halo Sensor Ring
    const haloGeo = new THREE.TorusGeometry(1.4, 0.02, 16, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    });
    const haloRing = new THREE.Mesh(haloGeo, haloMat);
    haloRing.rotation.x = Math.PI / 2;
    haloRing.position.y = 1.45;
    haloRingRef.current = haloRing;
    petGroup.add(haloRing);

    // Segmented Kinetic Tail
    const tailGroup = new THREE.Group();
    tailRef.current = tailGroup;
    tailGroup.position.set(0, -0.65, -0.7);
    petGroup.add(tailGroup);

    for (let i = 0; i < 4; i++) {
      const segGeo = new THREE.SphereGeometry(0.16 - i * 0.025, 16, 16);
      const segMesh = new THREE.Mesh(segGeo, bodyMat);
      segMesh.position.set(0, -i * 0.22, -i * 0.18);
      tailGroup.add(segMesh);
    }

    // Diagnostic HUD Board Plane (Rotates alongside pet in 3D space)
    const hudGeo = new THREE.PlaneGeometry(3.6, 2.7);
    const hudMat = new THREE.MeshBasicMaterial({
      map: hudTexture,
      toneMapped: false,
    });
    const hudMesh = new THREE.Mesh(hudGeo, hudMat);
    hudMesh.position.set(-3.2, 0, -0.6);
    hudMesh.rotation.y = Math.PI / 7;
    hudMeshRef.current = hudMesh;
    petGroup.add(hudMesh);

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
      cameraRef.current.position.z = mobile ? 11.0 : 8.5;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationId: number;
    let smoothedP = 0;
    let clock = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      clock += 0.015;

      // Mouse lerp with deceleration
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Smooth scroll lerp
      const targetP = progressRef.current || 0;
      smoothedP += (targetP - smoothedP) * 0.075;
      const p = Math.max(0, Math.min(1, smoothedP));

      if (petGroupRef.current) {
        const group = petGroupRef.current;
        const eL = earLeftRef.current;
        const eR = earRightRef.current;
        const halo = haloRingRef.current;
        const tail = tailRef.current;

        // Autonomous Harmonic Idle Motions
        const breath = Math.sin(clock * 2.0) * 0.03;
        const earWiggle = Math.sin(clock * 3.5) * 0.08;
        const tailWag = Math.sin(clock * 2.8) * 0.25;

        if (eL) eL.rotation.z = -Math.PI / 8 + earWiggle;
        if (eR) eR.rotation.z = Math.PI / 8 - earWiggle;
        if (tail) tail.rotation.y = tailWag;
        if (halo) halo.rotation.z += 0.008;

        const isMobileScreen = window.innerWidth < 768;
        const xFactor = isMobileScreen ? 0.35 : 1.0;
        const idleFloat = Math.sin(clock * 1.6) * 0.04;

        // Continuous Spline Across 5 Sections
        if (p < 0.22) {
          // SECTION 1: 0.00 - 0.22 (Hero / Autonomous Desktop Companion)
          const t = p / 0.22;
          group.position.x = THREE.MathUtils.lerp(0.4, 1.2, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(0.0, -0.06, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.0, 0.4, t);

          group.rotation.x = THREE.MathUtils.lerp(0.08, 0.04, t) + mouseRef.current.y * 0.2;
          group.rotation.y = THREE.MathUtils.lerp(-0.25, -0.35, t) + mouseRef.current.x * 0.3;
          group.rotation.z = THREE.MathUtils.lerp(0.02, 0.0, t);
        } else if (p >= 0.22 && p < 0.48) {
          // SECTION 2: 0.22 - 0.48 (Rust FSM State Machine & Behaviors)
          const t = (p - 0.22) / 0.26;
          group.position.x = THREE.MathUtils.lerp(1.2, -0.9, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(-0.06, 0.06, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.4, 0.8, t);

          group.rotation.x = THREE.MathUtils.lerp(0.04, 0.12, t) + mouseRef.current.y * 0.18;
          group.rotation.y = THREE.MathUtils.lerp(-0.35, 0.22, t) + mouseRef.current.x * 0.25;
          group.rotation.z = THREE.MathUtils.lerp(0.0, -0.03, t);
        } else if (p >= 0.48 && p < 0.72) {
          // SECTION 3: 0.48 - 0.72 (Windows 11 Screen Awareness & Physics)
          const t = (p - 0.48) / 0.24;
          group.position.x = THREE.MathUtils.lerp(-0.9, 0.0, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(0.06, -0.02, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.8, 0.25, t);

          group.rotation.x = THREE.MathUtils.lerp(0.12, 0.02, t) + mouseRef.current.y * 0.15;
          group.rotation.y = THREE.MathUtils.lerp(0.22, 0.0, t) + mouseRef.current.x * 0.2;
          group.rotation.z = THREE.MathUtils.lerp(-0.03, 0.0, t);
        } else if (p >= 0.72 && p < 0.90) {
          // SECTION 4: 0.72 - 0.90 (Local AI Dialogue & Modular Skin Packs)
          const t = (p - 0.72) / 0.18;
          group.position.x = THREE.MathUtils.lerp(0.0, 1.1, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(-0.02, 0.04, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.25, 0.55, t);

          group.rotation.x = THREE.MathUtils.lerp(0.02, 0.06, t) + mouseRef.current.y * 0.18;
          group.rotation.y = THREE.MathUtils.lerp(0.0, -0.3, t) + mouseRef.current.x * 0.24;
          group.rotation.z = THREE.MathUtils.lerp(0.0, 0.02, t);
        } else {
          // SECTION 5: 0.90 - 1.00 (Ecosystem & Quick Start Call)
          const t = (p - 0.90) / 0.10;
          group.position.x = THREE.MathUtils.lerp(1.1, 0.0, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(0.04, 0.08, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.55, 0.15, t);

          group.rotation.x = THREE.MathUtils.lerp(0.06, 0.04, t) + mouseRef.current.y * 0.15;
          group.rotation.y = THREE.MathUtils.lerp(-0.3, 0.0, t) + mouseRef.current.x * 0.2;
          group.rotation.z = 0;
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
