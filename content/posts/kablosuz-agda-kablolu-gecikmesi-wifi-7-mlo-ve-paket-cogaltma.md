---
slug: "kablosuz-agda-kablolu-gecikmesi-wifi-7-mlo-ve-paket-cogaltma"
title_tr: "Kabloyu Gerçekten Kesmek: Wi-Fi 7, Çoklu Bağlantı (MLO) ve Deterministik Gecikme"
title_en: "Kabloyu Gerçekten Kesmek: Wi-Fi 7, Çoklu Bağlantı (MLO) ve Deterministik Gecikme"
excerpt_tr: "Kablosuz sanal gerçeklik başlıklarında ve rekabetçi oyunlarda yaşanan anlık takılmalar, Wi-Fi ağlarının tek bir frekans bandına hapsolmasından kaynaklanıyor. Aynı veri paketini 5 GHz ve 6 GHz bantlarından aynı anda fırlatarak gecikme dalgalanmasını sıfırlayan Wi-Fi 7 MLO paket çoğaltma mimarisini inceliyoruz."
excerpt_en: "Kablosuz sanal gerçeklik başlıklarında ve rekabetçi oyunlarda yaşanan anlık takılmalar, Wi-Fi ağlarının tek bir frekans bandına hapsolmasından kaynaklanıyor. Aynı veri paketini 5 GHz ve 6 GHz bantlarından aynı anda fırlatarak gecikme dalgalanmasını sıfırlayan Wi-Fi 7 MLO paket çoğaltma mimarisini inceliyoruz."
date: "2026-10-31"
tags: ["Ağ Mimarisi", "Protokoller"]
category: "Ağ & Protokoller"
featured: false
published: true
---

Kablosuz sanal gerçeklik (VR) başlığı kullananların veya rekabetçi çevrimiçi oyun oynayanların değişmeyen tek bir kuralı vardır: Ne kadar hızlı bir yönlendiriciniz olursa olsun Ethernet kablosunun yerini hiçbir şey tutamaz. Wi-Fi 5 ve Wi-Fi 6 standartları saniyede gigabitlerce veri taşıyabilse de kablosuz ortamın doğası gereği yaşanan anlık gecikme sıçramalarını (jitter ve p99 kuyruk gecikmesi) engelleyemez. Bir VR başlığında gecikmenin aniden 5 milisaniyeden 60 milisaniyeye fırlaması, kullanıcının doğrudan mide bulantısı ve baş dönmesi yaşamasıyla sonuçlanır.

Bu kararsızlığın kök nedeni önceki tüm Wi-Fi standartlarının istemci cihazı tek bir frekans bandına bağlamasıdır. Cihazınız yönlendiriciye 5 GHz üzerinden bağlandığında tüm trafik o tek radyo hattından akar. Ortama başka bir kablosuz sinyal girdiğinde veya araya fiziksel bir engel çıktığında radyo kartı paket çakışmasını engellemek için geri çekilmek (CSMA/CA backoff) ve kaybolan paketi yeniden iletmek zorundadır. Paket yerine ulaşana kadar tüm veri kuyruğu şişer ve milisaniyeler süren donmalar yaşanır.

Next-Generation Wi-Fi 7 & Wi-Fi 8 MLO and Ultra-Low Latency - ProjectGuideline teknik raporunda açıklandığı üzere, Wi-Fi 7 (802.11be) standardı bu kuralı Çoklu Bağlantı İşlemi (Multi-Link Operation / MLO) mimarisiyle ortadan kaldırıyor. MLO sayesinde uyumlu bir istemci tek bir kanala mahkum olmak yerine aynı anda hem 5 GHz hem de 6 GHz bantlarına eşzamanlı olarak bağlanabiliyor.

Sistemin sunduğu asıl sıçrama ise gecikmeye duyarlı iş yükleri için geliştirilen Paket Çoğaltma (Packet Duplication) modudur. Latency and Reliability of Wi-Fi 7 MLO for Cloud VR: An Empirical Analysis - ResearchGate testlerinde belgelendiği gibi, kritik bir hareket takibi veya oyun paketi yönlendirici tarafından kopyalanarak hem 5 GHz hem de 6 GHz frekanslarından aynı anda havaya fırlatılıyor.

Frekanslardan birinde elektromanyetik parazit veya paket kaybı yaşansa bile, diğer banttaki ikiz paket hedefine 1 ila 2 milisaniyede ulaşıyor. Alıcı ilk ulaşan paketi kabul edip arkadan gelen kopyayı anında siliyor. Sistemde hiçbir zaman yeniden iletim beklemesi yaşanmıyor.

Wi-Fi 7 MLO vs Single-Band: Latency and Jitter Analysis - KTC Play saha verilerine göre, bu çift hatlı yedeklilik sayesinde gecikme dalgalanmaları tamamen düzleşerek fiziksel bir Cat6 Ethernet kablosunun sunduğu deterministik kararlılık seviyesine ulaşıyor.

320 MHz kanal genişliği ve 4096-QAM modülasyonuyla gelen devasa veri hızlarının ötesinde, Wi-Fi 7'nin kablosuz dünyada yarattığı asıl kırılma; frekans yedekliliğiyle milisaniye düzeyinde öngörülebilir bir zamanlama güvencesi sunabilmesinde yatıyor.
