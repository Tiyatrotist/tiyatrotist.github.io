---
slug: "internetsiz-iletisim-lora-mesh-aglari-ve-yonlendirme-paradoksu"
title_tr: "İnternetsiz İletişim: LoRa Mesh Ağları ve Kısıtlı Bantta Yönlendirme Paradoksu"
title_en: "İnternetsiz İletişim: LoRa Mesh Ağları ve Kısıtlı Bantta Yönlendirme Paradoksu"
excerpt_tr: "Hücresel şebekelerin veya internet omurgasının devre dışı kaldığı afet senaryolarında düşük güçlü telsiz ağları hayati önem taşıyor. Kilometrelerce menzile sahip LoRa donanımlarında klasik IP yönlendirmesinin neden çöktüğünü ve denetimli sel baskını (managed flooding) mekanizmasının nasıl çalıştığını inceliyoruz."
excerpt_en: "Hücresel şebekelerin veya internet omurgasının devre dışı kaldığı afet senaryolarında düşük güçlü telsiz ağları hayati önem taşıyor. Kilometrelerce menzile sahip LoRa donanımlarında klasik IP yönlendirmesinin neden çöktüğünü ve denetimli sel baskını (managed flooding) mekanizmasının nasıl çalıştığını inceliyoruz."
date: "2026-09-28"
tags: ["Ağ Mimarisi", "Protokoller"]
category: "Ağ & Protokoller"
featured: false
published: true
---

Modern internet mimarisi veri bolluğu üzerine inşa edilmiştir. Bir yönlendirici (router) komşularıyla sürekli durum paketleri (heartbeat) paylaşır, ağ topolojisini haritalar ve paketleri OSPF ya da BGP gibi algoritmalarla en kısa yoldan iletir. Ancak baz istasyonlarının sustuğu, elektriğin kesildiği ve iletişimin yalnızca pilli mikrodenetleyicilere kaldığı bir afet senaryosunda bu protokollerin tamamı işlevsiz kalır.

Son dönemde açık kaynak donanım topluluklarında hızla yayılan Meshtastic gibi LoRa mesh projeleri bu kısıtlı ortamda tamamen farklı bir kurallar dizisi işletiyor. Türkiye ve Avrupa regülasyonlarında kullanılan 868 MHz bandında bant genişliği saniyede birkaç yüz bayt ile sınırlıdır. Daha da önemlisi, yasal olarak bir cihazın frekansı meşgul etme süresi (duty cycle) genellikle yüzde 1 ile kısıtlanmıştır; yani bir saat içinde havaya toplamda en fazla 36 saniye sinyal basabilirsiniz.

Bu dar boğazda klasik bir yönlendirme tablosu oluşturmaya kalktığınızda, cihazların birbirine gönderdiği "ben buradayım" sinyalleri daha ilk dakikada izin verilen havada kalma süresini (airtime) tüketir ve ağı kilitler. RF Guru Frekans ve Havada Kalma Süresi Analizi üzerinde gösterildiği gibi, havada çarpışan paketler (collision) yüzünden iletim oranları hızla sıfıra yaklaşır.

Meshtastic mimarları bu problemi çözmek için dinamik yönlendirme tablolarını tamamen bir kenara bıraktı. Meshtastic Neden Denetimli Sel Baskını Kullanır makalesinde ve Meshtastic Yönlendirme Algoritması Belgeleri sayfalarında açıklandığı üzere, sistem "denetimli sel baskını" (managed flood routing) adı verilen bir mantıkla çalışır.

Bir düğüm mesaj gönderdiğinde, mesajın içine rastgele bir paket kimliği ve maksimum atlama sınırı (hop limit, genellikle 3 ila 5) eklenir. Mesajı duyan komşu düğüm, paketin kimliğini kendi yerel önbelleğinde sorgular. Eğer bu paketi daha önce duymamışsa, kanaldaki diğer yayınlarla çakışmamak için rastgele bir milisaniye süresince (backoff) bekler ve ardından paketi olduğu gibi tekrar havaya fırlatır. Atlama sayısı sıfıra ulaştığında paket sönümlenir.

arXiv Meshtastic Tabanlı LoRa Mesh İncelemesi araştırması, bu basit gibi görünen mekanizmanın karmaşık yönlendirme sunucularına ihtiyaç duymadan dağlık arazilerde veya şehir içinde onlarca kilometrelik bir iletişim koridoru açabildiğini ortaya koyuyor. Pahalı baz istasyonlarına ya da uydulara bağımlı olmadan çalışan bu tür hafif protokoller, kriz anlarında bağımsız ve dayanıklı bir iletişim altyapısı kurmanın anahtarını sunuyor.
