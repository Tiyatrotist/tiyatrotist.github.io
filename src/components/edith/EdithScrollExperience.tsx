/**
 * E.D.I.T.H — Interactive 3D Scrollytelling Experience
 *
 * Combines Lenis smooth scrolling, GSAP ScrollTrigger timeline scrubbing,
 * procedural Three.js 3D neural core, and an interactive agent terminal sandbox.
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Locale, Dictionary } from '@/dictionaries';
import EdithScene3D from './EdithScene3D';
import {
  ArrowUpRight,
  Terminal,
  Cpu,
  ShieldCheck,
  GitBranch,
  Play,
  RotateCcw,
  Check,
  Copy,
  Layers,
  Sparkles,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface EdithScrollExperienceProps {
  lang: Locale;
  dict: Dictionary;
}

interface TerminalScenario {
  id: string;
  label_tr: string;
  label_en: string;
  logs: string[];
}

const SCENARIOS: TerminalScenario[] = [
  {
    id: 'termux_secretary',
    label_tr: 'Android Termux Otonom Sekreter',
    label_en: 'Android Termux Autonomous Secretary',
    logs: [
      '$ python main.py --mode=server --voice=piper',
      '⚡ [BOOT] EDITH Core Initialized (Even Dead I\'m The Hero v1.0.0-beta)',
      '📞 [TERMUX_API] Incoming phone call detected from client bridge.',
      '⏳ [SMART_RULE] 14-second caller identification & delayed auto-answer active...',
      '🎙️ [FASTER_WHISPER] Audio transcribed: "Yarınki teknik sunum saat kaçta başlayacak?"',
      '🧠 [LLM_ROUTER] Multi-Provider pool -> Local Ollama (qwen2.5:14b) fallback.',
      '🔊 [PIPER_TTS] Offline neural female voice synthesizing audio response...',
      '💬 [EDITH_VOICE]: "Teknik sunum yarın saat 10:30\'da konferans salonunda."',
      '✓ [CALL LOGGED] Audio transcript saved to local vault, desktop HUD notified.',
    ],
  },
  {
    id: 'llm_failover',
    label_tr: 'Çoklu LLM Havuzu & Otomatik Failover',
    label_en: 'Multi-Provider LLM Pool & Auto-Failover',
    logs: [
      '$ python main.py --prompt "Projeyi release için analiz et"',
      '🔒 [ROUTER] Priority tier: NVIDIA NIM -> Groq -> Gemini -> Local Ollama',
      '⚠️ [NETWORK_TIMEOUT] Cloud primary endpoint latency > 400ms.',
      '⚡ [FAILOVER] Switched instantly to Groq Llama-3.3-70b-versatile.',
      '✓ [RESPONSE] 1,420 tokens generated in 210ms (67.6 tokens/sec).',
      '📂 [FASTAPI_DASHBOARD] Streamed live to http://localhost:8080/dashboard',
      '★ [ZERO LOCK-IN] 100% resilient multi-model pipeline verified.',
    ],
  },
  {
    id: 'system_overlay',
    label_tr: 'Windows HUD & Masaüstü Ajanı',
    label_en: 'Windows HUD & Desktop Agent',
    logs: [
      '$ python ui_overlay.py',
      '🖥️ [WIN32_HUD] Borderless translucent HUD attached to primary monitor.',
      '⚙ [AGENT] Scanning system processes and dev environment...',
      '🔧 [TOOL:SHELL] Executing test suite: pytest tests/ -v',
      '✓ [TESTS_PASS] 14 unit & privacy tests collected, 14 passed in 0.84s',
      '⚡ [VOIP_PBX] Cloud PBX SIP trunk connection healthy (ping: 18ms)',
      '★ [SYSTEM STANDBY] EDITH listening via Faster-Whisper VAD stream.',
    ],
  },
];

export default function EdithScrollExperience({ lang, dict }: EdithScrollExperienceProps) {
  const isTr = lang === 'tr';
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);

  // Terminal Simulator State
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [visibleLogCount, setVisibleLogCount] = useState<number>(3);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [copiedInstall, setCopiedInstall] = useState<boolean>(false);

  // Initialize Lenis + GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      },
    });

    return () => {
      trigger.kill();
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  // Run terminal simulation step-by-step
  const activeScenario = SCENARIOS[activeScenarioIdx];

  useEffect(() => {
    setVisibleLogCount(1);
    setIsSimulating(true);

    let current = 1;
    const interval = setInterval(() => {
      current++;
      setVisibleLogCount(current);
      if (current >= activeScenario.logs.length) {
        setIsSimulating(false);
        clearInterval(interval);
      }
    }, 420);

    return () => clearInterval(interval);
  }, [activeScenarioIdx, activeScenario.logs.length]);

  const copyInstallSnippet = () => {
    navigator.clipboard.writeText('git clone https://github.com/Tiyatrotist/E.D.I.T.H.git && cd E.D.I.T.H');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  return (
    <div
      ref={containerRef}
      className="edith-scrollytelling-root"
      style={{
        background: '#09090b',
        color: '#ffffff',
        position: 'relative',
        minHeight: '520vh',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      }}
    >
      {/* 3D Fixed Procedural Neural Core Canvas */}
      <EdithScene3D progressRef={scrollProgressRef} />

      {/* Floating Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '64px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          background: 'rgba(9, 9, 11, 0.75)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            href={`/${lang}/projects`}
            style={{
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              color: 'rgba(255, 255, 255, 0.5)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            data-cursor="expand"
          >
            ← {isTr ? 'TÜM PROJELER' : 'ALL PROJECTS'}
          </Link>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>/</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, letterSpacing: '0.14em', fontSize: '0.95rem' }}>E.D.I.T.H</span>
            <span
              style={{
                fontSize: '0.62rem',
                fontFamily: 'monospace',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.15rem 0.45rem',
                borderRadius: '3px',
                color: '#ffffff',
              }}
            >
              AUTONOMOUS AI AGENT
            </span>
          </div>
        </div>

        {/* GitHub CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a
            href="https://github.com/Tiyatrotist/E.D.I.T.H"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="expand"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              background: '#ffffff',
              color: '#000000',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              borderRadius: '3px',
              transition: 'transform 0.15s ease',
            }}
          >
            <span>GITHUB</span>
            <ArrowUpRight size={13} strokeWidth={2.5} />
          </a>
        </div>
      </header>

      {/* ─── SECTION 1: HERO / CORE INTELLIGENCE (0 to 100vh) ────────── */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 4rem',
          maxWidth: '820px',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase',
            }}
          >
            [ {isTr ? 'OTONOM AJAN & YEREL MODEL PLATFORMU' : 'AUTONOMOUS AGENT & LOCAL MODEL PLATFORM'} ]
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
          }}
        >
          {isTr ? (
            <>
              OTONOM YAPAY ZEKÂ AJANI.{' '}
              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                SIFIR BULUT BAĞIMLILIĞI.
              </span>
            </>
          ) : (
            <>
              AUTONOMOUS AI AGENT.{' '}
              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                ZERO CLOUD LOCK-IN.
              </span>
            </>
          )}
        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            lineHeight: 1.65,
            color: 'rgba(255, 255, 255, 0.65)',
            maxWidth: '560px',
            marginBottom: '2.5rem',
          }}
        >
          {isTr
            ? 'Kişisel görevlerinizi planlayan, terminal komutlarını yürüten, kod yazıp derleme hatalarını kendi kendine onaran açık kaynaklı yapay zekâ asistanı.'
            : 'Decomposes complex goals into verified sub-tasks, executes native shell commands, writes code, and self-heals build errors autonomously.'}
        </p>

        {/* Feature Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.5rem 0.9rem',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.02)',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            %100 {isTr ? 'YEREL MODEL ORKESTRASYONU' : 'LOCAL MODEL INFERENCE'}
          </div>
          <div
            style={{
              padding: '0.5rem 0.9rem',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.02)',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            {isTr ? 'KENDİ HATASINI ONARAN DÖNGÜ' : 'SELF-HEALING CODE LOOP'}
          </div>
          <div
            style={{
              padding: '0.5rem 0.9rem',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.02)',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            {isTr ? 'DOĞRUDAN TERMİNAL & ARAÇ ERİŞİMİ' : 'DIRECT SHELL & TOOL ACCESS'}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '4rem',
            fontSize: '0.7rem',
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            color: 'rgba(255, 255, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>[ {isTr ? 'AŞAĞI KAYDIRIN' : 'SCROLL TO EXPLORE'} ↓ ]</span>
        </div>
      </section>

      {/* ─── SECTION 2: MULTI-AGENT TASK GRAPH (100 to 220vh) ───────── */}
      <section
        style={{
          position: 'relative',
          minHeight: '120vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0 4rem',
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: '580px',
            background: 'rgba(9, 9, 11, 0.88)',
            padding: '2.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <GitBranch size={16} strokeWidth={2} style={{ color: '#ffffff' }} />
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            >
              [ {isTr ? 'MİMARİ: ÇOKLU AJAN GÖREV GRAFI' : 'ARCHITECTURE: MULTI-AGENT TASK GRAPH'} ]
            </span>
          </div>

          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
            }}
          >
            {isTr
              ? 'Tek Bir Model Değil; Koordineli Uzman Ajan Ekibi'
              : 'Not a Single Prompt; A Coordinated Swarm of Specialized Agents'}
          </h2>

          <p
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.65)',
              marginBottom: '1.5rem',
            }}
          >
            {isTr
              ? 'E.D.I.T.H, tek bir büyük dil modeline her şeyi yaptırmak yerine görevleri ayrıştırır. 3D nöral sahnemizde genişleyen orbital halkalar bu uzman rolleri temsil eder:'
              : 'Instead of forcing a single generic prompt to do everything, E.D.I.T.H dispatches atomic responsibilities to specialized internal agents:'}
          </p>

          {/* Agent Role Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid #ffffff' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                1. PLANNER AGENT (PLANLAYICI)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                {isTr
                  ? 'Kullanıcı hedefini doğrulanabilir adımlara böler; döngüye girmeden kritik yol haritasını çizer.'
                  : 'Decomposes user objectives into atomic tasks with explicit acceptance criteria.'}
              </div>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(255,255,255,0.65)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                2. EXECUTOR AGENT & MULTI-PROVIDER POOL
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                {isTr
                  ? 'Ollama, Groq, Gemini, Claude ve DeepSeek arasında otomatik failover ile komutları çalıştırır.'
                  : 'Executes tools with seamless automatic failover across Ollama, Groq, Gemini, Claude, and DeepSeek.'}
              </div>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(255,255,255,0.35)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                3. ANDROID TERMUX & PBX BRIDGE
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                {isTr
                  ? 'Gelen çağrıları 14s akıllı gecikmeyle yanıtlar, Faster-Whisper ve Piper TTS ile otonom sekreterlik yapar.'
                  : 'Listens for phone calls via Termux, answering with Faster-Whisper VAD and Piper neural TTS.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: LOCAL MODELS & PRIVACY (220 to 350vh) ────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: '130vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 4rem',
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: '620px',
            background: 'rgba(9, 9, 11, 0.9)',
            padding: '2.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <ShieldCheck size={16} strokeWidth={2} style={{ color: '#ffffff' }} />
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            >
              [ {isTr ? 'GİZLİLİK: %100 YEREL ORKESTRASYON' : 'PRIVACY: 100% LOCAL ORCHESTRATION'} ]
            </span>
          </div>

          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
            }}
          >
            {isTr ? (
              <>
                Özel Verileriniz Asla Cihazınızdan Ayrılmaz.{' '}
                <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                  Ollama & GGUF Desteği.
                </span>
              </>
            ) : (
              <>
                Your Private Data Never Leaves Your Machine.{' '}
                <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                  Ollama & GGUF Native.
                </span>
              </>
            )}
          </h2>

          <p
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '1.75rem',
            }}
          >
            {isTr
              ? 'Bulut şirketlerine aylık abonelikler ödemek veya kaynak kodlarınızı uzak sunuculara göndermek zorunda değilsiniz. E.D.I.T.H; doğrudan Ollama veya llama.cpp üzerinden Qwen 2.5 Coder, DeepSeek ve Llama 3 modellerini tüketici donanımında optimize ederek çalıştırır.'
              : 'Zero recurring subscriptions or telemetry leakage. E.D.I.T.H orchestrates quantised local models (Qwen 2.5 Coder, DeepSeek, Llama 3) natively through Ollama or llama.cpp on consumer GPUs and CPUs.'}
          </p>

          {/* Telemetry Matrix */}
          <div
            style={{
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              padding: '1.25rem',
              background: 'rgba(255, 255, 255, 0.02)',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem', color: 'rgba(255,255,255,0.45)' }}>
              <span>PARAMETRE</span>
              <span>BULUT API&apos;LERİ</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>E.D.I.T.H YEREL</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.5rem', padding: '0.45rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span>Veri Gizliliği</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Uzak Sunucuya Gider</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>%100 Cihaz İçinde</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.5rem', padding: '0.45rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span>İnternet İhtiyacı</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Sürekli Bağlantı Şart</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>Tamamen Çevrimdışı</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.5rem', padding: '0.45rem 0' }}>
              <span>Maliyet</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Aylık Token Faturaları</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>0 $ (Sonsuza Kadar Özgür)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: LIVE AGENT TERMINAL SIMULATOR (350 to 450vh) ──── */}
      <section
        style={{
          position: 'relative',
          minHeight: '120vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 4rem',
          maxWidth: '860px',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Terminal size={16} strokeWidth={2} style={{ color: '#ffffff' }} />
          <span
            style={{
              fontSize: '0.7rem',
              fontFamily: 'monospace',
              letterSpacing: '0.15em',
              color: 'rgba(255, 255, 255, 0.55)',
            }}
          >
            [ {isTr ? 'CANLI ETKİLEŞİMLİ TERMİNAL SİMÜLATÖRÜ' : 'LIVE INTERACTIVE AGENT TERMINAL'} ]
          </span>
        </div>

        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
          }}
        >
          {isTr
            ? 'Gerçek Zamanlı Araç Kullanımı & Kendi Kendini Onarma'
            : 'Autonomous Tool Execution & Self-Healing Terminal Loop'}
        </h2>

        {/* Scenario Switcher Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => setActiveScenarioIdx(idx)}
              data-cursor="expand"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                letterSpacing: '0.08em',
                borderRadius: '3px',
                border: activeScenarioIdx === idx ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
                background: activeScenarioIdx === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.04)',
                color: activeScenarioIdx === idx ? '#000000' : 'rgba(255, 255, 255, 0.6)',
                fontWeight: activeScenarioIdx === idx ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {isTr ? sc.label_tr : sc.label_en}
            </button>
          ))}
        </div>

        {/* Terminal Window Box */}
        <div
          style={{
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            background: 'rgba(9, 9, 11, 0.94)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Terminal Titlebar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.03)',
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              color: 'rgba(255, 255, 255, 0.45)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)' }} />
              <span style={{ marginLeft: '0.6rem', letterSpacing: '0.1em' }}>edith-agent-shell — 127.0.0.1</span>
            </div>
            <span>{isSimulating ? 'EXECUTING...' : 'IDLE'}</span>
          </div>

          {/* Terminal Log Output */}
          <div
            style={{
              padding: '1.25rem',
              minHeight: '260px',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.82rem',
              lineHeight: 1.65,
              color: 'rgba(255, 255, 255, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            {activeScenario.logs.slice(0, visibleLogCount).map((log, i) => {
              let color = 'rgba(255, 255, 255, 0.75)';
              if (log.startsWith('$')) color = '#ffffff';
              else if (log.includes('[PLANNER]')) color = '#ffffff';
              else if (log.includes('[STDERR]') || log.includes('error')) color = '#ff7b72';
              else if (log.includes('[GOAL ACHIEVED]') || log.includes('✓')) color = '#ffffff';
              else if (log.includes('🔒')) color = '#ffffff';

              return (
                <div key={i} style={{ color, wordBreak: 'break-word' }}>
                  {log}
                </div>
              );
            })}

            {isSimulating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.3)' }}>
                <span>_</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: INSTALLATION & GITHUB (450 to 520vh) ─────────── */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 2rem',
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: '0.72rem',
            fontFamily: 'monospace',
            letterSpacing: '0.2em',
            color: 'rgba(255, 255, 255, 0.5)',
            marginBottom: '1rem',
          }}
        >
          [ {isTr ? 'AÇIK KAYNAK VE KURULUM' : 'OPEN SOURCE & QUICK START'} ]
        </span>

        <h2
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            maxWidth: '750px',
            marginBottom: '1.5rem',
          }}
        >
          {isTr
            ? 'Kendi Bağımsız Yapay Zekâ Asistanınızı Başlatın.'
            : 'Deploy Your Autonomous Open-Source AI Agent.'}
        </h2>

        <p
          style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.65)',
            maxWidth: '560px',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          {isTr
            ? 'E.D.I.T.H, tamamen açık kaynaklıdır. Cihazınızda tek bir komutla klonlayıp kendi yerel modellerinizle anında çalıştırabilirsiniz.'
            : 'Zero vendor lock-in. Clone from GitHub and orchestrate autonomous agents locally on your computer in minutes.'}
        </p>

        {/* Quick CLI Install Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '0.85rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            maxWidth: '540px',
            width: '100%',
            marginBottom: '2.5rem',
          }}
        >
          <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            git clone https://github.com/Tiyatrotist/E.D.I.T.H.git
          </span>
          <button
            type="button"
            onClick={copyInstallSnippet}
            data-cursor="expand"
            title="Kopyala"
            style={{
              background: 'transparent',
              border: 'none',
              color: copiedInstall ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.72rem',
              fontFamily: 'monospace',
            }}
          >
            {copiedInstall ? (
              <>
                <Check size={13} />
                <span>KOPYALANDI</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>KOPYALA</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <a
            href="https://github.com/Tiyatrotist/E.D.I.T.H"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="expand"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.85rem 1.75rem',
              background: '#ffffff',
              color: '#000000',
              fontWeight: 700,
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              borderRadius: '4px',
              transition: 'transform 0.15s ease',
            }}
          >
            <span>{isTr ? 'GITHUB DEPOSUNU İNCELE' : 'EXPLORE ON GITHUB'}</span>
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </a>

          <Link
            href={`/${lang}/projects`}
            data-cursor="expand"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              borderRadius: '4px',
              transition: 'background 0.2s ease',
            }}
          >
            <span>{isTr ? '← TÜM PROJELERE DÖN' : '← ALL PROJECTS'}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
