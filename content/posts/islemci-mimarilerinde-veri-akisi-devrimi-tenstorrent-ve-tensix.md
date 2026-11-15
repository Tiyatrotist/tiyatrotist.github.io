---
slug: "islemci-mimarilerinde-veri-akisi-devrimi-tenstorrent-ve-tensix"
title_tr: "Spekülatif Yürütmenin Sonu: Tenstorrent ve Açık Veri Akışı Mimarisi"
title_en: "Spekülatif Yürütmenin Sonu: Tenstorrent ve Açık Veri Akışı Mimarisi"
excerpt_tr: "Modern x86 ve ARM işlemcilerde silikon alanının yarısından fazlası hesaplama yapmak yerine komut sırasını tahmin etmeye harcanıyor. Jim Keller liderliğinde geliştirilen Tenstorrent Tensix mimarisinin talimatları bırakıp doğrudan veri akışını (dataflow) donanıma haritalayan yaklaşımını inceliyoruz."
excerpt_en: "Modern x86 ve ARM işlemcilerde silikon alanının yarısından fazlası hesaplama yapmak yerine komut sırasını tahmin etmeye harcanıyor. Jim Keller liderliğinde geliştirilen Tenstorrent Tensix mimarisinin talimatları bırakıp doğrudan veri akışını (dataflow) donanıma haritalayan yaklaşımını inceliyoruz."
date: "2026-10-19"
tags: ["Sistem Mimarisi"]
category: "Sistem Mimarisi"
featured: false
published: true
---

Modern bir x86 veya ARM işlemcisinin mikromimari kalıp haritasını (die shot) incelediğinizde çarpıcı bir tabloyla karşılaşırsınız: Çip üzerindeki transistörlerin ve enerjinin yarısından fazlası gerçek matematiksel hesaplamaları yapan aritmetik birimlere (ALU/FPU) değil, işlem sırasını yöneten bürokratik devrelere ayrılmıştır. Komut getirme (fetch), çözme (decode), dal tahmini (branch prediction), kayıt yeniden adlandırma (register renaming) ve sırasız yürütme (out-of-order execution) tamponları devasa bir silikon alanını yutar.

İşlemcilerin bir sonraki adımda ne olacağını tahmin ederek önceden hesaplama yapması (spekülatif yürütme) performansı artırsa da Spectre ve Meltdown gibi silikon seviyesinde asla tam olarak temizlenemeyen donanımsal güvenlik açıklarına yol açtı. Üstelik yapay zekâ ve matris ağırlıklı modern iş yüklerinde veriler devasa tensörler halinde akarken, tek tek komutları sıralamaya çalışmak bellek gecikmelerini katlamaktan başka bir işe yaramıyor.

Tenstorrent Yapay Zekâ ve Çıkarım Mimarisi Analizi - Moor Insights raporunda incelendiği üzere, efsanevi çip mimarı Jim Keller liderliğindeki Tenstorrent ekibi bu sorunu klasik Von Neumann komut döngüsünü tamamen terk ederek çözüyor. Çözüm, verinin donanım boyunca su gibi aktığı uzamsal veri akışı (spatial dataflow) mimarisidir.

Tensix Mimarisi Üzerinde LLM Çıkarımı ve Operatör Füzyonu - arXiv teknik makalesinde detaylandırıldığı gibi, Tenstorrent çipleri iki boyutlu bir torus ızgarasında birbirine bağlanan yüzlerce Tensix çekirdeğinden oluşur. Her çekirdeğin içinde hafif RISC-V denetleyicileri ve yerel SRAM bellekleri bulunur.

Bir yapay zekâ modeli derlendiğinde hesaplama grafiği doğrudan bu çekirdek matrisine fiziksel olarak haritalanır. Bir çekirdeğin çıktısı, ana belleğe veya devasa önbelleklere gitmeden çip üstü ağ (NoC) üzerinden doğrudan komşu çekirdeğin girdisine akar.

Bu mimaride karmaşık şube tahmincilerine veya spekülatif yürütme devrelerine ihtiyaç yoktur; çekirdekler yalnızca önlerindeki veri hazır olduğunda tetiklenir. Çip üzerinde boşa harcanan silikon alanı ve ısı sıfıra yaklaşırken, açık kaynak yazılım yığınıyla birleşen RISC-V tabanlı veri akışı, işlemci dünyasında kırk yıllık komut odaklı kilitlenmeyi aşmanın en somut alternatifini sunuyor.
