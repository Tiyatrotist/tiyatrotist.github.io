---
slug: "openssh-ve-kuantum-sonrasi-kriptografi-gecisi"
title_tr: "Sunucularımızı Kuantum Tehdidine Karşı Korumak: OpenSSH ve Hibrit Şifreleme Geçişi"
title_en: "Sunucularımızı Kuantum Tehdidine Karşı Korumak: OpenSSH ve Hibrit Şifreleme Geçişi"
excerpt_tr: "Kuantum bilgisayarların genel kullanıma girmesi uzak bir gelecekte görünse de verilerin bugünden kaydedilip ileride çözülmesi riski somut bir tehdit oluşturuyor. OpenSSH sürümlerinde varsayılan hale gelen kuantum sonrası anahtar değişimi algoritmalarını ve altyapı tarafındaki pratik etkilerini inceliyoruz."
excerpt_en: "Kuantum bilgisayarların genel kullanıma girmesi uzak bir gelecekte görünse de verilerin bugünden kaydedilip ileride çözülmesi riski somut bir tehdit oluşturuyor. OpenSSH sürümlerinde varsayılan hale gelen kuantum sonrası anahtar değişimi algoritmalarını ve altyapı tarafındaki pratik etkilerini inceliyoruz."
date: "2026-09-20"
tags: ["Siber Güvenlik", "Kriptografi", "Post-Quantum"]
category: "Güvenlik & Kriptografi"
featured: false
published: true
---

Sunucularımıza bağlanırken her gün onlarca kez çalıştırdığımız SSH oturumları, arka planda güvenliğimizi sağlayan algoritmaların en köklü dönüşümlerinden birini yaşıyor. OpenSSH Kuantum Sonrası Kriptografi Belgeleri üzerinden takip edilebileceği gibi, klasik eliptik eğri şifrelemesi artık yerini kuantum dirençli kafes tabanlı (lattice-based) yöntemlerle birleştiren hibrit yapılara bırakıyor.

Bu dönüşümün acelesi kuantum bilgisayarların bugünden her şeyi kırabilmesinden kaynaklanmıyor. Asıl mesele, siber güvenlik dünyasında "şimdi topla, sonra çöz" (harvest now, decrypt later) olarak adlandırılan saldırı modeli. Ağ trafiğini izleyen saldırganlar, şifreli SSH oturumlarını bugün sunucu disklerine kaydediyor. Amaç, gelecekte Shor algoritmasını çalıştırabilecek yeterli kübit gücüne ulaşıldığında bu kayıtları geriye dönük olarak çözebilmek.

OpenSSH ekibinin çözümü ise geçişi tek bir yeni algoritmaya körü körüne güvenmek yerine hibrit bir mimariyle kurmak oldu. sntrup761 veya ML-KEM algoritmaları doğrudan klasik X25519 ile birleştirilerek kullanılıyor. Bu sayede yeni kuantum dirençli algoritmada henüz keşfedilmemiş bir matematiksel açık çıksa bile klasik eliptik eğri koruması devreye giriyor; kuantum bilgisayarlar klasik yöntemi tehdit ettiğinde ise kafes tabanlı yapı oturumu güvende tutuyor.

Altyapı mühendisleri ve gömülü sistem geliştiricileri için bu geçişin getirdiği bazı somut bedeller var. Frontiers Sistem Seviyesi Kuantum Sonrası SSH Araştırması verilerine göre, geleneksel anahtar değişiminde birkaç düzine bayt olan paket boyutları yeni algoritmalarla birlikte bin baytın üzerine çıkıyor. Bu durum özellikle düşük MTU değerine sahip kısıtlı ağlarda paket bölünmelerine (fragmentation) ve düşük işlem gücüne sahip mikrodenetleyicili ağ kartlarında el sıkışma sürelerinin uzamasına yol açabiliyor.

Geliştiricilerin sunucu yapılandırmalarını gözden geçirirken eski istemcilerle uyumluluğu korumakla yeni standartlara geçiş yapmak arasındaki dengeyi iyi kurgulaması gerekiyor. Kuantum çağına hazırlık, sunucularımızın günlük yapılandırma dosyalarında şimdiden başlamış durumda.
