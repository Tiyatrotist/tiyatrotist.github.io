---
slug: "linux-ag-kartinda-paket-dusurmek-xdp-ve-line-rate-ddos-savunmasi"
title_tr: "Ağ Kartında Milyonlarca Paketi Çöpe Atmak: Linux'ta XDP ve Hat Hızında DDoS Savunması"
title_en: "Ağ Kartında Milyonlarca Paketi Çöpe Atmak: Linux'ta XDP ve Hat Hızında DDoS Savunması"
excerpt_tr: "Linux sunuculara yönelik yüksek hacimli DDoS saldırılarında klasik güvenlik duvarları (iptables/nftables) filtreleme yapamadan işlemciyi kilitler. Bellek ayırma aşamasına dahi geçmeden doğrudan ağ kartı sürücüsünde paket düşüren XDP (eXpress Data Path) mimarisini inceliyoruz."
excerpt_en: "Linux sunuculara yönelik yüksek hacimli DDoS saldırılarında klasik güvenlik duvarları (iptables/nftables) filtreleme yapamadan işlemciyi kilitler. Bellek ayırma aşamasına dahi geçmeden doğrudan ağ kartı sürücüsünde paket düşüren XDP (eXpress Data Path) mimarisini inceliyoruz."
date: "2026-10-22"
tags: ["Linux", "Çekirdek", "Sistem Programlama"]
category: "Linux & Çekirdek"
featured: false
published: true
---

Linux tabanlı bir sunucuya saniyede on milyonlarca küçük paketle (SYN flood veya UDP yansıtma) bir DDoS saldırısı düzenlendiğinde sistemin çökme sebebi genellikle bant genişliğinin dolması değildir. Sunucunun işlemcisi gelen paketleri ayıklamaya çalışırken kilitlenir.

Geleneksel Linux ağ yığınında bir paket ağ kartına (NIC) ulaştığında çekirdek sırasıyla şu adımları işletir:

Paket doğrudan bellek erişimiyle (DMA) halka arabelleğine yazılır.

İşlemciye bir donanım kesmesi (IRQ) ve ardından yazılım kesmesi (softirq) gönderilir.

Çekirdek her bir paket için sk_buff (socket buffer) adı verilen yüzlerce baytlık ağır bir metaveri yapısı tahsis eder.

Paket ancak bu bellek tahsisinden sonra iptables, nftables veya bağlantı takip (conntrack) kurallarına ulaşır.

Küçük boyutlu paketlerden oluşan bir saldırıda, saniyede milyonlarca kez sk_buff yapısı oluşturup yok etmek işlemcinin L1/L2 önbelleklerini ve bellek bant genişliğini tüketir. Güvenlik duvarı kuralınız gelen saldırı paketlerini engellemeye ayarlanmış olsa dahi, çekirdek paketi çöpe atmak için önce bellekte yer açmak zorunda kaldığından işlemci yüzde 100 yüke biner ve sunucu meşru trafiğe yanıt veremez hale gelir.

Cloudflare eBPF Replatforming Raporu ve Hat Hızında XDP ve eBPF DDoS Savunması Analizi - wegenz çalışmalarında detaylandırıldığı gibi, XDP (eXpress Data Path) bu kısıtı işletim sistemi çekirdeğinin en uç noktasına inerek aşıyor.

XDP, derlenmiş bir eBPF baytkodunu doğrudan ağ kartı sürücüsünün (hatta donanım destekliyorsa doğrudan SmartNIC çipinin) içine yerleştirir. Paket DMA halkasına girdiği anda, çekirdek henüz tek bir baytlık sk_buff bellek alanı tahsis etmeden önce XDP programı tetiklenir.

Program ham bellek işaretçisi (struct xdp_buff) üzerinden paketin IP ve port başlıklarını yaklaşık 10 nanosaniye içinde inceler. Paket saldırı kriterlerine uyuyorsa program doğrudan XDP_DROP komutunu döner. Ağ kartı sürücüsü paketi anında çöpe atar ve DMA arabelleğini bir sonraki paket için yeniden kullanıma açar. Paket hiçbir zaman Linux ağ yığınına girmez, kesme yükü yaratmaz ve çekirdek belleğinde yer kaplamaz.

XDP Yüksek Performanslı Paket İşleme Kılavuzu 2026 verilerinde görüldüğü üzere, standart tek bir modern CPU çekirdeği XDP ile saniyede 20 ila 25 milyon paketi fiziksel hat hızında (line-rate) filtreleyebilir. Bu performans geleneksel iptables kurallarına kıyasla elli katın üzerinde bir sıçrama anlamına gelir.

Ağ güvenliğinde savunmayı işletim sisteminin derinliklerindeki soyutlama katmanlarında yapmak yerine doğrudan silikona ve sürücü katmanına indirmek, modern altyapıları en agresif paket sellerine karşı dahi ayakta tutan ana mimari prensip haline geliyor.
