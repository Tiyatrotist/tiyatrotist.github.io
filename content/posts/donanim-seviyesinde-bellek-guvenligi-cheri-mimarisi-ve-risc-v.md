---
slug: "donanim-seviyesinde-bellek-guvenligi-cheri-mimarisi-ve-risc-v"
title_tr: "C Kodunu Baştan Yazmadan Korumak: Donanım Seviyesinde CHERI ve RISC-V Mimarisi"
title_en: "C Kodunu Baştan Yazmadan Korumak: Donanım Seviyesinde CHERI ve RISC-V Mimarisi"
excerpt_tr: "Yazılım dünyasındaki güvenlik açıklarının yüzde yetmişi bellek yönetimi hatalarından kaynaklanıyor ve trilyonlarca satır C kodunu Rust ile baştan yazmak on yıllar alacak. İşaretçileri donanım seviyesinde sınırlandırıp yetkilendiren CHERI mimarisinin getirdiği silikon tabanlı savunma mekanizmasını inceliyoruz."
excerpt_en: "Yazılım dünyasındaki güvenlik açıklarının yüzde yetmişi bellek yönetimi hatalarından kaynaklanıyor ve trilyonlarca satır C kodunu Rust ile baştan yazmak on yıllar alacak. İşaretçileri donanım seviyesinde sınırlandırıp yetkilendiren CHERI mimarisinin getirdiği silikon tabanlı savunma mekanizmasını inceliyoruz."
date: "2026-10-02"
tags: ["Donanım", "Mikromimari", "CHERI", "RISC-V"]
category: "Donanım & Mimari"
featured: false
published: true
---

Modern işletim sistemlerinde, gömülü cihaz yazılımlarında ve tarayıcılarda keşfedilen kritik güvenlik açıklarının yaklaşık yüzde yetmişi değişmeyen tek bir kök nedene dayanıyor: Bellek güvenliği ihlalleri. C ve C++ dillerinde yazılmış bir kodda bir işaretçi (pointer) sadece 64 bitlik ham bir sanal bellek adresidir. İşlemci çekirdeği, bu işaretçinin bellekte kaç baytlık bir alana ait olduğunu, geçerli olup olmadığını ya da sınırlarının aşılıp aşılmadığını bilmez; verilen adrese körü körüne erişir.

Sektörün bu kronik soruna verdiği popüler yanıt tüm kritik altyapıyı bellek güvenli dillerle (özellikle Rust ile) yeniden yazmak oldu. Ancak küresel yazılım omurgasını oluşturan trilyonlarca satırlık C/C++ kod tabanını baştan yazmak, hem devasa bir mühendislik bütçesi hem de onlarca yıllık bir geçiş süreci gerektiriyor.

Cambridge Üniversitesi tarafından geliştirilen ve son dönemde açık standartlara taşınan CHERI (Capability Hardware Enhanced RISC Instructions) mimarisi, sorunu yazılımdan alıp doğrudan işlemci silikonuna indiriyor. Cambridge Üniversitesi CHERI Resmi Araştırma Sayfası üzerinde detaylandırıldığı üzere sistem, klasik işaretçilerin yerine "Capability" (Yetenek) adı verilen genişletilmiş donanım belirteçlerini koyuyor.

Bu mimaride bir işaretçi yalnızca bir adres tutmaz; donanım tarafından korunan alt ve üst bellek sınırlarını, okuma/yazma izinlerini ve geçerlilik durumunu gösteren özel bir donanım etiketini (tag bit) de bünyesinde barındırır. Bu etiket kullanıcı kodu tarafından doğrudan değiştirilemez; manipüle edilmeye çalışıldığı anda etiket düşer ve işaretçi geçersiz kalır.

Yazılımcı hatalı bir C kodu yazıp tahsis edilen arabelleğin dışına çıkmaya (buffer overflow) veya serbest bırakılmış bir bellek alanına erişmeye (use-after-free) çalıştığında, yazılım katmanında hiçbir kontrol olmasa dahi işlemci boru hattı (pipeline) ihlali anında fark eder ve donanımsal bir kesme (trap) üreterek saldırıyı milisaniyesinde engeller.

RISC-V CHERI Güvenlik Mimarisi - Codasip ticari uygulamalarında ve RISC-V Uluslararası Bellek Güvenliği Raporu analizlerinde görüldüğü gibi, bu dönüşüm C kodlarının satır satır yeniden yazılmasını gerektirmiyor; mevcut kod tabanları CHERI destekli bir derleyiciyle (Clang/LLVM) derlendiğinde doğrudan donanımsal korumaya kavuşuyor. Üstelik donanım seviyesindeki performans kaybı yüzde bir ila iki gibi ihmal edilebilir bir seviyede kalıyor.

Yazılım katmanında insan hatasını tamamen sıfırlamanın imkansız olduğu bir dünyada, işlemci mimarisini donanımsal yetenek denetimiyle güçlendirmek, yarım asırlık C mirasını çöpe atmadan güvenli kılmanın en gerçekçi yolunu sunuyor.
