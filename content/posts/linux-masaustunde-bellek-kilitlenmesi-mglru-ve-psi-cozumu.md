---
slug: "linux-masaustunde-bellek-kilitlenmesi-mglru-ve-psi-cozumu"
title_tr: "RAM Dolunca Fare Neden Donar: Linux'ta MGLRU, PSI ve Bellek Baskısı"
title_en: "RAM Dolunca Fare Neden Donar: Linux'ta MGLRU, PSI ve Bellek Baskısı"
excerpt_tr: "Linux masaüstlerinde bellek tükendiğinde sistemin dakikalarca kilitlenip tepkisiz kalması, çekirdeğin eski sayfa temizleme mantığından ve aşırı disk takaslama (thrashing) döngüsünden kaynaklanıyor. Çok nesilli MGLRU mimarisini ve PSI tabanlı modern bellek kurtarma yöntemlerini inceliyoruz."
excerpt_en: "Linux masaüstlerinde bellek tükendiğinde sistemin dakikalarca kilitlenip tepkisiz kalması, çekirdeğin eski sayfa temizleme mantığından ve aşırı disk takaslama (thrashing) döngüsünden kaynaklanıyor. Çok nesilli MGLRU mimarisini ve PSI tabanlı modern bellek kurtarma yöntemlerini inceliyoruz."
date: "2026-10-14"
tags: ["Linux", "Çekirdek", "Sistem Programlama"]
category: "Linux & Çekirdek"
featured: false
published: true
---

Ağır bir yazılım derlerken, onlarca tarayıcı sekmesi açıkken veya yerel bir yapay zekâ modelini belleğe yüklerken her Linux kullanıcısının başına en az bir kez gelmiştir: Ekrandaki fare imleci aniden donar, ses takılmaya başlar, disk ışığı sürekli yanar ve sistem iki ila beş dakika boyunca hiçbir klavye veya fare komutuna yanıt vermez.

Linux Bellek Baskısı ve OOM Analizi - FOSS Linux teknik kılavuzunda açıklandığı gibi, bu kilitlenmenin asıl sebebi sistemde RAM kalmaması değil, çekirdeğin RAM'i kurtarmaya çalışırken sistemi sonsuz bir disk I/O döngüsüne (thrashing) sokmasıdır.

Linux'un geleneksel iki sıralı (Active/Inactive) sayfa temizleme mekanizması, belleği boşaltmak için dosya tabanlı temiz sayfaları diskten tekrar okunabilir varsayımıyla feda eder. Ancak masaüstünün görüntüsünü çizen grafik kompozitörü, Wayland kütüphaneleri veya masaüstü kabuğu tam da bu feda edilen sayfalara ihtiyaç duyar. Çekirdek bir sayfayı bellekten atar, masaüstü süreci onu anında diskten geri ister; çekirdek tekrar atar, süreç tekrar çağırır. Veri yolu saniyeler içinde kilitlenir ve masaüstü tamamen felç olur.

İşin daha can sıkıcı tarafı ise çekirdeğin yerleşik OOM (Out-of-Memory) Katilinin bu esnada tamamen kör kalmasıdır. Ubuntu ve Modern Dağıtımlarda Bellek Yönetimi tartışmalarında incelendiği üzere, çekirdek içi OOM mekanizması bellek tahsis çağrısı mutlak sıfıra ulaşıp NULL dönmedikçe devreye girmez. Çekirdek diskten saniyede tek bir 4 KB'lık sayfa kurtarabildiği sürece her şeyin yolunda gittiğini varsayar ve kullanıcı donmuş bir ekrana bakarken beklemeyi sürdürür.

Son çekirdek sürümlerinde varsayılan hale gelen Çok Nesilli LRU (Multi-Gen LRU / MGLRU) mimarisi bu tabloyu değiştirdi. Sistem sayfaları sadece iki listeye bölmek yerine nesil (generation) bazlı bir yaşlandırma hiyerarşisine sokuyor. Sayfaların gerçek erişim sıklıkları izlenerek gereksiz tarama yükü azaltılıyor; böylece bellek sıkışması anında hangi sayfanın atılacağı çok daha az işlemci gücü harcanarak belirleniyor.

Çözümün operasyonel ayağını ise PSI (Pressure Stall Information) ve systemd-oomd ikilisi tamamlıyor. Sistem artık sadece boşta kalan bayt sayısına bakmıyor; süreçlerin bellek beklerken kaybettiği zaman oranını (stall) mikrosaniyelik metriklerle izliyor.

Bellek gecikmesi belirli bir eşiği aştığında kullanıcı alanı katili derhal devreye giriyor ve tüm masaüstünün kilitlenmesini beklemeden aşırı bellek tüketen süreci doğrudan sonlandırıyor. Sıkıştırılmış zram takasıyla birleşen bu yeni mimari, Linux masaüstünün yıllardır süregelen donma refleksini kökten ortadan kaldırıyor.
