/**
 * TYPEFLOW — Dynamic Combinatorial Story & Theatre Monologue Generator
 * Synthesizes coherent, engaging micro-stories infused with Buğra's theatrical passion,
 * stage monologues (Hamlet, Cyrano de Bergerac, Sahne Tozu), and typing rhythms.
 */

interface NarrativeGrammar {
  settings: string[];
  catalysts: string[];
  actions: string[];
  climaxes: string[];
  reflections: string[];
}

const GRAMMAR_TR: NarrativeGrammar = {
  settings: [
    'Tiyatro sahnesinde kadife perdeler ağır ağır açılırken,',
    'Kuliste antre sıramı beklerken masadaki daktilonun başında,',
    'Spot ışıklarının tozlu havayı aydınlattığı sessiz prova salonunda,',
    'Sahne tozuyla daktilo tuşlarının madeni kokusunun birbirine karıştığı gecede,',
    'Oyun metnini elime alıp tiradımı fısıldadığım loş kulis odasında,',
    'Boş koltuklara karşı sahneye çıkıp repliğimi haykırdığım o büyülü anda,'
  ],
  catalysts: [
    'içimdeki tiyatro tutkusu parmak uçlarıma kadar doldu.',
    'sahnenin tahta döşemeleri sanki yüreğimin ritmiyle yankılandı.',
    'daktilonun her vuruşu yeni bir tiradın doğuşunu müjdeledi.',
    'oyuncunun nefesiyle yazarın kelimeleri tek bir akışta birleşti.',
    'seyircinin derin sessizliği tiradın gücünü ikiye katladı.',
    'karanlığın içinden yükselen bir alkış fısıltısı duyuldu.'
  ],
  actions: [
    'Mekanik tuşlara bir aktörün sahneye attığı ilk adım gibi kararlılıkla bastım.',
    'Hamlet tiradının kelimelerini daktiloda satır satır dokudum.',
    'Her harf, sahnede yankılanan bir tiradın silinmez bir ses perdesiydi.',
    'Cyrano de Bergerac\'ın cesur tavrını tuşların tıkırtısında hissettim.',
    'Tiyatrotist sahnesinde kelimeler hayat buldukça parmaklarım hızlandı.'
  ],
  climaxes: [
    'Sahne tozu ve daktilo tıkırtısı tek bir kusursuz armoniye dönüştü.',
    'Replikler ve harfler zihnimde dans ederek saf bir sahne büyüsü yarattı.',
    'Perde kapandığında sahnede sadece sanatın ve emeğin ebedi izi kaldı.',
    'Seyirci ayağa fırladı; kelimeler ruhları derinden sarsmıştı.'
  ],
  reflections: [
    'Çünkü sahne neyse daktilo da odur; her ikisi de insanın hakikat arayışıdır.',
    'Yazılan her kelime, aktörün sahnede bıraktığı ölümsüz bir tiraddır.',
    'Tiyatrotist ile sahne tozu ve dijital dünya birbirine sarılır.',
    'Parmaklar klavyeden çekildiğinde geriye sadece tiyatronun sonsuz aşkı kalır.'
  ]
};

const GRAMMAR_EN: NarrativeGrammar = {
  settings: [
    'As the heavy velvet curtains slowly parted across the theatre stage,',
    'Waiting backstage for my cue behind the antique mechanical typewriter,',
    'Under the dusty glare of stage spotlights in an empty rehearsal hall,',
    'Where the fragrance of theatrical dust met the metallic strike of keycaps,',
    'Whispering soliloquies in the dim green room before the opening night,'
  ],
  catalysts: [
    'a surge of theatrical passion rushed into every fingertip.',
    'the wooden floorboards resonated with the actor\'s inner tempo.',
    'each mechanical keystroke proclaimed the birth of a new dramatic monologue.',
    'the writer\'s script and the performer\'s soul converged into pure flow.',
    'an anticipatory silence fell over the auditorium.'
  ],
  actions: [
    'I struck the tactile keys with the bold panache of Cyrano taking the stage.',
    'Weaving Hamlet\'s contemplative verse syllable by syllable into the terminal.',
    'Every typed character carried the resonance of an actor\'s immortal line.',
    'At Tiyatrotist, the boundary between live performance and keystrokes faded.'
  ],
  climaxes: [
    'The theatre air and typewriter acoustics fused into a magnificent crescendo.',
    'The soliloquy echoed through the empty hall, alive with artistic truth.',
    'When the applause broke out, the words had already touched eternity.'
  ],
  reflections: [
    'The stage and the keyboard share one soul: the relentless quest for human truth.',
    'Every typed sentence is a permanent monologue recorded in the theatre of time.',
    'When the curtain falls, only the enduring devotion to stage and craft remains.'
  ]
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const THEATRICAL_SNIPPETS = {
  hamlet: {
    titleTr: 'Hamlet — Olmak ya da Olmamak Tiradı',
    titleEn: 'Hamlet — To Be or Not to Be Soliloquy',
    contentTr: 'Olmak ya da olmamak, işte bütün mesele bu! Zalim kaderin oklarına ve sapan taşlarına katlanmak mı, yoksa dertler denizine karşı silaha sarılıp son vermek mi onları? Ölmek, uyumak... Hepsi bu! Ve bir uykuyla yürek acılarına, bedenin çektiği binbir çileye son vermek! İşte varılacak en yüce amaç.',
    contentEn: 'To be, or not to be, that is the question: Whether \'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them. To die, to sleep, no more; and by a sleep to say we end the heartache.'
  },
  cyrano: {
    titleTr: 'Cyrano de Bergerac — Burun Tiradı (Buğra Yorumu)',
    titleEn: 'Cyrano de Bergerac — The Nose Monologue',
    contentTr: 'Bu ne burnu efendim! Bir burun değil, bir burun dağarcığı! Bir yarımada, bir burun kalesi! Ah efendim, burnuma laf atanlar bilsinler ki, benim burnum benim gururumdur. Çünkü büyük bir burun, kibar, cömert, cesur ve zeki bir adamın alametidir!',
    contentEn: 'Ah no, young man, that is much too brief! You might have said so many things, changing your tone. Aggressive: Sir, if that nose were mine, I\'d have it amputated on the spot! Friendly: How do you drink from a cup? You must have had a goblet specially made!'
  },
  sahne: {
    titleTr: 'Tiyatrotist Sahne Arkası — Buğra\'nın Kulis Notları',
    titleEn: 'Tiyatrotist Backstage — Buğra\'s Stage Notes',
    contentTr: 'Ben Buğra. Sahnede bir tiradın nefesinde, terminalde daktilonun madeni tıkırtısında aynı tutkuyu arıyorum. Kuliste antremi beklerken yazdığım her kelime, sahneye adım attığımda bir aktörün sesine, salondaki seyircinin kalp çarpıntısına dönüşüyor. Tiyatrotist; sahne tozuyla daktilo tuşlarının buluştuğu yerdir.',
    contentEn: 'I am Buğra. In the breath of a stage soliloquy and the metallic rhythm of typewriter keys, I seek the exact same artistic truth. Every word typed backstage transforms into an actor\'s voice under the spotlight. Tiyatrotist is where theatrical dust meets tactile keyboard mastery.'
  }
};

/**
 * Returns specific theatrical monologue snippet for practice
 */
export function getTheatricalSnippet(snippetId: string, lang: 'tr' | 'en'): { title: string; content: string; words: string[] } {
  console.debug('[StoryGenerator] Getting theatrical snippet:', snippetId, 'lang:', lang);
  const snippet = THEATRICAL_SNIPPETS[snippetId as keyof typeof THEATRICAL_SNIPPETS] || THEATRICAL_SNIPPETS.sahne;
  const title = lang === 'tr' ? snippet.titleTr : snippet.titleEn;
  const content = lang === 'tr' ? snippet.contentTr : snippet.contentEn;
  const words = content.split(/\s+/).filter(Boolean);
  return { title, content, words };
}

/**
 * Dynamically synthesizes a complete micro-story for typing
 */
export function generateDynamicStory(lang: 'tr' | 'en'): { title: string; content: string; words: string[] } {
  console.debug('[StoryGenerator] Generating dynamic story for lang:', lang);

  const grammar = lang === 'tr' ? GRAMMAR_TR : GRAMMAR_EN;

  const s1 = `${pickRandom(grammar.settings)} ${pickRandom(grammar.catalysts)}`;
  const s2 = `${pickRandom(grammar.actions)} ${pickRandom(grammar.climaxes)}`;
  const s3 = pickRandom(grammar.reflections);

  const content = `${s1} ${s2} ${s3}`;
  const words = content.split(/\s+/).filter(Boolean);

  const titlesTr = [
    '🎭 Tiyatrotist Sahne Notları',
    '🎭 Kulis Daktilosu // Buğra',
    '🎭 Hamlet Tiradı // Sahne Tozu',
    '🎭 Cyrano\'nun Tuşları',
    '🎭 Sahne Arkası Monoloğu',
    '🎭 Prömiyer Gecesi'
  ];

  const titlesEn = [
    '🎭 Tiyatrotist Stage Notes',
    '🎭 Green Room Typewriter // Buğra',
    '🎭 Soliloquy in the Wings',
    '🎭 Cyrano\'s Keystrokes',
    '🎭 Backstage Monologue',
    '🎭 Opening Night Cadence'
  ];

  const title = lang === 'tr' ? pickRandom(titlesTr) : pickRandom(titlesEn);

  console.debug('[StoryGenerator] Generated story:', { title, wordCount: words.length });

  return {
    title,
    content,
    words
  };
}
