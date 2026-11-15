---
slug: "insansi-robotlarda-kablo-agirliginin-sonu-48v-ve-gan-devrimi"
title_tr: "Bakır Kabloların Ağırlığından Kurtulmak: Robotikte 48V ve GaN Devrimi"
title_en: "Bakır Kabloların Ağırlığından Kurtulmak: Robotikte 48V ve GaN Devrimi"
excerpt_tr: "İnsansı robotlarda 30'dan fazla motoru geleneksel 12V veya 24V ile beslemek, kalın bakır kablo demetleri yüzünden robotun gövdesine kilolarca ölü ağırlık ekliyor. Akımı yarıya indirip kablo ısı kaybını yüzde 75 azaltan 48V bara mimarisini ve motor içine sığan Galyum Nitrür (GaN) sürücüleri inceliyoruz."
excerpt_en: "İnsansı robotlarda 30'dan fazla motoru geleneksel 12V veya 24V ile beslemek, kalın bakır kablo demetleri yüzünden robotun gövdesine kilolarca ölü ağırlık ekliyor. Akımı yarıya indirip kablo ısı kaybını yüzde 75 azaltan 48V bara mimarisini ve motor içine sığan Galyum Nitrür (GaN) sürücüleri inceliyoruz."
date: "2026-11-09"
tags: ["Donanım", "Mikromimari"]
category: "Donanım & Mimari"
featured: false
published: true
---

Otuz ila kırk bağımsız ekleme sahip iki ayaklı bir insansı robotu veya çevik bir dört ayaklı robot köpeği tasarlarken gövde ağırlığını artıran en sinsi bileşen çoğu zaman motorlar ya da bataryanın kendisi değildir; tüm bu eklemleri birbirine bağlayan bakır kablo demetidir. Mobil robotik dünyası onlarca yıldır standart olarak 12V veya 24V doğru akım (DC) hatlarını kullandı. Ancak bir robotun zıplaması, koşması veya ağır bir yükü kaldırması gerektiğinde eklem motorlarının çektiği anlık akım yüzlerce ampere ulaşır.

Fiziksel sınır basittir: İletken kablolardaki güç kaybı akımın karesiyle doğru orantılıdır (
𝑃
=
𝐼
2
𝑅
P=I
2
R). 24V gerilimle çalışan bir eklem motoruna 1000 watt anlık güç iletmek istediğinizde, kablodan yaklaşık 41.6 amper akım akıtmanız gerekir. 41 amperi eritmeden ve aşırı voltaj düşüşü yaşamadan taşımak kalın ve hantal bakır kablolar (10 AWG) kullanmayı zorunlu kılar. Kolların ve bacakların içinden geçen bu kalın kablolar robota kilolarca ölü ağırlık eklerken, kablo iç direnci enerjiyi doğrudan atık ısıya dönüştürür.

48V GaN Servo Architecture for Humanoid and AMR Procurement teknik raporunda açıklandığı gibi, sistem gerilimini 48 volta çıkarmak bu fiziksel tıkanıklığı anında çözer. Gerilim iki katına çıktığında aynı 1000 watt gücü iletmek için gereken akım 20.8 ampere düşer. Akımın yarıya inmesi, kablolardaki 
𝐼
2
𝑅
I
2
R ısı kaybını tam yüzde 75 oranında azaltır. Mühendisler kalın kablolar yerine hafif ve ince iletkenler (14 AWG) kullanarak robotun hareketli eklemlerindeki kablo ağırlığını yarı yarıya hafifletebilir. Üstelik 48V, motorun zıt elektromotor kuvvetini (Back-EMF) çok daha hızlı yenerek patlayıcı tork tepkilerini mümkün kılar.

Peki endüstri bugüne kadar neden 48V kullanmaktan kaçındı? Sorun geleneksel silikon transistörlerin (MOSFET) anahtarlama kayıplarıydı. Silikon transistörler 48V seviyesinde yüksek frekansta (50 kHz üzeri) sürüldüğünde ters toparlanma yükü (
𝑄
𝑟
𝑟
Q
rr
	​

) yüzünden aşırı ısınır. Bu ısıyı dağıtmak için her eklem sürücüsüne kalın alüminyum soğutucu bloklar eklemek gerekirdi; bu da kablodan kazanılan ağırlık avantajını tamamen sıfırlardı.

Renesas Brings 100V GaN to 48V Power Systems ve Humanoid Robot Power Distribution Harness analizlerinde ortaya konduğu üzere, Galyum Nitrür (GaN) güç yarı iletkenleri bu mimari kilidi açtı. GaN transistörlerin ters toparlanma yükü neredeyse sıfırdır ve nanosaniyeler içinde anahtarlama yapabilir. Sürücünün 100 kHz ile 200 kHz frekansında neredeyse sıfır ısı kaybıyla çalışabilmesi, devasa filtreleme kapasitörlerini ve soğutucu blokları gereksiz kılar.

48V GaN sürücü kartları o kadar küçülüyor ki harici bir sürücü kutusuna ihtiyaç kalmadan doğrudan fırçasız motorun içi boş şaft gövdesine gömülebiliyor. İnsansı robotların mekanik verimliliği, eklemlere kalın kablolar döşemek yerine 48V yüksek gerilimi motorun kendi gövdesinde GaN transistörlerle terbiye eden bu kompakt güç dağıtım mimarisinden geçiyor.
