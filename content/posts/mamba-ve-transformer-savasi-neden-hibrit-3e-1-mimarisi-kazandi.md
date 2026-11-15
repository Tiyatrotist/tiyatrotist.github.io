---
slug: "mamba-ve-transformer-savasi-neden-hibrit-3e-1-mimarisi-kazandi"
title_tr: "Mamba Transformer'ı Neden Öldüremedi: 3:1 Hibrit Mimari ve Bellek Çıkmazı"
title_en: "Mamba Transformer'ı Neden Öldüremedi: 3:1 Hibrit Mimari ve Bellek Çıkmazı"
excerpt_tr: "Durum Uzayı Modelleri (SSM) ve Mamba, doğrusal karmaşıklıkları ve sabit bellek kullanımlarıyla Transformer mimarisini tarihe gömmeyi vadetmişti. Ancak sabit boyutlu gizli durumların yaşadığı çağrışım kaybı nedeniyle büyük yapay zekâ laboratuvarlarının neden 3:1 oranlı hibrit mimarilerde birleştiğini inceliyoruz."
excerpt_en: "Durum Uzayı Modelleri (SSM) ve Mamba, doğrusal karmaşıklıkları ve sabit bellek kullanımlarıyla Transformer mimarisini tarihe gömmeyi vadetmişti. Ancak sabit boyutlu gizli durumların yaşadığı çağrışım kaybı nedeniyle büyük yapay zekâ laboratuvarlarının neden 3:1 oranlı hibrit mimarilerde birleştiğini inceliyoruz."
date: "2026-11-15"
tags: ["Yapay Zeka", "Derin Öğrenme", "LLM Mimarisi"]
category: "Yapay Zeka"
featured: true
published: true
cover_image: "/blog/gemini/gemini_captured_2.png"
---

Transformer mimarisinin en büyük yapısal kusuru uzun zamandır biliniyor: Dikkat (Attention) mekanizması, bağlam penceresindeki her bir kelime parçasını diğer tüm parçalarla karşılaştırır. Metin uzunluğu (
𝑁
N) iki katına çıktığında işlem maliyeti karesel (
𝑂
(
𝑁
2
)
O(N
2
)) olarak artar ve her yeni token için saklanması gereken KV önbelleği (KV-cache) ekran kartı belleğini hızla tüketir. 2023 sonunda Mamba ve Durum Uzayı Modelleri (State Space Models / SSM) sahneye çıktığında, karesel maliyeti doğrusal zamana (
𝑂
(
𝑁
)
O(N)) indiren ve büyüyen KV önbelleğini sabit boyutlu bir durum vektörüne sıkıştıran yeni nesil kurtarıcı olarak görüldü.

Ancak iki buçuk yıllık gerçek dünya testleri farklı bir tablo ortaya koydu. State Space Models in 2026: The Recall Gap, and What Finally Closed It - Acing AI analizinde belgelendiği üzere, bugüne kadar hiçbir büyük yapay zekâ laboratuvarı sınır ölçeğinde saf bir Mamba ya da tekrarlayan (recurrent) model yayımlamadı. Saf SSM modelleri işlem hızı ve bellek tasarrufu tartışmasını kazandı, fakat bağlam içi tam hatırlama (associative recall) testlerinde geride kaldı.

Sorunun kök nedeni doğrudan matematiğin kendisindedir. Beyond attention with Mamba, state space models and hybrids incelemesinde gösterildiği gibi, bir SSM katmanı tüm geçmiş metni sabit boyutlu bir matris durumunun içine sıkıştırmak zorundadır. Sabit bir bellek alanı doğası gereği kayıplı bir sıkıştırmadır. Bağlam 100.000 token'a ulaştığında model genel temayı korur; ancak 40.000 token önce geçen rastgele bir API anahtarını, değişken adını veya sayıyı kelimesi kelimesine (verbatim) geri çağırmakta zorlanır. Transformer'ın KV önbelleği bellekte yer kaplasa da geçmişteki her veriyi sıfır kayıpla doğrudan adresleyebilir.

Bu yapısal açmaz, birbirinden bağımsız çalışan rakip laboratuvarları aynı pratik çözümde buluşturdu: 3:1 hibrit mimari. Jamba, Nemotron 3, Granite 4, Zamba2 ve Qwen 3.5 gibi modern modellerin tamamı saf tekrarlayan yapı yerine karma bir yığın kullanıyor. Bu düzende her dört katmandan üçü doğrusal zamanlı SSM veya kapılı doğrusal dikkat (Gated DeltaNet) katmanlarından oluşurken, dördüncü katman olarak tam dikkat (full attention) katmanı korunuyor.

Bu 3:1 oranı iki dünyanın avantajını tek çatıda topluyor:

Katmanların yüzde 75'i sabit bellek tükettiği için toplam KV önbelleği yükü geleneksel bir Transformer'a kıyasla 4 ila 7 kat azalıyor.

Aralara yerleştirilen yüzde 25'lik tam dikkat katmanları, modelin uzun metinlerdeki kesin bilgiyi kayıpsız çekip alması için gereken "topla ve birleştir" (gather-and-aggregate) devrelerini canlı tutuyor.

Elbette hibrit tasarım çıkarım motorları tarafında yeni mühendislik sorunları da doğuruyor. Asymmetric Virtual Memory Paging for Hybrid Mamba-Transformer - arXiv çalışmasında incelendiği gibi, tek bir modelin içinde hem sürekli büyüyen KV önbellekleri hem de sabit boyutlu ama her adımda güncellenen SSM durumları bulunduğundan sunucu bellek yöneticilerinin (vLLM gibi) asimetrik sayfalama yapması gerekiyor. Ayrıca düşünce zinciri (Chain-of-Thought) sonradan eğitimi uygulanan hibrit modellerde uzun menzilli hatırlama oranlarının düşebildiği de gözlemleniyor.

Yine de yapay zekâ donanım ve yazılım mimarilerinde kazanan taraf en zarif teorik denklemi kuran değil, bellek ekonomisiyle kesin hatırlama kapasitesini en verimli oranda dengeleyebilen 3:1 hibrit yığınlar oluyor.
