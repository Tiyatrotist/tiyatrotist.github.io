/**
 * TIYATROTIST — Blog Studio Generator & Pipeline Engine
 *
 * Generates long-form, visually structured editorial blog drafts with:
 * 1. Automatic classification of required assets:
 *    - SCREENSHOT_REQUIRED: Specific UI/Feature capture tasks with resolution and context
 *    - AI_IMAGE_PROMPT: Ready-to-copy Banana 2 / Midjourney / Imagen monochrome prompts
 * 2. Markdown synchronization with live uploaded asset URLs.
 * 3. Bilingual content generation (TR & EN).
 */

import { BlogStudioDraft, BlogStudioTopicPreset, VisualAsset } from '@/types/blog-studio';

export const BLOG_STUDIO_PRESETS: BlogStudioTopicPreset[] = [
  {
    id: 'typeflow-deep-dive',
    name: 'TypeFlow: Minimalist Daktilo & 60 FPS Web Mimarisi',
    badge: 'MİMARİ & CANVAS',
    description: 'Tarayıcıda sıfır gecikmeli daktilo fiziği, Web Audio sentezleyicisi ve anti-cheat liderlik tablosu.',
    category: 'Engineering',
    tags: ['TypeFlow', 'Canvas', 'Web Audio', 'Performance', 'Architecture'],
    tone: 'Derin Mühendislik & Teknik İnceleme',
    defaultTitleTr: 'TypeFlow Mimarisi: Tarayıcıda Sıfır Gecikmeli Daktilo ve 60 FPS Web Fiziği',
    defaultTitleEn: 'Inside TypeFlow: Zero-Latency Typewriter Physics and 60 FPS Web Architecture',
  },
  {
    id: 'bookos-virtual-os',
    name: 'BookOS: Tarayıcı İçinde Çalışan Taşınabilir İşletim Sistemi',
    badge: 'SİSTEM & WEB-OS',
    description: 'Local-first dosya sistemi, sanal pencere yöneticisi ve V8 izole çalıştırma katmanı.',
    category: 'Architecture',
    tags: ['BookOS', 'Operating System', 'Local-First', 'Web Workers', 'Filesystem'],
    tone: 'Sistem Tasarımı & Vizyon',
    defaultTitleTr: 'BookOS: Web Tarayıcısında Sıfır Bağımlılıkla Çalışan Taşınabilir İşletim Sistemi',
    defaultTitleEn: 'BookOS: A Portable, Local-First Operating System Running in the Browser',
  },
  {
    id: 'monochrome-design-craft',
    name: 'Monochrome Tasarım Sistemi: %60 Siyah, %30 Bordür, %10 Vurgu',
    badge: 'TASARIM SANATI',
    description: 'AI slop estetiğine karşı saf İsviçre tipografisi, dokunsal geri bildirimler ve mikro hareketler.',
    category: 'Design',
    tags: ['Design System', 'Monochrome', 'Typography', 'Craft', 'UI/UX'],
    tone: 'Tasarım Felsefesi & Anti-Slop',
    defaultTitleTr: 'Monochrome Tasarım Manifestosu: %60 Siyah, %30 Bordür ve %10 Vurgu Mimarisi',
    defaultTitleEn: 'The Monochrome Design Manifesto: 60% Black, 30% Border, and 10% Accent Architecture',
  },
  {
    id: 'dotengine-retro-physics',
    name: 'DotEngine: Sıfırdan Piksel Fiziği ve Retro Oyun Motoru',
    badge: 'OYUN MOTORU',
    description: 'Harici kütüphane olmadan saf TypeScript ve Canvas üzerinde matris fiziği ve partikül sistemleri.',
    category: 'Engineering',
    tags: ['DotEngine', 'Game Dev', 'Physics', 'Canvas2D', 'Retro'],
    tone: 'Oyun Mimarisi & Matematik',
    defaultTitleTr: 'DotEngine: Harici Kütüphane Olmadan Sıfırdan Yazılan Piksel Fiziği ve Retro Oyun Motoru',
    defaultTitleEn: 'DotEngine: Building a Zero-Dependency Pixel Physics and Retro Game Engine from Scratch',
  },
];

interface GenerateOptions {
  presetId?: string;
  customTopic?: string;
  tone?: string;
  category?: string;
  tags?: string[];
  targetAudience?: string;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Generates a full structured blog draft with paired visual task cards
 */
export function generateBlogStudioDraft(options: GenerateOptions): BlogStudioDraft {
  const {
    presetId = 'typeflow-deep-dive',
    customTopic = '',
    tone = 'Teknik İnceleme & Derin Mimari',
    category = 'Engineering',
    tags = ['Architecture', 'WebDev', 'TypeScript'],
    targetAudience = 'Yazılım Mimarları, Kıdemli Geliştiriciler ve Arayüz Mühendisleri',
  } = options;

  const now = new Date().toISOString();

  if (presetId === 'bookos-virtual-os') {
    const assets: VisualAsset[] = [
      {
        id: 'asset-bookos-hero',
        placeholderToken: 'PLACEHOLDER_asset-bookos-hero',
        type: 'AI_IMAGE_PROMPT',
        title: 'BookOS Çekirdek & Sanal Bellek Şeması',
        context: 'Makale başlığı altında, BookOS işletim sistemi çekirdeğini ve soyut sanal belleği simgeleyen hero görsel.',
        aspectRatio: '16:9',
        specs: {
          styleEngine: 'Banana 2 / Midjourney v6 / Imagen 3',
          prompt:
            'Editorial architectural isometric wireframe render of an ethereal futuristic operating system kernel, glowing memory blocks, dark obsidian background #0a0a0a, pure white vector highlights, fine technical blueprints, mathematical grid overlay, stark monochrome aesthetic, 8k resolution, cinematic studio lighting --ar 16:9 --style raw',
          negativePrompt: 'colorful, rainbow, blur, noisy, low resolution, 3d cartoon, text watermark',
          aspectRatioHint: '--ar 16:9',
        },
        status: 'pending',
        imageUrl: null,
      },
      {
        id: 'asset-bookos-desktop-ss',
        placeholderToken: 'PLACEHOLDER_asset-bookos-desktop-ss',
        type: 'SCREENSHOT_REQUIRED',
        title: 'BookOS Masaüstü ve Çoklu Pencere Arayüzü',
        context: '2. Bölüm: Sanal pencere yöneticisi ve terminal emülatörünün açık olduğu an.',
        aspectRatio: '16:9',
        specs: {
          resolution: '1920x1080 (16:9 Desktop)',
          targetInterface: '/bookos Masaüstü Görünümü',
          detailsToCapture:
            'BookOS ana masaüstünde en az 2 aktif pencere (Örn: Dosya Yöneticisi ve Terminal). Monokrom temada, dock çubuğu ve pencere başlıkları net okunmalı.',
        },
        status: 'pending',
        imageUrl: null,
      },
      {
        id: 'asset-bookos-vfs-ai',
        placeholderToken: 'PLACEHOLDER_asset-bookos-vfs-ai',
        type: 'AI_IMAGE_PROMPT',
        title: 'Sanal Dosya Sistemi (VFS) Hiyerarşi Şeması',
        context: '3. Bölüm: OPFS (Origin Private File System) ve RAM önbellek katmanının mimari akış şeması.',
        aspectRatio: '16:9',
        specs: {
          styleEngine: 'Banana 2 / Midjourney v6 / Imagen 3',
          prompt:
            'Minimalist technical architectural diagram of a hierarchical tree file system, branching glass nodes, sleek laser connections, monochrome linework on deep matte black canvas, Swiss graphic design influence, high contrast precision vector --ar 16:9',
          negativePrompt: 'color, blurry, 3d glossy, messy lines',
          aspectRatioHint: '--ar 16:9',
        },
        status: 'pending',
        imageUrl: null,
      },
      {
        id: 'asset-bookos-terminal-ss',
        placeholderToken: 'PLACEHOLDER_asset-bookos-terminal-ss',
        type: 'SCREENSHOT_REQUIRED',
        title: 'BookOS Entegre Shell & Terminal Komut Çıktısı',
        context: '4. Bölüm: Terminal üzerinden çalışan komut satırı ve komut geçmişi.',
        aspectRatio: '16:9',
        specs: {
          resolution: '1920x1080 (16:9 Desktop)',
          targetInterface: 'BookOS Terminal Penceresi',
          detailsToCapture:
            'Terminalde "help", "ls -la" veya "sysinfo" komutlarının çalıştırıldığı ekran görüntüsü. Terminal promptu ve monokrom yazı tipi net görünmeli.',
        },
        status: 'pending',
        imageUrl: null,
      },
    ];

    const content_tr = `# BookOS: Web Tarayıcısında Sıfır Bağımlılıkla Çalışan Taşınabilir İşletim Sistemi

Modern web uygulamaları genellikle sunucu tarafı hesaplamalara aşırı bağımlı hale geldi. **BookOS**, bu paradigmayı tersine çevirerek tarayıcıyı yalnızca bir görüntüleyici değil; tam teşekküllü, yerel öncelikli (local-first) bir hesaplama ortamı olarak yeniden tasarlar.

![BookOS Çekirdek & Sanal Bellek Şeması](PLACEHOLDER_asset-bookos-hero)

## 1. Neden Tarayıcıda Bir İşletim Sistemi?

Bulut tabanlı araçların en büyük açmazı, ağ koptuğunda kullanıcının tüm çalışma ortamının felç olmasıdır. BookOS projesine başlarken üç temel prensip belirledik:
- **Sıfır Sunucu Bağımlılığı:** Tüm sistem durumu yerel IndexedDB ve Origin Private File System (OPFS) üzerinde saklanır.
- **Hafif Bellek İzi:** 60 FPS animasyonlar ve mikro saniyelik komut tepkileri.
- **İzole Edilmiş Çalıştırma Katmanı:** Web Worker tabanlı süreç yöneticisi.

## 2. Masaüstü Ortamı ve Sanal Pencere Yöneticisi

Kullanıcı deneyiminin merkezinde, donanım hızlandırmalı sanal pencere yöneticimiz yer alıyor. Her pencere, z-index sıralaması, sürükleme sınırları ve ekran kenarı kenetlenme (snapping) fiziğini saf TypeScript ile hesaplar.

![BookOS Masaüstü ve Çoklu Pencere Arayüzü](PLACEHOLDER_asset-bookos-desktop-ss)

Pencere yöneticisinin durum makinesi aşağıdaki gibi saf bir olay döngüsü üzerine kuruludur:

\`\`\`typescript
interface WindowState {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export class WindowManager {
  private activeWindows: Map<string, WindowState> = new Map();
  private topZIndex: number = 100;

  public focus(id: string): void {
    const win = this.activeWindows.get(id);
    if (!win) return;
    win.zIndex = ++this.topZIndex;
  }
}
\`\`\`

## 3. Sanal Dosya Sistemi (VFS) Mimarisi

Bir işletim sisteminin güvenilirliği dosya sistemine bağlıdır. BookOS, Chromium ve WebKit'in modern OPFS API'sini sarmalayan katmanlı bir sanal dosya sistemi kullanır.

![Sanal Dosya Sistemi (VFS) Hiyerarşi Şeması](PLACEHOLDER_asset-bookos-vfs-ai)

> "Dosyalarınız hiçbir uzak sunucuya gönderilmez. Bilgisayarınızın kendi diskinde, tarayıcınızın güvenli depolama sandbox'ında şifreli olarak barındırılır."

## 4. Entegre Shell & Komut Hattı

Geliştiricilerin vazgeçemediği şey terminaldir. BookOS terminali; piping, pipe zincirleme, dosya yönlendirme ve çevre değişkenlerini destekleyen özel bir bash benzeri ayrıştırıcıya sahiptir.

![BookOS Entegre Shell & Terminal Komut Çıktısı](PLACEHOLDER_asset-bookos-terminal-ss)

## 5. Sonuç ve Gelecek Yol Haritası

BookOS bir oyuncak değil, modern web teknolojilerinin sınırlarını test eden bir mühendislik deneyidir. WebAssembly entegrasyonu ile C/Rust derlemelerini tarayıcı içinde doğrudan derleyip çalıştırmak bir sonraki büyük hedefimizdir.`;

    const content_en = `# BookOS: A Portable, Local-First Operating System Running in the Browser

Modern web applications have become excessively reliant on server-side compute. **BookOS** reverses this paradigm by reimagining the browser not merely as a presentation viewport, but as a fully capable, local-first computing environment.

![BookOS Kernel & Virtual Memory Schematic](PLACEHOLDER_asset-bookos-hero)

## 1. Why an Operating System in the Browser?

The fundamental compromise of cloud-first tools is total disruption when connectivity drops. BookOS was engineered around three strict constraints:
- **Zero Server Dependency:** State persists entirely in IndexedDB and Origin Private File System (OPFS).
- **Ultralight Memory Footprint:** 60 FPS transitions and sub-millisecond command dispatching.
- **Isolated Execution Plane:** Web Worker-based process supervisor.

## 2. Desktop Environment and Window Manager

At the heart of the experience is our hardware-accelerated window manager. Every window manages z-ordering, boundary containment, and snapping physics through pure TypeScript algorithms.

![BookOS Desktop & Multi-Window Interface](PLACEHOLDER_asset-bookos-desktop-ss)

## 3. Virtual File System (VFS) Architecture

A desktop environment is only as reliable as its file system. BookOS implements a layered VFS wrapping the modern Origin Private File System standard.

![Virtual File System (VFS) Hierarchy Schematic](PLACEHOLDER_asset-bookos-vfs-ai)

## 4. Built-in Shell & CLI Capabilities

BookOS features an embedded shell parser supporting piping, environment variables, and filesystem manipulation.

![BookOS Integrated Shell & Terminal Output](PLACEHOLDER_asset-bookos-terminal-ss)

## 5. Roadmap

WebAssembly containerization for native binary execution remains our primary development milestone.`;

    return {
      id: `draft-bookos-${Date.now()}`,
      topic: 'BookOS Taşınabilir Web İşletim Sistemi',
      tone: 'Sistem Tasarımı & Vizyon',
      category: 'Architecture',
      tags: ['BookOS', 'Operating System', 'Local-First', 'WebAssembly'],
      targetAudience: 'Sistem Mimarları ve Kıdemli Mühendisler',
      title_tr: 'BookOS: Web Tarayıcısında Sıfır Bağımlılıkla Çalışan Taşınabilir İşletim Sistemi',
      title_en: 'BookOS: A Portable, Local-First Operating System Running in the Browser',
      slug: 'bookos-tarayicida-calisan-tasinabilir-isletim-sistemi',
      excerpt_tr:
        'Sunucuya bağımlı olmadan, tamamen yerel IndexedDB ve OPFS üzerinde çalışan BookOS mimarisinin teknik perde arkası.',
      excerpt_en:
        'A deep architectural look into BookOS, a zero-dependency local-first operating system running natively inside the browser.',
      content_tr,
      content_en,
      cover_image: '',
      visualAssets: assets,
      published: false,
      featured: true,
      createdAt: now,
      updatedAt: now,
    };
  }

  if (presetId === 'monochrome-design-craft') {
    const assets: VisualAsset[] = [
      {
        id: 'asset-mono-hero',
        placeholderToken: 'PLACEHOLDER_asset-mono-hero',
        type: 'AI_IMAGE_PROMPT',
        title: 'Monochrome İsviçre Tipografi & Izgara Mimarisi',
        context: 'Makale açılış hero görseli: 60-30-10 kuralını anlatan radikal minimalist siyah-beyaz kompozisyon.',
        aspectRatio: '16:9',
        specs: {
          styleEngine: 'Banana 2 / Midjourney v6 / Imagen 3',
          prompt:
            'International typographic style poster, pure stark black and white, extreme precision grid, architectural geometric forms, sharp 1px borders, subtle frosted textures, high contrast editorial layout, Swiss brutalist aesthetics, matte black #0a0a0a background, pure white elements --ar 16:9 --style raw',
          negativePrompt: 'colors, blue, purple, gradients, rounded blob shapes, stock photography, blur',
          aspectRatioHint: '--ar 16:9',
        },
        status: 'pending',
        imageUrl: null,
      },
      {
        id: 'asset-mono-dashboard-ss',
        placeholderToken: 'PLACEHOLDER_asset-mono-dashboard-ss',
        type: 'SCREENSHOT_REQUIRED',
        title: 'Tiyatrotist Yönetici Paneli & Tipografik Hiyerarşi',
        context: '2. Bölüm: %60 Siyah zemin, %30 bordür/kart ve %10 beyaz aksiyon butonlarının canlı uygulanışı.',
        aspectRatio: '16:9',
        specs: {
          resolution: '1920x1080 (16:9 Desktop)',
          targetInterface: '/admin/dashboard veya /admin/blog Sayfası',
          detailsToCapture:
            'Admin arayüzünde kartlar, tablolar ve monokrom rozetlerin net göründüğü tam ekran masaüstü kesiti. Rastgele renk içermeyen temiz monokrom yapı öne çıkmalı.',
        },
        status: 'pending',
        imageUrl: null,
      },
      {
        id: 'asset-mono-motion-ai',
        placeholderToken: 'PLACEHOLDER_asset-mono-motion-ai',
        type: 'AI_IMAGE_PROMPT',
        title: 'Fiziksel Yay Dinamikleri & Dokunsal Geri Bildirim Şeması',
        context: '3. Bölüm: Basıldığında küçülen butonlar (active:scale-98) ve sönümlemeli yay eğrilerinin görsel anlatımı.',
        aspectRatio: '16:9',
        specs: {
          styleEngine: 'Banana 2 / Midjourney v6 / Imagen 3',
          prompt:
            'Minimalist wave form oscillation graph representing cubic bezier spring physics, stark white wireframe trajectory lines over deep obsidian black background, technical oscillogram layout, clean typography --ar 16:9',
          negativePrompt: 'color, blur, 3d render, cartoon',
          aspectRatioHint: '--ar 16:9',
        },
        status: 'pending',
        imageUrl: null,
      },
    ];

    const content_tr = `# Monochrome Tasarım Manifestosu: %60 Siyah, %30 Bordür ve %10 Vurgu Mimarisi

Yapay zeka araçlarının yaygınlaşmasıyla birlikte arayüz dünyası birbirinin kopyası mor-mavi gradyanlara, anlamsız cam efektlerine (glassmorphism) ve görsel karmaşaya teslim oldu. Tiyatrotist tasarım dili bu gürültüyü reddeder.

![Monochrome İsviçre Tipografi & Izgara Mimarisi](PLACEHOLDER_asset-mono-hero)

## 1. 60-30-10 Renk Disiplini

Monokrom bir arayüz donuk olmak zorunda değildir; aksine doğru kontrast ve hiyerarşi ile son derece keskin ve işlevseldir:
- **%60 Taban Zemin (#0a0a0a):** Gözü yormayan, pikselleri dinlendiren derin siyah boşluk.
- **%30 Yapısal Bordürler & Kartlar (rgba(255,255,255,0.06 - 0.12)):** İçeriği çerçeveleyen, çamurlu gölgeler yerine 1px hassas çizgiler.
- **%10 Tekil Yüksek Kontrastlı Vurgu (#ffffff):** Kullanıcının tıklayacağı butonlar, aktif rozetler ve kritik metinler.

## 2. Canlı Yönetici Arayüzünde Disiplin

Bu kurallar sadece teoride kalmaz, Tiyatrotist'in tüm yönetim ve içerik panellerinde milimetrik olarak uygulanır.

![Tiyatrotist Yönetici Paneli & Tipografik Hiyerarşi](PLACEHOLDER_asset-mono-dashboard-ss)

## 3. Akışkan Hareket ve Dokunsal Geri Bildirim

Doğrusal (linear) animasyonlar yapay hissettirir. Dokunmatik ve tıklama aksiyonlarında fiziksel yay eğrileri (\`cubic-bezier(0.32, 0.72, 0, 1)\`) ve dokunsal geri bildirim (\`active:scale-[0.98]\`) kullanmak dijital bir ürüne zanaat değeri katar.

![Fiziksel Yay Dinamikleri & Dokunsal Geri Bildirim Şeması](PLACEHOLDER_asset-mono-motion-ai)

\`\`\`css
/* Tiyatrotist Dokunsal Buton Dinamiği */
.admin-btn-primary {
  background: #ffffff;
  color: #0a0a0a;
  border-radius: 4px;
  transition: transform 120ms cubic-bezier(0.32, 0.72, 0, 1),
              background 200ms ease;
}
.admin-btn-primary:active {
  transform: scale(0.98);
}
\`\`\`

## 4. Sonuç

Gereksiz süslemeleri çıkardığınızda geriye yalnızca saf düşünce ve kusursuz tipografi kalır.`;

    const content_en = `# The Monochrome Design Manifesto: 60% Black, 30% Border, and 10% Accent Architecture

With the proliferation of generic AI templates, interface design has suffered from homogeneous purple gradients, exaggerated glassmorphism, and visual fatigue. Tiyatrotist rejects this visual noise.

![Monochrome Swiss Typography & Grid Architecture](PLACEHOLDER_asset-mono-hero)

## 1. The 60-30-10 Color Discipline

A monochrome palette is not barren; when calibrated correctly, it provides uncompromising contrast:
- **60% Base (#0a0a0a):** Restful, deep obsidian background.
- **30% Structure & Borders (rgba(255,255,255,0.06 - 0.12)):** Razor-sharp 1px dividers replacing muddy shadows.
- **10% Accent (#ffffff):** Pure white focus points for primary actions.

## 2. Real-World Admin UI Discipline

![Tiyatrotist Admin Panel & Typographic Hierarchy](PLACEHOLDER_asset-mono-dashboard-ss)

## 3. Fluid Physics & Tactile Feedback

Linear animations feel lifeless. Dynamic springs (\`cubic-bezier(0.32, 0.72, 0, 1)\`) and subtle scale feedback (\`active:scale-[0.98]\`) inject craftsmanship into digital software.

![Spring Physics & Tactile Feedback Schematic](PLACEHOLDER_asset-mono-motion-ai)

## 4. Conclusion

Eliminate superficial decor, and what remains is pure typography and deliberate intent.`;

    return {
      id: `draft-mono-${Date.now()}`,
      topic: 'Monochrome Tasarım Sistemi',
      tone: 'Tasarım Felsefesi & Anti-Slop',
      category: 'Design',
      tags: ['Design System', 'Monochrome', 'Typography', 'Craft'],
      targetAudience: 'Tasarımcılar, Ürün Yöneticileri ve Frontend Mühendisleri',
      title_tr: 'Monochrome Tasarım Manifestosu: %60 Siyah, %30 Bordür ve %10 Vurgu Mimarisi',
      title_en: 'The Monochrome Design Manifesto: 60% Black, 30% Border, and 10% Accent Architecture',
      slug: 'monochrome-tasarim-manifestosu-60-30-10-mimarisi',
      excerpt_tr:
        'Yapay zeka şablonlarının görsel gürültüsüne karşı %60 siyah zemin, %30 bordür ve %10 saf beyaz vurgu ilkeleri.',
      excerpt_en:
        'A technical breakdown of the 60-30-10 monochrome design system, rejecting modern UI clichés for stark Swiss typography and tactile micro-interactions.',
      content_tr,
      content_en,
      cover_image: '',
      visualAssets: assets,
      published: false,
      featured: true,
      createdAt: now,
      updatedAt: now,
    };
  }

  // Default: TypeFlow Deep-Dive (or Custom Topic)
  const isCustom = presetId === 'custom' || customTopic.trim().length > 0;
  const mainTopic = isCustom ? customTopic.trim() : 'TypeFlow Mimarisi';

  const assets: VisualAsset[] = [
    {
      id: 'asset-typeflow-hero',
      placeholderToken: 'PLACEHOLDER_asset-typeflow-hero',
      type: 'AI_IMAGE_PROMPT',
      title: isCustom ? `${mainTopic} Mimari Konsept Görseli` : 'TypeFlow Mekanik Daktilo & CRT Terminali',
      context: 'Makale başlığı altındaki devasa hero görsel. Yazının tonunu ve felsefesini tek karede özetler.',
      aspectRatio: '16:9',
      specs: {
        styleEngine: 'Banana 2 / Midjourney v6 / Imagen 3',
        prompt: isCustom
          ? `Editorial architectural isometric wireframe render explaining ${mainTopic}, stark minimalist monochrome aesthetic, matte black obsidian background #0a0a0a, pure white vector highlights, technical schematic blueprints, precision geometry, 8k resolution, cinematic studio lighting --ar 16:9 --style raw`
          : 'High-contrast architectural isometric render of a mechanical typewriter mechanism morphing into a minimalist phosphor CRT terminal screen, matte black obsidian background #0a0a0a, razor-sharp white vector lines, editorial minimalism, Swiss design influence, cinematic studio lighting, 8k --ar 16:9 --style raw',
        negativePrompt: 'colorful, rainbow, blurry, saturated, cartoon, noisy, 3d glossy, watermark',
        aspectRatioHint: '--ar 16:9',
      },
      status: 'pending',
      imageUrl: null,
    },
    {
      id: 'asset-typeflow-interface-ss',
      placeholderToken: 'PLACEHOLDER_asset-typeflow-interface-ss',
      type: 'SCREENSHOT_REQUIRED',
      title: isCustom ? `${mainTopic} Canlı Uygulama Arayüzü` : 'TypeFlow Canlı Yazma Arayüzü ve WPM Ölçer',
      context: '2. Bölüm: Kullanıcının gerçek arayüzü ve performansını gösteren canlı ekran görüntüsü.',
      aspectRatio: '16:9',
      specs: {
        resolution: '1920x1080 (16:9 Desktop)',
        targetInterface: isCustom ? 'Masaüstü Arayüzü' : '/typeflow Oyun Ekranı',
        detailsToCapture: isCustom
          ? 'İlgili özelliğin en kritik ekran görüntüsü. Temiz, yüksek çözünürlüklü ve karanlık mod açık.'
          : 'TypeFlow aktif yazma modu ekranı: WPM göstergesi, doğruluk oranı, daktilo harf dizilimi ve imleç vurgusu net görünmeli.',
      },
      status: 'pending',
      imageUrl: null,
    },
    {
      id: 'asset-typeflow-webaudio-ai',
      placeholderToken: 'PLACEHOLDER_asset-typeflow-webaudio-ai',
      type: 'AI_IMAGE_PROMPT',
      title: isCustom ? `${mainTopic} Veri Akış Şeması` : 'Web Audio Mekanik Akustik Osiloskop Şeması',
      context: '3. Bölüm: Ses dalgalarının ve mekanik tuş vuruşlarının sentetik frekans analizi diyagramı.',
      aspectRatio: '16:9',
      specs: {
        styleEngine: 'Banana 2 / Midjourney v6 / Imagen 3',
        prompt:
          'Futuristic sound wave oscillogram rendered as architectural layered acrylic glass slices, minimalist monochrome technical schematics, high contrast pure white on pitch black #0a0a0a, clean precision vectors, 8k --ar 16:9',
        negativePrompt: 'color, warm tones, blurry, 3d clay',
        aspectRatioHint: '--ar 16:9',
      },
      status: 'pending',
      imageUrl: null,
    },
    {
      id: 'asset-typeflow-leaderboard-ss',
      placeholderToken: 'PLACEHOLDER_asset-typeflow-leaderboard-ss',
      type: 'SCREENSHOT_REQUIRED',
      title: isCustom ? `${mainTopic} Sonuç ve Metrik Tablosu` : 'TypeFlow Global Liderlik Tablosu & Skor Kartı',
      context: '4. Bölüm: Kullanıcıların skorları, analitik metrikleri ve paylaşım kartının ekran görüntüsü.',
      aspectRatio: '16:9',
      specs: {
        resolution: '1920x1080 (16:9 Desktop)',
        targetInterface: isCustom ? 'Analitik / Metrik Paneli' : 'TypeFlow Skor Modalı veya Sıralama Tablosu',
        detailsToCapture:
          'En yüksek 100 skor listesi, kullanıcının WPM derecesi ve doğruluk grafiğinin yer aldığı sonuç paneli.',
      },
      status: 'pending',
      imageUrl: null,
    },
  ];

  const content_tr = `# ${isCustom ? mainTopic : 'TypeFlow Mimarisi: Tarayıcıda Sıfır Gecikmeli Daktilo ve 60 FPS Web Fiziği'}

Modern web geliştirmede yazma testleri ve hız uygulamaları genellikle aşırı ağır DOM ağaçları, hantal kütüphaneler ve gecikmeli ses API'leri ile boğuşur. **TypeFlow**, daktilo yazma deneyimini piksel düzeyinde bir sanat formuna dönüştürmek için sıfırdan inşa edildi.

![${isCustom ? `${mainTopic} Mimari Konsept Görseli` : 'TypeFlow Mekanik Daktilo & CRT Terminali'}](PLACEHOLDER_asset-typeflow-hero)

## 1. Problem: Tarayıcıda Tuş Basma Gecikmesi (Input Lag)

Geleneksel web formlarında bir tuşa bastığınızda işletim sistemi, tarayıcı olay döngüsü (Event Loop), sanal DOM mutasyonu ve stil hesaplaması sırasıyla tetiklenir. Bu durum 16-50 milisaniyelik gözle görülür bir gecikme yaratır.

TypeFlow, standart DOM girdilerini tamamen devre dışı bırakarak doğrudan HTML5 Canvas ve donanım hızlandırmalı WebGL/2D işleme motoru (**DotEngine**) kullanır.

## 2. 60 FPS Doğrudan Tuş İşleme Döngüsü

Kullanıcı arayüzü her karede yalnızca değişen karakter matrisini yeniden çizer:

![${isCustom ? `${mainTopic} Canlı Uygulama Arayüzü` : 'TypeFlow Canlı Yazma Arayüzü ve WPM Ölçer'}](PLACEHOLDER_asset-typeflow-interface-ss)

\`\`\`typescript
export class TypeFlowEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private currentWpm: number = 0;
  private keyBuffer: Array<{ char: string; timestamp: number }> = [];

  public handleKeyDown(e: KeyboardEvent): void {
    const now = performance.now();
    this.keyBuffer.push({ char: e.key, timestamp: now });
    // Anında ses sentezleyicisini tetikle (0ms Event Loop beklemesi)
    this.audioSynthesizer.playKeystroke(e.key);
    this.requestFrameRender();
  }
}
\`\`\`

## 3. Web Audio ile Mekanik Akustik Sentezleme

Ses dosyalarını MP3/WAV olarak yüklemek hem bellek tüketir hem de ağ gecikmesi yaratır. TypeFlow, harici tek bir ses dosyası indirmez; her tuş vuruşunun mekanik sesini Web Audio API'nin osilatör ve filtre düğümleri (Bandpass Filter, Gain Envelope) ile gerçek zamanlı olarak sentezler.

![${isCustom ? `${mainTopic} Veri Akış Şeması` : 'Web Audio Mekanik Akustik Osiloskop Şeması'}](PLACEHOLDER_asset-typeflow-webaudio-ai)

> "Tuşa basıldığında üretilen 'klik' sesi 1200Hz rezonans frekansında 8 milisaniyelik bir darbedir. Daktilonun taşıyıcı geri dönüş sesi ise 420Hz sönümlü bir sinüs dalgasıdır."

## 4. Anti-Cheat ve Deterministik Liderlik Tablosu

Yazma yarışmalarında en yaygın sorun botlardır. TypeFlow, kullanıcının her tuş arasındaki vuruş aralığını (inter-keystroke interval) milisaniye hassasiyetinde kaydeder ve deterministik bir şifreleme zinciriyle doğrular.

![${isCustom ? `${mainTopic} Sonuç ve Metrik Tablosu` : 'TypeFlow Global Liderlik Tablosu & Skor Kartı'}](PLACEHOLDER_asset-typeflow-leaderboard-ss)

## 5. Çıkarılan Dersler ve Sonuç

Web tarayıcısı doğru mimariyle birleştirildiğinde yerel bir masaüstü uygulamasından farksız tepki sürelerine ulaşabilir. TypeFlow, minimalist tasarımın ve saf mühendisliğin bir araya geldiğinde nelerin mümkün olduğunu kanıtlıyor.`;

  const content_en = `# ${isCustom ? mainTopic : 'Inside TypeFlow: Zero-Latency Typewriter Physics and 60 FPS Web Architecture'}

Modern typing interfaces often suffer from sluggish DOM manipulation, heavy frontend dependencies, and audio latency. **TypeFlow** was engineered from scratch to treat typing speed as an uncompromising performance art.

![${isCustom ? `${mainTopic} Architectural Concept` : 'TypeFlow Mechanical Typewriter & CRT Terminal'}](PLACEHOLDER_asset-typeflow-hero)

## 1. The Bottleneck: Browser Input Lag

Traditional inputs undergo multiple event loop ticks, layout recalculations, and repaint cycles before rendering characters. TypeFlow bypasses standard textareas completely, leveraging hardware-accelerated 2D Canvas rendering via **DotEngine**.

## 2. 60 FPS Direct Keystroke Pipeline

![${isCustom ? `${mainTopic} Live Application Interface` : 'TypeFlow Live Typing Interface & WPM Gauge'}](PLACEHOLDER_asset-typeflow-interface-ss)

## 3. Real-Time Acoustic Synthesis via Web Audio API

Instead of loading high-overhead audio files, keystroke acoustics are generated programmatically using oscillator waveforms and bandpass impulse filters.

![${isCustom ? `${mainTopic} Data Flow Schematic` : 'Web Audio Keystroke Acoustic Oscillogram'}](PLACEHOLDER_asset-typeflow-webaudio-ai)

## 4. Anti-Cheat Verification and Leaderboards

![${isCustom ? `${mainTopic} Results & Leaderboard` : 'TypeFlow Global Leaderboard & Score Matrix'}](PLACEHOLDER_asset-typeflow-leaderboard-ss)

## 5. Conclusion

By trimming superfluous runtime abstractions, browser applications can achieve responsiveness indistinguishable from native desktop code.`;

  const title_tr = isCustom
    ? `${mainTopic}: Derinlemesine Mimari ve Teknik İnceleme`
    : 'TypeFlow Mimarisi: Tarayıcıda Sıfır Gecikmeli Daktilo ve 60 FPS Web Fiziği';

  const title_en = isCustom
    ? `${mainTopic}: A Deep Architectural and Engineering Retrospective`
    : 'Inside TypeFlow: Zero-Latency Typewriter Physics and 60 FPS Web Architecture';

  return {
    id: `draft-${Date.now()}`,
    topic: mainTopic,
    tone,
    category,
    tags,
    targetAudience,
    title_tr,
    title_en,
    slug: generateSlug(title_tr),
    excerpt_tr: isCustom
      ? `${mainTopic} hakkında kapsamlı teknik analiz, sistem mimarisi ve görsel uygulama rehberi.`
      : 'Tarayıcıda sıfır gecikmeli daktilo fiziği, Web Audio sentezleyicisi ve anti-cheat liderlik tablosu mimarisi.',
    excerpt_en: isCustom
      ? `A comprehensive technical breakdown and visual case study on ${mainTopic}.`
      : 'A deep architectural dive into TypeFlow: zero-latency typing physics, real-time Web Audio synthesis, and deterministic anti-cheat.',
    content_tr,
    content_en,
    cover_image: '',
    visualAssets: assets,
    published: false,
    featured: true,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Replaces placeholder tokens in markdown with real image URLs as assets become available.
 * If asset is not uploaded yet, leaves the clean placeholder syntax for MarkdownRenderer.
 */
export function syncMarkdownWithAssets(content: string, assets: VisualAsset[]): string {
  let updated = content;
  for (const asset of assets) {
    if (asset.imageUrl && asset.status === 'ready') {
      // Replace PLACEHOLDER_<asset.id> with asset.imageUrl
      const token = asset.placeholderToken;
      updated = updated.split(token).join(asset.imageUrl);
    }
  }
  return updated;
}
