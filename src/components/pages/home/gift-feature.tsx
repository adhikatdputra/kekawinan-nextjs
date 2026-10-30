import Link from "next/link";
import BrandVisual from "./brand-visual";
import styles from "./home-brand.module.css";

export default function GiftFeature() {
  return <section className={`${styles.section} ${styles.giftSection}`}>
    <div className={`${styles.container} ${styles.split}`}>
      <BrandVisual kind="gift" />
      <div className={styles.copy}>
        <p className={styles.kicker}>Titip bahagia lewat hadiah</p>
        <h2>Kado yang kalian<br /><em>tunggu-tunggu.</em></h2>
        <p>Beri tamu ide hadiah lewat daftar kado di undangan. Mereka bisa memilih dari wishlist yang sudah kalian siapkan.</p>
        <ul className={styles.benefits}><li>Susun wishlist untuk rumah dan kehidupan baru kalian.</li><li>Tambahkan rekening, e-wallet, atau alamat pengiriman.</li><li>Tamu bisa mengonfirmasi hadiah yang dipilih.</li></ul>
        <Link className={styles.primary} href="/auth/login">Buat undangan dengan daftar kado</Link>
      </div>
    </div>
  </section>;
}
