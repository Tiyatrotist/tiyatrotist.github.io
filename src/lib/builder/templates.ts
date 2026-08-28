/**
 * TIYATROTIST — Project Scroll Templates Registry
 *
 * Lightweight project templates:
 * 1. Cinematic — Large media, typography and scroll-driven storytelling
 * 2. Product   — Software-focused showcase with structured feature sections
 * 3. Minimal   — Simple typography, media and essential project information
 */

import { SectionBlock, ProjectTemplateKey } from '@/types/builder';

export interface ProjectTemplateDef {
  key: ProjectTemplateKey;
  name_tr: string;
  name_en: string;
  description_tr: string;
  description_en: string;
  badge: string;
  icon: string;
  sections: SectionBlock[];
}

export const PROJECT_TEMPLATES: Record<ProjectTemplateKey, ProjectTemplateDef> = {
  cinematic: {
    key: 'cinematic',
    name_tr: 'Sinematik (Cinematic)',
    name_en: 'Cinematic',
    badge: 'STORYTELLING',
    description_tr: 'Büyük medya alanları, güçlü tipografi ve akıcı hikaye anlatımı.',
    description_en: 'Large media, typography and scroll-driven storytelling.',
    icon: '🎬',
    sections: [
      {
        id: 'cine-hero',
        type: 'hero',
        layout: 'centered',
        animation: 'dotMatrixBurst',
        responsive: 'normal',
        visible: true,
        sort_order: 0,
        content: {
          tag_tr: '[ SİNEMATİK // VİTRİN ]',
          tag_en: '[ CINEMATIC // SHOWCASE ]',
          title_tr: 'Proje Başlığı',
          title_en: 'Project Title',
          subtitle_tr: 'Görsel ağırlıklı, etkileyici dijital deneyim.',
          subtitle_en: 'Immersive, visual-heavy digital experience.',
          button_label_tr: 'Canlı Demo ↗',
          button_label_en: 'Live Demo ↗',
        },
      },
      {
        id: 'cine-statement',
        type: 'manifesto',
        layout: 'split',
        animation: 'slideUp',
        responsive: 'stackedMobile',
        visible: true,
        sort_order: 1,
        content: {
          tag_tr: '[ MİMARİ VİZYON ]',
          tag_en: '[ ARCHITECTURAL VISION ]',
          title_tr: 'Saf mantık ve yalın form.',
          title_en: 'Pure logic and minimal form.',
          body_tr: 'Kullanıcı etkileşimini merkeze alan akıcı ve güçlü tasarım.',
          body_en: 'Fluid and robust design centering user interaction.',
        },
      },
      {
        id: 'cine-media',
        type: 'mediaGallery',
        layout: 'fullWidth',
        animation: 'fadeIn',
        responsive: 'carouselMobile',
        visible: true,
        sort_order: 2,
        content: {
          tag_tr: '[ BÜYÜK MEDYA VİTRİNİ ]',
          tag_en: '[ LARGE MEDIA SHOWCASE ]',
        },
      },
      {
        id: 'cine-features',
        type: 'feature',
        layout: 'grid',
        animation: 'slideUp',
        responsive: 'stackedMobile',
        visible: true,
        sort_order: 3,
        content: {
          tag_tr: '[ ÖZELLİKLER ]',
          tag_en: '[ FEATURES ]',
          features: [
            { icon: '✨', title_tr: 'Akıcı Geçişler', title_en: 'Fluid Motion', description_tr: 'Donanım hızlandırmalı pürüzsüz animasyonlar.', description_en: 'Hardware accelerated smooth animations.' },
            { icon: '🎨', title_tr: 'Monokrom Estetik', title_en: 'Monochrome Aesthetic', description_tr: 'Gözü yormayan minimalist tipografik düzen.', description_en: 'Eye-friendly minimalist typographic layout.' },
          ],
        },
      },
      {
        id: 'cine-release',
        type: 'release',
        layout: 'centered',
        animation: 'fadeIn',
        responsive: 'normal',
        visible: true,
        sort_order: 4,
        content: {
          tag_tr: '[ SÜRÜM GEÇMİŞİ ]',
          tag_en: '[ RELEASES ]',
        },
      },
      {
        id: 'cine-download',
        type: 'download',
        layout: 'centered',
        animation: 'fadeIn',
        responsive: 'normal',
        visible: true,
        sort_order: 5,
        content: {
          tag_tr: '[ İNDİR // ÇALIŞTIR ]',
          tag_en: '[ DOWNLOAD // RUN ]',
          title_tr: 'Hemen Deneyin',
          title_en: 'Try It Now',
          button_label_tr: 'Sürümü İndir ↓',
          button_label_en: 'Download Release ↓',
        },
      },
      {
        id: 'cine-github',
        type: 'cta',
        layout: 'centered',
        animation: 'fadeIn',
        responsive: 'normal',
        visible: true,
        sort_order: 6,
        content: {
          tag_tr: '[ AÇIK KAYNAK // TOPLULUK ]',
          tag_en: '[ OPEN SOURCE // COMMUNITY ]',
          title_tr: 'Kaynak Kodunu İnceleyin',
          title_en: 'Explore Source Code',
          button_label_tr: 'GitHub ↗',
          button_label_en: 'GitHub ↗',
        },
      },
    ],
  },

  product: {
    key: 'product',
    name_tr: 'Ürün Odaklı (Product)',
    name_en: 'Product',
    badge: 'SOFTWARE SHOWCASE',
    description_tr: 'Yazılım ve uygulama tanıtımı, arayüz vitrini ve yapılandırılmış özellikler.',
    description_en: 'Software-focused showcase with structured feature sections.',
    icon: '🚀',
    sections: [
      {
        id: 'prod-hero',
        type: 'hero',
        layout: 'centered',
        animation: 'dotMatrixBurst',
        responsive: 'normal',
        visible: true,
        sort_order: 0,
        content: {
          tag_tr: '[ SİSTEM 01 // AÇIK KAYNAK ]',
          tag_en: '[ SYSTEM 01 // OPEN SOURCE ]',
          title_tr: 'BookOS — Minimalist İşletim Sistemi',
          title_en: 'BookOS — Minimalist Operating System',
          subtitle_tr: 'Saf mantık ve yalın form ile inşa edilmiş yeni nesil dijital ortam.',
          subtitle_en: 'Next-generation digital medium built with pure logic and minimal form.',
          button_label_tr: 'Sürümü İndir ↓',
          button_label_en: 'Download Release ↓',
        },
      },
      {
        id: 'prod-overview',
        type: 'manifesto',
        layout: 'split',
        animation: 'slideUp',
        responsive: 'stackedMobile',
        visible: true,
        sort_order: 1,
        content: {
          tag_tr: '[ ÜRÜN GENEL BAKIŞ ]',
          tag_en: '[ PRODUCT OVERVIEW ]',
          title_tr: 'Yalınlık, Hız ve Bağımsızlık',
          title_en: 'Simplicity, Speed, and Autonomy',
          body_tr: 'Gereksiz katmanları ortadan kaldırarak performansı ve odaklanmayı merkeze alan mimari yaklaşım.',
          body_en: 'An architectural approach focusing on raw performance and focus by eliminating unnecessary layers.',
        },
      },
      {
        id: 'prod-terminal',
        type: 'terminal',
        layout: 'fullWidth',
        animation: 'fadeIn',
        responsive: 'normal',
        visible: true,
        sort_order: 2,
        content: {
          tag_tr: '[ HIZLI BAŞLANGIÇ // CLI ]',
          tag_en: '[ QUICK START // CLI ]',
          title_tr: 'Doğrudan Terminalden Başlatın',
          title_en: 'Launch Directly From Terminal',
          code_language: 'bash',
          code_snippet: 'git clone https://github.com/tiyatrotist/bookos.git\ncd bookos\nnpm install\nnpm run start',
        },
      },
      {
        id: 'prod-features',
        type: 'feature',
        layout: 'grid',
        animation: 'slideUp',
        responsive: 'stackedMobile',
        visible: true,
        sort_order: 3,
        content: {
          tag_tr: '[ ÖZELLİKLER ]',
          tag_en: '[ FEATURES ]',
          features: [
            { icon: '⚡', title_tr: 'Hafif Çekirdek', title_en: 'Lightweight Core', description_tr: '< 24KB paket boyutu ve ultra hızlı başlatma.', description_en: '< 24KB bundle size and ultra-fast startup.' },
            { icon: '🔒', title_tr: 'Yalıtılmış Bellek', title_en: 'Isolated Sandbox', description_tr: 'Güvenli süreç mimarisi.', description_en: 'Secure process sandbox architecture.' },
          ],
        },
      },
      {
        id: 'prod-stats',
        type: 'stats',
        layout: 'grid',
        animation: 'fadeIn',
        responsive: 'stackedMobile',
        visible: true,
        sort_order: 4,
        content: {
          stats: [
            { label_tr: 'Boyut', label_en: 'Size', value: '< 24KB' },
            { label_tr: 'Yükleme', label_en: 'Load Time', value: '45ms' },
            { label_tr: 'Lisans', label_en: 'License', value: 'MIT' },
          ],
        },
      },
      {
        id: 'prod-release',
        type: 'release',
        layout: 'centered',
        animation: 'fadeIn',
        responsive: 'normal',
        visible: true,
        sort_order: 5,
        content: {
          tag_tr: '[ GÜNCEL SÜRÜM ]',
          tag_en: '[ LATEST RELEASE ]',
        },
      },
      {
        id: 'prod-download',
        type: 'download',
        layout: 'centered',
        animation: 'fadeIn',
        responsive: 'normal',
        visible: true,
        sort_order: 6,
        content: {
          tag_tr: '[ İNDİRME ]',
          tag_en: '[ DOWNLOAD ]',
          button_label_tr: 'BookOS Sürümünü İndir ↓',
          button_label_en: 'Download BookOS Release ↓',
        },
      },
    ],
  },

  minimal: {
    key: 'minimal',
    name_tr: 'Minimal (Sade & Yalın)',
    name_en: 'Minimal',
    badge: 'ESSENTIAL',
    description_tr: 'Sade tipografi, medya ve temel proje bilgileri.',
    description_en: 'Simple typography, media and essential project information.',
    icon: '📐',
    sections: [
      {
        id: 'min-hero',
        type: 'hero',
        layout: 'centered',
        animation: 'fadeIn',
        responsive: 'normal',
        visible: true,
        sort_order: 0,
        content: {
          title_tr: 'Proje Adı',
          title_en: 'Project Name',
          subtitle_tr: 'Projenin kısa açıklaması.',
          subtitle_en: 'Short description of the project.',
        },
      },
      {
        id: 'min-desc',
        type: 'markdownArticle',
        layout: 'centered',
        animation: 'none',
        responsive: 'normal',
        visible: true,
        sort_order: 1,
        content: {
          body_tr: 'Proje hakkında detaylı bilgiler buraya yazılır.',
          body_en: 'Detailed project description goes here.',
        },
      },
      {
        id: 'min-media',
        type: 'mediaGallery',
        layout: 'centered',
        animation: 'fadeIn',
        responsive: 'normal',
        visible: true,
        sort_order: 2,
        content: {
          tag_tr: '[ PROJE GÖRSELLERİ ]',
          tag_en: '[ PROJECT MEDIA ]',
        },
      },
      {
        id: 'min-release',
        type: 'release',
        layout: 'centered',
        animation: 'fadeIn',
        responsive: 'normal',
        visible: true,
        sort_order: 3,
        content: {
          tag_tr: '[ SÜRÜM ]',
          tag_en: '[ RELEASE ]',
        },
      },
      {
        id: 'min-links',
        type: 'cta',
        layout: 'centered',
        animation: 'fadeIn',
        responsive: 'normal',
        visible: true,
        sort_order: 4,
        content: {
          tag_tr: '[ BAĞLANTILAR ]',
          tag_en: '[ LINKS ]',
          button_label_tr: 'GitHub Reposu ↗',
          button_label_en: 'GitHub Repo ↗',
        },
      },
    ],
  },
};
