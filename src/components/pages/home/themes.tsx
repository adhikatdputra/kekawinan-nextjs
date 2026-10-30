import Link from "next/link";
import type { PublicTheme } from "@/lib/queries/themes-public";
import { BrandCharacter } from "./brand-visual";
import ThemeGrid from "./theme-grid";
import styles from "./home-brand.module.css";

export default function Themes({ themes }: { themes: PublicTheme[] }) {
  return <section id="themes" className={`${styles.section} ${styles.themesSection}`}>
    <div className={styles.container}>
      <div className={styles.catalogHeader}>
        <div className={styles.copy}><h2>Cari yang terasa<br /><em>“kita banget”.</em></h2><p>Tenang dan klasik, penuh bunga, atau ceria? Buka demo untuk merasakan tampilannya sebelum memilih.</p><Link href="/tema" className={styles.secondary}>Jelajahi semua tema</Link></div>
        <BrandCharacter character="host" className={styles.catalogCharacter} />
      </div>
      {themes.length ? <ThemeGrid themes={themes} /> : <p className={styles.catalogEmpty}>Tema belum tersedia. Silakan cek kembali nanti.</p>}
      <div className={styles.catalogAction}><Link href="/auth/login" className={styles.primary}>Buat undangan gratis</Link></div>
    </div>
  </section>;
}
