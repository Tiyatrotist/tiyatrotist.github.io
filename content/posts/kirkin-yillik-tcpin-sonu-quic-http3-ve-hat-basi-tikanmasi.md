---
slug: "kirkin-yillik-tcpin-sonu-quic-http3-ve-hat-basi-tikanmasi"
title_tr: "Kırk Yıllık TCP Mantığının Sonu: QUIC, HTTP/3 ve Hat Başı Tıkanması"
title_en: "Kırk Yıllık TCP Mantığının Sonu: QUIC, HTTP/3 ve Hat Başı Tıkanması"
excerpt_tr: "İnterneti kırk yıldır taşıyan TCP protokolü, tek bir veri paketi kaybolduğunda arkadan gelen tüm akışı donduran katı bir sıra garantisine dayanıyor. UDP üzerinde yükselen QUIC ve HTTP/3 mimarisinin hat başı tıkanmasını (head-of-line blocking) nasıl ortadan kaldırdığını ve kesintisiz IP geçişlerini inceliyoruz."
excerpt_en: "İnterneti kırk yıldır taşıyan TCP protokolü, tek bir veri paketi kaybolduğunda arkadan gelen tüm akışı donduran katı bir sıra garantisine dayanıyor. UDP üzerinde yükselen QUIC ve HTTP/3 mimarisinin hat başı tıkanmasını (head-of-line blocking) nasıl ortadan kaldırdığını ve kesintisiz IP geçişlerini inceliyoruz."
date: "2026-10-16"
tags: ["Diller", "Sistem Programlama"]
category: "Diller & Çalışma Zamanları"
featured: false
published: true
---

1980'lerin başında tasarlanan TCP (Transmission Control Protocol), internetin omurgasını tek bir temel ilke üzerine kurdu: Gönderilen baytlar alıcıya kesinlikle kayıpsız ve tam olarak gönderildiği sırayla (in-order delivery) ulaşmalıdır. Bu kural o dönemin güvenilmez telefon hatları için bir devrimdi; ancak günümüzün yüksek hızlı, çok kanallı modern web dünyasında ciddi bir mimari darboğaza dönüştü.

HTTP/2 standardı web sayfalarının hızlanması için tek bir TCP bağlantısı üzerinden aynı anda onlarca farklı kaynağın (JavaScript dosyaları, CSS, resimler ve API istekleri) taşınmasını sağlayan çoklama (multiplexing) tekniğini getirdi. Ancak bu yaklaşım TCP'nin katı doğası yüzünden büyük bir kusuru da beraberinde taşıdı: Hat Başı Tıkanması (Head-of-Line Blocking).

Understanding Head-of-Line Blocking: HTTP/2 vs. HTTP/3 (QUIC) analizinde açıklandığı gibi, tek bir TCP soketi üzerinde elli farklı akış akarken aradaki tek bir paket kaybolduğunda (örneğin zayıf bir Wi-Fi sinyali nedeniyle), işletim sistemi çekirdeğindeki TCP arabelleği tüm akışı dondurur. Kaybolan paket tekrar istenip yerine konana kadar, arkadan sorunsuz gelen kırk dokuz dosyanın paketleri tarayıcıya teslim edilemez. Tek bir önemsiz görsel paketinin düşmesi, sitenin kritik JavaScript kodunun çalışmasını engeller.

HTTP/3 & QUIC in Production (2026): A Practical Playbook kılavuzunda incelenen QUIC protokolü ve HTTP/3, bu kilitlenmeyi aşmak için TCP'yi tamamen terk ederek UDP katmanına geçti.

QUIC, her bağımsız veri akışını doğrudan taşıma katmanı seviyesinde tanır. Bir web sayfasına ait resim dosyasının paketi kaybolduğunda yalnızca o resmin akışı bekler; CSS stilleri, metinler ve API yanıtları sıfır gecikmeyle akmaya devam eder. Üstelik TLS 1.3 şifrelemesi doğrudan taşıma protokolünün içine gömüldüğü için bağlantı kurulumundaki el sıkışma gecikmesi tek bir tura (1-RTT), hatta daha önce ziyaret edilen sitelerde sıfır tura (0-RTT) iner.

HTTP/2 vs HTTP/3 Stream Blocking ve Connection Migration Analizi üzerinde durulan diğer kritik avantaj ise bağlantı geçişidir (Connection Migration).

Klasik TCP'de bağlantı istemcinin IP adresi ve port numarasına sıkı sıkıya bağlıdır. Evinizden çıkarken telefonunuz Wi-Fi ağından hücresel 5G şebekesine geçtiğinde IP adresiniz değişir ve mevcut tüm TCP soketleri anında kopar; indirmeler durur, SSH oturumu düşer.

QUIC ise IP adreslerine değil, 64 bitlik rastgele bir Bağlantı Kimliğine (Connection ID) dayanır. Arayüzünüz ve genel IP adresiniz değişse bile cihazınız yeni IP üzerinden aynı kimlikle veri göndermeyi sürdürür ve sunucu bağlantıyı hiçbir kopma yaşamadan kesintisiz devam ettirir.

Ağ mühendisliğinde kırk yıldır değişmez kabul edilen kuralların yerini alan QUIC, internet trafiğini hantal çekirdek kilitlerinden kurtararak uçtan uca esnek ve bağımsız veri yollarına dönüştürüyor.
