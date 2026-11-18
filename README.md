# Apartmanım – 10 Daire Apartman Yönetim Uygulaması

**Sürüm 1.0 • Çoklu yönetici • GitHub Pages + Supabase • Mobil uyumlu**

Bu sürüm 10 daire ve 500 TL başlangıç aidatıyla kurulur. Daire, dönem aidatı, kısmi tahsilat, geçmiş borç, gelir, gider, virman, kasa/banka, CSV raporu, özel dekont ve 2–3 ayrı yönetici hesabı içerir. Yeni işlem tüm yetkili cihazlarda ortak veritabanına yazılır. GitHub Pages yalnızca site dosyalarını yayınlar; kayıtlar Supabase'dedir. Uygulama açıkken Supabase Realtime değişiklikleri izler; ek olarak yaklaşık 30 saniyede bir ve sekmeye geri dönüldüğünde verileri tazeler.

> **ÖNEMLİ:** Bu ZIP kendi başına canlı bir sunucu kurmaz. Çok cihazda kullanım için **kendi Supabase projenizi** açmanız, SQL'i çalıştırmanız ve **GitHub Pages** ile yayınlamanız gerekir. Bu işlemlere ait hesap şifrelerini buraya veya GitHub'a yazmayın.

## 1) Supabase projesi aç

1. [supabase.com](https://supabase.com) üzerinden hesabınıza girin ve **New project** oluşturun.
2. Proje açılınca **SQL Editor → New query** bölümüne gidin.
3. `sql/kurulum.sql` dosyasının **tümünü** yapıştırıp **Run** seçin. SQL 10 daire, 2 hesap, davetler, güvenlik kuralları, değişiklik günlüğü ve dekont klasörünü oluşturur. **Yeni / boş projede bir kez çalıştırın.**
4. **Project Settings → API** (bazı arayüzlerde **Connect** veya **API Keys**) bölümünden **Project URL** ve **publishable key** / eski projelerde **anon public key** bilgilerini bulun.
5. `config.js` içindeki **iki** `BURAYA_...` değerini bunlarla değiştirin:

```js
window.APARTMAN_CONFIG = {
  supabaseUrl: 'https://PROJEID.supabase.co',
  supabaseAnonKey: 'sb_publishable_....' // veya eski anon JWT
};
```

**Asla** `service_role`, `sb_secret_...`, veritabanı şifresi veya yönetici şifresini bu dosyaya koymayın. `publishable/anon` anahtarı web tarayıcısında kullanılmak üzere tasarlanmıştır; gerçek veri koruması Supabase RLS politikaları ile sağlanır.

## 2) Giriş ve e-posta ayarlarını yap

Supabase panelinde **Authentication → Providers → Email** açık olmalı. **Confirm email** ayarını güvenli kullanım için açık tutun.

- **Authentication → URL Configuration → Site URL**: GitHub Pages adresiniz (`https://KULLANICI.github.io/APARTMAN-REPO/`).
- **Redirect URLs**: Aynı site adresini girin. Bu, üyelik doğrulama ve şifre sıfırlama bağlantıları için gereklidir.

Site URL'yi GitHub Pages sayfasını açtıktan sonra da düzenleyebilirsiniz. Supabase ücretsiz planında e-posta gönderim kotaları olabilir; testte bir onay e-postası gelmezse Supabase Auth günlüklerine ve SMTP ayarlarına bakın.

## 3) GitHub'a yükle

1. GitHub'da yeni bir repo oluşturun (örnek: `apartman-yonetim`).
2. Bu ZIP'i bilgisayarda **çıkarın**. `index.html`, `app.js`, `styles.css`, `config.js`, `manifest.webmanifest`, `sw.js`, `icons/`, `sql/` ve `.nojekyll` dosyalarını repoya yükleyin. `index.html` repo **kök dizininde** olmalı.
3. **Settings → Pages → Build and deployment → Deploy from a branch** seçin. Branch: **main**, klasör: **/(root)**, sonra Save.
4. Site adresiniz: `https://KULLANICI.github.io/REPO-ADI/` (repo adına göre değişir).
5. Bu adresi Supabase **Authentication → URL Configuration** kısmına da ekleyin.

**Not:** SQL dosyaları GitHub'da bulunabilir; SQL şifre veya API gizli anahtarı içermez. İsterseniz SQL klasörünü yalnızca yerel bilgisayarınızda da tutabilirsiniz.

## 4) İlk (ana) yöneticiyi oluştur

İlk yönetici kurulumu **bir kez** yapılır. Bu, tanımadığınız kullanıcıların sistemi ele geçirmesini engeller.

1. Yayınlanan uygulamanızda **Hesap oluştur** seçin. Kendi e-posta adresiniz ve şifrenizle kayıt olun.
2. Supabase doğrulama e-postası geldiyse bağlantıyı açın. Giriş yaptığınızda **Davet / erişim kontrolü** ekranı görülmesi **normaldir**.
3. Supabase **SQL Editor** ekranında `sql/ilk_yonetici_ornek.sql` dosyasını açın. İçindeki `'EMAIL_ADRESINIZ'` metnini kendi e-postanızla değiştirin ve **Run** seçin.
4. Uygulamaya dönüp **Daveti kontrol et** veya çıkış yapıp yeniden giriş yapın. **Genel Bakış** ekranı açılır.

## 5) Diğer 1–2 yöneticiyi ekle

1. Ana yönetici uygulamada sol menüden **Yöneticiler** bölümüne girsin.
2. Diğer yöneticinin e-posta adresini yazıp **Davet Yetkisi Ver** desin.
3. Kişiye GitHub Pages **uygulama adresini siz gönderin** (sistem otomatik davet e-postası göndermez).
4. Davetli, kendi e-posta adresiyle **Hesap oluştur** yapıp e-postasını doğrulasın.
5. Giriş yapıp **Daveti kontrol et** dediğinde aynı apartman hesabına yönetici olarak katılır.

İki yönetici de aidat tahakkuku oluşturabilir, aidat/gelir/gider/virman kaydedebilir, daireleri ve hesapları düzenleyebilir. **Sadece ana yönetici** yeni yönetici davet edebilir veya diğer yöneticinin erişimini kaldırabilir. Her yöneticinin **ayrı hesabı** olmalıdır.

## 6) Kullanım sırası (çok önemli)

1. **Daireler:** 1–10 numaralı dairelere malik adlarını, gerekirse özel aidat ve geçmişten devreden borçları girin.
2. **Kasa & Banka:** Hesapların sistem öncesi başlangıç bakiyesini düzenleyin. Başlangıç bakiyelerini **aynı zamanda gelir hareketi olarak tekrar girmeyin**.
3. **Ayarlar:** Apartman adı ve genel aylık aidatı ayarlayın (ilk kurulum 500 TL).
4. **Aidat Takibi:** Ay seçin ve **Ayın aidatlarını oluştur** deyin. Tekrarlanırsa aynı ay ikinci kez tahakkuk oluşturulmaz.
5. **Yeni Hareket:** Aidat tahsilatı, devreden borç tahsilatı, gider, diğer gelir veya virman girin. Makbuz varsa PDF/JPG/PNG/WEBP yükleyin. Aylık aidatın tutarı yanlış oluşturulduysa **Aidat Takibi → Tahakkuk Düzenle** ile değiştirebilirsiniz.
6. **Raporlar:** Borç listesini ve hareketleri CSV olarak indirin; CSV Excel tarafından açılabilir.

### Hesaplama kuralları

- **Hesap bakiyesi** = açılış bakiyesi + o hesaba giren aidat/devir/gelir + alınan virman − gider − çıkan virman.
- **Daire toplam borcu** = başlangıç/devreden borç + daireye kesilen tüm dönem tahakkukları − aidat tahsilatları − eski borç tahsilatları. Negatif değer alacak demektir.
- **Aylık tahsilat / gider** = işlem tarihine göre ayın toplamı. **Aylık aidat ödemesi** ise seçilen aidat dönemine göre hesaplanır; geçmiş aya ilişkin bugün alınan ödeme, dönem aidatı ekranında geçmiş ayda; nakit akışında bu ayda görünür.
- **Virman** toplam geliri veya toplam parayı değiştirmez.
- Tahakkuk oluşturulduktan sonra genel aidat değişirse **eski tahakkuklar değişmez**. Geçmişteki hatalı bir tahakkuku düzeltmek gerekiyorsa önce ilişkili aidat ödemesini ele alın; SQL bütünlüğü silmede ilişkili ödemeler varsa engeller.

## iPhone ve PC'de uygulama gibi kullanma

- **iPhone:** Safari'de uygulama adresini açın → Paylaş → **Ana Ekrana Ekle**.
- **Windows PC:** Chrome/Edge'de URL'yi açın; tarayıcı menüsündeki **Uygulama olarak yükle** seçeneği varsa kullanın veya yer imi oluşturun.
- **İki telefon + bir PC:** Her biri **kendi hesabıyla** aynı URL'den giriş yapar. İşlemler Supabase'e kaydedilir. İnternet olmadan veri düzenleme desteklenmez.

## Güvenlik ve operasyon notları

- Supabase **Row Level Security (RLS)** aktiftir; yalnızca ilgili apartmana üyeliği olan kullanıcılar apartman verisini okuyup değiştirebilir.
- Davet e-posta eşleşmesine ve Supabase'deki doğrulanmış e-postaya göre kabul edilir.
- Dekontlar **public olmayan** Supabase Storage bucket'ında tutulur; uygulama geçici özel erişim bağlantısı üretir.
- İşlem, daire, hesap, tahakkuk değişiklikleri `audit_logs` tablosunda saklanır. Bu sürümde denetim günlüğü için ayrı bir arayüz yoktur; SQL Editor'den okunabilir.
- Raporları **düzenli CSV dışa aktararak** ve gerektiğinde Supabase veritabanı yedeklerini kullanarak yedekleyin. CSV, Supabase veritabanının tam yedeğinin yerini tutmaz.
- Ücretsiz Supabase projeleri kullanım limitleri, inaktif proje duraklatması ve e-posta kotasına tabidir. Fiyatlar/limitler değişebilir.
- Şifre, banka hesap numarası vb. gizli bilgileri GitHub deposuna koymayın.
- **Önce test ödemeleriyle deneyin;** gerçek apartman işlemlerine geçmeden önce bakiye ve raporları karşılaştırın.

## Bu sürümde olmayanlar

- Eski Excel dosyasından **otomatik içe aktarım** yok (10 daire ve 500 TL başlangıç ayarı hazır, eski hareketleri tek tek girebilirsiniz).
- SMS/e-posta ile otomatik ödeme hatırlatma, gecikme faizi, banka API'si ile otomatik tahsilat ve e-Defter/e-muhasebe entegrasyonu yok.
- İşlemsiz offline veri girişi yok; ağ bağlantısı gerekir.
- Bu sistem resmi muhasebeci veya hukuk danışmanı yerine geçmez.

## Proje dosyaları

| Dosya | İşlev |
|---|---|
| `index.html` | Ana uygulama |
| `app.js` | Tüm ekran ve hesaplama/işlem mantığı |
| `styles.css` | Masaüstü ve telefon görünümü |
| `config.js` | Değiştirilecek Supabase bağlantı bilgileri |
| `sql/kurulum.sql` | Veritabanı, güvenlik, depolama ve ilk kayıtlar |
| `sql/ilk_yonetici_ornek.sql` | İlk yöneticiyi yetkilendirme |
| `manifest.webmanifest`, `sw.js`, `icons/` | Ana ekran simgesi ve PWA |
| `BASLA.txt` | Hızlı kurulum özeti |
| `tests/test-accounting.cjs` | İsteğe bağlı muhasebe regresyon testleri (`node tests/test-accounting.cjs`) |

**Sürüm 1.0 — Kurulum, SQL, kimlik doğrulama ve arayüz dosyaları hazırlanmıştır. Gerçek Supabase projesinde ilk bağlantı ve uçtan uca test, proje bilgileri tanımlandığında yapılmalıdır.**
