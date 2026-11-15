---
slug: "carpma-isleminin-sonu-158-bit-terner-agirliklar-ve-bitnet"
title_tr: "Çarpma İşleminin Sonu: 1.58-Bit Terner Ağırlıklar ve BitNet Devrimi"
title_en: "Çarpma İşleminin Sonu: 1.58-Bit Terner Ağırlıklar ve BitNet Devrimi"
excerpt_tr: "Yapay zekâ modellerinin devasa ekran kartlarına ve yüksek elektrik faturalarına muhtaç olmasının temel sebebi, trilyonlarca kayan noktalı çarpma işlemidir. Ağırlıkları sadece eksi bir, sıfır ve artı bir olarak tutarak matris çarpımını tamamen devreden çıkaran BitNet b1.58 mimarisini inceliyoruz."
excerpt_en: "Yapay zekâ modellerinin devasa ekran kartlarına ve yüksek elektrik faturalarına muhtaç olmasının temel sebebi, trilyonlarca kayan noktalı çarpma işlemidir. Ağırlıkları sadece eksi bir, sıfır ve artı bir olarak tutarak matris çarpımını tamamen devreden çıkaran BitNet b1.58 mimarisini inceliyoruz."
date: "2026-11-02"
tags: ["Yapay Zeka", "Derin Öğrenme", "Kuantizasyon"]
category: "Yapay Zeka"
featured: false
published: true
---

Derin öğrenme dünyası ortaya çıktığı ilk günden bu yana tek bir matematiksel işleme bağımlı yaşadı: Kayan noktalı matris çarpımı (GEMM). Bir dil modelinden tek bir kelime üretmek için dahi trilyonlarca çarpma ve biriktirme (MAC) işlemi koşturulur. Donanım üreticilerinin yapay zekâ pazarını domine etmesinin arkasındaki ana sebep, grafik kartlarının içine on binlerce kayan noktalı (FP16 veya FP8) çarpma çekirdeği yerleştirebilmeleridir. Ancak kayan noktalı sayılarla çarpma yapmak silikon alanını hızla tüketir, yüksek enerji harcar ve ciddi bir ısı yayar.

Modelleri yerel cihazlarda çalıştırabilmek için yıllarca 16 bitlik ağırlıkları 4 bite veya 3 bite sıkıştıran sonradan kuantizasyon (PTQ) yöntemleri kullanıldı. Ancak bir model 16 bitte eğitilip sonradan budandığında, 3 bitin altına inildiği anda dil yeteneği çöker ve model anlamsız çıktılar üretmeye başlar.

The Era of 1-bit LLMs: All Large Language Models are in 1.58 Bits - Semantic Scholar / arXiv araştırmasıyla duyurulan BitNet b1.58 mimarisi bu denklemi kökten değiştiriyor. Model sonradan sıkıştırılmıyor; doğrudan Terner (üçlü) ağırlıklarla {-1, 0, 1} eğitiliyor. Üç farklı durum teorik olarak yaklaşık 1.58 bitlik bir bilgi alanına denk geldiği için mimari bu isimle anılıyor.

Bir modelin ağırlıkları yalnızca {-1, 0, 1} değerlerinden oluştuğunda matris çarpımının doğası tamamen değişir:

Ağırlık +1 ise girdi değeri doğrudan toplanır (+X).

Ağırlık -1 ise girdi değeri doğrudan çıkarılır (-X).

Ağırlık 0 ise hiçbir işlem yapılmaz, o adım atlanır.

Sinir ağının içindeki tüm matris çarpımları yok olur; geriye yalnızca saf tamsayı toplama ve çıkarma işlemleri kalır.

BitNet b1.58: The 1-Bit LLM That Matches Full-Precision Models - didof.dev ve BitNet: Microsoft's 1-Bit LLMs That Run on Your CPU - Dev.to incelemelerinde gösterildiği gibi, standart bir dizüstü bilgisayar işlemcisinde özel tensör çekirdeği bulunmaz; ancak modern işlemciler (x86 AVX veya ARM NEON) saniyede milyarlarca tamsayı toplama işlemini zorlanmadan yapar.

bitnet.cpp çerçevesi sayesinde, harici bir ekran kartı olmadan sıradan bir bilgisayar işlemcisinde saniyede 30 ila 50 token hızında büyük modeller çalıştırılabiliyor. Üstelik bellekten çekilen veri miktarı dört kat azaldığı için cihazın güç tüketimi yüzde yetmiş oranında düşüyor.

Yapay zekâyı pahalı ve sıcak ekran kartı çiftliklerine mahkum eden kayan noktalı çarpma çağı yerini saf tamsayı aritmetiğine bırakırken, terner ağırlıklar yerel cihazlarda hafif ve verimli modeller koşturmanın yeni mühendislik standardını çiziyor.
