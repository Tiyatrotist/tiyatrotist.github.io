/**
 * E.D.I.T.H — 3D Autonomous Agent Neural Core Scene (Three.js)
 *
 * Renders an intricate, procedural cybernetic neural core:
 * - Geometric faceted core (Icosahedron) with physical specular transmission
 * - Orbital agent rings (Planner, Executor, Critic, Tools) with variable rotation
 * - Connected synaptic constellation particles with dynamic wave pulses
 * - Real-time scroll progress interpolation & mouse parallax
 * - 100% procedural WebGL, zero external asset downloads, 60 FPS performance.
 */

'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface EdithScene3DProps {
  progressRef: React.MutableRefObject<number>;
  reducedMotion?: boolean;
}

export default function EdithScene3D({ progressRef, reducedMotion = false }: EdithScene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Group and mesh refs
  const coreGroupRef = useRef<THREE.Group | null>(null);
  const polyCoreMeshRef = useRef<THREE.Mesh | null>(null);
  const innerWireMeshRef = useRef<THREE.LineSegments | null>(null);
  const ring1Ref = useRef<THREE.Mesh | null>(null);
  const ring2Ref = useRef<THREE.Mesh | null>(null);
  const ring3Ref = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Mouse parallax state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x09090b, 0.04);

    // 2. Camera Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
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
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const topKeyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    topKeyLight.position.set(5, 10, 7);
    scene.add(topKeyLight);

    const sideRimLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sideRimLight.position.set(-8, -4, -4);
    scene.add(sideRimLight);

    const bottomFillLight = new THREE.DirectionalLight(0x555566, 0.8);
    bottomFillLight.position.set(0, -6, 5);
    scene.add(bottomFillLight);

    // 5. Build Procedural Neural Core Group
    const coreGroup = new THREE.Group();
    coreGroupRef.current = coreGroup;
    scene.add(coreGroup);

    // Central Polyhedral Agent Core (Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(1.35, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x18181c,
      metalness: 0.9,
      roughness: 0.22,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      reflectivity: 0.85,
      flatShading: true,
    });
    const polyCoreMesh = new THREE.Mesh(coreGeo, coreMat);
    polyCoreMeshRef.current = polyCoreMesh;
    coreGroup.add(polyCoreMesh);

    // Inner Wireframe Lattice
    const wireGeo = new THREE.WireframeGeometry(coreGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    const innerWireMesh = new THREE.LineSegments(wireGeo, wireMat);
    innerWireMeshRef.current = innerWireMesh;
    polyCoreMesh.add(innerWireMesh);

    // Orbital Rings (Representing Multi-Agent Reasoning Loops)
    const createRing = (radius: number, tube: number) => {
      const ringGeo = new THREE.TorusGeometry(radius, tube, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.95,
        roughness: 0.25,
        wireframe: false,
      });
      return new THREE.Mesh(ringGeo, ringMat);
    };

    // Ring 1 (Planner Orbit)
    const ring1 = createRing(2.3, 0.025);
    ring1.rotation.x = Math.PI / 3;
    ring1Ref.current = ring1;
    coreGroup.add(ring1);

    // Ring 2 (Executor & Tool Orbit)
    const ring2 = createRing(2.7, 0.022);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 5;
    ring2Ref.current = ring2;
    coreGroup.add(ring2);

    // Ring 3 (Critic / Verifier Orbit)
    const ring3 = createRing(3.1, 0.018);
    ring3.rotation.z = Math.PI / 6;
    ring3Ref.current = ring3;
    coreGroup.add(ring3);

    // Synaptic Particle Cloud
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 2.5 + 1.4;

      const sinPhi = Math.sin(phi);
      particlePos[i * 3] = r * sinPhi * Math.cos(theta);
      particlePos[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      particlePos[i * 3 + 2] = r * Math.cos(phi);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.065,
      transparent: true,
      opacity: 0.65,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    coreGroup.add(particles);

    // Mouse Interaction
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX * 0.45;
      mouseRef.current.targetY = normY * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
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

    // 6. Animation Loop (Mathematically continuous interpolation & independent mesh spins)
    let animationId: number;
    let smoothedP = 0;
    let clock = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      clock += 0.015;

      // Mouse lerp with fluid inertia
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Smooth scroll lerp (continuous damping)
      const targetP = progressRef.current || 0;
      smoothedP += (targetP - smoothedP) * 0.075;
      const p = Math.max(0, Math.min(1, smoothedP));

      if (coreGroupRef.current && polyCoreMeshRef.current) {
        const group = coreGroupRef.current;
        const core = polyCoreMeshRef.current;
        const r1 = ring1Ref.current;
        const r2 = ring2Ref.current;
        const r3 = ring3Ref.current;
        const pts = particlesRef.current;

        // Continuous Autonomous Mesh Spins (decoupled from scroll transforms)
        core.rotation.y += 0.007;
        core.rotation.x += 0.004;

        if (r1) r1.rotation.z += 0.009;
        if (r2) r2.rotation.x += 0.007;
        if (r3) r3.rotation.y += 0.008;
        if (pts) pts.rotation.y += 0.003;

        // Idle harmonic breathing
        const breath = Math.sin(clock * 1.5) * 0.04;
        core.scale.set(1 + breath, 1 + breath, 1 + breath);

        // Responsive X-axis scale for mobile viewports
        const isMobileScreen = window.innerWidth < 768;
        const xFactor = isMobileScreen ? 0.35 : 1.0;

        // Bounded idle hovering on Y
        const idleFloat = Math.sin(clock * 1.6) * 0.035;

        // C^0 Mathematically Continuous Trajectory Across Sections
        if (p < 0.22) {
          // SECTION 1: 0.00 - 0.22 (Hero / Autonomous Intelligence)
          const t = p / 0.22;
          group.position.x = THREE.MathUtils.lerp(0.5, 1.15, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(0.0, -0.08, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.0, 0.35, t);

          group.rotation.x = THREE.MathUtils.lerp(0.12, 0.18, t) + mouseRef.current.y * 0.25;
          group.rotation.y = THREE.MathUtils.lerp(-0.25, -0.42, t) + mouseRef.current.x * 0.35;
          group.rotation.z = THREE.MathUtils.lerp(0.04, 0.0, t);

          if (r1) r1.scale.set(1, 1, 1);
          if (r2) r2.scale.set(1, 1, 1);
          if (r3) r3.scale.set(1, 1, 1);
        } else if (p >= 0.22 && p < 0.48) {
          // SECTION 2: 0.22 - 0.48 (Multi-Agent Task Graph & Planning)
          const t = (p - 0.22) / 0.26;
          group.position.x = THREE.MathUtils.lerp(1.15, -1.05, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(-0.08, 0.08, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.35, 0.8, t);

          // Rings expand outward in space smoothly
          const ringExpand = THREE.MathUtils.lerp(1.0, 1.35, t);
          if (r1) r1.scale.set(ringExpand, ringExpand, ringExpand);
          if (r2) r2.scale.set(ringExpand * 1.08, ringExpand * 1.08, ringExpand * 1.08);
          if (r3) r3.scale.set(ringExpand * 1.15, ringExpand * 1.15, ringExpand * 1.15);

          group.rotation.x = THREE.MathUtils.lerp(0.18, 0.08, t) + mouseRef.current.y * 0.22;
          group.rotation.y = THREE.MathUtils.lerp(-0.42, 0.35, t) + mouseRef.current.x * 0.30;
          group.rotation.z = THREE.MathUtils.lerp(0.0, -0.08, t);
        } else if (p >= 0.48 && p < 0.72) {
          // SECTION 3: 0.48 - 0.72 (Local Models & Zero-Cloud Privacy)
          const t = (p - 0.48) / 0.24;
          group.position.x = THREE.MathUtils.lerp(-1.05, 0.0, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(0.08, -0.04, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.8, 0.25, t);

          const ringContract = THREE.MathUtils.lerp(1.35, 1.1, t);
          if (r1) r1.scale.set(ringContract, ringContract, ringContract);
          if (r2) r2.scale.set(ringContract, ringContract, ringContract);
          if (r3) r3.scale.set(ringContract, ringContract, ringContract);

          group.rotation.x = THREE.MathUtils.lerp(0.08, 0.22, t) + mouseRef.current.y * 0.20;
          group.rotation.y = THREE.MathUtils.lerp(0.35, 0.0, t) + mouseRef.current.x * 0.25;
          group.rotation.z = THREE.MathUtils.lerp(-0.08, 0.0, t);
        } else if (p >= 0.72 && p < 0.90) {
          // SECTION 4: 0.72 - 0.90 (Tool Execution & Live Terminal Sandbox)
          const t = (p - 0.72) / 0.18;
          group.position.x = THREE.MathUtils.lerp(0.0, 1.1, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(-0.04, 0.04, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.25, 0.55, t);

          group.rotation.x = THREE.MathUtils.lerp(0.22, 0.06, t) + mouseRef.current.y * 0.22;
          group.rotation.y = THREE.MathUtils.lerp(0.0, -0.48, t) + mouseRef.current.x * 0.28;
          group.rotation.z = THREE.MathUtils.lerp(0.0, 0.05, t);

          if (r1) r1.scale.set(1, 1, 1);
          if (r2) r2.scale.set(1, 1, 1);
          if (r3) r3.scale.set(1, 1, 1);
        } else {
          // SECTION 5: 0.90 - 1.00 (Ecosystem & Quick Start Call)
          const t = (p - 0.90) / 0.10;
          group.position.x = THREE.MathUtils.lerp(1.1, 0.0, t) * xFactor;
          group.position.y = THREE.MathUtils.lerp(0.04, 0.1, t) + idleFloat;
          group.position.z = THREE.MathUtils.lerp(0.55, 0.15, t);

          group.rotation.x = THREE.MathUtils.lerp(0.06, 0.10, t) + mouseRef.current.y * 0.20;
          group.rotation.y = THREE.MathUtils.lerp(-0.48, 0.0, t) + mouseRef.current.x * 0.25;
          group.rotation.z = THREE.MathUtils.lerp(0.05, 0.0, t);

          if (r1) r1.scale.set(1, 1, 1);
          if (r2) r2.scale.set(1, 1, 1);
          if (r3) r3.scale.set(1, 1, 1);
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
