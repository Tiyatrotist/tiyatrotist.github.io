---
slug: "konteyneriniz-bir-sandbox-degil-qemu-hantalligi-ve-microvm-devrimi"
title_tr: "Konteyneriniz Bir Güvenlik Kalkanı Değil: QEMU Hantallığından MicroVM Çağına"
title_en: "Konteyneriniz Bir Güvenlik Kalkanı Değil: QEMU Hantallığından MicroVM Çağına"
excerpt_tr: "Docker ve Kubernetes konteynerleri ana makinenin Linux çekirdeğini paylaştığı için güvenilmeyen kodları izole etmekte yetersiz kalıyor. QEMU hantallığını geride bırakıp KVM üzerinde 120 milisaniyede bağımsız çekirdek başlatan Firecracker ve MicroVM mimarisini inceliyoruz."
excerpt_en: "Docker ve Kubernetes konteynerleri ana makinenin Linux çekirdeğini paylaştığı için güvenilmeyen kodları izole etmekte yetersiz kalıyor. QEMU hantallığını geride bırakıp KVM üzerinde 120 milisaniyede bağımsız çekirdek başlatan Firecracker ve MicroVM mimarisini inceliyoruz."
date: "2026-11-08"
tags: ["Sistem Mimarisi"]
category: "Sistem Mimarisi"
featured: false
published: true
---

Kullanıcıların yüklediği özel betikleri, yapay zekâ ajanlarının çalıştırdığı kabuk komutlarını veya çok kiracılı bulut servislerini koştururken yazılımcıların en yaygın tercihi Docker konteynerleridir. Konteynerin kendi dosya sistemi ve ağ alanı olduğu için dışarıdan yalıtılmış güvenli bir kum havuzu (sandbox) sağladığı varsayılır. Oysa bu yaklaşım işletim sistemi mimarisi açısından ciddi bir güvenlik açığı barındırır: Konteynerler ana makinenin Linux çekirdeğini doğrudan paylaşır.

Your Container Is Not a Sandbox: The State of MicroVM Isolation in 2026 analizinde vurgulandığı üzere, bir konteyner yalnızca namespaces, cgroups ve seccomp filtreleriyle sınırlandırılmış sıradan bir Linux sürecidir. Çekirdekte ortaya çıkan tek bir yerel yetki yükseltme açığı (örneğin Dirty Pipe veya io_uring zafiyetleri), saldırganın konteyner sınırlarını aşarak doğrudan ana makinenin tüm donanımını ve diğer kullanıcıların verilerini ele geçirmesine yeter.

Donanımsal sanallaştırma (Intel VT-x / AMD-V ve KVM) her kiracıya tamamen bağımsız bir çekirdek vererek bu güvenlik açığını kapatır. Ancak yirmi yıldır kullanılan geleneksel QEMU mimarisi bulut dünyası için fazla hantaldır. QEMU, 1990'ların eski PC donanımlarını (disket sürücüleri, IDE denetleyicileri, karmaşık ACPI tabloları ve PCI köprüleri) yazılımsal olarak taklit eder. Bir sanal makinenin açılması 15 ila 30 saniye sürer ve sadece hipervizörün kendisi yüzlerce megabayt RAM tüketir. Bu ağırlık, anlık tetiklenen sunucusuz (serverless) fonksiyonlar veya hızlı yapay zekâ kum havuzları için kullanılamaz.

What is AWS Firecracker? The microVM technology, explained - Northflank ve Firecracker vs Cloud Hypervisor vs Kata Containers: 2026 Guide raporlarında detaylandırıldığı gibi, Rust diliyle KVM üzerinde sıfırdan yazılan Firecracker ve Cloud Hypervisor gibi MicroVM hipervizörleri bu denklemi kökten değiştirdi.

MicroVM mimarisi eski PC donanım taklitlerinin neredeyse tamamını çöpe attı. Disket sürücüleri, karmaşık BIOS ve hantal ACPI tabloları kaldırıldı. Sistem sadece paravirtüalize edilmiş hafif virtio aygıtlarına (ağ için virtio-net, disk için virtio-block ve soket için virtio-vsock) odaklandı.

Sonuç olarak bağımsız bir Linux çekirdeği yalnızca 110 ila 140 milisaniyede sıfırdan ayağa kalkıyor ve hipervizörün bellek ayak izi sadece 5 megabaytta kalıyor.

AWS Lambda'dan Fly.io'ya kadar modern altyapıların omurgasını oluşturan MicroVM teknolojisi, geleneksel sanal makinelerin donanımsal güvenlik sınırlarını Docker konteynerlerinin hafifliği ve hızıyla birleştirerek güvenli yalıtımın yeni endüstri standardını belirliyor.
