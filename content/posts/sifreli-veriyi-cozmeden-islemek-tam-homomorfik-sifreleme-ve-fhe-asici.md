---
slug: "sifreli-veriyi-cozmeden-islemek-tam-homomorfik-sifreleme-ve-fhe-asici"
title_tr: "Şifreyi Çözmeden Hesaplamak: Tam Homomorfik Şifreleme ve FHE Donanımları"
title_en: "Şifreyi Çözmeden Hesaplamak: Tam Homomorfik Şifreleme ve FHE Donanımları"
excerpt_tr: "Bulut tabanlı yapay zekâ modellerine hassas verilerimizi gönderirken karşılaşılan en büyük güvenlik açığı, verinin işlenmek için bellekte açık metne dönüştürülmek zorunda olmasıdır. Veriyi şifreli metin halindeyken doğrudan işleyen Tam Homomorfik Şifreleme (FHE) yaklaşımını ve 10.000 katlık işlem yükünü eriten yeni ASIC hızlandırıcılarını inceliyoruz."
excerpt_en: "Bulut tabanlı yapay zekâ modellerine hassas verilerimizi gönderirken karşılaşılan en büyük güvenlik açığı, verinin işlenmek için bellekte açık metne dönüştürülmek zorunda olmasıdır. Veriyi şifreli metin halindeyken doğrudan işleyen Tam Homomorfik Şifreleme (FHE) yaklaşımını ve 10.000 katlık işlem yükünü eriten yeni ASIC hızlandırıcılarını inceliyoruz."
date: "2026-10-13"
tags: ["Siber Güvenlik", "Kriptografi"]
category: "Güvenlik & Kriptografi"
featured: false
published: true
---

Modern siber güvenlik mimarileri veriyi iki temel durumda kusursuz koruyabiliyor: Veri diskte saklanırken (AES ile) ve ağ üzerinde taşınırken (TLS şifrelemesiyle). Ancak bu veriyi bir yapay zekâ modelinde analiz etmek veya bir sunucuda matematiksel işlemden geçirmek istediğiniz anda koruma kalkanı mecburen devre dışı kalır. İşlemcinin ve RAM'in veriyi anlayabilmesi için şifreli paketin açık metne (plaintext) dönüştürülmesi zorunludur. Bellek dökümü (memory dump) alabilen ya da çekirdek seviyesine sızan bir saldırgan için sistemin en savunmasız kaldığı an bu andır.

Kriptografi dünyasının uzun yıllardır üzerinde çalıştığı Tam Homomorfik Şifreleme (Fully Homomorphic Encryption / FHE), veriyi hiçbir aşamada çözmeden doğrudan şifreli metin (ciphertext) üzerinde hesaplama yapmayı mümkün kılıyor. Kullanıcı hassas verisini kendi cihazında şifreleyip sunucuya gönderir; sunucu şifreli karmaşık sayılar üzerinde matris çarpımları yapar ve yine şifreli bir çıktı üretir. Ortaya çıkan sonucu yalnızca anahtara sahip olan kullanıcı çözebilir; hesaplamayı yapan sunucu ise ne girdi verisini ne de sonucu hiçbir zaman göremez.

Wavect 2026 Tam Homomorfik Şifreleme Raporu araştırmasında belirtildiği gibi, bu zarif matematiksel model uzun süre devasa bir işlem gücü engeline takıldı. Şifreli bir metin üzerinde işlem yapmak standart işlemcilerde açık metne göre 10.000 ila 100.000 kat daha fazla hesaplama yükü yaratır. Basit bir sinir ağı çıkarımı yapmak standart sunucu işlemcilerinde dakikalarca sürebiliyordu.

MPU H1 FHE Hızlandırıcı ASIC Çipi Analizi duyurusunda açıklandığı üzere, bu hesaplama darboğazı doğrudan silikon katmanında geliştirilen özel çiplerle kırıldı. FHE algoritmaları devasa dereceli polinomların modüler çarpımlarına (Sayısal Teori Dönüşümü / NTT) dayanır. Standart CPU komut setleri bu işlemi adım adım koştururken, binlerce paralel NTT hesaplama birimine ve devasa bellek bant genişliğine sahip özel ASIC hızlandırıcılar yazılıma kıyasla 10.000 katlık performans sıçraması sağlıyor.

Özel silikon hızlandırıcıların devreye girmesiyle birlikte sağlık kayıtlarının, finansal işlemlerin ve özel kaynak kodlarının bulut modellerinde mutlak veri gizliliğiyle işlenmesi teorik bir kavram olmaktan çıkıp pratik bir mühendislik standardına dönüşüyor.
