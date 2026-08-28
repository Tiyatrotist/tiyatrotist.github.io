/**
 * TIYATROTIST — Localization Dictionary Types
 * Strongly-typed interface for Turkish and English translations.
 */

export type Locale = 'tr' | 'en';

export interface Dictionary {
  nav: {
    home: string;
    projects: string;
    about: string;
    now: string;
    contact: string;
  };
  hero: {
    role: string;
    tagline: string;
    cta: string;
  };
  manifesto: {
    tag: string;
    headingPrefix: string;
    logicWord: string;
    headingMiddle: string;
    formWord: string;
    headingSuffix: string;
    paragraph1: string;
    paragraph2: string;
  };
  projectIntro: {
    tag: string;
    title: string;
    description: string;
    enterBtn: string;
  };
  projectsPage: {
    tag: string;
    title: string;
    subtitle: string;
    enterBtn: string;
  };
  projectDetail: {
    tag: string;
    highlights: string;
    backBtn: string;
    notFoundTitle: string;
    notFoundSubtitle: string;
  };
  aboutPage: {
    tag: string;
    title: string;
    subtitle: string;
    p1: string;
    p2: string;
    principles: string[];
  };
  nowPage: {
    tag: string;
    title: string;
    subtitle: string;
    buildingLabel: string;
    buildingDesc: string;
    researchingLabel: string;
    researchingDesc: string;
    locationLabel: string;
    locationDesc: string;
  };
  contactPage: {
    tag: string;
    title: string;
    subtitle: string;
    directLabel: string;
    networksLabel: string;
  };
  footer: {
    copy: string;
  };
  bookos: {
    backToMain: string;
    badge: string;
    tagline: string;
    downloadBtn: string;
    githubBtn: string;
    navOverview: string;
    navFeatures: string;
    navShowcase: string;
    navTech: string;
    navReleases: string;
    navDownload: string;
    overviewTag: string;
    overviewTitle: string;
    overviewDesc: string;
    showcaseTitle: string;
    showcaseSubtitle: string;
    tabVault: string;
    tabEditor: string;
    tabMonitor: string;
    featuresTag: string;
    feature1Title: string;
    feature1Desc: string;
    feature1Meta: string;
    feature2Title: string;
    feature2Desc: string;
    feature2Meta: string;
    feature3Title: string;
    feature3Desc: string;
    feature3Meta: string;
    techTag: string;
    techTitle: string;
    archLabel: string;
    archVal: string;
    runtimeLabel: string;
    runtimeVal: string;
    memoryLabel: string;
    memoryVal: string;
    binaryLabel: string;
    binaryVal: string;
    licenseLabel: string;
    licenseVal: string;
    releasesTag: string;
    releasesTitle: string;
    stableTitle: string;
    stableDesc: string;
    betaTitle: string;
    betaDesc: string;
    expTitle: string;
    expDesc: string;
    downloadTag: string;
    downloadTitle: string;
    downloadSubtitle: string;
    downloadNotice: string;
  };
  maintenance: {
    title: string;
    tagline: string;
    status: string;
  };
  notFound: {
    tag: string;
    survivedMessage: string;
    completedMessage: string;
    restartBtn: string;
    returnHomeBtn: string;
  };
}
