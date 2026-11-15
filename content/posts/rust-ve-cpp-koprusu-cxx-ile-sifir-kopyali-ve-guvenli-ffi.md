---
slug: "rust-ve-cpp-koprusu-cxx-ile-sifir-kopyali-ve-guvenli-ffi"
title_tr: "C++ Kodunu Çöpe Atmadan Rust Yazmak: CXX ile Sıfır Maliyetli Köprü"
title_en: "C++ Kodunu Çöpe Atmadan Rust Yazmak: CXX ile Sıfır Maliyetli Köprü"
excerpt_tr: "Milyonlarca satırlık C++ projelerini baştan Rust ile yazmak gerçekçi bir mühendislik tercihi değildir; ancak geleneksel C FFI katmanları da bellek güvenliğini sıfırlar. C++ ve Rust tür sistemlerini derleme anında eşleştirerek sıfır kopyalı ve güvenli çalışan CXX köprüsünü inceliyoruz."
excerpt_en: "Milyonlarca satırlık C++ projelerini baştan Rust ile yazmak gerçekçi bir mühendislik tercihi değildir; ancak geleneksel C FFI katmanları da bellek güvenliğini sıfırlar. C++ ve Rust tür sistemlerini derleme anında eşleştirerek sıfır kopyalı ve güvenli çalışan CXX köprüsünü inceliyoruz."
date: "2026-11-07"
tags: ["Diller", "Sistem Programlama", "Rust", "C++26"]
category: "Diller & Çalışma Zamanları"
featured: false
published: true
---

Yazılım dünyasında popülerleşen "her şeyi sıfırdan Rust ile yazın" söylemi kağıt üzerinde çekici görünse de; oyun motorları, web tarayıcıları ve işletim sistemi bileşenleri gibi milyonlarca satırlık devasa C++ kod tabanları için bu yaklaşım pratik bir çözüm sunmaz. Mevcut çalışan altyapıyı korurken yeni özellikleri bellek güvenli bir dille geliştirmek isteyen mühendisler ise uzun süre C arayüzünün (C ABI) ilkel sınırlarına mahkum kaldı.

İki gelişmiş dili geleneksel extern "C" üzerinden konuşturmaya kalktığınızda her iki dilin de tip güvenliği buharlaşır. C++ tarafındaki akıllı işaretçiler (std::unique_ptr), dinamik diziler (std::vector) veya nesne yaşam döngüleri (RAII) C sınırını geçemez. İki taraf da veriyi ham işaretçilere (void*) dönüştürmek zorunda kalır. Rust tarafında yazılan unsafe blokları en ufak bir bellek hizalama (alignment) veya yapı boyutu farkında çalışma zamanında çöker. Rust'ın vadettiği derleme zamanı güvenliği daha sınır kapısında yok olur.

Safe Interoperability between Rust and C++ with CXX - InfoQ ve CXX Documentation and Bazel Central Registry belgelerinde açıklandığı üzere, CXX kütüphanesi iki dili en alt ortak payda olan C'ye düşürmek yerine, her iki dilin tür sistemleri arasında doğrudan bir köprü kurar. Sistem tek bir #[cxx::bridge] modülü üzerinden iki tarafın fonksiyon imzalarını ve paylaşılan türlerini denetler.

CXX çift yönlü bir kod üreteci çalıştırarak C++ ve Rust derleyicilerini senkronize eder. Veri aktarımı için hiçbir serileştirme (serialization), bellek kopyalama (memcpy) veya ek tahsisat yapılmaz:

Rust tarafındaki Box<T>, C++ tarafında doğrudan std::unique_ptr<T> olarak anlaşılır.

Rust String, C++ std::string ile sıfır kopyayla veri paylaşır.

Paylaşılan veri yapılarının bellek yerleşimleri derleme anında static_assert komutlarıyla doğrulanır; tek bir baytlık kayma dahi derleyicide yakalanır.

Rust for C++ Developers: Migration Guide 2026 - Rustify ve Android Rust Migration Case Study (2026) raporlarında ortaya konduğu gibi, CXX köprüsünün en büyük başarısı Rust tarafında tek bir unsafe bloğu bırakmamasıdır. Derleyici her iki tarafın sınırlarını aynı anda gördüğü için C++ nesnelerinin taşınma (move) ve silinme kurallarını Rust'ın sahiplik (ownership) modeline otomatik olarak uydurur. Android ve Chromium gibi devasa platformların eski C++ tabanını bozmadan yüz binlerce satır yeni Rust kodunu sisteme ekleyebilmesinin arkasında bu mimari yatar.

C++ ile Rust arasındaki ilişkiyi bir dilden diğerine toptan geçiş olarak görmek yerine, iki dilin güçlü yönlerini derleme zamanında tip güvenliğiyle birbirine bağlayan CXX gibi araçlar modern sistem programlamasının en gerçekçi yol haritasını sunuyor.
