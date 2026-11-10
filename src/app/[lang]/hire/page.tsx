/**
 * TIYATROTIST — Hire Me / Freelance & Engineering Collaboration
 *
 * Minimalist, monochrome portfolio presentation:
 * - Transparent student & freelance availability status
 * - Deep systems capabilities: Rust, C++, Python, Linux Distro / Kernel level, Backend & Server infrastructure
 * - Direct contact & communication channels
 */

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Locale, getDictionary } from '@/dictionaries';

interface HirePageProps {
  params: Promise<{ lang: string }>;
}

export default async function HirePage({ params }: HirePageProps) {
  const { lang } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);
  const isTr = currentLang === 'tr';

  return (
    <main className="main-container">
      <Header lang={currentLang} dict={dict} />

      <div className="page-container" style={{ maxWidth: '880px', paddingTop: '2.5rem', paddingBottom: '6rem' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Link
            href={`/${currentLang}`}
            style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.4)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
            }}
          >
            ← {isTr ? 'ANA SAYFAYA DÖN' : 'BACK TO HOME'}
          </Link>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>//</span>
          <span
            style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: '0.7rem',
              color: 'rgba(255, 255, 255, 0.65)',
              letterSpacing: '0.06em',
            }}
          >
            {isTr ? 'İŞ BİRLİĞİ & FREELANCE' : 'COLLABORATION & FREELANCE'}
          </span>
        </div>

        {/* Page Title Header */}
        <header className="page-header" style={{ marginBottom: '3rem' }}>
          <span className="page-tag">
            {isTr ? '[ ÇALIŞMA DURUMU & FREELANCE ]' : '[ WORK STATUS & FREELANCE ]'}
          </span>
          <h1
            className="page-title"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              lineHeight: 1.15,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
            }}
          >
            {isTr ? 'Beni İşe Al & Birlikte Çalışalım' : 'Hire Me & Work Together'}
          </h1>
          <p
            className="page-subtitle"
            style={{
              maxWidth: '720px',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            {isTr
              ? 'Şu an aktif öğrenciyim; geleneksel bordrolu/ofis tam zamanlı pozisyonlar yerine uzaktan freelance, proje bazlı sistem mimarisi, backend ve altyapı işlerine tamamen açığım.'
              : 'I am currently an active student; instead of traditional on-site corporate roles, I am fully available for remote freelance contracts, systems architecture, backend engineering, and custom software projects.'}
          </p>
        </header>

        {/* Overview Statement Card */}
        <div
          style={{
            padding: '2rem',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'rgba(255, 255, 255, 0.02)',
            marginBottom: '2.5rem',
          }}
        >
          <h2
            style={{
              fontSize: '0.72rem',
              fontFamily: 'ui-monospace, monospace',
              letterSpacing: '0.1em',
              color: 'rgba(255, 255, 255, 0.45)',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            [ {isTr ? 'ÇALIŞMA MODELİ // ÖĞRENCİ STATÜSÜ' : 'WORKING MODEL // STUDENT STATUS'} ]
          </h2>
          <p
            style={{
              fontSize: '0.98rem',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '1rem',
            }}
          >
            {isTr
              ? 'Eğitimime devam ettiğim için kurumsal mesaili tam zamanlı kadrolara dahil olamıyorum. Buna karşılık; uzaktan çalışılabilen, esnek zaman planlı, proje bazlı freelance sözleşmelerde uçtan uca sistem kurabiliyor ve yüksek sorumluluk alabiliyorum.'
              : 'Because my formal education is ongoing, I do not take on on-site or fixed-hours corporate employment. In return, I deliver end-to-end systems and high-impact engineering for remote, milestone-driven freelance projects.'}
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              background: '#ffffff',
              color: '#000000',
              fontFamily: 'ui-monospace, monospace',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              borderRadius: '2px',
            }}
          >
            <span>{isTr ? 'DURUM: UZAKTAN FREELANCE PROJELERE AÇIK' : 'STATUS: OPEN FOR REMOTE FREELANCE'}</span>
          </div>
        </div>

        {/* Technical Core & Engineering Competencies */}
        <div
          style={{
            padding: '2rem',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.02)',
            marginBottom: '2.5rem',
          }}
        >
          <h2
            style={{
              fontSize: '0.72rem',
              fontFamily: 'ui-monospace, monospace',
              letterSpacing: '0.1em',
              color: 'rgba(255, 255, 255, 0.45)',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            [ {isTr ? 'MÜHENDİSLİK ALANLARIM & SİSTEM YETKİNLİKLERİ' : 'TECHNICAL STACK & CORE COMPETENCIES'} ]
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Area 1: Backend & Server */}
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '1rem' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#ffffff', fontFamily: 'ui-monospace, monospace', fontWeight: 600, marginBottom: '0.35rem' }}>
                01 // BACKEND & SUNUCU MİMARİSİ
              </span>
              <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                {isTr
                  ? 'Yüksek performanslı backend servisleri, API mimarisi, sunucu konfigürasyonu, dağıtık altyapılar ve veri akışı yönetimi.'
                  : 'High-performance backend services, robust API architectures, server orchestration, and distributed workflows.'}
              </p>
            </div>

            {/* Area 2: Linux & Systems */}
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '1rem' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#ffffff', fontFamily: 'ui-monospace, monospace', fontWeight: 600, marginBottom: '0.35rem' }}>
                02 // LİNUX DAĞITIMI & SİSTEM GELİŞTİRME
              </span>
              <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                {isTr
                  ? 'Kendi bağımsız Linux dağıtımımı sıfırdan geliştirdiğim için; çekirdek, paket yönetimi, shell ortamı ve Linux sunucu altyapısına derin hakimiyet.'
                  : 'Having engineered my own Linux distribution from scratch: deep command over kernel utilities, package systems, shell automation, and Linux server fleets.'}
              </p>
            </div>

            {/* Area 3: Low-Level & Languages */}
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '1rem' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#ffffff', fontFamily: 'ui-monospace, monospace', fontWeight: 600, marginBottom: '0.35rem' }}>
                03 // DİLLER & ARAÇLAR
              </span>
              <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                Rust, C++, Python, TypeScript, SQL, Bash. C++20 / Qt masaüstü araçları ve Windhawk modifikasyonları.
              </p>
            </div>

            {/* Area 4: Modern Web & Interfaces */}
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '1rem' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#ffffff', fontFamily: 'ui-monospace, monospace', fontWeight: 600, marginBottom: '0.35rem' }}>
                04 // MODERN WEB & SCROLL SİTELERİ
              </span>
              <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                {isTr
                  ? 'Next.js, TypeScript ve React ile hızlı, minimalist, monokrom ve akıcı hikaye anlatımına sahip scroll mikro siteleri.'
                  : 'Lightweight Next.js, React, and TypeScript web applications featuring fluid scrollytelling and zero bloat.'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information & Inquiry */}
        <div
          style={{
            padding: '2rem',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <h2
            style={{
              fontSize: '0.72rem',
              fontFamily: 'ui-monospace, monospace',
              letterSpacing: '0.1em',
              color: 'rgba(255, 255, 255, 0.45)',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}
          >
            [ {isTr ? 'DOĞRUDAN İLETİŞİM // KİŞİSEL BİLGİLER' : 'DIRECT CONTACT // CHANNELS'} ]
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.75rem',
            }}
          >
            <div>
              <span style={{ display: 'block', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'ui-monospace, monospace', marginBottom: '0.25rem' }}>
                {isTr ? 'GELİŞTİRİCİ' : 'DEVELOPER'}
              </span>
              <span style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 600 }}>
                Buğra Dere (Tiyatrotist)
              </span>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'ui-monospace, monospace', marginBottom: '0.25rem' }}>
                {isTr ? 'YAŞ & EĞİTİM' : 'AGE & EDUCATION'}
              </span>
              <span style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 500 }}>
                {isTr ? '15 // Düzce Fen ve Teknoloji Hafız İHL (Hazırlık)' : '15 // Düzce Science & Tech Hafiz İHL (Prep)'}
              </span>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'ui-monospace, monospace', marginBottom: '0.25rem' }}>
                {isTr ? 'E-POSTA' : 'EMAIL'}
              </span>
              <a
                href="mailto:iletisim@tiyatrotist.com.tr"
                style={{ fontSize: '0.95rem', color: '#ffffff', textDecoration: 'underline', textUnderlineOffset: '4px' }}
              >
                iletisim@tiyatrotist.com.tr
              </a>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'ui-monospace, monospace', marginBottom: '0.25rem' }}>
                GITHUB
              </span>
              <a
                href="https://github.com/Tiyatrotist"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.95rem', color: '#ffffff', textDecoration: 'underline', textUnderlineOffset: '4px' }}
              >
                github.com/Tiyatrotist ↗
              </a>
            </div>
          </div>

          <div style={{ paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Link
              href={`/${currentLang}/contact`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.4rem',
                background: '#ffffff',
                color: '#000000',
                fontFamily: 'ui-monospace, monospace',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textDecoration: 'none',
                borderRadius: '2px',
              }}
            >
              <span>{isTr ? 'MESAJ GÖNDER & İLETİŞİME GEÇ →' : 'SEND MESSAGE & GET IN TOUCH →'}</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer lang={currentLang} dict={dict} />
    </main>
  );
}
