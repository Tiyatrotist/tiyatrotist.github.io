/**
 * TYPEFLOW — Dynamic Multi-Topic Modular Practice Generator
 * Generates rich, random thematic typing drills drawn from real-world domains
 * (Quantum Space, AI & Networks, Theatre, Cybersecurity, Deep Sea, Ancient Philosophy, etc.).
 * Delivers modular, semi-shuffled words in dynamic flow rather than rigid copy-paste text.
 */

export interface PracticeTopic {
  id: string;
  icon: string;
  nameTr: string;
  nameEn: string;
  descTr: string;
  descEn: string;
  wordsTr: string[];
  wordsEn: string[];
}

export const PRACTICE_TOPICS: PracticeTopic[] = [
  {
    id: 'ai_neural',
    icon: '🤖',
    nameTr: 'Yapay Zeka & Nöral Ağlar',
    nameEn: 'AI & Neural Networks',
    descTr: 'Algoritmalar, tensör matrisleri ve makine öğrenimi sözcük dağarcığı.',
    descEn: 'Algorithms, tensor matrices, and machine learning vocabulary.',
    wordsTr: [
      'algoritma', 'model', 'tensör', 'ağırlık', 'öğrenme', 'parametre', 'çıkarım',
      'matris', 'gradyan', 'bellek', 'nöron', 'katman', 'vektör', 'kayıp', 'optimizasyon',
      'eğitim', 'veri', 'etiket', 'token', 'küme', 'bağlam', 'doğruluk', 'sinir', 'ağ',
      'derinlik', 'transfer', 'girdi', 'çıktı', 'denetim', 'olasılık', 'boyut', 'filtre'
    ],
    wordsEn: [
      'algorithm', 'model', 'tensor', 'weight', 'learning', 'parameter', 'inference',
      'matrix', 'gradient', 'memory', 'neuron', 'layer', 'vector', 'loss', 'optimization',
      'training', 'data', 'label', 'token', 'cluster', 'context', 'accuracy', 'neural', 'network',
      'depth', 'transfer', 'input', 'output', 'latent', 'probability', 'dimension', 'filter'
    ]
  },
  {
    id: 'theatre_stage',
    icon: '🎭',
    nameTr: 'Tiyatro & Sahne Tiradları (Buğra)',
    nameEn: 'Theatre & Stage Arts (Buğra)',
    descTr: 'Tiradlar, kulis terimleri, suflör replikleri ve sahne tozu.',
    descEn: 'Soliloquies, backstage diction, prompter cues, and stage dust.',
    wordsTr: [
      'tirad', 'sahne', 'kulis', 'perde', 'suflör', 'replik', 'oyuncu', 'monolog',
      'diyalog', 'kostüm', 'dekor', 'ışık', 'alkış', 'antre', 'prova', 'dram',
      'komedi', 'tragedya', 'metin', 'yazar', 'karakter', 'jest', 'mimik', 'diksiyon',
      'vurgu', 'tonlama', 'aktör', 'aktris', 'salon', 'seyirci', 'büyü', 'heyecan'
    ],
    wordsEn: [
      'soliloquy', 'stage', 'backstage', 'curtain', 'prompter', 'dialogue', 'actor', 'monologue',
      'script', 'costume', 'props', 'spotlight', 'applause', 'entrance', 'rehearsal', 'drama',
      'comedy', 'tragedy', 'text', 'playwright', 'character', 'gesture', 'mimic', 'diction',
      'inflection', 'cadence', 'performer', 'auditorium', 'audience', 'passion', 'encore', 'presence'
    ]
  },
  {
    id: 'quantum_space',
    icon: '🚀',
    nameTr: 'Kuantum & Uzay Keşfi',
    nameEn: 'Quantum & Deep Space',
    descTr: 'Galaksiler, yörüngeler, fotonlar ve kuantum dolanıklığı.',
    descEn: 'Galaxies, orbital mechanics, photons, and quantum entanglement.',
    wordsTr: [
      'galaksi', 'yörünge', 'kara delik', 'foton', 'kuantum', 'dolanıklık', 'ışık',
      'teleskop', 'yıldız', 'nebula', 'çekim', 'kütle', 'roket', 'astronot', 'süpernova',
      'plazma', 'pulsar', 'kozmos', 'evren', 'gezegen', 'atmosfer', 'radyasyon', 'vakum',
      'zaman', 'görelilik', 'hız', 'enerji', 'dalga', 'frekans', 'sonsuzluk', 'keşif'
    ],
    wordsEn: [
      'galaxy', 'orbit', 'black hole', 'photon', 'quantum', 'entanglement', 'light',
      'telescope', 'stellar', 'nebula', 'gravity', 'mass', 'rocket', 'astronaut', 'supernova',
      'plasma', 'pulsar', 'cosmos', 'universe', 'planet', 'atmosphere', 'radiation', 'vacuum',
      'spacetime', 'relativity', 'velocity', 'energy', 'wave', 'frequency', 'infinity', 'voyage'
    ]
  },
  {
    id: 'cyber_security',
    icon: '🛡️',
    nameTr: 'Siber Güvenlik & Kripto',
    nameEn: 'Cybersecurity & Crypto',
    descTr: 'Paketler, şifreleme, güvenlik duvarı ve terminal savunması.',
    descEn: 'Packet routing, encryption ciphers, firewalls, and defense.',
    wordsTr: [
      'şifreleme', 'güvenlik', 'paket', 'protokol', 'duvar', 'sızma', 'anahtar',
      'kripto', 'terminal', 'yetki', 'sunucu', 'sertifika', 'tarama', 'açık', 'savunma',
      'erişim', 'tünel', 'kök', 'izleme', 'karantina', 'kimlik', 'bütünlük', 'gizlilik',
      'kullanıcı', 'bayt', 'yonga', 'şifre', 'tespit', 'saldırı', 'önlem', 'kayıt'
    ],
    wordsEn: [
      'cipher', 'security', 'packet', 'protocol', 'firewall', 'breach', 'keypair',
      'crypto', 'terminal', 'privilege', 'server', 'certificate', 'scan', 'exploit', 'defense',
      'access', 'tunnel', 'root', 'telemetry', 'sandbox', 'identity', 'integrity', 'entropy',
      'payload', 'packet', 'kernel', 'token', 'detection', 'vector', 'mitigation', 'syslog'
    ]
  },
  {
    id: 'deep_ocean',
    icon: '🌊',
    nameTr: 'Derin Okyanus & Denizcilik',
    nameEn: 'Deep Ocean & Maritime',
    descTr: 'Mariana Çukuru, batıklar, pusula ve açık denizler.',
    descEn: 'Mariana Abyss, shipwreck lore, compass navigation, and open seas.',
    wordsTr: [
      'okyanus', 'mariana', 'mercan', 'batık', 'pusula', 'fırtına', 'dümen',
      'dalga', 'derinlik', 'lodos', 'pruva', 'sonar', 'yunus', 'basınç', 'akıntı',
      'kaptan', 'yelken', 'liman', 'ufuk', 'iskeleye', 'sancak', 'kıyı', 'resif',
      'denizaltı', 'fener', 'sığlık', 'mavilik', 'yosun', 'dalgıç', 'gizem'
    ],
    wordsEn: [
      'ocean', 'abyss', 'coral', 'wreck', 'compass', 'tempest', 'rudder',
      'wave', 'depth', 'tide', 'prow', 'sonar', 'dolphin', 'pressure', 'current',
      'captain', 'canvas', 'harbor', 'horizon', 'portside', 'starboard', 'shore', 'reef',
      'submarine', 'beacon', 'shoal', 'azure', 'kelp', 'diver', 'trench'
    ]
  },
  {
    id: 'ancient_philosophy',
    icon: '🏛️',
    nameTr: 'Antik Mitoloji & Felsefe',
    nameEn: 'Ancient Myth & Philosophy',
    descTr: 'Sokrates, agora, erdem, diyalektik ve kadim düşünceler.',
    descEn: 'Socratic dialogues, agora, virtue, dialectics, and timeless thought.',
    wordsTr: [
      'erdem', 'agora', 'bilgelik', 'diyalektik', 'hakikat', 'efsane', 'kader',
      'akıl', 'mantık', 'düşünce', 'adalet', 'felsefe', 'ruh', 'varlık', 'zaman',
      'ölçü', 'ahlak', 'vicdan', 'tanrı', 'öğreti', 'diyalog', 'şüphe', 'sorgu',
      'özgürlük', 'irade', 'dinginlik', 'uyum', 'denge', 'evren', 'insan'
    ],
    wordsEn: [
      'virtue', 'agora', 'wisdom', 'dialectic', 'truth', 'mythos', 'destiny',
      'reason', 'logic', 'thought', 'justice', 'philosophy', 'psyche', 'being', 'time',
      'temperance', 'ethics', 'conscience', 'pantheon', 'doctrine', 'dialogue', 'skeptic', 'inquiry',
      'liberty', 'agency', 'serenity', 'harmony', 'balance', 'cosmos', 'human'
    ]
  }
];

/**
 * Returns a random topic and generates semi-mixed modular practice words
 */
export function generateTopicPracticeWords(
  lang: 'tr' | 'en',
  count: number = 30,
  topicId?: string,
  punctuation: boolean = false,
  caseSensitive: boolean = false
): { topic: PracticeTopic; words: string[]; title: string } {
  console.debug('[TopicGenerator] Generating practice words:', { lang, count, topicId, punctuation, caseSensitive });

  // Select topic
  let topic = PRACTICE_TOPICS.find((t) => t.id === topicId);
  if (!topic) {
    topic = PRACTICE_TOPICS[Math.floor(Math.random() * PRACTICE_TOPICS.length)];
  }

  const wordBank = lang === 'tr' ? topic.wordsTr : topic.wordsEn;

  // Transitional connector words to create pleasant semi-mixed typing rhythm
  const connectorsTr = ['ile', 've', 'için', 'olan', 'gibi', 'bu', 'her', 'bir', 'daha', 'akışı', 'şimdi', 'yeni'];
  const connectorsEn = ['with', 'and', 'for', 'into', 'like', 'this', 'each', 'from', 'more', 'flow', 'then', 'pure'];
  const connectors = lang === 'tr' ? connectorsTr : connectorsEn;

  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    // 75% topic vocabulary, 25% rhythmic connector
    const useTopicWord = Math.random() < 0.75 || i === 0;
    let selected = useTopicWord
      ? wordBank[Math.floor(Math.random() * wordBank.length)]
      : connectors[Math.floor(Math.random() * connectors.length)];

    if (!caseSensitive) {
      selected = selected.toLowerCase();
    }

    if (punctuation && Math.random() < 0.15) {
      const puncts = [',', '.', ';', '!'];
      selected += puncts[Math.floor(Math.random() * puncts.length)];
    }

    result.push(selected);
  }

  const title = `${topic.icon} ${lang === 'tr' ? topic.nameTr : topic.nameEn}`;
  return { topic, words: result, title };
}
