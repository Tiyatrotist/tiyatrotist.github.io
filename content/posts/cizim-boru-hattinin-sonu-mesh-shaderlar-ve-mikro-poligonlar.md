---
slug: "cizim-boru-hattinin-sonu-mesh-shaderlar-ve-mikro-poligonlar"
title_tr: "Geleneksel Çizim Boru Hattının Sonu: Mesh Shader'lar ve Mikro Poligonlar"
title_en: "Geleneksel Çizim Boru Hattının Sonu: Mesh Shader'lar ve Mikro Poligonlar"
excerpt_tr: "Oyun motorlarında yirmi yılı aşkın süredir kullanılan tepe noktası (vertex) boru hattı, milyonlarca poligon içeren modern sahnelerde bellek ve piksel israfına yol açıyor. Geometriyi bağımsız parçalara (meshlet) bölerek doğrudan GPU üzerinde hesaplayan Mesh Shader mimarisini inceliyoruz."
excerpt_en: "Oyun motorlarında yirmi yılı aşkın süredir kullanılan tepe noktası (vertex) boru hattı, milyonlarca poligon içeren modern sahnelerde bellek ve piksel israfına yol açıyor. Geometriyi bağımsız parçalara (meshlet) bölerek doğrudan GPU üzerinde hesaplayan Mesh Shader mimarisini inceliyoruz."
date: "2026-10-26"
tags: ["Grafik Mimarisi", "GPU"]
category: "Grafik & Render"
featured: false
published: true
---

Üç boyutlu grafik programlamada DirectX 8 döneminden bu yana neredeyse hiç değişmeyen katı bir kural vardı: İşlemci (CPU) çizim komutunu (draw call) verir, ekran kartı girdi birleştirici (Input Assembler) üzerinden indeks arabelleğini okur, her bir köşe noktasını (vertex) tepe gölgelendiricide (Vertex Shader) işler ve ardından donanımsal tarayıcıya (Rasterizer) fırlatır. Bu sıralı zincir düşük poligonlu dönemde kusursuz çalışsa da, günümüzün on milyonlarca üçgen barındıran film kalitesindeki sahnelerinde GPU bellek denetleyicilerini tamamen tıkıyor.

AMD GPUOpen: Vertex Shader'dan Mesh Shader'a Geçiş Rehberi teknik analizinde vurgulandığı gibi, eski mimarideki ilk darboğaz indeks arabelleğidir. GPU, üçgenleri oluşturmak için sürekli VRAM üzerinden indeks baytlarını çekmek zorundadır ve her tepe noktası diğerlerinden habersiz tek başına dönüştürülür.

Daha da vahim olanı ise pikselden küçük mikro poligonların (sub-pixel triangles) yarattığı aşırı gölgelendirme (over-shading) maliyetidir. Ekran kartları pikselleri 2x2 dörtlüler (quads) halinde tarar; tek bir piksele değen mikroskobik bir üçgen çizilirken o dörtlüdeki diğer 3 piksel çöpe atılmasına rağmen piksel gölgelendirici (Pixel Shader) boş yere çalıştırılır.

NVIDIA Turing ve Modern Mimarilerde Mesh Shader Temelleri belgesinde açıklandığı üzere, Mesh Shader mimarisi bu eski boru hattını tamamen devreden çıkararak genel amaçlı bilgi işlem (compute) benzeri esnek bir modele geçer. Devasa 3D modeller önce çevrimdışı veya dinamik olarak Meshlet adı verilen küçük geometrik öbeklere (genellikle 64 tepe noktası ve 126 üçgen) bölünür.

Yeni boru hattının ilk aşaması Görev Gölgelendiricidir (Task Shader veya Amplification Shader). Task Shader, onlarca meshlet'ten oluşan bir grubu doğrudan GPU'nun yüksek hızlı çip üstü paylaşımlı belleğinde (LDS / shared memory) inceler. Kameranın görüş açısı dışında kalan (frustum culling), arkaya bakan (backface culling) veya diğer nesnelerin arkasında gizlenen (occlusion culling) yüz binlerce üçgeni tek bir köşe noktası dahi dönüştürülmeden mikrosaniyeler içinde çöpe atar.

Oyun Motorlarında Sanallaştırılmış Geometri ve Meshlet Mimarisi - Bevy tartışmalarında öne çıktığı gibi, hayatta kalan meshlet'ler doğrudan Mesh Shader iş gruplarına aktarılır. Köşe noktaları VRAM'e yazılmadan doğrudan çip üzerindeki hızlı yazmaçlarda (registers) işlenir ve taranmaya hazır hale gelir.

İndeks arabelleği trafiği tamamen ortadan kalkarken, Unreal Engine Nanite gibi teknolojilerin arkasındaki sanallaştırılmış mikro poligon geometrisi ve çizim komutsuz (GPU-driven) render motorları mümkün kılınır.

Donanım seviyesinde geometrinin hesaplama çekirdeklerine entegre edilmesi, oyun motorlarını manuel LOD (Detay Seviyesi) hazırlama zahmetinden kurtarırken piksel başına tek bir üçgen yoğunluğunda dahi takılmasız görsel zenginlik sunmanın kapısını aralıyor.
