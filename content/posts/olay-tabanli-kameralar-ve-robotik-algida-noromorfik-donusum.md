---
slug: "olay-tabanli-kameralar-ve-robotik-algida-noromorfik-donusum"
title_tr: "Kareleri Unutun: Olay Tabanlı Kameralar ve Robotik Algıda Nöromorfik Dönüşüm"
title_en: "Kareleri Unutun: Olay Tabanlı Kameralar ve Robotik Algıda Nöromorfik Dönüşüm"
excerpt_tr: "Geleneksel kameraların saniyede sabit kare yakalama mantığı, yüksek hızlı robotlarda ve insansız hava araçlarında ciddi bir veri fazlalığı ve işlem gecikmesi yaratıyor. Biyolojik retinayı taklit ederek yalnızca parlaklık değişimlerini milisaniyenin altında aktaran olay tabanlı sensörlerin çalışma prensibini inceliyoruz."
excerpt_en: "Geleneksel kameraların saniyede sabit kare yakalama mantığı, yüksek hızlı robotlarda ve insansız hava araçlarında ciddi bir veri fazlalığı ve işlem gecikmesi yaratıyor. Biyolojik retinayı taklit ederek yalnızca parlaklık değişimlerini milisaniyenin altında aktaran olay tabanlı sensörlerin çalışma prensibini inceliyoruz."
date: "2026-09-22"
tags: ["Robotik", "Kontrol Sistemleri", "Gömülü"]
category: "Robotik & Kontrol"
featured: false
published: true
---

Otonom bir hava aracını dar bir alanda yüksek hızla uçurmaya çalıştığınızda en büyük kısıt genellikle motor gücü ya da gövde ağırlığı değil, standart kamera sensörlerinin çalışma mantığı oluyor. Geleneksel görüntü sensörleri saniyede 30, 60 veya 120 kare yakalayarak sahnedeki her pikseli değişse de değişmese de işlemciye aktarır. Bu yöntem durağan bir sahnede dahi gigabaytlarca gereksiz veriyi veri yollarına boca ederken, hızlı manevralarda hareket bulanıklığı (motion blur) nedeniyle kritik engellerin kaçırılmasına yol açabiliyor.

Çözüm, biyolojik retinanın çalışma prensibini taklit eden olay tabanlı (event-based veya Dynamic Vision Sensor) kameralarda yatıyor. Bu sensörlerde klasik bir deklanşör ya da sabit kare hızı bulunmuyor. Sensör üzerindeki her bir piksel tamamen bağımsız çalışıyor ve yalnızca önündeki parlaklık belirli bir eşiği aştığında tetikleniyor.

Tetiklenen her piksel, mikro saniye düzeyinde bir zaman damgası, piksel koordinatı ve değişimin yönünü (artış veya azalış) içeren hafif bir veri paketi fırlatıyor. MDPI Otonom İHA'larda Olay Tabanlı Görüş İncelemesi araştırmasında vurgulandığı gibi, kamera ve çevre sabitken sistem neredeyse sıfır veri üretirken, aniden yaklaşan bir engel karşısında tepki süresi 1 milisaniyenin altına iniyor. Üstelik 120 dB'yi aşan dinamik aralık sayesinde sensör doğrudan güneşe baktığında bile körleşmiyor.

Elbette bu mimari yazılım tarafında yeni bir düşünce biçimi gerektiriyor. Geleneksel konvolüsyonel sinir ağları (CNN) girdi olarak iki boyutlu matrisler beklerken, olay tabanlı sensörler sürekli bir asenkron zaman serisi üretiyor. Prophesee Olay Tabanlı Algılama Çözümleri gibi modern donanım platformları bu veriyi işlemek için Spiking Neural Networks (SNN) ve grafik tabanlı takip algoritmalarından yararlanıyor.

Uç cihazlarda düşük güçle gerçek zamanlı navigasyon geliştirenler için olay tabanlı algılama, klasik kare tabanlı kameraların işlemciyi boğan hantallığını geride bırakmak adına en somut mimari alternatiflerden biri haline geliyor.
