---
slug: "linux-cekirdeginde-calisirken-zamanlayici-degistirmek-eevdf-ve-sched-ext"
title_tr: "Bilgisayarı Kapatmadan İşlemci Zamanlayıcısını Değiştirmek: Linux'ta EEVDF ve sched_ext"
title_en: "Bilgisayarı Kapatmadan İşlemci Zamanlayıcısını Değiştirmek: Linux'ta EEVDF ve sched_ext"
excerpt_tr: "İşletim sistemi çekirdeğindeki genel amaçlı işlemci zamanlayıcıları her iş yükünü eşit kabul ettiği için oyunlarda ve düşük gecikmeli sunucularda kuyruk tıkanmalarına yol açabiliyor. Sistemi yeniden başlatmadan eBPF üzerinden özel CPU zamanlayıcıları yüklemeyi sağlayan sched_ext mimarisini ve EEVDF geçişini inceliyoruz."
excerpt_en: "İşletim sistemi çekirdeğindeki genel amaçlı işlemci zamanlayıcıları her iş yükünü eşit kabul ettiği için oyunlarda ve düşük gecikmeli sunucularda kuyruk tıkanmalarına yol açabiliyor. Sistemi yeniden başlatmadan eBPF üzerinden özel CPU zamanlayıcıları yüklemeyi sağlayan sched_ext mimarisini ve EEVDF geçişini inceliyoruz."
date: "2026-10-24"
tags: ["Linux", "Çekirdek", "Sistem Programlama", "Zamanlayıcı"]
category: "Linux & Çekirdek"
featured: false
published: true
---

Bir işletim sistemi çekirdeğinde en zor değiştirilen bileşen işlemci zamanlayıcısıdır (CPU scheduler). Hangi iş parçacığının (thread) hangi çekirdekte kaç mikrosaniye boyunca çalışacağına karar veren bu katman üzerinde tek bir satırlık deneme yapmak bile çekirdeği baştan derlemeyi, modülleri kurmayı ve makineyi yeniden başlatmayı gerektirir. Üstelik zamanlayıcı kodunda yapılacak ufak bir kilit hatası tüm sistemin anında donmasıyla sonuçlanır.

Linux çekirdeği, on yılı aşkın süredir kullandığı Tamamen Adil Zamanlayıcı (CFS) mimarisini geride bırakarak Linux Çekirdeği Resmi EEVDF Zamanlayıcı Belgeleri kapsamında detaylandırılan EEVDF (Earliest Eligible Virtual Deadline First) algoritmasına geçti. EEVDF her göreve sanal bir bitiş süresi (virtual deadline) atayarak gecikmeye duyarlı süreçlerin işlemciye daha hızlı ulaşmasını sağlıyor.

Ancak hiçbir genel amaçlı algoritma dünyadaki tüm iş yüklerini aynı anda memnun edemez. Çekirdek, o an çalışan iş parçacığının bir oyunun kare çizim döngüsü mü, kritik bir ağ yanıtı mı yoksa arka planda çalışan önemsiz bir indeksleme görevi mi olduğunu ayırt edemez. Nitekim Meta Mühendislik Ekibinin Açık Kaynak Çekirdek Zamanlayıcı Raporu verilerine göre, sunucu filolarını yeni çekirdeğe yükseltirken genel amaçlı EEVDF zamanlayıcısının arka plan iş parçacıklarıyla ana istek iş parçacıklarını aynı kefeye koyması uç gecikmelerde (p99 latency) ciddi kayıplara yol açtı.

Bu mimari tıkanıklığı kökten çözen yapı, çekirdeğe dahil edilen sched_ext (Extensible Scheduler Class) çerçevesi oldu. sched_ext Mimari Katmanları ve Güvenlik Modeli - Tech Veda analizinde açıklandığı üzere sched_ext, zamanlama kararlarını çekirdeğin sabit C kodundan çıkarıp kullanıcı alanından yüklenen eBPF programlarına devrediyor:

Dağıtım Kuyrukları (Dispatch Queues / DSQ): Çekirdek düşük seviyeli bağlam değiştirme (context switch) mekanizmasını elinde tutarken, hangi görevin hangi çekirdek kuyruğuna gireceği kararı tamamen sched_ext_ops arayüzünü kullanan BPF programına bırakılır.

Canlı Değişim (Hot-Swapping): Sistemi yeniden başlatmadan, tıpkı sıradan bir uygulama çalıştırır gibi saniyeler içinde C veya Rust ile yazılmış yeni bir zamanlayıcı devreye alınabilir.

Çift Katmanlı Güvenlik ve Watchdog: Yazdığınız özel zamanlayıcıda bir sonsuz döngü veya görev açlığı (starvation) oluşursa, çekirdek içindeki bekçi zamanlayıcı (watchdog timer) hatayı otomatik olarak algılar, hatalı BPF zamanlayıcısını sistemden atar ve tüm görevleri çökme yaşanmadan varsayılan EEVDF zamanlayıcısına geri döndürür.

Bu esneklik hem masaüstü oyuncularında hem de devasa veri merkezlerinde somut sonuçlar üretiyor. CachyOS Wiki sched_ext Yapılandırma Kılavuzu üzerinde listelenen scx_lavd ve scx_bpfland gibi zamanlayıcılar, hangi çekirdeklerin aynı L2/L3 önbelleği paylaştığını hesaplayıp oyun iş parçacıklarını önbelleği sıcak tutacak şekilde yerleştirerek kare süresi dalgalanmalarını (frame pacing) minimize ediyor. Sunucu tarafında ise EEVDF Gecikme Kayıplarını sched_ext ile Çözmek - Umesh Malik incelemesinde paylaşıldığı üzere, işlemci çekirdeklerini kritik istek yolu ve arka plan havuzu olarak ikiye ayıran özel bir BPF politikası sayesinde p99 gecikmelerinde yüzde 28 düşüş ve megavatlarca enerji tasarrufu elde edildi.

İşletim sistemi çekirdeğini her iş yüküne tek bir gömlek giydirmeye çalışan monolitik bir yapı olmaktan çıkaran sched_ext, işlemci zamanlamasını doğrudan uygulamanın kendi doğasına göre şekillendirilebilen dinamik bir katmana dönüştürüyor.
