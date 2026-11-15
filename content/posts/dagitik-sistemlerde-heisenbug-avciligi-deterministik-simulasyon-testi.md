---
slug: "dagitik-sistemlerde-heisenbug-avciligi-deterministik-simulasyon-testi"
title_tr: "Aylarca Sürecek Hataları Beş Dakikada Yakalamak: Deterministik Simülasyon Testi"
title_en: "Aylarca Sürecek Hataları Beş Dakikada Yakalamak: Deterministik Simülasyon Testi"
excerpt_tr: "Dağıtık sistemlerde ve çok oyunculu sunucularda yaşanan ağ bölünmeleri ile eşzamanlılık hatalarını geleneksel birim testleriyle yakalamak neredeyse imkansızdır. Zamanı, diski ve ağı tek bir rastgele tohum (seed) üzerinden simüle ederek yılların kaosunu dakikalara sığdıran Deterministik Simülasyon Testi (DST) mimarisini inceliyoruz."
excerpt_en: "Dağıtık sistemlerde ve çok oyunculu sunucularda yaşanan ağ bölünmeleri ile eşzamanlılık hatalarını geleneksel birim testleriyle yakalamak neredeyse imkansızdır. Zamanı, diski ve ağı tek bir rastgele tohum (seed) üzerinden simüle ederek yılların kaosunu dakikalara sığdıran Deterministik Simülasyon Testi (DST) mimarisini inceliyoruz."
date: "2026-11-14"
tags: ["Dağıtık Sistemler", "Sistem Mimarisi", "Simülasyon", "Yazılım Testi"]
category: "Dağıtık Sistemler"
featured: true
published: true
cover_image: "/blog/gemini/gemini_captured_1.png"
---

Dağıtık bir veritabanı, blokzincir düğümü veya çok oyunculu bir oyun sunucusu geliştirirken mühendislerin en çok korktuğu hata türü kodun sözdiziminde saklı olanlar değildir. Asıl kabus, yalnızca üretim ortamında ayda bir kez tetiklenen ve yerel bilgisayarda asla tekrarlanamayan eşzamanlılık hatalarıdır (Heisenbugs). İki sunucu arasındaki ağ bağlantısının tam bir disk yazma işlemi ortasında kopması, sistem saatlerinin birkaç milisaniye kayması ve aynı anda bir sektörde bit bozulması yaşanması gibi milyonda bir gerçekleşen senaryolar klasik birim (unit) ve entegrasyon testlerinden her zaman kaçar.

Deterministic simulation testing - Antithesis belgelerinde incelendiği üzere, geleneksel testlerin bu noktada çaresiz kalmasının nedeni gerçek dünyanın deterministik olmamasıdır. İşletim sisteminin iş parçacığı zamanlayıcısı, ağ kartının gecikmesi, diske yazma sırası ve rastgele sayı üreteçleri her çalıştırmada farklı bir zamanlama üretir. Canlı sunucuda gece yarısı oluşan bir veri bozulması hatasını sabah kendi makinenizde yeniden üretmeye çalıştığınızda hata buharlaşır.

İlk olarak FoundationDB ekibinin popülerleştirdiği ve bugün modern altyapıların kalbine yerleşen Deterministik Simülasyon Testi (DST), bu belirsizliği kökten tersine çevirir. Felsefe basittir: Test edilen sistemin çevresindeki tüm belirsiz fiziksel katmanları (ağ, disk I/O, sistem saati ve rastgelelik) tamamen soyutlayıp tek iş parçacıklı (single-threaded) ve deterministik bir simülatörün içine hapsetmek.

Protocol-Aware Deterministic Simulation Testing - TigerBeetle raporunda detaylandırılan VOPR (Viewstamped Operation Replicator) simülatöründe, normalde bağımsız fiziksel sunucularda çalışması gereken altı ayrı veritabanı düğümü tek bir yerel sürecin içinde koşar. Sistem saati gerçek kronometreden koparılır; simüle edilmiş zaman saniyeler içinde ayları ve yılları atlayabilir.

Simülatör, sisteme tek bir 64 bitlik başlangıç tohumu (PRNG seed) üzerinden sürekli kaotik arızalar enjekte eder:

Ağ paketlerini rastgele geciktirir, sırasını bozar veya iki düğüm arasındaki bağı koparır.

Disk yazma işlemlerini yarıda keser ve dosyaların ortasında rastgele bit çevirmeleri (bit flips) oluşturur.

Düğümleri rastgele anlarda öldürüp tekrar başlatır ve saat kaymaları (clock skew) üretir.

An approach to deterministic simulation testing in Rust - FOSDEM 2026 ve Deterministic Simulation Testing in Diskless Apache Kafka - Aiven sunumlarında vurgulanan asıl güç ise hatanın yakalandığı anda ortaya çıkar. Simülatör beş dakikalık bir koşuda on yıllık kaosu tarayıp nadir bir mutabakat açığı yakaladığında, size sadece o testi başlatan tohum numarasını verir. Geliştirici aynı numarayı bilgisayarına yazdığında, hataya yol açan mikrosaniyelik paket sırasını ve bellek durumunu birebir aynı şekilde sonsuz kez yeniden oynatıp hata ayıklayabilir.

Dağıtık sistemlerde güvenilirliği şansa veya üretim ortamındaki kullanıcı şikayetlerine bırakmak yerine zamanı ve arızaları deterministik bir koda dönüştürmek, karmaşık yazılımları matematiksel bir kesinlikle test etmenin en sağlam yolunu sunuyor.
