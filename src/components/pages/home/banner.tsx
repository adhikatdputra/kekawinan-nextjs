import Link from "next/link";
import BrandVisual from "./brand-visual";
import styles from "./home-brand.module.css";

export default function Banner() {
  return <section className={`${styles.section} ${styles.heroSection}`}>
    <div className={`${styles.container} ${styles.split}`}>
      <div className={styles.copy}>
        <h1>Hari bahagia kalian.<br /><em>Undang semua yang berarti.</em></h1>
        <p>Buat undangan pernikahan digital gratis yang terasa seperti kalian. Pilih tema, isi cerita, lalu bagikan ke orang-orang tersayang.</p>
        <div className={styles.actions}><Link className={styles.primary} href="/auth/login">Buat undangan gratis</Link><Link className={styles.secondary} href="#themes">Lihat pilihan tema</Link></div>
        <p className={styles.small}>Foto, musik, RSVP, dan daftar kado dalam satu undangan.</p>
      </div>
      <BrandVisual kind="hero" />
    </div>
  </section>;
}
