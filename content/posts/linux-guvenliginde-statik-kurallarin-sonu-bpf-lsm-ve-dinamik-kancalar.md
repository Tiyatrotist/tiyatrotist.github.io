---
slug: "linux-guvenliginde-statik-kurallarin-sonu-bpf-lsm-ve-dinamik-kancalar"
title_tr: "Statik Kuralların Sonu: Linux'ta BPF LSM ve Dinamik Çekirdek Güvenliği"
title_en: "Statik Kuralların Sonu: Linux'ta BPF LSM ve Dinamik Çekirdek Güvenliği"
excerpt_tr: "Linux sunucularda SELinux ve AppArmor'un hantal politika dosyaları modern konteyner ve mikroservis dünyasında yetersiz kalıyor. Çekirdek karar noktalarına doğrudan BPF programları bağlayarak sıfırıncı gün saldırılarını anında engelleyen BPF LSM mimarisini inceliyoruz."
excerpt_en: "Linux sunucularda SELinux ve AppArmor'un hantal politika dosyaları modern konteyner ve mikroservis dünyasında yetersiz kalıyor. Çekirdek karar noktalarına doğrudan BPF programları bağlayarak sıfırıncı gün saldırılarını anında engelleyen BPF LSM mimarisini inceliyoruz."
date: "2026-10-27"
tags: ["Linux", "Çekirdek", "Sistem Programlama", "eBPF"]
category: "Linux & Çekirdek"
featured: false
published: true
---

Linux sistem yöneticilerinin ve güvenlik mühendislerinin karşılaştığı en tanıdık reflekslerden biri karmaşık bir yetkilendirme hatasıyla karşılaşıldığında SELinux mekanizmasını kapatmaktır (setenforce 0). Yirmi yılı aşkın süredir Linux çekirdeğinin zorunlu erişim denetimi (MAC) omurgasını oluşturan SELinux ve AppArmor gibi sistemler kağıt üzerinde kusursuz bir yalıtım vadeder; ancak pratikte binlerce satırlık anlaşılması güç politika dosyaları, statik etiketleme kuralları ve sistemi esnetemeyen katı hiyerarşileri yüzünden modern bulut altyapılarında hızla tıkanır.

Statik güvenlik modüllerinin en büyük açmazı çalışma zamanı bağlamından (runtime context) habersiz olmalarıdır. Klasik bir SELinux kuralı belirli bir sürecin belirli bir dosyayı okuyup okuyamayacağını etiketlere bakarak kontrol eder. Ancak "Bu süreç dosya açabilir ama belleğinde henüz doğrulanmamış harici bir kütüphane yüklüyse veya son beş saniye içinde şüpheli bir ağ soketine bağlandıysa işlemi durdur" gibi dinamik, durumsal ve mantıksal kararları veremez.

The Linux Security Journey: KRSI aka BPF LSM kılavuzunda açıklandığı üzere, Linux çekirdeğine entegre edilen BPF LSM (Kernel Runtime Security Instrumentation) mimarisi bu kısıtı tamamen ortadan kaldırıyor.

Linux Security Modules (LSM) altyapısı çekirdek içinde yüzlerce kritik karar noktasına (kancaya) sahiptir: Bir dosyanın açılması (file_open), yeni bir sürecin başlatılması (bprm_check_security), soket bağlantısı (socket_connect) veya bellek eşleme (mmap_file).

Geleneksel eBPF izleme araçları (kprobes veya tracepoints) çekirdekte yalnızca pasif birer gözlemcidir; bir saldırı olduğunu görseler dahi işlemi durduramazlar. BPF LSM ise doğrudan çekirdeğin karar verici koltuğuna oturur. Güvenlik mühendisleri C veya Rust ile yazdıkları küçük ve doğrulanmış BPF programlarını bu LSM kancalarına bağlar. Bir ihlal veya şüpheli davranış sezildiğinde BPF programı doğrudan -EPERM (İşleme İzin Verilmedi) hata kodunu fırlatarak saldırıyı henüz çekirdek seviyesindeyken anında bloke eder.

Enforcing Security Policy at the Kernel's Decision Points: eBPF LSM Hooks analizinde vurgulanan en büyük avantaj canlı güncelleme yeteneğidir (hot-reloading). Sistemi yeniden başlatmadan, çekirdek parametrelerini değiştirmeden veya çalışan konteynerleri durdurmadan saniyeler içinde yeni bir güvenlik politikası devreye alınabilir.

Linux Plumbers Conference 2026: Scaling BPF LSM Hooks sunumunda ele alındığı gibi, kritik bir sıfırıncı gün (0-day) çekirdek zafiyeti veya konteyner kaçış açığı duyurulduğunda, tüm filoya dağıtılacak 15 satırlık bir BPF LSM programı zafiyetin kullandığı özel sistem çağrısı kombinasyonunu anında filtreleyerek sistemleri yama çıkana kadar güvenle ayakta tutabiliyor.

Güvenlik politikalarını statik metin dosyalarından çıkarıp doğrudan çekirdek seviyesinde programlanabilir akıllı filtrelere dönüştüren BPF LSM, işletim sistemi güvenliğinde reaktif izlemeden proaktif ve cerrahi savunmaya geçişin en güçlü aracını sunuyor.
