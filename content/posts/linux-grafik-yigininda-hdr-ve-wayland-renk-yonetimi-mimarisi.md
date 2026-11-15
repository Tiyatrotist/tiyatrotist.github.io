---
slug: "linux-grafik-yigininda-hdr-ve-wayland-renk-yonetimi-mimarisi"
title_tr: "Monitördeki Işığı Doğru Hesaplamak: Linux Grafik Yığınında Wayland ve HDR Çözümü"
title_en: "Monitördeki Işığı Doğru Hesaplamak: Linux Grafik Yığınında Wayland ve HDR Çözümü"
excerpt_tr: "Linux masaüstünde yüksek dinamik aralık (HDR) desteği uzun süre X11 mimarisinin sabit sRGB varsayımı nedeniyle ertelendi. Wayland tarafında yıllar süren renk yönetimi protokolünün kararlı hale gelmesiyle birlikte kompozitör, çekirdek sürücüsü ve oyun motorları arasındaki yeni grafik boru hattını inceliyoruz."
excerpt_en: "Linux masaüstünde yüksek dinamik aralık (HDR) desteği uzun süre X11 mimarisinin sabit sRGB varsayımı nedeniyle ertelendi. Wayland tarafında yıllar süren renk yönetimi protokolünün kararlı hale gelmesiyle birlikte kompozitör, çekirdek sürücüsü ve oyun motorları arasındaki yeni grafik boru hattını inceliyoruz."
date: "2026-09-24"
tags: ["Linux", "Çekirdek", "Sistem Programlama"]
category: "Linux & Çekirdek"
featured: false
published: true
---

X11 pencere sistemi onlarca yıl önce tasarlandığında grafik dünyasının kuralları basitti: Ekranlar 8 bit renk derinliğine sahipti, tek renk uzayı sRGB idi ve monitörün parlaklığı sabitti. Günümüzün binlerce nit parlaklığa çıkabilen ve geniş renk gamutunu (DCI-P3, BT.2020) destekleyen OLED panelleri karşısında bu eski grafik yığını tamamen tıkandı. X11 mimarisinde pencerelerin kendi renk uzaylarını pencere yöneticisine dinamik olarak bildirebileceği bir mekanizma bulunmuyordu.

Masaüstünde HDR açmak istediğinizde karşılaşılan sorun sadece parlaklığı artırmak değildi. Ekranda aynı anda açık olan standart bir metin editörü (SDR) ile geniş renk gamutu kullanan bir oyunun (HDR) yan yana doğru parlaklıkta ve bozulmadan çizilmesi gerekiyordu. X11'in pikselleri doğrudan çerçeve arabelleğine (framebuffer) yazan yapısı bu karmaşık renk dönüşümünü kaldıramıyordu.

Çözüm, doğrudan pencere kompozitörünü merkeze alan yeni bir grafik sözleşmesiyle geldi. Linux Çekirdeği ve Wayland Renk Yönetimi Birleşimi ile resmileşen protokol, renk yönetimini istemci ile kompozitör arasında paylaştırıyor. Wayland protokolünde her yüzey (surface), ürettiği piksellerin hangi transfer fonksiyonuna (örneğin PQ veya HLG) ve hangi renk alanına ait olduğunu kompozitöre bildiriyor.

Bu mimarinin arka planda sorunsuz çalışması üçlü bir koordinasyona dayanıyor. Wayland Renk Yönetimi ve HDR Dağıtım Analizi teknik raporunda belirtildiği gibi; masaüstü ortamının kompozitörü (KWin, Gamescope veya Mutter), ekran kartı çekirdek modülü (KMS/DRM) ve çalıştırılan uygulama (Proton veya yerel Vulkan motoru) aynı renk uzayında el sıkışmak zorunda.

Özellikle oyunlarda gecikmeyi sıfıra indirmek için kompozitör aradan çekilip çizim doğrudan ekrana aktarılırken (direct scanout), masaüstü modunda kompozitör dinamik ton haritalama (tone mapping) yaparak SDR pencerelerin gözü kör etmesini engelliyor.

Linux grafik yığını, X11 döneminden kalan kör sRGB varsayımını arkasında bırakarak modern ekran donanımlarının fiziksel sınırlarını doğrudan işletim sistemi çekirdeğine bağlayan olgun bir görüntü mimarisine kavuşmuş durumda.
