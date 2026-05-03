# Fitur Kolaborator Undangan — Kekawinan.com

> Dokumen ini menjelaskan desain fitur invite kolaborator ke dalam undangan, termasuk role system, alur invite, penanganan user terdaftar vs belum terdaftar, dan manajemen kolaborator.

---

## 1. Konsep & Role System

### Konteks Role Keseluruhan

Sistem memiliki dua lapisan role yang terpisah:

**Lapisan 1 — Role Sistem (sudah ada di `tbl_users.level`):**
- `superadmin` — akses penuh ke semua data
- `admin` — kelola konten, tema, kode redeem, creator
- `user` — pengguna biasa

**Lapisan 2 — Role Undangan (baru, per undangan):**
Setiap user yang memiliki akses ke sebuah undangan memiliki salah satu dari tiga role berikut:

| Role | Siapa | Hak Akses |
|---|---|---|
| **Owner** | User yang membuat undangan | Akses penuh: edit, hapus, invite/remove kolaborator, lihat menu Kolaborator |
| **Member** | Diundang oleh Owner | Bisa update konten: isi data mempelai, tambah foto gallery, kelola tamu, kelola kado, kelola amplop digital — **tidak bisa** hapus undangan, ubah tema, ubah permalink, atau akses menu Kolaborator |
| **Crew** | Diundang oleh Owner untuk keperluan venue | Khusus akses scanner absensi QR di hari H — role ini disiapkan sekarang, fitur scanner aktif di fase berikutnya |

### Batasan Aksi per Role

| Aksi | Owner | Member | Crew |
|---|---|---|---|
| Lihat detail undangan | ✅ | ✅ | ✅ |
| Edit konten (nama, tanggal, lokasi, dll) | ✅ | ✅ | ❌ |
| Tambah / hapus foto gallery | ✅ | ✅ | ❌ |
| Kelola tamu undangan | ✅ | ✅ | ❌ |
| Kelola kado & amplop digital | ✅ | ✅ | ❌ |
| Hapus undangan | ✅ | ❌ | ❌ |
| Ubah tema / permalink | ✅ | ❌ | ❌ |
| Lihat & kelola menu Kolaborator | ✅ | ❌ | ❌ |
| Scan absensi QR (venue) | ✅ | ❌ | ✅ |

---

## 2. Alur Invite Kolaborator

### Flow Lengkap

```
Owner buka menu Kolaborator di detail undangan
        ↓
Owner input email + pilih role (default: Member)
        ↓
Sistem cek: apakah email sudah terdaftar di tbl_users?
        ↓
   ┌─── [Sudah terdaftar] ──────────────────────────────────────────┐
   │    Insert tbl_undangan_collaborators                           │
   │    (userId diisi, status: ACTIVE)                              │
   │    Kirim email notifikasi:                                     │
   │    "Kamu ditambahkan sebagai Member di undangan Adhika & Hilwa │
   │     Login untuk melihat undangan: [link login]"               │
   └────────────────────────────────────────────────────────────────┘
        ↓
   ┌─── [Belum terdaftar] ──────────────────────────────────────────┐
   │    Insert tbl_undangan_collaborators                           │
   │    (userId null, status: PENDING)                              │
   │    Kirim email notifikasi:                                     │
   │    "Kamu diundang sebagai Member di undangan Adhika & Hilwa.   │
   │     Daftar akun untuk melihat undangan: [link register]"      │
   └────────────────────────────────────────────────────────────────┘
        ↓
Setelah user login / register:
- Jika register: saat akun berhasil dibuat, sistem cek tbl_undangan_collaborators
  berdasarkan email → update userId, ubah status ke ACTIVE
- Undangan yang di-invite langsung muncul di list undangan user
```

### Catatan Penting

- Tidak ada mekanisme **terima / tolak** — invite langsung aktif. Email hanya sebagai pemberitahuan.
- Jika email belum terdaftar dan user **tidak pernah daftar**, record di `tbl_undangan_collaborators` tetap tersimpan dengan status PENDING. Admin bisa lihat ini di menu Kolaborator.
- Owner tidak bisa menginvite dirinya sendiri.
- Satu email hanya bisa punya satu role per undangan. Jika diinvite lagi dengan role berbeda → update role yang sudah ada.

---

## 3. Database

### Tabel Baru: `tbl_undangan_collaborators`

```prisma
model UndanganCollaborator {
  id          String    @id @db.VarChar(64)
  undanganId  String    @db.VarChar(64)
  userId      String?   @db.VarChar(255)   // null jika belum terdaftar
  email       String    @db.VarChar(255)   // email yang diundang
  role        String    @db.VarChar(20)    // "MEMBER" | "CREW"
  status      String    @default("PENDING") @db.VarChar(20)
                                           // PENDING: belum punya akun / belum login
                                           // ACTIVE: sudah terdaftar & bisa akses
  invitedBy   String    @db.VarChar(255)   // userId Owner yang mengundang
  joinedAt    DateTime?                    // waktu pertama kali user login & akses undangan ini
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  undangan    Undangan  @relation(fields: [undanganId], references: [id], onDelete: Cascade)
  user        User?     @relation("CollaboratorUser", fields: [userId], references: [id], onDelete: SetNull)
  inviter     User      @relation("CollaboratorInviter", fields: [invitedBy], references: [id])

  @@unique([undanganId, email])            // 1 email hanya bisa 1 role per undangan
  @@map("tbl_undangan_collaborators")
}
```

### Catatan Schema

- **Owner tidak perlu masuk ke tabel ini** — owner sudah teridentifikasi dari `tbl_undangan.userId`. Saat query "siapa saja yang punya akses ke undangan ini", gabungkan `tbl_undangan.userId` (role OWNER) dengan `tbl_undangan_collaborators` (role MEMBER/CREW).
- `userId` nullable karena ada kasus invite ke email yang belum terdaftar.
- `onDelete: Cascade` dari Undangan — jika undangan dihapus, semua kolaborator ikut terhapus.
- `onDelete: SetNull` dari User — jika user dihapus, kolom `userId` di-set null (record kolaborator tetap ada sebagai histori).

### Modifikasi Tabel yang Ada

- **`tbl_users`** — tambah relasi ke `collaboratorInvites` dan `collaboratorInvited`.
- **`tbl_undangan`** — tambah relasi ke `collaborators`.

### Trigger saat Register (Logic di API)

Saat user berhasil membuat akun baru, jalankan:

```typescript
// Cek apakah ada invite pending untuk email ini
const pendingInvites = await prisma.undanganCollaborator.findMany({
  where: { email: newUser.email, status: 'PENDING' }
})

// Update semua invite pending ke ACTIVE
if (pendingInvites.length > 0) {
  await prisma.undanganCollaborator.updateMany({
    where: { email: newUser.email, status: 'PENDING' },
    data: { userId: newUser.id, status: 'ACTIVE', joinedAt: new Date() }
  })
}
```

---

## 4. API Endpoints

### Kolaborator

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| `GET` | `/api/undangan/:id/collaborators` | Owner | List semua kolaborator undangan ini |
| `POST` | `/api/undangan/:id/collaborators` | Owner | Invite kolaborator baru |
| `PATCH` | `/api/undangan/:id/collaborators/:collabId` | Owner | Ubah role kolaborator |
| `DELETE` | `/api/undangan/:id/collaborators/:collabId` | Owner | Hapus / kick kolaborator |

### Proteksi Akses Undangan

Setiap endpoint yang berkaitan dengan undangan perlu diupdate untuk mengecek akses:

```typescript
// lib/undangan-access.ts
export async function getUndanganAccess(undanganId: string, userId: string) {
  // Cek apakah owner
  const undangan = await prisma.undangan.findUnique({
    where: { id: undanganId }
  })
  if (undangan?.userId === userId) return { role: 'OWNER', undangan }

  // Cek apakah kolaborator aktif
  const collab = await prisma.undanganCollaborator.findFirst({
    where: { undanganId, userId, status: 'ACTIVE' }
  })
  if (collab) return { role: collab.role, undangan }

  return null  // tidak punya akses
}
```

Gunakan helper ini di setiap API route yang berkaitan dengan undangan:

```typescript
// Contoh di route update content
const access = await getUndanganAccess(params.id, session.user.id)
if (!access) return forbidden()
if (access.role === 'CREW') return forbidden()  // crew tidak bisa edit content
```

### Detail Request & Response

**POST `/api/undangan/:id/collaborators`**

Request body:
```json
{
  "email": "friend@email.com",
  "role": "MEMBER"
}
```

Logic:
1. Validasi role hanya MEMBER atau CREW.
2. Cek caller adalah Owner undangan.
3. Cek email bukan email Owner sendiri.
4. Cek apakah sudah ada di kolaborator (`tbl_undangan_collaborators` by `undanganId + email`) — jika ada, update role.
5. Cek apakah email ada di `tbl_users`.
6. Insert ke `tbl_undangan_collaborators`.
7. Kirim email via Brevo sesuai kondisi (terdaftar / belum).

Response:
```json
{
  "id": "abc123",
  "email": "friend@email.com",
  "role": "MEMBER",
  "status": "ACTIVE",
  "isRegistered": true
}
```

---

## 5. Email Notifikasi

### Template: User Sudah Terdaftar

```
Subjek: Kamu ditambahkan ke undangan [Nama Mempelai]

Halo [Nama / email],

[Nama Owner] menambahkan kamu sebagai [Member / Crew] di undangan pernikahan
[Nama Mempelai Pria] & [Nama Mempelai Wanita].

Kamu bisa langsung masuk dan mulai membantu:
[Tombol: Lihat Undangan] → link ke /dashboard

Jika kamu tidak mengenal pengirim ini, abaikan email ini.

— Tim Kekawinan.com
```

### Template: User Belum Terdaftar

```
Subjek: Kamu diundang untuk membantu undangan pernikahan

Halo,

[Nama Owner] mengundang kamu sebagai [Member / Crew] untuk membantu
undangan pernikahan [Nama Mempelai Pria] & [Nama Mempelai Wanita]
di Kekawinan.com.

Daftar akun gratis untuk mulai:
[Tombol: Daftar Sekarang] → link ke /register

Setelah daftar, undangan tersebut akan otomatis muncul di dashboard kamu.

— Tim Kekawinan.com
```

---

## 6. Frontend

### Menu Kolaborator di Detail Undangan

Menu "Kolaborator" hanya tampil di sidebar / tab navigasi detail undangan jika user yang login adalah **Owner** undangan tersebut.

**Tampilan halaman Kolaborator:**

```
Kolaborator Undangan
Kelola siapa saja yang bisa membantu undangan ini.

[+ Invite Kolaborator]

┌────────────────┬────────────┬────────┬──────────┬──────────────┐
│ Email          │ Nama       │ Role   │ Status   │ Aksi         │
├────────────────┼────────────┼────────┼──────────┼──────────────┤
│ rina@mail.com  │ Rina       │ Member │ Aktif    │ [Ubah] [Hapus]│
│ dimas@mail.com │ Dimas      │ Crew   │ Aktif    │ [Ubah] [Hapus]│
│ budi@mail.com  │ —          │ Member │ Pending  │ [Resend] [Hapus]│
└────────────────┴────────────┴────────┴──────────┴──────────────┘

ⓘ Status "Pending" berarti email belum memiliki akun Kekawinan.com.
  Mereka akan otomatis mendapat akses setelah mendaftar.
```

**Form Invite Kolaborator (modal):**

```
Invite Kolaborator

Email
[________________________]

Role
[Member ▼]   ← default Member, pilihan: Member | Crew

  ⓘ Member: bisa isi dan update data undangan
    Crew: khusus untuk scan absensi di hari H

[Batal]  [Kirim Undangan]
```

### List Undangan User (Dashboard Utama)

Setelah user login dan punya akses ke undangan via kolaborator, undangan tersebut muncul di list dengan badge yang membedakannya dari undangan milik sendiri:

```
Undangan Saya

┌─────────────────────────────────────┐
│ Adhika & Hilwa                      │
│ 📅 15 Juni 2026                     │
│ 🏷 Owner                            │   ← milik sendiri
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Budi & Sari                         │
│ 📅 20 Juli 2026                     │
│ 🏷 Member  •  Diundang oleh Budi    │   ← kolaborasi
└─────────────────────────────────────┘
```

### Pembatasan UI untuk Member

Saat Member membuka detail undangan, beberapa elemen di-hide atau di-disable:

- Tab / menu **"Kolaborator"** tidak tampil sama sekali.
- Tombol **"Hapus Undangan"** tidak tampil.
- Field **permalink** dan **tema** dalam mode read-only, tidak bisa diubah.
- Semua aksi lain (isi konten, foto, tamu, kado, amplop) tetap bisa dilakukan.

---

## 7. Checklist Implementasi

### Database

- [ ] Buat tabel `tbl_undangan_collaborators` sesuai schema di Section 3.
- [ ] Tambah relasi di model `Undangan` dan `User` di Prisma schema.
- [ ] Tambah logic cek invite pending di endpoint `POST /api/auth/register` — setelah user berhasil dibuat, cari dan update invite pending berdasarkan email.

### Backend

- [ ] Buat helper `getUndanganAccess(undanganId, userId)` di `lib/undangan-access.ts`.
- [ ] Update semua API route undangan yang ada untuk menggunakan helper ini (ganti pengecekan `undangan.userId === session.user.id` yang mungkin tersebar).
- [ ] `GET /api/undangan/:id/collaborators` — list kolaborator + info nama user jika sudah terdaftar.
- [ ] `POST /api/undangan/:id/collaborators` — invite dengan logic lengkap (cek owner, cek duplikat, cek registrasi, kirim email).
- [ ] `PATCH /api/undangan/:id/collaborators/:collabId` — ubah role. Validasi hanya Owner.
- [ ] `DELETE /api/undangan/:id/collaborators/:collabId` — hapus kolaborator. Validasi hanya Owner.
- [ ] `POST /api/undangan/:id/collaborators/:collabId/resend` — kirim ulang email invite untuk status PENDING.
- [ ] Update `GET /api/undangan` (list undangan user) — sertakan undangan di mana user adalah kolaborator ACTIVE.
- [ ] Buat dua template email Brevo: "terdaftar" dan "belum terdaftar" (Section 5).

### Frontend

- [ ] Update query list undangan di dashboard — gabungkan undangan milik sendiri + undangan dari kolaborator.
- [ ] Tampilkan badge role ("Owner" / "Member" / "Crew") dan info "Diundang oleh [nama]" di card undangan kolaborasi.
- [ ] Buat halaman / tab "Kolaborator" di detail undangan — hanya render jika role === OWNER.
- [ ] Buat komponen tabel kolaborator dengan kolom: email, nama (jika ada), role, status, aksi.
- [ ] Buat modal form invite: input email + dropdown role (default Member).
- [ ] Dropdown role menampilkan deskripsi singkat tiap role.
- [ ] Tombol "Resend Email" untuk kolaborator status PENDING.
- [ ] Konfirmasi dialog sebelum hapus kolaborator.
- [ ] Sembunyikan / disable elemen UI yang tidak boleh diakses Member (lihat Section 6).
- [ ] Buat hook `useUndanganRole(undanganId)` — return role user di undangan ini, dipakai komponen untuk kondisional render.

---

## 8. Pertimbangan Edge Case

| Skenario | Penanganan |
|---|---|
| Owner menghapus undangan | `onDelete: Cascade` — semua record kolaborator ikut terhapus |
| Kolaborator menghapus akunnya | `onDelete: SetNull` — `userId` jadi null, status otomatis kembali PENDING |
| Owner mengundang email yang sama dua kali | Sistem update role yang sudah ada, tidak duplikat (constraint `unique [undanganId, email]`) |
| Member mencoba akses API yang dibatasi | Middleware `getUndanganAccess` return 403 |
| Crew mencoba edit konten | Return 403, crew hanya boleh akses scanner |
| User yang diinvite daftar dengan email berbeda | Invite tidak terhubung otomatis — harus diundang ulang dengan email yang benar |
| Owner dipindah (transfer ownership) | Belum direncanakan di fase ini — Owner selalu `tbl_undangan.userId` |

---

*Dokumen ini dibuat Mei 2026 sebagai spesifikasi fitur kolaborator undangan kekawinan.com.*
