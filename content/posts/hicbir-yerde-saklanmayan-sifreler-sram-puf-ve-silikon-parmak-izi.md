---
slug: "hicbir-yerde-saklanmayan-sifreler-sram-puf-ve-silikon-parmak-izi"
title_tr: "Hiçbir Yerde Saklanmayan Şifreler: SRAM-PUF ve Donanımda Silikon Parmak İzi"
title_en: "Hiçbir Yerde Saklanmayan Şifreler: SRAM-PUF ve Donanımda Silikon Parmak İzi"
excerpt_tr: "Gömülü cihazlarda güvenlik anahtarlarını flash belleğe yazmak fiziksel sökme ve tersine mühendislik saldırılarına davetiye çıkarıyor. Çipin üretimindeki mikroskobik kristal kusurlarını benzersiz bir biyometrik parmak izi gibi okuyarak anahtarı yalnızca açılış anında var eden SRAM-PUF mimarisini inceliyoruz."
excerpt_en: "Gömülü cihazlarda güvenlik anahtarlarını flash belleğe yazmak fiziksel sökme ve tersine mühendislik saldırılarına davetiye çıkarıyor. Çipin üretimindeki mikroskobik kristal kusurlarını benzersiz bir biyometrik parmak izi gibi okuyarak anahtarı yalnızca açılış anında var eden SRAM-PUF mimarisini inceliyoruz."
date: "2026-10-25"
tags: ["Donanım", "Mikromimari"]
category: "Donanım & Mimari"
featured: false
published: true
---

Sahada çalışan bir mikrodenetleyicinin, IoT sensörünün veya insansız hava aracının kimliğini doğrulamak istediğinizde gömülü sistem güvenliğinin en kırılgan sorusuyla baş başa kalırsınız: Gizli anahtarı donanımın tam olarak neresinde saklayacaksınız? Standart mühendislik refleksi bu anahtarları mikrokontrolcünün dahili flash belleğine, harici bir EEPROM alanına ya da tek sefer programlanabilir (OTP) donanımsal sigortalara gömmektir.

Cihaz saldırganın fiziksel olarak eline geçtiğinde bu dijital kilitler hızla anlamını yitirir. Çipin kılıfını kimyasal asitlerle eritip silikon yüzeyini açığa çıkarma (decapsulation), elektron mikroskoplarıyla transistör voltajlarını okuma, voltaj sıçratma (voltage glitching) veya güç tüketimini izleyerek yan kanal analizi yapma gibi yöntemler, flash bellekteki bitlerin kopyalanmasını sıradan bir laboratuvar prosedürüne dönüştürür. Bir cihazın anahtarı ele geçirildiğinde sahadaki binlerce kardeş cihazın klonlanması kaçınılmaz hale gelir.

IEEE Nesnelerin İnternetinde Fiziksel Klonlanamaz Fonksiyonlar Raporu çalışmasında ortaya konduğu üzere, çözüm anahtarı daha derin bir kasaya saklamak değil; anahtarı hiçbir yerde saklamamaktır. Yarı iletken fabrikalarında aynı silikon pulu (wafer) üzerinde aynı litografi maskesiyle üretilen iki çip dahi nanometre ölçeğinde birbirinin kopyası olamaz. Oksit tabakasının atomik kalınlığı, silikona eklenen katkı maddelerinin rastgele dağılımı ve transistörlerin eşik voltajları her yongaya taklit edilemez bir fiziksel kimlik kazandırır.

Standart bir statik bellek (SRAM) hücresi birbirine çapraz bağlanmış iki tersleyiciden oluşur. Çipe elektrik verilmediğinde bu hücre tamamen boştur; ancak gücün bağlandığı ilk mikrosaniyede, transistörlerin üretim kusurlarından kaynaklanan mikro dengesizlikler nedeniyle hücre fiziksel olarak ya kararlı bir 0 ya da kararlı bir 1 durumuna düşer.

ETASR ESP32-S3 Üzerinde SRAM-PUF Yanıt Üretimi ve Kriptografik Anahtar Çıkarımı ve A SRAM-PUF-Based ECDSA Authentication Framework - ResearchGate makalelerinde belgelendiği gibi, ESP32-S3 gibi standart tüketici mikrodenetleyicilerinde dahi başlatılmamış SRAM haritası benzersiz ve tekrarlanabilir bir dijital imza üretir.

Cihaz açılır, SRAM'in açılış haritasından hata düzeltme kodları (Fuzzy Extractor) yardımıyla sıcaklık dalgalanmaları elenerek 128 veya 256 bitlik özel anahtar o an fiziksel olarak üretilir; ECDSA ile kimlik doğrulaması yapılır ve anahtar anında bellekten temizlenir. Cihazın elektriği kesildiği anda anahtar evrende fiziksel olarak yok olur. Saldırgan çipi açıp mikroskop problarıyla incelemeye kalktığında ise araya giren parazitik kapasitans transistör dengesini bozar ve silikon parmak izini anında imha eder.

Pahalı harici kripto işlemcilere gerek kalmadan standart çiplerin atomik kusurlarını birer zırha dönüştüren SRAM-PUF yaklaşımı, donanım güvenliğini tersine mühendisliğe karşı silikon fiziği seviyesinde korumanın en radikal alternatifini sunuyor.
