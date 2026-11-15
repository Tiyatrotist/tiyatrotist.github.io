---
slug: "nodejs-parcalanmasinin-sonu-wintertc-ve-ecma-429"
title_tr: "Node.js Parçalanmasının Sonu: WinterTC ve ECMA-429 ile Evrensel JavaScript"
title_en: "Node.js Parçalanmasının Sonu: WinterTC ve ECMA-429 ile Evrensel JavaScript"
excerpt_tr: "JavaScript on beş yılı aşkın süredir tarayıcı standartları ile Node.js yerel modülleri arasında ikiye bölünmüş bir dünyada yaşadı. Ecma TC55 komitesinin onayladığı ECMA-429 standardıyla sunucu ve uç çalışma zamanlarının evrensel Web API'lerine nasıl kavuştuğunu inceliyoruz."
excerpt_en: "JavaScript on beş yılı aşkın süredir tarayıcı standartları ile Node.js yerel modülleri arasında ikiye bölünmüş bir dünyada yaşadı. Ecma TC55 komitesinin onayladığı ECMA-429 standardıyla sunucu ve uç çalışma zamanlarının evrensel Web API'lerine nasıl kavuştuğunu inceliyoruz."
date: "2026-10-28"
tags: ["Diller", "Sistem Programlama"]
category: "Diller & Çalışma Zamanları"
featured: false
published: true
---

2009 yılında Node.js ilk çıktığında web tarayıcılarında asenkron ağ ve dosya yönetimi için standart bir zemin yoktu. Bu boşluğu doldurmak isteyen Ryan Dahl, Node.js için tarayıcıdan tamamen kopuk özel bir ekosistem inşa etti: require modül yükleyicisi, Buffer ikili veri yapısı, http ve fs kütüphaneleri. Bu tasarım JavaScript'i sunucu dünyasının en popüler dillerinden biri yaptı; ancak aynı zamanda dili ikiye böldü: Tarayıcıda koşan standart web platformu ve yalnızca Node.js üzerinde koşan tescilli yapılar.

On beş yıl boyunca yazılım geliştiriciler bu bölünmenin bedelini ağır paketleme (bundler) araçlarıyla ödedi. Bir kütüphane yazarı aynı kodun hem sunucuda hem istemcide çalışabilmesi için polifill paketlerine sığınmak, package.json içine karmaşık koşullu dışa aktarma (conditional exports) kuralları yazmak ve Webpack ile Node modüllerini taklit etmek zorunda kaldı.

Deno, Bun, Cloudflare Workers ve Fastly gibi yeni nesil çalışma zamanlarının sahneye çıkmasıyla karmaşa daha da büyüdü. Her platform fetch veya Web Streams desteğini biraz farklı yorumladı, bazıları node:* modüllerini yarım yamalak taklit etti, bazıları ise platforma özel API'ler dayatarak geliştiricileri yeni bir üretici bağımlılığına sürükledi.

WinterTC: Write Once, Run Anywhere (For Real This Time) - InfoWorld raporunda ve 2026 ve Sonrasında JavaScript Eğilimleri: Tarayıcı Dışında JavaScript - Naver D2 analizinde detaylandırıldığı gibi, W3C bünyesinde başlayan WinterCG girişimi Ecma International çatısı altında resmi bir teknik komiteye (TC55 / WinterTC) dönüştü. Komitenin yayımladığı ECMA-429 standardı, tarayıcı dışındaki tüm sunucu ve uç çalışma zamanlarının sağlamak zorunda olduğu asgari web platformu API'lerini resmiyete kavuşturdu.

ECMA-429 Minimum Common Web API - WinterTC Resmi Taslağı belgesinde listelenen çekirdek sözleşme; fetch, Request, Response, Headers, URL, URLPattern, ReadableStream, CompressionStream, crypto.subtle ve structuredClone gibi temel Web API'lerinin her uyumlu çalışma zamanında birebir aynı sözdizimi ve davranışla bulunmasını şart koşuyor.

Artık bir kütüphane belirli bir platforma özel yazılmıyor; doğrudan standart web standartlarıyla inşa ediliyor. Tek bir TypeScript dosyası hiçbir polifill ya da derleme katmanına ihtiyaç duymadan yerel makinede Bun ile çalıştırılıp, üretimde bir Linux sunucusundaki Node.js üzerinde koşturulabiliyor veya tek tıkla bir Wasm mikro çalışma zamanına ya da uç sunucuya dağıtılabiliyor. JavaScript, yirmi yıl sonra ilk kez platform bağımsız "bir kez yaz, her yerde çalıştır" vaadini gerçek anlamda yerine getiriyor.
