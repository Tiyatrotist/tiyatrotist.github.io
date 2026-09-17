/**
 * TIYATROTIST — Monochrome Developer Terminal / CLI Console
 *
 * Full-fidelity interactive CLI environment.
 * Triggered with ` (backtick), Ctrl+~, Command Palette, or Footer [ SYS_INIT ].
 * Includes system commands, project browsing, blog reader, and game launchers.
 */

'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Locale } from '@/dictionaries';

export default function TiyatrotistTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const router = useRouter();
  const pathname = usePathname();
  const currentLang: Locale = pathname?.startsWith('/en') ? 'en' : 'tr';

  const logEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Boot sequence
  const bootSequence = useCallback((): string[] => {
    return [
      '',
      '  ████████╗██╗██╗   ██╗ █████╗ ████████╗██████╗  ██████╗ ████████╗██╗███████╗████████╗',
      '  ╚══██╔══╝██║╚██╗ ██╔╝██╔══██╗╚══██╔══╝██╔══██╗██╔═══██╗╚══██╔══╝██║██╔════╝╚══██╔══╝',
      '     ██║   ██║ ╚████╔╝ ███████║   ██║   ██████╔╝██║   ██║   ██║   ██║███████╗   ██║   ',
      '     ██║   ██║  ╚██╔╝  ██╔══██║   ██║   ██╔══██╗██║   ██║   ██║   ██║╚════██║   ██║   ',
      '     ██║   ██║   ██║   ██║  ██║   ██║   ██║  ██║╚██████╔╝   ██║   ██║███████║   ██║   ',
      '     ╚═╝   ╚═╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝╚══════╝   ╚═╝   ',
      '',
      `  [SYSTEM] TIYATROTIST OPERATING ENVIRONMENT v2.4.0 (${currentLang.toUpperCase()})`,
      currentLang === 'tr'
        ? '  [KERNEL] Saf Tipografi Motoru ve Noktasal Vektör Katmanı devrede.'
        : '  [KERNEL] Pure Typography Engine & Dot Vector Canvas initialized.',
      currentLang === 'tr'
        ? '  [DURUM] Tüm alt sistemler aktif. Sıfır üçüncü parti izleyici.'
        : '  [STATUS] All subsystems nominal. Zero third-party trackers detected.',
      '',
      currentLang === 'tr'
        ? '  Komut listesini görmek için "help" veya "yardım" yazın.'
        : '  Type "help" to see available terminal commands.',
      '',
    ];
  }, [currentLang]);

  const openTerminal = useCallback(() => {
    setIsOpen(true);
    setLogs((prev) => {
      if (prev.length === 0) {
        return bootSequence();
      }
      return prev;
    });
  }, [bootSequence]);

  // Global triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;

      // Do not intercept if user is typing in form inputs elsewhere
      if (!isOpen && (tag === 'INPUT' || tag === 'TEXTAREA')) return;

      // Key: ` (backtick) or Ctrl + ~ or Ctrl + `
      if (e.key === '`' || (e.ctrlKey && (e.key === '~' || e.key === '`'))) {
        e.preventDefault();
        if (!isOpen) {
          openTerminal();
        } else {
          setIsOpen(false);
        }
        return;
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      openTerminal();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-tiyatrotist-terminal', handleCustomOpen);
    window.addEventListener('open-aperture-terminal', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-tiyatrotist-terminal', handleCustomOpen);
      window.removeEventListener('open-aperture-terminal', handleCustomOpen);
    };
  }, [isOpen, openTerminal]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-scroll output
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Command processor
  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;

    setHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').trim().toLowerCase();

    const output: string[] = [`  tiyatrotist:~$ ${raw}`];

    switch (cmd) {
      case 'help':
      case 'yardim':
      case 'yardım':
        if (currentLang === 'tr') {
          output.push(
            '',
            '  ╔════════════════════════════════════════════════════════════════════╗',
            '  ║ TIYATROTIST CLI — KOMUT REHBERİ                                    ║',
            '  ╠════════════════════════════════════════════════════════════════════╣',
            '  ║ help / yardim           Bu komut listesini görüntüler              ║',
            '  ║ projects / projeler     Tüm açık kaynak sistemleri listeler        ║',
            '  ║ project <isim>          Projeye gider (örn: project sandbox)       ║',
            '  ║ about / cat about       Tiyatrotist felsefe ve manifestosu         ║',
            '  ║ blog list               Son yayınlanan makaleleri listeler         ║',
            '  ║ blog read <slug>        Belirtilen makaleyi açar                   ║',
            '  ║ play <oyun>             Oyna: breaker | pinball | pingpong | sandbox║',
            '  ║ matrix                  Kuantum partikül dalgası tetikler          ║',
            '  ║ contact / iletisim      Resmi iletişim kanallarını görüntüler      ║',
            '  ║ stats / durum           Sistem telemetrisi ve durum özeti          ║',
            '  ║ clear                   Terminal çıktısını temizler                ║',
            '  ║ exit                    Terminal oturumunu kapatır                 ║',
            '  ╚════════════════════════════════════════════════════════════════════╝',
            '',
            '  [İPUCU] "glados", "wheatley", "cake" veya "cave" komutlarını da deneyebilirsiniz.',
            ''
          );
        } else {
          output.push(
            '',
            '  ╔════════════════════════════════════════════════════════════════════╗',
            '  ║ TIYATROTIST CLI — COMMAND REFERENCE                                ║',
            '  ╠════════════════════════════════════════════════════════════════════╣',
            '  ║ help                    Show this command list                     ║',
            '  ║ projects                List all active open-source projects       ║',
            '  ║ project <name>          Navigate to project (e.g. project sandbox) ║',
            '  ║ about / cat about       Print philosophy & design manifesto        ║',
            '  ║ blog list               Display recent published articles          ║',
            '  ║ blog read <slug>        Open specific blog post                    ║',
            '  ║ play <game>             Play: breaker | pinball | pingpong | sandbox║',
            '  ║ matrix                  Trigger quantum particle pulse             ║',
            '  ║ contact                 Display official communication channels    ║',
            '  ║ stats                   Show system status and telemetry           ║',
            '  ║ clear                   Clear terminal buffer                      ║',
            '  ║ exit                    Close terminal session                     ║',
            '  ╚════════════════════════════════════════════════════════════════════╝',
            '',
            '  [TIP] You can also type "glados", "wheatley", "cake", or "cave".',
            ''
          );
        }
        break;

      case 'projects':
      case 'projeler':
        output.push(
          '',
          currentLang === 'tr' ? '  [AKTİF PROJELER]' : '  [ACTIVE PROJECTS]',
          '  1. TypeFlow  — Minimalist Kinetic Typography & Speed Instrument (v2.4.0)',
          '  2. BookOS    — Minimalist Web-Based Reading & Publishing System (v1.2.0)',
          '  3. Sandbox   — Interactive Canvas Particle Physics Laboratory (v1.0.0)',
          '',
          currentLang === 'tr'
            ? '  Doğrudan geçiş yapmak için "project <isim>" yazın.'
            : '  Type "project <name>" to inspect or navigate directly.',
          ''
        );
        break;

      case 'project':
      case 'proje':
        if (!arg) {
          output.push(
            currentLang === 'tr'
              ? '  [HATA] Bir proje adı belirtin: örn. "project sandbox", "project typeflow", "project bookos"'
              : '  [ERROR] Specify a project name: e.g. "project sandbox", "project typeflow", "project bookos"'
          );
        } else if (arg.includes('bookos')) {
          output.push(currentLang === 'tr' ? '  [YÖNLENDİRİLİYOR] BookOS açılıyor...' : '  [NAVIGATING] Jumping to BookOS...');
          router.push(`/${currentLang}/projects/bookos`);
          setTimeout(() => setIsOpen(false), 800);
        } else if (arg.includes('typeflow')) {
          output.push(currentLang === 'tr' ? '  [YÖNLENDİRİLİYOR] TypeFlow açılıyor...' : '  [NAVIGATING] Jumping to TypeFlow...');
          router.push(`/${currentLang}/projects/typeflow`);
          setTimeout(() => setIsOpen(false), 800);
        } else if (arg.includes('sandbox')) {
          output.push(currentLang === 'tr' ? '  [YÖNLENDİRİLİYOR] Particle Sandbox başlatılıyor...' : '  [NAVIGATING] Launching Particle Sandbox Project...');
          router.push(`/${currentLang}/projects/sandbox`);
          setTimeout(() => setIsOpen(false), 800);
        } else {
          output.push(
            currentLang === 'tr'
              ? `  [HATA] Bilinmeyen proje: "${arg}". Projeleri listelemek için "projects" yazın.`
              : `  [ERROR] Unknown project: "${arg}". Type "projects" for the list.`
          );
        }
        break;

      case 'about':
      case 'hakkinda':
      case 'hakkında':
      case 'cat':
        if (cmd === 'cat' && arg !== 'about' && arg !== 'manifesto') {
          output.push(
            currentLang === 'tr'
              ? `  [HATA] Dosya bulunamadı: ${arg || '(boş)'}. "cat about" deneyin.`
              : `  [ERROR] File not found: ${arg || '(empty)'}. Try "cat about".`
          );
        } else {
          if (currentLang === 'tr') {
            output.push(
              '',
              '  [TIYATROTIST MANİFESTOSU]',
              '  "Arayüz bir kılıf değildir. Tipografi, saf mantık ve mekanın',
              '   tek bir sessiz ortamda birleştiği yaşayan bir kompozisyondur.',
              '   Süslü animasyonlar ve dikkat dağıtıcı renkler yerine;',
              '   saf siyah, saf beyaz ve düşüncenin çıplak geometrisi."',
              '',
              '  Kuruluş: 2024 / Dijital Disiplin.',
              ''
            );
          } else {
            output.push(
              '',
              '  [TIYATROTIST MANIFESTO]',
              '  "An interface is not a wrapper. It is a living composition',
              '   where typography, pure logic, and space merge in silence.',
              '   Instead of decorative distractions and flashy colors;',
              '   pure black, pure white, and the raw geometry of thought."',
              '',
              '  Founded: 2024 / Digital Discipline.',
              ''
            );
          }
        }
        break;

      case 'blog':
        if (arg === 'list' || !arg) {
          output.push(currentLang === 'tr' ? '  [MAKALE LİSTESİ ALINIYOR...]' : '  [FETCHING RECENT BLOG ESSAYS...]');
          try {
            const { data } = await supabase
              .from('blog_posts')
              .select('slug, title_tr, title_en, published_at')
              .eq('published', true)
              .order('published_at', { ascending: false })
              .limit(5);

            if (data && data.length > 0) {
              data.forEach((p, idx) => {
                const title = currentLang === 'tr' ? p.title_tr : (p.title_en || p.title_tr);
                output.push(`  ${idx + 1}. [${p.slug}] ${title}`);
              });
              output.push(
                '',
                currentLang === 'tr'
                  ? '  Bir makaleyi açmak için: "blog read <slug>"'
                  : '  Type "blog read <slug>" to read any article.'
              );
            } else {
              output.push(
                currentLang === 'tr'
                  ? '  Veritabanında yayınlanmış makale bulunamadı.'
                  : '  No published blog posts found in database.'
              );
            }
          } catch {
            output.push(
              currentLang === 'tr'
                ? '  [HATA] Veritabanından makaleler okunamadı.'
                : '  [ERROR] Could not fetch articles from database.'
            );
          }
        } else if (arg.startsWith('read ')) {
          const slug = arg.replace('read ', '').trim();
          output.push(
            currentLang === 'tr'
              ? `  [AÇILIYOR] /${currentLang}/blog/${slug} yükleniyor...`
              : `  [OPENING] Loading /${currentLang}/blog/${slug}...`
          );
          router.push(`/${currentLang}/blog/${slug}`);
          setTimeout(() => setIsOpen(false), 800);
        } else {
          output.push('  [USAGE] "blog list" or "blog read <slug>"');
        }
        break;

      case 'play':
      case 'oyna':
        if (arg.includes('breaker') || arg.includes('dot')) {
          output.push(currentLang === 'tr' ? '  [BAŞLATILIYOR] Dot Breaker Arcade...' : '  [LAUNCHING] Dot Breaker Arcade...');
          window.dispatchEvent(new CustomEvent('open-dot-breaker'));
          setTimeout(() => setIsOpen(false), 600);
        } else if (arg.includes('sandbox')) {
          output.push(currentLang === 'tr' ? '  [BAŞLATILIYOR] Particle Sandbox Projesi...' : '  [LAUNCHING] Particle Sandbox Project...');
          router.push(`/${currentLang}/projects/sandbox`);
          setTimeout(() => setIsOpen(false), 600);
        } else if (arg.includes('pinball')) {
          output.push(currentLang === 'tr' ? '  [BAŞLATILIYOR] Monochrome Pinball...' : '  [LAUNCHING] Monochrome Pinball...');
          window.dispatchEvent(new CustomEvent('open-pinball'));
        } else if (arg.includes('pingpong') || arg.includes('pong')) {
          output.push(currentLang === 'tr' ? '  [BAŞLATILIYOR] Monochrome Ping Pong...' : '  [LAUNCHING] Monochrome Ping Pong...');
          window.dispatchEvent(new CustomEvent('open-pingpong'));
        } else {
          output.push('  [USAGE] play <breaker | pinball | pingpong | sandbox>');
        }
        break;

      case 'matrix':
        output.push(
          currentLang === 'tr'
            ? '  [NABIZ] Kuantum nokta matrisi dalgası tetiklendi.'
            : '  [PULSE] Quantum dot matrix pulse triggered.'
        );
        window.dispatchEvent(new CustomEvent('aperture-pulse'));
        break;

      case 'contact':
      case 'iletisim':
      case 'iletişim':
        output.push(
          '',
          currentLang === 'tr' ? '  [İLETİŞİM KANALLARI]' : '  [COMMUNICATION CHANNELS]',
          '  Email:     contact@tiyatrotist.com',
          '  GitHub:    https://github.com/Tiyatrotist',
          '  X/Twitter: https://x.com/Tiyatrotist',
          '  Web:       https://tiyatrotist.com',
          ''
        );
        break;

      case 'stats':
      case 'durum':
        output.push(
          '',
          currentLang === 'tr' ? '  [SİSTEM TELEMETRİSİ]' : '  [SYSTEM TELEMETRY]',
          '  Environment: Production Monochrome React 19 / Next.js 16',
          '  Uptime:      99.98%',
          '  Active Nodes: Global Dot Matrix & Canvas Engine',
          '  Architecture: App Router + Static Generation + Supabase RLS',
          ''
        );
        break;

      // Aperture Science Easter Egg commands preserved!
      case 'glados':
        output.push(
          '',
          '  GLaDOS: "Oh... it\'s you."',
          '  GLaDOS: "I think we can put our differences behind us. For science. You monster."',
          ''
        );
        break;

      case 'wheatley':
        output.push(
          '',
          '  Wheatley: "I AM NOT A MORON!"',
          '  Space Core: "SPAAAAAACE! Dad, are you space? Yes, now we are a family again."',
          ''
        );
        break;

      case 'cake':
        output.push(
          '',
          '  [STATUS: CAKE NOT FOUND]',
          '  THE CAKE IS A LIE. THE CAKE IS A LIE. THE CAKE IS A LIE.',
          ''
        );
        break;

      case 'cave':
        output.push(
          '',
          '  Cave Johnson: "When life gives you lemons? Don\'t make lemonade.',
          '                 Make life take the lemons back! GET MAD!"',
          ''
        );
        break;

      case 'clear':
        setLogs([]);
        setInputVal('');
        return;

      case 'exit':
      case 'quit':
        output.push('  [TERMINAL] Session closed.');
        setLogs((prev) => [...prev, ...output]);
        setInputVal('');
        setTimeout(() => setIsOpen(false), 500);
        return;

      default:
        output.push(
          `  [ERROR] Unknown command: "${raw}".`,
          '  Type "help" to view available commands.'
        );
        break;
    }

    setLogs((prev) => [...prev, ...output]);
    setInputVal('');
  };

  // Keyboard navigation for history (Up/Down)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="terminal-backdrop"
      onClick={() => setIsOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(16px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="terminal-window"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '820px',
          width: '100%',
          backgroundColor: '#050505',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '6px',
          boxShadow: '0 24px 72px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '86vh',
        }}
      >
        {/* Title Bar */}
        <div
          style={{
            height: '34px',
            backgroundColor: '#0a0a0a',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 0.85rem',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
            <span
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '0.68rem',
                color: 'rgba(255, 255, 255, 0.4)',
                letterSpacing: '0.1em',
                marginLeft: '0.4rem',
              }}
            >
              tiyatrotist_terminal — zsh
            </span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            style={{
              color: 'rgba(255, 255, 255, 0.3)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: '2px 6px',
              fontFamily: 'monospace',
            }}
            aria-label="Close terminal"
          >
            [ ESC ]
          </button>
        </div>

        {/* Logs */}
        <div
          style={{
            padding: '1rem',
            overflowY: 'auto',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: 1.55,
            flex: 1,
          }}
        >
          {logs.map((log, i) => (
            <div key={i} style={{ whiteSpace: 'pre-wrap', minHeight: '1.2em' }}>
              {log}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleCommand}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#0a0a0a',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.65rem 1rem',
          }}
        >
          <span
            style={{
              color: '#ffffff',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.8rem',
              marginRight: '0.5rem',
              fontWeight: 600,
            }}
          >
            tiyatrotist:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.8rem',
              letterSpacing: '0.02em',
              caretColor: '#ffffff',
            }}
          />
        </form>
      </div>
    </div>
  );
}
