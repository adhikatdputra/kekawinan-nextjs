# Panduan Hemat Egress Database & API

Dokumen ini ditulis agar bisa dipakai ulang di project lain — tidak ada nama file
atau angka spesifik repo ini di dalamnya. Salin apa adanya kalau perlu.

Penerapan konkretnya di repo ini ada di `AGENTS.md`.

Pada layanan berkuota (Supabase, Neon, PlanetScale, dsb) yang ditagih adalah byte
yang keluar. Kuota biasanya habis bukan karena datanya besar, tapi karena
**jumlah request x ukuran tiap response**. Database puluhan MB dengan belasan
user bisa menghasilkan egress bergiga-giga kalau polanya salah.

## Autentikasi

- Verifikasi sesi jangan lewat panggilan jaringan di setiap request. Kalau
  provider mendukung verifikasi token secara lokal (cek signature JWT), pakai itu.
- Satu request = maksimal satu kali resolusi identitas user. Bungkus dengan cache
  request-scoped, dan cache TTL pendek antar request kalau masih terasa berat.
- Jangan menaruh panggilan auth di interceptor HTTP client, hook layout, atau apa
  pun yang ikut jalan di setiap navigasi.
- Jangan mengirim kredensial yang tidak dibaca server (mis. memasang header
  Authorization padahal autentikasinya lewat cookie).

## Membaca data

- Sebut kolom secara eksplisit; jangan tarik seluruh baris. Yang paling boros:
  array URL, kolom teks panjang, dan kolom JSON.
- Setiap query daftar wajib punya batas (`LIMIT`/`take`), kecuali jumlah barisnya
  terbatas secara struktural — dan pengecualian itu ditulis alasannya di komentar.
- Data yang bertambah seiring waktu (riwayat, log, transaksi) wajib paginasi di
  server: offset untuk tabel bernomor, cursor untuk daftar yang di-scroll.
- Filter, pencarian, dan pengurutan di server. Jangan pernah menarik semua baris
  lalu disaring atau dipotong di browser.
- Agregasi (COUNT/SUM/GROUP BY/DISTINCT) di database. Jangan menarik ribuan baris
  hanya untuk dijumlahkan atau di-dedupe di aplikasi.
- Angka total/ringkasan dihitung terpisah dengan agregat, supaya tetap benar
  walau barisnya dipaginasi.
- Kalau ORM tidak bisa mengekspresikannya (ranking `CASE`, `DISTINCT ON`), pakai
  SQL mentah yang mengembalikan **id saja**, lalu ambil barisnya lewat ORM agar
  tetap ter-type.
- Data yang hanya dipakai untuk perhitungan di server jangan ikut dikirim —
  buang sebelum response.

## Menulis data

- Jangan menulis baris baru kalau nilainya tidak berubah; bandingkan dulu dengan
  nilai tersimpan.
- Waspadai tabel append-only (unique key mengandung timestamp/versi): satu aksi
  simpan bisa menambah ratusan baris. Kalau riwayat memang dibutuhkan, pastikan
  pembacaannya hanya mengambil versi terbaru per kombinasi, bukan seluruh riwayat.
- Pakai operasi batch, bukan loop yang menembak database per baris.

## Cache di client

- Setel `staleTime`/`gcTime` terpusat di satu modul, jangan ad-hoc per hook.
- `gcTime` harus >= `staleTime`; kalau tidak, cache keburu dibuang dan
  `staleTime` jadi percuma.
- Data referensi yang jarang berubah (master data) pakai `staleTime` panjang —
  puluhan menit, bukan detik.
- Matikan refetch saat window fokus dan saat koneksi tersambung ulang. Pindah tab
  tidak boleh memicu request.
- Jangan polling. Pakai push/realtime. Kalau butuh jaring pengaman, pakai interval
  panjang dan jangan jalan saat tab tidak aktif.
- Setiap mutasi meng-invalidate query terkait — ini yang membuat `staleTime`
  panjang tetap aman.

## UI

- Dropdown/kombobox jangan memuat seluruh tabel. Pakai pencarian server-side
  dengan debounce (~300-400ms).
- Debounce semua input yang memicu request.
- Data yang baru terlihat setelah user membuka tab/accordion, muat saat dibuka —
  bukan di awal halaman.

## Development

- Jangan ngoding menghadap database produksi. Tiap hot reload ikut membakar kuota
  dan tidak terlihat sebagai trafik user. Pakai database lokal atau project dev
  terpisah.

## Cara memeriksa

- Lihat tab Network: berapa KB response terbesar, dan berapa request sekali muat
  halaman. "Terasa cepat" bukan ukuran.
- Untuk tiap endpoint, tanya: response-nya tumbuh seiring waktu atau tidak?
- Di dashboard provider, lihat rincian egress per layanan (database / auth /
  realtime / storage) sebelum menebak penyebabnya.

