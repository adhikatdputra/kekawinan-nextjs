# Aturan

Tidak perlu menjalankan pnpm build, pnpm run dev dan claude-in-chrome kalau tidak disuruh

# Hemat egress

Repo ini pernah menembus kuota egress free plan Supabase (5,79 GB) padahal
database cuma 68 MB dengan 23 user. Penyebabnya jumlah request x ukuran tiap
response, bukan besarnya data.

**Baca `docs/EGRESS-GUIDELINES.md` sebelum menulis atau mengubah kode yang
mengambil data.** Yang paling sering dilanggar:

- Setiap query daftar wajib punya batas baris. Data yang bertambah seiring waktu
  (riwayat, log) wajib paginasi di server.
- Sebut kolom secara eksplisit dengan `select`; jangan `include` polos.
- Filter, pencarian, pengurutan, dan agregasi dikerjakan database — bukan browser.
- Jangan menambah panggilan auth, polling, atau refetch yang ikut jalan di setiap
  request maupun setiap navigasi.

Pola yang sudah tersedia di repo ini, pakai ini alih-alih bikin sendiri:

**Autentikasi (API route)**
- `requireAuth(request)` di `src/lib/jwt.ts`: verifikasi JWT secara lokal dari
  header `Authorization`, tanpa panggilan jaringan. Kembalikan langsung kalau
  hasilnya `NextResponse`. Cek admin dengan `isAdminLevel(auth.level)`.
- Akses ke satu undangan (owner/kolaborator) lewat `getUndanganAccess` dan
  `isActiveCollaborator` di `src/lib/undangan-access.ts`.

**Daftar dan paginasi**
- `parsePagination(searchParams, allowedSortFields)` di `src/lib/helpers.ts`:
  `limit` dibatasi maksimal 200, `sortBy` hanya dari whitelist. Pasangkan dengan
  `paginate(rows, count, page, limit)` supaya format response seragam.
- Ambil baris dan total dalam satu `prisma.$transaction([findMany, count])`,
  contohnya di `src/app/api/admin/theme/route.ts`.

**Response API**
- `ok`, `created`, `badRequest`, `unauthorized`, `forbidden`, `notFound`,
  `conflict`, `serverError` dari `src/lib/api-response.ts`.

**Data publik di Server Component (cache server)**
- Bungkus query dengan `unstable_cache` + tag, lalu purge tag-nya saat data
  diubah. Contoh yang sudah jalan:
  - Undangan publik: `getPublicUndanganBySlug` di
    `src/lib/queries/undangan-public.ts`, dipurge lewat
    `revalidateUndanganByPermalink` / `revalidateUndanganById` di
    `src/lib/queries/revalidate-undangan.ts`. Setiap mutasi yang mengubah apa
    yang dilihat tamu wajib memanggil salah satunya.
  - Daftar tema publik: `getPublicThemes` di `src/lib/queries/themes-public.ts`,
    dipurge lewat `revalidateTheme` di `src/lib/queries/revalidate-theme.ts`.
- `fetchUndanganBySlug` di `src/lib/fetch-undangan.ts` dibungkus `React.cache`,
  jadi `generateMetadata` dan page memakai satu hasil yang sama per request.
  Jangan memanggil API sendiri lewat HTTP dari server.
- Ingat: `unstable_cache` menyimpan JSON, jadi `Date` kembali sebagai string.
  Ubah ke ISO string di dalam query.

**Cache di client**
- Default TanStack Query ada di satu tempat, `src/lib/tanstack.tsx`
  (`staleTime` 60 detik, refetch saat fokus dan reconnect mati). Jangan
  menimpanya per hook tanpa alasan.
- Data yang sudah di-prefetch di server lalu di-hydrate (halaman undangan) pakai
  `staleTime: Infinity`, lihat `undangan-view.tsx`.
- Setelah mutasi, panggil `refetch()` / invalidate query terkait, seperti di
  halaman admin.

**Input pencarian**
- Pakai `debounce` dari lodash sebelum memicu request, contohnya di
  `src/app/(admin-cms)/admin/theme/page.tsx`.

**Media**
- `resolveMediaUrl(path)` di `src/lib/helpers.ts` untuk mengubah path tersimpan
  menjadi URL Cloudinary penuh.