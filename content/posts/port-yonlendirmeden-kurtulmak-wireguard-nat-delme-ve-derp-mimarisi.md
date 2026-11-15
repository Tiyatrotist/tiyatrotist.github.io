---
slug: "port-yonlendirmeden-kurtulmak-wireguard-nat-delme-ve-derp-mimarisi"
title_tr: "Port Açmadan Dünyaya Bağlanmak: WireGuard, NAT Delme ve DERP Mimarisi"
title_en: "Port Açmadan Dünyaya Bağlanmak: WireGuard, NAT Delme ve DERP Mimarisi"
excerpt_tr: "Evdeki sunucunuza, Raspberry Pi cihazınıza veya test ortamınıza dışarıdan erişmek uzun süre modemde güvensiz port yönlendirmeleri yapmayı ve operatörlerin CGNAT duvarlarına takılmayı gerektirdi. WireGuard tabanlı mesh VPN'lerin UDP delme (hole punching) ve DERP röleleriyle kurduğu doğrudan P2P tünel mimarisini inceliyoruz."
excerpt_en: "Evdeki sunucunuza, Raspberry Pi cihazınıza veya test ortamınıza dışarıdan erişmek uzun süre modemde güvensiz port yönlendirmeleri yapmayı ve operatörlerin CGNAT duvarlarına takılmayı gerektirdi. WireGuard tabanlı mesh VPN'lerin UDP delme (hole punching) ve DERP röleleriyle kurduğu doğrudan P2P tünel mimarisini inceliyoruz."
date: "2026-10-10"
tags: ["Ağ Mimarisi", "Protokoller", "WireGuard"]
category: "Ağ & Protokoller"
featured: false
published: true
---

Evinizdeki bir Linux sunucusuna, Raspberry Pi kartına veya yerel olarak çalışan bir geliştirme ortamına dışarıdayken bağlanmak istediğinizde ağ dünyasının en can sıkıcı engeliyle karşılaşırsınız: Ağ Adresi Çevirisi (NAT) ve internet servis sağlayıcıların uyguladığı Taşıyıcı Düzeyinde NAT (CGNAT). Modeminize statik bir genel IP verilmediği için dış dünyadan gelen bağlantı talepleri doğrudan servis sağlayıcının güvenlik duvarına çarparak yok olur.

Yıllarca bu engeli aşmak için modem üzerinden port yönlendirmek (port forwarding) veya Dynamic DNS servislerine güvenmek önerildi. Ancak ev yönlendiricinizde dışarıya açık portlar bırakmak tüm ev ağını otomatik port tarayıcılarının ve sıfırıncı gün saldırılarının açık hedefi haline getirir.

WireGuard Mesh VPN ve Port Yönlendirmesiz Uzaktan Erişim Analizi raporunda açıklandığı gibi, Tailscale ve NetBird gibi modern mesh VPN araçları bu sorunu tek bir port açmadan doğrudan eşler arası (P2P) tünelleme ile çözüyor. Sistemin temelinde iki aşamalı bir mühendislik mantığı yatıyor:

İlk adım STUN (Session Traversal Utilities for NAT) protokolüyle dış dünyadaki port eşleşmesini öğrenmektir. Aygıtınız dışarıdaki merkezi bir sunucuya küçük bir UDP paketi atar ve "Dışarıdan bakıldığında benim genel IP adresim ve port numaram kaç görünüyor?" diye sorar. Her iki taraf da kendi harici port haritasını öğrendiğinde UDP Delme (UDP Hole Punching) tekniği devreye girer. İki uç birbirlerinin dış portlarına aynı anda UDP paketleri göndermeye başlar. NAT yönlendiricileri bu giden paketleri gördüğünde kendi tablolarında karşılıklı durum (state) oluşturur ve güvenlik duvarı iki cihaz arasında doğrudan bir geçit açar.

Doğrudan açılan bu geçit üzerinde Linux çekirdeğinin yüksek performanslı WireGuard şifrelemesi çalışır. Trafik hiçbir ara sunucuya uğramadan, doğrudan yerel internet hızınızla ve sıfır gecikme kaybıyla akmaya başlar.

Peki iki taraf da katı simetrik NAT (her bağlantıya rastgele farklı port atayan kurumsal ağlar veya hücresel bağlantılar) arkasındaysa ne olur? İşte bu noktada NetBird ve Tailscale Mesh VPN Mimarisi İncelemesi yazısında vurgulanan DERP (Designated Encrypted Relay for Packets) röleleri devreye girer.

DERP sunucuları standart 443 HTTPS portu üzerinden şifreli WireGuard paketlerini iki düğüm arasında aktarır. Bu röle sunucuları paketlerin içeriğini asla göremez; çünkü veriler doğrudan cihazların özel WireGuard anahtarlarıyla şifrelenmiştir. Röle yalnızca doğrudan P2P bağlantı kurulana kadar geçici bir köprü görevi görür.

Kendi Sunucunda VPN Karşılaştırması 2026 - VPNSmith incelemelerinde belirtildiği üzere, ağ protokollerinin bu zarif uyumu sayesinde port yönlendirme çilesi tarihe karışıyor. Geliştiriciler dünyanın neresinde olursa olsun kendi ev laboratuvarlarına sanki aynı yerel ağdaymış gibi uçtan uca şifreli ve doğrudan erişebiliyor.
