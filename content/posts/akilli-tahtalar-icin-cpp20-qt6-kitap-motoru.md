---
slug: "akilli-tahtalar-icin-cpp20-qt6-kitap-motoru"
title_tr: "Pardus ETAP ve Akıllı Tahtalar İçin C++20 ve Qt 6 ile Yüksek Performanslı Kitap Motoru: EtapKitap"
title_en: "High-Performance Interactive Textbook Engine for Smart Boards: EtapKitap"
excerpt_tr: "Sınıf içi akıllı tahtalarda yaşanan gecikme, hantal Electron uygulamaları ve bellek şişmelerine karşı C++20, Qt 6 ve çoklu iş parçacıklı önbellekleme mimarisiyle geliştirilen EtapKitap'ın teknik anatomisi."
excerpt_en: "Technical anatomy of EtapKitap: Replacing bloated Electron apps on classroom interactive boards with a native C++20 and Qt 6 engine featuring multi-threaded prefetching and zero-latency rendering."
date: "2026-11-02"
tags: ["C++20", "Qt6", "Pardus", "Linux", "Eğitim Teknolojileri"]
category: "Yerel Yazılım & C++"
featured: true
published: true
---

Milli Eğitim Bakanlığı'nın Fatih Projesi kapsamında okullarda kullanılan akıllı tahtalar (Pardus ETAP 19 / 23 yüklü etkileşimli tahtalar), donanım açısından genellikle sınırlı bellek ve giriş seviyesi entegre grafik işlemcilere sahiptir.

Buna rağmen tahtalarda kullanılan çoğu dijital ders kitabı ve z-kitap yazılımı; ya hantal Webview / Electron sarmalayıcılarıyla ya da eski Flash kalıntılarıyla çalışır. Sonuç:
* Sayfa çevirirken saniyeler süren donmalar,
* Dokunmatik kalemle çizim yaparken hissedilen yüksek gecikme (input lag),
* Bellek yetersizliğinden ötürü çöken süreçler.

Bu problemi çözmek için **EtapKitap** projesini C++20 ve Qt 6 ile sıfırdan, donanımın sınırlarına saygı duyan yerel bir sistem mimarisi olarak geliştirdim.

---

## 1. Mimari Kararlar: Neden C++20 ve Qt 6?

Sistem katmanında çalışırken doğrudan donanımla konuşabilmek ve sıfır çöp toplayıcı (zero garbage collector) maliyetiyle ilerlemek şarttı.

* **C++20 Konseptleri ve Bellek Güvenliği:** `std::span`, akıllı işaretçiler (`std::unique_ptr`) ve derleme zamanı kontrolleri ile bellek sızıntıları tamamen engellendi.
* **Qt 6 Graphics View & QPainter:** Donanım ivmeli (hardware accelerated) çizim yüzeyi sayesinde 4K etkileşimli tahta panellerinde 60 FPS pürüzsüz sayfa kaydırma ve kalem tepkisi elde edildi.

```cpp
// EtapKitap Sayfa Önbellekleme Motoru (Worker Thread C++20 Örneği)
#include <QRunnable>
#include <QImage>
#include <memory>
#include <span>

class PageRenderTask : public QRunnable {
public:
    PageRenderTask(int pageIndex, double dpiScale)
        : m_pageIndex(pageIndex), m_dpi(dpiScale) {}

    void run() override {
        // Arka planda PDF/vektör sayfasını çöz ve önbelleğe hazırla
        QImage rendered = renderHighResolutionPage(m_pageIndex, m_dpi);
        emit pageReady(m_pageIndex, std::move(rendered));
    }

private:
    int m_pageIndex;
    double m_dpi;
};
```

---

## 2. Çift Katmanlı Tahminleyici Önbellek (Predictive Prefetching)

Bir öğretmen ders anlatırken tahtada sayfaları hızlıca gezer. Diskten her sayfayı anlık okumak I/O darboğazı yaratır.

EtapKitap'ta uyguladığım algoritma:
1. **Pencereleme (Sliding Window):** Aktif sayfanın 2 sayfa öncesi ve 3 sayfa sonrası arka planda ayrı bir CPU iş parçacığında (thread pool) render edilip RAM'de sıkıştırılmış biçimde tutulur.
2. **LRU Bellek Sınırı:** Tahtanın toplam RAM kapasitesi dinamik olarak sorgulanır (`sysinfo`) ve önbellek boyutu sistem yüküne göre 256 MB ile 512 MB arasında sınırlandırılır.

---

## 3. Dokunmatik Kalem ve Düşük Gecikmeli Çizim

Öğretmenlerin en çok şikayet ettiği konu, kalemin ekrana dokunduğu an ile çizginin belirdiği an arasındaki gecikmedir.

Bu gecikmeyi yok etmek için:
* Çizim hareketleri ana GUI olay döngüsünü (event loop) beklemeden doğrudan Qt'nin `QMouseEvent` / `QTabletEvent` olaylarından `raw coordinates` olarak çekilir.
* Çizgiler Bezier eğrisi yumuşatmasıyla (`QPainterPath`) tek bir çerçevede (frame) ekrana yansıtılır.

---

## 4. Pardus ETAP Entegrasyonu

EtapKitap; Pardus 23 ETAP sürümüne doğrudan `.deb` paketi olarak derlenir. Masaüstü menüsüne, ETAP panel kısayollarına ve akıllı tahta kilit ekranına doğrudan uyum sağlar.

Açık kaynak olarak geliştirdiğim bu proje, eğitim teknolojilerinde gereksiz web sarmalayıcıları yerine amaca yönelik yerel C++ yazılımlarının ne kadar büyük bir fark yarattığının somut bir kanıtıdır.
