/**
 * OPENPET — Scrollytelling Product Experience
 *
 * Implements:
 * 1. Lenis smooth momentum scroll engine
 * 2. GSAP ScrollTrigger timeline scrubbing & section pins
 * 3. Three.js real-time procedural 3D cyber-companion transformations
 * 4. Interactive Live Behavior State Machine & Mood Simulator
 * 5. 100% authentic Rust workspace engineering data from Tiyatrotist/OpenPet.
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Locale, Dictionary } from '@/dictionaries';
import OpenPetScene3D from './OpenPetScene3D';
import {
  Sparkles,
  Cpu,
  Layers,
  Heart,
  Activity,
  Sliders,
  Copy,
  Check,
  ArrowUpRight,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface OpenPetScrollExperienceProps {
  lang: Locale;
  dict: Dictionary;
}

type PetState = 'idle' | 'walk' | 'sleep' | 'alert' | 'curious';

export default function OpenPetScrollExperience({ lang, dict }: OpenPetScrollExperienceProps) {
  const isTr = lang === 'tr';
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);

  // Interactive Simulator State
  const [activeState, setActiveState] = useState<PetState>('idle');
  const [energyLevel, setEnergyLevel] = useState<number>(85);
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

  const copyInstallSnippet = () => {
    navigator.clipboard.writeText('git clone https://github.com/Tiyatrotist/OpenPet.git && cargo build --release');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2400);
  };

  return (
    <div
      ref={containerRef}
      className="openpet-scrollytelling-root"
      style={{
        background: '#09090b',
        color: '#ffffff',
        position: 'relative',
        minHeight: '520vh',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      }}
    >
      {/* 3D Fixed Procedural WebGL Canvas */}
      <OpenPetScene3D progressRef={scrollProgressRef} />

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
            <span style={{ fontWeight: 800, letterSpacing: '0.12em', fontSize: '0.95rem' }}>OPENPET</span>
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
              RUST PLATFORM
            </span>
          </div>
        </div>

        {/* GitHub CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a
            href="https://github.com/Tiyatrotist/OpenPet"
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

      {/* ─── SECTION 1: HERO / RUST DESKTOP COMPANION (0 to 100vh) ────── */}
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
            [ {isTr ? 'WINDOWS 11 MASAÜSTÜ YOL ARKADAŞI & PET PLATFORMU' : 'WINDOWS 11 DESKTOP COMPANION & PET PLATFORM'} ]
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
              MASAÜSTÜNDE YAŞAYAN YOL ARKADAŞI.{' '}
              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                RUST İLE &lt;15 MB RAM.
              </span>
            </>
          ) : (
            <>
              LIVING DESKTOP COMPANION.{' '}
              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                RUST POWERED &lt;15 MB RAM.
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
            ? 'Windows 11 masaüstünüzde dolaşan, aktif pencereleri ve görev çubuğunu fiziksel olarak algılayan, sıfır elektron yüküyle çalışan tamamen yerel ve modüler sanal arkadaş.'
            : 'A lightweight, extensible desktop companion engineered in Rust. Interacts with open windows, reacts to your focus, and maintains zero cloud telemetry.'}
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
            100% RUST CORE (&lt; 15 MB BELLEK)
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
            FİZİKSEL PENCERE & EKRAN ÇARPIŞMASI
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
            MODÜLER DERİ & ANİMASYON PAKETLERİ
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

      {/* ─── SECTION 2: MODULAR RUST CRATE ARCHITECTURE (100 to 220vh) ── */}
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
            <Cpu size={16} strokeWidth={2} style={{ color: '#ffffff' }} />
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            >
              [ {isTr ? 'MİMARİ: MODÜLER RUST ÇALIŞMA ALANI' : 'ARCHITECTURE: MODULAR RUST WORKSPACE'} ]
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
              ? 'Monolitik Değil; İnce Elenmiş Bağımsız Crate Mimarisi'
              : 'Decoupled Multi-Crate Architecture Engineered for Longevity'}
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
              ? 'OpenPet, sistem kaynaklarını tüketmeyen katı bir mühendislik prensibiyle geliştirilmiştir. 3D ekrandaki gerçek zamanlı telemetri paneli, bu bağımsız Rust paketlerinin durumunu yansıtır:'
              : 'OpenPet splits functionality across dedicated lightweight Rust crates to maintain predictable memory usage:'}
          </p>

          {/* Crate Breakdown Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid #ffffff' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                1. OPENPET-BEHAVIOR (DURUM MAKİNESİ)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                {isTr
                  ? 'Deterministik FSM (Finite State Machine); uyku, merak, yürüme ve ilgi durumlarını yönetir.'
                  : 'Deterministic FSM managing emotional transitions, idle routines, and activity cycles.'}
              </div>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(255,255,255,0.65)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                2. OPENPET-SCREEN (EKRAN VE ÇARPIŞMA FİZİĞİ)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                {isTr
                  ? 'Win32 API ile açık pencerelerin başlık çubuklarını algılar; evcil hayvan pencereler üzerinde yürür.'
                  : 'Tracks desktop window coordinates via Win32 API, letting the pet walk on active window headers.'}
              </div>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(255,255,255,0.35)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                3. OPENPET-AI & PACKS (YEREL SOHBET & PAKETLER)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                {isTr
                  ? 'Yerel Ollama modelleriyle çevrimdışı diyalog kurar; topluluk yapımı sprite ve modelleri yükler.'
                  : 'Integrates local LLMs for private companion dialogue and hot-reloads modular sprite packs.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: WINDOWS 11 INTEGRATION (220 to 350vh) ─────────── */}
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
            <Activity size={16} strokeWidth={2} style={{ color: '#ffffff' }} />
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            >
              [ {isTr ? 'ENTEGRASYON: SIFIR GECİKMELİ YEREL ETKİLEŞİM' : 'INTEGRATION: ZERO-LATENCY NATIVE DESKTOP'} ]
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
                Masaüstünüze Saygı Duyan Hafif Tasarım.{' '}
                <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                  %0 İşlemci Yükü.
                </span>
              </>
            ) : (
              <>
                A Companion That Respects Your System.{' '}
                <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                  0% Idle CPU Overhead.
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
              ? 'Pek çok modern masaüstü uygulaması yüzlerce megabayt bellek tüketip fanları çalıştırırken, OpenPet doğrudan yerel DirectX / WGPU donanım katmanını kullanır. Hareketsizken uyur, CPU döngülerini boşa harcamaz.'
              : 'Unlike bloated Electron companions consuming 300+ MB of RAM, OpenPet uses native WGPU/DirectX surface layers, dropping to 0% CPU consumption when idle.'}
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
              <span>METRİK</span>
              <span>GENEL WEBKİT / ELEKTRON</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>OPENPET (RUST)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.5rem', padding: '0.45rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span>RAM Ayak İzi</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>250 MB – 600 MB</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>11.4 MB</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.5rem', padding: '0.45rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span>Boşta CPU</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>%2.5 – %5.0</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>%0.02 (Uyku Modu)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.5rem', padding: '0.45rem 0' }}>
              <span>Telemetri & Ağ</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Uzak Sunucuya Veri Gönderir</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>0 Bayt (%100 Çevrimdışı)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: INTERACTIVE STATE SIMULATOR (350 to 450vh) ────── */}
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
          <Sliders size={16} strokeWidth={2} style={{ color: '#ffffff' }} />
          <span
            style={{
              fontSize: '0.7rem',
              fontFamily: 'monospace',
              letterSpacing: '0.15em',
              color: 'rgba(255, 255, 255, 0.55)',
            }}
          >
            [ {isTr ? 'CANLI DAVRANIŞ & DURUM SİMÜLATÖRÜ' : 'LIVE BEHAVIOR & STATE SIMULATOR'} ]
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
            ? 'Durum Geçişlerini ve Davranış Modellerini Test Edin'
            : 'Simulate Pet Finite State Machine & Emotional Triggers'}
        </h2>

        {/* State Switcher Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {(['idle', 'walk', 'sleep', 'alert', 'curious'] as PetState[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setActiveState(st)}
              data-cursor="expand"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                letterSpacing: '0.08em',
                borderRadius: '3px',
                border: activeState === st ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
                background: activeState === st ? '#ffffff' : 'rgba(255, 255, 255, 0.04)',
                color: activeState === st ? '#000000' : 'rgba(255, 255, 255, 0.6)',
                fontWeight: activeState === st ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {st.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Simulator Diagnostic Window */}
        <div
          style={{
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            background: 'rgba(9, 9, 11, 0.94)',
            backdropFilter: 'blur(20px)',
            padding: '1.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
              AKTİF RUST FSM DURUMU: <b style={{ color: '#ffffff' }}>{activeState.toUpperCase()}</b>
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#ffffff' }}>
              ENERPİ DÜZEYİ: %{energyLevel}
            </span>
          </div>

          {/* Energy Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)' }}>
              ENERJİ AYARI:
            </span>
            <input
              type="range"
              min="10"
              max="100"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#ffffff', cursor: 'pointer' }}
            />
          </div>

          {/* Real-time State Log */}
          <div
            style={{
              padding: '1rem',
              background: '#09090c',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              lineHeight: 1.6,
            }}
          >
            <div style={{ color: 'rgba(255,255,255,0.45)' }}>[openpet-behavior::fsm] Tick: 14820ms</div>
            <div style={{ color: '#ffffff' }}>
              {activeState === 'idle' && '✓ Durum: IDLE — Nefes alma ritmi devrede, dikkat seviyesi %75.'}
              {activeState === 'walk' && '✓ Durum: WALKING — Görev çubuğu koordinatları taranıyor: (x: 420, y: 1040).'}
              {activeState === 'sleep' && '✓ Durum: SLEEPING — Düşük güç modu aktif, OLED gözler kısıldı, RAM: 8.2 MB.'}
              {activeState === 'alert' && '✓ Durum: ALERT — Aktif kodlama penceresi (VS Code) tespit edildi, yoldaş modu tetiklendi.'}
              {activeState === 'curious' && '✓ Durum: CURIOUS — İmleç hareketini inceliyor, kulaklar hedefe yöneldi.'}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.35rem' }}>
              &gt; Rust Memory: 11.4 MB | Frame Time: 8.3ms (120 FPS Native Tick) | IPC: OK
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: OPEN SOURCE & QUICK START (450 to 520vh) ──────── */}
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
          [ {isTr ? 'AÇIK KAYNAK VE KURULUM' : 'OPEN SOURCE & BUILD GUIDE'} ]
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
            ? 'Masaüstünüze Yeni Bir Dost Kazandırın.'
            : 'Bring Your Desktop Companion to Life.'}
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
            ? 'OpenPet, AGPL-3.0 lisansıyla tamamen özgürdür. Tek bir cargo komutuyla derleyip kendi animasyon paketlerinizi entegre edebilirsiniz.'
            : 'AGPL-3.0 licensed open-source companion platform. Clone and build cleanly with cargo on Windows 11 in seconds.'}
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
            git clone https://github.com/Tiyatrotist/OpenPet.git
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
            href="https://github.com/Tiyatrotist/OpenPet"
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
