---
slug: "isin-yurutmenin-sonu-3d-gaussian-splatting-ve-karo-rasterizasyonu"
title_tr: "Işın Yürütmenin Sonu: 3D Gaussian Splatting ve Karo Tabanlı Rasterizasyon"
title_en: "Işın Yürütmenin Sonu: 3D Gaussian Splatting ve Karo Tabanlı Rasterizasyon"
excerpt_tr: "Fotoğraflardan gerçekçi üç boyutlu sahneler üreten NeRF modelleri, piksel başına sinir ağı koşturduğu için saniyede birkaç kareden öteye gidemedi. Milyonlarca Gauss elipsoidini 16x16 piksellik karolarda doğrudan GPU ile tarayarak 200 FPS hıza ulaşan 3D Gaussian Splatting mimarisini inceliyoruz."
excerpt_en: "Fotoğraflardan gerçekçi üç boyutlu sahneler üreten NeRF modelleri, piksel başına sinir ağı koşturduğu için saniyede birkaç kareden öteye gidemedi. Milyonlarca Gauss elipsoidini 16x16 piksellik karolarda doğrudan GPU ile tarayarak 200 FPS hıza ulaşan 3D Gaussian Splatting mimarisini inceliyoruz."
date: "2026-11-10"
tags: ["Grafik Mimarisi", "GPU", "3D Gaussian Splatting"]
category: "Grafik & Render"
featured: false
published: true
---

Fotoğraflardan gerçek dünyanın üç boyutlu kopyasını çıkaran Nöral Radyans Alanları (NeRF) ilk duyurulduğunda grafik dünyasında büyük bir heyecan yarattı. Farklı açılardan çekilen fotoğraflar çok katmanlı bir yapay sinir ağına (MLP) veriliyor ve kamera sahnenin içinde serbestçe gezdirilebiliyordu. Ancak bu teknolojinin oyunlarda veya sanal gerçeklikte kullanılması imkansızdı. Çünkü ekrandaki her bir pikselin rengini bulmak için kameradan sahneye doğru ışınlar fırlatılıyor (ray-marching) ve tek bir ışın boyunca sinir ağı yüzlerce kez sorgulanıyordu. En güçlü ekran kartlarında dahi saniyede 2 ila 5 kare (FPS) alınabiliyordu.

3D Gaussian Splatting vs NeRF: Neural Rendering Methods Compared - The Future 3D analizinde incelendiği üzere, 3D Gaussian Splatting (3DGS) sahneyi kapalı bir sinir ağı ağırlığında saklama fikrini tamamen terk etti. Bunun yerine sahneyi açık (explicit) bir geometriye dönüştürdü: Milyonlarca yarı saydam, üç boyutlu Gauss elipsoidi. Her bir Gauss noktası uzayda bir konuma, yönelim ve ölçeği belirleyen bir kovaryans matrisine, opaklık değerine ve bakış açısına göre değişen yansımaları tutan küresel harmonik katsayılarına sahiptir. Çizim esnasında tek bir sinir ağı katmanı dahi çalıştırılmaz.

Gaussian splatting: a complete student guide to 3D capture in 2026 - Medium teknik rehberinde açıklandığı gibi, asıl hız sıçraması GPU'nun klasik rasterizasyon boru hattına dönülmesiyle elde edilir:

Ekran 16x16 piksellik karolara (tiles) bölünür.

3D Gauss elipsoitleri kamera açısına göre iki boyutlu elipslere izdüşürülür.

Karolarla kesişen elipsoitler GPU tabanlı hızlı sıralama algoritmalarıyla (Radix Sort) kameraya olan derinliklerine göre önden arkaya sıralanır.

Her bir 16x16 piksel karosu bağımsız bir GPU iş parçacığı öbeğine verilir ve alfa harmanlaması (alpha compositing) piksel opaklığı doyuma ulaşana kadar işletilir.

TileGS: Tile-Local Depth Binning for Gaussian Splatting Rasterization - arXiv raporunda gösterildiği üzere, ışın yürütme gibi pahalı bellek atlamaları ortadan kalktığı için tüketici sınıfı bir ekran kartında dahi 1080p ve 4K çözünürlükte 100 ila 200 FPS hızına rahatlıkla ulaşılır. Sahne eğitimi saatler yerine dakikalar içinde tamamlanır.

SplatBus: A Gaussian Splatting Viewer Framework via GPU IPC - arXiv çalışmasında ve Khronos glTF standartlarında görüldüğü gibi, teknoloji sadece izleyicilerde kalmayıp doğrudan Unreal Engine, Unity ve Blender iş akışlarına entegre ediliyor. Fotoğraf çekerek taranan mekanlar artık poligon modellemeye veya doku kaplamaya gerek kalmadan doğrudan gerçek zamanlı bir oyun sahnesi olarak kullanılabiliyor.

Nöral render dünyasını yavaş ışın yürütme döngülerinden kurtarıp doğrudan GPU'nun doğal rasterizasyon yetenekleriyle buluşturan 3D Gaussian Splatting, gerçek dünya mekanlarını dijital ortama gerçek zamanlı taşımanın yeni endüstri standardı haline geliyor.
