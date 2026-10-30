import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { BrandCharacter } from "../home/brand-visual";
import styles from "./auth-shell.module.css";

const messages = {
  login: ["Senang ketemu lagi.", "Cerita kalian masih berlanjut.", "Masuk untuk melanjutkan undangan dan menyiapkan hari bahagia kalian."],
  register: ["Mulai dari sini.", "Sebarkan kabar bahagia kalian.", "Buat akun gratis, pilih tema, dan isi undangan dengan cerita kalian sendiri."],
  forgot: ["Tenang, kita bantu.", "Kembali ke cerita kalian.", "Minta link untuk mengatur ulang password melalui email yang terdaftar."],
  reset: ["Siap melanjutkan?", "Buat awal yang baru.", "Atur password baru untuk kembali mengelola undangan kalian."],
};

export default function AuthShell({ children, variant }: { children: ReactNode; variant: keyof typeof messages }) {
  const [intro, title, description] = messages[variant];
  return <main className={styles.page}>
    <aside className={`${styles.aside} ${variant === "register" ? styles.pink : variant === "forgot" || variant === "reset" ? styles.blue : ""}`}>
      <Link href="/" className={styles.logo}><Image src="/images/kekawinan-logo.png" alt="Kekawinan — beranda" width={220} height={60} priority /></Link>
      <div className={styles.story}><p>{intro}</p><h2>{title}</h2><p>{description}</p>
        <div className={styles.art} aria-hidden="true"><div className={styles.backdrop} /><BrandCharacter character="host" className={styles.host} /><BrandCharacter character={variant === "register" ? "gift" : "courier"} className={styles.companion} /></div>
      </div>
      <p className={styles.asideFoot}>Undangan digital untuk orang-orang yang berarti.</p>
    </aside>
    <section className={styles.panel} aria-label="Akses akun Kekawinan">
      <Link href="/" className={styles.mobileLogo}><Image src="/images/kekawinan-logo.png" alt="Kekawinan — beranda" width={180} height={50} priority /></Link>
      <BrandCharacter character={variant === "register" ? "gift" : "host"} className={styles.mobileCharacter} />
      <div className={styles.formContent}>{children}</div>
      <Link href="/" className={styles.back}>Kembali ke beranda</Link>
    </section>
  </main>;
}
