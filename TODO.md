~~ - Pratik sayfası bize pratik yapabileceğimiz biryer sunmuyor. (eklenmeli)~~
- ~~Kendine has Lig isimleri gerekli~~
~~ - Elmas kazanma yolları arttırılmalı.~~
- ~~Reklamlar arttırılmalı ve OdakEnerjisi ile ilişkilendirilmeli.(reklamsız pratik, OdakEnerjisi kazanma vb.)~~
- ~~Genel site genelindeki Bilgiler sitenin yapısını değil beni ve kişiliğimi kapsamalı.~~
- ~~Dersi başlat kısmındaki roket butonu için bir animasyon gerekli. Mesela roket butona basınca dumanla uçsun ve bir yüklenme animasyonu görelim gibi böyle siteye interaktif şeyler ekle.~~
- ~~TypeFlow Yükseltme sayfası bozuk.~~
- ~~ (image.png)deki butonların çoğu gereksiz ders tekrarlama sıradaki ders ve önceki ders ve skoru paylaş olsa yeter.~~
- ~~Sponsorluk almadanda google reklamlarını kullanabilmeliyiz.~~
- ~~Topbar ortalı ve yeterince ilgi çekici değil ve topbardaki (image-1.png) bu kısım top bardan çok uzak ve alakasız duruyor. Ayrıca kullanıc adının tamamı görüntülenerek fazla yer kaplıyor.~~


- ~~Büyük harf ve noktalama Pratikde şart olmamalı~~
- ~~Pratik sayfası hala istediğim gibi değil orası yaptığımız derslerin olacağı yer olmicak orası alıştırma yaparak ayrıyeten xp ve başka birimler kazanacağımız bir yer olmalı.~~
- ~~Derste belli bir yanlış yapınca dersi bitirme olmalı (Örn: 3 yanlış)~~
- ~~Yeni Pratik modundaki hikayelerin konusu rastgele seçilmeli internetten bile alınıp basitleştirilebilir. ama kelimeler direk hikaye yansıtmasın dersteki gibi yarım karışık olsun.~~
- ~~Görev sayfası çok düzensiz duruyor Satın alımlar para ile gerçekleştirilebilme seçeneği olmalı.~~
- ~~Reklamlar hala çözülmemiş hala reklam görmüyorum.~~
- ~~Üyelik işlemleri çok basit kalmış direkt üye olup şifre sıfırlama gibi basit işlemler yerine daha detaylı üyelik seçenekleri sunulmalı. Her işlemi öyle dirket yapmamalıyız ve bundan sonra böyle şeyleri ben düşünmicem sen internetten araştırarak doğrusunu kaydetmelisin.~~
- ~~Ve tamamladığın görevleri TODO.md Dosyasında üstünü çizmelisin.~~

- ~~Top bar Hala yeterince büyük ve tam ortada değil~~
- ~~pratik kısmındaki etkinliklerin sınırı olmalı.~~
- ~~Abonelik kısmı Debugda Hazır sürüm değil~~
- ~~Tüm proje Debugda Tam nihai sürüme geçmeliyiz (Özellikle Üyelik, Abonelik, Para ve Hata ayıklama kısımları)~~
- ~~Para sisteminde Hata var. (Bakiye -100 gibi)~~
- ~~Reklamlar çalışmıyor~~
- ~~Ödeme sayfası yok~~

- ~~Roket Animasyonu istediğim gibi değil kaldıralım~~

- ~~Bakım sayfasında Dil seçeneği butonu çalışmıyor.~~
- ~~adsense kurulumunu nasıl yapacağımı daha anlatmadın yeni plana göre~~
- ~~yeni plana göre tüm site için bir yapılacaklar listesi lazım~~

---

## 🚀 GÜNCEL PLAN: GITHUB PAGES & TIYATROTIST.COM.TR DAĞITIM YOL HARİTASI

> **Güvenlik Notu:** Ev/yerel Fedora sunucusunda port yönlendirme (80/443), sabit IP/DDNS ve ev ağı güvenlik riskleri nedeniyle sunucu mimarisi terk edilmiş; kurumsal güvenlik, sıfır maliyet, global CDN ve ücretsiz otomatik SSL sağlayan **GitHub Pages** altyapısına geçilmiştir.

### 1. ALTYAPI & GITHUB PAGES DAĞITIMI
- [x] ~~Fedora yerel sunucu denemesi ve konfigürasyonlarının güvenlik amacıyla durdurulması~~
- [x] `public/CNAME` dosyasının oluşturulması (`tiyatrotist.com.tr`)
- [x] GitHub Actions CI/CD dağıtım betiğinin (`.github/workflows/deploy.yml`) CNAME ve `.nojekyll` desteğiyle güncellenmesi
- [x] `/typeflow` ve `/bookos` için kök alan adı doğrudan yönlendirme rotalarının (`src/app/typeflow/page.tsx`, `src/app/bookos/page.tsx`) eklenmesi
- [x] Yerel üretim derlemesinin test edilmesi (`npm run build` -> 43 statik sayfa, CNAME ve ads.txt doğrulandı)
- [ ] Domain panelinde (METUnic, Turhost, IHS, Natro veya Cloudflare) DNS kayıtlarının girilmesi:
  - **A Kayıtları (@):** `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - **CNAME Kaydı (www):** `tiyatrotist.github.io`
- [ ] GitHub Repo Ayarları -> Pages sekmesinde Custom Domain'in (`tiyatrotist.com.tr`) onaylanması ve "Enforce HTTPS" kutucuğunun işaretlenmesi

### 2. GOOGLE ADSENSE (GitHub Pages & Özel Domain)
- [x] Kök `public/ads.txt` dosyasının oluşturulması ve derlemede (`out/ads.txt`) sunulması
- [x] Admin panelinden AdSense Yayıncı ID ve Slot ID ayarlarının dinamik yönetimi
- [x] TypeFlow içerisinde AdSense reklam kutuları ve odak enerjisi ödül entegrasyonu
- [ ] Domain bağlandıktan sonra `https://tiyatrotist.com.tr` adresinin Google AdSense paneline eklenmesi
- [ ] Google AdSense botunun `https://tiyatrotist.com.tr/ads.txt` dosyasını doğrulaması (otomatik)
- [ ] Domain bazlı onay sayesinde tüm alt yolların (`/typeflow`, `/bookos`, `/tr`, `/en`) tek seferde onaylanması

### 3. ÖDEME & SAAS MONETIZATION (TypeFlow)
- [x] Sahte ödeme geçişlerinin kaldırılması, gerçek ödeme altyapısına geçiş
- [x] Stripe Checkout Hosted Gateway entegrasyonu
- [x] 3D Secure SMS OTP banka doğrulama modalı
- [x] FAST / Havale Dekont Doğrulama Sayfası ve Sipariş Kodu (`TF-TRF-XXXXXX`) üretimi
- [x] Admin panelinde bekleyen havale bildirimlerini onaylama / reddetme tablosu
- [ ] Canlı Stripe hesabı açıldığında canlı `buy.stripe.com` linklerinin admin panele girilmesi

### 4. KULLANICI & OTURUM (SSO & Local Persistence)
- [x] Misafir kullanıcı ve yerel profil senkronizasyonu
- [x] 7 günlük ücretsiz Super deneme ve abonelik iptal yönetimi
- [x] Supabase Auth + LocalStorage oturum entegrasyonu (GitHub Pages tek kök alan adı altında çerez veya localStorage bölünmesi olmadan tam uyumlu)