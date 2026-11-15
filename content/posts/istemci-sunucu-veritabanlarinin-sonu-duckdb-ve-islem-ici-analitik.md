---
slug: "istemci-sunucu-veritabanlarinin-sonu-duckdb-ve-islem-ici-analitik"
title_tr: "Ağ Soketleri Olmadan Milyonlarca Satırı Sorgulamak: DuckDB ve İşlem İçi Analitik"
title_en: "Ağ Soketleri Olmadan Milyonlarca Satırı Sorgulamak: DuckDB ve İşlem İçi Analitik"
excerpt_tr: "Büyük veri analitiği onlarca yıldır ayrı sunucu süreçleri, ağ protokolleri ve veri serileştirme yükleriyle özdeşleşti. SQLite sadeliğini sütunsal depolama ve vektörize işlemci komutlarıyla birleştiren DuckDB mimarisinin getirdiği sıfır kopyalı analitik devrimini inceliyoruz."
excerpt_en: "Büyük veri analitiği onlarca yıldır ayrı sunucu süreçleri, ağ protokolleri ve veri serileştirme yükleriyle özdeşleşti. SQLite sadeliğini sütunsal depolama ve vektörize işlemci komutlarıyla birleştiren DuckDB mimarisinin getirdiği sıfır kopyalı analitik devrimini inceliyoruz."
date: "2026-10-30"
tags: ["Dosya Sistemleri", "Veri Tabanı", "DuckDB"]
category: "Veri & Dosya Sistemleri"
featured: false
published: true
---

On milyonlarca satırlık bir veri kümesi üzerinde karmaşık bir toplama (aggregation) veya filtreleme sorgusu çalıştırmak istediğinizde sektörün standart refleksi bellidir: Ayrı bir PostgreSQL, ClickHouse veya Snowflake kümesi ayağa kaldırmak, ağ bağlantısı kurmak ve sorguyu TCP/IP soketleri üzerinden fırlatmak.

Veritabanı sunucusu ile uygulamanız aynı fiziksel makinede yan yana dursa bile ağır bir veri aktarım vergisi ödersiniz. Veritabanı motoru diskten veriyi okur, kendi bellek yapısına alır, ağ üzerinden göndermek için serileştirir (serialize), işletim sistemi çekirdeği soket arabelleğine kopyalar ve Python ya da C++ uygulamanız bu veriyi tekrar deserialize edip belleğe yazar. Basit bir analitik hesaplama için gigabaytlarca veri bellekte gereksiz yere defalarca kopyalanır.

DuckDB for Data Engineers: How an In-Process Analytical Database is Reshaping Modern Data analizinde belirtildiği gibi, analitik veritabanlarının SQLite modeli olarak doğan DuckDB bu hantal istemci-sunucu paradigmasını tamamen devreden çıkarıyor.

Sistemin temelinde işlem içi (in-process) çalışma felsefesi yer alır. DuckDB ayrı bir sunucu süreci, arka plan servisi veya ağ soketi değildir. Tıpkı SQLite gibi uygulamanızın içine doğrudan gömülen C++ tabanlı bir kütüphanedir. Ancak SQLite satır tabanlı (OLTP) bir mimariye sahipken, DuckDB tamamen analitik sorgular (OLAP) için sıfırdan tasarlanmış sütunsal bir motordur.

MotherDuck Vectorized Execution Explained teknik kılavuzunda açıklandığı üzere, DuckDB geleneksel veritabanlarının kullandığı satır satır işleme (Volcano iterator) modelini terk eder. Bunun yerine Vektörize Yürütme (Vectorized Execution) tekniğini kullanır. Veriler yaklaşık 2048 satırlık hafif vektör bloklarına bölünür. Bu bloklar doğrudan işlemcinin yüksek hızlı L1 ve L2 önbelleklerine tam sığacak şekilde hizalanır. İşlemci çekirdeği, AVX-512 veya ARM NEON gibi SIMD (Tek Komut, Çoklu Veri) yönergelerini kullanarak tek bir saat çevriminde yüzlerce veriyi aynı anda hesaplar.

Dissecting DuckDB: A Deep Dive into the Internals of an In-Process OLAP Database mimari incelemesinde vurgulanan en çarpıcı kazanım ise sıfır kopyalı (zero-copy) bellek entegrasyonudur.

Apache Arrow standartları sayesinde DuckDB, disk üzerindeki bir Parquet dosyasını ya da bellekteki bir Pandas/Polars veri çerçevesini tek bir bayt dahi kopyalamadan yerinde sorgulayabilir. Sorgu doğrudan mevcut bellek alanında koşar ve sonuç anında uygulamanın kendi nesnesine dönüşür.

DuckDB vs ClickHouse: Which OLAP Engine Wins? karşılaştırmalarında görüldüğü gibi, dağıtık büyük veri kümelerinin karmaşık sunucu altyapıları gerektirdiği ezberi yerini kişisel bilgisayarlarda doğrudan bellek içinde ışık hızında koşan vektörize analitik motorlara bırakıyor. Büyük veriyi yönetmek artık devasa sunucu çiftlikleri kiralamak değil; işlemci önbelleklerini ve bellek yollarını doğrudan kullanan hafif kütüphaneleri iş akışlarına gömmek anlamına geliyor.
