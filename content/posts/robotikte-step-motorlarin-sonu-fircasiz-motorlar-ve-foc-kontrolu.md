---
slug: "robotikte-step-motorlarin-sonu-fircasiz-motorlar-ve-foc-kontrolu"
title_tr: "Robotikte Isınan Step Motorların Sonu: BLDC ve Alan Odaklı Kontrol (FOC)"
title_en: "Robotikte Isınan Step Motorların Sonu: BLDC ve Alan Odaklı Kontrol (FOC)"
excerpt_tr: "Robot kollarında ve hareketli mekanizmalarda kullanılan step motorlar dururken dahi tam akım çekerek enerjiyi ısıya dönüştürüyor. Dronlarda görmeye alıştığımız fırçasız motorları manyetik enkoder ve FOC algoritmalarıyla sessiz ve tork kontrollü eyleyicilere dönüştürmenin mantığını inceliyoruz."
excerpt_en: "Robot kollarında ve hareketli mekanizmalarda kullanılan step motorlar dururken dahi tam akım çekerek enerjiyi ısıya dönüştürüyor. Dronlarda görmeye alıştığımız fırçasız motorları manyetik enkoder ve FOC algoritmalarıyla sessiz ve tork kontrollü eyleyicilere dönüştürmenin mantığını inceliyoruz."
date: "2026-09-30"
tags: ["Robotik", "Kontrol Sistemleri", "Gömülü", "FOC"]
category: "Robotik & Kontrol"
featured: false
published: true
---

Kendi robot kolunuzu veya çok eksenli bir hareket mekanizmasını tasarlarken donanım tarafında başvurulan geleneksel tercihler bellidir: Ya yüksek dişli boşluğuna (backlash) sahip ucuz RC servolar ya da 3D yazıcılardan tanıdığımız step motorlar. Ancak step motorlar mekanik olarak durdukları yerde bile tam akım çeker, gövdeleri el değmeyecek sıcaklıklara ulaşır ve tork sınırı aşıldığında adım kaçırarak tüm konum bilgisini sıfırlar.

Bu verimsizliğin temel sebebi açık döngülü (open-loop) kontroldür. Sürücü, motor milinin gerçekten dönüp dönmediğini bilmez; mil yüke binse de boşa dönse de sargılara aynı yüksek akımı pompalar. Çekilen gücün yarısından fazlası mekanik torka değil, doğrudan atık ısıya dönüşür.

Robotik projelerinde bu darboğazı aşan mimari, dronlardan tanıdığımız fırçasız doğru akım (BLDC) motorlarının Alan Odaklı Kontrol (Field-Oriented Control / FOC) yöntemiyle sürülmesidir. Motor milinin arkasına 12 veya 14 bitlik minyatür bir manyetik enkoder yerleştirildiğinde, mikrodenetleyici rotorun anlık açısını tam olarak takip edebilir hale gelir.

SimpleFOC Resmi Belgeleri ve Mimarisi üzerinden incelenebileceği gibi, sistem motorun üç fazlı alternatif akımını Clarke ve Park matematiksel dönüşümleriyle iki eksenli bir doğru akım bileşenine (manyetik alan oluşturan Id ve tork üreten Iq) indirger. Algoritma, statordaki elektromanyetik alanı rotorun kalıcı mıknatısına her zaman tam 90 derece dik tutacak şekilde fazları mikrosaniyeler içinde tetikler.

Bu vektörel yaklaşım motora üç temel üstünlük kazandırır:

Motor sıfır devirde veya çok düşük hızlarda dahi adım titreşimi olmadan tamamen pürüzsüz ve sessiz döner.

Sürücü yalnızca o an gereken yük kadar akım çeker, böylece boşta beklerken aşırı ısınma ve enerji israfı ortadan kalkar.

Tork doğrudan kontrol edilebildiği için sisteme şeffaf kuvvet kontrolü (compliance) kazandırılır.

ResearchGate SimpleFOC Bilimsel Makalesi verilerinde de gösterildiği üzere, ESP32 veya STM32 gibi erişilebilir mikrodenetleyicilerde koşan bu algoritmalar, robotik kolların dışarıdan gelen fiziksel bir direnci hissedip esnemesini mümkün kılıyor. Geliştiriciler için FOC, pahalı endüstriyel tork motorlarına muhtaç kalmadan hassas ve güvenli robotik eyleyiciler inşa etmenin standart yolu haline geliyor.
