import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/frontend/constants/meta";
import Image from "next/image";
import Link from "next/link";
import { BrandCharacter } from "@/components/pages/home/brand-visual";
import brand from "@/components/pages/home/home-brand.module.css";
import styles from "./tema.module.css";
import { getPublicThemes } from "@/lib/queries/themes-public";

export const metadata: Metadata = {
  title: "Tema Undangan Pernikahan Digital | Kekawinan",
  description:
    "Daftar semua tema undangan pernikahan digital di Kekawinan, lengkap dengan warna, ornamen, dan demo yang bisa kamu buka langsung.",
  alternates: {
    canonical: "https://www.kekawinan.com/tema",
  },
  openGraph: {
    title: "Tema Undangan Pernikahan Digital | Kekawinan",
    description:
      "Daftar semua tema undangan pernikahan digital di Kekawinan, lengkap dengan demo yang bisa kamu buka langsung.",
    url: "https://www.kekawinan.com/tema",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function TemaPage() {
  const themes = await getPublicThemes();

  return (
    <main className={`${brand.section} ${styles.page}`}>
      <header className={`${brand.container} ${styles.header}`}>
        <div className={styles.intro}>
          <div className={brand.copy}>
            <h1>Tema undangan<br /><em>yang terasa seperti kalian.</em></h1>
            <p>Ada {themes.length} tema untuk hari bahagia kalian. Pilih suasananya, buka demonya, lalu bayangkan cerita dan foto kalian di dalamnya.</p>
            <a href="#katalog-tema" className={brand.primary}>Jelajahi tema</a>
          </div>
          <div className={styles.characters} aria-hidden="true">
            <div className={styles.characterBackdrop} />
            <BrandCharacter character="host" className={styles.host} />
            <BrandCharacter character="courier" className={styles.courier} />
          </div>
        </div>
      </header>
      <section id="katalog-tema" aria-labelledby="katalog-heading" className={`${brand.container} ${styles.catalog}`}>
        <div className={styles.catalogHeading}><h2 id="katalog-heading">Temukan favorit kalian</h2><p>Buka demo untuk mencoba tampilannya sebagai tamu.</p></div>
        {themes.length === 0 ? <p className={brand.catalogEmpty}>Tema belum tersedia. Silakan cek kembali nanti.</p> :
          <ul className={brand.themeGrid}>
            {themes.map(theme => <li key={theme.id}>
              <Link href={`/${theme.slug}/demo`} className={brand.themeLink}>
                <div className={brand.themePreview}><Image src={theme.thumbnail ?? "/images/imgplace.png"} alt={`Tampilan tema undangan ${theme.name ?? theme.componentName}`} width={300} height={450} sizes="(max-width: 560px) 42vw, (max-width: 900px) 29vw, 220px" /></div>
                <div className={brand.themeCaption}>
                  <div className={styles.nameRow}><h3>{theme.name ?? theme.componentName}</h3>{theme.isFree && <span className={styles.free}>Gratis</span>}</div>
                  {theme.metaDescription && <p className={styles.description}>{theme.metaDescription.replace(/\s*Lihat demonya.*$/, "")}</p>}
                  <span>Lihat demo <span aria-hidden="true">↗</span></span>
                </div>
              </Link>
            </li>)}
          </ul>}
      </section>
      <section className={`${brand.container} ${styles.bottom}`}>
        <BrandCharacter character="gift" className={styles.gift} />
        <div className={brand.copy}><h2>Sudah ketemu<br /><em>yang kalian suka?</em></h2><p>Mulai buat undangan dan isi dengan cerita kalian sendiri.</p><Link href="/auth/login" className={brand.primary}>Buat undangan gratis</Link></div>
      </section>
    </main>
  );
}
