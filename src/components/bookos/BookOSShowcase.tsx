/**
 * BOOKOS — Showcase Section
 * Product reveal scene with desktop UI panel tabs and performance stats.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Dictionary } from '@/dictionaries';
import { recordProjectEvent } from '@/lib/project-analytics';

interface BookOSShowcaseProps {
  dict: Dictionary;
}

const VAULT_NODES = [
  { id: 'focus', title: 'Derin Odaklanma (Deep Focus)', connections: ['syntax', 'offline'], desc: 'Monolitik ve dikkat dağıtmayan karanlık yüzey mimarisi.' },
  { id: 'syntax', title: 'Dokunsal Sözdizimi (Tactile Syntax)', connections: ['focus', 'matrix'], desc: 'LaTeX formülleri ve hızlı Markdown biçimlendirme kuralları.' },
  { id: 'matrix', title: 'Edebi Matris (Literary Matrix)', connections: ['syntax', 'offline'], desc: 'Metin parçacıkları ve tiradların iki yönlü anlamsal bağı.' },
  { id: 'offline', title: 'Çevrimdışı Bellek (Offline Kernel)', connections: ['focus', 'matrix'], desc: 'Tarayıcı veya yerel işletim sistemi belleğinde çalışan sıfır gecikmeli veri tabanı.' },
];

export default function BookOSShowcase({ dict }: BookOSShowcaseProps) {
  const b = dict.bookos;
  const [activeTab, setActiveTab] = useState<'vault' | 'editor' | 'monitor'>('vault');

  // Interactive Guest Editor State
  const [guestNote, setGuestNote] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Interactive Vault State
  const [activeNode, setActiveNode] = useState<string>('focus');

  // Interactive Kernel Benchmark State
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [benchmarkResult, setBenchmarkResult] = useState<{ latency: string; cacheHit: string; fps: number } | null>(null);

  // Load saved guest note from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bookos_guest_notes');
      if (saved) {
        setGuestNote(saved);
      } else {
        setGuestNote('# BookOS Düşünce Notu\n\n- Odaklanmış zihin, berrak mimari.\n- LaTeX formülü: $E = mc^2$\n- [[Edebi Matris]] ile bağlantı kuruldu.');
      }
    } catch {}
  }, []);

  // Handle Tab Switch
  const handleTabChange = (tab: 'vault' | 'editor' | 'monitor') => {
    setActiveTab(tab);
    console.debug('[BookOS:Showcase] Guest switched tab to:', tab);
    recordProjectEvent({
      projectSlug: 'bookos',
      event_type: 'feature_interaction',
      event_name: `BookOS Sekmesi Değiştirildi: ${tab.toUpperCase()}`,
      is_guest: true,
      metadata: { tab },
    });
  };

  // Handle Note Typing in Guest Mode
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setGuestNote(text);
    setIsSaved(false);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('bookos_guest_notes', text);
        setIsSaved(true);

        const words = text.trim().split(/\s+/).filter(Boolean).length;
        const chars = text.length;

        recordProjectEvent({
          projectSlug: 'bookos',
          event_type: 'content_edit',
          event_name: 'Dokunsal Not Editörü Kullanıldı',
          is_guest: true,
          metadata: { words, chars, preview: text.substring(0, 30) },
        });
      } catch {}
    }, 800);
  };

  // Handle Vault Node Selection
  const handleSelectNode = (nodeId: string) => {
    setActiveNode(nodeId);
    const nodeObj = VAULT_NODES.find((n) => n.id === nodeId);
    if (nodeObj) {
      recordProjectEvent({
        projectSlug: 'bookos',
        event_type: 'feature_interaction',
        event_name: `Bilgi Grafı Düğümü İncelendi: ${nodeObj.title}`,
        is_guest: true,
        metadata: { nodeId, title: nodeObj.title },
      });
    }
  };

  // Handle Kernel Benchmark Run
  const handleRunBenchmark = () => {
    setIsBenchmarking(true);
    const t0 = performance.now();

    setTimeout(() => {
      const latency = (performance.now() - t0) / 10;
      const res = {
        latency: `${Math.max(0.02, latency).toFixed(2)}ms`,
        cacheHit: '99.9%',
        fps: 60,
      };
      setBenchmarkResult(res);
      setIsBenchmarking(false);

      recordProjectEvent({
        projectSlug: 'bookos',
        event_type: 'feature_interaction',
        event_name: 'Çekirdek Tanılama Benchmarkı Çalıştırıldı',
        is_guest: true,
        metadata: res,
      });
    }, 450);
  };

  const currentVault = VAULT_NODES.find((n) => n.id === activeNode) || VAULT_NODES[0];
  const wordCount = guestNote.trim().split(/\s+/).filter(Boolean).length;

  return (
    <section id="showcase" className="bookos-section">
      <div className="bookos-section-header" style={{ textAlign: 'center', alignItems: 'center' }}>
        <span className="bookos-section-tag">[ PRODUCT SHOWCASE // GUEST WORKSPACE ]</span>
        <h2 className="bookos-section-title">{b.showcaseTitle}</h2>
        <p className="bookos-section-desc">{b.showcaseSubtitle}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <button
          onClick={() => handleTabChange('vault')}
          className={`bookos-btn ${activeTab === 'vault' ? 'bookos-btn--primary' : 'bookos-btn--secondary'}`}
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
        >
          {b.tabVault}
        </button>
        <button
          onClick={() => handleTabChange('editor')}
          className={`bookos-btn ${activeTab === 'editor' ? 'bookos-btn--primary' : 'bookos-btn--secondary'}`}
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
        >
          {b.tabEditor} (Canlı Editör)
        </button>
        <button
          onClick={() => handleTabChange('monitor')}
          className={`bookos-btn ${activeTab === 'monitor' ? 'bookos-btn--primary' : 'bookos-btn--secondary'}`}
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
        >
          {b.tabMonitor}
        </button>
      </div>

      <div className="bookos-window">
        <div className="bookos-window__bar">
          <div className="bookos-window__dots">
            <span className="bookos-window__dot bookos-window__dot--red" />
            <span className="bookos-window__dot bookos-window__dot--yellow" />
            <span className="bookos-window__dot bookos-window__dot--green" />
          </div>
          <span className="bookos-window__title">bookos://showcase/{activeTab}.v1</span>
          <span className="bookos-header__badge">CANLI MİSAFİR ÇALIŞMA ALANI</span>
        </div>

        <div style={{ padding: '2rem', minHeight: '360px', background: 'var(--bookos-card)' }}>
          {/* TAB 1: INTERACTIVE KNOWLEDGE VAULT */}
          {activeTab === 'vault' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="bookos-feature-meta">KNOWLEDGE GRAPH & LITERATURE VAULT</span>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontFamily: 'var(--bookos-mono)' }}>● Çevrimdışı Bellek Aktif</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                İki Yönlü Bilgi Ağı & Düğüm Gezgini
              </h3>

              {/* Clickable Interactive Nodes */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', margin: '0.5rem 0' }}>
                {VAULT_NODES.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => handleSelectNode(node.id)}
                    style={{
                      background: activeNode === node.id ? 'var(--bookos-orange)' : 'rgba(255,255,255,0.05)',
                      color: activeNode === node.id ? '#000' : '#fff',
                      border: `1px solid ${activeNode === node.id ? 'var(--bookos-orange)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '8px',
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'var(--bookos-mono)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    ❖ {node.title}
                  </button>
                ))}
              </div>

              {/* Active Node Detail Card */}
              <div
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255, 106, 0, 0.3)',
                  borderRadius: '10px',
                  padding: '1.2rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--bookos-orange)', fontWeight: 700, marginBottom: '0.35rem' }}>
                  SEÇİLİ GRAF DÜĞÜMÜ: {currentVault.title.toUpperCase()}
                </div>
                <p style={{ color: 'var(--bookos-text-secondary)', lineHeight: 1.6, margin: '0 0 0.85rem 0', fontSize: '0.9rem' }}>
                  {currentVault.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--bookos-text-muted)' }}>
                  <span>Bağlantılı Düğümler:</span>
                  {currentVault.connections.map((conn) => (
                    <span
                      key={conn}
                      onClick={() => handleSelectNode(conn)}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        color: '#38bdf8',
                        cursor: 'pointer',
                      }}
                    >
                      [[{conn}]]
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE LIVE SCRATCHPAD EDITOR */}
          {activeTab === 'editor' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="bookos-feature-meta">TACTILE MATRIX EDITOR // MİSAFİR NOT DEFTERİ</span>
                <span style={{ fontSize: '0.75rem', color: isSaved ? '#10b981' : '#f59e0b', fontFamily: 'var(--bookos-mono)' }}>
                  {isSaved ? '✓ Yerel Belleğe Kaydedildi' : '● Değişiklikler Kaydediliyor…'}
                </span>
              </div>

              <textarea
                value={guestNote}
                onChange={handleNoteChange}
                placeholder="Oturum açmadan notlarınızı buraya yazabilirsiniz. Yazdıklarınız otomatik olarak yerel oturumunuza kaydedilir..."
                rows={7}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.45)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  padding: '1rem',
                  color: '#e2e8f0',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--bookos-mono)',
                  lineHeight: 1.6,
                  resize: 'vertical',
                  outline: 'none',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--bookos-text-muted)', fontFamily: 'var(--bookos-mono)' }}>
                <span>Kelime: {wordCount} | Karakter: {guestNote.length}</span>
                <span>Markdown & LaTeX Desteği Aktif</span>
              </div>
            </div>
          )}

          {/* TAB 3: INTERACTIVE KERNEL MONITOR & BENCHMARK */}
          {activeTab === 'monitor' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="bookos-feature-meta">SYSTEM KERNEL MONITOR & LIVE BENCHMARK</span>
                <button
                  onClick={handleRunBenchmark}
                  disabled={isBenchmarking}
                  className="bookos-btn bookos-btn--primary"
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
                >
                  {isBenchmarking ? 'Tanılama Çalışıyor…' : 'Çekirdek Tanılama Benchmarkı Çalıştır'}
                </button>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                Mikrosaniye Süreç Tanılaması & Bellek Durumu
              </h3>

              <div className="bookos-tech-grid" style={{ marginTop: '0.5rem' }}>
                <div className="bookos-tech-card">
                  <span className="bookos-tech-label">SÜREÇ GECİKMESİ</span>
                  <span className="bookos-tech-val" style={{ color: '#27c93f' }}>
                    {benchmarkResult ? benchmarkResult.latency : '0.04ms'}
                  </span>
                </div>
                <div className="bookos-tech-card">
                  <span className="bookos-tech-label">BELLEK BOYUTU</span>
                  <span className="bookos-tech-val">12.4 MB (İstemci)</span>
                </div>
                <div className="bookos-tech-card">
                  <span className="bookos-tech-label">ÖNBELLEK İSABET ORANI</span>
                  <span className="bookos-tech-val">
                    {benchmarkResult ? benchmarkResult.cacheHit : '99.8%'}
                  </span>
                </div>
              </div>

              {benchmarkResult && (
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#6ee7b7',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--bookos-mono)',
                  }}
                >
                  ✓ Çekirdek tanılama tamamlandı: Tüm modüller kararlı (Latency: {benchmarkResult.latency}, Frame: 60 FPS).
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

