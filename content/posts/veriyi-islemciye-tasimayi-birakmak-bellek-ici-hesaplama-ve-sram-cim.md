---
slug: "veriyi-islemciye-tasimayi-birakmak-bellek-ici-hesaplama-ve-sram-cim"
title_tr: "Veriyi İşlemciye Taşımayı Bırakmak: Bellek İçi Hesaplama (CIM) Devrimi"
title_en: "Veriyi İşlemciye Taşımayı Bırakmak: Bellek İçi Hesaplama (CIM) Devrimi"
excerpt_tr: "Yapay zekâ modellerinde enerjinin yüzde sekseninden fazlası matematiksel hesaplamalara değil, ağırlıkları bellekten işlemciye taşımaya harcanıyor. Hesaplamayı doğrudan SRAM bellek hücrelerinin bit hatlarında fizik kanunlarıyla gerçekleştiren Bellek İçi Hesaplama (Compute-in-Memory) mimarisini inceliyoruz."
excerpt_en: "Yapay zekâ modellerinde enerjinin yüzde sekseninden fazlası matematiksel hesaplamalara değil, ağırlıkları bellekten işlemciye taşımaya harcanıyor. Hesaplamayı doğrudan SRAM bellek hücrelerinin bit hatlarında fizik kanunlarıyla gerçekleştiren Bellek İçi Hesaplama (Compute-in-Memory) mimarisini inceliyoruz."
date: "2026-11-11"
tags: ["Donanım", "Mikromimari"]
category: "Donanım & Mimari"
featured: false
published: true
---

1945 yılında John von Neumann tarafından temelleri atılan modern bilgisayar mimarisi, bilişim dünyasını değişmez iki kampa ayırdı: Verinin saklandığı bellek (RAM) ve verinin işlendiği aritmetik mantık birimi (ALU). Seksen yıl boyunca bu iki kutup birbirine bir veri yoluyla (bus) bağlandı. Ancak günümüzün milyarlarca parametreli derin öğrenme modellerinde bu klasik ayrım sürdürülemez bir enerji duvarına çarptı.

Bir yapay zekâ modelinde matris çarpımı yaparken harcanan enerjinin büyük bölümü matematiksel toplama veya çarpma işlemine gitmez. Asıl enerji, 32 bitlik bir sayıyı silikon üzerindeki mikroskobik veri yollarından geçirip bellekten işlemci kayıtlarına taşırken harcanır. Bir sayıyı bellekten çekmek, o sayıyı çarpmaktan 100 ila 1000 kat daha fazla elektrik tüketir. Saat frekanslarını artırmak veya transistörleri küçültmek bu temel fiziksel gerçeği değiştirmiyor.

SRAM-Based CiM: In-Memory Computation Mimarisi ve İncelemesi (2026) raporunda ortaya konduğu gibi, Bellek İçi Hesaplama (Compute-in-Memory / CIM) yaklaşımı bu veri taşıma vergisini tamamen reddediyor. Felsefe basittir: Veriyi işlemciye taşımak yerine, hesaplamayı doğrudan verinin saklandığı bellek hücrelerinin (özellikle SRAM dizilerinin) içinde gerçekleştirmek.

Klasik bir SRAM hücresi sadece bir biti saklar. Ancak analog CIM mimarisinde belleğin kelime hatlarına (wordlines) aynı anda birden fazla voltaj sinyali verilir. Transistörün iletkenliği ağırlığı temsil ederken, Ohm Kanunu sayesinde akım gerilimle çarpılmış olur. Ardından Kirchhoff Akım Kanunu devreye girer: Bit hattı (bitline) boyunca sızan tüm akımlar fiziksel iletken üzerinde kendiliğinden toplanır.

Tüm matris çarpma ve toplama (MAC) işlemi hiçbir harici aritmetik mantık birimine ihtiyaç duymadan, doğrudan silikonun kendi temel fiziksel kanunları tarafından mikrosaniyeler içinde işletilir.

FlexDCIM ve Sayısal Bellek İçi Hesaplama Raporu - arXiv ve A 44.3 TOPS/W SRAM Compute-in-Memory - ResearchGate çalışmalarında görüldüğü gibi, analog modellerin elektriksel gürültü hassasiyetini aşmak için geliştirilen yeni nesil tamamen sayısal (All-Digital CIM) mimariler, watt başına 100 ila 250 TOPS (Tera-Operations Per Second) seviyesinde enerji verimliliğine ulaşıyor. Standart grafik işlemcilerin 5 ila 10 TOPS/W bandında zorlandığı düşünülürse bu fark yirmi katlık bir sıçrama anlamına geliyor.

2026 yılındaki Ouroboros gibi plaka ölçekli (wafer-scale) tasarımlar, 54 gigabaytlık devasa SRAM dizilerini doğrudan çip üzerinde CIM motorlarıyla birleştirerek yapay zekâ çıkarımında enerji tüketimini on yedi kat azaltıyor.

Veriyi saklandığı yerden oynatmadan doğrudan bellek ızgarasının içinde işleyen Bellek İçi Hesaplama, yapay zekâ donanımlarını seksen yıllık Von Neumann darboğazından kurtararak enerji verimliliğinin sınırlarını yeniden tanımlıyor.
