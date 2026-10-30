import Link from "next/link";
import BrandVisual from "./brand-visual";
import styles from "./home-brand.module.css";

export default function Permalink() {
  return <section className={`${styles.section} ${styles.linkSection}`}>
    <div className={`${styles.container} ${styles.split}`}>
      <div className={styles.copy}>
        <p className={styles.kicker}>Siap dibagikan</p>
        <h2>Satu link.<br /><em>Banyak yang ikut senang.</em></h2>
        <p>Pilih alamat undangan dengan nama kalian. Kelola isi undangan dan tamu dari dashboard, lalu bagikan link-nya melalui WhatsApp.</p>
        <div className={styles.urlExample}><small>Contoh alamat undangan</small><p>kekawinan.com/<strong>nama-kalian</strong></p></div>
        <Link className={styles.secondary} href="/auth/login">Buat link undangan kalian</Link>
      </div>
      <BrandVisual kind="dashboard" />
    </div>
  </section>;
}
