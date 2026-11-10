---
slug: "sifirdan-bagimsiz-linux-dagitimi"
title_tr: "Sıfırdan Bağımsız Bir Linux Dağıtımı İnşa Etmek: Çekirdek, Paketler ve POSIX"
title_en: "Building an Independent Linux Distribution from Scratch: Kernel, Packages & POSIX"
excerpt_tr: "Hazır şablonlar veya Ubuntu türevleri yerine; toolchain derlemesinden init sistemine, paket yöneticisinden POSIX ortamına sıfırdan bir Linux dağıtımı inşa etme deneyimi."
excerpt_en: "Bypassing standard distros to build an independent Linux OS from scratch: toolchain compilation, kernel configuration, custom package management, and POSIX fundamentals."
date: "2026-11-05"
tags: ["Linux", "Kernel", "C++", "Sistem Mimarisi"]
category: "Sistem Programlama"
featured: true
published: true
---

Yazılım dünyasında çoğu zaman hazır paket yöneticilerine (`apt`, `pacman`), öntanımlı systemd servislerine ve dağıtımların sunduğu soyutlama katmanlarına alışırız. Ancak bir işletim sisteminin gerçekten nasıl nefes aldığını anlamanın tek bir kesin yolu vardır: **Onu sıfırdan derlemek.**

Bu yazıda; bir Linux çekirdeğinin (`vmlinuz`), çapraz derleme zincirinin (toolchain), C standart kütüphanesinin (glibc/musl) ve minimal bir kullanıcı alanının (user space) nasıl bir araya getirilerek bağımsız bir dağıtıma dönüştüğünü özetliyorum.

---

## 1. Çapraz Derleme Zinciri (Toolchain Isolation)

Kendi dağıtımınızı inşa ederken en büyük tehlike, üzerinde çalıştığınız "ana sistemin" (host system) kütüphanelerinin ve ikili dosyalarının yeni sisteme sızmasıdır (host pollution).

Bunu engellemek için üç aşamalı bir inşa disiplini uyguladım:
1. **Host-agnostic Toolchain:** Ana sistemden tamamen bağımsız çalışan geçici bir `binutils`, `gcc` ve `glibc` üçlüsü derlenir.
2. **Chroot İzolasyonu:** Oluşturulan geçici araç seti `/mnt/sysroot` dizinine bağlanır ve `chroot` ile bu yalıtılmış ortama geçiş yapılır.
3. **Nihai Sistem İkilileri:** Yeni sistemin kendi derleyicisi ile tüm temel POSIX araçları (`coreutils`, `bash`, `sed`, `grep`, `make`) sıfırdan derlenir.

```bash
# Minimal Toolchain Hazırlık Örneği
export SYSROOT=/mnt/custom_os
mkdir -pv $SYSROOT/{bin,etc,lib,sbin,usr,var,tools}

# Geçici binutils derleme adımı
mkdir -v build && cd build
../configure --prefix=$SYSROOT/tools \
             --with-sysroot=$SYSROOT \
             --target=x86_64-custom-linux-gnu \
             --disable-nls \
             --disable-werror
make -j$(nproc) && make install
```

---

## 2. Linux Çekirdeği Konfigürasyonu: Sıfır Fazlalık

Modern ana akım dağıtımlar (Ubuntu, Fedora vb.) dünya üzerindeki her türlü donanımı desteklemek zorunda oldukları için çekirdeklerinde binlerce modül barındırır. Bu durum açılış süresini uzatır ve bellek ayak izini büyütür.

Kendi çekirdeğimi derlerken izlediğim yaklaşım:
* **Monolitik Sürücüler:** Disk denetleyicileri (NVMe, SATA), temel dosya sistemleri (ext4, btrfs) çekirdeğin içine yerleşik (`=y`) olarak gömüldü; `initramfs` ihtiyacı tamamen ortadan kaldırıldı.
* **Gereksiz Katmanların Kapatılması:** Eski donanım uyumlulukları, kullanılmayan ağ protokolleri ve telemetri kancaları kapatılarak çekirdek boyutu 8 MB seviyesine indirildi.

```
[*] 64-bit kernel
General setup  --->
    [ ] Enable process accounting
    [ ] Auditing support
    Kernel Performance Events And Counters --->
Processor type and features  --->
    Processor family (Generic-x86-64)
Device Drivers  --->
    [*] NVME Support
    [*] Serial ATA and Parallel ATA drivers
File systems  --->
    <*> The Extended 4 (ext4) filesystem
```

---

## 3. Paket Yönetimi ve Bağımlılık Ağaçları

Bir dağıtımı ayakta tutan en kritik bileşen paket yöneticisidir. Kendi dağıtımım için geliştirdiğim hafif paket mimarisinde şu kuralları benimsedim:

1. **Manifest Tabanlı Yapı:** Her paket, derleme adımlarını (`build`), bağımlılık listesini (`deps`) ve sağlama toplamını (`sha256`) içeren sade bir manifest dosyasıyla tanımlanır.
2. **Kayıpsız Kaldırma (Atomic Tracking):** Paketin sisteme yazdığı her dosya bir `db.local` kütüğüne işlenir; böylece paket silindiğinde arkasında artık dosya bırakmaz.
3. **Statik Bağımlılık Önceliği:** Kritik kurtarma araçları statik kütüphanelerle derlenerek glibc güncellemelerinde sistemin kilitlenmesi engellenir.

---

## 4. Sonuç ve Çıkarılan Dersler

Bir Linux dağıtımını sıfırdan derlemek bana yazılımın donanımla buluştuğu noktadaki gerçek mimariyi öğretti:
* Soyutlamaların arkasında çalışan syscall (sistem çağrıları) mekanizmasını,
* Bellek yönetiminin sanal bellek sayfalarından çekirdek alanına akışını,
* POSIX uyumluluğunun ve minimalizmin modern yazılım geliştirme reflekslerine nasıl güç kattığını.

Bu bilgi birikimi; bugün hem **BookOS** projesinin çekirdek vizyonunda, hem de akıllı tahtalar ve sistem düzeyindeki diğer C++ projelerimde en büyük teknik dayanağım haline geldi.
