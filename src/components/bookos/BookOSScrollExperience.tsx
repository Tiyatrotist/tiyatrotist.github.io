/**
 * BOOKOS — Scrollytelling Product Experience (Lenis + GSAP ScrollTrigger + Three.js)
 *
 * Implements the "Gold Standard" Awwwards-tier interactive scroll architecture:
 * 1. Lenis smooth momentum scroll engine
 * 2. GSAP ScrollTrigger timeline scrubbing & section pins
 * 3. Three.js real-time procedural 3D device transformations
 * 4. Anti-slop brutalist monochrome styling matching Tiyatrotist guidelines.
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Locale, Dictionary } from '@/dictionaries';
import BookOSScene3D from './BookOSScene3D';
import { Check, ArrowUpRight, Cpu, Layers, Terminal, Sparkles, Monitor, Tablet, PenTool } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface BookOSScrollExperienceProps {
  lang: Locale;
  dict: Dictionary;
}

export default function BookOSScrollExperience({ lang, dict }: BookOSScrollExperienceProps) {
  const isTr = lang === 'tr';
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);
  const [activeTab, setActiveTab] = useState<'reader' | 'editor' | 'board'>('reader');

  // Initialize Lenis + GSAP ScrollTrigger synchronization
  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    // 2. Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // 3. Master ScrollTrigger Progress Tracking
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

  return (
    <div
      ref={containerRef}
      className="bookos-scrollytelling-root"
      style={{
        background: '#09090b',
        color: '#ffffff',
        position: 'relative',
        minHeight: '520vh',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      }}
    >
      {/* 3D Fixed Procedural WebGL Canvas */}
      <BookOSScene3D progressRef={scrollProgressRef} />

      {/* Floating Minimalist Header */}
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
            <span style={{ fontWeight: 800, letterSpacing: '0.12em', fontSize: '0.95rem' }}>BOOKOS</span>
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
              v1.0-VISION
            </span>
          </div>
        </div>

        {/* GitHub CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a
            href="https://github.com/Tiyatrotist/bookos"
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

      {/* ─── SECTION 1: HERO / THE PHILOSOPHY (0 to 100vh) ─────────── */}
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
          pointerEvents: 'auto',
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
            [ {isTr ? 'ÖZGÜR İŞLETİM SİSTEMİ MİMARİSİ' : 'OPEN OPERATING SYSTEM ARCHITECTURE'} ]
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
              SESSİZ BİR ÇALIŞMA ALANI.{' '}
              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                SIFIR GECİKME.
              </span>
            </>
          ) : (
            <>
              A SILENT WORKSPACE.{' '}
              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                ZERO LATENCY.
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
            ? 'Pencere karmaşasından ve gereksiz bildirimlerden arındırılmış; mobil okuma yüzeyinden akıllı tahtalara uzanan bağımsız ve yerel-öncelikli işletim sistemi vizyonu.'
            : 'A distraction-free, local-first operating system vision engineered from mobile reading slates to classroom interactive boards.'}
        </p>

        {/* Architectural Badges */}
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
            &lt; 32 MB {isTr ? 'BELLEK' : 'RAM'}
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
            &lt; 8 MS {isTr ? 'GİRİŞ TEPKİSİ' : 'INPUT LATENCY'}
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
            %100 {isTr ? 'AÇIK KAYNAK' : 'OPEN SOURCE'}
          </div>
        </div>

        {/* Scroll down prompt */}
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

      {/* ─── SECTION 2: PHASE 1 — MOBILE & WEB SURFACE (100 to 220vh) ─── */}
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
            maxWidth: '560px',
            background: 'rgba(9, 9, 11, 0.85)',
            padding: '2.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Tablet size={16} strokeWidth={2} style={{ color: '#ffffff' }} />
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            >
              [ {isTr ? 'FAZ 01: MOBİL & WEB YÜZEYİ' : 'PHASE 01: MOBILE & WEB SURFACE'} ]
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
              ? 'Derin Odaklanma İçin Sade Okuma ve Markdown Yüzeyi'
              : 'A Distraction-Free Reading and Markdown Surface'}
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
              ? 'BookOS, ilk fazında dokunmatik ekranlar ve mobil tarayıcılar üzerinde sıfır gecikmeyle açılan hafif bir çalışma alanı sunar. Webview şişkinliği ve gereksiz çerçeveler yoktur; doğrudan metne ve düşüncelere odaklanırsınız.'
              : 'In its first phase, BookOS delivers an instant-launch reading workspace designed for touch slates and mobile devices. Zero bloated web wrappers; pure typographic focus.'}
          </p>

          {/* Interactive Feature Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
              <Check size={14} style={{ color: '#ffffff' }} />
              <span>{isTr ? 'Sıfır ek yük ile anında not alma ve açılış' : 'Instant startup with zero background overhead'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
              <Check size={14} style={{ color: '#ffffff' }} />
              <span>{isTr ? 'Düz metin Markdown ve çift yönlü bağlantı' : 'Plaintext Markdown and bidirectional links'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
              <Check size={14} style={{ color: '#ffffff' }} />
              <span>{isTr ? 'Tamamen çevrimdışı ve yerel-öncelikli depolama' : 'Completely offline and local-first data storage'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: PHASE 2 — PC & SMART BOARD OS (220 to 350vh) ───── */}
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
            border: '1px solid rgba(255, 255, 255, 0.16)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Monitor size={16} strokeWidth={2} style={{ color: '#ffffff' }} />
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            >
              [ {isTr ? 'FAZ 02: PC & AKILLI TAHTA SİSTEMİ' : 'PHASE 02: PC & SMART BOARD OS'} ]
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
                Pardus ETAP&apos;ı Aşmak:{' '}
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 400 }}>
                  Sınıf İçi Sıfır Gecikmeli Tahta İşletim Sistemi
                </span>
              </>
            ) : (
              <>
                Surpassing Pardus ETAP:{' '}
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 400 }}>
                  Zero-Latency Classroom Smart Board OS
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
              ? 'Akıllı sınıflarda kullanılan Pardus ETAP ve benzeri sistemlerdeki hantal Webview araçları, donanım gecikmeleri ve çökme problemleri son buluyor. BookOS Faz 2; Pardus\'taki tüm özellikleri dahili olarak bünyesinde barındıran, sıfır gecikmeli çizim motoruna sahip, doğrudan son kullanıcı ve öğretmen deneyimine odaklanan yerel bir sistem mimarisidir.'
              : 'Ending sluggish Webview wrappers and input lag on classroom interactive boards. BookOS Phase 2 integrates all smart board tools natively with zero latency, engineered strictly for superior teacher and student experience.'}
          </p>

          {/* Comparative Performance Matrix */}
          <div
            style={{
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              padding: '1.25rem',
              background: 'rgba(255, 255, 255, 0.02)',
              marginBottom: '1.5rem',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem', color: 'rgba(255,255,255,0.45)' }}>
              <span>{isTr ? 'MİMARİ METRİK' : 'METRIC'}</span>
              <span>PARDUS ETAP</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>BOOKOS FAZ 2</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr', gap: '0.5rem', padding: '0.45rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span>{isTr ? 'Kalem Çizim Gecikmesi' : 'Stylus Input Lag'}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>45 - 65 ms</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>&lt; 8 ms</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr', gap: '0.5rem', padding: '0.45rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span>{isTr ? 'Boşta RAM Ayak İzi' : 'Idle RAM Footprint'}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>850 - 1200 MB</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>&lt; 90 MB</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr', gap: '0.5rem', padding: '0.45rem 0' }}>
              <span>{isTr ? 'Z-Kitap Açılış Süresi' : 'Textbook Launch'}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>4 - 7 sn</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>Anında (Instant)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: ARCHITECTURAL EXECUTOR (350 to 450vh) ───────────── */}
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
            maxWidth: '560px',
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
              [ {isTr ? 'PATLATILMIŞ SİSTEM KATMANLARI' : 'EXPLODED SYSTEM LAYERS'} ]
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
              ? 'Katmanlı C++20 & POSIX Çekirdek Mimarisi'
              : 'Layered C++20 & POSIX Native Architecture'}
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
              ? 'Sıfırdan Linux dağıtımı inşa etme deneyimimden hareketle tasarlanan BookOS çekirdeği; donanım kancalarını doğrudan kullanıcı arayüzü ile buluşturur. 3D sahnede ayrışan üç temel katman:'
              : 'Engineered from scratch through independent Linux distribution compilation; BookOS bridges hardware hooks directly to the user surface without intermediate bloat:'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid #ffffff' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                KATMAN 1: DOKUNMATİK SAYISALLAŞTIRICI (120Hz)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                Ham dokunma ve kalem girdilerini filtreleyen, sıfır olay gecikmeli donanım katmanı.
              </div>
            </div>

            <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(255,255,255,0.6)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                KATMAN 2: C++20 YEREL KOMPOZİTÖR
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                Donanım hızlandırmalı sayfa önbellekleme ve çoklu iş parçacıklı çizim yüzeyi.
              </div>
            </div>

            <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(255,255,255,0.3)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                KATMAN 3: KRİPTOGRAFİK ÇEVRİMDIŞI DEPO
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                Düz metin formatında saklanan ve bulut bağımlılığı olmayan güvenli not kütüğü.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: ECOSYSTEM & CALL TO ACTION (450 to 520vh) ───────── */}
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
          [ {isTr ? 'BİRLEŞİK EKOSİSTEM VİZYONU' : 'UNIFIED ECOSYSTEM VISION'} ]
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
            ? 'Geleceğin Akıllı Tahta ve Çalışma Alanı Sistemini İnşa Ediyoruz.'
            : 'Engineering the Next Generation Classroom and Reading Operating System.'}
        </h2>

        <p
          style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.65)',
            maxWidth: '560px',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
          }}
        >
          {isTr
            ? 'BookOS, açık kaynak topluluğu ve son kullanıcı odaklı bir mühendislik yaklaşımıyla GitHub üzerinde geliştirilmektedir. Kaynak kodları inceleyebilir, mimariye katkıda bulunabilirsiniz.'
            : 'BookOS is being developed openly on GitHub with an uncompromising focus on end-user experience. Inspect the code and explore the architectural roadmap.'}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <a
            href="https://github.com/Tiyatrotist/bookos"
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
