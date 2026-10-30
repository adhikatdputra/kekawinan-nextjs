"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import styles from "./home-brand.module.css";

type Character = "host" | "courier" | "gift";

export function BrandCharacter({ character, className = "" }: { character: Character; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={`${styles.character} ${className}`} aria-hidden="true"
    initial={false} whileInView={reduced ? undefined : { y: [0, -8, 0], rotate: [0, 3, 0] }}
    viewport={{ once: true, amount: .5 }} transition={{ duration: 1.4, ease: "easeInOut" }}>
    <Image src={`/images/brand/${character}.webp`} alt="" width={character === "host" ? 658 : 720} height={character === "host" ? 720 : character === "courier" ? 658 : 666} sizes="(max-width: 760px) 35vw, 240px" />
  </motion.div>;
}

export function WeddingDuoArtwork({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div
    className={className}
    initial={false}
    whileInView={reduced ? undefined : { y: [0, -8, 0], rotate: [0, 0.8, 0] }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
  >
    <Image
      src="/images/theme17/wedding-duo.webp"
      alt="Karakter pengantin Kekawinan merayakan hari bahagia bersama"
      width={840}
      height={560}
      sizes="(max-width: 760px) 85vw, 520px"
      className={styles.product}
    />
  </motion.div>;
}

export default function BrandVisual({ kind }: { kind: "hero" | "gift" | "dashboard" }) {
  const source = { hero: "/images/image-banner.png", gift: "/images/gift-phone.webp", dashboard: "/images/dashboard.png" }[kind];
  const alt = { hero: "Contoh undangan Kekawinan di layar HP", gift: "Daftar kado dan pilihan hadiah di undangan Kekawinan", dashboard: "Dashboard untuk membuat dan mengelola undangan" }[kind];
  return <div className={`${styles.scene} ${styles[kind]}`}>
    <div className={styles.sceneBackdrop} aria-hidden="true" />
    <Image src={source} alt={alt} width={kind === "hero" ? 429 : kind === "gift" ? 963 : 1068} height={kind === "hero" ? 680 : kind === "gift" ? 922 : 1415} sizes="(max-width: 760px) 80vw, 480px" priority={kind === "hero"} className={styles.product} />
    <BrandCharacter character={kind === "hero" ? "host" : kind === "gift" ? "gift" : "courier"} className={styles.sceneCharacter} />
    {kind === "hero" && <BrandCharacter character="courier" className={styles.heroCompanion} />}
  </div>;
}
