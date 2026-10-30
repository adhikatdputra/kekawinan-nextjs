# Kekawinan.com — Product Feature Overview & Roadmap

> Dokumen ini merangkum fitur yang sudah berjalan, area yang perlu improvement, fitur baru yang disarankan, serta rencana pengembangan ke depan.

---

## 1. Fitur yang Sudah Ada

### 1.1 Tamu Undangan
Pengelola undangan dapat membuat daftar tamu dengan data nama, nomor WhatsApp, dan jumlah orang yang diundang. Setiap tamu memiliki ID unik sehingga URL undangan bersifat personal, contoh: `https://www.kekawinan.com/slug-mempelai/id_tamu`. Dengan URL ini, halaman RSVP dan form ucapan doa sudah ter-prefill sesuai data tamu masing-masing.

### 1.2 Dashboard Undangan
Dashboard menampilkan rekap data tamu secara real-time: total tamu, jumlah yang akan hadir, tidak hadir, dan yang belum konfirmasi. Pengantin juga bisa menetapkan batas maksimal tamu yang bisa hadir, sehingga ketika ada yang konfirmasi tidak hadir, mereka langsung bisa mencari pengganti. Data ucapan & doa dari tamu juga tampil di sini beserta status kehadiran masing-masing.

### 1.3 RSVP Interaktif
Sistem RSVP sudah sangat lengkap. Tamu dapat mengkonfirmasi kehadiran, dan data langsung masuk ke dashboard pengantin secara real-time.

### 1.4 Ucapan & Doa
Tamu dapat mengirimkan ucapan dan doa melalui halaman undangan. Semua ucapan tampil di dashboard dan bisa dicari menggunakan fitur pencarian.

### 1.5 Amplop Digital
Pengantin dapat menambahkan informasi rekening bank atau e-wallet untuk memudahkan tamu memberikan hadiah uang secara digital. Tersedia juga data alamat pengiriman kado fisik.

### 1.6 Kado Pernikahan (Gift Registry)
Pengantin dapat membuat daftar kado yang diinginkan beserta link pembeliannya. Tamu yang ingin memberi kado bisa mengkonfirmasi bahwa mereka sudah membelinya, sehingga tidak ada duplikasi kado yang diterima. Tidak ada transaksi di fitur ini — murni sebagai penanda status kado.

### 1.7 Live Streaming
Tersedia section Live Streaming di halaman undangan, saat ini berupa tombol/link yang diarahkan ke platform streaming pilihan pengantin (YouTube, Zoom, dll).

### 1.8 Maps & Lokasi
Tersedia section informasi lokasi acara, saat ini belum menggunakan embed interaktif Google Maps.

---

## 2. Fitur yang Perlu Improvement

### 2.1 Amplop Digital — Multiple Rekening & UX

**Kondisi saat ini:** Hanya bisa satu nomor rekening / e-wallet. Tampilan masih standar.

**Yang perlu diperbaiki:**
- Tambah dukungan **multiple rekening** (minimal 3–5 akun). Pasangan biasanya punya rekening terpisah masing-masing, ditambah beberapa e-wallet seperti GoPay, OVO, DANA.
- Setiap kartu rekening dilengkapi tombol **salin nomor** sekali klik agar tamu tidak perlu input manual.
- Tambah dukungan **QRIS** — pengantin cukup upload gambar QR, tamu langsung scan.
- Tambah fitur **konfirmasi transfer opsional** dari tamu: setelah transfer, tamu bisa input nama dan nominal, dan data ini masuk sebagai log di dashboard pengantin. Tidak perlu verifikasi otomatis, cukup sebagai pencatatan.
- Urutan kartu rekening bisa diatur ulang (drag to reorder) agar yang paling sering dipakai tampil lebih awal.

---

### 2.2 Live Streaming — Lebih dari Sekadar Tombol

**Kondisi saat ini:** Hanya berupa tombol link ke platform eksternal.

**Yang perlu diperbaiki:**
- Tampilkan **embed preview** platform yang dipilih (YouTube thumbnail, atau iframe langsung jika link-nya live).
- Tambah informasi pendukung: waktu mulai streaming, catatan untuk tamu remote (misal dress code online, cara bergabung).
- Tambah opsi **countdown** khusus untuk waktu mulai streaming.
- Dukung beberapa platform: YouTube, Instagram Live, Zoom — dengan ikon masing-masing.

---

### 2.3 Maps & Lokasi — Embed Interaktif

**Kondisi saat ini:** Hanya teks informasi lokasi, belum ada peta interaktif.

**Yang perlu diperbaiki:**
- Embed **Google Maps interaktif** langsung di halaman undangan menggunakan Google Maps Embed API.
- Tambah tombol **"Buka di Google Maps"** dan **"Buka di Waze"** untuk navigasi langsung dari HP.
- Jika ada dua lokasi (akad + resepsi), keduanya bisa tampil sekaligus dengan tab atau dua peta terpisah.
- Tambah informasi pendukung: catatan parkir, patokan lokasi, dress code.

---

## 3. Fitur Baru yang Disarankan

### 3.1 Love Story / Our Journey

Sebuah section timeline visual yang menceritakan perjalanan pasangan, dari pertama bertemu hingga lamaran. Ini adalah salah satu section yang paling banyak dibaca tamu karena bersifat personal dan emosional.

**Detail fitur:**
- Timeline vertikal dengan foto dan teks per momen (misal: "Pertama bertemu", "Jadian", "Lamaran", dll).
- Foto per milestone bisa diupload langsung.
- Teks dan tanggal setiap milestone bisa diedit bebas.
- Animasi scroll yang smooth agar terasa seperti bercerita.
- Bisa dinonaktifkan jika pasangan tidak ingin menampilkan section ini.

---

### 3.2 Gallery / Foto Prewedding

Galeri foto yang tampilannya modern dan tidak kaku — bukan sekadar grid foto biasa.

**Detail fitur:**
- Layout **Masonry** (seperti Pinterest) yang otomatis menyesuaikan ukuran foto.
- **Lightbox** saat foto diklik — tampil besar dengan navigasi kiri/kanan.
- Dukungan upload multiple foto sekaligus dengan preview sebelum publish.
- Opsi layout alternatif: carousel/slideshow, atau full-screen cinematic scroll.
- Batas jumlah foto bisa berbeda per paket (misal: Basic 10 foto, Premium unlimited).

---

### 3.3 Musik Latar (Background Music)

Pasangan bisa memilih atau mengupload lagu sebagai musik latar saat tamu membuka undangan.

**Detail fitur:**
- Pilihan dari library lagu yang sudah tersedia (lagu-lagu wedding populer).
- Opsi upload lagu sendiri (format MP3/OGG).
- Kontrol play/pause yang tidak mengganggu tampilan (floating button kecil di pojok).
- Auto-play dengan fallback graceful karena kebijakan browser modern yang membatasi autoplay.

---

## 4. Fitur yang Sedang Direncanakan

### 4.1 Absensi Digital dengan QR Code

Karena setiap tamu sudah memiliki ID unik dan URL personal, QR Code bisa di-generate langsung dari ID tersebut tanpa infrastruktur tambahan yang berat.

Terdapat **dua cara absen** yang bisa digunakan tamu:

---

#### Cara 1 — QR Code Cetak (Print)

QR Code di-generate dari dashboard pengantin, lalu didownload dan dicetak — bisa ditempel di kartu undangan fisik, amplop, atau meja tamu.

**Flow:**
1. Dari dashboard, pengantin bisa **generate QR Code** per tamu, atau **download semua QR sekaligus** dalam satu file ZIP.
2. QR Code dicetak dan dibagikan bersama undangan fisik.
3. Di hari H, panitia membuka **halaman scanner** di browser HP (tidak perlu install app) — menggunakan kamera HP untuk scan QR.
4. Setelah scan, muncul nama tamu, jumlah orang yang hadir, dan tombol konfirmasi kehadiran.
5. Data kehadiran masuk ke dashboard secara real-time dengan timestamp.

---

#### Cara 2 — Absen Mandiri via Halaman Undangan Online

Saat tamu membuka link undangan personal mereka untuk pertama kali, muncul **popup atau section khusus** yang mengajak tamu untuk langsung melakukan absen saat tiba di lokasi.

**Flow:**
1. Tamu membuka undangan online mereka (`/slug/id_tamu`) — bisa dari HP masing-masing.
2. Di hari H saat tiba di lokasi, tamu membuka kembali link undangan dan menekan tombol **"Saya Sudah Tiba 📍"** atau **"Konfirmasi Kehadiran Saya"**.
3. Sistem mencatat timestamp kehadiran dan menandai tamu sebagai hadir di dashboard.
4. Tamu mendapat konfirmasi singkat, misalnya: *"Terima kasih sudah hadir! Selamat menikmati resepsi Adhika & Hilwa."*

**Catatan UX:**
- Tombol ini idealnya muncul **hanya pada hari H** (sesuai tanggal acara yang diset pengantin) agar tidak membingungkan saat undangan dibuka jauh sebelum hari pernikahan.
- Setelah berhasil absen, tombol berubah menjadi status **"Sudah Hadir ✓"** agar tidak bisa double absen.
- Nama tombol bisa dibuat lebih hangat dan personal: **"Saya Sudah Tiba 📍"**, **"Hadir di Sini"**, atau **"Tandai Kehadiran Saya"**.

---

**Hal yang perlu diputuskan:**
- Apakah perlu **mode panitia** dengan akses terbatas (hanya bisa scan, tidak bisa lihat data lain)? Mode ini penting karena yang scan di hari H biasanya bukan pengantinnya sendiri.
- Pengelolaan kasus tamu datang melebihi jumlah yang dikonfirmasi (misal konfirmasi 2 orang tapi datang 3).
- Apakah Cara 2 (absen mandiri) tersedia di semua paket, atau hanya paket tertentu?

---

### 4.2 Tema Berbayar

Beberapa tema premium akan dikunci dan hanya bisa digunakan setelah melakukan pembelian atau upgrade paket.

**Struktur yang disarankan:**

Daripada hanya menjual tema satuan, pertimbangkan model **paket/tier** agar lebih mudah dikomunikasikan dan memudahkan upsell:

| Paket | Harga | Fitur |
|---|---|---|
| **Basic** | Gratis | Tema terbatas, fitur standar, watermark |
| **Premium** | Berbayar | Semua tema, tanpa watermark, QR absen, galeri unlimited |
| **Elite** | Berbayar | Semua Premium + musik latar, Love Story, prioritas support |

---

### 4.3 Sistem Pembayaran: Payment Gateway + Shopee

Dua jalur pembelian yang direncanakan:

**Jalur 1 — Langsung di Website (Payment Gateway)**
- Pengguna memilih paket/tema, lakukan pembayaran via Midtrans / Xendit.
- Setelah pembayaran berhasil, akses langsung aktif di akun.

**Jalur 2 — Via Shopee**
- Pengguna checkout di Shopee seperti biasa.
- Setelah checkout, admin membuatkan **kode unik** (redemption code) secara manual atau semi-otomatis.
- Kode dikirimkan ke pembeli (via chat Shopee atau email).
- Di halaman website, ada menu **"Redeem Kode"** — pengguna input kode, akses langsung aktif.

**Hal yang perlu direncanakan:**
- Masa berlaku kode redeem (expired date).
- Kode hanya bisa digunakan satu kali dan terikat ke satu akun.
- Dashboard admin untuk generate, monitor, dan nonaktifkan kode.
- Masa aktif layanan: mulai dari kapan? Saat redeem, atau bisa diset sendiri oleh pengguna? Disarankan **mulai saat redeem, berlaku X bulan** (misal 6 atau 12 bulan).

---

## 5. Migrasi Infrastruktur

### 5.1 Kondisi Saat Ini

| Komponen | Stack Saat Ini |
|---|---|
| Backend | Node.js + Express (server terpisah) |
| Frontend | Next.js |
| Database | MySQL |
| Media Storage | Cloudinary |

---

### 5.2 Target Stack Setelah Migrasi

| Komponen | Stack Baru | Catatan |
|---|---|---|
| Backend | Next.js API Routes | Digabung ke repo frontend, tidak perlu server Express terpisah |
| Frontend | Next.js (tetap) | Ada update pada logika session |
| Database | Supabase (PostgreSQL) | Migrasi dari MySQL |
| Media Storage | Cloudinary (tetap) | Tidak ada perubahan |

---

### 5.3 Migrasi Backend: Express → Next.js API Routes

Saat ini backend berjalan sebagai server Express terpisah. Rencananya semua endpoint dipindahkan ke **Next.js API Routes** (`/app/api/...` atau `/pages/api/...`) sehingga codebase menjadi satu repo yang lebih mudah dikelola dan di-deploy.

**Yang perlu diperhatikan:**

- Semua route Express perlu dipetakan ulang ke file API Route di Next.js. Struktur folder sebaiknya mengikuti pola: `/api/[resource]/route.ts`.
- Middleware yang ada di Express (auth check, rate limiting, error handler) perlu diadaptasi menjadi fungsi helper atau menggunakan Next.js middleware (`middleware.ts`).
- Jika ada logic yang berat atau long-running (misal generate ZIP QR Code), perlu dipertimbangkan apakah cukup di API Route atau perlu dipisah ke background job / serverless function.
- Pastikan environment variable yang sebelumnya di sisi Express dipindahkan ke `.env.local` di Next.js.

---

### 5.4 Migrasi Database: MySQL → Supabase (PostgreSQL)

Supabase menggunakan PostgreSQL, sehingga ada beberapa perbedaan sintaks dan tipe data yang perlu disesuaikan dari MySQL.

**Hal yang perlu dilakukan:**

- **Schema migration:** Export schema MySQL, konversi ke PostgreSQL. Perhatikan perbedaan tipe data seperti `TINYINT(1)` → `BOOLEAN`, `DATETIME` → `TIMESTAMPTZ`, `AUTO_INCREMENT` → `SERIAL` atau `UUID`.
- **Data migration:** Dump data dari MySQL, transformasi jika perlu, lalu import ke Supabase. Tools seperti `pgloader` bisa membantu otomasi ini.
- **Query adjustment:** Jika ada raw query MySQL di codebase, perlu dicek kompatibilitasnya dengan PostgreSQL (misal: backtick `` ` `` di MySQL → double quote `"` di PostgreSQL untuk identifier).
- **ORM/Query builder:** Jika menggunakan Sequelize (MySQL), pertimbangkan pindah ke **Prisma** yang support Supabase/PostgreSQL dengan baik dan lebih type-safe untuk Next.js.
- **Supabase extras yang bisa dimanfaatkan:**
  - **Supabase Auth** — bisa dipertimbangkan untuk menggantikan sistem auth custom yang ada.
  - **Realtime** — update dashboard (RSVP, ucapan, absen) bisa real-time tanpa polling menggunakan Supabase Realtime subscription.
  - **Row Level Security (RLS)** — keamanan data per user langsung di level database.
  - **Storage** — opsional sebagai alternatif/pelengkap Cloudinary untuk file tertentu.

---

### 5.5 Update Session & Auth: User Biasa dan Admin

Setelah pindah ke Next.js full-stack, logika pengecekan session perlu diperbarui dan diseragamkan untuk dua jenis pengguna.

**Dua role yang ada:**

| Role | Akses |
|---|---|
| **User (Pengantin)** | Dashboard undangan milik sendiri, kelola tamu, RSVP, kado, amplop digital |
| **Admin** | Semua data pengguna, generate kode redeem, manajemen paket & tema, monitoring |

**Strategi session yang disarankan:**

Gunakan **NextAuth.js (Auth.js)** atau **Supabase Auth** sebagai fondasi session management.

- Session disimpan via cookie HTTP-only (lebih aman dari localStorage).
- Di setiap API Route, lakukan pengecekan session di awal: jika tidak ada session atau role tidak sesuai, langsung return `401` atau `403`.
- Di sisi frontend, gunakan **Next.js Middleware** (`middleware.ts`) untuk proteksi route secara terpusat — tidak perlu cek session manual di setiap halaman.

**Contoh pola proteksi route:**

```
/dashboard/*         → harus login sebagai user
/admin/*             → harus login sebagai admin
/api/dashboard/*     → validasi session user di API Route
/api/admin/*         → validasi session admin di API Route
```

**Yang perlu diupdate di frontend:**

- Hapus logika cek session yang tersebar di berbagai komponen/halaman, pindahkan semua ke `middleware.ts`.
- Pastikan redirect yang konsisten: user tidak login → ke `/login`, admin tidak login → ke `/admin/login`.
- Tambahkan pengecekan role di sisi server (Server Component atau API Route), bukan hanya di sisi client, untuk mencegah akses tidak sah.
- Jika menggunakan Supabase Auth, manfaatkan `supabase.auth.getSession()` di server-side untuk validasi token tanpa round-trip tambahan.

---

### 5.6 Urutan Migrasi yang Disarankan

Migrasi sebaiknya dilakukan bertahap untuk meminimalkan risiko downtime:

1. **Setup Supabase** — buat project, buat schema PostgreSQL, migrasi data dari MySQL, uji koneksi.
2. **Pindah query database** — update semua koneksi dari MySQL ke Supabase di backend Express yang lama (langkah antara agar tidak ada perubahan besar sekaligus).
3. **Buat API Routes di Next.js** — port endpoint Express satu per satu ke Next.js, uji tiap endpoint.
4. **Update session & auth** — implementasi NextAuth / Supabase Auth, update middleware frontend.
5. **Cutover** — arahkan traffic dari Express server ke Next.js, matikan server Express.
6. **Cleanup** — hapus repo/kode Express yang sudah tidak dipakai.

---

## 6. Ringkasan Prioritas Pengembangan

| Prioritas | Fitur | Alasan |
|---|---|---|
| 🔴 Tinggi | Multiple rekening Amplop Digital | Pain point nyata, implementasi relatif cepat |
| 🔴 Tinggi | Absensi QR Code | Nilai jual premium, infrastruktur sudah siap |
| 🟡 Sedang | Google Maps Embed | Meningkatkan kualitas undangan, mudah diimplementasi |
| 🟡 Sedang | Love Story / Our Journey | Diferensiasi konten, high engagement dari tamu |
| 🟡 Sedang | Gallery Masonry + Lightbox | Upgrade visual yang signifikan |
| 🟡 Sedang | Sistem Paket & Tema Berbayar | Fondasi monetisasi |
| 🟢 Berikutnya | Live Streaming upgrade | Nilai tambah untuk tamu remote |
| 🟢 Berikutnya | Musik Latar | Pengalaman membuka undangan lebih berkesan |
| 🟢 Berikutnya | Integrasi Shopee + Kode Redeem | Ekspansi channel penjualan |

---

*Dokumen ini dibuat berdasarkan diskusi product pada April 2026.*
