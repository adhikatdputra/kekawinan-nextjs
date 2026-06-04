import type { Metadata } from "next";
import FaqPageContent from "@/components/pages/faq/faq-page-content";

export const metadata: Metadata = {
  title: "FAQ — Pertanyaan Seputar Undangan Digital | Kekawinan",
  description:
    "Temukan jawaban lengkap seputar Kekawinan — cara buat undangan, fitur, harga, RSVP, kado digital, dan lainnya. Panduan lengkap untuk pasangan Indonesia.",
  alternates: {
    canonical: "https://www.kekawinan.com/faq",
  },
  openGraph: {
    title: "FAQ — Pertanyaan Seputar Undangan Digital | Kekawinan",
    description:
      "Jawaban lengkap seputar membuat undangan pernikahan digital gratis di Kekawinan.",
    url: "https://www.kekawinan.com/faq",
  },
};

const allFaqs = [
  {
    category: "Umum & Harga",
    items: [
      {
        q: "Apakah Kekawinan benar-benar gratis?",
        a: "Ya, 100% gratis selamanya. Semua fitur inti — buat undangan, pilih tema, kelola tamu, terima RSVP, kirim via WhatsApp — tersedia tanpa biaya. Tidak ada kartu kredit, tidak ada biaya tersembunyi.",
      },
      {
        q: "Apakah ada versi berbayar atau premium?",
        a: "Saat ini semua fitur Kekawinan tersedia gratis. Kami berkomitmen menjaga undangan digital tetap terjangkau untuk semua pasangan Indonesia.",
      },
      {
        q: "Apakah ada iklan di halaman undangan tamu?",
        a: "Tidak ada iklan yang mengganggu di halaman undangan. Tamu kamu akan mendapatkan pengalaman membuka undangan yang bersih dan nyaman.",
      },
      {
        q: "Berapa lama undangan saya bisa diakses?",
        a: "Undangan akan tetap aktif dan bisa diakses selama kamu memiliki akun Kekawinan. Tidak ada batas waktu atau tanggal kedaluwarsa.",
      },
    ],
  },
  {
    category: "Membuat & Mengedit Undangan",
    items: [
      {
        q: "Bagaimana cara membuat undangan di Kekawinan?",
        a: "Daftar akun gratis → pilih tema undangan → isi informasi mempelai dan acara → tambahkan foto & musik → salin link undangan → kirim ke tamu. Prosesnya hanya butuh beberapa menit.",
      },
      {
        q: "Apakah saya perlu keahlian desain atau coding?",
        a: "Tidak perlu. Semua bisa dilakukan melalui dashboard yang mudah digunakan — cukup isi form, unggah foto, dan pilih musik. Tidak ada coding sama sekali.",
      },
      {
        q: "Berapa banyak tema undangan yang tersedia?",
        a: "Tersedia 16+ tema undangan eksklusif yang bisa dicoba gratis — dari modern minimalis, romantic floral, classic elegant, dark romance, hingga terracotta earthy. Tim kami terus menambahkan tema baru.",
      },
      {
        q: "Apakah saya bisa mengubah isi undangan setelah dikirim ke tamu?",
        a: "Bisa! Semua konten — nama, tanggal, venue, foto, musik — bisa diubah kapan saja. Perubahan langsung tampil real-time, tamu yang membuka ulang link akan melihat versi terbaru.",
      },
      {
        q: "Apakah bisa menambahkan foto pre-wedding?",
        a: "Bisa. Kamu bisa unggah foto galeri pre-wedding langsung dari dashboard. Foto akan tampil di halaman galeri undangan digital kamu.",
      },
      {
        q: "Bisakah saya menambahkan musik ke undangan?",
        a: "Bisa. Kamu bisa menambahkan playlist musik favorit sebagai latar undangan. Tamu akan mendengar musik saat membuka halaman undangan, menciptakan pengalaman yang lebih personal.",
      },
      {
        q: "Apakah bisa menambahkan cerita perjalanan cinta (Love Story)?",
        a: "Bisa. Fitur Love Story memungkinkan kamu menceritakan perjalanan cinta dengan teks dan foto di halaman khusus dalam undangan.",
      },
      {
        q: "Bisakah saya membuat lebih dari satu undangan?",
        a: "Bisa. Satu akun bisa membuat beberapa undangan — berguna jika kamu membuat undangan untuk saudara atau sebagai Wedding Organizer.",
      },
    ],
  },
  {
    category: "Tamu & RSVP",
    items: [
      {
        q: "Bagaimana cara menambahkan daftar tamu?",
        a: "Kamu bisa menambahkan tamu satu per satu atau impor massal via spreadsheet. Setiap tamu mendapat link undangan personal dengan namanya tercantum.",
      },
      {
        q: "Berapa banyak tamu yang bisa ditambahkan?",
        a: "Tidak ada batasan jumlah tamu. Kamu bisa menambahkan ratusan hingga ribuan tamu sekaligus.",
      },
      {
        q: "Bagaimana sistem RSVP bekerja?",
        a: "Tamu mengklik link undangan personal mereka, lalu mengisi form konfirmasi kehadiran langsung di halaman undangan. Konfirmasi masuk ke dashboard-mu secara real-time — kamu bisa pantau jumlah yang hadir, tidak hadir, dan belum konfirmasi.",
      },
      {
        q: "Apakah tamu bisa meninggalkan ucapan?",
        a: "Bisa. Ada kolom ucapan di halaman undangan. Semua ucapan masuk ke dashboard dan bisa dibaca kapan saja.",
      },
      {
        q: "Bagaimana cara mengirim undangan ke tamu via WhatsApp?",
        a: "Dari dashboard, kamu bisa menyalin link undangan personal setiap tamu dan mengirimnya via WhatsApp. Tersedia juga fitur kirim massal untuk semua tamu sekaligus.",
      },
      {
        q: "Apakah ada fitur absensi di hari H?",
        a: "Ada. Fitur QR Code Scanner memungkinkan tamu absen kehadiran di hari pernikahan cukup dengan scan QR Code unik mereka — cepat, akurat, dan tanpa antre.",
      },
    ],
  },
  {
    category: "Kado & Amplop Digital",
    items: [
      {
        q: "Apakah ada fitur kado atau amplop digital?",
        a: "Ada. Kamu bisa menampilkan rekening bank, e-wallet (GoPay, OVO, Dana, ShopeePay, dll.), dan daftar wishlist di halaman undangan. Tamu bisa memilih cara memberikan kado langsung dari undangan.",
      },
      {
        q: "Apakah kado digital aman?",
        a: "Transfer dana tetap dilakukan langsung dari tamu ke rekeningmu — Kekawinan tidak memproses atau memegang uang apapun. Kamu hanya menampilkan informasi rekening/e-wallet milikmu sendiri.",
      },
      {
        q: "Apakah bisa menambahkan wishlist hadiah fisik?",
        a: "Bisa. Selain rekening, kamu bisa menambahkan daftar wishlist berupa produk atau barang yang diinginkan, lengkap dengan link pembeliannya jika perlu.",
      },
    ],
  },
  {
    category: "Teknis & Tampilan",
    items: [
      {
        q: "Apakah undangan bisa dibuka di semua perangkat?",
        a: "Ya, semua undangan Kekawinan responsif dan dioptimalkan untuk HP, tablet, dan laptop. Tampilan otomatis menyesuaikan ukuran layar tamu.",
      },
      {
        q: "Apakah ada aplikasi Kekawinan yang bisa diunduh?",
        a: "Saat ini Kekawinan tersedia sebagai web app yang bisa diakses langsung dari browser tanpa perlu mengunduh aplikasi. Kamu bisa menambahkannya ke Home Screen HP untuk akses lebih cepat.",
      },
      {
        q: "Seberapa cepat loading halaman undangan?",
        a: "Halaman undangan Kekawinan dioptimalkan untuk loading cepat, bahkan di koneksi internet yang lambat sekalipun — penting agar tamu tidak menunggu saat membuka undangan.",
      },
      {
        q: "Apakah link undangan bisa dikustomisasi?",
        a: "Ya, kamu bisa mengatur permalink (slug) undanganmu sendiri — misalnya kekawinan.com/nama-pasangan. Permalink bersifat unik dan tidak bisa digunakan dua kali.",
      },
    ],
  },
  {
    category: "Akun & Kolaborasi",
    items: [
      {
        q: "Bagaimana cara daftar akun Kekawinan?",
        a: "Kunjungi kekawinan.com, klik 'Daftar Gratis', isi nama, email, dan password. Proses pendaftaran hanya butuh kurang dari 1 menit.",
      },
      {
        q: "Bisakah orang lain ikut mengelola undangan saya?",
        a: "Bisa. Fitur Kolaborator memungkinkan kamu mengundang anggota keluarga, pasangan, atau Wedding Organizer untuk ikut mengelola undangan — kelola tamu, RSVP, dan konten bersama dengan akses yang bisa kamu atur.",
      },
      {
        q: "Apa itu fitur Kolaborator?",
        a: "Kolaborator adalah fitur yang memungkinkan beberapa orang mengelola satu undangan bersama. Ada dua peran: Member (akses penuh) dan Crew (akses terbatas). Berguna untuk pasangan yang ingin berbagi tugas, atau WO yang mengelola undangan klien.",
      },
      {
        q: "Apakah data saya aman?",
        a: "Data kamu disimpan dengan aman di server kami. Kami tidak membagikan data pribadi atau informasi tamu kepada pihak ketiga.",
      },
    ],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allFaqs.flatMap((cat) =>
    cat.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    }))
  ),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqPageContent faqs={allFaqs} />
    </>
  );
}
