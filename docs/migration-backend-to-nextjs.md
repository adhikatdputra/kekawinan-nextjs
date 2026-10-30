# Migrasi Backend ke Next.js — Kekawinan.com

> Dokumen ini adalah panduan teknis migrasi dari arsitektur Node.js Express (backend terpisah) + Next.js (frontend) ke **Next.js full-stack**, dengan migrasi database dari MySQL ke **Supabase (PostgreSQL)** menggunakan **Prisma** sebagai ORM. Media storage tetap **Cloudinary**, SMTP menggunakan **Brevo**.

---

## Stack Perbandingan

| Komponen | Sebelum | Sesudah |
|---|---|---|
| Backend | Node.js + Express (repo/server terpisah) | Next.js API Routes (satu repo) |
| Frontend | Next.js | Next.js (tetap) |
| ORM | TypeORM | Prisma |
| Database | MySQL | Supabase (PostgreSQL) |
| Media Storage | Cloudinary | Cloudinary (tetap) |
| SMTP | _(sebelumnya)_ | Brevo |
| Deployment | Dua server terpisah | Satu deployment (misal Vercel) |

---

## Urutan Migrasi

Migrasi dilakukan bertahap agar tidak ada downtime besar. Urutan yang disarankan:

1. Setup project Next.js full-stack
2. Setup Supabase + Prisma + migrasi schema
3. Migrasi data dari MySQL ke Supabase
4. Port API Routes dari Express ke Next.js
5. Setup auth & session
6. Setup Cloudinary di Next.js
7. Setup SMTP Brevo
8. Update environment variables
9. Testing & cutover

---

## Langkah 1 — Setup Project Next.js Full-Stack

Jika frontend Next.js sudah ada, backend akan digabung ke repo yang sama. Tidak perlu membuat project baru dari scratch.

### Struktur folder yang disarankan

```
/
├── app/
│   ├── (dashboard)/         # halaman dashboard pengantin
│   ├── (public)/            # halaman undangan publik
│   ├── admin/               # halaman admin
│   └── api/                 # semua API Routes
│       ├── auth/
│       ├── invitation/
│       ├── guest/
│       ├── rsvp/
│       ├── wish/
│       ├── gift/
│       └── admin/
├── lib/
│   ├── prisma.ts            # Prisma client singleton
│   ├── cloudinary.ts        # Cloudinary config
│   ├── brevo.ts             # Brevo SMTP config
│   └── auth.ts              # helper session/auth
├── middleware.ts             # proteksi route global
├── prisma/
│   └── schema.prisma        # schema database
└── .env.local
```

### Install dependencies tambahan

```bash
npm install prisma @prisma/client
npm install @supabase/supabase-js
npm install nodemailer                  # untuk SMTP Brevo
npm install next-auth                   # untuk session management
npm install cloudinary                  # jika belum ada
npm install -D prisma
```

---

## Langkah 2 — Setup Supabase & Prisma

### 2.1 Buat project di Supabase

1. Buka [supabase.com](https://supabase.com) → New Project.
2. Catat **Database URL** dan **Direct Connection URL** dari Settings → Database.
3. Supabase menyediakan dua connection string:
   - **Transaction pooler** (port 6543) → untuk serverless/Next.js API Routes.
   - **Direct connection** (port 5432) → untuk Prisma migrate & generate.

### 2.2 Init Prisma

```bash
npx prisma init
```

Ini akan membuat folder `prisma/` dengan file `schema.prisma` dan menambahkan `DATABASE_URL` ke `.env`.

### 2.3 Konfigurasi `schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")       // Transaction pooler (port 6543)
  directUrl = env("DIRECT_URL")         // Direct connection (port 5432)
}
```

### 2.4 Isi `.env.local`

```env
# Supabase
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Next Auth
NEXTAUTH_SECRET="isi-dengan-random-string-panjang"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Brevo SMTP
BREVO_SMTP_HOST="smtp-relay.brevo.com"
BREVO_SMTP_PORT=587
BREVO_SMTP_USER="email-akun-brevo@email.com"
BREVO_SMTP_PASS="brevo-smtp-key"
BREVO_FROM_EMAIL="no-reply@kekawinan.com"
BREVO_FROM_NAME="Kekawinan.com"
```

### 2.5 Prisma Client Singleton

Buat file `lib/prisma.ts` agar koneksi tidak duplikat di development (hot reload Next.js):

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## Langkah 3 — Migrasi Schema: MySQL → Prisma (PostgreSQL)

### 3.1 Tulis ulang schema di Prisma

Jangan langsung convert SQL dump — lebih baik tulis ulang schema dari nol di `schema.prisma` berdasarkan model yang sudah ada. Ini kesempatan untuk membersihkan schema yang mungkin sudah tidak rapi.

Contoh konversi tipe data yang umum:

| MySQL | Prisma / PostgreSQL |
|---|---|
| `INT AUTO_INCREMENT` | `Int @id @default(autoincrement())` |
| `VARCHAR(255)` | `String` |
| `TEXT` | `String @db.Text` |
| `TINYINT(1)` | `Boolean` |
| `DATETIME` | `DateTime` |
| `JSON` | `Json` |
| `DECIMAL(10,2)` | `Decimal @db.Decimal(10,2)` |

Contoh model dasar:

```prisma
model User {
  id          Int          @id @default(autoincrement())
  email       String       @unique
  password    String
  role        Role         @default(USER)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  invitations Invitation[]
}

model Invitation {
  id        Int      @id @default(autoincrement())
  userId    Int
  slug      String   @unique
  groomName String
  brideName String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
  guests    Guest[]
}

model Guest {
  id           Int         @id @default(autoincrement())
  invitationId Int
  name         String
  phone        String
  totalInvited Int         @default(1)
  isViewed     Boolean     @default(false)
  rsvp         String?     // "hadir" | "tidak_hadir" | null
  rsvpCount    Int?
  wish         String?     @db.Text
  attendedAt   DateTime?
  createdAt    DateTime    @default(now())
  invitation   Invitation  @relation(fields: [invitationId], references: [id])
}

enum Role {
  USER
  ADMIN
}
```

### 3.2 Jalankan migrasi ke Supabase

```bash
npx prisma migrate dev --name init
```

Perintah ini akan:
- Membuat file migrasi di `prisma/migrations/`
- Menjalankan migrasi ke database Supabase
- Generate Prisma Client

### 3.3 Generate ulang Prisma Client (jika schema berubah)

```bash
npx prisma generate
```

---

## Langkah 4 — Migrasi Data dari MySQL ke Supabase

### Opsi A — Export CSV dari MySQL, Import ke Supabase

1. Export tiap tabel dari MySQL ke CSV via `mysqldump` atau tools seperti TablePlus / DBeaver.
2. Di Supabase dashboard → Table Editor → Import CSV per tabel.
3. Pastikan urutan import mengikuti relasi (parent dulu, baru child).

### Opsi B — Script migrasi (disarankan untuk data besar)

Buat script Node.js yang membaca dari MySQL dan menulis ke Supabase via Prisma:

```typescript
// scripts/migrate-data.ts
import mysql from 'mysql2/promise'
import { prisma } from '../lib/prisma'

async function main() {
  const mysqlConn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kekawinan_db',
  })

  // Contoh migrasi tabel users
  const [users] = await mysqlConn.execute('SELECT * FROM users')
  for (const user of users as any[]) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        role: user.role === 'admin' ? 'ADMIN' : 'USER',
        createdAt: user.created_at,
      },
    })
  }

  // Lanjutkan untuk tabel lainnya...

  await mysqlConn.end()
  console.log('Migrasi selesai.')
}

main().catch(console.error)
```

```bash
npx ts-node scripts/migrate-data.ts
```

---

## Langkah 5 — Port API Routes dari Express ke Next.js

### Pola dasar API Route di Next.js (App Router)

```typescript
// app/api/invitation/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const invitation = await prisma.invitation.findUnique({
    where: { id: parseInt(params.id) },
    include: { guests: true },
  })

  if (!invitation) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(invitation)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const updated = await prisma.invitation.update({
    where: { id: parseInt(params.id) },
    data: body,
  })

  return NextResponse.json(updated)
}
```

### Mapping route Express → Next.js API Route

| Express Route | Next.js API Route |
|---|---|
| `GET /api/invitation/:id` | `app/api/invitation/[id]/route.ts` → `GET` |
| `POST /api/invitation` | `app/api/invitation/route.ts` → `POST` |
| `PUT /api/invitation/:id` | `app/api/invitation/[id]/route.ts` → `PUT` |
| `DELETE /api/invitation/:id` | `app/api/invitation/[id]/route.ts` → `DELETE` |
| `GET /api/guest/:invId` | `app/api/guest/[invId]/route.ts` → `GET` |
| `POST /api/admin/redeem` | `app/api/admin/redeem/route.ts` → `POST` |

### Error handler terpusat

Buat helper untuk response yang konsisten:

```typescript
// lib/api-response.ts
import { NextResponse } from 'next/server'

export const ok = (data: unknown) => NextResponse.json(data, { status: 200 })
export const created = (data: unknown) => NextResponse.json(data, { status: 201 })
export const badRequest = (message: string) => NextResponse.json({ message }, { status: 400 })
export const unauthorized = () => NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
export const forbidden = () => NextResponse.json({ message: 'Forbidden' }, { status: 403 })
export const notFound = (message = 'Not found') => NextResponse.json({ message }, { status: 404 })
export const serverError = (message = 'Internal server error') => NextResponse.json({ message }, { status: 500 })
```

---

## Langkah 6 — Setup Auth & Session (NextAuth)

### 6.1 Konfigurasi NextAuth

```typescript
// lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id: String(user.id),
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
```

### 6.2 API Route untuk NextAuth

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### 6.3 Middleware proteksi route

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const role = req.nextauth.token?.role

    // Proteksi halaman admin — hanya role ADMIN
    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
```

---

## Langkah 7 — Setup Cloudinary

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary
```

Contoh upload di API Route:

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File

  const buffer = Buffer.from(await file.arrayBuffer())
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

  const result = await cloudinary.uploader.upload(base64, {
    folder: 'kekawinan',
  })

  return NextResponse.json({ url: result.secure_url, publicId: result.public_id })
}
```

---

## Langkah 8 — Setup SMTP Brevo

### 8.1 Konfigurasi Nodemailer dengan Brevo

```typescript
// lib/brevo.ts
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT),
  secure: false, // port 587 menggunakan STARTTLS, bukan SSL
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
})

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  return transporter.sendMail({
    from: `"${process.env.BREVO_FROM_NAME}" <${process.env.BREVO_FROM_EMAIL}>`,
    to,
    subject,
    html,
  })
}
```

### 8.2 Contoh penggunaan di API Route

```typescript
import { sendEmail } from '@/lib/brevo'

await sendEmail({
  to: 'user@email.com',
  subject: 'Selamat datang di Kekawinan.com',
  html: `<p>Halo! Akun kamu sudah berhasil dibuat.</p>`,
})
```

---

## Langkah 9 — Checklist Sebelum Cutover

Sebelum mematikan server Express lama, pastikan semua poin berikut sudah terpenuhi:

### Fungsionalitas
- [ ] Semua endpoint Express sudah diport ke Next.js API Routes
- [ ] Response format sama persis dengan Express (agar frontend tidak perlu banyak ubah)
- [ ] Auth dan session berjalan normal untuk user biasa dan admin
- [ ] RSVP, ucapan doa, tamu, amplop digital, kado — semua terkoneksi ke Supabase via Prisma
- [ ] Upload media ke Cloudinary berjalan
- [ ] Email via Brevo terkirim

### Data
- [ ] Semua data dari MySQL sudah berhasil dimigrasikan ke Supabase
- [ ] Tidak ada data yang hilang atau duplikat
- [ ] Relasi antar tabel konsisten
- [ ] Reset sequence / auto-increment ID di PostgreSQL sesuai data yang diimport

### Keamanan
- [ ] Semua environment variable sudah dipindah ke platform deployment baru
- [ ] Tidak ada credential yang ter-hardcode di kode
- [ ] Row Level Security (RLS) di Supabase sudah dikonfigurasi jika diperlukan
- [ ] NEXTAUTH_SECRET menggunakan string random yang kuat

### Testing
- [ ] Uji login user dan admin
- [ ] Uji semua CRUD per fitur
- [ ] Uji upload gambar
- [ ] Uji kirim email
- [ ] Uji tampilan undangan publik dengan URL `/slug/id_tamu`

---

## Catatan Tambahan

**Reset sequence PostgreSQL setelah import data:**
Jika data diimport dengan ID manual, sequence perlu direset agar `autoincrement` tidak bentrok:

```sql
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('invitations_id_seq', (SELECT MAX(id) FROM invitations));
-- ulangi untuk setiap tabel
```

**Prisma Studio** — tools visual untuk cek data langsung:
```bash
npx prisma studio
```

**Jangan hapus server Express lama** sampai semua sudah berjalan stabil di Next.js minimal 1–2 minggu di production.

---

*Dokumen ini dibuat April 2026 untuk migrasi kekawinan.com.*
