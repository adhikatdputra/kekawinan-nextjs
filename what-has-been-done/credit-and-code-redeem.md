# Fase 1 — Sistem Credit & Kode Redeem

Implementasi selesai: April 2026

---

## Ringkasan

Fase 1 membangun fondasi alur jual-beli undangan via Shopee:
user beli tema → admin generate kode → user redeem kode → credit ditambah ke akun → user pilih tema → credit terpotong → undangan dibuat.

**Model credit:**
- Setiap `UserCredit` row = **1 unit credit**
- Redeem kode dengan `totalCredit=10` → 10 row UserCredit AVAILABLE ditambahkan
- Setiap tema punya harga (`credit`) dan harga promo (`promo`)
- Harga efektif = `promo > 0 ? promo : credit`
- Buat undangan tema 5 credit → 5 row UserCredit ditandai USED (FIFO)
- Saldo user = COUNT row AVAILABLE

---

## Step 1 — Database Schema

### Tabel Baru

**`tbl_settings`**
Key-value store untuk konfigurasi sistem. Seeded dengan 4 nilai awal:
- `credit_value = 5000` — nilai 1 credit dalam rupiah
- `min_withdrawal = 50000` — minimum saldo creator untuk penarikan
- `creator_ownership_days = 730` — durasi kepemilikan tema oleh creator (Phase 3)
- `commission_notice_days = 60` — notice period perubahan rate komisi (Phase 3)

**`tbl_settings_log`**
Audit trail otomatis setiap kali settings diubah. Menyimpan `oldValue`, `newValue`, `changedBy`, `changedAt`.

**`tbl_redemption_codes`**
Kode redeem yang di-generate admin per transaksi Shopee. Format kode: `KKW-{PAKET}-{RANDOM}` (contoh: `KKW-GRAND-A1B2C3`). Field: `packageType`, `totalCredit` (credit per redemption), `remainingCredit` (berapa kali kode bisa dipakai), `expiredAt`, `status` (UNUSED/USED/EXPIRED). Tidak terikat ke tema tertentu.

**`tbl_user_credits`**
Setiap row = 1 unit credit. Field: `userId`, `packageType`, `status` (AVAILABLE/USED), `redemptionCodeId`, `usedForUndangan`, `usedAt`, `redeemedAt`.

### Modifikasi Tabel yang Ada

**`tbl_undangan`** — tambah kolom `packageType` (enum AKAD/RESEPSI/GRAND, default AKAD). Nullable agar undangan lama tidak error. Belum di-enforce di Fase 1 (enforcement di Fase 2).

### Enum Baru (Prisma)
- `PackageType`: AKAD | RESEPSI | GRAND
- `RedeemCodeStatus`: UNUSED | USED | EXPIRED
- `UserCreditStatus`: AVAILABLE | USED

### File yang Diubah
- `prisma/schema.prisma`
- `prisma/seed-settings.ts` *(baru)*

---

## Step 2 — Backend API Admin

### `GET /api/admin/redeem-codes`
List semua kode redeem dengan filter opsional: `status`, `packageType`. Mendukung pagination standar.

### `POST /api/admin/redeem-codes`
Generate kode redeem baru. Field wajib: `packageType`, `expiredAt`. Field opsional: `totalCredit` (default 1), `note`. Tidak perlu memilih tema. Kode di-generate dengan retry hingga 5x untuk menghindari collision.

### `GET /api/admin/settings`
Ambil semua settings + 20 log perubahan terbaru.

### `PATCH /api/admin/settings`
Update satu atau lebih setting sekaligus (body berupa object `{ key: value }`). Di Fase 1 hanya `credit_value` dan `min_withdrawal` yang diizinkan. Setiap perubahan otomatis dicatat ke `tbl_settings_log`.

### File yang Dibuat
- `src/app/api/admin/redeem-codes/route.ts` *(baru)*
- `src/app/api/admin/settings/route.ts` *(baru)*

---

## Step 3 — Backend API User

### `POST /api/redeem`
User input kode redeem. Validasi: kode ada, belum expired, masih punya `remainingCredit`, user belum pakai kode yang sama. Jika valid: insert **`totalCredit` baris** ke `tbl_user_credits` (1 baris = 1 credit unit), kurangi `remainingCredit` kode.

### `GET /api/credits`
Return `{ balance: number }` — jumlah row UserCredit berstatus AVAILABLE milik user.

### `POST /api/undangan` — Dimodifikasi
Alur buat undangan dibedakan:
- **User biasa**: wajib pilih tema. Sistem ambil `theme.credit` (atau `theme.promo` jika ada) sebagai biaya. Cek saldo cukup. Ambil N row AVAILABLE secara FIFO, tandai USED semua dalam satu transaction. `packageType` undangan diambil dari credit row pertama yang dipakai.
- **Admin**: bypass credit check. `themeId` dan `packageType` dikirim dari body.
- Jika saldo tidak cukup → return 403 dengan pesan jelas berapa kekurangannya.

### File yang Diubah/Dibuat
- `src/app/api/redeem/route.ts` *(baru)*
- `src/app/api/credits/route.ts` *(baru)*
- `src/app/api/undangan/route.ts` *(dimodifikasi)*

---

## Step 4 — Frontend Admin

### Halaman `/admin/redeem-codes`
- Tabel list kode: kode (monospace), badge paket, sisa/total credit, badge status (berwarna), tanggal expired, catatan.
- Filter dropdown: status dan packageType.
- Tombol copy-to-clipboard per baris.
- Dialog generate kode: dropdown paket, input jumlah credit (berapa credit yang user dapat), date picker expired, field catatan. Tidak ada pilihan tema.

### Halaman `/admin/settings`
- Form edit `credit_value` dan `min_withdrawal` dengan input format ribuan (titik separator, contoh: 50.000).
- Tombol simpan hanya aktif jika ada perubahan (`isDirty` flag).
- Preview konversi langsung: "tema dengan 5 credit → harga dasar Rp 30.000".
- Histori perubahan: log dengan nilai lama (dicoret) → nilai baru.

### Sidebar Admin
Tambah 2 menu baru: **Kode Redeem** dan **Settings**.

### File yang Dibuat/Diubah
- `src/frontend/api/admin/redeem-codes.ts` *(baru)*
- `src/frontend/api/admin/settings.ts` *(baru)*
- `src/frontend/store/admin-redeem-codes-store.tsx` *(baru)*
- `src/frontend/store/admin-settings-store.tsx` *(baru)*
- `src/app/(admin-cms)/admin/redeem-codes/page.tsx` *(baru)*
- `src/app/(admin-cms)/admin/settings/page.tsx` *(baru)*
- `src/components/layouts/sidebar-admin.tsx` *(dimodifikasi)*

---

## Step 5 — Frontend User

### Halaman `/user/undangan-list` — Dimodifikasi

**Tombol "Tukar Kode"** selalu muncul di hero untuk user biasa. Tombol "Buat Undangan" hanya muncul jika `balance > 0`.

**Dialog Tukar Kode**: input kode dengan format `KKW-GRAND-XXXXXX`. Setelah sukses, balance direfresh otomatis.

**Section "Credit Kamu"**: tampil jumlah credit sebagai angka besar + ikon koin. Empty state jika balance = 0 dengan CTA ke tukar kode.

**Dialog Buat Undangan**:
- Input nama + permalink seperti biasa
- Theme picker (Swiper) dengan badge harga credit di setiap kartu:
  - Normal: `{credit} credit`
  - Promo: harga promo (merah) + harga asli (dicoret)
  - Tema yang credit-nya melebihi balance user → opaque + cursor-not-allowed
- Di atas Swiper: tampilkan saldo credit user saat ini
- Setelah pilih tema: tampilkan "Sisa credit setelah buat: X" atau peringatan merah jika tidak cukup
- Tombol "Buat Undangan" di-disable jika credit tidak cukup atau tema belum dipilih

**Admin**: tidak melihat section credit, bisa buat undangan langsung tanpa credit.

### File yang Dibuat/Diubah
- `src/frontend/api/redeem.ts` *(baru)*
- `src/frontend/api/credits.ts` *(baru)*
- `src/frontend/interface/undangan.ts` *(dimodifikasi — tambah `UserCreditBalance`, `creditId` di `UndanganBody`)*
- `src/app/(user-login)/user/undangan-list/page.tsx` *(dimodifikasi)*

---

## Catatan Penting

- **Setiap UserCredit row = 1 unit credit.** Redeem 10 credit → 10 baris diinsert.
- **Harga efektif tema = `promo > 0 ? promo : credit`.** Jika tema punya promo, promo yang dipakai.
- **FIFO.** Saat memotong credit, row yang paling lama di-redeem dipakai duluan (`orderBy: redeemedAt asc`).
- **Undangan lama tidak terpengaruh.** Kolom `packageType` nullable, default AKAD.
- **`packageType` di undangan diambil dari credit row pertama** yang dipakai saat buat undangan.
- **Field `packageType` belum di-enforce.** Diisi tapi batas fitur baru aktif di Fase 2.
- **`tbl_user_subscriber` dan `isMember`/`expiredMember` tidak dihapus.** Sistem lama dibiarkan.
- **Settings Phase 3** (`creator_ownership_days`, `commission_notice_days`) sudah ada di DB, tapi key-nya di-whitelist di Fase 3.
