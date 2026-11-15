---
slug: "mikrodenetleyicinin-akimindan-sifre-calmak-dpa-ve-sabit-zamanli-kod"
title_tr: "Çipin Çektiği Akımdan Şifre Çalmak: Diferansiyel Güç Analizi ve Sabit Zamanlı Kriptografi"
title_en: "Çipin Çektiği Akımdan Şifre Çalmak: Diferansiyel Güç Analizi ve Sabit Zamanlı Kriptografi"
excerpt_tr: "Matematiksel olarak kırılması imkansız kabul edilen şifreleme algoritmaları, fiziksel bir mikrodenetleyicide çalışırken transistörlerin çektiği mikro düzeydeki elektrik akımı üzerinden deşifre edilebiliyor. Diferansiyel Güç Analizi (DPA) saldırılarını ve sabit zamanlı (constant-time) yazılım savunmasını inceliyoruz."
excerpt_en: "Matematiksel olarak kırılması imkansız kabul edilen şifreleme algoritmaları, fiziksel bir mikrodenetleyicide çalışırken transistörlerin çektiği mikro düzeydeki elektrik akımı üzerinden deşifre edilebiliyor. Diferansiyel Güç Analizi (DPA) saldırılarını ve sabit zamanlı (constant-time) yazılım savunmasını inceliyoruz."
date: "2026-10-29"
tags: ["Siber Güvenlik", "Kriptografi"]
category: "Güvenlik & Kriptografi"
featured: false
published: true
---

Bir mikrodenetleyici üzerinde AES-256 veya RSA gibi modern bir şifreleme algoritması çalıştırdığınızda kağıt üzerinde kırılması imkansız bir güvenliğe sahip olduğunuzu varsayarsınız. 256 bitlik bir anahtarı kaba kuvvetle (brute-force) denemek evrenin ömründen daha uzun sürer. Ancak matematiksel denklemler fiziksel bir silikon yongaya indiğinde, doğa kanunları kriptografinin soyut kurallarını geçersiz kılmaya başlar.

Mikrodenetleyicilerde kullanılan CMOS mantık kapıları, durum değiştirmedikleri sürece neredeyse hiç elektrik tüketmez. Ancak bir transistör 0 durumundan 1 durumuna geçtiğinde, kapı kapasitansını şarj etmek için mikro saniyenin altında küçük bir akım çeker. İşlemci bir bayt işlerken o baytın içindeki 1'lerin sayısı (Hamming ağırlığı) ne kadar fazlaysa, besleme hattından o kadar yüksek bir analog akım dalgalanması geçer.

Side-Channel Attacks in 2026: Patching Power-Analysis Vulnerabilities Exclusively via Firmware raporunda açıklandığı üzere, saldırganın çipi sökmesine veya mikro mimarisini kırmasına gerek yoktur. Mikrodenetleyicinin besleme bacağına seri bir direnç bağlayıp osiloskopla güç profilini dinlemek yeterlidir.

Cihaza binlerce farklı şifreli paket gönderilir ve her işlemdeki akım dalgası kaydedilir. Korelasyon Güç Analizi (CPA) algoritmaları bu sinyalleri olası anahtar tahminleriyle istatistiksel olarak karşılaştırır. Doğru anahtar tahmini yapıldığında akım grafiğinde beliren küçük korelasyon piki, matematiksel olarak kırılmaz sanılan anahtarın dakikalar içinde açığa çıkmasına yol açar.

Power Analysis Side Channel Attacks and Countermeasures for IoT - ResearchGate araştırmasında vurgulandığı gibi, en büyük açıklar programcının yazdığı görünüşte masum kod bloklarından sızar. Örneğin if (key_bit == 1) gibi bir koşul ifadesi, işlemcinin farklı saat çevrimleri tüketmesine ve önbellek gecikmelerine sebep olur. Saldırgan sadece harcanan zamana ve güç eğrisine bakarak anahtarın bitlerini tek tek okuyabilir.

Power Side-Channel Attack Analysis Review - MDPI derlemesinde incelenen yazılımsal savunma yöntemleri iki temel sütuna dayanır:

Sabit Zamanlı (Constant-Time) Kodlama: Kriptografik işlemlerde asla gizli veriye bağlı if, while veya dizi indeksi kullanılmaz. Koşullar mantıksal bit maskeleriyle (mask = -(condition)) her senaryoda tam olarak aynı saat çevriminde ve aynı işlemci komutlarıyla işletilir.

Boole Maskeleme (Masking): Hassas veri işlemciye girmeden önce donanımsal rastgele sayı üreteciyle oluşturulan bir maskeyle harmanlanır. Transistörün çektiği akım gerçek anahtara değil rastgele gürültüye bağlı hale gelir ve istatistiksel korelasyon tamamen sıfırlanır.

Gömülü donanım güvenliği yalnızca soyut algoritmaların doğruluğuna değil; transistörlerin fiziksel dünyada bıraktığı elektriksel ve zamansal ayak izlerini gizleyebilme disiplinine dayanıyor.
