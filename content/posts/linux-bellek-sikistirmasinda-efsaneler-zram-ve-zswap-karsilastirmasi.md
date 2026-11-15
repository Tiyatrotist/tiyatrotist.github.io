---
slug: "linux-bellek-sikistirmasinda-efsaneler-zram-ve-zswap-karsilastirmasi"
title_tr: "SSD Eskimesin Diye zram Kurmak: Linux'ta zswap Efsaneleri"
title_en: "SSD Eskimesin Diye zram Kurmak: Linux'ta zswap Efsaneleri"
excerpt_tr: "Linux topluluklarında yıllardır SSD ömrünü korumak için disk takasını kapatıp zram kurmak tavsiye edildi. Çekirdek bellek geliştiricisi Chris Down'un verileriyle zram mimarisinin zayıflıklarını, LRU tersine dönmesini ve zswap'in getirdiği dinamik katmanlamayı inceliyoruz."
excerpt_en: "Linux topluluklarında yıllardır SSD ömrünü korumak için disk takasını kapatıp zram kurmak tavsiye edildi. Çekirdek bellek geliştiricisi Chris Down'un verileriyle zram mimarisinin zayıflıklarını, LRU tersine dönmesini ve zswap'in getirdiği dinamik katmanlamayı inceliyoruz."
date: "2026-11-12"
tags: ["Linux", "Çekirdek", "Sistem Programlama"]
category: "Linux & Çekirdek"
featured: false
published: true
---

Linux forumlarında veya dağıtım kılavuzlarında bellek optimizasyonu arayan herkesin karşısına çıkan en popüler tavsiye şudur: "Diskteki takas (swap) alanını kapatın, SSD'niz aşınmasın; yerine RAM'de sıkıştırılmış bir zram cihazı açın." Fedora gibi büyük dağıtımların da varsayılan olarak zram'e geçmesiyle bu yaklaşım sorgulanmayan bir kural haline geldi. Ancak Linux çekirdeğinin bellek yönetim ekibinde çalışan Chris Down'un yayımladığı analizler, bu popüler kabulün arkasında ciddi mimari yanılgılar yattığını gösteriyor.

Down: Debunking zswap and zram myths - LWN.net ve Debunking zswap and zram myths - Chris Down incelemelerinde belirtildiği gibi, zram ile zswap benzer işi yapan iki alternatif değil, tamamen farklı felsefelere sahip iki ayrı mekanizmadır:

zram, doğrudan RAM içinde çalışan bağımsız bir sanal blok cihazıdır (/dev/zram0). Çekirdek ona sıradan bir sabit disk gibi davranır ve blok I/O katmanı üzerinden yazar.

zswap ise bir blok cihazı değildir. Çekirdeğin bellek yönetim alt sistemine gömülü, diskteki fiziksel takas alanının önünde duran şeffaf bir sıkıştırma önbelleğidir (write-back cache).

I was wrong! zswap IS better than zram - LinuxBlog.io raporunda açıklandığı üzere, kullanıcılar genellikle zram'i yüksek öncelikle, fiziksel NVMe diskini ise düşük öncelikle sisteme bağlar. Sistem belleği dolmaya başladığında eski ve soğuk sayfalar hızla zram'e yazılır. zram dolduğunda ise katı bir kapasite tavanına ulaşır; içindeki eski verileri diske otomatik olarak aktaracak bir tahliye (eviction) mekanizması yoktur. Sonuçta aylar önce açılmış ve hiç kullanılmayan soğuk bir sayfa en hızlı yer olan RAM'deki zram alanında rehin kalırken, kullanıcının o an aktif olarak ihtiyaç duyduğu sıcak sayfalar yavaş diske sürülür (LRU Inversion).

Zram, zswap and Linux Swap: A Practical Configuration Guide kılavuzunda vurgulanan bir diğer kritik fark sıkıştırılamayan verilerde ortaya çıkar. Zaten şifrelenmiş veya sıkıştırılmış bir veriyi zram'e gönderdiğinizde, 4 KB'lık sayfa 3.9 KB olarak sıkışsa dahi zram onu RAM'de saklamaya devam eder ve hem işlemciyi hem belleği israf eder. zswap ise sıkıştırma oranını anında ölçer; verim düşükse sayfayı RAM havuzuna hiç almadan doğrudan fiziksel NVMe diske paslar. Üstelik zswap havuzu dolduğunda en az kullanılan sayfaları sessizce fiziksel diske tahliye ederek sıcak sayfaları RAM önbelleğinde tutar.

Zram vs Zswap vs Disk Swap: Choosing the Best Memory Optimization for Linux VPS makalesinde uyarısı yapılan en kritik hata iki mekanizmayı aynı anda açmaktır. zswap etkinken takas cihazı olarak zram seçilirse, bir sayfa önce zswap tarafından sıkıştırılır, ardından zram'e gönderilerek bir kez daha sıkıştırılır; bu durum işlemciyi boşa kilitler. Ayrıca zram kullanırken varsayılan vm.page-cluster = 3 değerinin bırakılması, tek bir sayfa okunurken fazladan 8 sayfanın açılmasına ve işlemci gücünün erimesine yol açar.

Disksiz çalışan Raspberry Pi gibi gömülü kartlarda veya yavaş mekanik diskli eski sistemlerde zram tek başına hala geçerli bir çözümdür. Ancak hızlı NVMe depolamaya sahip modern masaüstü ve sunucu sistemlerinde, fiziksel diski arkasına alan zswap mekanizması çok daha dengeli ve öngörülebilir bir bellek yönetimi sunuyor.
