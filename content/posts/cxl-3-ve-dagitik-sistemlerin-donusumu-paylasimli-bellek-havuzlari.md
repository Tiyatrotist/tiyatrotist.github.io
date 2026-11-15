---
slug: "cxl-3-ve-dagitik-sistemlerin-donusumu-paylasimli-bellek-havuzlari"
title_tr: "Ağ Paketleri Yerine Ortak RAM: CXL 3.0 ve Dağıtık Sistemlerin Sonu"
title_en: "Ağ Paketleri Yerine Ortak RAM: CXL 3.0 ve Dağıtık Sistemlerin Sonu"
excerpt_tr: "Dağıtık yazılım mimarileri onlarca yıldır sunucuların birbirine ağ üzerinden mesaj göndererek anlaşmak zorunda olduğu varsayımı üzerine kuruldu. CXL 3.0 ile sunucular arası donanımsal önbellek tutarlılığı (cache coherence) sağlanırken Raft ve Paxos gibi mutabakat algoritmalarının nasıl baypas edildiğini inceliyoruz."
excerpt_en: "Dağıtık yazılım mimarileri onlarca yıldır sunucuların birbirine ağ üzerinden mesaj göndererek anlaşmak zorunda olduğu varsayımı üzerine kuruldu. CXL 3.0 ile sunucular arası donanımsal önbellek tutarlılığı (cache coherence) sağlanırken Raft ve Paxos gibi mutabakat algoritmalarının nasıl baypas edildiğini inceliyoruz."
date: "2026-10-08"
tags: ["Dağıtık Sistemler", "Sistem Mimarisi", "CXL", "Bellek Havuzu"]
category: "Dağıtık Sistemler"
featured: false
published: true
---

Dağıtık sistem mühendisliğinin ilk dersi değişmez bir kuralı öğretir: Sunucu A, Sunucu B'nin belleğindeki bir değişkeni doğrudan okuyamaz. İki farklı makinenin ortak bir karar alabilmesi için veriyi serileştirmek, ağ soketine yazmak, TCP/IP yığınından geçirmek ve Raft ya da Paxos gibi karmaşık mutabakat (consensus) algoritmalarıyla onaylatmak zorundasınızdır. Bu mekanizma güvenilirdir ancak milisaniyeler süren gecikme ve ciddi bir işlemci yükü yaratır.

PCIe 6.0 altyapısı üzerinde yükselen Compute Express Link (CXL) 3.0 standardı bu temel kuralı ortadan kaldırıyor. CXL 3.0 ve Bellek Hiyerarşisinin Dönüşümü - Murat Karslıoğlu analizinde vurgulandığı gibi, önceki sürümlerde sadece tek bir sunucuya harici bellek modülü eklenirken, CXL 3.0 ile birden fazla bağımsız sunucunun aynı fiziksel bellek havuzuna doğrudan bağlanması mümkün kılındı.

İşin asıl teknik kırılma noktası donanım seviyesindeki önbellek tutarlılığıdır (hardware cache coherence). Normalde tek bir işlemcinin içindeki çekirdeklerin L1 ve L2 önbelleklerini tutarlı tutan mekanizma, artık CXL anahtarları üzerinden bağımsız sunucuların işlemcileri arasında çalışıyor.

Sunucu A paylaşılan CXL belleğindeki bir adrese basit bir store komutuyla yazdığında, CXL donanımı Sunucu B'nin işlemci önbelleğindeki eski satırı doğrudan geçersiz kılıyor (back-invalidation). Bu işlem gerçekleşirken hiçbir işletim sistemi sürücüsü, kilit (lock) ya da ağ mesajı araya girmiyor.

Büyük Ölçekli Yapay Zekâda CXL Bellek Havuzlama Kılavuzu - Introl raporunda belirtildiği gibi, CXL anahtar katmanları üzerinden bellek erişim gecikmesi 250 ila 500 nanosaniye seviyesindedir. Bu hız NVMe katmanından katbekat hızlı ve yerel anakart bellek gecikmesine çok yakındır.

Artık kümedeki sunucular durum bilgisi paylaşmak için ağ üzerinden dedikodu (gossip) turları atmak zorunda kalmıyor. Tek bir sunucu içinde çalışan kilit gerektirmeyen (lock-free) eşzamanlı veri yapıları ve atomik sayaçlar, CXL havuzundaki ortak RAM üzerinde birden fazla fiziksel sunucu tarafından doğrudan işletilebiliyor.

İşlemci ile belleğin birbirinden fiziksel olarak ayrıştığı (disaggregation) bu yeni çağ, dağıtık yazılım mimarisini karmaşık bir ağ protokolü problemi olmaktan çıkarıp kabinet ölçeğinde çok çekirdekli bir bellek koordinasyonu problemine dönüştürüyor.
