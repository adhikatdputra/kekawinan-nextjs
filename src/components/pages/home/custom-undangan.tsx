import Image from "next/image";
import { BrandCharacter } from "./brand-visual";
import { WHATSAPP_CUSTOM_DESIGN_URL } from "@/frontend/constants/contact";
import styles from "./home-brand.module.css";

export default function CustomUndangan() {
  return <section className={`${styles.section} ${styles.customSection}`}>
    <div className={`${styles.container} ${styles.split}`}>
      <div className={styles.copy}><h2>Sudah punya bayangan<br /><em>undangan impian?</em></h2><p>Ceritakan warna, suasana, dan detail yang kalian inginkan. Kita bisa diskusikan desain undangan khusus bersama tim Kekawinan.</p><a className={styles.primary} href={WHATSAPP_CUSTOM_DESIGN_URL} target="_blank" rel="noopener noreferrer">Diskusi desain lewat WhatsApp</a></div>
      <div className={styles.customArt}><Image src="/images/custom-phone.webp" alt="Pilihan tampilan undangan pernikahan Kekawinan" width={429} height={680} sizes="(max-width: 760px) 85vw, 424px" /><BrandCharacter character="host" className={styles.customCharacter} /></div>
    </div>
  </section>;
}
