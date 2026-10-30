import type { Metadata } from "next";
import Link from "next/link";
import LegalDocument, {
  type LegalSection,
} from "@/components/pages/legal/legal-document";

const WHATSAPP_URL = "https://wa.me/085772193242";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | Kekawinan",
  description:
    "Aturan pemakaian Kekawinan: akun, isi undangan, credit dan kode redeem, masa aktif undangan, dan batas tanggung jawab kami.",
  alternates: {
    canonical: "https://www.kekawinan.com/syarat-ketentuan",
  },
  openGraph: {
    title: "Syarat & Ketentuan | Kekawinan",
    description:
      "Aturan pemakaian Kekawinan: akun, isi undangan, credit, masa aktif undangan, dan batas tanggung jawab.",
    url: "https://www.kekawinan.com/syarat-ketentuan",
  },
};

const sections: LegalSection[] = [
  {
    id: "akun",
    title: "Akun",
    body: (
      <>
        <p>
          Untuk membuat undangan, kamu perlu akun dengan data yang benar.
          Pemilik akun harus berusia minimal 17 tahun.
        </p>
        <p>
          Jaga password kamu. Semua aktivitas di akun kamu, termasuk yang
          dilakukan kolaborator yang kamu undang, menjadi tanggung jawab kamu
          sebagai pemilik akun.
        </p>
      </>
    ),
  },
  {
    id: "isi-undangan",
    title: "Isi undangan",
    body: (
      <>
        <p>
          Foto, teks, musik, dan data lain yang kamu unggah tetap milik kamu.
          Dengan mengunggahnya, kamu mengizinkan Kekawinan menyimpan dan
          menampilkannya di undangan kamu kepada siapa pun yang membuka link
          undangan tersebut.
        </p>
        <p>Kamu tidak boleh mengunggah konten yang:</p>
        <ul>
          <li>
            melanggar hak cipta orang lain, misalnya foto atau musik yang
            tidak boleh kamu pakai,
          </li>
          <li>memuat pornografi, kekerasan, atau ujaran kebencian,</li>
          <li>
            dipakai untuk menipu, misalnya undangan palsu untuk meminta
            transfer uang,
          </li>
          <li>melanggar hukum yang berlaku di Indonesia.</li>
        </ul>
        <p>
          Kami boleh menonaktifkan undangan atau akun yang melanggar aturan
          ini, dengan atau tanpa pemberitahuan lebih dulu.
        </p>
      </>
    ),
  },
  {
    id: "tema",
    title: "Tema dan desain",
    body: (
      <p>
        Desain tema, kode, dan aset bawaan Kekawinan adalah milik Kekawinan.
        Kamu boleh memakainya untuk undangan kamu sendiri di Kekawinan, tetapi
        tidak boleh menyalin, menjual ulang, atau memakainya di layanan lain.
      </p>
    ),
  },
  {
    id: "credit",
    title: "Credit dan kode redeem",
    body: (
      <>
        <p>
          Sebagian tema bisa dipakai tanpa credit. Tema lain membutuhkan
          credit, sesuai jumlah yang tertera di tema tersebut. Credit
          didapatkan dengan menukarkan kode redeem yang kamu terima setelah
          membeli di toko Shopee kami.
        </p>
        <ul>
          <li>Satu kode hanya bisa ditukarkan satu kali.</li>
          <li>
            Credit terpotong saat undangan dibuat dan tidak kembali walaupun
            undangan itu kemudian dihapus atau masa aktifnya habis.
          </li>
          <li>Credit tidak bisa diuangkan atau dipindahkan ke akun lain.</li>
        </ul>
        <p>
          Pembayaran dan pengembalian dana untuk pembelian di Shopee mengikuti
          aturan Shopee. Kalau kode yang kamu terima tidak bisa ditukarkan,
          hubungi kami lewat{" "}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>{" "}
          dengan bukti pembelian.
        </p>
      </>
    ),
  },
  {
    id: "masa-aktif",
    title: "Masa aktif undangan",
    body: (
      <p>
        Masa aktif standar undangan adalah 3 bulan sejak undangan dibuat, dan
        tanggal berakhirnya tampil di dashboard undangan. Setelah
        masa aktif habis, undangan dinonaktifkan dan link-nya berhenti bisa
        dibuka. Alamat link undangan tersebut juga dilepas dan bisa dipakai
        pengguna lain. Simpan data tamu atau ucapan yang ingin kamu arsipkan
        sebelum masa aktif habis.
      </p>
    ),
  },
  {
    id: "kado",
    title: "Kado dan amplop digital",
    body: (
      <p>
        Kekawinan hanya menampilkan nomor rekening, e-wallet, atau wishlist
        yang kamu masukkan. Transfer terjadi langsung dari tamu ke rekening
        kamu. Kami tidak menerima, menyimpan, atau meneruskan uang, sehingga
        kami tidak bertanggung jawab atas salah transfer atau sengketa
        pembayaran antara kamu dan tamu.
      </p>
    ),
  },
  {
    id: "pemakaian-wajar",
    title: "Pemakaian yang wajar",
    body: (
      <p>
        Jangan mencoba membobol akun orang lain, mengganggu kerja server,
        mengambil data secara otomatis dalam jumlah besar, atau memakai fitur
        kirim WhatsApp untuk spam ke nomor yang bukan tamu kamu.
      </p>
    ),
  },
  {
    id: "ketersediaan",
    title: "Ketersediaan layanan",
    body: (
      <p>
        Kami berusaha menjaga Kekawinan tetap bisa diakses, tetapi tidak
        menjamin layanan selalu bebas gangguan. Fitur dan tema bisa kami
        tambah, ubah, atau hentikan. Kalau ada perubahan yang memengaruhi
        undangan yang sedang aktif, kami akan berusaha memberi tahu lebih
        dulu.
      </p>
    ),
  },
  {
    id: "batas-tanggung-jawab",
    title: "Batas tanggung jawab",
    body: (
      <p>
        Kekawinan disediakan sebagaimana adanya. Sejauh diizinkan hukum, kami
        tidak bertanggung jawab atas kerugian yang timbul dari gangguan
        layanan, kehilangan data, atau isi undangan yang dibuat pengguna.
        Simpan salinan foto dan data penting kamu di tempat lain.
      </p>
    ),
  },
  {
    id: "privasi",
    title: "Privasi",
    body: (
      <p>
        Cara kami mengelola data kamu dan data tamu kamu dijelaskan di{" "}
        <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>.
      </p>
    ),
  },
  {
    id: "perubahan",
    title: "Perubahan ketentuan",
    body: (
      <p>
        Ketentuan ini bisa kami ubah. Tanggal di bagian atas halaman
        menunjukkan versi terbaru. Dengan tetap memakai Kekawinan setelah
        perubahan, kamu dianggap menyetujui ketentuan yang baru.
      </p>
    ),
  },
  {
    id: "hukum",
    title: "Hukum yang berlaku",
    body: (
      <p>
        Ketentuan ini tunduk pada hukum Republik Indonesia. Kalau ada
        perselisihan, kita selesaikan dulu secara musyawarah.
      </p>
    ),
  },
  {
    id: "kontak",
    title: "Kontak",
    body: (
      <p>
        Pertanyaan soal ketentuan ini bisa dikirim lewat{" "}
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          WhatsApp 0857-7219-3242
        </a>
        .
      </p>
    ),
  },
];

export default function SyaratKetentuanPage() {
  return (
    <LegalDocument
      title="Syarat & Ketentuan"
      updatedAt="30 Oktober 2026"
      intro={
        <p>
          Dengan membuat akun atau memakai Kekawinan, kamu setuju dengan aturan
          di bawah ini. Bacalah sebelum membuat undangan pertamamu.
        </p>
      }
      sections={sections}
      related={{ label: "Kebijakan Privasi", href: "/kebijakan-privasi" }}
    />
  );
}
