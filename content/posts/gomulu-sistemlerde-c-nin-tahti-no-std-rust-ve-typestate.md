---
slug: "gomulu-sistemlerde-c-nin-tahti-no-std-rust-ve-typestate"
title_tr: "Donanım Hatalarını Derleme Anında Yakalamak: no_std Rust ve Typestate Deseni"
title_en: "Donanım Hatalarını Derleme Anında Yakalamak: no_std Rust ve Typestate Deseni"
excerpt_tr: "Mikrodenetleyicilerde C ile doğrudan donanıma kod yazarken giriş olarak ayarlanmış bir pine voltaj vermek veya kesme (interrupt) çakışmaları yaşamak donanımı bozabiliyor. Rust dilinin no_std altyapısı ve Typestate deseniyle donanım durumlarını derleyici tip sistemine bağlayan mimariyi inceliyoruz."
excerpt_en: "Mikrodenetleyicilerde C ile doğrudan donanıma kod yazarken giriş olarak ayarlanmış bir pine voltaj vermek veya kesme (interrupt) çakışmaları yaşamak donanımı bozabiliyor. Rust dilinin no_std altyapısı ve Typestate deseniyle donanım durumlarını derleyici tip sistemine bağlayan mimariyi inceliyoruz."
date: "2026-11-03"
tags: ["Diller", "Sistem Programlama", "Rust"]
category: "Diller & Çalışma Zamanları"
featured: false
published: true
---

Bir mikrodenetleyici için C diliyle doğrudan donanıma (bare-metal) kod yazarken en riskli senaryolar çalışma zamanında ortaya çıkar: Geliştirici yüzlerce satırlık kodun bir yerinde giriş (input) olarak tanımladığı bir GPIO pinine yanlışlıkla çıkış gibi voltaj basabilir ya da donanımsal bir kesme (interrupt) anında paylaşılan bir çevresel birime kilit almadan erişebilir. C derleyicisi bu tür mantıksal ve elektriksel durumları denetlemez; kod sorunsuz derlenir ve hata ancak çip sahada aşırı ısınıp bozulduğunda anlaşılır.

Mikrodenetleyiciler İçin no_std Donanım Yazılımı Mimarisi (2026) kılavuzunda açıklandığı üzere, gömülü sistemlerde Rust kullanımının temeli #![no_std] bildirimine dayanır. Bu bildirim işletim sistemine ait dinamik bellek yöneticisini (heap allocator), dosya sistemini ve standart kütüphane bağımlılıklarını tamamen devreden çıkarır. Kod doğrudan çıplak silikon üzerinde, tek bir kilobaytlık RAM israfı olmadan koşar.

Gömülü Rust Başlangıç Kılavuzu ve no_std Mimarisi analizinde incelenen asıl mimari kazanım Typestate desenidir. C dilinde bir pinin durumu genellikle bir veri yapısı içindeki tam sayı bayraklarla tutulur ve bu bayraklar çalışma zamanında kontrol edilir. Rust'ta ise donanımın fiziksel durumu doğrudan derleme zamanındaki veri tiplerine (Pin<Input> veya Pin<Output>) dönüştürülür.

Bir pini girişten çıkışa geçirmek istediğinizde eski yapıyı tüketen ve yeni bir tipe dönüştüren .into_output() fonksiyonu çağrılır. Giriş modundaki bir pinde voltaj yükseltme fonksiyonu (set_high()) çağırmaya kalkarsanız, kod derlenmeyi reddeder; çünkü o fonksiyon Pin<Input> tipi üzerinde matematiksel olarak tanımlı değildir. Hatalar henüz mikrodenetleyiciye tek bir bayt yüklenmeden derleyicinin katı tip denetiminde elenir.

embedded-hal Resmi Donanım Soyutlama Katmanı - GitHub kütüphanesinin standartlaştırdığı bu yapı, çip üzerinde sıfır ek maliyetle (zero-cost abstraction) çalışır. Typestate yapıları sıfır boyutlu tipler (Zero-Sized Types) olduğundan derleme aşamasında tamamen buharlaşır ve makine kodunda C kadar doğrudan yazmaç (register) atamalarına dönüşür. Üstelik SPI, I2C veya UART protokolleri ortak arayüzler üzerinden tanımlandığı için yazılan bir sensör sürücüsü STM32, ESP32 veya RP2040 arasında tek bir satır değiştirilmeden taşınabilir.

Gömülü dünyada onlarca yıldır süregelen insan dikkatinin yerini alan matematiksel tip garantileri, donanım sürücüsü geliştirmeyi donanım yakma riskinden arındırıp güvenilir bir mühendislik standardına taşıyor.
