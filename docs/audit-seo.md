# Audit SEO — kekawinan.com

**Tanggal audit:** 30 Oktober 2026
**Metode:** Cek HTML mentah yang diterima Googlebot (curl dengan UA Googlebot), header HTTP, robots.txt, sitemap.xml, dan structured data.
**Catatan:** Data Google Search Console belum dicek. Status indexing per halaman perlu dikonfirmasi di GSC → *Pages*.

---

## Ringkasan

Homepage secara teknis sudah cukup oke (title, meta description, canonical, OG, robots, dan JSON-LD lengkap). Yang bermasalah adalah **halaman tema/undangan**: halaman ini adalah mayoritas isi sitemap, tapi di mata Google kontennya kosong dan tidak ada link internal yang mengarah ke sana. Selain itu, otoritas domain masih rendah untuk keyword "undangan digital" yang persaingannya ketat.

| # | Temuan | Prioritas |
|---|--------|-----------|
| 1 | Halaman demo tema dirender di client, HTML server hampir kosong | 🔴 Kritis |
| 2 | Halaman tema yatim (tidak ada link internal) | 🔴 Tinggi |
| 3 | Slug undangan yang tidak ada → soft 404 | 🟠 Sedang |
| 4 | Structured data tidak valid / berisiko | 🟠 Sedang |
| 5 | Jawaban FAQ tidak ada di HTML | 🟡 Sedang |
| 6 | Halaman legal, sitemap, redirect | 🟢 Rendah |
| 7 | Otoritas domain & strategi keyword | 🔴 Tinggi (non-teknis) |

---

## Yang sudah benar ✅

- `robots.txt`: `Allow: /`, hanya memblokir `/user/`, `/admin/`, dan `/auth/`. Sitemap sudah dideklarasikan.
- Homepage: `index, follow`, canonical `https://www.kekawinan.com/`, ada satu H1, OG/Twitter tag lengkap, dan konten di-render server (SSR).
- `/about` dan `/faq`: punya title/OG unik, canonical benar, dan masing-masing satu H1.
- Redirect ke `https://www.` memakai 308 (permanen).
- FAQ punya schema `FAQPage` (29 Q&A).

---

## 1. Halaman demo tema kosong di mata Google — 🔴 Kritis

**Temuan**
- Sitemap berisi 18 URL. 15 di antaranya adalah `/themeN/demo` (theme1–theme16).
- HTML server untuk `/theme1/demo` cuma sekitar **7 kata** (diambil dari `<title>`). Tidak ada H1 dan tidak ada teks konten. Seluruh isi baru muncul setelah JS dijalankan.
- Header `cache-control: private, no-store` dan `x-vercel-cache: MISS` menunjukkan halaman dirender dinamis, tidak di-cache.

**Dampak**
Google melihat 15 halaman tipis yang isinya hampir identik. Status yang biasanya muncul: *Crawled – currently not indexed* atau *Duplicate without user-selected canonical*.

**Fix**
Render konten demo di server/statis, dan tambahkan teks unik untuk setiap tema.

```tsx
// app/[theme]/demo/page.tsx
export async function generateStaticParams() {
  return THEMES.map((t) => ({ theme: t.slug })) // theme1..theme16
}

export default async function Page({ params }: { params: Promise<{ theme: string }> }) {
  const theme = getTheme((await params).theme)
  if (!theme) notFound()

  return (
    <>
      <h1>Template Undangan Pernikahan {theme.name}</h1>
      <p>{theme.longDescription}</p> {/* 100–200 kata unik per tema */}
      <ThemePreview data={DEMO_DATA} />  {/* hindari fetch di useEffect */}
    </>
  )
}
```

Kalau preview harus tetap client component, minimal H1, deskripsi, dan daftar fitur tema tetap dirender di server.

---

## 2. Halaman tema yatim (orphan) — 🔴 Tinggi

**Temuan**
- Section tema di homepage hanya nge-link ke anchor `#themes`.
- Homepage, `/about`, dan `/faq` sama sekali tidak punya `<a href="/themeN/demo">`. Link internal yang ada cuma `/`, `/about`, `/faq`, `/auth/login`, dan `/auth/register`.
- Contoh permalink `kekawinan.com/arga-nabila` hanya ditulis sebagai teks biasa, bukan link.

**Dampak**
Google hanya bisa menemukan halaman tema lewat sitemap, padahal sinyal sitemap itu lemah. Tidak ada link equity yang mengalir dari homepage.

**Fix**
- Jadikan setiap kartu tema di homepage link `<a href="/themeN/demo">`.
- Buat halaman hub `/tema` yang berisi daftar semua tema (nama, thumbnail, deskripsi singkat), lalu link ke halaman itu dari navbar dan footer.
- Opsional: ganti slug `/theme1/demo` jadi slug deskriptif, misalnya `/tema/romantic-floral`, dengan 301 dari URL lama.

---

## 3. Slug undangan yang tidak ada → soft 404 — 🟠 Sedang

**Temuan**

```
GET /slug-ngasal        → 307 → /slug-ngasal/demo
GET /slug-ngasal/demo   → 200, <meta name="robots" content="noindex, nofollow">,
                          canonical → https://www.kekawinan.com/
                          H1: "Waduh, undanganmu nggak ada!"
```

**Dampak**
Google menganggapnya *Soft 404*. Redirect 307 (sementara) juga membuat Google terus mengecek ulang URL tersebut.

**Fix**

```tsx
const invitation = await getInvitation(slug)
if (!invitation) notFound() // balas status 404, tampilkan app/not-found.tsx
```

---

## 4. Structured data — 🟠 Sedang

**Temuan (homepage)**
- `WebSite.potentialAction.SearchAction` punya target `https://www.kekawinan.com/auth/register` tanpa placeholder `{search_term_string}`. Ini tidak valid, dan situsnya memang tidak punya fitur search.
- `SoftwareApplication.AggregateRating`: `ratingValue: 5`, `ratingCount: 600`.

**Fix**
- Hapus `SearchAction`.
- Pastikan `AggregateRating` berasal dari rating asli dan ikut ditampilkan di halaman. Kalau tidak bisa dibuktikan, hapus saja, karena rating yang dikarang berisiko kena manual action.
- Tambahkan `BreadcrumbList` di halaman tema. Untuk halaman tema, schema `CreativeWork`/`Product` juga bisa dipertimbangkan.
- Validasi lewat [Rich Results Test](https://search.google.com/test/rich-results).

---

## 5. Jawaban FAQ tidak ada di HTML — 🟡 Sedang

**Temuan**
`/faq` punya 29 Q&A di JSON-LD, tapi HTML yang terlihat mayoritas cuma berisi pertanyaan (total sekitar 393 kata). Jawabannya hanya muncul saat accordion dibuka, karena dirender lewat JS. FAQ di homepage juga sama.

**Fix**
Render jawaban langsung di DOM. Jawaban boleh tetap tersembunyi secara visual, tapi teksnya harus ada:

```tsx
<details>
  <summary>{q.question}</summary>
  <p>{q.answer}</p>
</details>
```

> Catatan: Google sudah tidak menampilkan rich result FAQ untuk situs umum (sejak 2023). Tujuan perbaikan ini adalah supaya kontennya ikut terindeks.

---

## 6. Perbaikan kecil — 🟢 Rendah

- **Halaman legal:** link "Kebijakan Privasi" dan "Syarat & Ketentuan" (juga "Panduan") mengarah ke `/`. Buat halaman `/privacy` dan `/terms` beneran, karena ini sinyal kepercayaan (E-E-A-T).
- **Sitemap:**
  - `/about` belum ada di sitemap.
  - Semua `lastmod` sama persis (`2026-09-11T15:45:07.978Z`). Pakai tanggal update yang sebenarnya.
  - Tambahkan `/tema` (setelah dibuat), `/privacy`, dan `/terms`.
- **Redirect chain:** `http://kekawinan.com` → `https://kekawinan.com` → `https://www.kekawinan.com` makan 2 hop. Jadikan 1 hop lewat Redirect Rule di Cloudflare.
- **robots.txt:** baris `Host:` tidak standar dan diabaikan Google. Aman, tapi boleh dihapus.
- **Marquee berulang** di homepage: teks fitur yang diulang-ulang menambah noise. Pertimbangkan `aria-hidden` untuk duplikatnya.

---

## 7. Otoritas domain & strategi keyword — 🔴 Tinggi (non-teknis)

**Temuan**
Pencarian "kekawinan undangan digital" di mesin pencari (bukan Google) tidak memunculkan kekawinan.com sama sekali. Keyword "undangan digital" dan "undangan pernikahan digital" sudah dikuasai portal besar (IDN Times, Orami, Wolipop) dan banyak kompetitor.

**Rekomendasi**
1. **Google Search Console:** verifikasi domain (DNS TXT di Cloudflare), submit `sitemap.xml`, cek laporan *Pages*, lalu *Request indexing* untuk homepage dan halaman tema setelah fix #1–#2.
2. **Mulai dari long-tail:** satu halaman tema = satu keyword, misalnya:
   - "template undangan pernikahan floral gratis"
   - "undangan digital adat sunda / jawa"
   - "undangan nikah digital minimalis"
3. **Konten blog** (`/blog`): panduan seperti "cara membuat undangan digital gratis", "contoh kata-kata undangan pernikahan", dan "etika menyebar undangan via WhatsApp". Setiap artikel link ke halaman tema yang relevan.
4. **Backlink:**
   - Tambahkan footer "Dibuat dengan Kekawinan" yang link ke homepage di setiap undangan user.
   - Pitch ke listicle "aplikasi undangan digital gratis" yang rutin dibuat media.
   - Daftar ke direktori vendor pernikahan (Bridestory, Weddingku, dsb.).

---

## Catatan soal halaman undangan user

Halaman undangan pasangan (`kekawinan.com/nama-nama`) **memang tidak perlu ranking** di Google. Halaman ini memuat nama, tanggal, dan alamat acara, jadi sebaiknya diberi `noindex` demi privasi. Yang perlu dioptimasi untuk ranking adalah homepage, halaman tema, dan konten blog.

---

## Checklist eksekusi

- [ ] SSR/SSG halaman `/themeN/demo` + H1 + deskripsi unik per tema
- [ ] Link kartu tema di homepage ke halaman demo
- [ ] Buat halaman hub `/tema`
- [ ] `notFound()` untuk slug undangan yang tidak ada (status 404)
- [ ] Hapus `SearchAction`, validasi `AggregateRating`
- [ ] Render jawaban FAQ di HTML
- [ ] Buat `/privacy` dan `/terms`, perbaiki link footer
- [ ] Update sitemap (tambah `/about`, `lastmod` dinamis)
- [ ] Redirect 1 hop di Cloudflare
- [ ] Verifikasi GSC, submit sitemap, request indexing
- [ ] Rencana konten blog & backlink