---
slug: "bulut-bagimliliginin-sonu-yerel-oncelikli-yazilim-ve-crdt"
title_tr: "Merkezi Veritabanının Sonu: Yerel Öncelikli (Local-First) Mimari ve CRDT"
title_en: "Merkezi Veritabanının Sonu: Yerel Öncelikli (Local-First) Mimari ve CRDT"
excerpt_tr: "Bulut tabanlı yazılımlar kullanıcıları sürekli internet bağlantısına, dönen yükleme simgelerine ve veri mülkiyeti kaybına mahkum etti. Veriyi doğrudan kullanıcının cihazında saklayıp ağ bağlantısı kurulduğunda matematiksel olarak çakışmasız birleştiren CRDT ve yerel öncelikli (local-first) yazılım mimarisini inceliyoruz."
excerpt_en: "Bulut tabanlı yazılımlar kullanıcıları sürekli internet bağlantısına, dönen yükleme simgelerine ve veri mülkiyeti kaybına mahkum etti. Veriyi doğrudan kullanıcının cihazında saklayıp ağ bağlantısı kurulduğunda matematiksel olarak çakışmasız birleştiren CRDT ve yerel öncelikli (local-first) yazılım mimarisini inceliyoruz."
date: "2026-10-21"
tags: ["Dosya Sistemleri", "Veri Tabanı", "CRDT"]
category: "Veri & Dosya Sistemleri"
featured: false
published: true
---

Modern bulut tabanlı yazılımların (SaaS) temel kurgusu son on beş yıldır değişmeyen tek bir kurala dayandı: İstemci cihazı sadece bir görüntüleme katmanıdır; tek ve mutlak gerçeklik merkezi bulut sunucusunun veritabanındadır. Bir form doldurduğunuzda, bir metin yazdığınızda veya bir veriyi sildiğinizde sistem önce sunucuya ağ isteği atar, sunucu onaylar ve ekrandaki yükleme simgesi (spinner) kaybolur. İnternet bağlantısı koptuğu anda ise uygulama tamamen işlevsiz kalır ve kullanıcı kendi ürettiği veriye dahi erişemez.

Smashing Magazine Yerel Öncelikli Web Mimarisi Analizi teknik makalesinde vurgulandığı gibi, bu merkezi bağımlılık yerini hızla yerel öncelikli (local-first) yazılım mimarisine bırakıyor. Bu yaklaşımda veri öncelikle kullanıcının kendi cihazındaki yerel depolama katmanında (SQLite veya IndexedDB) saklanır. Okuma ve yazma işlemleri sıfır gecikmeyle (0 ms latency) gerçekleşir; internet olsun ya da olmasın uygulama eksiksiz çalışır. Bulut sunucuları artık verinin sahibi değil, cihazlar arasında veri taşıyan ikincil bir senkronizasyon köprüsüdür.

Ancak veriyi merkezi bir kilide bağlamadan dağıtık istemcilerde tutmanın zorlu bir matematiksel bedeli vardır: Birden fazla kullanıcı aynı belgeyi çevrimdışı düzenleyip ağa bağlandığında, yapılan değişiklikler birbirini ezmeden nasıl birleşecek? Google Docs gibi geleneksel iş birliği araçlarının kullandığı Operasyonel Dönüşüm (Operational Transformation / OT) yöntemi, merkezi bir sunucunun tüm işlemleri tek bir sıra numarasına dizmesine muhtaçtır; sunucu aradan çıktığında çevrimdışı çakışmaları çözemez.

DevToolLab 2026 CRDT ve Çakışma Çözümü Kılavuzu ve Yerel Öncelikli Uygulamalarda Yjs ve Automerge Karşılaştırması belgelerinde açıklandığı üzere, çözüm matematiksel bir veri yapısı olan Çakışmasız Çoğaltılan Veri Tipleri (CRDT) ile geldi. Yjs ve Automerge gibi modern kütüphaneler metinleri, nesneleri ve listeleri Lamport zaman damgaları ve nedensel grafikler (causal trees) şeklinde modeller.

İki kullanıcı haftalarca çevrimdışı kalsa dahi, cihazları internete bağlandığı anda CRDT veri yapıları merkezi bir sunucu hakemliğine ihtiyaç duymadan matematiksel olarak kesin ve tekil bir nihai duruma (eventual consistency) kendiliğinden yakınsar. Yapılan hiçbir düzenleme kaybolmaz veya üzerine yazılmaz.

Verinin mülkiyetini bulut şirketlerinin sunucularından alıp tekrar kullanıcının yerel diskine teslim eden yerel öncelikli mimari, yazılımları ağ kesintilerine karşı bağışık, ışık hızında çalışan ve kalıcı araçlara dönüştürüyor.
