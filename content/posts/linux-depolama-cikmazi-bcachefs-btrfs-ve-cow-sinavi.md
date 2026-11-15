---
slug: "linux-depolama-cikmazi-bcachefs-btrfs-ve-cow-sinavi"
title_tr: "ext4 Neden Ölmüyor: Linux'ta Bcachefs, Btrfs ve Copy-on-Write Sınavı"
title_en: "ext4 Neden Ölmüyor: Linux'ta Bcachefs, Btrfs ve Copy-on-Write Sınavı"
excerpt_tr: "Modern dosya sistemlerinin sunduğu anlık görüntü (snapshot), veri sağlama toplamı (checksum) ve katmanlama özellikleri uzun süredir ext4'ün yerini almayı vaat ediyor. Btrfs, ZFS ve son dönemde Bcachefs etrafında yaşanan mimari ve yönetimsel tartışmaları inceliyoruz."
excerpt_en: "Modern dosya sistemlerinin sunduğu anlık görüntü (snapshot), veri sağlama toplamı (checksum) ve katmanlama özellikleri uzun süredir ext4'ün yerini almayı vaat ediyor. Btrfs, ZFS ve son dönemde Bcachefs etrafında yaşanan mimari ve yönetimsel tartışmaları inceliyoruz."
date: "2026-10-07"
tags: ["Linux", "Çekirdek", "Sistem Programlama"]
category: "Linux & Çekirdek"
featured: false
published: true
---

Yeni bir Linux dağıtımı kurduğunuzda disk biçimlendirme ekranında karşınıza çıkan varsayılan seçenek neredeyse her zaman ext4 olur. 2008 yılından bu yana hayatımızda olan ext4; anlık görüntü (snapshot), veri seviyesinde sağlama toplamı (checksumming) ve çoklu disk birleştirme gibi modern yeteneklerden tamamen yoksundur. Sessiz veri bozulmalarını (bit rot) tespit edemez ve diski birden fazla sürücüye yaymak istediğinizde karmaşık LVM katmanlarına muhtaç bırakır.

Buna rağmen Linux dünyası yeni nesil dosya sistemlerine geçmekte neden bu kadar temkinli?

İlk büyük umut olan Btrfs, yazma sırasında kopyalama (Copy-on-Write / CoW) mimarisiyle eski blokların üzerine yazmak yerine yeni bloklar açarak anlık görüntü almayı son derece kolaylaştırdı. Ancak Btrfs tarafında yıllardır tamamen çözülemeyen RAID5/6 yazma deliği (write-hole) açığı ve yoğun veritabanı dosyalarındaki parçalanma (fragmentation) sorunları, kurumsal sunucularda güven kırıcı oldu.

Btrfs ve ZFS Veri Koruma Karşılaştırması analizinde incelendiği üzere, ZFS ise kaya gibi sağlam yapısına ve kusursuz veri bütünlüğü denetimine rağmen CDDL lisansı nedeniyle doğrudan Linux çekirdeğine dahil edilemiyor. Arch veya Fedora gibi güncel dağıtımlarda her çekirdek güncellemesinden sonra DKMS ile modül derlemek zorunda kalmak, masaüstü ve hafif sunucu kullanıcılarını yoruyor.

Tam bu noktada Kent Overstreet tarafından geliştirilen Bcachefs, iki dünyanın en iyi yönlerini birleştiren nihai alternatif olarak sahneye çıktı. B-tree tabanlı modern CoW mimarisi; ZFS kalitesinde veri sağlama toplamları sunarken, hızlı NVMe diskleri yavaş mekanik disklerin önüne otomatik önbellek olarak yerleştiren (multi-device tiering) yerel bir yeteneğe sahipti.

Ancak Botmonster Tech Bcachefs ve Çekirdek Analizi raporunun gösterdiği gibi, işletim sistemi dünyasında sadece kodun kalitesi yeterli olmuyor. Çekirdek bakımcıları arasındaki yönetimsel anlaşmazlıklar ve çekirdek geliştirme takvimine uyum sorunları, Bcachefs'in ana çekirdek (mainline) dışında harici bir modül olarak sürdürülmesine yol açtı. Bu durum Bcachefs'i de tıpkı ZFS gibi dağıtımlarda DKMS derleme vergisine mahkum etti.

Sonuç olarak kullanıcılar en son özellikleri denemek istediklerinde Btrfs ve ZFS arasında ödünleşimler vermeye devam ederken; ext4, elektrik kesintisinde bile sistemi çökertmeyen basit ve öngörülebilir yapısıyla Linux ekosisteminin en güvenli limanı olmayı sürdürüyor.
