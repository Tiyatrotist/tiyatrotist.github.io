/**
 * TIYATROTIST — Blog Studio Generator & Pipeline Engine
 *
 * Generates long-form, visually structured editorial blog drafts with:
 * 1. Automatic classification of required assets:
 *    - SCREENSHOT_REQUIRED: Specific UI/Feature capture tasks with resolution and context
 *    - AI_IMAGE_PROMPT: Ready-to-copy Banana 2 / Midjourney / Imagen monochrome prompts
 * 2. Markdown synchronization with live uploaded asset URLs.
 * 3. Real Tiyatrotist project presets (E.D.I.T.H, EtapKitap, explorer-terminal, OpenPet, BookOS, Monochrome Design).
 * 4. Multi-domain dynamic custom topic generator with contextual code blocks and Banana 2 prompts.
 * 5. Bilingual content generation (TR & EN).
 */

import { BlogStudioDraft, BlogStudioTopicPreset, VisualAsset } from '@/types/blog-studio';

export const BLOG_STUDIO_PRESETS: BlogStudioTopicPreset[] = [
  {
    id: 'edith-autonomous-agent',
    name: 'E.D.I.T.H: Otonom AI Ajanı & Görev Yürütme Mimarisi',
    badge: 'OTONOM AJAN & AI',
    description: 'Yerel LLM entegrasyonu, Python subprocess sandbox izolasyonu, otonom araç çağırma ve multi-modal iş akışları.',
    category: 'Engineering',
    tags: ['E.D.I.T.H', 'AI Agent', 'Python', 'LLM', 'Automation'],
    tone: 'Otonom Sistemler & AI Mimarisi',
    defaultTitleTr: 'E.D.I.T.H Mimarisi: Yerel Modellerle Çalışan Otonom AI Ajanı ve Güvenli Görev Yürütme',
    defaultTitleEn: 'Inside E.D.I.T.H: Engineering an Autonomous Local AI Agent with Sandboxed Tool Execution',
  },
  {
    id: 'etapkitap-smartboard',
    name: 'EtapKitap: Akıllı Tahtalar İçin C++20 & Qt 6 Motoru',
    badge: 'C++20 & DÜŞÜK GECİKME',
    description: 'Pardus ETAP 23 için 60 FPS donanım hızlandırmalı sayfa oluşturucu ve dokunmatik ekran optimizasyonu.',
    category: 'Engineering',
    tags: ['EtapKitap', 'C++20', 'Qt6', 'Pardus', 'Performance'],
    tone: 'Düşük Seviye Sistem & Performans',
    defaultTitleTr: 'EtapKitap: Pardus ETAP 23 İçin C++20 ve Qt 6 ile Sıfırdan Geliştirilen Kitap Motoru',
    defaultTitleEn: 'EtapKitap: Building a Low-Latency C++20 and Qt 6 Digital Textbook Engine for Smart Boards',
  },
  {
    id: 'explorer-terminal-windhawk',
    name: 'explorer-terminal: Windows Gezgini\'ne Kenetlenen Terminal',
    badge: 'WINDHAWK & WIN32',
    description: 'Windows Dosya Gezgini pencerelerine doğrudan kenetlenen, aktif dizini takip eden C++ Windhawk modu.',
    category: 'Engineering',
    tags: ['explorer-terminal', 'Windhawk', 'C++', 'Windows', 'Hooks'],
    tone: 'Tersine Mühendislik & Win32 Hooking',
    defaultTitleTr: 'explorer-terminal: Windows Dosya Gezgini Pencerelerine Kenetlenen Gerçek Zamanlı Terminal',
    defaultTitleEn: 'Docking a Real-Time Terminal Directly into Windows File Explorer via Windhawk',
  },
  {
    id: 'openpet-desktop-companion',
    name: 'OpenPet: Windows 11 İçin Hafif Masaüstü Yol Arkadaşı',
    badge: 'MASAÜSTÜ & ANİMASYON',
    description: 'Sıfır ek yükle masaüstünde çalışan, durum makineli ve modüler açık kaynaklı sanal pet platformu.',
    category: 'Engineering',
    tags: ['OpenPet', 'Desktop', 'Windows 11', 'Animation', 'TypeScript'],
    tone: 'Masaüstü Mühendisliği & Durum Makineleri',
    defaultTitleTr: 'OpenPet Mimarisi: Windows 11 İçin Sıfır Bellek Yüküyle Çalışan Modüler Masaüstü Yol Arkadaşı',
    defaultTitleEn: 'Engineering OpenPet: A Lightweight, State-Driven Desktop Companion for Windows 11',
  },
  {
    id: 'bookos-virtual-os',
    name: 'BookOS: Tarayıcı İçinde Çalışan Taşınabilir Çalışma Alanı',
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
 * Generates an intelligent, multi-domain draft for arbitrary custom topics
 */
function generateCustomTopicDraft(options: GenerateOptions, now: string): BlogStudioDraft {
  const rawTopic = (options.customTopic || 'Yeni Nesil Sistem Mimarisi').trim();
  const lower = rawTopic.toLowerCase();
  const tone = options.tone || 'Teknik İnceleme & Derin Mimari';
  const category = options.category || 'Engineering';
  const targetAudience = options.targetAudience || 'Kıdemli Mühendisler, Sistem Mimarları ve Geliştiriciler';

  // Domain detection
  let domain: 'ai' | 'systems' | 'web' | 'design' | 'general' = 'general';
  if (/ai|agent|model|llm|yapay zeka|gpt|claude|gemini|nlp|rag|vektör/i.test(lower)) {
    domain = 'ai';
  } else if (/c\+\+|c#|rust|kernel|linux|windows|win32|driver|os|çekirdek|bellek|hafıza|hook|donanım/i.test(lower)) {
    domain = 'systems';
  } else if (/react|next|vue|typescript|javascript|frontend|web|css|html|browser|canvas/i.test(lower)) {
    domain = 'web';
  } else if (/tasarım|design|ux|ui|monochrome|tipografi|slop|arayüz|figma|sanat/i.test(lower)) {
    domain = 'design';
  }

  // Code block selection based on domain
  let codeSnippetTr = '';
  let codeSnippetEn = '';
  let codeLang = 'typescript';

  if (domain === 'ai') {
    codeLang = 'python';
    codeSnippetTr = `import asyncio
from typing import Dict, Any, List

class AgentExecutionEngine:
    """Otonom görev planlama ve güvenli araç yürütme döngüsü."""
    def __init__(self, model_name: str = "local-llama-q4"):
        self.model_name = model_name
        self.context_memory: List[Dict[str, Any]] = []

    async def execute_task(self, prompt: str) -> Dict[str, Any]:
        print(f"[Agent] Görev analiz ediliyor: {prompt[:40]}...")
        # Adım 1: Görevi atomik adımlara böl
        plan = await self._decompose_goals(prompt)
        # Adım 2: Sandbox içinde izole araç yürütme
        results = []
        for step in plan:
            result = await self._run_in_sandbox(step)
            results.append(result)
        return {"status": "success", "executed_steps": len(results)}`;
    codeSnippetEn = `import asyncio
from typing import Dict, Any, List

class AgentExecutionEngine:
    """Autonomous goal decomposition and sandboxed tool dispatch loop."""
    def __init__(self, model_name: str = "local-llama-q4"):
        self.model_name = model_name
        self.context_memory: List[Dict[str, Any]] = []

    async def execute_task(self, prompt: str) -> Dict[str, Any]:
        print(f"[Agent] Decomposing task: {prompt[:40]}...")
        plan = await self._decompose_goals(prompt)
        results = []
        for step in plan:
            result = await self._run_in_sandbox(step)
            results.append(result)
        return {"status": "success", "executed_steps": len(results)}`;
  } else if (domain === 'systems') {
    codeLang = 'cpp';
    codeSnippetTr = `#include <iostream>
#include <memory>
#include <chrono>

// Düşük gecikmeli bellek havuzu ve sıfır tahsisat döngüsü
template <typename T, size_t Capacity>
class MemoryArena {
public:
    T* allocate() noexcept {
        if (m_offset >= Capacity) return nullptr;
        return reinterpret_cast<T*>(&m_storage[m_offset++ * sizeof(T)]);
    }
    void reset() noexcept { m_offset = 0; }
private:
    alignas(alignof(T)) uint8_t m_storage[Capacity * sizeof(T)];
    size_t m_offset = 0;
};`;
    codeSnippetEn = `#include <iostream>
#include <memory>
#include <chrono>

// Zero-allocation buffer pool for predictable real-time throughput
template <typename T, size_t Capacity>
class MemoryArena {
public:
    T* allocate() noexcept {
        if (m_offset >= Capacity) return nullptr;
        return reinterpret_cast<T*>(&m_storage[m_offset++ * sizeof(T)]);
    }
    void reset() noexcept { m_offset = 0; }
private:
    alignas(alignof(T)) uint8_t m_storage[Capacity * sizeof(T)];
    size_t m_offset = 0;
};`;
  } else if (domain === 'design') {
    codeLang = 'css';
    codeSnippetTr = `/* Tiyatrotist Anti-Slop Monochrome Tasarım Sistemi */
:root {
  --canvas-bg: #0a0a0a;         /* %60 Derin Siyah Taban */
  --canvas-border: rgba(255, 255, 255, 0.08); /* %30 Yapısal Çizgi */
  --canvas-card: rgba(255, 255, 255, 0.025);
  --canvas-accent: #ffffff;     /* %10 Saf Beyaz Odak Noktası */
}

.tactile-button {
  background: var(--canvas-accent);
  color: var(--canvas-bg);
  transition: transform 120ms cubic-bezier(0.32, 0.72, 0, 1);
}
.tactile-button:active {
  transform: scale(0.98);
}`;
    codeSnippetEn = `/* Tiyatrotist Anti-Slop Monochrome Design Tokens */
:root {
  --canvas-bg: #0a0a0a;         /* 60% Deep Obsidian Base */
  --canvas-border: rgba(255, 255, 255, 0.08); /* 30% Structural Division */
  --canvas-card: rgba(255, 255, 255, 0.025);
  --canvas-accent: #ffffff;     /* 10% Pure White Focal Accent */
}

.tactile-button {
  background: var(--canvas-accent);
  color: var(--canvas-bg);
  transition: transform 120ms cubic-bezier(0.32, 0.72, 0, 1);
}
.tactile-button:active {
  transform: scale(0.98);
}`;
  } else {
    codeLang = 'typescript';
    codeSnippetTr = `export interface PipelineConfig {
  readonly id: string;
  readonly workerThreads: number;
  readonly maxLatencyMs: number;
}

export class CoreArchitecture {
  private isInitialized = false;

  public async bootstrap(config: PipelineConfig): Promise<void> {
    console.debug('[Core] Initializing subsystem with config:', config.id);
    // Sıfır bloklama ile asenkron olay döngüsü
    await this.mountEngine();
    this.isInitialized = true;
  }
}`;
    codeSnippetEn = `export interface PipelineConfig {
  readonly id: string;
  readonly workerThreads: number;
  readonly maxLatencyMs: number;
}

export class CoreArchitecture {
  private isInitialized = false;

  public async bootstrap(config: PipelineConfig): Promise<void> {
    console.debug('[Core] Initializing subsystem with config:', config.id);
    await this.mountEngine();
    this.isInitialized = true;
  }
}`;
  }

  const assets: VisualAsset[] = [
    {
      id: 'asset-custom-hero',
      placeholderToken: 'PLACEHOLDER_asset-custom-hero',
      type: 'AI_IMAGE_PROMPT',
      title: `${rawTopic} Mimari ve Konsept Diyagramı`,
      context: 'Makale başlığı altındaki açılış hero görseli: konunun felsefesini ve teknik yapısını özetler.',
      aspectRatio: '16:9',
      specs: {
        styleEngine: 'Banana 2 / Midjourney v6 / Imagen 3',
        prompt: `Editorial architectural isometric wireframe render explaining ${rawTopic}, stark minimalist monochrome aesthetic, matte obsidian black background #0a0a0a, razor-sharp pure white vector highlights, precision technical blueprints, mathematical grid overlay, Swiss graphic design influence, high contrast, 8k resolution, cinematic studio lighting --ar 16:9 --style raw`,
        negativePrompt: 'colorful, purple blue gradients, blur, noisy, low resolution, 3d cartoon, text watermark, photorealistic face',
        aspectRatioHint: '--ar 16:9',
      },
      status: 'pending',
      imageUrl: null,
    },
    {
      id: 'asset-custom-interface-ss',
      placeholderToken: 'PLACEHOLDER_asset-custom-interface-ss',
      type: 'SCREENSHOT_REQUIRED',
      title: `${rawTopic} Canlı Uygulama / Arayüz Ekranı`,
      context: '2. Bölüm: Sistemin çalışma anındaki arayüzü, terminali veya kullanıcı kontrol paneli.',
      aspectRatio: '16:9',
      specs: {
        resolution: '1920x1080 (16:9 Desktop)',
        targetInterface: `${rawTopic} Ana Çalışma Arayüzü / Terminal`,
        detailsToCapture:
          'Karanlık mod açıkken, ilgili bileşenin veya komut çıktısının en kritik durumunu gösteren net, yüksek kontrastlı tam ekran kesiti.',
      },
      status: 'pending',
      imageUrl: null,
    },
    {
      id: 'asset-custom-diagram-ai',
      placeholderToken: 'PLACEHOLDER_asset-custom-diagram-ai',
      type: 'AI_IMAGE_PROMPT',
      title: `${rawTopic} Veri Akışı ve Süreç Şeması`,
      context: '3. Bölüm: Bileşenler arası haberleşmeyi ve veri akışını gösteren izometrik şema.',
      aspectRatio: '16:9',
      specs: {
        styleEngine: 'Banana 2 / Midjourney v6 / Imagen 3',
        prompt: `Minimalist technical architectural schematic diagram representing the internal pipeline of ${rawTopic}, branching modular glass nodes, laser-thin connecting trajectories, stark white on deep black background #0a0a0a, high precision vector drawing, brutalist typographic accents --ar 16:9`,
        negativePrompt: 'color, blurry, 3d glossy, messy lines, watermark',
        aspectRatioHint: '--ar 16:9',
      },
      status: 'pending',
      imageUrl: null,
    },
    {
      id: 'asset-custom-benchmark-ss',
      placeholderToken: 'PLACEHOLDER_asset-custom-benchmark-ss',
      type: 'SCREENSHOT_REQUIRED',
      title: `${rawTopic} Doğrulama, Benchmark veya Çıktı Tablosu`,
      context: '4. Bölüm: Performans ölçümleri, konsol logları veya çıktı sonuçlarının ekran görüntüsü.',
      aspectRatio: '16:9',
      specs: {
        resolution: '1920x1080 (16:9 Desktop)',
        targetInterface: `${rawTopic} Benchmark / Analitik Paneli`,
        detailsToCapture:
          'Çalışma süresi, bellek tüketimi, test sonuçları veya metrik grafiğinin net okunduğu panel görünümü.',
      },
      status: 'pending',
      imageUrl: null,
    },
  ];

  const title_tr = `${rawTopic}: Derinlemesine Mimari ve Teknik İnceleme`;
  const title_en = `${rawTopic}: A Deep Architectural and Engineering Retrospective`;

  const content_tr = `# ${title_tr}

Günümüz yazılım dünyasında sistemlerin ölçeklenebilirliği, sürdürülebilirliği ve performansı her zamankinden daha kritik bir hale geldi. **${rawTopic}**, yüzeysel çözümlerin ötesine geçerek temel mühendislik problemlerine sağlam, modüler ve performansı önceleyen bir yanıt üretmek üzere tasarlandı.

![${rawTopic} Mimari ve Konsept Diyagramı](PLACEHOLDER_asset-custom-hero)

## 1. Problem Tanımı ve Mimari Gereksinimler

Karmaşık yazılım sistemlerinde karşılaşılan en büyük engel, gereksiz soyutlama katmanlarının getirdiği işlem maliyeti ve bakım yüküdür. ${rawTopic} ele alınırken şu temel kısıtlar gözetildi:

- **Öngörülebilir Davranış:** Beklenmeyen yan etkilerin ve küresel durum (global state) mutasyonlarının engellenmesi.
- **Düşük Gecikme:** Sistem kaynaklarının optimum kullanımı ve gecikmenin mikro saniye seviyesinde tutulması.
- **Modüler Bağımsızlık:** Her bileşenin tek bir sorumluluğa sahip olması ve kolayca test edilebilmesi.

## 2. Canlı Uygulama ve Arayüz Entegrasyonu

Geliştirilen mimari, gerçek çalışma ortamında test edilmiş ve kullanıcı deneyiminin her adımında pürüzsüz tepki verecek şekilde optimize edilmiştir:

![${rawTopic} Canlı Uygulama / Arayüz Ekranı](PLACEHOLDER_asset-custom-interface-ss)

## 3. Çekirdek Uygulama ve Teknik Kod Mimarisi

Aşağıdaki kod kesiti, sistemin merkezinde yer alan yürütme döngüsünü ve veri akışını özetlemektedir:

\`\`\`${codeLang}
${codeSnippetTr}
\`\`\`

## 4. Veri Akışı ve Süreç Şeması

İç süreçlerin birbiriyle olan bağlantısı ve olay tabanlı haberleşme katmanı, hatasız bir veri tutarlılığı sağlamak üzere izole edilmiştir:

![${rawTopic} Veri Akışı ve Süreç Şeması](PLACEHOLDER_asset-custom-diagram-ai)

> "Mükemmellik, eklenecek bir şey kalmadığında değil; çıkarılacak hiçbir şey kalmadığında elde edilir."

## 5. Doğrulama, Benchmark ve Performans Sonuçları

Uygulanan yöntemler ve mimari optimizasyonlar, sentetik ve gerçek senaryolar altında kapsamlı testlere tabi tutulmuştur:

![${rawTopic} Doğrulama, Benchmark veya Çıktı Tablosu](PLACEHOLDER_asset-custom-benchmark-ss)

## 6. Çıkarılan Dersler ve Sonuç

${rawTopic} projesinde elde edilen kazanımlar, temiz kod disiplini ve tavizsiz bir mimari yaklaşımın uzun vadede ne kadar büyük bir verimlilik sağladığını kanıtlıyor. Önümüzdeki sürümlerde bu altyapıyı daha da ileriye taşımayı hedefliyoruz.`;

  const content_en = `# ${title_en}

In modern software engineering, predictability, low latency, and maintainability are non-negotiable requirements. **${rawTopic}** was architected to eliminate unnecessary abstraction bloat while delivering robust, production-grade performance.

![${rawTopic} Architectural Schematic](PLACEHOLDER_asset-custom-hero)

## 1. Problem Formulation & Constraints

The primary failure mode of contemporary architectures is the creeping accumulation of unmeasured runtime overhead. When architecting ${rawTopic}, three strict engineering tenets guided our decisions:

- **Deterministic Execution:** Eliminating unexpected side-effects and uncontrolled global mutations.
- **Resource Discipline:** Minimizing memory churn and achieving predictable sub-millisecond response latency.
- **Single-Responsibility Boundaries:** Ensuring decoupled subsystems with clear interface boundaries.

## 2. Live Runtime & Interface Integration

The resulting runtime was thoroughly evaluated in real-world scenarios to guarantee tactile, responsive operation:

![${rawTopic} Live Application Interface](PLACEHOLDER_asset-custom-interface-ss)

## 3. Core Implementation & Code Mechanics

The following snippet demonstrates the heart of the execution loop and state synchronization model:

\`\`\`${codeLang}
${codeSnippetEn}
\`\`\`

## 4. Data Flow & Subsystem Schematics

Internal message queues and state transitions are decoupled to prevent cascading failures:

![${rawTopic} Data Flow Schematic](PLACEHOLDER_asset-custom-diagram-ai)

> "Simplicity is prerequisite for reliability."

## 5. Validation, Benchmarks & Measured Throughput

The architecture underwent extensive stress testing across representative workloads:

![${rawTopic} Benchmark & Results Matrix](PLACEHOLDER_asset-custom-benchmark-ss)

## 6. Conclusion & Roadmap

By prioritizing clean foundations over premature complexity, ${rawTopic} establishes a scalable foundation for future enhancements.`;

  return {
    id: `draft-custom-${Date.now()}`,
    topic: rawTopic,
    tone,
    category,
    tags: [category, 'Architecture', 'Engineering'],
    targetAudience,
    title_tr,
    title_en,
    slug: generateSlug(title_tr),
    excerpt_tr: `${rawTopic} hakkında kapsamlı teknik analiz, sistem mimarisi ve görsel uygulama rehberi.`,
    excerpt_en: `A comprehensive technical breakdown and visual case study on ${rawTopic}.`,
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
 * Generates a full structured blog draft with paired visual task cards
 */
export function generateBlogStudioDraft(options: GenerateOptions): BlogStudioDraft {
  const { presetId = 'edith-autonomous-agent' } = options;
  const now = new Date().toISOString();

  // If custom topic is specified or selected
  if (presetId === 'custom' || (options.customTopic && options.customTopic.trim().length > 0)) {
    return generateCustomTopicDraft(options, now);
  }

  // 1. E.D.I.T.H Autonomous Agent
  if (presetId === 'edith-autonomous-agent') {
    const assets: VisualAsset[] = [
      {
        id: 'asset-edith-hero',
        placeholderToken: 'PLACEHOLDER_asset-edith-hero',
        type: 'AI_IMAGE_PROMPT',
        title: 'E.D.I.T.H Otonom Çekirdek ve Yapay Zekâ Şeması',
        context: 'Makale başlığı altında E.D.I.T.H yapay zeka ajanının otonom nöral ağlarını ve araç çağırma katmanını simgeleyen hero görsel.',
        aspectRatio: '16:9',
        specs: {
          styleEngine: 'Banana 2 / Midjourney v6 / Imagen 3',
          prompt:
            'Editorial architectural isometric wireframe render of an advanced autonomous AI agent core, crystalline neural graph network, matte black obsidian background #0a0a0a, pure white vector highlights, fine technical blueprints, mathematical coordinate grid, stark monochrome aesthetic, 8k resolution, cinematic studio lighting --ar 16:9 --style raw',
          negativePrompt: 'colorful, rainbow, blur, noisy, low resolution, 3d cartoon, text watermark',
          aspectRatioHint: '--ar 16:9',
        },
        status: 'pending',
        imageUrl: null,
      },
      {
        id: 'asset-edith-terminal-ss',
        placeholderToken: 'PLACEHOLDER_asset-edith-terminal-ss',
        type: 'SCREENSHOT_REQUIRED',
        title: 'E.D.I.T.H Terminal ve Otonom Araç Çalıştırma Çıktısı',
        context: '2. Bölüm: E.D.I.T.H ajanının komut satırında araç çağrısı ve sandbox çalıştırması yaptığı canlı ekran görüntüsü.',
        aspectRatio: '16:9',
        specs: {
          resolution: '1920x1080 (16:9 Desktop)',
          targetInterface: 'E.D.I.T.H CLI / Terminal Penceresi',
          detailsToCapture:
            'Ajanın bir görevi planlayıp sistem araçlarını (dosya okuma, komut çalıştırma) çağırdığı terminal çıktısı. Monokrom karanlık mod ve okunaklı yazı tipi.',
        },
        status: 'pending',
        imageUrl: null,
      },
      {
        id: 'asset-edith-architecture-ai',
        placeholderToken: 'PLACEHOLDER_asset-edith-architecture-ai',
        type: 'AI_IMAGE_PROMPT',
        title: 'Ajan Belleği ve Araç Dağıtım Şeması',
        context: '3. Bölüm: Yerel LLM, vektör hafızası ve sandbox araç yöneticisi arasındaki veri akışı şeması.',
        aspectRatio: '16:9',
        specs: {
          styleEngine: 'Banana 2 / Midjourney v6 / Imagen 3',
          prompt:
            'Minimalist technical architectural schematic diagram of an autonomous agent architecture, memory buffer nodes connected by laser paths, isolated tool sandbox cylinder, monochrome white lines on pitch black canvas #0a0a0a, high precision vector drawing --ar 16:9',
          negativePrompt: 'color, blurry, 3d glossy, messy lines',
          aspectRatioHint: '--ar 16:9',
        },
        status: 'pending',
        imageUrl: null,
      },
      {
        id: 'asset-edith-benchmark-ss',
        placeholderToken: 'PLACEHOLDER_asset-edith-benchmark-ss',
        type: 'SCREENSHOT_REQUIRED',
        title: 'Yerel Model Yanıt Süresi ve Token/Sn Benchmarkı',
        context: '4. Bölüm: Yerel modelin çıkarım hızı ve kaynak tüketim metrikleri.',
        aspectRatio: '16:9',
        specs: {
          resolution: '1920x1080 (16:9 Desktop)',
          targetInterface: 'Benchmark Konsolu / Sistem Monitörü',
          detailsToCapture:
            'GPU/CPU bellek kullanımı, ilk token süresi (TTFT) ve görev tamamlama başarı grafiği.',
        },
        status: 'pending',
        imageUrl: null,
      },
    ];

    const content_tr = `# E.D.I.T.H Mimarisi: Yerel Modellerle Çalışan Otonom AI Ajanı ve Güvenli Görev Yürütme

Bulut tabanlı yapay zekâ asistanları veri gizliliği, yüksek gecikme ve katı API sınırları gibi kısıtlamalarla karşı karşıyadır. **E.D.I.T.H**, tamamen yerel modeller üzerinde çalışan, bağımsız araç çağırma yeteneğine sahip açık kaynaklı bir otonom yapay zekâ ajanı olarak inşa edildi.

![E.D.I.T.H Otonom Çekirdek ve Yapay Zekâ Şeması](PLACEHOLDER_asset-edith-hero)

## 1. Neden Yerel ve Bağımsız Bir Ajan?

Geliştiricilerin kod tabanlarını veya özel belgelerini harici bulut sunucularına göndermeden yerel donanımda çalıştırması kritik bir güvenlik kuralıdır. E.D.I.T.H şu temel prensipler etrafında yapılandırıldı:
- **Tam Veri Egemenliği:** Tüm akıl yürütme yerel donanımda (Ollama / Llama.cpp) gerçekleşir.
- **Güvenli Sandbox Yürütmesi:** Ajanın çalıştırdığı terminal komutları ve dosya işlemleri izole alt süreçlerde denetlenir.
- **Deterministik Planlama:** Karmaşık hedefler küçük, doğrulanabilir atomik adımlara bölünür.

## 2. Terminal Ortamı ve Otonom Araç Yürütme

E.D.I.T.H, kullanıcının verdiği doğal dil komutunu önce bir planlama aşamasına sokar; ardından gereken araçları çağırır:

![E.D.I.T.H Terminal ve Otonom Araç Çalıştırma Çıktısı](PLACEHOLDER_asset-edith-terminal-ss)

Aşağıdaki Python kodu, ajanın araç çağırma ve subprocess sandbox döngüsünü özetlemektedir:

\`\`\`python
import asyncio
from typing import Dict, Any, List

class EdithExecutionLoop:
    def __init__(self, model_endpoint: str = "http://localhost:11434"):
        self.endpoint = model_endpoint
        self.memory_buffer: List[Dict[str, str]] = []

    async def run_step(self, user_goal: str) -> Dict[str, Any]:
        # 1. Yerel modelden plan ve araç çağrısı talep et
        tool_call = await self._query_local_model(user_goal)
        # 2. Güvenlik filtresinden geçir ve izole süreçte çalıştır
        if self._is_safe_command(tool_call.command):
            output = await self._dispatch_sandbox(tool_call)
            return {"status": "success", "output": output}
        return {"status": "denied", "reason": "Security policy violation"}
\`\`\`

## 3. Bellek Mimarisi ve Araç Dağıtımı

Ajanın geçmiş konuşmaları ve araç çıktısını tutan bellek modülü, bağlam penceresini (context window) gereksiz yüklerden arındıracak biçimde özetleme stratejisi kullanır.

![Ajan Belleği ve Araç Dağıtım Şeması](PLACEHOLDER_asset-edith-architecture-ai)

## 4. Performans ve Yerel Model Benchmarkları

E.D.I.T.H, 8-bit ve 4-bit kuantize edilmiş modeller üzerinde test edilmiş; düşük donanımlı sistemlerde bile yüksek token/saniye oranlarına ulaşmıştır.

![Yerel Model Yanıt Süresi ve Token/Sn Benchmarkı](PLACEHOLDER_asset-edith-benchmark-ss)

## 5. Sonuç

E.D.I.T.H, açık kaynaklı yerel modellerin doğru bir araç orkestrasyonuyla ticari bulut çözümlerine nasıl güçlü bir alternatif olabileceğini göstermektedir.`;

    const content_en = `# Inside E.D.I.T.H: Engineering an Autonomous Local AI Agent with Sandboxed Tool Execution

Cloud-dependent AI services impose privacy liabilities, network latency, and rigid API rate limits. **E.D.I.T.H** was engineered from scratch as an open-source, local-first autonomous AI framework running directly on user hardware.

![E.D.I.T.H Autonomous Core Schematic](PLACEHOLDER_asset-edith-hero)

## 1. Why a Local-First Autonomous Agent?

Developers should never have to export proprietary codebases to remote LLM endpoints. E.D.I.T.H enforces:
- **Zero Remote Leakage:** Reasoning executes locally via Ollama / Llama.cpp.
- **Sandboxed Subprocess Isolation:** Shell and filesystem commands run within permission-checked boundaries.
- **Deterministic Multi-Step Planning:** Complex goals decompose into verifiable atomic actions.

## 2. CLI Execution & Tool Dispatch

![E.D.I.T.H Terminal Output & Tool Dispatch](PLACEHOLDER_asset-edith-terminal-ss)

\`\`\`python
import asyncio
from typing import Dict, Any, List

class EdithExecutionLoop:
    def __init__(self, model_endpoint: str = "http://localhost:11434"):
        self.endpoint = model_endpoint
        self.memory_buffer: List[Dict[str, str]] = []

    async def run_step(self, user_goal: str) -> Dict[str, Any]:
        tool_call = await self._query_local_model(user_goal)
        if self._is_safe_command(tool_call.command):
            output = await self._dispatch_sandbox(tool_call)
            return {"status": "success", "output": output}
        return {"status": "denied", "reason": "Security policy violation"}
\`\`\`

## 3. Memory & Architecture Pipeline

![Agent Memory & Tool Distribution Schematic](PLACEHOLDER_asset-edith-architecture-ai)

## 4. Measured Benchmarks & Token Throughput

![Local Model Inference Speed & Benchmark](PLACEHOLDER_asset-edith-benchmark-ss)

## 5. Conclusion

By pairing local quantized models with strict subprocess sandboxing, E.D.I.T.H offers a resilient, private alternative to commercial clouds.`;

    return {
      id: `draft-edith-${Date.now()}`,
      topic: 'E.D.I.T.H Otonom AI Ajanı',
      tone: 'Otonom Sistemler & AI Mimarisi',
      category: 'Engineering',
      tags: ['E.D.I.T.H', 'AI Agent', 'Python', 'LLM', 'Automation'],
      targetAudience: 'Yapay Zekâ Mühendisleri ve Sistem Geliştiricileri',
      title_tr: 'E.D.I.T.H Mimarisi: Yerel Modellerle Çalışan Otonom AI Ajanı ve Güvenli Görev Yürütme',
      title_en: 'Inside E.D.I.T.H: Engineering an Autonomous Local AI Agent with Sandboxed Tool Execution',
      slug: 'edith-mimarisi-yerel-modellerle-otonom-ai-ajani',
      excerpt_tr:
        'Tamamen yerel LLM modelleriyle çalışan, güvenli subprocess sandbox izolasyonuna sahip açık kaynaklı yapay zeka ajanı E.D.I.T.H mimarisi.',
      excerpt_en:
        'A deep architectural dive into E.D.I.T.H, an open-source local autonomous AI agent with sandboxed tool execution and zero cloud leakage.',
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

  // 2. EtapKitap: Akıllı Tahtalar İçin C++20 & Qt 6 Motoru
  if (presetId === 'etapkitap-smartboard') {
    const assets: VisualAsset[] = [
      {
        id: 'asset-etap-hero',
        placeholderToken: 'PLACEHOLDER_asset-etap-hero',
        type: 'AI_IMAGE_PROMPT',
        title: 'EtapKitap Çekirdek ve Vektör Motoru Şeması',
        context: 'Makale başlığı altında, C++20 motorunu ve Pardus ETAP akıllı tahta ekranını simgeleyen teknik hero görsel.',
        aspectRatio: '16:9',
        specs: {
          styleEngine: 'Banana 2 / Midjourney v6 / Imagen 3',
          prompt:
            'Editorial architectural isometric wireframe render of a high-performance vector textbook engine, digital classroom smart board interface, obsidian dark canvas #0a0a0a, pure white laser lines, precision typography, 8k --ar 16:9 --style raw',
          negativePrompt: 'colorful, rainbow, blur, noisy, low resolution, 3d cartoon',
          aspectRatioHint: '--ar 16:9',
        },
        status: 'pending',
        imageUrl: null,
      },
      {
        id: 'asset-etap-smartboard-ss',
        placeholderToken: 'PLACEHOLDER_asset-etap-smartboard-ss',
        type: 'SCREENSHOT_REQUIRED',
        title: 'EtapKitap Canlı Ders Kitabı ve Kalem Araç Çubuğu',
        context: '2. Bölüm: Pardus ETAP 23 üzerinde çalışan EtapKitap arayüzü ve çizim araçları.',
        aspectRatio: '16:9',
        specs: {
          resolution: '1920x1080 (16:9 Desktop)',
          targetInterface: 'EtapKitap Tam Ekran Görünümü',
          detailsToCapture:
            'Açık bir ders kitabı sayfası, alttaki dokunmatik araç çubuğu (kalem, silgi, cetvel) ve 60 FPS akıcı çizim modu.',
        },
        status: 'pending',
        imageUrl: null,
      },
      {
        id: 'asset-etap-cache-ai',
        placeholderToken: 'PLACEHOLDER_asset-etap-cache-ai',
        type: 'AI_IMAGE_PROMPT',
        title: 'Düşük Gecikmeli Sayfa Önizleme ve Önbellek Mimarisi',
        context: '3. Bölüm: C++20 bellek havuzu ve Qt 6 render hattı akış şeması.',
        aspectRatio: '16:9',
        specs: {
          styleEngine: 'Banana 2 / Midjourney v6 / Imagen 3',
          prompt:
            'Minimalist technical schematic diagram of a low-latency memory page cache and rendering pipeline, sleek geometric blocks, high contrast monochrome white lines on pitch black canvas #0a0a0a --ar 16:9',
          negativePrompt: 'colors, blurry, watermark',
          aspectRatioHint: '--ar 16:9',
        },
        status: 'pending',
        imageUrl: null,
      },
    ];

    const content_tr = `# EtapKitap: Pardus ETAP 23 İçin C++20 ve Qt 6 ile Sıfırdan Geliştirilen Kitap Motoru

Sınıf ortamlarında kullanılan akıllı tahtalar donanım olarak sınırlı kaynaklara sahiptir. Ağır web tabanlı veya Electron tabanlı çözümler dokunmatik ekranlarda gecikmelere (lag) yol açar. **EtapKitap**, Pardus ETAP 23 için saf C++20 ve Qt 6 ile geliştirilmiş, sıfır gecikmeli dijital ders kitabı motorudur.

![EtapKitap Çekirdek ve Vektör Motoru Şeması](PLACEHOLDER_asset-etap-hero)

## 1. Neden Yerel C++20 ve Qt 6?

- **Sıfır Web Motoru Yükü:** Chromium veya WebKit çalıştırmadan doğrudan yerel GPU hızlandırması.
- **Düşük Gecikmeli Dokunmatik Çizim:** Kalem girdisi ile ekran pikseli arasındaki gecikmenin 8ms altına düşürülmesi.
- **Minimal Bellek Ayak İzi:** 1000 sayfalık bir ders kitabını 50MB RAM içinde akıcı biçimde yönetebilme.

![EtapKitap Canlı Ders Kitabı ve Kalem Araç Çubuğu](PLACEHOLDER_asset-etap-smartboard-ss)

\`\`\`cpp
#include <QPainter>
#include <QQuickPaintedItem>

class EtapPageRenderer : public QQuickPaintedItem {
    Q_OBJECT
public:
    void paint(QPainter* painter) override {
        painter->setRenderHint(QPainter::Antialiasing, true);
        painter->setRenderHint(QPainter::SmoothPixmapTransform, true);
        // Donanım hızlandırmalı sayfa tamponunu çiz
        m_pageCache.renderVisibleRect(painter, boundingRect().toRect());
    }
private:
    PageBufferPool m_pageCache;
};
\`\`\`

## 2. Sayfa Önbellekleme ve Bellek Havuzu

![Düşük Gecikmeli Sayfa Önizleme ve Önbellek Mimarisi](PLACEHOLDER_asset-etap-cache-ai)

## 3. Sonuç

EtapKitap, eğitim teknolojilerinde yerel yazılım mühendisliğinin getirdiği hız farkını somut olarak kanıtlamaktadır.`;

    const content_en = `# EtapKitap: Building a Low-Latency C++20 and Qt 6 Digital Textbook Engine for Smart Boards

Smart classroom boards often operate under constrained hardware profiles. Heavy Electron-based tools struggle with touch latency. **EtapKitap** is an uncompromising native C++20 & Qt 6 engine engineered specifically for Pardus ETAP 23 Linux smart boards.

![EtapKitap Vector Engine Schematic](PLACEHOLDER_asset-etap-hero)

## 1. Architecture Highlights

- **Zero Web Runtime Overhead:** Bypasses Chromium entirely to interact directly with hardware graphics pipelines.
- **Sub-8ms Pen Latency:** Near-instant touch response for fluid freehand stylus annotations.
- **Ultra-lightweight RAM Footprint:** Renders 1000-page high-resolution textbooks within 50MB of memory.

![EtapKitap Live Textbook Interface](PLACEHOLDER_asset-etap-smartboard-ss)

\`\`\`cpp
#include <QPainter>
#include <QQuickPaintedItem>

class EtapPageRenderer : public QQuickPaintedItem {
    Q_OBJECT
public:
    void paint(QPainter* painter) override {
        painter->setRenderHint(QPainter::Antialiasing, true);
        m_pageCache.renderVisibleRect(painter, boundingRect().toRect());
    }
private:
    PageBufferPool m_pageCache;
};
\`\`\`

## 2. Memory Pooling & Cache Pipeline

![Low Latency Page Cache Schematic](PLACEHOLDER_asset-etap-cache-ai)

## 3. Conclusion

Native systems engineering remains essential when crafting software for classroom environments.`;

    return {
      id: `draft-etap-${Date.now()}`,
      topic: 'EtapKitap C++20 Kitap Motoru',
      tone: 'Düşük Seviye Sistem & Performans',
      category: 'Engineering',
      tags: ['EtapKitap', 'C++20', 'Qt6', 'Pardus', 'Performance'],
      targetAudience: 'Sistem Programcıları ve Eğitim Teknolojisi Mühendisleri',
      title_tr: 'EtapKitap: Pardus ETAP 23 İçin C++20 ve Qt 6 ile Sıfırdan Geliştirilen Kitap Motoru',
      title_en: 'EtapKitap: Building a Low-Latency C++20 and Qt 6 Digital Textbook Engine for Smart Boards',
      slug: 'etapkitap-akilli-tahtalar-icin-cpp20-qt6-kitap-motoru',
      excerpt_tr:
        'Pardus ETAP 23 akıllı tahtalarında dokunmatik gecikmeyi sıfırlayan, C++20 ve Qt 6 ile geliştirilmiş yerel kitap motoru.',
      excerpt_en:
        'Engineering a high-performance native C++20 and Qt 6 textbook engine for Pardus ETAP 23 smart boards with zero web runtime bloat.',
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

  // 3. explorer-terminal: Windows Gezgini'ne Kenetlenen Terminal
  if (presetId === 'explorer-terminal-windhawk') {
    const assets: VisualAsset[] = [
      {
        id: 'asset-expterm-hero',
        placeholderToken: 'PLACEHOLDER_asset-expterm-hero',
        type: 'AI_IMAGE_PROMPT',
        title: 'explorer-terminal Win32 Hook ve Kenetlenme Mimarisi',
        context: 'Windows Dosya Gezgini penceresine entegre terminal mimarisini simgeleyen teknik hero.',
        aspectRatio: '16:9',
        specs: {
          styleEngine: 'Banana 2 / Midjourney v6 / Imagen 3',
          prompt:
            'Editorial architectural isometric wireframe of a translucent file browser window split with an embedded command-line terminal, glowing text matrix, matte black background #0a0a0a, pure white vector highlights, precision technical schematic --ar 16:9 --style raw',
          negativePrompt: 'color, blur, 3d glossy, noisy',
          aspectRatioHint: '--ar 16:9',
        },
        status: 'pending',
        imageUrl: null,
      },
      {
        id: 'asset-expterm-docked-ss',
        placeholderToken: 'PLACEHOLDER_asset-expterm-docked-ss',
        type: 'SCREENSHOT_REQUIRED',
        title: 'Dosya Gezgini İçinde Canlı Kenetlenmiş Terminal',
        context: 'Windows 11 Dosya Gezgini penceresinin altında terminalin açık olduğu canlı an.',
        aspectRatio: '16:9',
        specs: {
          resolution: '1920x1080 (16:9 Desktop)',
          targetInterface: 'Windows 11 Dosya Gezgini Penceresi',
          detailsToCapture:
            'Gezginde bir klasör açıkken alt panelde kenetlenmiş terminal, "git status" komutu ve geçerli dizin eşitlemesi.',
        },
        status: 'pending',
        imageUrl: null,
      },
    ];

    const content_tr = `# explorer-terminal: Windows Dosya Gezgini Pencerelerine Kenetlenen Gerçek Zamanlı Terminal

Geliştiricilerin dosya sisteminde gezinirken sürekli ayrı bir terminal penceresi açıp ` + '`cd`' + ` komutuyla dizine gitmesi ciddi bir zaman kaybıdır. **explorer-terminal**, Windhawk mod altyapısını kullanarak Windows Dosya Gezgini penceresine doğrudan kenetlenen bir terminal çözümü sunar.

![explorer-terminal Win32 Hook ve Kenetlenme Mimarisi](PLACEHOLDER_asset-expterm-hero)

## 1. Win32 Hooking ve Pencere Hiyerarşisi

Windows Dosya Gezgini (cabinetwndc), pencerelerini DirectUI ve WinUI bileşenleri üzerinden yönetir. explorer-terminal, pencere oluşturma olaylarını hook'layarak alt bölgeye özel bir ConPTY veya Windows Terminal oturumu iliştirir.

![Dosya Gezgini İçinde Canlı Kenetlenmiş Terminal](PLACEHOLDER_asset-expterm-docked-ss)

\`\`\`cpp
// explorer-terminal Win32 pencere kenetleme mantığı
void DockTerminalToExplorer(HWND hExplorerWnd) {
    RECT explorerRect;
    GetClientRect(hExplorerWnd, &explorerRect);
    int terminalHeight = 240; // Piksel cinsinden kenetleme yüksekliği
    
    HWND hTerminalWnd = CreateConPtyWindow(hExplorerWnd);
    SetWindowPos(hTerminalWnd, nullptr, 
                 0, explorerRect.bottom - terminalHeight,
                 explorerRect.right, terminalHeight, 
                 SWP_SHOWWINDOW | SWP_NOACTIVATE);
}
\`\`\`

## 2. Otomatik Dizin Eşitleme

Kullanıcı Gezgin içinde bir klasöre tıkladığında IShellBrowser arayüzü dinlenir ve terminal oturumuna otomatik olarak dizin güncellemesi gönderilir.`;

    const content_en = `# Docking a Real-Time Terminal Directly into Windows File Explorer via Windhawk

Context switching between Windows File Explorer and standalone terminal windows is a perennial developer friction. **explorer-terminal** injects a persistent, directory-synchronized terminal directly into the Explorer window frame.

![explorer-terminal Hooking Architecture](PLACEHOLDER_asset-expterm-hero)

## 1. Win32 Window Hierarchy & Injection

![Docked Terminal Interface in Windows 11](PLACEHOLDER_asset-expterm-docked-ss)

\`\`\`cpp
void DockTerminalToExplorer(HWND hExplorerWnd) {
    RECT explorerRect;
    GetClientRect(hExplorerWnd, &explorerRect);
    int terminalHeight = 240;
    
    HWND hTerminalWnd = CreateConPtyWindow(hExplorerWnd);
    SetWindowPos(hTerminalWnd, nullptr, 
                 0, explorerRect.bottom - terminalHeight,
                 explorerRect.right, terminalHeight, 
                 SWP_SHOWWINDOW | SWP_NOACTIVATE);
}
\`\`\``;

    return {
      id: `draft-expterm-${Date.now()}`,
      topic: 'explorer-terminal',
      tone: 'Tersine Mühendislik & Win32 Hooking',
      category: 'Engineering',
      tags: ['explorer-terminal', 'Windhawk', 'C++', 'Windows', 'Hooks'],
      targetAudience: 'Windows Geliştiricileri ve Sistem Mühendisleri',
      title_tr: 'explorer-terminal: Windows Dosya Gezgini Pencerelerine Kenetlenen Gerçek Zamanlı Terminal',
      title_en: 'Docking a Real-Time Terminal Directly into Windows File Explorer via Windhawk',
      slug: 'windows-dosya-gezginine-kenetlenen-terminal',
      excerpt_tr:
        'Windows Dosya Gezgini pencerelerine doğrudan kenetlenen, aktif dizini otomatik takip eden C++ Windhawk modu.',
      excerpt_en:
        'A native Windhawk mod embedding a fully functional terminal dock into Windows File Explorer with automatic working directory tracking.',
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

  // 4. OpenPet: Windows 11 İçin Hafif Masaüstü Yol Arkadaşı
  if (presetId === 'openpet-desktop-companion') {
    const assets: VisualAsset[] = [
      {
        id: 'asset-openpet-hero',
        placeholderToken: 'PLACEHOLDER_asset-openpet-hero',
        type: 'AI_IMAGE_PROMPT',
        title: 'OpenPet Masaüstü Durum Makinesi Şeması',
        context: 'Windows 11 masaüstünde yaşayan piksel sanatı yol arkadaşını ve durum makinesini simgeleyen hero.',
        aspectRatio: '16:9',
        specs: {
          styleEngine: 'Banana 2 / Midjourney v6 / Imagen 3',
          prompt:
            'Minimalist technical isometric wireframe of a desktop companion virtual pet floating over Windows 11 taskbar, geometric wireframe character, obsidian background #0a0a0a, pure white laser lines --ar 16:9',
          negativePrompt: 'color, blur, 3d glossy, messy',
          aspectRatioHint: '--ar 16:9',
        },
        status: 'pending',
        imageUrl: null,
      },
      {
        id: 'asset-openpet-desktop-ss',
        placeholderToken: 'PLACEHOLDER_asset-openpet-desktop-ss',
        type: 'SCREENSHOT_REQUIRED',
        title: 'OpenPet Masaüstü Etkileşim Anı',
        context: 'Windows masaüstünde serbestçe gezinen OpenPet karakteri ve sağ tık bağlam menüsü.',
        aspectRatio: '16:9',
        specs: {
          resolution: '1920x1080 (16:9 Desktop)',
          targetInterface: 'Windows 11 Masaüstü',
          detailsToCapture:
            'Masaüstünün sağ alt köşesinde veya pencere kenarında duran OpenPet karakteri, pürüzsüz şeffaflık ve sıfır arka plan taşması.',
        },
        status: 'pending',
        imageUrl: null,
      },
    ];

    const content_tr = `# OpenPet Mimarisi: Windows 11 İçin Sıfır Bellek Yüküyle Çalışan Modüler Masaüstü Yol Arkadaşı

Masaüstü uygulamaları günümüzde genellikle yüzlerce megabaytlık Electron paketleriyle gelir. **OpenPet**, Windows 11 üzerinde neredeyse sıfır bellek tüketimiyle (15MB altı) çalışan, modüler animasyon durum makinelerine sahip açık kaynaklı bir masaüstü yol arkadaşıdır.

![OpenPet Masaüstü Durum Makinesi Şeması](PLACEHOLDER_asset-openpet-hero)

## 1. Şeffaf Pencere ve Katmanlı Çizim

![OpenPet Masaüstü Etkileşim Anı](PLACEHOLDER_asset-openpet-desktop-ss)

\`\`\`typescript
export interface PetState {
  name: 'idle' | 'walking' | 'sleeping' | 'curious';
  frameIndex: number;
  durationMs: number;
}

export class AnimationStateMachine {
  private currentState: PetState = { name: 'idle', frameIndex: 0, durationMs: 2000 };

  public transition(trigger: 'mouseNear' | 'idleTimeout' | 'click'): void {
    if (trigger === 'mouseNear') {
      this.currentState = { name: 'curious', frameIndex: 0, durationMs: 1200 };
    }
  }
}
\`\`\``;

    const content_en = `# Engineering OpenPet: A Lightweight, State-Driven Desktop Companion for Windows 11

**OpenPet** is a lightweight desktop companion engineered for Windows 11 with modular animation state machines and native OS integration.

![OpenPet State Machine](PLACEHOLDER_asset-openpet-hero)

## 1. Layered Alpha Composition

![OpenPet Desktop Interaction](PLACEHOLDER_asset-openpet-desktop-ss)`;

    return {
      id: `draft-openpet-${Date.now()}`,
      topic: 'OpenPet Masaüstü Yol Arkadaşı',
      tone: 'Masaüstü Mühendisliği & Durum Makineleri',
      category: 'Engineering',
      tags: ['OpenPet', 'Desktop', 'Windows 11', 'Animation', 'TypeScript'],
      targetAudience: 'Yazılım Geliştiricileri ve Arayüz Tasarımcıları',
      title_tr: 'OpenPet Mimarisi: Windows 11 İçin Sıfır Bellek Yüküyle Çalışan Modüler Masaüstü Yol Arkadaşı',
      title_en: 'Engineering OpenPet: A Lightweight, State-Driven Desktop Companion for Windows 11',
      slug: 'openpet-windows-icin-hafif-masaustu-yol-arkadasi',
      excerpt_tr:
        'Windows 11 için 15MB altı bellek tüketimiyle çalışan, modüler durum makineli açık kaynaklı masaüstü yol arkadaşı.',
      excerpt_en:
        'A lightweight desktop companion engineered for Windows 11 with modular animation state machines and minimal system footprint.',
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

  // 5. BookOS: Tarayıcı İçinde Çalışan Taşınabilir Çalışma Alanı
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
    ];

    const content_tr = `# BookOS: Web Tarayıcısında Sıfır Bağımlılıkla Çalışan Taşınabilir İşletim Sistemi

Modern web uygulamaları genellikle sunucu tarafı hesaplamalara aşırı bağımlı hale geldi. **BookOS**, bu paradigmayı tersine çevirerek tarayıcıyı yalnızca bir görüntüleyici değil; tam teşekküllü, yerel öncelikli (local-first) bir hesaplama ortamı olarak yeniden tasarlar.

![BookOS Çekirdek & Sanal Bellek Şeması](PLACEHOLDER_asset-bookos-hero)

## 1. Neden Tarayıcıda Bir İşletim Sistemi?

- **Sıfır Sunucu Bağımlılığı:** Tüm sistem durumu yerel IndexedDB ve Origin Private File System (OPFS) üzerinde saklanır.
- **Hafif Bellek İzi:** 60 FPS animasyonlar ve mikro saniyelik komut tepkileri.
- **İzole Edilmiş Çalıştırma Katmanı:** Web Worker tabanlı süreç yöneticisi.

![BookOS Masaüstü ve Çoklu Pencere Arayüzü](PLACEHOLDER_asset-bookos-desktop-ss)

\`\`\`typescript
interface WindowState {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
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

## 2. Sanal Dosya Sistemi (VFS) Mimarisi

![Sanal Dosya Sistemi (VFS) Hiyerarşi Şeması](PLACEHOLDER_asset-bookos-vfs-ai)

> "Dosyalarınız hiçbir uzak sunucuya gönderilmez. Bilgisayarınızın kendi diskinde, tarayıcınızın güvenli depolama sandbox'ında barındırılır."`;

    const content_en = `# BookOS: A Portable, Local-First Operating System Running in the Browser

**BookOS** reimagines the browser not merely as a presentation viewport, but as a fully capable, local-first computing environment.

![BookOS Kernel Schematic](PLACEHOLDER_asset-bookos-hero)

## 1. Architecture

- **Zero Server Dependency:** State persists entirely in IndexedDB and Origin Private File System (OPFS).
- **Ultralight Memory Footprint:** 60 FPS transitions and sub-millisecond command dispatching.

![BookOS Desktop Interface](PLACEHOLDER_asset-bookos-desktop-ss)

## 2. Virtual File System (VFS)

![Virtual File System (VFS) Hierarchy Schematic](PLACEHOLDER_asset-bookos-vfs-ai)`;

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

  // 6. Monochrome Design Craft
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

![Tiyatrotist Yönetici Paneli & Tipografik Hiyerarşi](PLACEHOLDER_asset-mono-dashboard-ss)

## 3. Akışkan Hareket ve Dokunsal Geri Bildirim

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

![Fiziksel Yay Dinamikleri & Dokunsal Geri Bildirim Şeması](PLACEHOLDER_asset-mono-motion-ai)

## 4. Sonuç

Gereksiz süslemeleri çıkardığınızda geriye yalnızca saf düşünce ve kusursuz tipografi kalır.`;

    const content_en = `# The Monochrome Design Manifesto: 60% Black, 30% Border, and 10% Accent Architecture

With the proliferation of generic AI templates, interface design has suffered from homogeneous purple gradients, exaggerated glassmorphism, and visual fatigue. Tiyatrotist rejects this visual noise.

![Monochrome Swiss Typography & Grid Architecture](PLACEHOLDER_asset-mono-hero)

## 1. The 60-30-10 Color Discipline

- **60% Base (#0a0a0a):** Restful, deep obsidian background.
- **30% Structure & Borders (rgba(255,255,255,0.06 - 0.12)):** Razor-sharp 1px dividers replacing muddy shadows.
- **10% Accent (#ffffff):** Pure white focus points for primary actions.

![Tiyatrotist Admin Panel & Typographic Hierarchy](PLACEHOLDER_asset-mono-dashboard-ss)

## 2. Fluid Physics & Tactile Feedback

![Spring Physics & Tactile Feedback Schematic](PLACEHOLDER_asset-mono-motion-ai)

## 3. Conclusion

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

  // Fallback to custom generator
  return generateCustomTopicDraft(options, now);
}

/**
 * Replaces placeholder tokens in markdown with real image URLs as assets become available.
 * If asset is not uploaded yet, leaves the clean placeholder syntax for MarkdownRenderer.
 */
export function syncMarkdownWithAssets(content: string, assets: VisualAsset[]): string {
  let updated = content;
  for (const asset of assets) {
    if (asset.imageUrl && asset.status === 'ready') {
      const token = asset.placeholderToken;
      updated = updated.split(token).join(asset.imageUrl);
    }
  }
  return updated;
}
