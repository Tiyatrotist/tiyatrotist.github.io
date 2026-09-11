/**
 * TIYATROTIST — About Timeline Component
 *
 * Minimalist, architectural vertical timeline with alternating branches,
 * strictly matching the schematic diagram (central vertical stem,
 * circular node joints, and horizontal branch lines).
 * Enhanced with glowing pulse animations, glassmorphic cards,
 * and high-fidelity micro-interactions ("göz doygunluğu").
 *
 * Fetches dynamic milestones from Supabase with safe fallback to DEFAULT_MILESTONES.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Locale } from '@/dictionaries';
import { supabase } from '@/lib/supabase';
import { TimelineMilestone, DEFAULT_MILESTONES } from '@/types/timeline';

interface AboutTimelineProps {
  lang: Locale;
  initialMilestones?: TimelineMilestone[];
}

export default function AboutTimeline({ lang, initialMilestones }: AboutTimelineProps) {
  const isTr = lang === 'tr';
  const [milestones, setMilestones] = useState<TimelineMilestone[]>(
    initialMilestones && initialMilestones.length > 0 ? initialMilestones : DEFAULT_MILESTONES
  );

  useEffect(() => {
    let isMounted = true;

    async function loadDynamicMilestones() {
      console.debug('[AboutTimeline] Fetching live milestones from Supabase…');
      try {
        const { data, error } = await supabase
          .from('about_timeline')
          .select('*')
          .eq('enabled', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.debug('[AboutTimeline] Notice querying about_timeline (using defaults):', error.message);
          return;
        }

        if (isMounted && data && data.length > 0) {
          console.debug(`[AboutTimeline] Successfully loaded ${data.length} live milestones.`);
          setMilestones(data);
        }
      } catch (err) {
        console.debug('[AboutTimeline] Exception loading milestones:', err);
      }
    }

    loadDynamicMilestones();

    return () => {
      isMounted = false;
    };
  }, []);

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
          {milestones.map((item, index) => {
            const isRight = item.side === 'right';
            const period = isTr ? item.period_tr : item.period_en;
            const title = isTr ? item.title_tr : item.title_en;
            const desc = isTr ? item.desc_tr : item.desc_en;
            const status = isTr ? item.status_tr : item.status_en;

            return (
              <div
                key={item.id || item.code || index}
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
