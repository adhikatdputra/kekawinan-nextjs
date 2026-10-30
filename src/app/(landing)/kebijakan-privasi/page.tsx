import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/frontend/constants/meta";
import LegalDocument, {
  type LegalSection,
} from "@/components/pages/legal/legal-document";

import { WHATSAPP_URL } from "@/frontend/constants/contact";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Kekawinan",
  description:
    "Data apa yang dikumpulkan Kekawinan, untuk apa dipakai, siapa saja yang ikut memprosesnya, dan bagaimana kamu bisa meminta data dihapus.",
  alternates: {
    canonical: "https://www.kekawinan.com/kebijakan-privasi",
  },
  openGraph: {
    title: "Kebijakan Privasi | Kekawinan",
    description:
      "Data apa yang dikumpulkan Kekawinan, untuk apa dipakai, dan bagaimana kamu bisa meminta data dihapus.",
    url: "https://www.kekawinan.com/kebijakan-privasi",
    images: [DEFAULT_OG_IMAGE],
  },
};

const sections: LegalSection[] = [
  {
    id: "data-yang-dikumpulkan",
    title: "Data yang kami kumpulkan",
    body: (
      <>
        <p>
          <strong>Data akun.</strong> Saat mendaftar, kamu mengisi nama
          lengkap, nomor HP, email, dan password. Password kami simpan dalam
          bentuk hash, jadi tim kami pun tidak bisa membacanya.
        </p>
        <p>
          <strong>Isi undangan.</strong> Semua yang kamu masukkan ke undangan:
          nama mempelai, jadwal dan lokasi acara, foto galeri, cerita Love
          Story, musik, serta nomor rekening, e-wallet, atau alamat yang kamu
          tampilkan untuk kado.
        </p>
        <p>
          <strong>Data tamu.</strong> Nama dan nomor HP tamu yang kamu
          tambahkan (satu per satu atau lewat impor spreadsheet), status RSVP,
          ucapan yang tamu tulis, catatan kehadiran dari scan QR Code, serta
          nama dan nomor HP tamu yang memilih kado dari wishlist.
        </p>
        <p>
          <strong>Data kolaborator.</strong> Email orang yang kamu undang untuk
          ikut mengelola undangan, beserta perannya.
        </p>
        <p>
          <strong>Data penggunaan.</strong> Halaman yang dibuka, jenis
          perangkat, dan informasi teknis sejenis yang dicatat Google Analytics
          dan Vercel Analytics. Data ini kami pakai dalam bentuk statistik,
          bukan untuk melacak orang per orang.
        </p>
      </>
    ),
  },
  {
    id: "penggunaan-data",
    title: "Untuk apa data dipakai",
    body: (
      <>
        <p>Kami memakai data di atas hanya untuk menjalankan layanan:</p>
        <ul>
          <li>menampilkan undangan kepada tamu yang membuka link-nya,</li>
          <li>
            mengirim RSVP, ucapan, dan data kehadiran ke dashboard kamu dan
            kolaborator kamu,
          </li>
          <li>
            mengirim email transaksional, yaitu undangan kolaborator dan
            tautan reset password,
          </li>
          <li>mencatat credit dan kode redeem yang kamu tukarkan,</li>
          <li>
            memahami halaman mana yang sering dipakai supaya kami tahu apa yang
            perlu diperbaiki.
          </li>
        </ul>
        <p>
          Kami tidak menjual data kamu atau data tamu kamu, dan tidak
          memakainya untuk iklan.
        </p>
      </>
    ),
  },
  {
    id: "data-publik",
    title: "Apa yang bisa dilihat orang lain",
    body: (
      <>
        <p>
          Undangan dibuat untuk dibagikan. Siapa pun yang memegang link
          undangan bisa melihat isinya, termasuk foto, lokasi acara, dan info
          rekening atau e-wallet yang kamu cantumkan. Ucapan yang ditulis tamu
          juga tampil di halaman undangan.
        </p>
        <p>
          Pertimbangkan hal ini sebelum mengunggah sesuatu. Kalau ada info yang
          tidak ingin tersebar luas, jangan masukkan ke undangan.
        </p>
      </>
    ),
  },
  {
    id: "pihak-ketiga",
    title: "Layanan pihak ketiga",
    body: (
      <>
        <p>
          Kekawinan berjalan di atas beberapa layanan lain. Mereka memproses
          data atas nama kami, sebatas yang dibutuhkan:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> untuk database,
          </li>
          <li>
            <strong>Cloudinary</strong> untuk menyimpan foto dan gambar yang
            kamu unggah,
          </li>
          <li>
            <strong>Vercel</strong> untuk hosting situs dan statistik
            kunjungan,
          </li>
          <li>
            <strong>Google Analytics</strong> untuk statistik kunjungan,
          </li>
          <li>penyedia email (SMTP) untuk mengirim email transaksional.</li>
        </ul>
        <p>
          Server layanan-layanan ini bisa berada di luar Indonesia. Pembelian
          credit terjadi di Shopee, jadi data pembayaran kamu diatur oleh
          kebijakan privasi Shopee, bukan oleh kami. Kekawinan tidak pernah
          menerima nomor kartu atau data pembayaran kamu.
        </p>
        <p>
          Di luar itu, kami hanya membuka data kalau diwajibkan oleh hukum yang
          berlaku di Indonesia.
        </p>
      </>
    ),
  },
  {
    id: "cookie",
    title: "Cookie",
    body: (
      <p>
        Setelah login, kami menyimpan token sesi di cookie browser supaya kamu
        tidak perlu login ulang di setiap halaman. Google Analytics juga
        memasang cookie untuk membedakan kunjungan. Kamu bisa menghapus atau
        memblokir cookie lewat pengaturan browser, tetapi tanpa cookie sesi
        kamu tidak bisa masuk ke dashboard.
      </p>
    ),
  },
  {
    id: "masa-simpan",
    title: "Berapa lama data disimpan",
    body: (
      <>
        <p>
          Setiap undangan punya masa aktif. Setelah lewat, undangan
          dinonaktifkan, link-nya berhenti bisa dibuka, dan alamat link
          tersebut bisa dipakai orang lain.
        </p>
        <p>
          Data akun kamu tetap tersimpan sampai kamu meminta akun dihapus. Saat
          akun dihapus, semua undangan milik akun itu ikut terhapus, termasuk
          data tamu, ucapan, galeri, dan kado di dalamnya.
        </p>
      </>
    ),
  },
  {
    id: "hak-kamu",
    title: "Hak kamu atas data",
    body: (
      <>
        <p>
          Sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data
          Pribadi, kamu berhak:
        </p>
        <ul>
          <li>melihat data pribadi yang kami simpan tentang kamu,</li>
          <li>memperbaiki data yang salah,</li>
          <li>meminta akun dan datanya dihapus,</li>
          <li>menarik persetujuan pemrosesan data.</li>
        </ul>
        <p>
          Sebagian besar data bisa kamu ubah sendiri dari dashboard. Untuk
          penghapusan akun atau permintaan lain, hubungi kami lewat{" "}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>{" "}
          dari nomor atau dengan email yang terdaftar di akun kamu.
        </p>
      </>
    ),
  },
  {
    id: "data-tamu",
    title: "Tanggung jawab atas data tamu",
    body: (
      <p>
        Nama dan nomor HP tamu kamu masukkan sendiri. Pastikan tamu tidak
        keberatan datanya dipakai untuk mengirim undangan. Kalau ada tamu yang
        minta datanya dihapus, kamu bisa menghapusnya langsung dari menu
        daftar tamu.
      </p>
    ),
  },
  {
    id: "keamanan",
    title: "Keamanan",
    body: (
      <p>
        Password disimpan dalam bentuk hash, koneksi ke situs memakai HTTPS,
        dan dashboard hanya bisa dibuka oleh pemilik akun dan kolaborator yang
        diundang. Tidak ada sistem yang kebal dari kebocoran. Kalau kami
        mengetahui ada kebocoran yang menyangkut data kamu, kami akan
        memberitahu kamu.
      </p>
    ),
  },
  {
    id: "anak",
    title: "Pengguna di bawah umur",
    body: (
      <p>
        Kekawinan ditujukan untuk orang dewasa yang menyiapkan pernikahan.
        Kami tidak sengaja mengumpulkan data anak di bawah 17 tahun sebagai
        pemilik akun.
      </p>
    ),
  },
  {
    id: "perubahan",
    title: "Perubahan kebijakan",
    body: (
      <p>
        Kebijakan ini bisa kami ubah ketika layanan berubah. Tanggal di bagian
        atas halaman menunjukkan versi terbaru. Untuk perubahan besar, kami
        akan memberitahu lewat email atau dashboard.
      </p>
    ),
  },
  {
    id: "kontak",
    title: "Kontak",
    body: (
      <p>
        Ada pertanyaan soal data kamu? Kirim pesan ke kami lewat{" "}
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          WhatsApp 0857-7219-3242
        </a>
        .
      </p>
    ),
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <LegalDocument
      title="Kebijakan Privasi"
      updatedAt="30 Oktober 2026"
      intro={
        <p>
          Halaman ini menjelaskan data apa yang dikumpulkan Kekawinan saat kamu
          membuat undangan dan saat tamu membukanya, untuk apa data itu
          dipakai, dan apa yang bisa kamu lakukan atasnya.
        </p>
      }
      sections={sections}
      related={{ label: "Syarat & Ketentuan", href: "/syarat-ketentuan" }}
    />
  );
}
