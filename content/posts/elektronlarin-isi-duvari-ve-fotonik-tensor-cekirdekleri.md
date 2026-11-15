---
slug: "elektronlarin-isi-duvari-ve-fotonik-tensor-cekirdekleri"
title_tr: "Elektronların Isı Duvarı: Işık Hızıyla Hesap Yapan Fotonik Tensör Çekirdekleri"
title_en: "Elektronların Isı Duvarı: Işık Hızıyla Hesap Yapan Fotonik Tensör Çekirdekleri"
excerpt_tr: "Modern yapay zekâ işlemcileri matris çarpımları sırasında harcanan enerjinin büyük kısmını silikon üzerindeki mikroskobik bakır yolların elektriksel direncine feda ediyor. Elektronlar yerine lazer ışınlarının optik girişiminden yararlanarak sıfır gecikmeyle analog çarpma işlemi yapan fotonik tensör çekirdeklerini ve mühendislik kısıtlarını inceliyoruz."
excerpt_en: "Modern yapay zekâ işlemcileri matris çarpımları sırasında harcanan enerjinin büyük kısmını silikon üzerindeki mikroskobik bakır yolların elektriksel direncine feda ediyor. Elektronlar yerine lazer ışınlarının optik girişiminden yararlanarak sıfır gecikmeyle analog çarpma işlemi yapan fotonik tensör çekirdeklerini ve mühendislik kısıtlarını inceliyoruz."
date: "2026-10-15"
tags: ["Donanım", "Mikromimari", "Fotonik"]
category: "Donanım & Mimari"
featured: false
published: true
---

Modern bir yapay zekâ hızlandırıcısının (GPU veya NPU) güç tüketim değerlerine baktığınızda karşılaştığınız tablo ürkütücüdür: Kart başına 700 ila 1000 watt düzeyine çıkan güç talebi, devasa veri merkezlerini küçük çaplı elektrik santrallerine dönüştürüyor. Ancak bu devasa enerjinin büyük bölümü karmaşık algoritmik kararlar için değil; milyarlarca transistör arasında elektronları ileri geri itmek ve mikroskobik bakır bağlantıların parazitik kapasitansını şarj etmek için harcanıyor. Bakır veri yollarının elektriksel direnci (Joule ısınması) klasik silikon mimarisinin önüne aşılmaz bir enerji duvarı örüyor.

Yapay zekâ modellerinin çekirdeğinde yer alan Genel Matris Çarpımı (GEMM) işlemlerini bu ısı duvarından kurtarmak isteyen araştırmacılar, elektronlar yerine fotonları (ışığı) merkeze alan optik bilişim mimarilerine yöneliyor.

Optik Tensör Çekirdeği Şeması ve GeMM Mimarisi - ResearchGate çalışmasında açıklandığı üzere, fotonik tensör çekirdekleri dijital mantık kapıları yerine ışığın temel dalga fiziğini kullanır. Çip üzerindeki silikon dalga kılavuzlarına (waveguide) farklı dalga boylarında lazer ışınları enjekte edilir (WDM). Matrisin ağırlıkları ise ışığın fazını veya genliğini değiştiren optik modülatörlerle (Mach-Zehnder interferometreleri ya da mikro halka rezonatörleri) temsil edilir.

Bu mimaride matematik doğrudan fizik yasaları tarafından işletilir:

Çarpma işlemi, ışığın optik bir sönümleyiciden geçirilerek şiddetinin ayarlanmasıyla gerçekleşir.

Toplama işlemi ise birden fazla ışık dalgasının tek bir optik kılavuzda birleşerek üst üste binmesiyle (yapıcı girişim) tamamlanır.

Işık dalgaları çip üzerinde seyrederken tüm matris çarpımı pikosaniyeler düzeyinde, yani ışık hızında ve teorik olarak sıfır dinamik ısınmayla analog olarak sonuçlanır.

Hardware-Efficient Photonic Tensor Core Araştırması - Optica makalesinde belirtildiği gibi, bu mimarinin pratik dünyaya inmesindeki asıl mühendislik darboğazı optik tarafında değil, elektronik köprülerdedir. Dijital sayıları ışık modülatörlerine aktarırken kullanılan DAC (Dijital-Analog Çevirici) ve dedektörden çıkan foton akımını tekrar dijital bite çeviren ADC (Analog-Dijital Çevirici) devreleri, optik hesaplamanın kendisinden katbekat fazla enerji harcayabilir. Ayrıca ışık durdurulup bir RAM hücresinde saklanamadığı için fotonik çekirdeklerin geleneksel bellek hiyerarşisiyle sıkı bir hibrit düzende çalışması gerekir.

Yine de 17 TOPS/W seviyesini aşan enerji verimliliği ve watt başına işlem yoğunluğu, fotonik silikon teknolojisini yapay zekâ donanımlarında bakırın ısı duvarını kırmanın en umut verici fiziksel alternatifi kılıyor.
