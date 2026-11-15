---
slug: "bluetooth-6-channel-sounding-ve-uwb-konumlandirma-savasi"
title_tr: "Sinyal Gücünün Ötesi: Bluetooth 6.0 Channel Sounding ve UWB Rekabeti"
title_en: "Sinyal Gücünün Ötesi: Bluetooth 6.0 Channel Sounding ve UWB Rekabeti"
excerpt_tr: "Kapalı alanlarda santimetre hassasiyetinde konum belirlemek uzun süre pahalı UWB yongalarına bağımlı kaldı. Bluetooth 6.0 ile gelen Channel Sounding özelliği, faz tabanlı mesafe ölçümüyle standart kablosuz donanımlarda yüksek doğruluk sağlayarak donanım maliyetlerini aşağı çekiyor."
excerpt_en: "Kapalı alanlarda santimetre hassasiyetinde konum belirlemek uzun süre pahalı UWB yongalarına bağımlı kaldı. Bluetooth 6.0 ile gelen Channel Sounding özelliği, faz tabanlı mesafe ölçümüyle standart kablosuz donanımlarda yüksek doğruluk sağlayarak donanım maliyetlerini aşağı çekiyor."
date: "2026-09-23"
tags: ["Ağ Mimarisi", "Protokoller", "Bluetooth"]
category: "Ağ & Protokoller"
featured: false
published: true
---

Kapalı mekanlarda hareket eden bir robotun, takip cihazının veya el konsolunun konumunu santimetre hassasiyetinde hesaplamak gömülü sistemlerin en sancılı problemlerinden biridir. Yıllar boyunca standart Bluetooth altyapısında başvurulan alınan sinyal gücü göstergesi (RSSI), duvardan seken sinyaller ve ortamdaki metal engeller yüzünden metrelerce sapan tahminler üreterek geliştiricileri hayal kırıklığına uğrattı.

Bu güvenilmezliği aşmak isteyen endüstri, Ultra-Wideband (UWB) teknolojisine yöneldi. Pikosaniye hassasiyetinde sinyal uçuş süresi (Time of Flight) ölçen UWB, 10 santimetrenin altına inen doğruluğuyla akıllı anahtarlardan depo otomasyonuna kadar standart haline geldi. Ancak Kapalı Mekan Konumlandırma İncelemesi verilerinin de gösterdiği gibi, UWB çiplerinin yüksek maliyeti, çoklu anten gereksinimi ve karmaşık patent lisanslama süreçleri özellikle bağımsız donanım geliştiricileri için ciddi bir bariyer oluşturdu.

Bluetooth 6.0 standardıyla duyurulan Channel Sounding ise bu denklemi doğrudan değiştiriyor. Teknoloji, standart 2.4 GHz bandında iki ayrı yöntemi bir araya getiriyor: Faz Tabanlı Mesafe Ölçümü (PBR) ve Yuvarlak Seyahat Süresi (RTT). Karşılıklı iki telsiz yongası birden fazla alt frekansta sinyal alışverişi yaparak gelen dalgaların faz kaymasını ölçüyor. Bu sayede yansımalardan kaynaklanan sinyal kirliliği filtreleniyor ve standart BLE yongalarıyla santimetre seviyesinde kararlı mesafe verisi elde edilebiliyor.

Gömülü sistemler ve donanım prototipleme açısından fark doğrudan cüzdana yansıyor. BLE 6.0 vs UWB Hassasiyet ve Maliyet Analizi saha raporuna göre, Channel Sounding destekli etiketlerin birim maliyeti 3 ila 8 dolar seviyesinde kalırken eşdeğer UWB modülleri 15 ila 20 dolar bandında seyrediyor.

Milisaniye altı güvenlik duvarı gerektiren otomotiv kilitlerinde UWB varlığını sürdürecek olsa da, mikrodenetleyici tabanlı robotik projeler, iç mekan navigasyonu ve varlık takibinde Bluetooth 6.0 pahalı ek donanım zorunluluğunu ortadan kaldıran güçlü bir alternatif sunuyor.
