---
slug: "gercek-zamanli-isin-izlemenin-kalbi-restir-ve-rezervuar-orneklemesi"
title_tr: "Piksel Başına Tek Işınla Gerçekçi Aydınlatma: ReSTIR Algoritması"
title_en: "Piksel Başına Tek Işınla Gerçekçi Aydınlatma: ReSTIR Algoritması"
excerpt_tr: "Sinema kalitesinde ışın izleme piksellerde binlerce hesaplama gerektirirken 60 FPS oyunlarda piksel başına yalnızca bir veya iki ışın fırlatılabiliyor. Komşu piksellerden ve önceki karelerden ışık numunesi ödünç alarak gürültüyü yok eden ReSTIR mimarisini inceliyoruz."
excerpt_en: "Sinema kalitesinde ışın izleme piksellerde binlerce hesaplama gerektirirken 60 FPS oyunlarda piksel başına yalnızca bir veya iki ışın fırlatılabiliyor. Komşu piksellerden ve önceki karelerden ışık numunesi ödünç alarak gürültüyü yok eden ReSTIR mimarisini inceliyoruz."
date: "2026-11-04"
tags: ["Grafik Mimarisi", "GPU", "Işın İzleme (Ray Tracing)"]
category: "Grafik & Render"
featured: false
published: true
---

Üç boyutlu bir animasyon filmini render ederken bilgisayarlar her bir piksel için binlerce ışın fırlatır (samples per pixel). Monte Carlo integrali matematiksel olarak yüzlerce ışının ortalamasını alarak kusursuz bir küresel aydınlatma (Global Illumination) ve gölge dengesi kurar. Ancak saniyede 60 veya 120 kare hızında koşan dinamik bir oyunda GPU'nun her kare için yalnızca 8 ila 16 milisaniyelik bir zaman bütçesi vardır. En güçlü ekran kartlarında dahi piksel başına fırlatılabilecek ışın sayısı bir veya ikiyi geçemez.

Piksel başına yalnızca bir ışın fırlattığınızda ekranda yoğun bir tuz-biber gürültüsü (noise) oluşur. Yüzlerce ışık kaynağının bulunduğu karmaşık bir sahnede fırlatılan tek ışının en doğru ışık kaynağına çarpma ihtimali tamamen tesadüflere kalır. Geleneksel gürültü gidericiler (denoiser) pikselleri mekansal olarak bulanıklaştırarak temizlemeye çalışsa da, dinamik hareket anlarında ince gölge detayları erir, hareket izleri (ghosting) ve lekelenmeler ortaya çıkar.

Understanding The Math Behind ReSTIR GI - A Graphics Guy's Note teknik analizinde detaylandırıldığı üzere, Reservoir-based Spatio-Temporal Importance Resampling (ReSTIR) algoritması bu çıkmazı istatistiksel bir numune takasıyla çözer. Piksel onlarca ışının yolunu bellekte tutmaz; Rezervuar (Reservoir) adı verilen ve yalnızca seçilen ışık numunesini, ağırlık toplamını ve numune sayısını tutan mikroskobik bir veri yapısı taşır.

Sistem ışık hesaplamasını iki aşamada zenginleştirir:

Zamansal Yeniden Kullanım (Temporal Reuse): Piksel, hareket vektörlerini (G-Buffer) kullanarak kameranın bir önceki karede baktığı konumu bulur ve kendi rezervuarını bir önceki karenin rezervuarıyla birleştirir. Sahne aniden değişmediği sürece geçmiş karelerin ışık bilgisi sıfır ek maliyetle bugüne taşınır.

Uzamsal Yeniden Kullanım (Spatial Reuse): Piksel kendi yüzey normallerini ve derinliğini kontrol ederek aynı yüzeydeki komşu piksellerin rezervuarlarıyla el sıkışır. Dört ila sekiz komşu pikselin en verimli ışık numuneleri tek bir havuzda harmanlanır.

Area ReSTIR: Resampling for Real-Time Defocus and Antialiasing - ResearchGate ve ToF ReSTIR: Time-of-Flight Rendering with Spatio-temporal Reuse - arXiv çalışmalarında gösterildiği gibi, ReSTIR rezervuar birleştirme adımları sayesinde yalnızca tek bir ışın fırlatmış bir piksel, saniyeler içinde binlerce ışın fırlatılmış gibi doğru bir istatistiksel ağırlığa ulaşır. Önceden fırınlanmış (baked) ışık haritalarına ihtiyaç duymadan, sayısız dinamik ışık kaynağının bulunduğu sahnelerde dahi anlık ve fiziksel olarak tutarlı küresel aydınlatma elde edilir.

Unreal Engine Lumen ve modern RTX oyun motorlarının temel taşı haline gelen ReSTIR, oyun grafiklerinde kaba kuvvetle ışın sayısını artırmak yerine matematiksel olasılık teorisiyle mevcut ışığı pikseller arasında paylaştırmanın en zarif algoritmasını sunuyor.
