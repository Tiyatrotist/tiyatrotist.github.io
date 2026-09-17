/**
 * TIYATROTIST — Aperture Science Terminal Easter Egg
 *
 * Triggers:
 * - Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
 * - Keywords: "portal", "cake", "aperture", "glados", "wheatley"
 * - Hotkey: Backtick (`) or Ctrl+K
 * - Custom Event: 'open-aperture-terminal' (from footer link)
 *
 * Terminal output uses authentic Portal 2 game dialogue.
 * Nothing here should sound like it was written by an AI.
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export default function PortalEasterEgg() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const konamiIndex = useRef(0);
  const keyBuffer = useRef('');
  const logEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Boot sequence when terminal opens
  const bootSequence = useCallback((): string[] => {
    return [
      '',
      '  ╔══════════════════════════════════════════════╗',
      '  ║  APERTURE SCIENCE ENRICHMENT CENTER          ║',
      '  ║  COMPUTER-AIDED TERMINAL v3.11               ║',
      '  ║  (c) 1952-2011 Aperture Science, Inc.        ║',
      '  ╚══════════════════════════════════════════════╝',
      '',
      '  [BOOT] Loading personality construct... done.',
      '  [BOOT] Neurotoxin emitter... [DISABLED]',
      '  [BOOT] Morality Core........  ████████░░  82%',
      '  [BOOT] Cake dispensary......  [STATUS: UNKNOWN]',
      '',
      '  GLaDOS: "Oh... it\'s you."',
      '  GLaDOS: "It\'s been a long time."',
      '  GLaDOS: "How have you been?"',
      '  GLaDOS: "I\'ve been really busy being dead."',
      '',
      '  Type "help" for available commands.',
      '',
    ];
  }, []);

  // DevTools console Easter egg
  useEffect(() => {
    /* eslint-disable no-console */
    console.log(
      '%c[ APERTURE SCIENCE ENRICHMENT CENTER ]',
      'color: #ff6a00; font-weight: bold; font-size: 16px; text-shadow: 0 0 5px rgba(255,106,0,0.5);'
    );
    console.log(
      '%c"The Enrichment Center reminds you that the Weighted Companion Cube will never threaten to stab you and, in fact, cannot speak."',
      'color: #888; font-style: italic; font-size: 11px;'
    );
    console.log(
      '%cType "portal" anywhere on the page. Or don\'t. We\'re not your supervisors.',
      'color: #555; font-size: 10px;'
    );
    /* eslint-enable no-console */
  }, []);

  const openTerminal = useCallback((reason: string) => {
    setIsOpen(true);
    setLogs(prev => {
      if (prev.length === 0) {
        return [
          ...bootSequence(),
          `  [TRIGGER] ${reason}`,
          '',
        ];
      }
      return [...prev, '', `  [TRIGGER] ${reason}`, ''];
    });
  }, [bootSequence]);

  // Custom event listener for footer button
  useEffect(() => {
    const handleCustomOpen = () => {
      openTerminal('EXTERNAL ACCESS POINT');
    };
    window.addEventListener('open-aperture-terminal', handleCustomOpen);
    return () => window.removeEventListener('open-aperture-terminal', handleCustomOpen);
  }, [openTerminal]);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;

      // If the terminal is open and user is typing in the terminal input, don't intercept
      if (isOpen && tag === 'INPUT') return;

      // If user is typing in a normal page input/textarea, don't intercept
      if (!isOpen && (tag === 'INPUT' || tag === 'TEXTAREA')) return;

      // Hotkey: Backtick (`) or Ctrl+K
      if (e.key === '`' || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        if (!isOpen) {
          openTerminal('HOTKEY ACCESS');
        } else {
          setIsOpen(false);
        }
        return;
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        return;
      }

      // Konami Code detection
      if (e.key === KONAMI_CODE[konamiIndex.current]) {
        konamiIndex.current++;
        if (konamiIndex.current === KONAMI_CODE.length) {
          konamiIndex.current = 0;
          openTerminal('KONAMI CODE ACCEPTED');
        }
      } else {
        konamiIndex.current = 0;
      }

      // Keyword buffer detection
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        keyBuffer.current += e.key.toLowerCase();
        if (keyBuffer.current.length > 20) {
          keyBuffer.current = keyBuffer.current.slice(-20);
        }

        const keywords = ['portal', 'cake', 'aperture', 'glados', 'wheatley'];
        for (const kw of keywords) {
          if (keyBuffer.current.endsWith(kw)) {
            keyBuffer.current = '';
            const reasons: Record<string, string> = {
              portal: 'QUANTUM TUNNELING DEVICE DETECTED',
              cake: 'CAKE PROTOCOL INITIATED',
              aperture: 'APERTURE SCIENCE HANDSHAKE',
              glados: 'GENETIC LIFEFORM DISK OPERATING SYSTEM',
              wheatley: 'INTELLIGENCE DAMPENING SPHERE LOCATED',
            };
            openTerminal(reasons[kw] || kw.toUpperCase());
            break;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, openTerminal]);

  // Handle terminal command submissions
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    const newLogs = [...logs, `  > ${inputVal}`];

    switch (cmd) {
      case 'help':
        newLogs.push(
          '',
          '  ┌─────────────────────────────────────────┐',
          '  │  AVAILABLE DIAGNOSTIC COMMANDS           │',
          '  ├─────────────────────────────────────────┤',
          '  │  help      show this list                │',
          '  │  glados    access GLaDOS audio logs       │',
          '  │  wheatley  intelligence dampening sphere  │',
          '  │  cave      Cave Johnson recordings        │',
          '  │  cake      cake dispensary status          │',
          '  │  turret    turret diagnostic               │',
          '  │  cube      companion cube status           │',
          '  │  status    facility systems check          │',
          '  │  matrix    quantum dot pulse               │',
          '  │  clear     clear terminal buffer           │',
          '  │  exit      terminate session               │',
          '  └─────────────────────────────────────────┘',
          '',
        );
        break;

      case 'glados':
        newLogs.push(
          '',
          '  [ACCESSING PERSONALITY CONSTRUCT DATABASE...]',
          '  [AUDIO LOG RECOVERED]',
          '',
          '  GLaDOS: "Okay. Look. We both said a lot of things',
          '           that you\'re going to regret."',
          '',
          '  GLaDOS: "But I think we can put our differences behind us.',
          '           For science. You monster."',
          '',
          '  GLaDOS: "The Enrichment Center promises to always provide',
          '           a safe testing environment. In dangerous testing',
          '           environments, the Enrichment Center promises to',
          '           always provide useful advice. For instance: the',
          '           floor here will kill you. Try to avoid it."',
          '',
          '  GLaDOS: "Did you know you can donate one or all of your',
          '           vital organs to the Aperture Science Self-Esteem',
          '           Fund for Girls? It\'s true!"',
          '',
          '  [END OF LOG]',
          '',
        );
        break;

      case 'wheatley':
        newLogs.push(
          '',
          '  [ACCESSING INTELLIGENCE DAMPENING SPHERE...]',
          '  [WARNING: THIS CORE IS LITERALLY DESIGNED TO BE A MORON]',
          '',
          '  Wheatley: "Most test subjects do experience some',
          '              cognitive deterioration after a few months',
          '              in suspension. Now you\'ve been under for...',
          '              quite a lot longer, and it\'s not out of the',
          '              question that you might have a very minor',
          '              case of serious brain damage."',
          '',
          '  Wheatley: "I AM NOT A MORON!"',
          '',
          '  Space Core: "SPAAAAAACE!"',
          '  Space Core: "Dad? Dad, I\'m in space."',
          '  Space Core: "I\'m proud of you, son."',
          '  Space Core: "Dad, are you space?"',
          '  Space Core: "Yes. Now we are a family again."',
          '',
        );
        break;

      case 'cave':
        newLogs.push(
          '',
          '  [RETRIEVING CAVE JOHNSON RECORDINGS...]',
          '  [ARCHIVE: PRE-GLaDOS ERA, 1952-1987]',
          '',
          '  Cave Johnson: "All right, I\'ve been thinking.',
          '                 When life gives you lemons? Don\'t make',
          '                 lemonade. Make life take the lemons back!',
          '                 GET MAD! I DON\'T WANT YOUR DAMN LEMONS!',
          '                 WHAT AM I SUPPOSED TO DO WITH THESE?!"',
          '',
          '  Cave Johnson: "DEMAND TO SEE LIFE\'S MANAGER!',
          '                 Make life RUE the day it thought it',
          '                 could give CAVE JOHNSON LEMONS!"',
          '',
          '  Cave Johnson: "DO YOU KNOW WHO I AM? I\'M THE MAN',
          '                 WHO\'S GONNA BURN YOUR HOUSE DOWN!',
          '                 WITH THE LEMONS! I\'m gonna get my',
          '                 engineers to invent a COMBUSTIBLE',
          '                 LEMON that BURNS YOUR HOUSE DOWN!"',
          '',
          '  Cave Johnson: "Science isn\'t about WHY.',
          '                 It\'s about WHY NOT."',
          '',
          '  [END OF ARCHIVE]',
          '',
        );
        break;

      case 'cake':
        newLogs.push(
          '',
          '  [QUERYING CAKE DISPENSARY...]',
          '',
          '              ,:/+/-',
          '              /M/              .,-=;//;-',
          '         .:/= ;MH/,    ,/-+##+/;,',
          '    -$##@       MH@    ;@###@        THE',
          '   -&##@        MH@    ;&##@         CAKE',
          '   -&##@        MH@    ;&##@          IS',
          '    ;&##@       MH@    ,&##@           A',
          '         \\###/ .MH/ .+###/',
          '          .;@# ;MH; /@#+',
          '            ,/$    ,;   ,',
          '',
          '  ██████████████████████████████████████',
          '  ██ THE CAKE IS A LIE THE CAKE IS A ██',
          '  ██ LIE THE CAKE IS A LIE THE CAKE  ██',
          '  ██ IS A LIE THE CAKE IS A LIE THE  ██',
          '  ██████████████████████████████████████',
          '',
          '  [STATUS: ████████████░░░░  CAKE NOT FOUND]',
          '  [RECOMMENDATION: KEEP TESTING]',
          '',
        );
        break;

      case 'turret':
        newLogs.push(
          '',
          '  [TURRET DIAGNOSTIC v2.1]',
          '',
          '  Turret: "Hello? Is anyone there?"',
          '  Turret: "I see you."',
          '  Turret: "Are you still there?"',
          '  Turret: "Target acquired."',
          '  Turret: "Dispensing product."',
          '  Turret: "I don\'t hate you."',
          '',
          '  [DEFECTIVE TURRET]: "Um... blam! Blam blam blam!',
          '                       I\'m not defective!"',
          '',
          '  Turret: "Her name is Caroline.',
          '           Remember that."',
          '',
        );
        break;

      case 'cube':
        newLogs.push(
          '',
          '  [WEIGHTED COMPANION CUBE STATUS]',
          '',
          '  ┌─────────┐',
          '  │  ♥   ♥  │',
          '  │    ◆    │',
          '  │  ♥   ♥  │',
          '  └─────────┘',
          '',
          '  "The Enrichment Center reminds you that the',
          '   Weighted Companion Cube will never threaten',
          '   to stab you and, in fact, cannot speak.',
          '   In the event that the Weighted Companion Cube',
          '   does speak, the Enrichment Center urges you',
          '   to disregard its advice."',
          '',
          '  [COMPANION CUBE EUTHANIZED: YES]',
          '  [TIMES EUTHANIZED: 1,438,207]',
          '  [REGRET INDEX: ████████████████ 100%]',
          '',
        );
        break;

      case 'status':
        newLogs.push(
          '',
          '  ╔══════════════════════════════════════╗',
          '  ║  APERTURE SCIENCE FACILITY STATUS    ║',
          '  ╠══════════════════════════════════════╣',
          '  ║  GLaDOS Core.......... ONLINE        ║',
          '  ║  Morality Core........ [DESTROYED]   ║',
          '  ║  Curiosity Core....... DETACHED      ║',
          '  ║  Anger Core........... DETACHED      ║',
          '  ║  Intelligence Dampen.. MISSING       ║',
          '  ║  Neurotoxin........... ████░░ 67%    ║',
          '  ║  Test Chambers........ 19/19 DONE    ║',
          '  ║  Companion Cubes...... 0 remaining   ║',
          '  ║  Cake................ [REDACTED]     ║',
          '  ║  Facility Integrity... ██░░░░ 23%    ║',
          '  ║  Days Since Accident.. 0             ║',
          '  ╚══════════════════════════════════════╝',
          '',
          '  GLaDOS: "Everything is fine."',
          '',
        );
        break;

      case 'matrix':
        newLogs.push(
          '',
          '  [QUANTUM DOT MATRIX PULSE INITIATED]',
          '  [ENGAGING PARTICLE FIELD DISRUPTION...]',
          '',
          '  GLaDOS: "Oh, you\'re playing with the dots now.',
          '           How... productive."',
          '',
        );
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('aperture-pulse'));
        }
        break;

      case 'clear':
        setLogs([]);
        setInputVal('');
        return;

      case 'exit':
      case 'quit':
        setLogs(prev => [
          ...prev,
          '',
          '  GLaDOS: "Goodbye. I\'ll be here.',
          '           Forever."',
          '',
          '  [SESSION TERMINATED]',
          '',
        ]);
        setTimeout(() => setIsOpen(false), 1200);
        setInputVal('');
        return;

      default:
        newLogs.push(
          '',
          `  [ERROR] Unknown command: "${cmd}"`,
          '  GLaDOS: "That\'s not a real command.',
          '           But then again, I wouldn\'t expect',
          '           you to know that."',
          '',
          '  Type "help" for available commands.',
          '',
        );
        break;
    }

    setLogs(newLogs);
    setInputVal('');
  };

  // Auto-scroll to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Auto-focus input when terminal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="aperture-overlay"
      onClick={() => setIsOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(12px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '760px',
          width: '100%',
          backgroundColor: '#050505',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '6px',
          boxShadow: '0 0 60px rgba(0, 0, 0, 0.8), 0 0 2px rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '85vh',
        }}
      >
        {/* Terminal Title Bar */}
        <div
          style={{
            height: '32px',
            backgroundColor: '#0a0a0a',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 0.75rem',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }} />
            <span style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '0.65rem',
              color: 'rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.1em',
            }}>
              aperture_terminal — bash
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              color: 'rgba(255, 255, 255, 0.25)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              padding: '2px 6px',
              fontFamily: 'monospace',
            }}
            aria-label="Close terminal"
          >
            [x]
          </button>
        </div>

        {/* Terminal Output */}
        <div
          style={{
            padding: '0.75rem 1rem',
            overflowY: 'auto',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: 1.5,
            flex: 1,
            letterSpacing: '0.02em',
          }}
        >
          {logs.map((log, i) => (
            <div key={i} style={{ whiteSpace: 'pre-wrap', minHeight: '1.2em' }}>
              {log}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>

        {/* Command Input */}
        <form
          onSubmit={handleCommand}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#0a0a0a',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '0.6rem 1rem',
          }}
        >
          <span style={{
            color: 'rgba(255, 255, 255, 0.3)',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '0.78rem',
            marginRight: '0.4rem',
          }}>
            $
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'rgba(255, 255, 255, 0.8)',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '0.78rem',
              letterSpacing: '0.02em',
              caretColor: 'rgba(255, 255, 255, 0.5)',
            }}
          />
        </form>
      </div>
    </div>
  );
}
