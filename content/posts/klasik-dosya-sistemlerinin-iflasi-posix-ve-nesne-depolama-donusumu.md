---
slug: "klasik-dosya-sistemlerinin-iflasi-posix-ve-nesne-depolama-donusumu"
title_tr: "Klasik Klasörlerin Sonu: POSIX Dosya Sistemlerinden Nesne Depolamaya (S3)"
title_en: "Klasik Klasörlerin Sonu: POSIX Dosya Sistemlerinden Nesne Depolamaya (S3)"
excerpt_tr: "Yarım asırdır işletim sistemlerinin temeli olan POSIX dosya kuralları, büyük ölçekli veri analitiğinde ve yapay zekâ boru hatlarında ciddi bir tıkanıklığa yol açıyor. Apache Iceberg, Parquet ve doğrudan S3 nesne API'si üzerinden çalışan yeni depolama mimarisini inceliyoruz."
excerpt_en: "Yarım asırdır işletim sistemlerinin temeli olan POSIX dosya kuralları, büyük ölçekli veri analitiğinde ve yapay zekâ boru hatlarında ciddi bir tıkanıklığa yol açıyor. Apache Iceberg, Parquet ve doğrudan S3 nesne API'si üzerinden çalışan yeni depolama mimarisini inceliyoruz."
date: "2026-10-23"
tags: ["Linux", "Çekirdek", "Sistem Programlama"]
category: "Linux & Çekirdek"
featured: false
published: true
---

Bilgisayar kullanmaya başladığımız ilk günden bu yana zihnimize kazınan dosya modeli değişmez bir hiyerarşiye dayanır: Bir disk takılır, klasörler açılır, dosyalar oluşturulur, seek() komutuyla dosyanın ortasındaki bir bayt değiştirilir ve chmod ile izinler belirlenir. 1970'lerden bu yana Unix ve Linux işletim sistemlerinin temelini oluşturan POSIX dosya standardı tek bir yerel makinede kusursuz çalışır; ancak konu petabaytlarca yapay zekâ verisini veya dağıtık veri göllerini işlemeye geldiğinde bu eski kurallar sistemi tamamen çöker.

Blok, Dosya ve Nesne Depolama Analizi (EBS, EFS, S3, Parquet, Iceberg) - Roundz raporunda belirtildiği gibi, POSIX mimarisinin dağıtık dünyadaki en büyük açmazı dosya kilitleri ve dizin hiyerarşisidir. Milyonlarca dosyanın bulunduğu bir ağ dizinini listelemek (örneğin basit bir ls komutu çalıştırmak), dağıtık metaveri sunucularını kilitleyerek ağda devasa bir gecikme dalgası yaratır. Daha da kötüsü, bir dosyanın ortasını yerinde değiştirebilme yeteneği (mutable in-place writes), yüzlerce sunucunun aynı dosyayı okuduğu bir ortamda karmaşık dağıtık kilit yöneticilerine (DLM) ihtiyaç duyar; bu da sistemin ölçeklenmesini imkansız kılar.

Yazılım dünyası uzun süre bu kısıtı aşmak için S3 nesne depolama alanlarını FUSE sürücüleriyle yerel bir POSIX diski gibi sisteme bağlamaya (mount) çalıştı. Ancak The POSIX Gap is Closing: S3 Dosya Sistemi Haline Geldiğinde - LLMS3 analizinde vurgulandığı üzere, nesne tabanlı bir sistemi zorla POSIX kalıbına sokmaya çalışmak ağır bir başarım cezası ödetir.

Modern veri mühendisliği bu ara taklit katmanlarını tamamen bir kenara bırakıp doğrudan nesne-yerel (object-native) bir mimariye geçti. Bu yeni mimari dört temel sütun üzerine oturur:

Düz İsim Alanı (Flat Namespace): Nesne depolamada gerçekte bir "klasör" yoktur. URL içindeki taksim işaretleri (/) hiyerarşik bir ağacı değil, düz bir anahtar-değer tablosundaki metin etiketlerini temsil eder. Bu sayede milyarlarca nesne tek bir milisaniyede adreslenebilir.

Değişmez Veri Blokları (Immutable Parquet): Veriler asla yerinde güncellenmez. Veri yalnızca bir kez sütunsal (columnar) Parquet blokları halinde yazılır. Bir kayıt güncellendiğinde eski dosya ellenmez; yeni bir dosya yazılır.

Metaveri Ayrımı (Apache Iceberg): Hangi dosyanın geçerli olduğu bilgisi işletim sisteminin dosya tablosuna değil, Apache Iceberg veya Delta Lake gibi yazılımsal bildirim listelerine (manifest files) emanet edilir. Bir işlem yapıldığında tek bir metaveri göstericisi atomik olarak güncellenir.

Doğrudan Aralık İstekleri (HTTP Range Requests): DuckDB veya modern analitik motorlar tüm dosyayı indirmek yerine HTTP Range: bytes=100-500 başlıklarıyla doğrudan dosyanın alt bilgisindeki metaveriyi okur ve yalnızca sorgulanan sütunu bellekten çeker.

Açık Kaynak S3 Uyumlu Depolama Karşılaştırması - IOMETE altyapılarında da görüldüğü üzere, POSIX dosya sistemlerinin yarım asırlık mirası yerini veriyi değiştirmek yerine yeni bloklar ekleyen ve klasör yanılsamasını kaldıran nesne depolama standartlarına bırakıyor. Modern bulut mimarilerinde artık diskler değil, doğrudan nesne API'leri konuşuyor.
