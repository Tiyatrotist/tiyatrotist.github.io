---
slug: "can-busin-sonu-10base-t1s-ve-tek-cift-kablolu-ethernet"
title_tr: "Kırk Yıllık CAN Bus Saltanatının Sonu: 10BASE-T1S ve Tek Çift Kablolu Ethernet"
title_en: "Kırk Yıllık CAN Bus Saltanatının Sonu: 10BASE-T1S ve Tek Çift Kablolu Ethernet"
excerpt_tr: "Robotik sistemlerde ve otomotivde kullanılan geleneksel CAN veri yolu, artan sensör trafiği ve karmaşık ağ geçitleri karşısında tıkandı. Tek bir bükümlü bakır çifti üzerinden deterministik 10 Mbps hız ve uçtan uca doğrudan IP iletişimi sağlayan 10BASE-T1S standardını inceliyoruz."
excerpt_en: "Robotik sistemlerde ve otomotivde kullanılan geleneksel CAN veri yolu, artan sensör trafiği ve karmaşık ağ geçitleri karşısında tıkandı. Tek bir bükümlü bakır çifti üzerinden deterministik 10 Mbps hız ve uçtan uca doğrudan IP iletişimi sağlayan 10BASE-T1S standardını inceliyoruz."
date: "2026-10-12"
tags: ["Ağ Mimarisi", "Protokoller"]
category: "Ağ & Protokoller"
featured: false
published: true
---

Modern bir otomobilin gövdesini veya çok eksenli bir endüstriyel robotu incelediğinizde sensörleri, motor sürücülerini ve kontrol kartlarını birbirine bağlayan değişmez bir omurga görürsünüz: CAN (Controller Area Network) Bus. Bosch tarafından 1980'lerde geliştirilen bu iki telli diferansiyel hat; elektromanyetik gürültüye karşı yüksek direnci ve mesaj kimliğine dayalı donanımsal önceliklendirmesiyle kırk yıl boyunca gömülü sistemlerin rakipsiz standardı oldu.

Ancak günümüzün otonom sistemlerinde ve akıllı robotlarında bu mimari ciddi bir fiziksel sınıra çarptı. Klasik CAN 1 Mbps hızında tıkanırken, güncel CAN FD standardı dahi en fazla 5 ila 8 Mbps bant genişliği ve 64 baytlık paket boyutu sunabiliyor. Uçuş kontrolcülerine, robotik eklemlere ve otonom araçlara bağlanan onlarca radar, ultrasonik sensör ve yüksek çözünürlüklü enkoder saniyede megabaytlarca veri üretirken CAN veri yolları aşırı yük altında kilitleniyor.

Daha da büyük sorun ise yazılımsal uyumsuzluktur. CAN paketleri doğrudan IP tabanlı değildir. Bu verilerin merkezi bir Linux bilgisayarla, ROS 2 altyapısıyla veya bulut servisleriyle konuşabilmesi için araya sürekli pahalı mikrodenetleyici çeviriciler (gateway) koymak gerekir. Bu çeviriciler hem araç kablo demetine ağırlık katar hem de sisteme fazladan gecikme ekler.

PEAK-System Otomotiv Etherneti ve 10BASE-T1S Temelleri kılavuzunda açıklandığı üzere, IEEE 802.3cg standardıyla gelen Tek Çift Kablolu Ethernet (Single Pair Ethernet / SPE) bu açığı kapatıyor. Standart Ethernet'in ağır ve hantal 4 çiftli (8 telli) CAT kabloları yerine, CAN gibi yalnızca tek bir bükümlü bakır çifti üzerinden 10 Mbps hız sağlıyor.

10BASE-T1S ile CAN Karşılaştırması - Simma Software teknik incelemesinde vurgulanan en kritik yenilik ise PLCA (Physical Layer Collision Avoidance) mekanizmasıdır. Klasik Ethernet'in paket çakıştığında bekleme (CSMA/CD backoff) belirsizliği bu protokolde tamamen kaldırılmıştır. Düğümler pahalı ağ anahtarlarına (switch) ihtiyaç duymadan tek bir hat üzerine (multidrop bus, 25 metreye kadar en az 8 düğüm) bağlanır ve sıra tabanlı deterministik bir zaman dilimi kullanarak çarpışmasız, mikrosaniye düzeyinde garantili veri iletir.

Yarı İletken Mühendisliği 10BASE-T1S ve Otomotiv Etherneti Raporu analizinin altını çizdiği en büyük dönüşüm, her küçük sensörün doğrudan yerel birer IPv6 adresine kavuşmasıdır.

Artık gömülü ağlarda özel protokol dönüştürücülere ihtiyaç kalmıyor. Ana bilgisayardaki bir Linux süreci, en uç noktadaki bir sıcaklık sensörüne veya motor sürücüsüne doğrudan standart UDP/TCP soketleriyle bağlanabiliyor. Tek bir bükümlü tel üzerinde sağlanan bu uçtan uca IP bütünlüğü, gömülü donanım mimarisinde kırk yıllık CAN hegemonyasını resmen sona erdiriyor.
