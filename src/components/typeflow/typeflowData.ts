/**
 * TYPEFLOW — Word Banks, Narrative Stories & Dev/CLI Commands Data Repository
 * Provides rich, balanced, culturally authentic datasets for Turkish & English languages.
 */

import { DevCategory, StoryGenre } from './types';

// ─── 1. COMMON FREQUENT WORDS ───────────────────────────────────────────────
export const COMMON_WORDS_TR: string[] = [
  'bir', 've', 'bu', 'da', 'de', 'için', 'ile', 'ne', 'gibi', 'çok',
  'daha', 'kadar', 'olan', 'olarak', 'ben', 'sen', 'o', 'biz', 'siz', 'onlar',
  'var', 'yok', 'zaman', 'insan', 'büyük', 'küçük', 'sonra', 'önce', 'şimdi', 'yeni',
  'gün', 'gece', 'yıl', 'iş', 'el', 'göz', 'yol', 'başka', 'kendi', 'ancak',
  'bile', 'en', 'her', 'hiç', 'şey', 'yer', 'neden', 'nasıl', 'hangi', 'tüm',
  'doğru', 'iyi', 'güzel', 'uzun', 'kısa', 'açık', 'kapalı', 'hayat', 'dünya', 'su',
  'ses', 'ışık', 'renk', 'renkler', 'akıl', 'söz', 'kelime', 'anlam', 'soru', 'cevap',
  'düşünce', 'fikir', 'bellek', 'hafıza', 'hız', 'güç', 'durum', 'olay', 'süreç', 'adım',
  'sistem', 'nokta', 'alan', 'veri', 'ağ', 'bağlantı', 'ekran', 'tuş', 'yazı', 'satır',
  'sayfa', 'kitap', 'metin', 'derin', 'sessiz', 'hızlı', 'yavaş', 'kolay', 'zor', 'temiz',
  'sade', 'parlak', 'karanlık', 'sonsuz', 'özgür', 'canlı', 'özgün', 'modern', 'gelecek', 'geçmiş',
  'gerçek', 'rüya', 'umut', 'hedef', 'başarı', 'deneyim', 'üretim', 'tasarım', 'sanat', 'denge',
  'ritim', 'dalga', 'akış', 'nefes', 'zemin', 'tavan', 'köprü', 'kapı', 'pencere', 'çerçeve',
  'oda', 'şehir', 'cadde', 'sokak', 'rüzgar', 'bulut', 'gökyüzü', 'yıldız', 'güneş', 'ay',
  'deniz', 'toprak', 'ağaç', 'yaprak', 'tohum', 'kök', 'gölge', 'ayna', 'cam', 'metal',
  'taş', 'kağıt', 'kalem', 'mürekkep', 'çizgi', 'şekil', 'boyut', 'kenar', 'merkez', 'çevre',
  'düzen', 'kural', 'yapı', 'temel', 'araç', 'gereç', 'yöntem', 'yolculuk', 'hareket', 'duruş',
  'başlangıç', 'bitiş', 'sonuç', 'sebep', 'etki', 'tepki', 'giriş', 'çıkış', 'seviye', 'oran',
  'sayı', 'değer', 'ölçü', 'mesafe', 'aralık', 'fark', 'benzer', 'farklı', 'özel', 'genel',
  'birlikte', 'yalnız', 'tek', 'çift', 'bütün', 'parça', 'kesin', 'belki', 'hemen', 'sürekli',
  'daima', 'asla', 'bazen', 'erken', 'geç', 'yakın', 'uzak', 'içinde', 'dışında', 'üzerinde',
  'altında', 'arasında', 'karşısında', 'yanında', 'arkasında', 'önünde', 'çevresinde', 'etrafında',
  'çalışmak', 'yazmak', 'okumak', 'görmek', 'duymak', 'bilmek', 'anlamak', 'öğrenmek', 'bulmak', 'aramak',
  'yapmak', 'etmek', 'olmak', 'gelmek', 'gitmek', 'durmak', 'başlamak', 'bitirmek', 'taşımak', 'tutmak',
  'almak', 'vermek', 'açmak', 'kapatmak', 'bırakmak', 'koymak', 'seçmek', 'saymak', 'sevmek', 'hissetmek',
  'düşünmek', 'sormak', 'söylemek', 'anlatmak', 'dinlemek', 'izlemek', 'geliştirmek', 'üretmek', 'tasarlamak',
  'keşfetmek', 'korumak', 'paylaşmak', 'bağlamak', 'çözmek', 'oluşturmak', 'yöneltmek', 'beklemek', 'yürümek',
  'koşmak', 'ilerlemek', 'dönmek', 'değişmek', 'yenilenmek', 'hatırlamak', 'unutmak', 'fark etmek'
];

export const COMMON_WORDS_EN: string[] = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'code', 'data', 'byte', 'file', 'type', 'flow', 'grid', 'node', 'link', 'path',
  'loop', 'line', 'text', 'word', 'view', 'read', 'sync', 'task', 'core', 'root',
  'base', 'test', 'mode', 'page', 'fast', 'slow', 'dark', 'light', 'clean', 'pure',
  'true', 'deep', 'high', 'soft', 'sharp', 'mind', 'hand', 'life', 'world', 'space',
  'time', 'form', 'state', 'shift', 'pulse', 'spark', 'sound', 'color', 'shade', 'trace',
  'build', 'write', 'learn', 'parse', 'craft', 'focus', 'shine', 'glide', 'reach', 'solve',
  'system', 'memory', 'screen', 'device', 'signal', 'engine', 'canvas', 'cursor', 'sensor', 'vector',
  'matrix', 'filter', 'packet', 'stream', 'thread', 'render', 'script', 'layout', 'action', 'motion',
  'simple', 'silent', 'modern', 'future', 'fluent', 'stable', 'active', 'global', 'native', 'atomic',
  'listen', 'create', 'update', 'render', 'toggle', 'switch', 'detect', 'export', 'import', 'return',
  'always', 'almost', 'behind', 'beside', 'between', 'beyond', 'inside', 'toward', 'without', 'together'
];

// ─── 2. NARRATIVE SHORT STORIES (MODE 2) ───────────────────────────────────
export interface StoryItem {
  id: string;
  genre: StoryGenre;
  title: string;
  authorNote?: string;
  content: string;
}

export const STORIES_TR: StoryItem[] = [
  {
    id: 'tr-cyber-1',
    genre: 'cyberpunk',
    title: 'Gece Yarısı Sunucu Odası',
    authorNote: 'Sessiz soğutma fanları ve yeşil ışıklar altında.',
    content: 'Büyük soğutma fanlarının ritmik uğultusu arasında tek bir konsol açıktı. Ekranda yeşil renkte parıldayan log kayıtları, eski bir veritabanının sessizce uyandığını fısıldıyordu. Klavyenin tuşlarına dokunduğumda, her vuruş karanlık odada yankılanan bir metal tıkırtısına dönüştü. Sistem bana yanıt veriyor, kayıp paketlerin izini sürüyordu.'
  },
  {
    id: 'tr-retro-1',
    genre: 'retro',
    title: 'Eski Terminalin Günlüğü',
    authorNote: 'Otuz yıl öncesinden kalan bir not.',
    content: 'Çatı katındaki tozlu ahşap sandıktan çıkardığım CRT monitörü prize taktım. Ekranda beliren yatay tarama çizgilerinin ardından tek bir satır belirdi. Otuz yıl önce buraya oturan geliştirici şöyle yazmıştı: Diller ve komutlar değişir ama insanın doğruyu arayışı hep aynı kalır. Şimdi bu satırları aynı merakla tekrar yazıyorum.'
  },
  {
    id: 'tr-philosophy-1',
    genre: 'philosophy',
    title: 'Düşüncenin Fonksiyonel Doğası',
    authorNote: 'Zaman ve bilinç üzerine bir deneme.',
    content: 'Zihnimizi birbiri ardına bağlanan fonksiyonlar gibi düşünebiliriz. Her deneyim bir girdi olarak sisteme dahil olur, hafızanın işlemcisinde süzülür ve bir karara dönüşür. Geçmişin değişkenlerini değiştiremeyiz fakat şimdiki zamanın mantığını yeniden tasarlamak her an kendi ellerimizdedir.'
  },
  {
    id: 'tr-tech-1',
    genre: 'tech',
    title: 'Sıfır Gecikmeli Şehir',
    authorNote: 'Fiber optik ağların ve algoritmaların senfonisi.',
    content: 'Gökdelenlerin arasından süzülen fiber optik kablolar, şehrin görünmeyen sinir sistemini oluşturuyordu. Milyonlarca insan uyurken algoritmalar sokak lambalarını ayarlıyor, tren seferlerini optimize ediyor ve veri merkezleri arasındaki sıcaklığı dengeliyordu. Saf bir düzen, dokunulmaz bir denge içinde akıyordu.'
  },
  {
    id: 'tr-cyber-2',
    genre: 'cyberpunk',
    title: 'Monokrom Yağmur',
    authorNote: 'Asfalta düşen damlalar ve neon yansımaları.',
    content: 'Gece yağan yağmur asfalttaki çatlakları doldururken adımlarımı hızlandırdım. Ceketimin yakasını kaldırıp vitrinlerin siyah camlarına yansıyan görüntümü izledim. Bu şehirde gereksiz renklere yer yoktu; sadece saf ışık, derin gölge ve klavyeden yükselen tuş sesleri vardı.'
  },
  {
    id: 'tr-philosophy-2',
    genre: 'philosophy',
    title: 'Dokunsal Odaklanma',
    authorNote: 'Hızlı yazmanın meditatif yönü.',
    content: 'Parmak uçlarınız tuşların yüzeyinde gezindiğinde dünya bir anlığına durur. Düşünce ile metin arasındaki mesafe ortadan kalkar. Ne bir tereddüt ne de bir fazlalık kalır. Sadece parmakların ritmi, ekranda beliren harfler ve zihnin saf akışı hüküm sürer.'
  }
];

export const STORIES_EN: StoryItem[] = [
  {
    id: 'en-cyber-1',
    genre: 'cyberpunk',
    title: 'Midnight in the Server Room',
    authorNote: 'Under the low hum of server fans.',
    content: 'Under the heavy hum of cooling racks, a single terminal glowed into the dark. Green phosphor logs scrolled across the glass, announcing that a dormant node had awakened. As my fingers touched the mechanical keys, each stroke answered back with tactile certainty. The machine was listening, mapping paths through forgotten subnets.'
  },
  {
    id: 'en-retro-1',
    genre: 'retro',
    title: 'Chronicles of the Old Terminal',
    authorNote: 'A note discovered after three decades.',
    content: 'I pulled the vintage monitor from an attic crate and flipped the heavy power toggle. Raster lines flickered across the curved screen before revealing a message saved thirty years ago: Syntaxes evolve and frameworks fade, but the human desire to understand the universe remains unbroken.'
  },
  {
    id: 'en-philosophy-1',
    genre: 'philosophy',
    title: 'The Architecture of Thought',
    authorNote: 'On mental algorithms and clarity.',
    content: 'Consider consciousness as an immutable stream of state transitions. Every sensory impression enters as raw input, filtered through the compiler of memory, yielding the decisions of the present. We cannot recompile yesterday, but we hold full control over the algorithms we execute today.'
  },
  {
    id: 'en-tech-1',
    genre: 'tech',
    title: 'Zero Latency Meridian',
    authorNote: 'The silent symphony of fiber and silicon.',
    content: 'Deep beneath the avenue pavement, high-speed fiber trunks carried the digital pulse of the metropolis. While the towers slept, autonomous daemons routed energy grids, optimized routing tables, and maintained balance across distributed storage nodes without missing a single clock cycle.'
  },
  {
    id: 'en-cyber-2',
    genre: 'cyberpunk',
    title: 'Neon and Obsidian',
    authorNote: 'Stepping through nocturnal reflections.',
    content: 'Rain washed over the asphalt as holographic advertisements cast long reflections in the water. I adjusted my collar and walked towards the station terminal. In this quarter, noise was stripped away until only pure monochrome contrast and mechanical keystrokes remained.'
  }
];

// ─── 3. DEVELOPER & CLI / CODE COMMANDS (MODE 3) ───────────────────────────
export interface DevSnippet {
  id: string;
  category: DevCategory;
  title: string;
  code: string;
  explanation: string;
}

export const DEV_SNIPPETS: DevSnippet[] = [
  // PowerShell commands
  {
    id: 'ps-1',
    category: 'powershell',
    title: 'PowerShell: Process Filter & Memory Query',
    code: 'Get-Process | Where-Object { $_.WorkingSet -gt 150MB } | Sort-Object CPU -Descending | Select-Object -First 5',
    explanation: 'Find high memory processes and sort them by CPU usage'
  },
  {
    id: 'ps-2',
    category: 'powershell',
    title: 'PowerShell: Remote Execution Policy',
    code: 'Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force',
    explanation: 'Configure PowerShell script execution policy safely'
  },
  {
    id: 'ps-3',
    category: 'powershell',
    title: 'PowerShell: Network Port Test',
    code: 'Test-NetConnection -ComputerName api.github.com -Port 443 -InformationLevel Detailed',
    explanation: 'Perform detailed network diagnostics to GitHub endpoints'
  },
  {
    id: 'ps-4',
    category: 'powershell',
    title: 'PowerShell: Recursive File Search & Counter',
    code: 'Get-ChildItem -Path .\\src -Recurse -Filter *.tsx | Measure-Object -Line -Word -Character',
    explanation: 'Measure lines of code across all React components'
  },
  {
    id: 'ps-5',
    category: 'powershell',
    title: 'PowerShell: Windows Event Log Inspection',
    code: 'Get-WinEvent -FilterHashtable @{LogName=\'Application\'; Level=2} -MaxEvents 15 | Format-Table TimeCreated, Message',
    explanation: 'Query error events from the Windows Application log'
  },
  {
    id: 'ps-6',
    category: 'powershell',
    title: 'PowerShell: REST API Payload Dispatch',
    code: 'Invoke-RestMethod -Uri "https://api.tiyatrotist.com/v1/ping" -Method Post -Body ($payload | ConvertTo-Json) -ContentType "application/json"',
    explanation: 'Send JSON POST request to remote API endpoint'
  },

  // Terminal, Bash, Git, Docker
  {
    id: 'term-1',
    category: 'terminal',
    title: 'Git: Interactive Rebase & Branch Push',
    code: 'git checkout -b feature/typeflow-core && git commit -am "feat(engine): smooth lerp caret" && git push origin HEAD',
    explanation: 'Branch creation, commit, and upstream push chain'
  },
  {
    id: 'term-2',
    category: 'terminal',
    title: 'Docker: Multi-container Compose & Orphan Cleanup',
    code: 'docker compose -f docker-compose.prod.yml up -d --build --remove-orphans && docker compose logs -f --tail=50',
    explanation: 'Production container build and live log tail'
  },
  {
    id: 'term-3',
    category: 'terminal',
    title: 'Linux CLI: Find & Exec Pipe',
    code: 'find ./src -type f -name "*.ts" -not -path "*/node_modules/*" -exec grep -Hn "console.debug" {} +',
    explanation: 'Locate debug logs across TypeScript source files'
  },
  {
    id: 'term-4',
    category: 'terminal',
    title: 'Nginx & Systemd: Configuration Test & Daemon Reload',
    code: 'sudo nginx -t && sudo systemctl reload nginx && journalctl -u nginx.service -n 20 --no-pager',
    explanation: 'Test Nginx syntax, reload unit, and check systemd journal'
  },
  {
    id: 'term-5',
    category: 'terminal',
    title: 'Curl & JQ: Health Check Parsing',
    code: 'curl -sSL -X GET "https://api.github.com/rate_limit" -H "Accept: application/vnd.github.v3+json" | jq \'.resources.core\'',
    explanation: 'Query GitHub rate limit status with jq JSON filter'
  },
  {
    id: 'term-6',
    category: 'terminal',
    title: 'Node & Turbopack: Production Build & Bundle Inspection',
    code: 'npx next build --profile && du -sh .next/static/chunks/* | sort -hr | head -n 10',
    explanation: 'Run Next.js build with profiling and inspect chunk sizes'
  },

  // Code snippets (TS, Python, Rust, SQL)
  {
    id: 'code-1',
    category: 'code',
    title: 'TypeScript: Generic Cache & Promise Handler',
    code: 'async function fetchCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> { const cached = cache.get(key); if (cached) return cached as T; const res = await fetcher(); cache.set(key, res); return res; }',
    explanation: 'High-performance TypeScript in-memory cache wrapper'
  },
  {
    id: 'code-2',
    category: 'code',
    title: 'Rust: Safe Mutex & Thread Communication',
    code: 'let counter = Arc::new(Mutex::new(0)); for _ in 0..10 { let c = Arc::clone(&counter); thread::spawn(move || { let mut num = c.lock().unwrap(); *num += 1; }); }',
    explanation: 'Multi-threaded counter pattern in Rust'
  },
  {
    id: 'code-3',
    category: 'code',
    title: 'Python: Async Generator with Error Fallback',
    code: 'async def stream_events(url: str): async with aiohttp.ClientSession() as session: async with session.ws_connect(url) as ws: async for msg in ws: yield msg.json()',
    explanation: 'Real-time WebSocket event ingestion in Python'
  },
  {
    id: 'code-4',
    category: 'code',
    title: 'SQL: Analytic Window Function & Aggregation',
    code: 'SELECT user_id, test_date, wpm, RANK() OVER (PARTITION BY mode ORDER BY wpm DESC) as rank_pos FROM typing_sessions WHERE accuracy >= 95.0 LIMIT 25;',
    explanation: 'Leaderboard ranking query with window functions'
  },
  {
    id: 'code-5',
    category: 'code',
    title: 'React 19: Action State & Transition Hook',
    code: 'const [optimisticWpm, setOptimisticWpm] = useOptimistic(currentWpm, (state, update: number) => Math.max(state, update)); startTransition(() => setOptimisticWpm(liveWpm));',
    explanation: 'React 19 optimistic UI state update pattern'
  },

  // Mixed Tech Prose (Turkish & English developer phrases with CLI/code)
  {
    id: 'mixed-1',
    category: 'mixed',
    title: 'Mixed: Git Workflow ve Yerel Sunucu',
    code: 'Yeni özellik için `git checkout -b feat/typeflow` açıp `npm run dev` ile yerel sunucuyu başlattıktan sonra `localhost:3000` adresini test edin.',
    explanation: 'Everyday developer workflow blending prose and commands'
  },
  {
    id: 'mixed-2',
    category: 'mixed',
    title: 'Mixed: Docker Container Debugging',
    code: 'Servis yanıt vermediğinde `docker ps -a` ile konteyner durumunu kontrol edin ve `docker logs --tail=100 -f api-service` ile hata loglarını inceleyin.',
    explanation: 'Container troubleshooting statement'
  },
  {
    id: 'mixed-3',
    category: 'mixed',
    title: 'Mixed: PowerShell & NPM Script Chain',
    code: 'Windows ortamında `Get-Service -Name wuauserv` kontrolü yapıp `npm run lint -- --max-warnings=0` komutuyla temiz derleme sağlayın.',
    explanation: 'Windows sysadmin and node automation phrase'
  },
  {
    id: 'mixed-4',
    category: 'mixed',
    title: 'Mixed: Next.js API Route ve Supabase Query',
    code: 'Route handler içinde `const { data, error } = await supabase.from(\'scores\').select(\'*\').order(\'wpm\', { ascending: false });` sorgusunu çalıştırın.',
    explanation: 'Supabase database query integration within Next.js'
  }
];

// ─── 4. HELPER DATA GENERATORS ──────────────────────────────────────────────

/**
 * Generates a random sequence of common words
 */
export function generateCommonWords(lang: 'tr' | 'en', count: number, punctuation = false, numbers = false): string[] {
  console.debug('[TypeFlow:Data] Generating common words', { lang, count, punctuation, numbers });
  const pool = lang === 'tr' ? COMMON_WORDS_TR : COMMON_WORDS_EN;
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    let word = pool[randomIndex];

    if (numbers && Math.random() < 0.15) {
      word = String(Math.floor(Math.random() * 900 + 100));
    } else if (punctuation) {
      const rand = Math.random();
      if (rand < 0.1) {
        word = word + ',';
      } else if (rand < 0.18) {
        word = word + '.';
      } else if (rand < 0.22 && i > 0) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
    }

    result.push(word);
  }

  return result;
}

/**
 * Returns a story based on selected language and optional genre
 */
export function getStory(lang: 'tr' | 'en', genre: StoryGenre = 'all', previousId?: string): StoryItem {
  console.debug('[TypeFlow:Data] Fetching story', { lang, genre, previousId });
  const list = lang === 'tr' ? STORIES_TR : STORIES_EN;
  const filtered = genre === 'all' ? list : list.filter(s => s.genre === genre);
  const candidates = filtered.length > 1 && previousId ? filtered.filter(s => s.id !== previousId) : filtered;
  const choice = candidates[Math.floor(Math.random() * candidates.length)] || list[0];
  return choice;
}

/**
 * Returns dev snippets based on category
 */
export function getDevSnippet(category: DevCategory = 'all', previousId?: string): DevSnippet {
  console.debug('[TypeFlow:Data] Fetching dev snippet', { category, previousId });
  const filtered = category === 'all' ? DEV_SNIPPETS : DEV_SNIPPETS.filter(s => s.category === category);
  const candidates = filtered.length > 1 && previousId ? filtered.filter(s => s.id !== previousId) : filtered;
  const choice = candidates[Math.floor(Math.random() * candidates.length)] || DEV_SNIPPETS[0];
  return choice;
}
