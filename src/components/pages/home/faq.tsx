import Link from "next/link";
import { BrandCharacter } from "./brand-visual";
import styles from "./home-brand.module.css";

const faqs = [
  {
    q: "Apakah Kekawinan benar-benar gratis?",
    a: "Ya, 100% gratis selamanya. Kamu bisa membuat undangan pernikahan digital lengkap — pilih tema, isi konten, kelola tamu, terima RSVP, hingga kirim via WhatsApp — tanpa biaya apapun.",
  },
  {
    q: "Berapa banyak tema undangan yang tersedia?",
    a: "Ada berbagai tema undangan yang bisa dicoba gratis, dari nuansa nude dan rustic garden, warna lembut seperti blush pink dan lavender, sampai tema gelap seperti midnight blue dan emerald gold. Tim kami terus menambahkan tema baru secara rutin.",
  },
  {
    q: "Apakah saya bisa mengubah isi undangan setelah dikirim?",
    a: "Bisa! Semua konten undangan bisa diubah kapan saja melalui dashboard. Perubahan langsung tampil real-time — tamu yang membuka ulang link akan melihat versi terbaru.",
  },
  {
    q: "Bagaimana cara mengelola konfirmasi kehadiran (RSVP)?",
    a: "Setiap tamu yang menerima link undangan bisa mengisi konfirmasi kehadiran langsung di halaman undangan. Semua konfirmasi masuk ke dashboard-mu secara real-time — kamu bisa pantau jumlah tamu hadir, tidak hadir, dan masih menunggu konfirmasi.",
  },
  {
    q: "Apakah undangan bisa dibuka di semua perangkat?",
    a: "Ya, undangan Kekawinan responsif di semua perangkat — HP, tablet, maupun laptop. Tampilannya otomatis menyesuaikan layar tamu.",
  },
  {
    q: "Berapa banyak tamu yang bisa ditambahkan?",
    a: "Tidak ada batasan jumlah tamu. Kamu bisa menambahkan ratusan bahkan ribuan tamu, membuat link undangan personal untuk masing-masing tamu, dan mengirim semuanya sekaligus via WhatsApp.",
  },
  {
    q: "Apakah ada fitur kado digital?",
    a: "Ada! Kamu bisa menambahkan rekening bank, e-wallet (GoPay, OVO, Dana, dll.), dan daftar wishlist ke halaman undangan. Tamu bisa melihat dan memilih cara memberikan kado langsung dari undangan.",
  },
  {
    q: "Bisakah orang lain (keluarga/WO) ikut mengelola undangan?",
    a: "Bisa. Fitur Kolaborator memungkinkan kamu mengundang anggota keluarga atau Wedding Organizer untuk ikut mengelola undangan, tamu, dan RSVP — dengan akses yang bisa kamu atur.",
  },
];

export default function HomeFaq() {
  return <section id="faq" className={`${styles.section} ${styles.faqSection}`}>
    <div className={`${styles.container} ${styles.faqLayout}`}>
      <div className={styles.copy}><h2>Sebelum mulai,<br /><em>mau tanya dulu?</em></h2><p>Ini beberapa hal yang sering ditanyakan tentang undangan Kekawinan.</p><Link href="/faq" className={styles.secondary}>Baca FAQ lengkap</Link><BrandCharacter character="courier" className={styles.faqCharacter} /></div>
      <div className={styles.faqList}>{faqs.map((faq, index) => <details key={faq.q} open={index === 0}>
        <summary>{faq.q}<span className={styles.faqToggle} aria-hidden="true" /></summary><p>{faq.a}</p>
      </details>)}</div>
    </div>
  </section>;
}
