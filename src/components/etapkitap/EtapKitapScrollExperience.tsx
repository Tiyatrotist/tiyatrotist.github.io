/**
 * ETAPKITAP — Interactive Scrollytelling Product Experience
 *
 * Built with:
 * 1. Lenis smooth momentum scroll engine
 * 2. GSAP ScrollTrigger timeline scrubbing & section pins
 * 3. Three.js real-time procedural 3D smart board transformations
 * 4. Interactive classroom tools simulator (Spotlight, Curtain, Whiteboard templates)
 * 5. 100% authentic C++20 & Qt 6 technical data from Tiyatrotist/EtapKitap repository.
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Locale, Dictionary } from '@/dictionaries';
import EtapKitapScene3D from './EtapKitapScene3D';
import {
  Monitor,
  BookOpen,
  PenTool,
  Eye,
  Sliders,
  Copy,
  Check,
  ArrowUpRight,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  FileText,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface EtapKitapScrollExperienceProps {
  lang: Locale;
  dict: Dictionary;
}

type PresentationTool = 'spotlight' | 'curtain' | 'laser' | 'whiteboard';
type WhiteboardTemplate = 'chalkboard' | 'grid' | 'lined' | 'cartesian';

export default function EtapKitapScrollExperience({ lang, dict }: EtapKitapScrollExperienceProps) {
  const isTr = lang === 'tr';
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);

  // Interactive Tools Simulator State
  const [activeTool, setActiveTool] = useState<PresentationTool>('spotlight');
  const [wbTemplate, setWbTemplate] = useState<WhiteboardTemplate>('chalkboard');
  const [curtainHeight, setCurtainHeight] = useState<number>(45); // percentage revealed
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
    navigator.clipboard.writeText('git clone https://github.com/Tiyatrotist/EtapKitap.git');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2400);
  };

  return (
    <div
      ref={containerRef}
      className="etapkitap-scrollytelling-root"
      style={{
        background: '#09090b',
        color: '#ffffff',
        position: 'relative',
        minHeight: '520vh',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      }}
    >
      {/* 3D Fixed Procedural WebGL Canvas */}
      <EtapKitapScene3D progressRef={scrollProgressRef} />

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
            <span style={{ fontWeight: 800, letterSpacing: '0.12em', fontSize: '0.95rem' }}>ETAPKITAP</span>
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
              C++20 & QT 6
            </span>
          </div>
        </div>

        {/* GitHub CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a
            href="https://github.com/Tiyatrotist/EtapKitap"
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

      {/* ─── SECTION 1: HERO / NATIVE SMART BOARD ENGINE (0 to 100vh) ─── */}
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
            [ {isTr ? 'PARDUS ETAP 23 AKILLI TAHTA MOTORU' : 'PARDUS ETAP 23 SMART BOARD ENGINE'} ]
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
              ETKİLEŞİMLİ DERS KİTABI.{' '}
              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                C++20 İLE SIFIR GECİKME.
              </span>
            </>
          ) : (
            <>
              INTERACTIVE TEXTBOOK.{' '}
              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                C++20 ZERO LATENCY.
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
            ? 'Pardus ETAP 23 ve okullardaki etkileşimli tahtalar için tasarlanmış; standart PDF sınırlarını aşan yerel, donanım hızlandırmalı ve tamamen çevrimdışı dijital eğitim ortamı.'
            : 'Engineered natively in C++20 and Qt 6 for Pardus ETAP 23 classroom smart boards; transforming static school PDFs into low-latency interactive learning surfaces.'}
        </p>

        {/* Technical Badges */}
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
            PARDUS ETAP 23 & FATİH PROJESİ
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
            C++20 & QT 6 (NATIVE & OFFLINE)
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
            .AKBOOK ETKİLEŞİM KONTEYNERİ
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

      {/* ─── SECTION 2: .AKBOOK CONTAINER ARCHITECTURE (100 to 220vh) ─── */}
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
            <Layers size={16} strokeWidth={2} style={{ color: '#ffffff' }} />
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            >
              [ {isTr ? 'MİMARİ: .AKBOOK PAKET FORMATI' : 'ARCHITECTURE: .AKBOOK PACKAGE FORMAT'} ]
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
              ? 'Sıradan PDF Değil; Etkileşimli Zengin Eğitim Konteyneri'
              : 'Not a Flat PDF; An Interactive Smart Textbook Container'}
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
              ? 'EtapKitap, MEB ve OGM standart ders kitabı PDF’lerini ayrıştırarak `[0.0, 1.0]` normalize koordinat sisteminde dinamik etkileşim noktaları (hotspots) tanımlar. 3D ekranda gördüğünüz koordinat kılavuzu bu katmanı temsil eder:'
              : 'EtapKitap maps interactive hotspots over textbook pages using resolution-independent normalized `[0.0, 1.0]` coordinates:'}
          </p>

          {/* Hotspot Feature Matrix */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid #ffffff' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                1. FORMÜL & BİLGİ KARTLARI (`info`)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                {isTr
                  ? 'Sayfadaki terim veya formüle dokunulduğunda akıcı pencereyle açılan kavram açıklamaları.'
                  : 'Instant floating cards explaining critical formulas and glossary definitions on touch.'}
              </div>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(255,255,255,0.65)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                2. GÖMÜLÜ DENEY & SORU VİDEOLARI (`video` & `audio`)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                {isTr
                  ? 'İnternet bağlantısı gerektirmeyen, doğrudan .akbook konteynerinden oynatılan yerel medya.'
                  : 'Zero internet required; videos and pronunciation audio stream natively from the container.'}
              </div>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(255,255,255,0.35)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                3. ÖĞRETMEN MODU (PROGRESSIVE REVEAL)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                {isTr
                  ? 'Sorunun çözüm adımlarını sınıfta teker teker açma veya doğrudan doğru yanıtı gösterme kontrolü.'
                  : 'Progressive reveal mode allows teachers to unmask solution steps one by one.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: PRESENTATION SUITE (220 to 350vh) ─────────────── */}
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
            <Eye size={16} strokeWidth={2} style={{ color: '#ffffff' }} />
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            >
              [ {isTr ? 'DONANIM: AKILLI TAHTA SUNUM ARAÇLARI' : 'HARDWARE: SMART BOARD PRESENTATION SUITE'} ]
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
                Sınıf Hakimiyeti İçin Tasarlanmış Donanımsal Araçlar.{' '}
                <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                  Spot Işığı & Perde.
                </span>
              </>
            ) : (
              <>
                Hardware Tools Crafted for Classroom Focus.{' '}
                <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                  Spotlight & Reveal Curtain.
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
              ? '65 ve 75 inç 4K akıllı tahtalarda öğrenci dikkatini dağıtan görsel karmaşayı tek tuşla ortadan kaldırın. EtapKitap; donanımsal compositing ile tüm ekranda donma olmaksızın çalışan sunum katmanları barındırır:'
              : 'Eliminate visual noise on 65" and 75" classroom boards. Low-latency compositing brings seamless presentation layers without dropping frames:'}
          </p>

          {/* Tools Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                SPOTLIGHT (SPOT IŞIĞI)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                {isTr
                  ? 'Ekranın geri kalanını karartıp sadece hedeflenen soruya veya paragrafa odaklanan daire/dikdörtgen aydınlatma.'
                  : 'Darkens the surroundings, highlighting only the targeted math equation or paragraph.'}
              </div>
            </div>

            <div style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                PERDE (CURTAIN TOOL)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                {isTr
                  ? 'Sorunun adımlarını ve cevaplarını sırayla açmak için 4 yöne sürüklenebilir gizleme perdesi.'
                  : '4-directional draggable reveal curtain to unmask textbook exercises incrementally.'}
              </div>
            </div>

            <div style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                LAZER İŞARETÇİ
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                {isTr
                  ? 'Tahtada dokunulan yeri vurgulayan ve 1.5 saniye sonra kendiliğinden sönen ışık izi.'
                  : 'Auto-fading phosphorescent beam that spotlights critical areas on touch.'}
              </div>
            </div>

            <div style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                EKRAN DONDURMA (FREEZE)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                {isTr
                  ? 'O anki kareyi dondurup üzerine doğrudan karalama ve not alma imkânı.'
                  : 'Instantly freezes live book frame for rapid teacher annotation and vector ink.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: INTERACTIVE TOOLS SIMULATOR (350 to 450vh) ────── */}
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
            [ {isTr ? 'CANLI ETKİLEŞİMLİ TAHTA SİMÜLATÖRÜ' : 'LIVE INTERACTIVE BOARD SIMULATOR'} ]
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
            ? 'Tarayıcınızda Akıllı Tahta Araçlarını Deneyimleyin'
            : 'Experience the Smart Board Presentation Tools Live'}
        </h2>

        {/* Tool Switcher Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setActiveTool('spotlight')}
            data-cursor="expand"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
              borderRadius: '3px',
              border: activeTool === 'spotlight' ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
              background: activeTool === 'spotlight' ? '#ffffff' : 'rgba(255, 255, 255, 0.04)',
              color: activeTool === 'spotlight' ? '#000000' : 'rgba(255, 255, 255, 0.6)',
              fontWeight: activeTool === 'spotlight' ? 700 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            SPOTLIGHT (SPOT IŞIĞI)
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('curtain')}
            data-cursor="expand"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
              borderRadius: '3px',
              border: activeTool === 'curtain' ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
              background: activeTool === 'curtain' ? '#ffffff' : 'rgba(255, 255, 255, 0.04)',
              color: activeTool === 'curtain' ? '#000000' : 'rgba(255, 255, 255, 0.6)',
              fontWeight: activeTool === 'curtain' ? 700 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            PERDE (CURTAIN REVEAL)
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('whiteboard')}
            data-cursor="expand"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
              borderRadius: '3px',
              border: activeTool === 'whiteboard' ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
              background: activeTool === 'whiteboard' ? '#ffffff' : 'rgba(255, 255, 255, 0.04)',
              color: activeTool === 'whiteboard' ? '#000000' : 'rgba(255, 255, 255, 0.6)',
              fontWeight: activeTool === 'whiteboard' ? 700 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            YAZI TAHTASI (6 ŞABLON)
          </button>
        </div>

        {/* Interactive Classroom Stage Box */}
        <div
          style={{
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            background: 'rgba(9, 9, 11, 0.94)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            position: 'relative',
            minHeight: '340px',
            padding: '2rem',
          }}
        >
          {activeTool === 'spotlight' && (
            <div style={{ position: 'relative', height: '100%' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginBottom: '1rem' }}>
                [ ETAPKITAP SPOTLIGHT MODU — HEDEFLENEN SORU ALANINA ODAKLANMA ]
              </div>
              <div
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '1.5rem',
                  background: 'rgba(255,255,255,0.02)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ opacity: 0.18, fontSize: '0.85rem', lineHeight: 1.6 }}>
                  Matematik 11. Sınıf // Konu: Trigonometrik Denklemler ve Dönüşümler. Bu bölümde cos(2x) açılımı ile elde edilen kökler incelenecektir.
                </div>

                <div
                  style={{
                    margin: '1.25rem 0',
                    padding: '1.25rem',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid #ffffff',
                    borderRadius: '4px',
                    boxShadow: '0 0 30px rgba(255,255,255,0.15)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff', marginBottom: '0.4rem' }}>
                    Örnek Soru 21: cos(2x) + 3·sin(x) - 2 = 0 denkleminin [0, 2π) aralığındaki kökler toplamı nedir?
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>
                    Çözüm: 1 - 2·sin²(x) + 3·sin(x) - 2 = 0 → (2·sin(x) - 1)(sin(x) - 1) = 0
                  </div>
                </div>

                <div style={{ opacity: 0.18, fontSize: '0.85rem', lineHeight: 1.6 }}>
                  Dönüşüm formülleri yardımıyla elde edilen kökler aralık sınırlarına göre kontrol edilmelidir.
                </div>
              </div>
            </div>
          )}

          {activeTool === 'curtain' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
                  [ PERDE (CURTAIN) — AÇILMA ORANI: %{curtainHeight} ]
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={curtainHeight}
                  onChange={(e) => setCurtainHeight(Number(e.target.value))}
                  style={{ width: '180px', accentColor: '#ffffff', cursor: 'pointer' }}
                />
              </div>

              <div
                style={{
                  border: '1px solid rgba(255,255,255,0.15)',
                  position: 'relative',
                  minHeight: '200px',
                  background: '#0a0a0e',
                  overflow: 'hidden',
                }}
              >
                {/* Revealing Content */}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>
                    Fizik Deneyi: Eğimli Düzlemde Sürtünme Katsayısı
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                    1. Adım: Cisim eğik düzlem üzerine bırakılır ve kritik kayma açısı θ tespit edilir.<br />
                    2. Adım: Statik denge koşulu: mg·sin(θ) = k·mg·cos(θ) bağıntısı kurulur.<br />
                    3. Adım: Sürtünme katsayısı formülü k = tan(θ) olarak hesaplanır.
                  </div>
                </div>

                {/* Draggable Reveal Curtain Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: `${curtainHeight}%`,
                    left: 0,
                    width: '100%',
                    bottom: 0,
                    background: '#141418',
                    borderTop: '2px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'top 0.1s ease',
                  }}
                >
                  <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em' }}>
                    ▲ GİZLENEN ÇÖZÜM ADIMLARI (SÜRÜKLEYEREK AÇIN) ▲
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTool === 'whiteboard' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginRight: '0.5rem' }}>
                  ŞABLON SEÇİMİ:
                </span>
                {(['chalkboard', 'grid', 'lined', 'cartesian'] as WhiteboardTemplate[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setWbTemplate(t)}
                    style={{
                      padding: '0.25rem 0.6rem',
                      fontFamily: 'monospace',
                      fontSize: '0.68rem',
                      borderRadius: '3px',
                      border: wbTemplate === t ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.15)',
                      background: wbTemplate === t ? '#ffffff' : 'transparent',
                      color: wbTemplate === t ? '#000000' : 'rgba(255,255,255,0.6)',
                      cursor: 'pointer',
                    }}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>

              <div
                style={{
                  height: '200px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background:
                    wbTemplate === 'chalkboard'
                      ? '#0c140f'
                      : wbTemplate === 'grid'
                      ? 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, #0a0a0e 1px)'
                      : wbTemplate === 'cartesian'
                      ? 'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)'
                      : 'repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(255,255,255,0.08) 28px)',
                  backgroundSize:
                    wbTemplate === 'grid' ? '24px 24px' : wbTemplate === 'cartesian' ? '32px 32px' : 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                  {wbTemplate === 'chalkboard' && 'KARA TAHTA YEŞİLİ — PALM REJECTION & BEZIER YUMUŞATMA'}
                  {wbTemplate === 'grid' && 'NOKTALI MATERYAL IZGARASI — GEOMETRİ & ŞEKİL ÇİZİMİ'}
                  {wbTemplate === 'lined' && 'ÇİZGİLİ DEFTER DÜZENİ — TÜRKÇE & EDEBİYAT YAZI ÇALIŞMASI'}
                  {wbTemplate === 'cartesian' && 'KARTEZYEN KOORDİNAT DÜZLEMİ (X, Y) — FONKSİYON GRAFİKLERİ'}
                </div>
              </div>
            </div>
          )}
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
            ? 'Akıllı Tahtalara Özgür ve Yerel Güç Verin.'
            : 'Bring Free and Native Power to Smart Classroom Boards.'}
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
            ? 'EtapKitap, Apache 2.0 lisansıyla tamamen açık kaynaklıdır. Pardus ETAP 23, Debian ve Linux sistemlerde CMake ve Qt 6 ile derlenebilir.'
            : 'Apache 2.0 licensed open-source project. Builds cleanly with CMake 3.22+, Ninja, and Qt 6 on Pardus ETAP 23, Debian, and Linux workstations.'}
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
            git clone https://github.com/Tiyatrotist/EtapKitap.git
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
            href="https://github.com/Tiyatrotist/EtapKitap"
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
