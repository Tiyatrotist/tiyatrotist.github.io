---
slug: "ddr5-guvenlik-yanilsamasi-rowhammer-ve-phoenix-saldirisi"
title_tr: "DDR5 Belleklerin Kırılmazlık İllüzyonu: Rowhammer ve Phoenix Saldırısı"
title_en: "DDR5 Belleklerin Kırılmazlık İllüzyonu: Rowhammer ve Phoenix Saldırısı"
excerpt_tr: "DDR5 bellekler çip içi hata düzeltme (on-die ECC) ve donanımsal satır yenileme kalkanlarıyla Rowhammer saldırılarını tarihe gömdüğünü iddia etmişti. ETH Zürih araştırmacılarının en güncel DDR5 modüllerinde dahi bit çevirmeyi başaran Phoenix saldırısını ve donanımsal güvenlik açıklarını inceliyoruz."
excerpt_en: "DDR5 bellekler çip içi hata düzeltme (on-die ECC) ve donanımsal satır yenileme kalkanlarıyla Rowhammer saldırılarını tarihe gömdüğünü iddia etmişti. ETH Zürih araştırmacılarının en güncel DDR5 modüllerinde dahi bit çevirmeyi başaran Phoenix saldırısını ve donanımsal güvenlik açıklarını inceliyoruz."
date: "2026-11-05"
tags: ["Siber Güvenlik", "Kriptografi", "Donanım Güvenliği"]
category: "Güvenlik & Kriptografi"
featured: false
published: true
---

Bellek üreticileri DDR5 standardını piyasaya sürdüklerinde siber güvenlik dünyasına iddialı bir taahhütte bulunmuştu: Donanım seviyesindeki en tehlikeli fiziksel açıklardan biri olan Rowhammer artık tarihe karışmıştı. DDR4 döneminde işletim sistemlerinin çekirdek haklarını ele geçirmek veya sanal makinelerden kaçmak için kullanılan bu saldırı, DDR5'in içine eklenen donanımsal hedef satır yenileme (Target Row Refresh / TRR) mekanizmaları ve çip içi hata düzeltme kodu (on-die ECC) ile tamamen çözülmüş kabul ediliyordu.

Rowhammer saldırısının kök nedeni doğrudan silikon fiziğine dayanır. DRAM yongalarında her bir veri biti, mikroskobik bir kondansatörün elektrik yükü tutmasıyla saklanır. Üretim süreçleri küçüldükçe hücreler birbirine o kadar yaklaşır ki bir bellek satırına saniyede yüz binlerce kez peş peşe okuma yaptığınızda (hammering), açılıp kapanan voltaj kapısı yanındaki komşu hücrelerin elektrik yükünün sızmasına yol açar. Yeterli yük sızdığında komşu satırdaki 1 değeri aniden 0'a döner. Yazılımda tek bir mantık hatası dahi olmasa, fiziksel dünyadaki bu bit çevrilmesi (bit flip) işletim sisteminin sayfa tablolarını manipüle ederek sıradan bir kullanıcı sürecine tam çekirdek (root) yetkisi kazandırabilir.

ETH Zürih COMSEC Phoenix Araştırması: DDR5 Üzerinde Rowhammer çalışmasında açıklandığı üzere, DDR5'in arkasına sığındığı iki donanımsal kalkan da laboratuvar ortamında aşıldı.

İlk kalkan olan çip içi hata düzeltme (on-die ECC), yalnızca 128 bitlik bir sözcük bloğundaki tekil bit hatalarını yakalamak üzere tasarlanmıştır. Geliştirilen yeni senkronize vuruş desenleri, aynı sözcük içinde aynı anda birden fazla biti çevirerek ECC mekanizmasını yanıltıyor; sistem hatayı düzeltemediği gibi hatalı adresi belleğe yazarak saldırıya zemin hazırlıyor.

İkinci kalkan olan donanımsal satır yenileme mantığı ise bellek kontrolcüsünün yenileme komut döngüleriyle (tREFI) senkronize edilen sahte erişimlerle atlatılabiliyor. Kontrolcünün şüpheli erişimleri izleyen dahili sayaçları körleştirildiğinde, komşu satırlardaki elektriksel sızıntı engellenemiyor.

ZenHammer: AMD Zen ve DDR5 Platformlarında Rowhammer Raporu ve Phoenix araştırmaları, piyasadaki lider üreticilerin en güncel DDR5 modüllerinde dahi sıradan bir kullanıcı alanı sürecinin komşu satırlarda yüzlerce bit çevirmeyi başarabildiğini somut olarak ortaya koydu. Modern AMD Zen ve Intel platformlarının gelişmiş bellek denetleyicileri üzerinden dahi bu ritmik elektriksel darbe kalıpları engellenemiyor.

Donanım üreticilerinin fiziksel kusurları silikon seviyesinde basit yamalarla gizleme çabası, transistörler atomik sınırlara yaklaştıkça yetersiz kalıyor. Rowhammer, DDR5 çağında da yazılımın ötesinde doğrudan donanımın fiziksel sınırlarını hatırlatan en kritik güvenlik tehdidi olmayı sürdürüyor.
