---
slug: "robotik-kollarda-tekillik-cikmazi-ve-sonumlu-en-kucuk-kareler"
title_tr: "Robotik Kollarda Sonsuz Hız Yanılsaması: Kinematik Tekillik ve Sönümlü En Küçük Kareler"
title_en: "Robotik Kollarda Sonsuz Hız Yanılsaması: Kinematik Tekillik ve Sönümlü En Küçük Kareler"
excerpt_tr: "Robot kollarının eklemleri belirli bir geometrik hizaya geldiğinde motorların aniden kontrolden çıkıp çılgınca dönmesi, Jacobi matrisinin tekillik noktasında sıfıra bölünmesinden kaynaklanıyor. Sönümlü En Küçük Kareler (DLS) algoritmasıyla sonsuz hız talebini yumuşatmanın matematiğini inceliyoruz."
excerpt_en: "Robot kollarının eklemleri belirli bir geometrik hizaya geldiğinde motorların aniden kontrolden çıkıp çılgınca dönmesi, Jacobi matrisinin tekillik noktasında sıfıra bölünmesinden kaynaklanıyor. Sönümlü En Küçük Kareler (DLS) algoritmasıyla sonsuz hız talebini yumuşatmanın matematiğini inceliyoruz."
date: "2026-10-20"
tags: ["Robotik", "Kontrol Sistemleri", "Gömülü"]
category: "Robotik & Kontrol"
featured: false
published: true
---

Bir simülasyon ortamında veya gerçek atölyenizde çok eksenli bir robot kolunu düz bir hat boyunca hareket ettirirken başınıza gelebilecek en ürkütücü anlardan biri eklemlerin kilitlenmesidir: Robot kolunun ucu hedefe doğru gayet yumuşak ve yavaş bir hızla ilerlerken, aniden eklemlerden biri veya ikisi çılgınca dönmeye başlar; motorlar aşırı akım çeker, mekanik dişliler zorlanır ve kontrol yazılımı acil durdurma (emergency stop) fırlatır.

Bu sarsıntının sebebi motorda veya sürücüde bir donanım arızası olması değildir; robotun geometrisi doğrudan matematiksel bir kara deliğe, yani Kinematik Tekillik (Kinematic Singularity) noktasına girmiştir.

Robotik manipülatörlerde kolun uç noktasının (end-effector) kartezyen uzaydaki hızı ile eklemlerin açısal hızları arasındaki ilişki Jacobi matrisi (
𝐽
J) ile kurulur:

𝑥
˙
=
𝐽
(
𝜃
)
𝜃
˙
x
˙
=J(θ)
θ
˙

Ters kinematik (IK) hesaplarken hedef hız verildiğinde motorlara hangi açısal hızları vermemiz gerektiğini bulmak için Jacobi matrisinin tersini alırız:

𝜃
˙
=
𝐽
−
1
𝑥
˙
θ
˙
=J
−1
x
˙

Robot kolu tamamen ileriye doğru uzandığında veya bilek eklemleri birbirine paralel konuma gelerek bir serbestlik derecesini kaybettiğinde, Jacobi matrisinin determinantı sıfıra yaklaşır. Matrisin tersini almaya çalıştığınızda sıfıra bölme işlemi gerçekleşir ve denklem motorlara matematiksel olarak sonsuz bir açısal hız (
𝜃
˙
→
∞
θ
˙
→∞) emreder. Kontrol yazılımı bu teorik sonsuzluğu yakalamak için motorlara tam güç basar ve robotik kol fiziksel sınırlarını aşarak sarsılır.

Singularity Avoidance in Inverse Kinematics - arXiv ve Review of the damped least-squares inverse kinematics - ResearchGate çalışmalarında incelenen en zarif çözüm, Sönümlü En Küçük Kareler (Damped Least Squares / DLS veya Levenberg-Marquardt) yöntemidir.

DLS yaklaşımında katı matris tersi terk edilir ve denkleme değişken bir sönümleme katsayısı (
𝜆
λ) eklenir:

𝐽
∗
=
𝐽
𝑇
(
𝐽
𝐽
𝑇
+
𝜆
2
𝐼
)
−
1
J
∗
=J
T
(JJ
T
+λ
2
I)
−1

Bu formül robot tekillikten uzaktayken neredeyse standart matris tersi gibi davranır ve kusursuz yörünge takibi sağlar. Ancak eklemler tekillik sınırına yaklaştığında sönümleme faktörü devreye girer; algoritma kolun ucundaki milimetrik takip hassasiyetinden bilinçli olarak mikro düzeyde ödün verir.

Yörüngeden izin verilen binde birlik bir sapma karşılığında motor hızları kesin sınırlar içinde tutulur. Robot kolu tekillik noktasının içinden geçerken motorlar delice savrulmak yerine yumuşak ve akıcı bir yay çizerek hedef rotasını sürdürür.

Robotikte güçlü bir hareket kontrolü inşa etmek, motorlara kusursuz geometrik denklemler dayatmak yerine matrislerin sınırlarını kabul edip mekanik güvenliği matematiksel sönümleyicilerle korumaktan geçiyor.
