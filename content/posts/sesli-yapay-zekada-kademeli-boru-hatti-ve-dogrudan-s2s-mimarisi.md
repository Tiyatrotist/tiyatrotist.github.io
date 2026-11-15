---
slug: "sesli-yapay-zekada-kademeli-boru-hatti-ve-dogrudan-s2s-mimarisi"
title_tr: "Metin Araya Girince: Sesli Yapay Zekâda Kademeli Boru Hattı ile Doğrudan S2S Çatışması"
title_en: "Metin Araya Girince: Sesli Yapay Zekâda Kademeli Boru Hattı ile Doğrudan S2S Çatışması"
excerpt_tr: "Geleneksel sesli asistanlarla konuşurken hissedilen o mekanik duraksama, sesi önce metne sonra tekrar sese çeviren üç aşamalı boru hattından kaynaklanıyor. Akustik dalgaları doğrudan diskret ses token'larıyla işleyen yerel uçtan uca (speech-to-speech) mimarisinin sunduğu gecikme ve tonlama avantajlarını inceliyoruz."
excerpt_en: "Geleneksel sesli asistanlarla konuşurken hissedilen o mekanik duraksama, sesi önce metne sonra tekrar sese çeviren üç aşamalı boru hattından kaynaklanıyor. Akustik dalgaları doğrudan diskret ses token'larıyla işleyen yerel uçtan uca (speech-to-speech) mimarisinin sunduğu gecikme ve tonlama avantajlarını inceliyoruz."
date: "2026-09-29"
tags: ["Yapay Zeka", "Derin Öğrenme"]
category: "Yapay Zeka"
featured: false
published: true
---

Akıllı telefonlardaki veya bilgisayarlardaki sesli asistanlarla iletişim kurarken her cümlenin ardından garip bir sessizlik yaşanır. Soruyu sorarsınız, karşı taraf yaklaşık bir saniye bekler ve ardından mekanik bir tonlamayla yanıt verir. Bu yapay gecikmenin temel sebebi yapay zekânın düşünme hızı değil, arkada çalışan kademeli (cascaded) boru hattı mimarisidir.

Yıllardır kullanılan standart sesli yapay zekâ altyapısı üç ayrı bağımsız modelin art arda dizilmesiyle kurulur:

Sesi metne dönüştüren konuşma tanıma modeli (STT).

Üretilen metni okuyup yanıt üreten büyük dil modeli (LLM).

Bu yanıt metnini sese çeviren konuşma sentezleyici (TTS).

Her aşama kendi tampon belleğini (buffer) doldurmak ve hesaplama yapmak zorunda olduğu için sistemin toplam gecikmesi 600 ila 800 milisaniyenin altına kolay kolay inemez. İnsanlar arası doğal bir sohbette ise ortalama yanıt aralığı 200 milisaniye civarındadır. Inworld Kademeli ve Uçtan Uca Ses Mimarisi Karşılaştırması raporunda belirtildiği gibi, aradaki bu yarım saniyelik fark beynimizin konuşmayı doğal bir diyalog yerine telsiz anonsu gibi algılamasına neden olur.

Daha da kritik olan problem ise bilgi kaybıdır. Bir ses dalgası metne dönüştürüldüğünde tonlama, alaycılık, nefes, fısıltı, tereddüt veya vurgu gibi sesin taşıdığı anlamsal bilginin yarısından fazlası filtrelenip çöpe atılır. Dil modeli yalnızca düz harfleri görür ve kullanıcının acelesi mi var yoksa sinirli mi olduğunu anlayamaz.

Bu tıkanıklığı aşan yeni nesil çözüm, doğrudan sesle beslenip ses üreten yerel (speech-to-speech / S2S) modeller oldu. arXiv Gerçek Zamanlı Ses Ajanları Mimarisi çalışmasında ele alınan bu sistemlerde aradaki metin katmanı tamamen devreden çıkarılıyor. Ses dalgaları artık vektör kuantizasyonu (RVQ) ile doğrudan diskret akustik token'lara çevriliyor. Model, sesin tınısını ve frekansını kendi sinir ağlarında doğrudan kavrayıp yanıtı da aynı şekilde doğrudan ses token'ları olarak fırlatıyor.

Inworld Gerçek Zamanlı Ses API İncelemesi testlerinde görüldüğü üzere bu mimari toplam gecikmeyi 160 ila 250 milisaniye bandına çekerek konuşma sırasında araya girme (barge-in / interruption) gibi insani dinamikleri mümkün kılıyor. Karşı taraf konuşurken sözünü kestiğinizde model saniyenin beşte birinde bunu algılayıp susabiliyor.

Elbette kademeli mimarinin kurumsal tarafta sağladığı avantajlar hala mevcut; metin seviyesinde güvenlik filtreleri koymak ve harici araçları (API) çağırmak hala metin tabanlı sistemlerde daha ucuz ve öngörülebilir. Ancak kullanıcı deneyimi ve gerçek zamanlı insan etkileşimi söz konusu olduğunda, metin soyutlamasını aradan çıkaran doğrudan ses mimarileri sesli bilişimin geleceğini şekillendiriyor.
