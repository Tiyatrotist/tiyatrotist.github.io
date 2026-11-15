---
slug: "gomulu-sistemlerde-6-eksenli-takip-ve-cift-integral-cikmazi"
title_tr: "Gömülü Sistemlerde 6 Eksenli Takip Yanılsaması: IMU, Çift İntegral ve Drift'in Fiziği"
title_en: "Gömülü Sistemlerde 6 Eksenli Takip Yanılsaması: IMU, Çift İntegral ve Drift'in Fiziği"
excerpt_tr: "Mikrodenetleyicilerde bir ivmeölçer ve jiroskop ile nesnelerin açısal yönelimini kusursuz hesaplamak mümkündür; ancak uzaydaki gerçek üç boyutlu konumu bulmaya çalıştığınızda fizik kanunları devreye girer. Çift integralin yarattığı karesel sapma (drift) problemini ve Hata Durumu Kalman Filtresi (ESKF) yaklaşımını inceliyoruz."
excerpt_en: "Mikrodenetleyicilerde bir ivmeölçer ve jiroskop ile nesnelerin açısal yönelimini kusursuz hesaplamak mümkündür; ancak uzaydaki gerçek üç boyutlu konumu bulmaya çalıştığınızda fizik kanunları devreye girer. Çift integralin yarattığı karesel sapma (drift) problemini ve Hata Durumu Kalman Filtresi (ESKF) yaklaşımını inceliyoruz."
date: "2026-10-05"
tags: ["Sistem Mimarisi"]
category: "Sistem Mimarisi"
featured: false
published: true
---

Gömülü sistemlerle ilk kez robotik bir kol, sanal gerçeklik kumandası veya otonom bir araç geliştirmeye başlayan herkesin aklına ilk gelen fikir oldukça mantıklıdır: "Elimde 6 eksenli bir ataletsel ölçüm birimi (IMU) var; ivmeyi zamana göre bir kez entegre edersem hızı, bir kez daha entegre edersem konumu (x, y, z) bulurum."

Kod yazılıp mikrodenetleyiciye yüklendiğinde ise masa üzerinde sabit duran sensör birkaç saniye içinde sanal uzayda yüzlerce metre uzağa fırlar.

Bu durum yazılımdaki bir mantık hatasından değil, doğrudan integral hesabının acımasız doğasından kaynaklanır. Konum denklemi ivmenin zamana göre çift integralidir:

𝑝
(
𝑡
)
=
𝑝
0
+
𝑣
0
𝑡
+
1
2
𝑎
𝑡
2
p(t)=p
0
	​

+v
0
	​

t+
2
1
	​

at
2

Piyasadaki standart MEMS sensörlerde fabrikasyon kaynaklı mikro düzeyde bir gürültü ve sıcaklık kayması (bias) bulunur. Bu sapma saniyede yalnızca 0.005 metre bölü saniyekare gibi ölçülemeyecek kadar önemsiz bir değer olsa bile, çift integral bu hatayı zamanın karesiyle (
𝑡
2
t
2
) çarpar. Dışarıdan hiçbir düzeltme almayan bir IMU, beş saniye içinde santimetrelerce, bir dakika içinde ise onlarca metre konumsal sapma üretir.

Sorunu daha da derinleştiren faktör yerçekimidir. Sensör dünya üzerinde sürekli olarak 1G (yaklaşık 9.81 m/s²) büyüklüğünde bir yerçekimi ivmesi hisseder. Konumu hesaplamak için bu yerçekimi vektörünü ölçümden matematiksel olarak çıkarmanız gerekir. Ancak yönelim (açı) tahmininizde binde birlik bir derece hatası bile varsa, yerçekimi bileşeni yatay eksene sızar ve sensör durduğu yerde sürekli gaza basıyormuş gibi ivme kaydeder.

Bu matematiksel kaçınılmazlığı yönetmek için modern robotik sistemler ResearchGate Smoothed Error-State Kalman Filter (ESKF) Raporu üzerinde detaylandırılan Hata Durumu Kalman Filtresi (Error-State Kalman Filter / ESKF) mimarisine başvurur.

Klasik filtrelerin aksine ESKF, büyük ve doğrusal olmayan yönelim dinamiğini Lie cebiri (
𝑆
𝑂
(
3
)
SO(3) manifoldları) üzerinde hatasız taşırken, filtrenin içine yalnızca küçük hata durumlarını (error states) sokar. Bu sayede açısal hesaplamalardaki kilitlenme (gimbal lock) ve aşırı doğrusallaştırma kayıpları engellenir.

Yine de Daisch Sensor AGV Statik Drift ve ESKF Analizi saha testlerinde vurgulandığı gibi, harici bir referans olmadan salt IMU ile sınırsız 6-DoF pozisyon takibi yapmak fiziksel olarak imkansızdır. Robotun durduğu anları tespit edip hızı sıfırlayan ZUPT (Zero Velocity Update) algoritmaları, optik kamera füzyonu (Visual Inertial Odometry) veya UWB gibi mutlak konum sağlayıcılar devreye girmeden karesel sapma engellenemez.

Gömülü mühendislikte başarılı bir hareket takibi kurmak, sensörün tek başına her şeyi çözeceği yanılsamasından kurtulup çift integralin getirdiği hatayı dış referanslarla disiplin altına alan füzyon algoritmalarını kurgulamaktan geçiyor.
