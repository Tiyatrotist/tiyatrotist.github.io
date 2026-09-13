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

## 🚀 YENİ PLAN: FEDORA SUNUCU & ALT ALAN ADI (SUBDOMAIN) YOL HARİTASI

### 1. ALTYAPI & SUNUCU (Fedora Linux & Nginx)
- [x] Fedora sunucuya SSH ile bağlanılması (192.168.1.104)
- [x] Nginx v1.30, Certbot v5.7, Node.js ve bağımlılıkların kurulumu
- [x] Fedora SELinux (`httpd_can_network_connect 1`, `httpd_sys_content_t`) ve Firewalld (HTTP 80, HTTPS 443) izinleri
- [x] Nginx sanal sunucularının yapılandırılması:
  - `tiyatrotist.com.tr` (Ana Portföy & Blog)
  - `typeflow.tiyatrotist.com.tr` (TypeFlow SaaS)
  - `bookos.tiyatrotist.com.tr` (BookOS İndirme & Tanıtım)
- [x] Fedora üzerinde üretim derlemesi (`npm run build` -> `/var/www/tiyatrotist/out`)
- [ ] Domain (tiyatrotist.com.tr) DNS A kayıtlarının sunucu IP'sine yönlendirilmesi
- [ ] Tek komutla Let's Encrypt SSL (HTTPS) kurulumu (`certbot --nginx -d ...`)
- [ ] Tek komutluk güncelleme betiği (`deploy.sh`: git pull + build + nginx reload)

### 2. GOOGLE ADSENSE (Yeni Plana Göre)
- [x] Kök `public/ads.txt` dosyasının Nginx üzerinden servis edilmesi (`/ads.txt`)
- [x] Admin panelinden AdSense Yayıncı ID ve Slot ID yönetimi
- [x] TypeFlow arayüzünde Google AdSense reklam kutuları ve odak enerjisi ödül entegrasyonu
- [ ] AdSense paneline ana domainin (`tiyatrotist.com.tr`) eklenmesi ve incelemeye gönderilmesi
- [ ] Ana domain onaylandıktan sonra `typeflow.tiyatrotist.com.tr` alt alan adının AdSense'e eklenmesi (Tekrar inceleme beklemeden anında reklam yayınlama)

### 3. ÖDEME & SAAS MONETIZATION
- [x] Sahte ödeme geçişlerinin kaldırılması, gerçek ödeme altyapısına geçiş
- [x] Stripe Checkout Hosted Gateway entegrasyonu
- [x] 3D Secure SMS OTP banka doğrulama modalı
- [x] FAST / Havale Dekont Doğrulama Sayfası ve Sipariş Kodu üretimi
- [x] Admin panelinde bekleyen havale bildirimlerini onaylama tablosu
- [ ] Canlı Stripe hesabı açıldığında canlı `buy.stripe.com` linklerinin admin panele girilmesi

### 4. KULLANICI & OTURUM (SSO - Single Sign-On)
- [x] Misafir kullanıcı ve yerel profil senkronizasyonu
- [x] 7 günlük ücretsiz Super deneme ve abonelik iptal yönetimi
- [ ] Alt alan adları arasında ortak oturum çerezi (`domain: '.tiyatrotist.com.tr'`) ayarı