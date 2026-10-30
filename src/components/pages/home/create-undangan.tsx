import Link from "next/link";
import { BrandCharacter } from "./brand-visual";
import styles from "./home-brand.module.css";

const steps = [
  ["Mulai dari akun kalian", "Daftar atau masuk untuk membuat undangan baru."],
  ["Pilih tema, isi ceritanya", "Tambahkan nama, jadwal acara, foto, dan musik pilihan kalian."],
  ["Periksa, lalu terbitkan", "Coba tampilan undangan dan pastikan detail acara sudah benar sebelum dibagikan."],
  ["Kirim ke orang tersayang", "Tambahkan tamu dan bagikan link undangan lewat WhatsApp."],
];

export default function CreateUndangan() {
  return <section className={`${styles.section} ${styles.stepsSection}`}>
    <div className={`${styles.container} ${styles.stepsLayout}`}>
      <div className={styles.copy}><h2>Susun detailnya.<br /><em>Bagikan bahagianya.</em></h2><p>Pilih tema, lengkapi detail acara, lalu bagikan undangan kepada orang-orang tersayang lewat empat langkah sederhana.</p><BrandCharacter character="courier" className={styles.stepsCharacter} /><Link className={styles.primary} href="/auth/login">Mulai buat undangan</Link></div>
      <ol className={styles.steps}>{steps.map(([title, text], index) => <li key={title}><span aria-hidden="true">0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
    </div>
  </section>;
}
