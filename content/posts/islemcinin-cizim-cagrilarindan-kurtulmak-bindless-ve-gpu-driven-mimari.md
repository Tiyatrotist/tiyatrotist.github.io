---
slug: "islemcinin-cizim-cagrilarindan-kurtulmak-bindless-ve-gpu-driven-mimari"
title_tr: "İşlemcinin Çizim Döngülerinden Kurtulmak: Bindless ve GPU Tabanlı Render"
title_en: "İşlemcinin Çizim Döngülerinden Kurtulmak: Bindless ve GPU Tabanlı Render"
excerpt_tr: "Oyun motorlarında yüz binlerce nesneyi ekrana çizmek işlemciyi (CPU) binlerce çizim çağrısı ve doku bağlama döngüsüyle kilitliyor. Tüm sahneyi tek bir dolaylı komutla ve GPU'nun kendi görünürlük hesaplamasıyla çizen Bindless ve GPU-driven render mimarisini inceliyoruz."
excerpt_en: "Oyun motorlarında yüz binlerce nesneyi ekrana çizmek işlemciyi (CPU) binlerce çizim çağrısı ve doku bağlama döngüsüyle kilitliyor. Tüm sahneyi tek bir dolaylı komutla ve GPU'nun kendi görünürlük hesaplamasıyla çizen Bindless ve GPU-driven render mimarisini inceliyoruz."
date: "2026-11-13"
tags: ["Grafik Mimarisi", "GPU"]
category: "Grafik & Render"
featured: false
published: true
---

Üç boyutlu bir oyun sahnesinde yüz bin nesne (ağaçlar, binalar, kayalar, parçacıklar) varken kare hızının düşmesinin temel sebebi çoğu zaman ekran kartının gücünün yetmemesi değildir. İşlemci (CPU), her bir nesneyi ekrana çizmek için gereken komutları yetiştiremez ve grafik kartı iş beklerken kare hızları düşer. Yirmi yılı aşkın süredir kullanılan geleneksel bağlamalı (bindful) render yaklaşımında işlemci yüz bin kez döngüye girer: Görünürlüğü kontrol eder, materyal dokularını grafik boru hattına bağlar ve API üzerinden tek tek çizim çağrısı (DrawIndexed) fırlatır.

Bindless rendering setup and pipeline architecture - Traverse Research kılavuzunda açıklandığı üzere, eski modelde her çizim çağrısı için kök imzaları değiştirmek, tanımlayıcı tablolarını (descriptor tables) GPU belleğine taşımak ve boru hattı durumlarını güncellemek gerekir. Çizim sayısı arttıkça sürücü seviyesindeki bu bürokrasi işlemci çekirdeklerini tüketir; üstelik görünürlük denetimi için GPU'dan veri okumaya (readback) kalktığınızda işlemci milisaniyelerce donarak bekler.

Unreal Engine RHI Bindless Rendering Architecture belgelerinde ve modern grafik API'lerinde detaylandırıldığı gibi, bu kısıtı kaldıran ilk adım Bindless (Bağlantısız) kaynak yönetimidir. Oyundaki on binlerce doku ve arabellek, tek bir devasa global tanımlayıcı yığınına (descriptor heap) yerleştirilir. Gölgelendiriciler (shader) artık tek tek doku bağlamak zorunda kalmaz; nesneler materyallerine doğrudan 32 bitlik basit bir bellek indeksiyle erişir.

Indirect draws in WebGPU and why they're so powerful - Tiger's Place teknik analizinde vurgulanan ikinci sacayağı ise Dolaylı Çizimdir (Indirect Draw). Sistemde işlemcinin rolü tek bir tetikleyiciye indirgenir:

İşlemci sahnedeki tek tek nesnelerle ilgilenmez; sadece GPU üzerinde bir hesaplama gölgelendiricisi (Compute Shader) başlatır.

Compute shader, yüz binlerce nesnenin kamera açısında olup olmadığını ve diğer nesnelerin arkasında kalıp kalmadığını (Hierarchical Z-Buffer culling) GPU paralel çekirdeklerinde mikrosaniyeler içinde hesaplar.

Hayatta kalan nesnelerin çizim parametreleri (kaç üçgen çizileceği, hangi bellek aralığının okunacağı) doğrudan GPU VRAM'inde bir dolaylı argüman arabelleğine yazılır.

İşlemci sahneyi çizmek için tek bir komut verir (Multi-Draw Indirect). Ekran kartı kendi yazdığı argümanları okur ve çizimi tek seferde tamamlar.

Introducing the Unity Graphics Kernel: Multi Draw Indirect & Bindless duyurusunda görüldüğü üzere, Unreal Engine Nanite mimarisinin ardından Unity ve açık kaynak motorlar da çizim yönetimini doğrudan GPU'ya devrediyor. Sahneye bin nesne koymakla bir milyon nesne koymak işlemci açısından farksız hale geliyor; çünkü CPU hiçbir nesneyi tek tek görmüyor, döngü işletmiyor ve geri okuma beklemiyor.

Grafik programlamada işlemcinin orkestra şefliği yaptığı dönem kapanırken, sahnenin görünürlüğünü ve çizim kararlarını doğrudan kendi içinde hesaplayan GPU tabanlı (GPU-driven) boru hatları, modern oyun motorlarında sınırsız geometri yoğunluğunun önündeki son engeli de ortadan kaldırıyor.
