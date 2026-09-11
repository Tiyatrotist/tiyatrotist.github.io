/**
 * TIYATROTIST — About Timeline Component
 *
 * Minimalist, architectural vertical timeline with alternating branches,
 * strictly matching the schematic diagram (central vertical stem,
 * circular node joints, and horizontal branch lines).
 * Enhanced with glowing pulse animations, glassmorphic cards,
 * and high-fidelity micro-interactions ("göz doygunluğu").
 */

import React from 'react';
import { Locale } from '@/dictionaries';

interface Milestone {
  code: string;
  year: string;
  period_tr: string;
  period_en: string;
  title_tr: string;
  title_en: string;
  desc_tr: string;
  desc_en: string;
  status_tr: string;
  status_en: string;
  tag?: string;
  side: 'right' | 'left';
}

const MILESTONES: Milestone[] = [
  {
    code: '01',
    year: '2026',
    period_tr: '2026 // AĞUSTOS',
    period_en: '2026 // AUGUST',
    title_tr: 'BookOS v1.2.0 Kararlı Sürümü',
    title_en: 'BookOS v1.2.0 Stable Release',
    desc_tr: 'Edebiyat, derin odaklanma ve dokunsal bilgi sentezi için bağımsız masaüstü çalışma alanı işletim sistemi mimarisi.',
    desc_en: 'Independent desktop operating system environment engineered for deep focus, literature, and tactile knowledge synthesis.',
    status_tr: 'YAYINLANDI',
    status_en: 'RELEASED',
    tag: 'SOFTWARE',
    side: 'right',
  },
  {
    code: '02',
    year: '2026',
    period_tr: '2026 // MAYIS',
    period_en: '2026 // MAY',
    title_tr: 'Tiyatrotist Parçacık Tipografi Motoru',
    title_en: 'Tiyatrotist Particle Typography Engine',
    desc_tr: 'Geleneksel piksel kutu modelini baypas eden, 60 FPS hızında çalışan sıfır bağımlılıklı canvas parçacık fiziği motoru.',
    desc_en: 'Zero-dependency canvas particle engine rendering dynamic typography at 60 FPS, bypassing conventional DOM box models.',
    status_tr: 'ÇALIŞIYOR',
    status_en: 'ACTIVE',
    tag: 'ARCHITECTURE',
    side: 'left',
  },
  {
    code: '03',
    year: '2025',
    period_tr: '2025 // KASIM',
    period_en: '2025 // NOVEMBER',
    title_tr: 'Sistem Mimarisi Hackathonu Birinciliği',
    title_en: 'System Architecture Hackathon 1st Place',
    desc_tr: '48 saatlik yarışmada geliştirilen düşük gecikmeli dağıtık veri akışı ve istemci senkronizasyon protokolü ile 1.lik ödülü.',
    desc_en: 'Awarded 1st place for designing a low-latency distributed stream protocol and zero-cost client state synchronization.',
    status_tr: '1.LİK ÖDÜLÜ',
    status_en: '1ST PRIZE',
    tag: 'ACHIEVEMENT',
    side: 'right',
  },
  {
    code: '04',
    year: '2025',
    period_tr: '2025 // TEMMUZ',
    period_en: '2025 // JULY',
    title_tr: 'Blok Tabanlı Headless CMS & Builder',
    title_en: 'Block-Based Headless CMS & Builder',
    desc_tr: 'Monokrom tasarım sistemine adanmış dinamik şablonlar ve yapay zeka destekli çift dilli çeviri motoru mimarisi.',
    desc_en: 'Custom headless block builder tailored for monochrome digital environments with automated bilingual caching.',
    status_tr: 'TAMAMLANDI',
    status_en: 'VERIFIED',
    tag: 'ENGINE',
    side: 'left',
  },
  {
    code: '05',
    year: '2024',
    period_tr: '2024 // EYLÜL',
    period_en: '2024 // SEPTEMBER',
    title_tr: 'Web Tabanlı Etkileşimli Terminal Emülatörü',
    title_en: 'Web-Based Interactive Terminal Emulator',
    desc_tr: 'Tarayıcıda Unix boru hatları, sanal dosya sistemi ve CLI komut çalıştırma kabiliyetine sahip ultra hafif terminal çekirdeği.',
    desc_en: 'Ultra-lightweight browser terminal emulator featuring Unix-style pipes, filesystem navigation, and custom command evaluation.',
    status_tr: 'AÇIK KAYNAK',
    status_en: 'OPEN SOURCE',
    tag: 'SOFTWARE',
    side: 'right',
  },
  {
    code: '06',
    year: '2024',
    period_tr: '2024 // OCAK',
    period_en: '2024 // JANUARY',
    title_tr: 'TIYATROTIST Stüdyosu & Manifestosu',
    title_en: 'TIYATROTIST Studio & Manifesto Founded',
    desc_tr: '“Kod ve sahne arasında” mottosuyla; saf tipografi, mantık ve mekanın tek bir sessiz monokrom ortamda buluştuğu atölye.',
    desc_en: 'Experimental digital studio established under the ethos "between code & stage" — uniting pure logic and monochrome space.',
    status_tr: 'TEMEL TAŞI',
    status_en: 'FOUNDATION',
    tag: 'FOUNDING',
    side: 'left',
  },
];

interface AboutTimelineProps {
  lang: Locale;
}

export default function AboutTimeline({ lang }: AboutTimelineProps) {
  const isTr = lang === 'tr';

  return (
    <div className="about-timeline-wrapper" style={{ marginTop: '6rem', position: 'relative' }}>
      {/* Section Header */}
      <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <span
          className="page-tag"
          style={{
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            letterSpacing: '0.25em',
            color: 'rgba(255, 255, 255, 0.45)',
            display: 'inline-block',
            marginBottom: '0.75rem',
          }}
        >
          {isTr ? '[ KRONOLOJİ // DÖNÜM NOKTALARI ]' : '[ TIMELINE // MILESTONES ]'}
        </span>
        <h2
          style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: 0,
          }}
        >
          {isTr ? 'Gelişim & Başarılar Zaman Çizelgesi' : 'Development & Achievements Timeline'}
        </h2>
        <p
          style={{
            fontSize: '0.95rem',
            color: 'rgba(255, 255, 255, 0.5)',
            marginTop: '0.65rem',
            fontWeight: 300,
            lineHeight: 1.6,
            maxWidth: '540px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {isTr
            ? 'Kod, sistem mimarisi ve açık kaynak serüvenimdeki kronolojik kilit aşamalar.'
            : 'Chronological breakthroughs across code, systems architecture, and open-source craftsmanship.'}
        </p>
      </div>

      {/* Schematic Timeline Tree */}
      <div className="schematic-timeline">
        {/* Continuous Central Vertical Spine Line with Glow and Pulse */}
        <div className="schematic-timeline__spine">
          <div className="schematic-timeline__spine-pulse" />
        </div>

        {/* Milestone Rows */}
        <div className="schematic-timeline__rows">
          {MILESTONES.map((item, index) => {
            const isRight = item.side === 'right';
            const period = isTr ? item.period_tr : item.period_en;
            const title = isTr ? item.title_tr : item.title_en;
            const desc = isTr ? item.desc_tr : item.desc_en;
            const status = isTr ? item.status_tr : item.status_en;

            return (
              <div
                key={item.code}
                className={`schematic-timeline__row ${isRight ? 'schematic-timeline__row--right' : 'schematic-timeline__row--left'}`}
                style={{ '--i': index } as React.CSSProperties}
              >
                {/* Junction Node Circle on Spine */}
                <div className="schematic-timeline__node">
                  <div className="schematic-timeline__node-core" />
                  <div className="schematic-timeline__node-ring" />
                </div>

                {/* Horizontal Branch Connector Line */}
                <div className="schematic-timeline__branch" />

                {/* Milestone Content Box */}
                <div className="schematic-timeline__card" data-cursor="expand">
                  {/* Card Header */}
                  <div className="schematic-timeline__card-header">
                    <span className="schematic-timeline__card-period">{period}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {item.tag && (
                        <span className="schematic-timeline__badge schematic-timeline__badge--tag">
                          {item.tag}
                        </span>
                      )}
                      <span className="schematic-timeline__badge schematic-timeline__badge--status">
                        ● {status}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="schematic-timeline__card-title">{title}</h3>

                  {/* Description */}
                  <p className="schematic-timeline__card-desc">{desc}</p>

                  {/* Micro Index Indicator */}
                  <div className="schematic-timeline__card-footer">
                    <span className="schematic-timeline__node-code">AXIS_0{item.code}</span>
                    <span className="schematic-timeline__year-tag">{item.year}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
