---
slug: "kilit-almadan-veri-okumak-linux-cekirdeginde-rcu-mimarisi"
title_tr: "Kilit Almadan Veri Okumak: Linux Çekirdeğinde RCU ve Grace Period Zarafeti"
title_en: "Kilit Almadan Veri Okumak: Linux Çekirdeğinde RCU ve Grace Period Zarafeti"
excerpt_tr: "Yüzlerce çekirdeğe sahip modern sunucularda geleneksel kilitler işlemci önbelleklerini kilitleyerek veri okuma hızını düşürüyor. Linux çekirdeğinde okuyuculara atomik kilit masrafı çıkarmadan doğrudan işaretçi okuma imkanı sunan Read-Copy Update (RCU) mekanizmasını inceliyoruz."
excerpt_en: "Yüzlerce çekirdeğe sahip modern sunucularda geleneksel kilitler işlemci önbelleklerini kilitleyerek veri okuma hızını düşürüyor. Linux çekirdeğinde okuyuculara atomik kilit masrafı çıkarmadan doğrudan işaretçi okuma imkanı sunan Read-Copy Update (RCU) mekanizmasını inceliyoruz."
date: "2026-11-01"
tags: ["Linux", "Çekirdek", "Sistem Programlama", "RCU"]
category: "Linux & Çekirdek"
featured: false
published: true
---

Modern bir sunucuda 64 veya 128 işlemci çekirdeği varken paylaşılan bir bellek alanından veri okumak istediğinizde çok çekirdekli mimarilerin en can sıkıcı darboğazıyla karşılaşırsınız: Çekirdeklerin hiçbiri yazma yapmasa, sadece okuma yapsa dahi geleneksel okuyucu-yazıcı kilitleri (rwlock_t) sistemi yavaşlatır. Bir kilit almak için her bir çekirdek ortak bir bellek adresindeki sayaç değerini atomik olarak artırmak (fetch_and_add) zorundadır. Bu durum önbellek satırının çekirdekler arasında sürekli el değiştirmesine (cacheline bouncing) yol açar; basit bir veri okuma işlemi dahi bellek veri yollarını tıkayarak işlemciyi bekletir.

What is RCU? - The Linux Kernel Documentation sayfalarında ve Basic Concept of RCU: Read, Copy, Update - free5GC analizinde detaylandırıldığı üzere, Linux çekirdeği bu sorunu Read-Copy Update (RCU) adı verilen mekanizmayla çözer.

RCU dünyasında okuyucular hiçbir kilit almaz. rcu_read_lock() çağrısı kesintisiz çalışan bir çekirdekte neredeyse sıfır makine komutuna derlenir. Atomik sayaçlar, önbellek kilitlemeleri veya çekirdekler arası sinyalleşmeler yoktur. Okuyucu doğrudan işaretçiyi (pointer) takip ederek belleği okumaya başlar.

Veriyi değiştirmek isteyen yazıcı ise mevcut yapının üzerine doğrudan yazamaz; çünkü o sırada yüzlerce okuyucu o yapıyı eşzamanlı olarak inceliyor olabilir. Yazıcı mevcut nesnenin bellekte tam bir kopyasını çıkarır, değişiklikleri bu kopya üzerinde tamamlar ve ardından global işaretçiyi atomik bir bellek bariyeriyle (rcu_assign_pointer) yeni kopyaya bağlar. Bu andan itibaren sisteme giren her yeni okuyucu güncel veriyi görürken, eski okuyucular kendi ellerindeki eski kopyayı okumayı sürdürür.

Read-Copy-Update (RCU): the Secret to Lock-Free Performance - InfoQ raporunda açıklandığı gibi, asıl zorluk eski bellek alanının ne zaman temizleneceğidir (kfree). Eski nesneyi çok erken silerseniz, eski işaretçiyi okumaya devam eden bir okuyucu bellek çökmesine (Use-After-Free) uğrar.

Çekirdek bu sorunu çözmek için işlemci çekirdeklerinin durumunu izler. Bir okuyucu RCU bloğu içerisindeyken uyuyamaz veya bağlam değiştiremez. Bir CPU çekirdeği bağlam değiştirdiğinde, boşa (idle) geçtiğinde veya kullanıcı alanına döndüğünde durgun duruma (quiescent state) geçmiş sayılır. Sistemdeki tüm çekirdekler en az bir kez bu durumdan geçtiğinde bir Grace Period (Lütuf Süresi) tamamlanmış olur.

Bu an, eski veriyi okuyan hiçbir okuyucunun kalmadığının kesin kanıtıdır. Yazıcı ancak bu aşamadan sonra eski belleği güvenle sisteme iade eder (call_rcu).

Linux'un dosya yolu arama önbelleği (dcache) ve ağ yönlendirme tabloları saniyede elli milyondan fazla okuma işlemini yüzlerce çekirdeğe kayıpsız dağıtabiliyorsa, bu başarı kilit mekanizmalarını güçlendirmek yerine okuma anında kilitleri tamamen ortadan kaldıran RCU felsefesine dayanıyor.
