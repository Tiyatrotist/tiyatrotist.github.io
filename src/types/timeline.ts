/**
 * TIYATROTIST — Timeline Types & Defaults
 *
 * Grounded engineering milestones reflecting authentic open-source projects.
 */

export interface TimelineMilestone {
  id?: string;
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
  sort_order: number;
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_MILESTONES: TimelineMilestone[] = [
  {
    code: '01',
    year: '2026',
    period_tr: 'Kasım 2026',
    period_en: 'November 2026',
    title_tr: 'EtapKitap — Akıllı Tahta Kitap Motoru',
    title_en: 'EtapKitap — Smart Board Textbook Engine',
    desc_tr: 'Pardus ETAP 23 ve akıllı sınıflar için C++20 ve Qt 6 ile geliştirilmiş yüksek performanslı dijital ders kitabı platformu.',
    desc_en: 'High-performance interactive textbook engine built with C++20 and Qt 6 for Pardus ETAP 23 smart boards.',
    status_tr: 'AÇIK KAYNAK',
    status_en: 'OPEN SOURCE',
    tag: 'C++20 / QT6',
    side: 'right',
    sort_order: 1,
    enabled: true,
  },
  {
    code: '02',
    year: '2026',
    period_tr: 'Kasım 2026',
    period_en: 'November 2026',
    title_tr: 'explorer-terminal Windhawk Modu',
    title_en: 'explorer-terminal Windhawk Mod',
    desc_tr: 'Windows Dosya Gezgini pencerelerine kenetlenen ve dizin değişikliklerini senkronize takip eden yerel C++ terminal modu.',
    desc_en: 'Native Windhawk C++ mod docking a fully functional terminal directly into Windows File Explorer windows.',
    status_tr: 'YAYINLANDI',
    status_en: 'RELEASED',
    tag: 'WINDHAWK / C++',
    side: 'left',
    sort_order: 2,
    enabled: true,
  },
  {
    code: '03',
    year: '2026',
    period_tr: 'Ekim 2026',
    period_en: 'October 2026',
    title_tr: 'E.D.I.T.H Otonom AI Agent Platformu',
    title_en: 'E.D.I.T.H Autonomous AI Agent Platform',
    desc_tr: 'Yerel ve açık kaynak modellerle çalışan, araç kullanım yeteneklerine ve otonom iş akışlarına sahip kişisel yapay zekâ asistanı.',
    desc_en: 'Open-source personal AI agent capable of tool execution, autonomous planning, and local model orchestration.',
    status_tr: 'AKTİF GELİŞTİRME',
    status_en: 'ACTIVE DEV',
    tag: 'AI / PYTHON',
    side: 'right',
    sort_order: 3,
    enabled: true,
  },
  {
    code: '04',
    year: '2026',
    period_tr: 'Ekim 2026',
    period_en: 'October 2026',
    title_tr: 'OpenPet Masaüstü Yol Arkadaşı',
    title_en: 'OpenPet Desktop Companion',
    desc_tr: 'Windows 11 için düşük kaynak tüketimiyle çalışan, durum makineleriyle zenginleştirilmiş açık kaynaklı masaüstü pet platformu.',
    desc_en: 'Lightweight desktop companion for Windows 11 engineered with state machines and native system hooks.',
    status_tr: 'AÇIK KAYNAK',
    status_en: 'OPEN SOURCE',
    tag: 'DESKTOP / WIN11',
    side: 'left',
    sort_order: 4,
    enabled: true,
  },
  {
    code: '05',
    year: '2026',
    period_tr: 'Ağustos 2026',
    period_en: 'August 2026',
    title_tr: 'BookOS Minimalist Çalışma Alanı',
    title_en: 'BookOS Minimalist Workspace',
    desc_tr: 'Derin odaklanma ve sade okuma deneyimi için tasarlanmış minimalist web çalışma alanı ve not konsepti.',
    desc_en: 'Distraction-free web workspace and markdown reading concept designed for deep focus.',
    status_tr: 'KONSEPT',
    status_en: 'CONCEPT',
    tag: 'UI / UX',
    side: 'right',
    sort_order: 5,
    enabled: true,
  },
  {
    code: '06',
    year: '2026',
    period_tr: 'Ocak 2026',
    period_en: 'January 2026',
    title_tr: 'Tiyatrotist Yazılım Geliştirici Portfolyosu',
    title_en: 'Tiyatrotist Systems Developer Portfolio',
    desc_tr: 'Sade monokrom estetik, Next.js mimarisi ve açık kaynak projelerin sergilendiği merkezi geliştirici portfolyosu.',
    desc_en: 'Clean monochrome portfolio and developer hub built with Next.js showcasing open-source projects.',
    status_tr: 'CANLIDA',
    status_en: 'LIVE',
    tag: 'PORTFOLIO',
    side: 'left',
    sort_order: 6,
    enabled: true,
  },
];
