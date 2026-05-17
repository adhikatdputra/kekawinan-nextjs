# Fitur Absensi QR Code — Kekawinan.com

> Dokumen ini menjelaskan spesifikasi lengkap fitur absensi digital menggunakan QR Code. Fitur ini memanfaatkan sistem Crew dari fitur Kolaborator yang sudah ada.

---

## 1. Konsep & Dua Cara Absen

Setiap tamu sudah memiliki URL personal unik (`/slug-mempelai/id_tamu`), sehingga QR Code dapat di-generate langsung dari ID tamu tanpa infrastruktur tambahan yang berat.

Terdapat **dua cara absen** yang bisa digunakan:

| | Cara 1 — QR Cetak | Cara 2 — QR di Undangan Online |
|---|---|---|
| **QR dari mana** | Di-print dari dashboard, dibagikan fisik | Tampil di halaman undangan tamu di HP |
| **Yang scan** | Crew membuka halaman scanner, scan QR fisik | Crew membuka halaman scanner, scan QR di layar HP tamu |
| **Cocok untuk** | Tamu yang tidak buka undangan digital | Tamu yang membuka undangan dari HP |
| **Perlu print** | Ya | Tidak |

---

## 2. Cara 1 — QR Code Cetak (Print)

QR Code di-generate dari dashboard, didownload, lalu dicetak dan dibagikan bersama undangan fisik (kartu undangan, amplop, atau meja tamu).

### Flow

```
Owner buka dashboard → menu Tamu Undangan
        ↓
Generate QR per tamu → atau Download semua QR (ZIP)
        ↓
QR dicetak, dibagikan ke tamu bersama undangan fisik
        ↓
Hari H: Crew buka halaman scanner di browser HP
        ↓
Crew scan QR fisik milik tamu
        ↓
Scanner menampilkan: nama tamu, jumlah orang diundang
+ tombol "Konfirmasi Hadir"
        ↓
Crew tap "Konfirmasi Hadir"
        ↓
Data hadir masuk ke dashboard real-time + timestamp
```

### Catatan

- QR Code berisi URL tamu: `https://www.kekawinan.com/[slug]/[id_tamu]`
- Bisa download ZIP berisi semua QR sekaligus — berguna untuk print massal
- Satu QR hanya bisa dikonfirmasi satu kali — scan berikutnya tetap bisa dibuka tapi konfirmasi sudah terkunci

---

## 3. Cara 2 — QR di Halaman Undangan Online (Modified)

Tamu membuka undangan mereka di HP. Di hari H, halaman undangan menampilkan **QR Code khusus absensi** yang bisa discan oleh Crew menggunakan halaman scanner.

### Flow Lengkap

```
TAMU                              CREW
────────────────────────────────────────────────────────────
Tamu buka link undangan personal
(/slug/id_tamu) di HP mereka

Hari H: muncul section "Absensi"
di halaman undangan, menampilkan
QR Code unik tamu
(QR ini hanya muncul di hari H)
                                  Crew login ke akun mereka
                                  (sudah di-invite sebagai Crew
                                  oleh Owner undangan)

                                  Crew buka halaman scanner:
                                  /[slug]/scanner
                                  (kamera aktif otomatis)

Tamu tunjukkan HP                 Crew arahkan kamera ke QR
ke Crew                           di HP tamu
        ↓                                 ↓
                    QR terbaca
                         ↓
              Sistem identifikasi tamu:
              tampil di layar Crew:
              nama tamu, jumlah yang diundang,
              status RSVP sebelumnya
                         ↓
              Crew tap "Konfirmasi Hadir"
                         ↓
        ┌────────────────────────────────────┐
        ↓                                    ↓
Halaman undangan tamu               Dashboard Owner
update real-time:                   update real-time:
Section QR hilang                   tamu ditandai hadir
Muncul pesan konfirmasi:            + timestamp kehadiran
"Terima kasih sudah hadir!
Selamat menikmati resepsi
Adhika & Hilwa 🎉"
```

### Detail UX Halaman Tamu — Section Absensi

**Kondisi normal (sebelum hari H):**
Section absensi tidak tampil sama sekali. Tamu melihat undangan seperti biasa.

**Pada hari H (tanggal = `dateWedding` di `UndanganContent`):**

```
┌──────────────────────────────────────────┐
│           Konfirmasi Kehadiranmu         │
│                                          │
│   Tunjukkan QR ini kepada panitia        │
│   saat kamu tiba di lokasi               │
│                                          │
│          ┌─────────────────┐             │
│          │  ▄▄▄ ▄  ▄ ▄▄▄  │             │
│          │  █ █ ██▄  █ █  │             │
│          │  ▀▀▀ ▀  ▀ ▀▀▀  │             │
│          └─────────────────┘             │
│                                          │
│         [Adhika & Hilwa — Agus]          │
│         [Hadir: 2 orang]                 │
└──────────────────────────────────────────┘
```

**Setelah berhasil di-scan dan dikonfirmasi Crew:**

```
┌──────────────────────────────────────────┐
│                   ✓                      │
│       Kehadiran Terkonfirmasi!           │
│                                          │
│   Terima kasih sudah hadir, Agus!        │
│   Selamat menikmati resepsi              │
│   Adhika & Hilwa 🎉                      │
│                                          │
│   Hadir pukul 11:24 WIB                 │
└──────────────────────────────────────────┘
```

### Aturan Tampilan QR

- QR hanya tampil jika `today === dateWedding` (atau bisa dikonfigurasi: `today >= dateWedding - 0 days`).
- QR tidak tampil jika tamu sudah dikonfirmasi hadir.
- QR tidak tampil jika tamu RSVP "Tidak Hadir".
- Jika tamu belum RSVP, QR tetap tampil — Crew bisa tetap scan dan konfirmasi langsung.

---

## 4. Halaman Scanner (Crew)

### Akses & Proteksi

Halaman scanner hanya bisa diakses oleh:
- User yang login dengan role **Crew** di undangan tersebut
- User dengan role **Owner** di undangan tersebut

URL: `/[slug]/scanner`

Jika diakses tanpa login atau bukan Crew/Owner → redirect ke halaman login dengan pesan "Kamu perlu login sebagai Crew untuk mengakses scanner ini."

### Tampilan Halaman Scanner

```
┌─────────────────────────────────────────┐
│  ← Adhika & Hilwa — Scanner Absensi    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │         [KAMERA AKTIF]          │   │
│  │                                 │   │
│  │    Arahkan ke QR Code tamu      │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Sudah scan hari ini: 48 tamu           │
└─────────────────────────────────────────┘
```

**Setelah QR berhasil terbaca:**

```
┌─────────────────────────────────────────┐
│           Tamu Ditemukan ✓              │
│                                         │
│   Nama    : Agus dan Keluarga           │
│   Diundang: 4 orang                     │
│   RSVP    : Hadir (3 orang)             │
│   Status  : Belum Absen                 │
│                                         │
│        [Konfirmasi Hadir]               │
│        [Batal / Scan Ulang]             │
└─────────────────────────────────────────┘
```

**Setelah Crew tap "Konfirmasi Hadir":**

```
┌─────────────────────────────────────────┐
│                  ✓                      │
│           Berhasil Dicatat!             │
│                                         │
│   Agus dan Keluarga                     │
│   Hadir pukul 11:24 WIB                 │
│                                         │
│   [Scan Tamu Berikutnya]               │
└─────────────────────────────────────────┘
```

### Edge Cases di Scanner

| Skenario | Tampilan di Scanner |
|---|---|
| Tamu sudah pernah dikonfirmasi hadir | "⚠️ Tamu ini sudah tercatat hadir pukul [waktu]. Scan tidak diproses ulang." |
| QR bukan dari undangan ini | "❌ QR tidak dikenali. Pastikan kamu scan QR dari undangan yang benar." |
| Tamu RSVP tidak hadir | "ℹ️ Tamu ini RSVP tidak hadir. Konfirmasi tetap bisa dilakukan." + tombol tetap muncul |
| Tamu belum RSVP | "ℹ️ Tamu belum konfirmasi RSVP." + tombol konfirmasi tetap muncul |
| Koneksi internet terputus | "⚠️ Tidak ada koneksi. Coba lagi setelah terhubung ke internet." |

---

## 5. Real-time Update ke Halaman Tamu

Setelah Crew mengkonfirmasi kehadiran, halaman undangan tamu perlu update secara otomatis tanpa perlu refresh manual. Ada dua pendekatan:

### Opsi A — Supabase Realtime (Disarankan)

Karena database sudah menggunakan Supabase, manfaatkan **Realtime subscription** langsung di frontend.

```typescript
// Di halaman undangan tamu (/[slug]/[id_tamu])
const channel = supabase
  .channel(`tamu-${tamuId}`)
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'tbl_tamu',
      filter: `id=eq.${tamuId}`,
    },
    (payload) => {
      // Jika isConfirm berubah → update UI
      if (payload.new.isConfirm === 1) {
        setAttendanceConfirmed(true)
        setAttendedAt(payload.new.attendedAt)
      }
    }
  )
  .subscribe()
```

Keunggulan: update instan, tidak perlu polling. Tidak ada delay.

### Opsi B — Polling (Fallback)

Jika Realtime belum tersedia atau ada masalah, halaman tamu bisa polling setiap 5 detik **hanya pada hari H**:

```typescript
// Hanya aktif jika hari ini = hari H dan tamu belum dikonfirmasi
useEffect(() => {
  if (!isHariH || isConfirmed) return
  const interval = setInterval(async () => {
    const res = await fetch(`/api/tamu/${tamuId}/status`)
    if (res.ok) {
      const data = await res.json()
      if (data.isConfirm === 1) {
        setAttendanceConfirmed(true)
        clearInterval(interval)
      }
    }
  }, 5000)
  return () => clearInterval(interval)
}, [isHariH, isConfirmed])
```

---

## 6. Database

### Modifikasi Tabel yang Ada: `tbl_tamu`

Tambah kolom baru:

| Kolom | Tipe | Keterangan |
|---|---|---|
| `attendedAt` | `DateTime?` | Timestamp kehadiran dikonfirmasi. Null jika belum hadir. |
| `confirmedBy` | `String?` | `userId` Crew yang melakukan konfirmasi scan |

> Field `isConfirm` yang sudah ada (Int, 0/1) tetap digunakan sebagai flag utama. `attendedAt` melengkapi dengan timestamp, dan `confirmedBy` mencatat siapa yang scan.

```prisma
model Tamu {
  // ... field yang sudah ada ...
  attendedAt   DateTime? // 🆕 timestamp kehadiran
  confirmedBy  String?   @db.VarChar(255) // 🆕 userId crew yang scan

  // relasi baru
  confirmedByUser User? @relation("AttendanceConfirmedBy", fields: [confirmedBy], references: [id], onDelete: SetNull)
}
```

---

## 7. API Endpoints

### Attendance Confirmation

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| `POST` | `/api/undangan/[slug]/attendance` | Crew / Owner | Konfirmasi kehadiran tamu setelah scan QR |
| `GET` | `/api/tamu/[tamuId]/status` | Public | Cek status kehadiran tamu (untuk polling Cara 2) |

**POST `/api/undangan/[slug]/attendance`**

Request body:
```json
{
  "tamuId": "abc123"
}
```

Logic:
1. Validasi caller adalah Crew atau Owner dari undangan `slug` ini (gunakan helper `getUndanganAccess`).
2. Cek `tamu.undanganId` sesuai dengan undangan yang dimaksud (antisipasi scan QR undangan lain).
3. Cek `tamu.isConfirm` — jika sudah 1, return response "sudah hadir" tanpa update.
4. Update `tbl_tamu`: set `isConfirm = 1`, `attendedAt = now()`, `confirmedBy = session.user.id`.
5. Return data tamu (nama, jumlah, waktu hadir).

Response sukses:
```json
{
  "success": true,
  "tamu": {
    "id": "abc123",
    "name": "Agus dan Keluarga",
    "maxInvite": 4,
    "isConfirm": 1,
    "attendedAt": "2026-06-15T04:24:00.000Z"
  }
}
```

Response jika sudah hadir:
```json
{
  "success": false,
  "alreadyConfirmed": true,
  "attendedAt": "2026-06-15T04:10:00.000Z",
  "message": "Tamu ini sudah tercatat hadir."
}
```

**GET `/api/tamu/[tamuId]/status`**

Response:
```json
{
  "isConfirm": 1,
  "attendedAt": "2026-06-15T04:24:00.000Z"
}
```

Endpoint ini public (tidak perlu auth) karena diakses dari halaman undangan tamu yang tidak memerlukan login.

---

## 8. Generate & Download QR Code

### Di Dashboard Owner — Menu Tamu

Tambahkan di tabel list tamu:
- Tombol **"QR"** per baris tamu → buka modal preview QR + tombol download PNG.
- Tombol **"Download Semua QR"** di atas tabel → generate ZIP berisi semua QR tamu dalam format PNG, nama file: `[nama-tamu].png`.

### Implementasi QR

QR Code di-generate di frontend menggunakan library (misal `qrcode.react` atau `qrcode`) — tidak perlu generate di server.

Konten QR: URL personal tamu lengkap:
```
https://www.kekawinan.com/[slug]/[id_tamu]
```

Karena URL ini sudah unik per tamu, scan QR = identifikasi tamu secara langsung.

### Download ZIP (Backend)

Untuk download semua QR sekaligus, generate di backend:

```typescript
// app/api/undangan/[slug]/qr-download/route.ts
import JSZip from 'jszip'
import QRCode from 'qrcode'

export async function GET(req, { params }) {
  // Validasi Owner
  // Ambil semua tamu dari undangan
  // Generate QR buffer per tamu
  // Zip semua, return sebagai file download
  const zip = new JSZip()
  for (const tamu of tamuList) {
    const url = `https://www.kekawinan.com/${params.slug}/${tamu.id}`
    const qrBuffer = await QRCode.toBuffer(url, { width: 400 })
    zip.file(`${tamu.name || tamu.id}.png`, qrBuffer)
  }
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
  // return sebagai file download
}
```

---

## 9. Paket & Akses Fitur

| Fitur | Akad | Resepsi | Grand |
|---|---|---|---|
| Cara 2 — QR di halaman undangan (Crew scan) | ❌ | ❌ | ✅ |
| Cara 1 — Download QR per tamu (1 per 1) | ❌ | ❌ | ✅ |
| Download semua QR (ZIP) | ❌ | ❌ | ✅ |
| Halaman scanner Crew (`/[slug]/scanner`) | ❌ | ❌ | ✅ |

> Fitur absensi QR sepenuhnya tersedia di paket **Grand** saja. Paket Akad dan Resepsi tidak mendapatkan akses fitur ini.

---

## 10. Checklist Implementasi

### Database

- [ ] Tambah kolom `attendedAt` (DateTime nullable) ke `tbl_tamu`.
- [ ] Tambah kolom `confirmedBy` (VarChar nullable, FK ke `tbl_users`) ke `tbl_tamu`.
- [ ] Jalankan Prisma migration.

### Backend

- [ ] `POST /api/undangan/[slug]/attendance` — konfirmasi kehadiran. Validasi Crew/Owner, cek undangan match, cek double confirm, update `tbl_tamu`.
- [ ] `GET /api/tamu/[tamuId]/status` — cek status kehadiran (public, untuk polling).
- [ ] `GET /api/undangan/[slug]/qr-download` — generate dan return ZIP berisi semua QR tamu. Validasi Owner only.
- [ ] Update `checkFeatureAccess` — tambah `allowQRAbsen` yang hanya `true` untuk paket Grand.
- [ ] Pastikan `/[slug]/scanner` diproteksi di middleware: hanya Crew/Owner undangan tersebut.

### Frontend — Halaman Undangan Tamu

- [ ] Deteksi apakah hari ini = `dateWedding` dari `UndanganContent`.
- [ ] Jika hari H dan `isConfirm === 0` dan RSVP bukan "tidak hadir": tampilkan section QR absensi.
- [ ] Generate QR Code dari URL tamu menggunakan `qrcode.react` atau serupa.
- [ ] Setup Supabase Realtime subscription untuk perubahan `tbl_tamu` baris tamu ini.
- [ ] Jika `isConfirm` berubah ke 1: sembunyikan QR, tampilkan konfirmasi sukses dengan nama mempelai dan timestamp hadir.
- [ ] Fallback: jika Realtime tidak tersedia, aktifkan polling 5 detik (hanya hari H, hanya jika belum confirm).

### Frontend — Halaman Scanner Crew

- [ ] Buat halaman `/[slug]/scanner`.
- [ ] Proteksi: redirect ke login jika tidak ada session, redirect ke forbidden jika bukan Crew/Owner.
- [ ] Aktifkan kamera menggunakan library QR scanner browser (misal `@zxing/browser` atau `html5-qrcode`).
- [ ] Setelah QR terbaca: parse URL, ekstrak `tamuId`, call `POST /api/undangan/[slug]/attendance`.
- [ ] Tampilkan info tamu (nama, jumlah diundang, status RSVP).
- [ ] Tampilkan tombol "Konfirmasi Hadir" dan "Batal / Scan Ulang".
- [ ] Setelah konfirmasi: tampilkan success state + tombol "Scan Tamu Berikutnya" yang reset ke kamera.
- [ ] Handle semua edge case (sudah hadir, QR salah, offline) sesuai Section 4.
- [ ] Tampilkan counter "Sudah scan hari ini: X tamu" di bagian bawah.

### Frontend — Dashboard Owner (Menu Tamu)

- [ ] Tambah kolom "Hadir Pukul" di tabel list tamu (dari `attendedAt`).
- [ ] Tambah tombol "QR" per baris tamu → modal preview QR + tombol download PNG.
- [ ] Tambah tombol "Download Semua QR" di atas tabel (hanya muncul jika paket Grand).
- [ ] Rekap dashboard: "Sudah hadir: X dari Y tamu" update real-time.

---

*Dokumen ini dibuat Mei 2026 sebagai spesifikasi fitur absensi QR Code kekawinan.com.*
