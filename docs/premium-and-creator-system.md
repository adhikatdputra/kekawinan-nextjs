# Sistem Premium & Creator — Kekawinan.com

> Dokumen ini menjelaskan konsep sistem paket premium, alur pembelian via marketplace, sistem kode redeem, kredit, komisi creator, aturan kepemilikan tema, serta mekanisme perubahan rate komisi.

---

## 1. Struktur Produk di Marketplace (Shopee)

### Konsep

Produk yang dijual di Shopee adalah **tema undangan**, bukan paket secara langsung. Mirip seperti membeli baju — pertama user memilih model baju (tema), lalu memilih varian (paket) yang mengubah harga.

### Struktur Variant

```
Produk: Tema Undangan Kekawinan.com
  └── Variant 1: Pilih Tema
        ├── Tema A — Elegant Floral
        ├── Tema B — Modern Minimalist
        └── Tema C — Javanese Gold
  └── Variant 2: Pilih Paket
        ├── Akad
        ├── Resepsi
        └── Grand
```

### Contoh Tabel Harga

| Tema | Akad | Resepsi | Grand |
|---|---|---|---|
| Tema A — Elegant Floral | Rp 25.000 | Rp 40.000 | Rp 60.000 |
| Tema B — Modern Minimalist | Rp 30.000 | Rp 45.000 | Rp 65.000 |
| Tema C — Javanese Gold | Rp 30.000 | Rp 45.000 | Rp 65.000 |

> Harga berubah berdasarkan kombinasi tema + paket yang dipilih, persis seperti varian produk di Shopee.

---

## 2. Paket & Fitur

### Nama Paket

Nama paket menggunakan istilah yang relevan dengan konteks pernikahan agar mudah diingat dan on-brand.

| Paket | Posisi | Target User |
|---|---|---|
| **Akad** | Basic | Pasangan dengan kebutuhan simpel, budget terbatas |
| **Resepsi** | Mid-tier | Pasangan yang ingin tampilan lebih lengkap |
| **Grand** | Premium | Pasangan yang ingin semua fitur & pengalaman terbaik |

### Pembatasan Fitur per Paket

| Fitur | Akad | Resepsi | Grand |
|---|---|---|---|
| Section dasar (cover, detail acara, maps) | ✅ | ✅ | ✅ |
| RSVP & Ucapan Doa | ✅ | ✅ | ✅ |
| Amplop Digital | 1 rekening | 3 rekening | Unlimited |
| Kado Pernikahan (Gift Registry) | ❌ | ✅ | ✅ |
| Gallery Foto | 10 foto | 30 foto | Unlimited |
| Love Story / Our Journey | ❌ | ✅ | ✅ |
| Live Streaming Section | ❌ | ✅ | ✅ |
| Musik Latar | ❌ | ✅ | ✅ |
| Absensi QR Code | ❌ | ❌ | ✅ |
| Custom Domain | ❌ | ❌ | ✅ |
| Watermark Kekawinan.com | Ada | Tidak ada | Tidak ada |
| Jumlah tamu maksimal | 100 | 500 | Unlimited |

---

## 3. Sistem Kode Redeem

### Alur Pembelian

```
User pilih tema + paket di Shopee
        ↓
User checkout & bayar
        ↓
Admin menerima notifikasi pesanan
        ↓
Admin generate kode redeem di dashboard
        ↓
Kode dikirim ke pembeli (via chat Shopee / catatan pesanan)
        ↓
User login ke kekawinan.com → menu "Tukar Kode"
        ↓
User input kode → sistem validasi
        ↓
Credit masuk ke akun user (tema + paket terkunci sesuai pembelian)
        ↓
User buat undangan menggunakan credit tersebut
```

### Field Kode Redeem (di Dashboard Admin)

| Field | Tipe | Keterangan |
|---|---|---|
| `themeId` | Dropdown | Tema yang dibeli |
| `packageType` | Dropdown | Paket: Akad / Resepsi / Grand |
| `totalCredit` | Number | Jumlah undangan yang bisa dibuat (biasanya 1) |
| `expiredAt` | Date | Batas waktu redeem (misal 30 hari setelah dibuat) |
| `note` | Text (opsional) | Catatan internal, misal nomor pesanan Shopee |

### Format Kode

```
KKW-GRAND-A1B2C3
```
Format: `KKW` (prefix) + `-` + `PAKET` + `-` + `random alphanumeric`

### Aturan Kode Redeem

- Satu kode hanya bisa digunakan **satu kali** oleh satu akun.
- Kode memiliki **masa berlaku** sejak dibuat. Lewat expired → tidak bisa dipakai.
- Setelah berhasil di-redeem, slot undangan **tidak punya expired date**.
- Saldo credit tidak bisa dipindahtangankan antar akun.

---

## 4. Sistem Credit & Konversi Rupiah

### Definisi Credit

Field `credit` di `tbl_theme` menyimpan **jumlah unit credit** yang merepresentasikan nilai dasar tema tersebut. Nilai 1 unit credit dalam rupiah dikonfigurasi oleh admin melalui master data settings.

**Contoh dengan nilai 1 credit = Rp 5.000:**

| Tema | Credit | Harga Dasar (Akad) |
|---|---|---|
| Tema A — Elegant Floral | 5 | Rp 25.000 |
| Tema B — Modern Minimalist | 6 | Rp 30.000 |
| Tema C — Javanese Gold | 6 | Rp 30.000 |

> Harga dasar (paket Akad) selalu = `theme.credit × creditValue`. Paket Resepsi dan Grand lebih mahal di Shopee, tapi **komisi creator selalu dihitung dari harga dasar** — tidak peduli paket mana yang dibeli user.

### Master Data Settings — Credit & Sistem

Admin dapat mengubah pengaturan sistem melalui halaman Settings di dashboard admin. Semua nilai disimpan di `tbl_settings` sebagai key-value, dan setiap perubahan otomatis dicatat di `tbl_settings_log`.

| Key | Keterangan | Default |
|---|---|---|
| `credit_value` | Nilai 1 credit dalam rupiah | Rp 5.000 |
| `min_withdrawal` | Minimum saldo creator untuk request penarikan | Rp 50.000 |
| `creator_ownership_days` | Durasi (hari) sebelum tema beralih ke milik Kekawinan.com | 730 (2 tahun) |
| `commission_notice_days` | Jumlah hari notice sebelum perubahan rate komisi efektif | 60 |

> Perubahan nilai settings **hanya berlaku untuk transaksi atau perjanjian baru**. Perjanjian yang sudah berjalan menggunakan nilai snapshot saat perjanjian dibuat.

---

## 5. Aturan Kepemilikan Tema

### Konsep

Tema yang dibuat oleh creator akan **beralih menjadi milik penuh Kekawinan.com** setelah durasi tertentu dihitung dari tanggal tema pertama kali live. Setelah peralihan, creator tidak lagi mendapatkan komisi dari tema tersebut.

Durasi kepemilikan dikonfigurasi di settings (`creator_ownership_days`, default 730 hari / 2 tahun).

### Aturan Penting

**Perjanjian tidak berubah retroaktif.** Durasi yang berlaku untuk sebuah tema adalah durasi yang di-snapshot saat creator pertama kali di-assign ke tema tersebut. Jika admin mengubah `creator_ownership_days` dari 730 ke 365, tema-tema yang sudah berjalan tetap menggunakan durasi 730 hari sesuai perjanjian awal mereka.

**Creator diberitahu dari awal.** Saat creator di-assign ke tema, sistem mencatat `commissionExpiresAt = liveAt + snapshotted_ownership_days`. Nilai ini tampil di dashboard creator sebagai "Komisi aktif hingga: [tanggal]".

**Setelah ownership transfer:** Tema tetap tersedia dan bisa dibeli user, hanya komisi creator yang berhenti. Tema menjadi aset Kekawinan.com sepenuhnya.

### Field yang dibutuhkan di `tbl_theme`

| Field | Keterangan |
|---|---|
| `creatorId` | FK ke creator yang memiliki tema ini (nullable) |
| `commissionRate` | % komisi creator untuk tema ini (snapshot saat assign) |
| `liveAt` | Tanggal tema pertama kali aktif/live |
| `ownershipDays` | Snapshot durasi kepemilikan saat creator di-assign |
| `commissionExpiresAt` | Tanggal komisi berakhir (`liveAt + ownershipDays`) — dihitung otomatis saat assign |

### Alur Pengecekan Komisi

Setiap kali undangan baru dibuat dari credit, sebelum mencatat komisi ke `tbl_creator_earnings`:

```
Cek apakah theme.creatorId ada?
        ↓ Ya
Cek apakah hari ini < theme.commissionExpiresAt?
        ↓ Ya → Catat komisi
        ↓ Tidak → Tema sudah menjadi milik Kekawinan.com, tidak ada komisi
```

---

## 6. Sistem Komisi Creator

### Persentase Komisi

Komisi diberikan sebesar **5–10%** dari harga dasar tema. Persentase ini dinegosiasikan per-creator dan di-set oleh admin saat assign creator ke tema.

### Formula Komisi

```
harga dasar tema  = theme.credit × creditValue
komisi creator    = harga dasar tema × commissionRate / 100
```

**Contoh:**
- `theme.credit` = 5, `creditValue` = Rp 5.000 → harga dasar = **Rp 25.000**
- `commissionRate` creator = 10%
- Komisi = Rp 25.000 × 10% = **Rp 2.500 per undangan**
- Tidak peduli user beli paket Akad, Resepsi, atau Grand — komisi tetap Rp 2.500

> Nilai `creditValue` yang dipakai adalah nilai yang berlaku **saat transaksi terjadi** — disimpan sebagai snapshot di `tbl_creator_earnings` agar kalkulasi historis tidak berubah walau admin mengubah settings di kemudian hari.

### Saldo Creator

```
Saldo Kamu: Rp 235.000
Sudah Ditarik: Rp 150.000
Total Komisi Sepanjang Waktu: Rp 385.000
```

Saldo dihitung otomatis: `SUM(creator_earnings.amount) - SUM(withdrawal_requests.amount WHERE status = DONE)`.

---

## 7. Mekanisme Perubahan Rate Komisi

### Latar Belakang

Rate komisi di-set per-creator secara manual oleh admin. Dalam kondisi bisnis tertentu (misal margin terlalu tipis, perubahan struktur biaya), admin mungkin perlu mengubah rate untuk creator tertentu atau semua creator.

Perubahan ini harus dilakukan secara **transparan dan dengan notice period** agar creator tidak merasa diperlakukan sepihak.

### Alur Perubahan Rate (Proposed Rate)

```
Admin mengusulkan rate baru untuk creator/tema tertentu
        ↓
Sistem menyimpan proposed rate + tanggal efektif
(misal: efektif 60 hari dari sekarang, sesuai commission_notice_days)
        ↓
Creator mendapat notifikasi: "Rate komisi kamu akan berubah dari X% menjadi Y%
efektif tanggal [tanggal]. Kamu punya waktu hingga [deadline] untuk merespons."
        ↓
        ├── Creator MENERIMA → Rate baru aktif per tanggal efektif
        ├── Creator MENOLAK → Tema di-pause sementara (tidak bisa dibeli)
        │                     sampai ada kesepakatan baru
        └── Tidak ada respons hingga deadline → Dianggap menerima,
                                                rate baru otomatis aktif
```

### Aturan Perubahan Rate

- Rate hanya berlaku untuk **transaksi setelah tanggal efektif**. Komisi yang sudah tercatat tidak berubah.
- Admin tidak bisa mempersingkat notice period di bawah `commission_notice_days` kecuali dengan persetujuan eksplisit creator.
- Semua usulan perubahan, respons creator, dan riwayat rate tercatat di `tbl_commission_rate_history`.
- Creator bisa melihat riwayat perubahan rate di dashboard mereka.

### Field yang dibutuhkan di `tbl_commission_rate_history`

| Field | Keterangan |
|---|---|
| `creatorId` | Creator yang bersangkutan |
| `themeId` | Tema yang rate-nya berubah (nullable jika berlaku semua tema creator) |
| `oldRate` | Rate sebelumnya |
| `proposedRate` | Rate yang diusulkan |
| `effectiveAt` | Tanggal efektif rate baru |
| `status` | PENDING / ACCEPTED / REJECTED |
| `respondedAt` | Kapan creator merespons |
| `proposedBy` | Admin yang mengusulkan |
| `note` | Alasan perubahan |

---

## 8. Alur Penarikan Dana (Withdrawal)

```
Creator klik "Ajukan Penarikan Dana"
        ↓
Sistem cek saldo ≥ min_withdrawal (dari tbl_settings)
        ↓
Creator konfirmasi jumlah & info rekening bank terdaftar
        ↓
Request masuk ke dashboard admin — status: Menunggu Transfer
        ↓
Admin melakukan transfer manual ke rekening creator
        ↓
Admin klik "Konfirmasi Sudah Ditransfer" + upload bukti
        ↓
Status: Selesai — saldo creator terhitung ulang otomatis
        ↓
Creator mendapat notifikasi dana sudah ditransfer
```

### Status Withdrawal

| Status | Keterangan |
|---|---|
| `PENDING` | Request diterima, belum diproses |
| `PROCESSING` | Admin sedang memproses transfer |
| `DONE` | Transfer sudah dilakukan, saldo direset |
| `REJECTED` | Admin menolak request (dengan catatan alasan) |

### Aturan Withdrawal

- Minimum saldo diambil dari `tbl_settings` key `min_withdrawal` (default Rp 50.000).
- Satu creator hanya bisa punya **satu request aktif** sekaligus.
- Admin wajib upload bukti transfer sebelum bisa konfirmasi DONE.

---

## 9. Dashboard Admin — Menu Creator

| Sub-menu | Fungsi |
|---|---|
| **Daftar Creator** | List creator, status, total tema, total komisi yang dibayar |
| **Proposal Desain** | Review pengajuan desain — terima / tolak / ubah status |
| **Tema per Creator** | Tema-tema yang terhubung ke creator, status komisi, tanggal ownership transfer |
| **Saldo & Komisi** | Rekap saldo semua creator, histori komisi per transaksi |
| **Penarikan Dana** | List request withdrawal, proses transfer, upload bukti, konfirmasi |
| **Settings** | Ubah `credit_value`, `min_withdrawal`, `creator_ownership_days`, `commission_notice_days` |

---

## 10. Dashboard Creator (/affiliate/dashboard)

```
Halo, Rina!

┌─────────────────────────────────────────────────────────┐
│  Saldo          Total Komisi        Tema Aktif           │
│  Rp 235.000     Rp 385.000          3 tema               │
└─────────────────────────────────────────────────────────┘

Tema Kamu:
┌──────────────────┬──────────┬────────────┬──────────────────────┐
│ Nama Tema        │ Terjual  │ Komisi     │ Komisi Aktif Hingga  │
├──────────────────┼──────────┼────────────┼──────────────────────┤
│ Elegant Floral   │ 24       │ Rp 240.000 │ 12 Mar 2027          │
│ Soft Sage        │ 9        │ Rp 99.000  │ 5 Jan 2027           │
│ Dark Romance     │ 5        │ Rp 46.000  │ 20 Jun 2026          │  ← mendekati transfer
└──────────────────┴──────────┴────────────┴──────────────────────┘

[Ajukan Penarikan Dana]   [Ajukan Desain Baru]
```

> Kolom "Komisi Aktif Hingga" menampilkan `commissionExpiresAt` dari tema. Jika sudah dalam 90 hari sebelum transfer, tampilkan peringatan kuning. Jika sudah lewat, tampilkan "Tema sudah menjadi milik Kekawinan.com".

---

## 11. Ringkasan Alur Keseluruhan

```
SHOPEE                    ADMIN                       USER / CREATOR
────────────────────────────────────────────────────────────────────
User beli Tema A          ← Notifikasi pesanan
paket Grand Rp 60.000

                          Generate kode:
                          - themeId: Tema A
                          - packageType: GRAND
                          - totalCredit: 1
                          - expiredAt: 30 hari
                          Kode: KKW-GRAND-A1B2C3
                                      ↓
                          Kirim kode via            User terima kode
                          chat Shopee

                                                     User redeem kode
                                                     di kekawinan.com
                                                           ↓
                                                     Slot undangan aktif
                                                     (Tema A, Grand)
                                                           ↓
                                                     User buat undangan
                                                           ↓
                          Cek commissionExpiresAt?
                          Masih aktif →
                          Komisi = 5 × 5000 × 10%
                          = Rp 2.500 →              Creator Tema A
                          masuk saldo creator        dapat notifikasi

                          Admin validasi             Creator request
                          withdrawal ←────────────  withdrawal
                                ↓
                          Transfer manual
                          + upload bukti
                                ↓
                          Status DONE →              Creator terima dana
                          Saldo direset
```

---

## 12. Roadmap Pengembangan

Pengembangan dibagi 3 fase. Fase 1 dan 2 bisa menghasilkan revenue tanpa menunggu sistem creator selesai.

> **Konteks schema saat ini:** `tbl_undangan`, `tbl_undangan_gift`, `tbl_undangan_gallery`, `tbl_kado`, dan `tbl_undangan_content` (termasuk field `streamLink` dan `music`) sudah ada. Field `credit` di `tbl_theme` dipertahankan sebagai nilai unit credit tema. `tbl_user_subscriber` dan `isMember`/`expiredMember` di `tbl_users` adalah sistem lama — tidak dihapus tapi tidak akan dapat data baru setelah sistem ini aktif.

---

### Fase 1 — Sistem Credit & Kode Redeem

> **Target:** Bisa jualan di Shopee dan user bisa redeem kode. Belum ada pembatasan fitur per paket.

#### Database — Tabel Baru

- [ ] Buat tabel `tbl_settings` — key-value store konfigurasi sistem. Field: `key` (unique), `value`, `description`, `updatedBy`, `updatedAt`. Seed data awal: `credit_value=5000`, `min_withdrawal=50000`, `creator_ownership_days=730`, `commission_notice_days=60`.
- [ ] Buat tabel `tbl_settings_log` — audit trail setiap perubahan settings. Field: `settingKey`, `oldValue`, `newValue`, `changedBy`, `changedAt`.
- [ ] Buat tabel `tbl_redemption_codes` — field: `id`, `code` (unique), `themeId`, `packageType`, `totalCredit`, `remainingCredit`, `usedBy`, `usedAt`, `expiredAt`, `status` (UNUSED/USED/EXPIRED), `note`, `generatedBy`.
- [ ] Buat tabel `tbl_user_credits` — field: `id`, `userId`, `themeId`, `packageType`, `status` (AVAILABLE/USED), `redemptionCodeId`, `usedForUndangan`, `usedAt`, `redeemedAt`.

#### Database — Modifikasi Tabel yang Ada

- [ ] Tambah kolom `packageType` (enum AKAD/RESEPSI/GRAND, nullable, default AKAD) ke `tbl_undangan`. Nullable agar undangan lama tidak error. **Ini Phase 2 prep — diisi tapi belum di-enforce di Phase 1.**

#### Backend — API

- [ ] `POST /api/admin/redeem-codes` — generate kode. Validasi level admin/superadmin.
- [ ] `GET /api/admin/redeem-codes` — list kode dengan filter status, packageType, themeId. Pagination.
- [ ] `POST /api/redeem` — user input kode. Validasi: ada, UNUSED, belum expired. Jika valid: insert `tbl_user_credits`, kurangi `remainingCredit`, update status kode jika habis.
- [ ] `GET /api/credits` — ambil semua credit AVAILABLE milik user yang login.
- [ ] Modifikasi `POST /api/undangan` — cek `tbl_user_credits` sebelum buat undangan. Jika ada credit cocok: buat undangan, isi `packageType` dari credit, tandai credit USED. Jika tidak ada: return 403 arahkan ke Shopee.
- [ ] `GET /api/admin/settings` & `PATCH /api/admin/settings` — read dan update settings, auto-insert log ke `tbl_settings_log`.

#### Frontend — Dashboard Admin

- [ ] Halaman `/admin/redeem-codes` — tabel list kode: kode, tema, paket, total/sisa credit, status, dipakai oleh, expired at, catatan.
- [ ] Form generate kode: dropdown tema, dropdown paket, input total credit (default 1), date picker expired, textarea catatan. Tampilkan preview harga dasar tema (`theme.credit × creditValue`) di bawah dropdown tema.
- [ ] Tombol copy-to-clipboard per baris kode.
- [ ] Halaman `/admin/settings` — form ubah `credit_value` dan `min_withdrawal`. Tampilkan nilai saat ini, tanggal terakhir diubah, dan histori perubahan singkat.

#### Frontend — Dashboard User

- [ ] Tombol / modal "Tukar Kode" dari dashboard utama user.
- [ ] Input kode + tombol Tukar. Tampilkan success (nama tema + paket) atau error (tidak valid / expired / sudah dipakai).
- [ ] Section "Undangan Saya" — tampilkan credit AVAILABLE: nama tema, paket, tombol "Buat Undangan".
- [ ] Jika tidak punya credit saat buat undangan → empty state + CTA ke Shopee.

#### Catatan Fase 1

Semua undangan yang dibuat dari credit belum dibatasi fiturnya. Field `packageType` sudah terisi tapi tidak di-enforce. Enforcement baru aktif di Fase 2.

---

### Fase 2 — Paket & Pembatasan Fitur

> **Target:** Paket Akad, Resepsi, Grand benar-benar membedakan fitur yang bisa diakses.

#### Persiapan

- [ ] Finalisasi dan sign-off batas fitur per paket (konfirmasi tabel Section 2).
- [ ] Field `packageType` di `tbl_undangan` sudah ada dari Fase 1 — tidak perlu migrasi schema.

#### Backend

- [ ] Buat helper `getPackageLimits(packageType)` — return object batas fitur: `{ maxGallery, maxGift, allowKado, allowMusic, allowStreaming, allowQRAbsen, allowWatermarkRemoval, maxGuests }`.
- [ ] Buat fungsi `checkFeatureAccess(undanganId, feature)` — query `packageType` dari `tbl_undangan`, bandingkan dengan limits, return `{ allowed: boolean, upgradeRequired?: 'RESEPSI' | 'GRAND' }`.
- [ ] Terapkan `checkFeatureAccess` di: upload gallery (cek `maxGallery`), tambah gift/rekening (cek `maxGift`), tambah kado (cek `allowKado`), update field `music` (cek `allowMusic`), update field `streamLink` (cek `allowStreaming`).
- [ ] `GET /api/undangan/:id/features` — return semua batas dan status akses fitur undangan ini. Dipakai frontend.

#### Frontend

- [ ] Buat hook `useFeatureAccess(undanganId)` — call `/api/undangan/:id/features`.
- [ ] Tampilkan ikon kunci 🔒 untuk fitur terkunci, bukan dihapus. Klik → modal upgrade dengan CTA ke Shopee.
- [ ] Counter di gallery: "8 / 10 foto". Tombol tambah di-disable dan muncul pesan jika sudah di batas.
- [ ] Badge paket di header dashboard undangan: "Paket: Akad", "Paket: Grand".
- [ ] Watermark otomatis di halaman undangan jika `packageType === AKAD`.

#### Catatan Fase 2

Tidak ada perubahan schema — hanya layer pengecekan di atas data yang sudah ada. Ini yang membuat Fase 2 bisa dikerjakan cepat setelah Fase 1 selesai.

---

### Fase 3 — Sistem Affiliate & Creator

> **Target:** Designer bisa daftar, ajukan tema, terima komisi otomatis, dan ada mekanisme withdrawal serta perubahan rate yang fair.

#### Database — Tabel Baru

- [ ] Buat tabel `tbl_creators` — field: `id`, `userId` (FK `tbl_users`), `displayName`, `bio`, `bankName`, `bankAccount`, `bankHolder`, `status` (PENDING/ACTIVE/SUSPENDED).
- [ ] Buat tabel `tbl_design_proposals` — field: `id`, `creatorId`, `name`, `description`, `designLink`, `category`, `status` (WAITING/REVIEWING/ACCEPTED/IN_PROGRESS/LIVE/REJECTED), `adminNote`.
- [ ] Buat tabel `tbl_creator_earnings` — field: `id`, `creatorId`, `themeId`, `undanganId`, `themeCredit` (snapshot), `creditValue` (snapshot dari `tbl_settings`), `commissionRate` (snapshot), `amount` (hasil kalkulasi), `packageType`, `createdAt`.
- [ ] Buat tabel `tbl_withdrawal_requests` — field: `id`, `creatorId`, `amount`, `status` (PENDING/PROCESSING/DONE/REJECTED), `proofImage`, `processedAt`, `adminNote`.
- [ ] Buat tabel `tbl_commission_rate_history` — field: `id`, `creatorId`, `themeId` (nullable), `oldRate`, `proposedRate`, `effectiveAt`, `status` (PENDING/ACCEPTED/REJECTED), `respondedAt`, `proposedBy`, `note`.

#### Database — Modifikasi Tabel yang Ada

- [ ] Tambah kolom `creatorId` (nullable, FK `tbl_creators`), `commissionRate` (nullable Int), `liveAt` (DateTime nullable), `ownershipDays` (Int nullable — snapshot `creator_ownership_days` saat assign), `commissionExpiresAt` (DateTime nullable — dihitung otomatis: `liveAt + ownershipDays`) ke `tbl_theme`.

#### Backend — Registrasi & Proposal

- [ ] `POST /api/affiliate/register` — user apply jadi creator. Insert ke `tbl_creators` status PENDING.
- [ ] `POST /api/affiliate/proposals` — creator submit proposal desain.
- [ ] `GET /api/affiliate/proposals` — creator lihat list proposal + status.
- [ ] `PATCH /api/admin/proposals/:id` — admin update status proposal + adminNote.
- [ ] `PATCH /api/admin/themes/:id/assign-creator` — admin assign creator ke tema. Otomatis snapshot `ownershipDays` dari `tbl_settings`, hitung dan simpan `commissionExpiresAt`.

#### Backend — Komisi & Withdrawal

- [ ] Modifikasi `POST /api/undangan` — setelah undangan dibuat, cek `theme.creatorId`. Cek `now < theme.commissionExpiresAt`. Jika ya: ambil `creditValue` dari `tbl_settings`, hitung `theme.credit × creditValue × commissionRate / 100`, insert ke `tbl_creator_earnings` dengan semua snapshot.
- [ ] `GET /api/affiliate/earnings` — histori komisi + total saldo (`SUM earnings - SUM withdrawal DONE`).
- [ ] `POST /api/affiliate/withdraw` — request penarikan. Cek saldo ≥ `min_withdrawal` dari settings.
- [ ] `PATCH /api/admin/withdrawals/:id` — proses withdrawal, upload bukti, konfirmasi DONE.

#### Backend — Perubahan Rate Komisi

- [ ] `POST /api/admin/creators/:id/propose-rate` — admin usulkan rate baru. Input: `proposedRate`, `themeId` (opsional), `note`. Sistem hitung `effectiveAt = now + commission_notice_days`. Insert ke `tbl_commission_rate_history` status PENDING. Kirim notifikasi ke creator.
- [ ] `POST /api/affiliate/rate-proposals/:id/respond` — creator terima atau tolak usulan. Update status ke ACCEPTED/REJECTED, isi `respondedAt`. Jika REJECTED → set tema terkait ke status pause.
- [ ] Cron job harian — cek `tbl_commission_rate_history` yang PENDING dan `effectiveAt <= today`. Jika tidak ada respons, auto-accept: update `commissionRate` di `tbl_theme`, update status ke ACCEPTED.

#### Frontend — Halaman /affiliate

- [ ] Landing page `/affiliate` — penjelasan program, persentase komisi, aturan kepemilikan, cara daftar.
- [ ] Form pendaftaran creator.
- [ ] Dashboard `/affiliate/dashboard` — saldo, total komisi, tabel tema (dengan kolom "Komisi Aktif Hingga"), notifikasi jika ada usulan rate baru yang menunggu respons.
- [ ] Banner peringatan jika ada tema yang komisinya akan berakhir dalam 90 hari.
- [ ] Form submit proposal desain baru.
- [ ] Halaman list proposal + status.
- [ ] Riwayat withdrawal + riwayat perubahan rate komisi.

#### Frontend — Dashboard Admin

- [ ] Menu "Creator" di sidebar: Daftar Creator, Proposal Desain, Penarikan Dana.
- [ ] Di halaman daftar creator: tombol "Usulkan Rate Baru" per creator.
- [ ] Form usul rate baru: input rate baru, pilih tema (opsional — kosong = semua tema creator), textarea alasan.
- [ ] Halaman penarikan dana: list request, tombol Proses → upload bukti → Konfirmasi Selesai.
- [ ] Halaman settings: ubah `creator_ownership_days` dan `commission_notice_days` dengan warning bahwa perubahan tidak berlaku retroaktif.

---

### Ringkasan Timeline

| Fase | Fokus | Perubahan Schema | Output | Revenue? |
|---|---|---|---|---|
| **Fase 1** | Credit & Kode Redeem | +4 tabel baru, +1 kolom di `tbl_undangan` | Alur beli → redeem → undangan jalan | ✅ |
| **Fase 2** | Paket & Fitur | Tidak ada | Diferensiasi Akad/Resepsi/Grand aktif | ✅ Lebih kuat |
| **Fase 3** | Affiliate & Creator | +5 tabel baru, +5 kolom di `tbl_theme` | Creator komisi + withdrawal + rate change | ✅ Margin berkurang |

---

*Dokumen ini dibuat April 2026 sebagai blueprint sistem premium dan creator kekawinan.com.*