/**
 * EXPLORER-TERMINAL — Scrollytelling Product Experience
 *
 * Implements:
 * 1. Lenis smooth momentum scroll engine
 * 2. GSAP ScrollTrigger timeline scrubbing & section pins
 * 3. Three.js real-time procedural 3D Windows 11 Explorer transformations
 * 4. Interactive Live Explorer + Terminal Simulator (Directory sync & Ctrl+J toggle)
 * 5. 100% authentic C++ Windhawk mod engineering data from Tiyatrotist/explorer-terminal.
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Locale, Dictionary } from '@/dictionaries';
import ExplorerTerminalScene3D from './ExplorerTerminalScene3D';
import {
  Terminal,
  Folder,
  Layers,
  Cpu,
  ShieldCheck,
  Check,
  Copy,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  ChevronRight,
  FileCode,
  Sliders,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ExplorerTerminalScrollExperienceProps {
  lang: Locale;
  dict: Dictionary;
}

interface FolderPreset {
  id: string;
  path: string;
  files: { name: string; type: string; size: string; isDir?: boolean }[];
  gitBranch: string;
}

const FOLDERS: FolderPreset[] = [
  {
    id: 'proj',
    path: 'C:\\Projects\\explorer-terminal',
    files: [
      { name: 'docs', type: 'File folder', size: '--', isDir: true },
      { name: 'tests', type: 'File folder', size: '--', isDir: true },
      { name: 'explorer-terminal.wh.cpp', type: 'C++ Source', size: '60.3 KB' },
      { name: 'CHANGELOG.md', type: 'Markdown', size: '1.2 KB' },
      { name: 'README.md', type: 'Markdown', size: '11.6 KB' },
      { name: 'LICENSE', type: 'MIT License', size: '1.1 KB' },
    ],
    gitBranch: 'main',
  },
  {
    id: 'edith',
    path: 'C:\\Users\\Tiyatrotist\\Dev\\E.D.I.T.H',
    files: [
      { name: 'tools', type: 'File folder', size: '--', isDir: true },
      { name: 'main.py', type: 'Python Source', size: '42.1 KB' },
      { name: 'ui.py', type: 'FastAPI Backend', size: '124.7 KB' },
      { name: 'ui_overlay.py', type: 'Win32 HUD', size: '10.3 KB' },
      { name: 'requirements.txt', type: 'Text Document', size: '1.8 KB' },
    ],
    gitBranch: 'feature/termux-secretary',
  },
  {
    id: 'etap',
    path: 'D:\\Education\\EtapKitap',
    files: [
      { name: 'src', type: 'File folder', size: '--', isDir: true },
      { name: 'CMakeLists.txt', type: 'CMake Script', size: '4.8 KB' },
      { name: 'main.cpp', type: 'C++20 Source', size: '2.5 KB' },
      { name: 'packaging', type: 'File folder', size: '--', isDir: true },
    ],
    gitBranch: 'main',
  },
];

export default function ExplorerTerminalScrollExperience({ lang, dict }: ExplorerTerminalScrollExperienceProps) {
  const isTr = lang === 'tr';
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);

  // Interactive Simulator State
  const [selectedFolderIdx, setSelectedFolderIdx] = useState<number>(0);
  const [isTerminalVisible, setIsTerminalVisible] = useState<boolean>(true);
  const [selectedShell, setSelectedShell] = useState<'pwsh' | 'cmd' | 'powershell'>('powershell');
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
    navigator.clipboard.writeText('https://windhawk.net/mods/explorer-terminal');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2400);
  };

  const activeFolder = FOLDERS[selectedFolderIdx];

  return (
    <div
      ref={containerRef}
      className="explorer-terminal-scrollytelling-root"
      style={{
        background: '#09090b',
        color: '#ffffff',
        position: 'relative',
        minHeight: '520vh',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      }}
    >
      {/* 3D Fixed Procedural WebGL Canvas */}
      <ExplorerTerminalScene3D progressRef={scrollProgressRef} />

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
            <span style={{ fontWeight: 800, letterSpacing: '0.12em', fontSize: '0.95rem' }}>EXPLORER-TERMINAL</span>
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
              WINDHAWK MOD
            </span>
          </div>
        </div>

        {/* GitHub CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a
            href="https://github.com/Tiyatrotist/explorer-terminal"
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

      {/* ─── SECTION 1: HERO / DOCKED CONSOLE IN EXPLORER (0 to 100vh) ─── */}
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
            [ {isTr ? 'WINDOWS 11 DOSYA GEZGİNİNE KENETLİ TERMİNAL' : 'TERMINAL DOCKED IN WINDOWS 11 FILE EXPLORER'} ]
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
              ÜSTTE DOSYALAR.{' '}
              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                ALTTA CANLI TERMİNAL.
              </span>
            </>
          ) : (
            <>
              FILES ON TOP.{' '}
              <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                POWERSHELL BELOW.
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
            ? 'Dosya Gezgini içinde gezinirken harici terminal açıp dizin arama devri bitti. Gezdiğiniz her klasörü otomatik takip eden, tek bir kısayolla açılıp kapanan yerel C++ Windhawk modu.'
            : 'Files on top, a real PowerShell prompt below, in the very same window. Open the terminal with a hotkey, browse to another folder, and the prompt follows automatically.'}
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
            CTRL+J İLE ANLIK AÇ / KAPA
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
            OTOMATİK DİZİN TAKİBİ (AUTO CD)
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
            TEK DOSYA .WH.CPP (SIFIR TELEMETRİ)
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

      {/* ─── SECTION 2: WIN32 HOOKING ARCHITECTURE (100 to 220vh) ─────── */}
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
              [ {isTr ? 'MİMARİ: WIN32 CONHOST REPARENTING' : 'ARCHITECTURE: WIN32 CONHOST REPARENTING'} ]
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
              ? 'Yapay Emülasyon Değil; Gerçek Bir Konsolun Kenetlenmesi'
              : 'Not a Web Emulator; A Real Reparented Native Console'}
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
              ? 'explorer-terminal, web tabanlı yavaş simülasyonlar kullanmaz. Windows’un yerel `conhost.exe` konsol penceresini `SetParent` Win32 API çağrısıyla Dosya Gezgini hiyerarşisine bağlar. 3D sahnedeki ayrışan katman bu mimariyi gösterir:'
              : 'explorer-terminal reparents a real native Windows `conhost.exe` instance directly into the Explorer window layout using Win32 API hooks:'}
          </p>

          {/* Architecture Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid #ffffff' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                1. DOCK & RESIZE SPLITTER
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                {isTr
                  ? 'Fareyle sürüklenebilir 1px ayırıcı çizgi; terminal yüksekliğini piksel hassasiyetinde ayarlar.'
                  : 'Draggable splitter handle lets you smoothly resize terminal height within File Explorer.'}
              </div>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(255,255,255,0.65)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                2. SIFIR GECİKME & TÜM SHELL DESTEĞİ
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                {isTr
                  ? 'Windows PowerShell, PowerShell 7 (pwsh) veya CMD; kendi profil ve alias’larınızla tam uyumlu.'
                  : 'Full compatibility with Windows PowerShell, PowerShell 7 (pwsh.exe), and CMD profiles.'}
              </div>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid rgba(255,255,255,0.35)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                3. ARKA PLANDA SÜREKLİ YAŞAYAN OTURUM
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                {isTr
                  ? 'Terminal gizlendiğinde oturum sonlanmaz; uzun süren derleme veya indirme arka planda akar.'
                  : 'Hiding with Ctrl+J preserves state; long running builds keep executing in the background.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: DIRECTORY SYNC (220 to 350vh) ─────────────────── */}
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
            <Folder size={16} strokeWidth={2} style={{ color: '#ffffff' }} />
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.55)',
              }}
            >
              [ {isTr ? 'ÖZELLİK: ANLIK DİZİN TAKİBİ (AUTO-CD)' : 'FEATURE: REAL-TIME AUTO DIRECTORY SYNC'} ]
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
                Siz Klasör Değiştirin, Terminal Otomatik Olarak Takip Etsin.{' '}
                <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                  Manuel &apos;cd&apos; Yazmaya Son.
                </span>
              </>
            ) : (
              <>
                Browse Any Folder, and the Console Follows Along.{' '}
                <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontWeight: 400 }}>
                  No Manual &apos;cd&apos; Needed.
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
              ? 'Dosya Gezgini’nin `IShellBrowser` ve `IShellView` olaylarını dinleyerek adres çubuğundaki her değişimi milisaniyeler içinde terminale `SetCurrentDirectory` veya güvenli `cd` komutu olarak aktarır. Aktif komut çalışıyorsa müdahale etmez; terminal boştayken klasöre kenetlenir.'
              : 'Hooks Windows Shell navigation events (`IShellBrowser`). Whenever you open a folder, explorer-terminal synchronizes the working directory seamlessly without interrupting running jobs.'}
          </p>

          {/* Comparison Matrix */}
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
              <span>DURUM</span>
              <span>STANDART WINDOWS</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>EXPLORER-TERMINAL</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.5rem', padding: '0.45rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span>Terminal Açma</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Yeni Ayrı Pencere</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>Aynı Pencerede Kenetli</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.5rem', padding: '0.45rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span>Klasör Değişimi</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Manuel `cd` Yazmak Şart</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>Otomatik Anlık Senkron</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.5rem', padding: '0.45rem 0' }}>
              <span>Bellek Yükü</span>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>Elektron / Node.js (&gt;200MB)</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>&lt; 5 MB (Native C++)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: INTERACTIVE SIMULATOR (350 to 450vh) ──────────── */}
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
            [ {isTr ? 'CANLI ETKİLEŞİMLİ SİMÜLATÖR' : 'LIVE INTERACTIVE SIMULATOR'} ]
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
            ? 'Klasör Seçin ve Kenetli Terminalin Takibini İzleyin'
            : 'Select a Directory and Watch the Docked Prompt Follow'}
        </h2>

        {/* Directory Picker Buttons & Hotkey Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {FOLDERS.map((folder, idx) => (
              <button
                key={folder.id}
                type="button"
                onClick={() => setSelectedFolderIdx(idx)}
                data-cursor="expand"
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  letterSpacing: '0.08em',
                  borderRadius: '3px',
                  border: selectedFolderIdx === idx ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
                  background: selectedFolderIdx === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedFolderIdx === idx ? '#000000' : 'rgba(255, 255, 255, 0.6)',
                  fontWeight: selectedFolderIdx === idx ? 700 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                📁 {folder.id.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Toggle Terminal Button */}
          <button
            type="button"
            onClick={() => setIsTerminalVisible(!isTerminalVisible)}
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.72rem',
              fontFamily: 'monospace',
              borderRadius: '3px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: isTerminalVisible ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>CTRL+J TOGGLE ({isTerminalVisible ? 'GİZLE' : 'GÖSTER'})</span>
          </button>
        </div>

        {/* Interactive Windows 11 Explorer Box */}
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
          {/* Breadcrumb Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.03)',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: '#ffffff',
            }}
          >
            <span style={{ color: 'rgba(255, 255, 255, 0.45)', marginRight: '0.5rem' }}>This PC &gt;</span>
            <span>{activeFolder.path}</span>
          </div>

          {/* File Explorer Content Grid */}
          <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: '#121217' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'monospace' }}>
              <span>Ad</span>
              <span>Tür</span>
              <span>Boyut</span>
            </div>
            {activeFolder.files.map((file, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1fr',
                  padding: '0.35rem 0',
                  fontSize: '0.78rem',
                  fontFamily: 'monospace',
                  color: file.isDir ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                }}
              >
                <span>{file.isDir ? '📁 ' : '📄 '}{file.name}</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.45)' }}>{file.type}</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.45)' }}>{file.size}</span>
              </div>
            ))}
          </div>

          {/* Draggable Dock Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.3rem 1rem',
              background: '#202028',
              fontSize: '0.68rem',
              fontFamily: 'monospace',
              color: 'rgba(255, 255, 255, 0.6)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <span>DOCK DIVIDER (WINDHAWK REPARENTED CONSOLE)</span>
            <span>[ HOTKEY: CTRL+J ]</span>
          </div>

          {/* Docked PowerShell Prompt */}
          {isTerminalVisible && (
            <div
              style={{
                padding: '1.25rem',
                background: '#09090c',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                lineHeight: 1.6,
                minHeight: '160px',
              }}
            >
              <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Windows PowerShell (conhost.exe — Process Attached)</div>
              <div style={{ color: '#ffffff', marginTop: '0.5rem' }}>
                PS {activeFolder.path}&gt; git status
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                On branch {activeFolder.gitBranch}<br />
                Your branch is up to date with &apos;origin/{activeFolder.gitBranch}&apos;.<br />
                nothing to commit, working tree clean
              </div>
              <div style={{ color: '#ffffff', marginTop: '0.5rem' }}>
                PS {activeFolder.path}&gt; <span style={{ display: 'inline-block', width: '8px', height: '14px', background: '#ffffff', verticalAlign: 'middle', animation: 'pulse 1s infinite' }} />
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
          [ {isTr ? 'AÇIK KAYNAK VE KURULUM' : 'OPEN SOURCE & INSTALLATION'} ]
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
            ? 'Dosya Gezgininizi Bugün Güçlendirin.'
            : 'Dock a Native Console in File Explorer Today.'}
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
            ? 'explorer-terminal, MIT lisanslıdır. Windhawk mod yöneticisi üzerinden tek bir tıkla kurabilir veya doğrudan C++ kaynak kodunu inceleyebilirsiniz.'
            : 'Zero heavy background daemons. Install with one click via Windhawk or audit the clean single-file C++ codebase.'}
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
            https://windhawk.net/mods/explorer-terminal
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
            href="https://github.com/Tiyatrotist/explorer-terminal"
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
