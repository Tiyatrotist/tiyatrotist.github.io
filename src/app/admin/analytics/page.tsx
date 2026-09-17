/**
 * TIYATROTIST — Admin Privacy-Focused Analytics Dashboard
 *
 * Visualizes zero-cookie internal telemetry:
 * - Daily traffic trends (SVG chart)
 * - Top read blog posts & likes
 * - Popular platform pages & projects
 * - Device & referrer breakdowns
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

interface DailyStat {
  date: string;
  views: number;
}

interface TopPage {
  path: string;
  views: number;
}

interface TopArticle {
  slug: string;
  title: string;
  views: number;
  likes: number;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [uniqueSessions, setUniqueSessions] = useState(0);
  const [totalBlogReads, setTotalBlogReads] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [topArticles, setTopArticles] = useState<TopArticle[]>([]);
  const [deviceStats, setDeviceStats] = useState<{ desktop: number; mobile: number; tablet: number }>({
    desktop: 0,
    mobile: 0,
    tablet: 0,
  });

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch raw page views
      const { data: viewsData } = await supabase
        .from('page_views')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2000);

      const views = viewsData || [];
      setTotalViews(views.length);

      // Unique sessions
      const sessions = new Set(views.map((v) => v.session_hash).filter(Boolean));
      setUniqueSessions(sessions.size);

      // Device counts
      const devices = { desktop: 0, mobile: 0, tablet: 0 };
      const pathCounts: Record<string, number> = {};
      const dailyMap: Record<string, number> = {};

      // Seed last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        dailyMap[key] = 0;
      }

      views.forEach((v) => {
        // Devices
        if (v.device === 'mobile') devices.mobile++;
        else if (v.device === 'tablet') devices.tablet++;
        else devices.desktop++;

        // Pages
        pathCounts[v.path] = (pathCounts[v.path] || 0) + 1;

        // Daily
        if (v.created_at) {
          const dateKey = v.created_at.split('T')[0];
          if (dailyMap[dateKey] !== undefined) {
            dailyMap[dateKey]++;
          }
        }
      });

      setDeviceStats(devices);

      // Top pages
      const sortedPages = Object.entries(pathCounts)
        .map(([path, count]) => ({ path, views: count }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 8);
      setTopPages(sortedPages);

      // Daily stats array
      const dailyArray = Object.entries(dailyMap).map(([date, count]) => ({
        date: date.slice(5), // MM-DD
        views: count,
      }));
      setDailyStats(dailyArray);

      // 2. Fetch Blog Posts with views_count & likes_count
      const { data: blogData } = await supabase
        .from('blog_posts')
        .select('slug, title_tr, title_en, views_count, likes_count')
        .order('views_count', { ascending: false })
        .limit(10);

      if (blogData) {
        let allReads = 0;
        let allLikes = 0;
        const mappedArticles = blogData.map((b) => {
          const vCount = b.views_count || 0;
          const lCount = b.likes_count || 0;
          allReads += vCount;
          allLikes += lCount;
          return {
            slug: b.slug,
            title: b.title_tr || b.title_en || b.slug,
            views: vCount,
            likes: lCount,
          };
        });

        setTotalBlogReads(allReads);
        setTotalLikes(allLikes);
        setTopArticles(mappedArticles);
      }
    } catch (err) {
      console.debug('[admin/analytics] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return <LoadingSpinner text="Analitik verileri yükleniyor…" large />;
  }

  const maxDailyViews = Math.max(1, ...dailyStats.map((d) => d.views));

  return (
    <>
      <div className="admin-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1>GİZLİLİK ODAKLI DAHİLİ ANALİTİK</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
              Çerez veya üçüncü parti izleyici olmadan, Supabase tabanlı yerel telemetri.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchAnalytics}
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            Verileri Yenile
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="admin-cards" style={{ marginTop: '1.5rem' }}>
        <div className="admin-card">
          <div className="admin-card-label">Toplam Sayfa Görüntüleme</div>
          <div className="admin-card-value" style={{ color: '#ffffff' }}>
            {totalViews}
          </div>
          <div className="admin-card-sub" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Kayıtlı tüm sayfa ziyaretleri
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-label">Tekil Ziyaretçi Oturumu</div>
          <div className="admin-card-value" style={{ color: '#38bdf8' }}>
            {uniqueSessions}
          </div>
          <div className="admin-card-sub" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Anonimleştirilmiş günlük oturumlar
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-label">Toplam Blog Okunması</div>
          <div className="admin-card-value" style={{ color: '#10b981' }}>
            {totalBlogReads}
          </div>
          <div className="admin-card-sub" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Tüm blog makaleleri geneli
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-label">Toplam Reaksiyon / Beğeni</div>
          <div className="admin-card-value" style={{ color: '#ffffff' }}>
            {totalLikes}
          </div>
          <div className="admin-card-sub" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Okuyucuların bıraktığı beğeniler
          </div>
        </div>
      </div>

      {/* Traffic Chart (Last 7 Days) */}
      <section className="admin-overview-section" style={{ marginTop: '2rem' }}>
        <div className="admin-overview-section-header">
          <h3>SON 7 GÜNLÜK ZİYARET GRAFİĞİ</h3>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
            GÜNLÜK SAYFA GÖRÜNTÜLEMELERİ
          </span>
        </div>

        <div
          style={{
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '160px',
              gap: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {dailyStats.map((item) => {
              const heightPercent = Math.max(8, Math.round((item.views / maxDailyViews) * 100));
              return (
                <div
                  key={item.date}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <span style={{ fontSize: '0.68rem', color: '#ffffff', marginBottom: '0.35rem', fontWeight: 600 }}>
                    {item.views}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '40px',
                      height: `${heightPercent}%`,
                      background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.2) 100%)',
                      borderRadius: '3px 3px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.45rem', fontFamily: 'monospace' }}>
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2-Column Split: Top Articles & Top Pages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {/* Top Blog Articles */}
        <section className="admin-overview-section">
          <div className="admin-overview-section-header">
            <h3>EN POPÜLER BLOG YAZILARI</h3>
            <Link href="/admin/blog" className="admin-btn admin-btn-ghost admin-btn-sm">
              Tüm Yazılar →
            </Link>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '0.65rem 0.85rem', color: 'rgba(255,255,255,0.5)' }}>YAZI BAŞLIĞI</th>
                  <th style={{ padding: '0.65rem 0.85rem', color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>OKUNMA</th>
                  <th style={{ padding: '0.65rem 0.85rem', color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>BEĞENİ</th>
                </tr>
              </thead>
              <tbody>
                {topArticles.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                      Henüz blog okuma verisi bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  topArticles.map((art) => (
                    <tr key={art.slug} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.65rem 0.85rem' }}>
                        <Link
                          href={`/tr/blog/${art.slug}`}
                          target="_blank"
                          style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 500 }}
                        >
                          {art.title} ↗
                        </Link>
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', color: '#10b981', fontWeight: 600 }}>
                        {art.views}
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', color: '#f43f5e', fontWeight: 600 }}>
                        {art.likes}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Top Pages & Device Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Pages */}
          <section className="admin-overview-section">
            <div className="admin-overview-section-header">
              <h3>EN ÇOK ZİYARET EDİLEN SAYFALAR</h3>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '0.65rem 0.85rem', color: 'rgba(255,255,255,0.5)' }}>SAYFA YOLU</th>
                    <th style={{ padding: '0.65rem 0.85rem', color: 'rgba(255,255,255,0.5)', textAlign: 'right' }}>GÖRÜNTÜLENME</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.length === 0 ? (
                    <tr>
                      <td colSpan={2} style={{ padding: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                        Henüz sayfa verisi bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    topPages.map((p) => (
                      <tr key={p.path} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.65rem 0.85rem', color: '#ffffff', fontFamily: 'monospace' }}>
                          {p.path}
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', color: '#38bdf8', fontWeight: 600 }}>
                          {p.views}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Device Distribution Card */}
          <section className="admin-overview-section">
            <div className="admin-overview-section-header">
              <h3>CİHAZ DAĞILIMI</h3>
            </div>
            <div className="admin-cards" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="admin-card">
                <div className="admin-card-label">Masaüstü (Desktop)</div>
                <div className="admin-card-value" style={{ fontSize: '1.2rem' }}>
                  {deviceStats.desktop}
                </div>
              </div>
              <div className="admin-card">
                <div className="admin-card-label">Mobil & Tablet</div>
                <div className="admin-card-value" style={{ fontSize: '1.2rem' }}>
                  {deviceStats.mobile + deviceStats.tablet}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
