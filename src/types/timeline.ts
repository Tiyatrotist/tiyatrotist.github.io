/**
 * TIYATROTIST — Timeline Types & Defaults
 *
 * Types and seed milestones for the About page schematic timeline.
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
    period_tr: '2026 // EYLÜL',
    period_en: '2026 // SEPTEMBER',
    title_tr: 'TypeFlow v2.4 SaaS Daktilo Akademisi',
    title_en: 'TypeFlow v2.4 SaaS Typing Academy',
    desc_tr: 'Duolingo benzeri 10 lig basamağı, Web Audio mekanik klavye sentezleyicisi, odak enerjisi ve Super TypeFlow abonelik ekosistemi.',
    desc_en: 'Duolingo-grade 10 competitive leagues, Web Audio mechanical synthesizer, focus energy system, and Super TypeFlow SaaS platform.',
    status_tr: 'CANLIDA',
    status_en: 'LIVE SAAS',
    tag: 'SAAS ACADEMY',
    side: 'right',
    sort_order: 1,
    enabled: true,
  },
  {
    code: '02',
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
    side: 'left',
    sort_order: 2,
    enabled: true,
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
    sort_order: 2,
    enabled: true,
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
    sort_order: 3,
    enabled: true,
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
    sort_order: 4,
    enabled: true,
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
    sort_order: 5,
    enabled: true,
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
    sort_order: 6,
    enabled: true,
  },
];
