---
slug: "yirmi-yillik-bekleyis-bitti-preempt-rt-ve-linuxun-gercek-zamanli-donusumu"
title_tr: "Yirmi Yıllık Bekleyiş Bitti: PREEMPT_RT ve Linux'un Gerçek Zamanlı Dönüşümü"
title_en: "Yirmi Yıllık Bekleyiş Bitti: PREEMPT_RT ve Linux'un Gerçek Zamanlı Dönüşümü"
excerpt_tr: "Hassas robotik kollarda, endüstriyel otomasyonda ve uçuş kontrolcülerinde Linux kullanmak çekirdeğin öngörülemez gecikmeleri yüzünden yıllarca riskli görüldü. Yirmi yıllık çabanın ardından ana Linux çekirdeğine resmi olarak dahil edilen PREEMPT_RT mimarisini ve deterministik çekirdek dönüşümünü inceliyoruz."
excerpt_en: "Hassas robotik kollarda, endüstriyel otomasyonda ve uçuş kontrolcülerinde Linux kullanmak çekirdeğin öngörülemez gecikmeleri yüzünden yıllarca riskli görüldü. Yirmi yıllık çabanın ardından ana Linux çekirdeğine resmi olarak dahil edilen PREEMPT_RT mimarisini ve deterministik çekirdek dönüşümünü inceliyoruz."
date: "2026-10-11"
tags: ["Linux", "Çekirdek", "Sistem Programlama", "Zamanlayıcı"]
category: "Linux & Çekirdek"
featured: false
published: true
---

Bir fabrikanın CNC tezgahını, yüksek hızlı bir robot kolunu veya bir hava aracının uçuş dengeleyicisini kontrol ediyorsanız işlemcinin ne kadar hızlı olduğu değil, ne kadar öngörülebilir olduğu belirleyicidir. Bir motor kontrol döngüsünün ortalama 1 milisaniyede tamamlanması tek başına bir anlam ifade etmez; kritik olan, en kötü senaryoda dahi (worst-case latency) 2 milisaniyeyi asla aşmayacağının matematiksel güvencesidir.

Standart Linux çekirdeği yüksek işlem verimi (throughput) için tasarlanmıştır, kesin zamanlama (determinism) için değil. Çekirdek içerisindeki kritik kod blokları spinlock adı verilen kilitlerle korunur ve donanım kesmeleri (hardware interrupts / IRQ) doğrudan işlemciyi meşgul eder. Çekirdek diske bir tampon yazarken veya bellek sayfalarını temizlerken araya girdiğinde, en yüksek öncelikli kullanıcı süreci bile mikrosaniyelerce, bazen onlarca milisaniye boyunca bekletilebilir. Bir robotik ekleminde 10 milisaniyelik bir gecikme motorun mekanik sınırları aşarak parçalanması anlamına gelir. Bu yüzden mühendisler uzun yıllar FreeRTOS, Zephyr veya QNX gibi kısıtlı mikro çekirdeklere sığınmak zorunda kaldı.

2000'li yılların başından bu yana geliştiriciler, çekirdeğin her an kesilebilir (preemptible) olmasını sağlayan PREEMPT_RT yama setini harici olarak sürdürdü. Ancak her yeni Linux çekirdek sürümünde binlerce satırlık yamayı yeniden derlemek ve taşımak yıpratıcı bir bakım yükü oluşturuyordu. Mainline Linux Çekirdeğinde Gerçek Zamanlı Özellikler Araştırması zaman çizelgesinde görüldüğü gibi, onlarca yıllık sabırlı mimari dönüşümün ardından bu yama seti nihayet resmi ana çekirdeğe (mainline) kabul edildi.

Embedded Linux Topluluğu PREEMPT_RT İncelemesi tartışmalarında öne çıktığı üzere, bu entegrasyon iki temel yapısal değişiklikle mümkün oldu:

Klasik spinlock mekanizmalarının neredeyse tamamı uyuyabilen rt_mutex kilitlerine dönüştürüldü ve düşük öncelikli bir sürecin yüksek öncelikli bir süreci kilit arkasında rehin tutmasını engelleyen Öncelik Devralma (Priority Inheritance) protokolü işletim sisteminin kalbine yerleştirildi.

Donanım kesmeleri iş parçacıklarına (threaded IRQs) dönüştürüldü; böylece gerçek zamanlı çalışan kullanıcı süreçlerinin donanım kesmelerini dahi yarıda kesip işlemciyi devralabilmesinin önü açıldı.

Artık gömülü sistem geliştiricileri aynı Linux çekirdeği üzerinde bir yandan zengin ağ servisleri, grafik arayüzler ve yapay zekâ modelleri çalıştırırken; diğer yandan mikrosaniye düzeyinde deterministik çalışan motor kontrol döngülerini hiçbir ek yamaya ihtiyaç duymadan güvenle koşturabiliyor.
