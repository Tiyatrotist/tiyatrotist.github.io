---
slug: "tarayicida-sifir-sunucu-maliyeti-webgpu-ve-webllm-mimarisi"
title_tr: "Statik Sitede Sıfır Sunucu Maliyetiyle Yapay Zekâ: WebGPU ve WebLLM"
title_en: "Statik Sitede Sıfır Sunucu Maliyetiyle Yapay Zekâ: WebGPU ve WebLLM"
excerpt_tr: "Kişisel web sitelerine yapay zekâ özellikleri eklemek uzun süre pahalı bulut API aboneliklerine ve güçlü sunucu faturalarına bağlı kaldı. WebGPU standardı sayesinde doğrudan ziyaretçinin yerel ekran kartında çalışan modellerin mimarisini ve getirdiği mühendislik fırsatlarını inceliyoruz."
excerpt_en: "Kişisel web sitelerine yapay zekâ özellikleri eklemek uzun süre pahalı bulut API aboneliklerine ve güçlü sunucu faturalarına bağlı kaldı. WebGPU standardı sayesinde doğrudan ziyaretçinin yerel ekran kartında çalışan modellerin mimarisini ve getirdiği mühendislik fırsatlarını inceliyoruz."
date: "2026-10-06"
tags: ["Yapay Zeka", "Derin Öğrenme"]
category: "Yapay Zeka"
featured: false
published: true
---

Statik bir web sitesi veya kişisel bir portfolyo yönetiyorsanız, ziyaretçilere etkileşimli bir yapay zekâ aracı sunmanın önündeki en büyük engel her zaman altyapı maliyetidir. İster basit bir metin özetleyici ister bir arama asistanı kurmak isteyin, standart mimari kullanıcıdan gelen girdiyi uzak bir sunucuya göndermeyi, pahalı GPU sunucuları kiralamayı ya da her API çağrısı için kredi kartı faturası ödemeyi gerektirir.

WebGPU standardının tarayıcılarda kararlı hale gelmesi bu ekonomik ve teknik zorunluluğu ortadan kaldırdı. Pinggy WebGPU ve Tarayıcı İçi Çıkarım İncelemesi yazısında gösterildiği gibi, artık istemcinin tarayıcı sekmesi doğrudan bir yapay zekâ çalışma zamanına (runtime) dönüşebiliyor.

Bu dönüşümün omurgasını oluşturan WebLLM Resmi Deposu ve Mimarisi, eskiyen WebGL katmanının kısıtlarını aşarak doğrudan işletim sisteminin yerel grafik arayüzlerine (Vulkan, Metal ve DirectX 12) bağlanıyor. Sistem iki temel bileşenin uyumuyla işliyor:

WebAssembly (Wasm), modelin yürütme mantığını ve bellek yönetimini yüksek hızda kontrol ediyor.

WGSL (WebGPU Shading Language) hesaplama gölgelendiricileri, matris çarpımlarını ve dikkat (attention) katmanlarını doğrudan kullanıcının kendi ekran kartı çekirdeklerine dağıtıyor.

Mimari, statik site geliştiricileri için benzersiz kazanımlar sunuyor:

Sunucu Faturası Sıfırdır: Model sunucuda değil, sayfayı açan kişinin cihazında koşar. Sitenize aynı anda bin kişi girse dahi sunucunuza tek kuruş ek yük binmez.

Mutlak Veri Gizliliği: Ziyaratçinin yazdığı metinler, yüklediği belgeler veya kod parçaları hiçbir zaman harici bir sunucuya aktarılmaz; her şey tamamen yerel bellekte işlenir.

Çevrimdışı Çalışma: Model ağırlıkları IndexedDB üzerinde tarayıcı önbelleğine bir kez indirildikten sonra, sayfa internet bağlantısı olmadan da tam işlevsellikle çalışabilir.

Elbette bu yaklaşımın mühendislik tarafında çözülmesi gereken somut sınırları var. Sayfayı ilk kez ziyaret eden bir kullanıcının 1 ila 2 gigabaytlık kuantize edilmiş model ağırlıklarını (örneğin Llama 3.2 1B veya hafif bir SLM modelini) indirmesi gerekir. Ayrıca eski mobil cihazlardaki katı bellek (VRAM) kotaları model boyutlarının titizlikle optimize edilmesini zorunlu kılar.

Yine de basit bir HTML/JS statik dosya barındırma alanını bağımsız bir yapay zekâ platformuna çevirebilmek, web geliştirmede istemci tarafı bilişimin geleceğini şekillendiren en güçlü araçlardan biri haline geliyor.
