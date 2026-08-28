/**
 * TIYATROTIST — Admin Panel i18n
 *
 * Bilingual labels for the admin interface (TR / EN).
 * Projects and Releases unified under a single Project Management architecture.
 */

export type AdminLocale = 'tr' | 'en';

export interface AdminDict {
  nav: {
    dashboard: string;
    content: string;
    pages: string;
    projects: string;
    blog: string;
    about: string;
    contact: string;
    media: string;
    mediaLibrary: string;
    system: string;
    settings: string;
    emergency: string;
    account: string;
    viewSite: string;
    logout: string;
  };
  login: {
    title: string;
    email: string;
    password: string;
    submit: string;
    loading: string;
    errorInvalid: string;
    errorNetwork: string;
    errorDenied: string;
  };
  dashboard: {
    title: string;
    operationsOverview: string;
    contentGroup: string;
    mediaGroup: string;
    releasesGroup: string;
    systemGroup: string;
    publishedProjects: string;
    draftProjects: string;
    publishedPosts: string;
    draftPosts: string;
    mediaCount: string;
    latestRelease: string;
    siteStatus: string;
    maintenanceStatus: string;
    maintenanceOn: string;
    maintenanceOff: string;
    emergencyAlert: string;
    goToEmergency: string;
    noData: string;
  };
  projects: {
    title: string;
    breadcrumb: string;
    search: string;
    newProject: string;
    manage: string;
    edit: string;
    delete: string;
    publish: string;
    unpublish: string;
    feature: string;
    unfeature: string;
    noProjects: string;
    noProjectsDesc: string;
    slug: string;
    name: string;
    status: string;
    featured: string;
    latestRelease: string;
    shortDescTr: string;
    shortDescEn: string;
    descTr: string;
    descEn: string;
    githubUrl: string;
    websiteUrl: string;
    accentColor: string;
    save: string;
    saving: string;
    create: string;
    creating: string;
    deleteConfirm: string;
    duplicateSlug: string;
    back: string;
    createdSuccess: string;
    createdSuccessDesc: string;
    addFirstRelease: string;
    // Workspace tabs
    tabOverview: string;
    tabContent: string;
    tabMedia: string;
    tabReleases: string;
    tabSettings: string;
    // Overview tab
    projectHealth: string;
    mediaCountLabel: string;
    openGithub: string;
    openWebsite: string;
    // Media tab
    projectMediaTitle: string;
    addMedia: string;
    noProjectMedia: string;
    noProjectMediaDesc: string;
    mediaUrl: string;
    mediaType: string;
    captionTr: string;
    captionEn: string;
    // Releases tab
    projectReleasesTitle: string;
    newRelease: string;
    editRelease: string;
    version: string;
    channel: string;
    releaseDate: string;
    changelogTr: string;
    changelogEn: string;
    githubReleaseUrl: string;
    isCurrent: string;
    noReleases: string;
    noReleasesDesc: string;
    saveRelease: string;
    savingRelease: string;
    createRelease: string;
    deleteReleaseConfirm: string;
    stable: string;
    beta: string;
    experimental: string;
  };
  blog: {
    title: string;
    breadcrumb: string;
    search: string;
    newPost: string;
    edit: string;
    delete: string;
    publish: string;
    unpublish: string;
    feature: string;
    unfeature: string;
    noPosts: string;
    noPostsDesc: string;
    postTitle: string;
    postTitleTr: string;
    postTitleEn: string;
    slug: string;
    excerptTr: string;
    excerptEn: string;
    contentTr: string;
    contentEn: string;
    coverImage: string;
    coverImagePlaceholder: string;
    status: string;
    languages: string;
    publishedDate: string;
    published: string;
    draft: string;
    featured: string;
    tabTr: string;
    tabEn: string;
    metadata: string;
    save: string;
    saving: string;
    create: string;
    creating: string;
    deleteConfirm: string;
    duplicateSlug: string;
    back: string;
  };
  media: {
    title: string;
    breadcrumb: string;
    upload: string;
    uploading: string;
    delete: string;
    deleteConfirm: string;
    noMedia: string;
    noMediaDesc: string;
    dragDrop: string;
    fileSize: string;
    fileType: string;
    maxSize: string;
    invalidType: string;
    filterAll: string;
    filterImages: string;
    filterVideos: string;
    copyUrl: string;
    copied: string;
  };
  about: {
    title: string;
    breadcrumb: string;
    titleTr: string;
    titleEn: string;
    contentTr: string;
    contentEn: string;
    save: string;
    saving: string;
  };
  contact: {
    title: string;
    breadcrumb: string;
    label: string;
    url: string;
    icon: string;
    sortOrder: string;
    enabled: string;
    newLink: string;
    edit: string;
    delete: string;
    deleteConfirm: string;
    noLinks: string;
    noLinksDesc: string;
    save: string;
    saving: string;
  };
  settings: {
    title: string;
    breadcrumb: string;
    siteTitleTr: string;
    siteTitleEn: string;
    siteDescTr: string;
    siteDescEn: string;
    maintenanceMode: string;
    maintenanceOn: string;
    maintenanceOff: string;
    save: string;
    saving: string;
  };
  emergency: {
    title: string;
    breadcrumb: string;
    warningTitle: string;
    warningDesc: string;
    quickMaintenance: string;
    quickMaintenanceDesc: string;
    enableMaintenance: string;
    disableMaintenance: string;
    lockdown: string;
    lockdownDesc: string;
    lockdownBtn: string;
    lockdownConfirm: string;
    restoreAll: string;
    restoreAllDesc: string;
    restoreAllBtn: string;
    restoreAllConfirm: string;
    statusMaintenance: string;
    statusOnline: string;
    statusLocked: string;
    statusUnlocked: string;
  };
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    accessDenied: string;
    accessDeniedMsg: string;
    notFound: string;
    actions: string;
    status: string;
    updated: string;
  };
}

export const adminTr: AdminDict = {
  nav: {
    dashboard: 'Gösterge Paneli',
    content: 'İÇERİK',
    pages: 'Sayfalar',
    projects: 'Projeler',
    blog: 'Blog',
    about: 'Hakkında',
    contact: 'İletişim',
    media: 'MEDYA',
    mediaLibrary: 'Medya Kütüphanesi',
    system: 'SİSTEM',
    settings: 'Site Ayarları',
    emergency: 'Acil Durum',
    account: 'HESAP',
    viewSite: 'Siteyi Gör',
    logout: 'Çıkış Yap',
  },
  login: {
    title: 'Yönetici Girişi',
    email: 'E-posta',
    password: 'Şifre',
    submit: 'Giriş Yap',
    loading: 'Giriş yapılıyor…',
    errorInvalid: 'E-posta veya şifre hatalı.',
    errorNetwork: 'Bağlantı hatası. Tekrar deneyin.',
    errorDenied: 'Erişim reddedildi. Yetkisiz hesap.',
  },
  dashboard: {
    title: 'Gösterge Paneli',
    operationsOverview: 'Operasyon Özeti',
    contentGroup: 'İçerik Durumu',
    mediaGroup: 'Medya Deposu',
    releasesGroup: 'Sürüm Yönetimi',
    systemGroup: 'Sistem & Güvenlik',
    publishedProjects: 'Yayındaki Projeler',
    draftProjects: 'Taslak Projeler',
    publishedPosts: 'Yayındaki Blog Yazıları',
    draftPosts: 'Taslak Yazılar',
    mediaCount: 'Medya Dosyaları',
    latestRelease: 'Son Sürüm',
    siteStatus: 'Site Durumu',
    maintenanceStatus: 'Bakım Durumu',
    maintenanceOn: '● BAKIMDA',
    maintenanceOff: '● YAYINDA',
    emergencyAlert: 'Acil durum eylemleri için acil durum merkezini kullanın.',
    goToEmergency: 'Acil Durum Merkezine Git →',
    noData: 'Henüz veri yok.',
  },
  projects: {
    title: 'Projeler',
    breadcrumb: 'İçerik / Projeler',
    search: 'Proje ara… (ad veya slug)',
    newProject: 'Yeni Proje',
    manage: 'Yönet →',
    edit: 'Düzenle',
    delete: 'Projeyi Sil',
    publish: 'Yayınla',
    unpublish: 'Yayından Kaldır',
    feature: 'Öne Çıkar',
    unfeature: 'Öne Çıkarmayı Kaldır',
    noProjects: 'Henüz proje bulunmuyor.',
    noProjectsDesc: 'İlk projenizi ekleyerek portfolyonuzu oluşturmaya başlayın.',
    slug: 'Slug (URL Yolu)',
    name: 'Proje Adı',
    status: 'Yayın Durumu',
    featured: 'Öne Çıkan',
    latestRelease: 'Son Sürüm',
    shortDescTr: 'Kısa Açıklama (TR)',
    shortDescEn: 'Kısa Açıklama (EN)',
    descTr: 'Detaylı Açıklama (TR — Markdown)',
    descEn: 'Detaylı Açıklama (EN — Markdown)',
    githubUrl: 'GitHub Depo URL',
    websiteUrl: 'Canlı Site URL',
    accentColor: 'Vurgu Rengi (Hex)',
    save: 'Değişiklikleri Kaydet',
    saving: 'Kaydediliyor…',
    create: 'Projeyi Oluştur',
    creating: 'Oluşturuluyor…',
    deleteConfirm: 'Bu projeyi ve ilişkili tüm sürüm ve medya kayıtlarını silmek istediğinizden emin misiniz?',
    duplicateSlug: 'Bu slug başka bir projede kullanılıyor.',
    back: '← Projelere Dön',
    createdSuccess: 'Proje başarıyla oluşturuldu!',
    createdSuccessDesc: 'Artık içerik, medya ve sürüm bilgilerini yönetebilirsiniz.',
    addFirstRelease: '+ İlk Sürümü Ekle',
    // Workspace tabs
    tabOverview: 'Genel Bakış',
    tabContent: 'İçerik',
    tabMedia: 'Medya',
    tabReleases: 'Sürümler',
    tabSettings: 'Ayarlar',
    // Overview tab
    projectHealth: 'Proje Durumu',
    mediaCountLabel: 'Proje Medyası',
    openGithub: 'GitHub Deposu',
    openWebsite: 'Canlı Site',
    // Media tab
    projectMediaTitle: 'Projeye Ait Medya Dosyaları',
    addMedia: '+ Medya Ekle',
    noProjectMedia: 'Bu projeye ait medya bulunmuyor.',
    noProjectMediaDesc: 'Projeniz için görsel veya video ekleyin.',
    mediaUrl: 'Medya URL',
    mediaType: 'Tür',
    captionTr: 'Açıklama (TR)',
    captionEn: 'Açıklama (EN)',
    // Releases tab
    projectReleasesTitle: 'Proje Sürümleri & Changelog',
    newRelease: '+ Yeni Sürüm',
    editRelease: 'Sürümü Düzenle',
    version: 'Versiyon (örn: v1.0.0)',
    channel: 'Kanal',
    releaseDate: 'Yayın Tarihi',
    changelogTr: 'Değişiklik Notları (TR — Markdown)',
    changelogEn: 'Değişiklik Notları (EN — Markdown)',
    githubReleaseUrl: 'GitHub Release Bağlantısı',
    isCurrent: 'Geçerli Sürüm (Current)',
    noReleases: 'Bu projeye ait henüz sürüm eklenmedi.',
    noReleasesDesc: 'Kullanıcılara sunmak üzere yeni bir sürüm ve changelog yayınlayın.',
    saveRelease: 'Sürümü Kaydet',
    savingRelease: 'Kaydediliyor…',
    createRelease: 'Sürüm Oluştur',
    deleteReleaseConfirm: 'Bu sürüm kaydını silmek istediğinizden emin misiniz?',
    stable: 'Kararlı (Stable)',
    beta: 'Beta',
    experimental: 'Deneysel (Experimental)',
  },
  blog: {
    title: 'Blog Yazıları',
    breadcrumb: 'İçerik / Blog',
    search: 'Yazı ara… (başlık veya slug)',
    newPost: 'Yeni Yazı',
    edit: 'Düzenle',
    delete: 'Sil',
    publish: 'Yayınla',
    unpublish: 'Yayından Kaldır',
    feature: 'Öne Çıkar',
    unfeature: 'Öne Çıkarmayı Kaldır',
    noPosts: 'Henüz blog yazısı bulunmuyor.',
    noPostsDesc: 'Yeni bir yazı oluşturarak düşüncelerinizi ve güncellemelerinizi paylaşın.',
    postTitle: 'Yazı Başlığı',
    postTitleTr: 'Başlık (Türkçe)',
    postTitleEn: 'Başlık (İngilizce)',
    slug: 'Slug (URL Yolu)',
    excerptTr: 'Özet / Spot (Türkçe)',
    excerptEn: 'Özet / Spot (İngilizce)',
    contentTr: 'İçerik (Türkçe — Markdown)',
    contentEn: 'İçerik (İngilizce — Markdown)',
    coverImage: 'Kapak Görseli URL',
    coverImagePlaceholder: 'https://... veya /uploads/...',
    status: 'Durum',
    languages: 'Diller',
    publishedDate: 'Yayın Tarihi',
    published: 'Yayında',
    draft: 'Taslak',
    featured: 'Öne Çıkan',
    tabTr: '🇹🇷 Türkçe',
    tabEn: '🇬🇧 English',
    metadata: 'Yazı Ayarları',
    save: 'Yazıyı Kaydet',
    saving: 'Kaydediliyor…',
    create: 'Yazıyı Oluştur',
    creating: 'Oluşturuluyor…',
    deleteConfirm: 'Bu blog yazısını kalıcı olarak silmek istediğinizden emin misiniz?',
    duplicateSlug: 'Bu slug başka bir yazıda kullanılıyor.',
    back: '← Blog Yazılarına Dön',
  },
  media: {
    title: 'Medya Kütüphanesi',
    breadcrumb: 'Medya / Kütüphane',
    upload: 'Dosya Yükle',
    uploading: 'Yükleniyor…',
    delete: 'Sil',
    deleteConfirm: 'Bu medya dosyasını silmek istediğinizden emin misiniz?',
    noMedia: 'Medya dosyası bulunamadı.',
    noMediaDesc: 'Görsel veya video yüklemek için yukarıdaki alana dosyalarınızı sürükleyin.',
    dragDrop: 'Dosyaları buraya sürükleyin veya seçmek için tıklayın',
    fileSize: 'Boyut',
    fileType: 'Tür',
    maxSize: 'Maksimum dosya boyutu: 50MB (PNG, JPG, WEBP, SVG, MP4, WEBM)',
    invalidType: 'Desteklenmeyen dosya formatı.',
    filterAll: 'Tümü',
    filterImages: 'Görseller',
    filterVideos: 'Videolar',
    copyUrl: 'URL Kopyala',
    copied: 'Kopyalandı!',
  },
  about: {
    title: 'Hakkında Sayfası',
    breadcrumb: 'İçerik / Hakkında',
    titleTr: 'Sayfa Başlığı (TR)',
    titleEn: 'Sayfa Başlığı (EN)',
    contentTr: 'Hakkında İçeriği (TR — Markdown)',
    contentEn: 'Hakkında İçeriği (EN — Markdown)',
    save: 'İçeriği Kaydet',
    saving: 'Kaydediliyor…',
  },
  contact: {
    title: 'İletişim Bağlantıları',
    breadcrumb: 'İçerik / İletişim',
    label: 'Etiket / Başlık',
    url: 'Hedef URL',
    icon: 'İkon Seçimi',
    sortOrder: 'Sıralama Önceliği',
    enabled: 'Aktif / Görünür',
    newLink: 'Yeni Bağlantı',
    edit: 'Düzenle',
    delete: 'Sil',
    deleteConfirm: 'Bu bağlantıyı silmek istediğinizden emin misiniz?',
    noLinks: 'Henüz iletişim bağlantısı eklenmedi.',
    noLinksDesc: 'Sosyal medya veya e-posta bağlantılarınızı ekleyin.',
    save: 'Bağlantıyı Kaydet',
    saving: 'Kaydediliyor…',
  },
  settings: {
    title: 'Site Ayarları',
    breadcrumb: 'Sistem / Ayarlar',
    siteTitleTr: 'Site Başlığı (TR)',
    siteTitleEn: 'Site Başlığı (EN)',
    siteDescTr: 'Site Açıklaması (TR)',
    siteDescEn: 'Site Açıklaması (EN)',
    maintenanceMode: 'Bakım Modu Anahtarı',
    maintenanceOn: 'Bakım Modu Açık (Site Ziyaretçilere Kapalı)',
    maintenanceOff: 'Bakım Modu Kapalı (Site Normal Yayında)',
    save: 'Ayarları Kaydet',
    saving: 'Kaydediliyor…',
  },
  emergency: {
    title: 'Acil Durum Kontrol Merkezi',
    breadcrumb: 'Sistem / Acil Durum',
    warningTitle: 'Kritik Sistem Eylemleri',
    warningDesc: 'Bu sayfadaki eylemler kamuya açık sitenin erişilebilirliğini doğrudan ve anında etkiler. Lütfen dikkatli kullanın.',
    quickMaintenance: 'Hızlı Bakım Modu',
    quickMaintenanceDesc: 'Tüm siteye anında bakım ekranı yerleştirir veya bakımdan çıkararak normal yayını sürdürür.',
    enableMaintenance: 'Siteyi Bakıma Al',
    disableMaintenance: 'Bakım Modunu Kapat (Siteyi Aç)',
    lockdown: 'Acil Kilitleme (Tüm Projeleri Gizle)',
    lockdownDesc: 'Veritabanındaki tüm projeleri anında yayından kaldırarak taslak moduna alır. Kamuya açık hiçbir proje görünmez.',
    lockdownBtn: 'Tüm Projeleri Yayından Kaldır',
    lockdownConfirm: 'DİKKAT: Tüm projeler anında yayından kaldırılacak ve gizlenecektir. Bu acil durum eylemini onaylıyor musunuz?',
    restoreAll: 'Tüm Projeleri Tekrar Yayınla',
    restoreAllDesc: 'Gizlenmiş tüm projeleri toplu olarak tekrar kamuya açık yayına alır.',
    restoreAllBtn: 'Tüm Projeleri Yayına Al',
    restoreAllConfirm: 'Tüm projeler toplu olarak tekrar yayına alınacaktır. Onaylıyor musunuz?',
    statusMaintenance: '● BAKIMDA',
    statusOnline: '● NORMAL YAYINDA',
    statusLocked: '● KİLİTLİ',
    statusUnlocked: '● ERİŞİLEBİLİR',
  },
  common: {
    loading: 'Yükleniyor…',
    error: 'İşlem sırasında bir hata oluştu.',
    success: 'İşlem başarıyla tamamlandı.',
    cancel: 'İptal',
    confirm: 'Onayla',
    accessDenied: 'Erişim Reddedildi',
    accessDeniedMsg: 'Bu yönetim paneline yalnızca yetkili hesap erişebilir.',
    notFound: 'Kayıt bulunamadı.',
    actions: 'İşlemler',
    status: 'Durum',
    updated: 'Son Güncelleme',
  },
};

export const adminEn: AdminDict = {
  nav: {
    dashboard: 'Dashboard',
    content: 'CONTENT',
    pages: 'Pages',
    projects: 'Projects',
    blog: 'Blog',
    about: 'About',
    contact: 'Contact',
    media: 'MEDIA',
    mediaLibrary: 'Media Library',
    system: 'SYSTEM',
    settings: 'Site Settings',
    emergency: 'Emergency',
    account: 'ACCOUNT',
    viewSite: 'View Site',
    logout: 'Logout',
  },
  login: {
    title: 'Admin Login',
    email: 'Email',
    password: 'Password',
    submit: 'Sign In',
    loading: 'Signing in…',
    errorInvalid: 'Invalid email or password.',
    errorNetwork: 'Connection error. Please try again.',
    errorDenied: 'Access denied. Unauthorized account.',
  },
  dashboard: {
    title: 'Dashboard',
    operationsOverview: 'Operations Overview',
    contentGroup: 'Content Status',
    mediaGroup: 'Media Storage',
    releasesGroup: 'Release Management',
    systemGroup: 'System & Security',
    publishedProjects: 'Published Projects',
    draftProjects: 'Draft Projects',
    publishedPosts: 'Published Posts',
    draftPosts: 'Draft Posts',
    mediaCount: 'Media Files',
    latestRelease: 'Latest Release',
    siteStatus: 'Site Status',
    maintenanceStatus: 'Maintenance Status',
    maintenanceOn: '● MAINTENANCE',
    maintenanceOff: '● ONLINE',
    emergencyAlert: 'Use the Emergency Center for critical system actions.',
    goToEmergency: 'Open Emergency Center →',
    noData: 'No data available yet.',
  },
  projects: {
    title: 'Projects',
    breadcrumb: 'Content / Projects',
    search: 'Search projects… (name or slug)',
    newProject: 'New Project',
    manage: 'Manage →',
    edit: 'Edit',
    delete: 'Delete Project',
    publish: 'Publish',
    unpublish: 'Unpublish',
    feature: 'Feature',
    unfeature: 'Unfeature',
    noProjects: 'No projects found.',
    noProjectsDesc: 'Create your first project to start building your portfolio.',
    slug: 'Slug (URL Path)',
    name: 'Project Name',
    status: 'Status',
    featured: 'Featured',
    latestRelease: 'Latest Release',
    shortDescTr: 'Short Description (TR)',
    shortDescEn: 'Short Description (EN)',
    descTr: 'Detailed Description (TR — Markdown)',
    descEn: 'Detailed Description (EN — Markdown)',
    githubUrl: 'GitHub Repo URL',
    websiteUrl: 'Live Website URL',
    accentColor: 'Accent Color (Hex)',
    save: 'Save Changes',
    saving: 'Saving…',
    create: 'Create Project',
    creating: 'Creating…',
    deleteConfirm: 'Are you sure you want to permanently delete this project and all associated releases and media?',
    duplicateSlug: 'This slug is already in use by another project.',
    back: '← Back to Projects',
    createdSuccess: 'Project created successfully!',
    createdSuccessDesc: 'You can now manage content, media, and releases for this project.',
    addFirstRelease: '+ Add First Release',
    // Workspace tabs
    tabOverview: 'Overview',
    tabContent: 'Content',
    tabMedia: 'Media',
    tabReleases: 'Releases',
    tabSettings: 'Settings',
    // Overview tab
    projectHealth: 'Project Health',
    mediaCountLabel: 'Project Media',
    openGithub: 'GitHub Repo',
    openWebsite: 'Live Site',
    // Media tab
    projectMediaTitle: 'Media Files for this Project',
    addMedia: '+ Add Media',
    noProjectMedia: 'No media files added to this project yet.',
    noProjectMediaDesc: 'Attach image or video assets for this project.',
    mediaUrl: 'Media URL',
    mediaType: 'Type',
    captionTr: 'Caption (TR)',
    captionEn: 'Caption (EN)',
    // Releases tab
    projectReleasesTitle: 'Project Releases & Changelog',
    newRelease: '+ New Release',
    editRelease: 'Edit Release',
    version: 'Version (e.g. v1.0.0)',
    channel: 'Channel',
    releaseDate: 'Release Date',
    changelogTr: 'Changelog (TR — Markdown)',
    changelogEn: 'Changelog (EN — Markdown)',
    githubReleaseUrl: 'GitHub Release URL',
    isCurrent: 'Current Release',
    noReleases: 'No releases added for this project yet.',
    noReleasesDesc: 'Publish a new version and changelog for your users.',
    saveRelease: 'Save Release',
    savingRelease: 'Saving…',
    createRelease: 'Create Release',
    deleteReleaseConfirm: 'Are you sure you want to delete this release?',
    stable: 'Stable',
    beta: 'Beta',
    experimental: 'Experimental',
  },
  blog: {
    title: 'Blog Posts',
    breadcrumb: 'Content / Blog',
    search: 'Search posts… (title or slug)',
    newPost: 'New Post',
    edit: 'Edit',
    delete: 'Delete',
    publish: 'Publish',
    unpublish: 'Unpublish',
    feature: 'Feature',
    unfeature: 'Unfeature',
    noPosts: 'No blog posts found.',
    noPostsDesc: 'Create a new post to share your thoughts and updates.',
    postTitle: 'Post Title',
    postTitleTr: 'Title (Turkish)',
    postTitleEn: 'Title (English)',
    slug: 'Slug (URL Path)',
    excerptTr: 'Excerpt / Summary (Turkish)',
    excerptEn: 'Excerpt / Summary (English)',
    contentTr: 'Content (Turkish — Markdown)',
    contentEn: 'Content (English — Markdown)',
    coverImage: 'Cover Image URL',
    coverImagePlaceholder: 'https://... or /uploads/...',
    status: 'Status',
    languages: 'Languages',
    publishedDate: 'Published Date',
    published: 'Published',
    draft: 'Draft',
    featured: 'Featured',
    tabTr: '🇹🇷 Turkish',
    tabEn: '🇬🇧 English',
    metadata: 'Post Settings',
    save: 'Save Post',
    saving: 'Saving…',
    create: 'Create Post',
    creating: 'Creating…',
    deleteConfirm: 'Are you sure you want to permanently delete this blog post?',
    duplicateSlug: 'This slug is already in use by another post.',
    back: '← Back to Blog Posts',
  },
  media: {
    title: 'Media Library',
    breadcrumb: 'Media / Library',
    upload: 'Upload Files',
    uploading: 'Uploading…',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this media file?',
    noMedia: 'No media files found.',
    noMediaDesc: 'Drag and drop image or video files above to upload.',
    dragDrop: 'Drag and drop files here or click to select',
    fileSize: 'Size',
    fileType: 'Type',
    maxSize: 'Max file size: 50MB (PNG, JPG, WEBP, SVG, MP4, WEBM)',
    invalidType: 'Unsupported file format.',
    filterAll: 'All Files',
    filterImages: 'Images',
    filterVideos: 'Videos',
    copyUrl: 'Copy URL',
    copied: 'Copied!',
  },
  about: {
    title: 'About Page',
    breadcrumb: 'Content / About',
    titleTr: 'Page Title (TR)',
    titleEn: 'Page Title (EN)',
    contentTr: 'About Content (TR — Markdown)',
    contentEn: 'About Content (EN — Markdown)',
    save: 'Save Content',
    saving: 'Saving…',
  },
  contact: {
    title: 'Contact Links',
    breadcrumb: 'Content / Contact',
    label: 'Label / Title',
    url: 'Target URL',
    icon: 'Icon Selection',
    sortOrder: 'Sort Priority',
    enabled: 'Active / Visible',
    newLink: 'New Link',
    edit: 'Edit',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this link?',
    noLinks: 'No contact links added yet.',
    noLinksDesc: 'Add links to your social profiles or contact email.',
    save: 'Save Link',
    saving: 'Saving…',
  },
  settings: {
    title: 'Site Settings',
    breadcrumb: 'System / Settings',
    siteTitleTr: 'Site Title (TR)',
    siteTitleEn: 'Site Title (EN)',
    siteDescTr: 'Site Description (TR)',
    siteDescEn: 'Site Description (EN)',
    maintenanceMode: 'Maintenance Mode Switch',
    maintenanceOn: 'Maintenance Mode ON (Site Closed to Visitors)',
    maintenanceOff: 'Maintenance Mode OFF (Site Online)',
    save: 'Save Settings',
    saving: 'Saving…',
  },
  emergency: {
    title: 'Emergency Control Center',
    breadcrumb: 'System / Emergency',
    warningTitle: 'Critical System Actions',
    warningDesc: 'Actions on this page directly and immediately affect public website availability. Please proceed with caution.',
    quickMaintenance: 'Quick Maintenance Mode',
    quickMaintenanceDesc: 'Instantly place or remove the public maintenance banner on the website.',
    enableMaintenance: 'Enable Maintenance Mode',
    disableMaintenance: 'Disable Maintenance Mode (Go Online)',
    lockdown: 'Emergency Lockdown (Hide All Projects)',
    lockdownDesc: 'Immediately unpublish all projects into draft state. No projects will be visible publicly.',
    lockdownBtn: 'Unpublish All Projects',
    lockdownConfirm: 'WARNING: All projects will be immediately unpublished and hidden. Do you confirm this emergency action?',
    restoreAll: 'Restore All Projects to Public',
    restoreAllDesc: 'Bulk restore and publish all projects back to public visibility.',
    restoreAllBtn: 'Publish All Projects',
    restoreAllConfirm: 'All projects will be published back to public status. Do you confirm?',
    statusMaintenance: '● MAINTENANCE',
    statusOnline: '● ONLINE',
    statusLocked: '● LOCKED',
    statusUnlocked: '● ACCESSIBLE',
  },
  common: {
    loading: 'Loading…',
    error: 'An error occurred during operation.',
    success: 'Operation completed successfully.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    accessDenied: 'Access Denied',
    accessDeniedMsg: 'Only the authorized account may access this admin panel.',
    notFound: 'Record not found.',
    actions: 'Actions',
    status: 'Status',
    updated: 'Last Updated',
  },
};

/**
 * Returns the admin dictionary for the given locale.
 * Defaults to Turkish.
 */
export function getAdminDict(locale: AdminLocale = 'tr'): AdminDict {
  return locale === 'en' ? adminEn : adminTr;
}
