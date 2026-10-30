import Image from "next/image";
import { BrandCharacter } from "./brand-visual";
import styles from "./home-brand.module.css";

const testimonial = [
  {
    img: "/images/testi/image-1.png",
    name: "Arga & Nabila",
    location: "Jakarta",
    rating: 5,
    msg: "Awalnya cuma coba-coba, ternyata hasilnya mewah banget! Tamu-tamu bilang undangannya modern dan elegan. Prosesnya gampang banget, tinggal klik langsung jadi.",
  },
  {
    img: "/images/testi/image-2.png",
    name: "Fahri & Alya",
    location: "Bandung",
    rating: 5,
    msg: "Design-nya clean, animasinya halus, dan bisa atur semuanya sendiri. Bener-bener ngebantu banget buat kita yang pengen praktis tapi tetap berkelas.",
  },
  {
    img: "/images/testi/image-3.png",
    name: "Rizky & Intan",
    location: "Surabaya",
    rating: 5,
    msg: "Nggak perlu ribet cetak-cetak lagi. Undangan online ini bikin semuanya lebih simple dan tetap terlihat eksklusif. Banyak yang kira ini custom mahal loh!",
  },
  {
    img: "/images/testi/image-4.png",
    name: "Dimas & Shafira",
    location: "Yogyakarta",
    rating: 5,
    msg: "Template-nya estetik, loading-nya cepat, dan bisa share ke mana aja. Kita jadi lebih hemat waktu dan biaya tanpa ngorbanin kualitas sama sekali.",
  },
  {
    img: "/images/testi/image-5.png",
    name: "Rafi & Zahra",
    location: "Semarang",
    rating: 5,
    msg: "Dari awal sampai launch semuanya smooth banget. Undangannya cantik, responsif di HP, dan bikin hari bahagia kita terasa makin spesial.",
  },
];

export default function Testimoni() {
  return <section id="testimoni" className={`${styles.section} ${styles.testimonialSection}`}>
    <div className={styles.container}>
      <div className={styles.testimonialHeader}>
        <div className={styles.copy}><p className={styles.kicker}>Cerita pasangan</p><h2>Undangannya terkirim.<br /><em>Ini cerita mereka.</em></h2></div>
        <div className={styles.testimonialCharacters}>
          <BrandCharacter character="host" className={styles.testimonialCharacterLarge} />
          <BrandCharacter character="gift" className={styles.testimonialCharacterSmall} />
        </div>
      </div>
      {/* Mobile: each card sticks a little lower than the one before, so scrolling
          stacks them like a deck. `!` is needed because the module CSS is unlayered
          and would otherwise win over Tailwind's utilities layer. */}
      <div className={styles.testimonialGrid}>{testimonial.map((item, index) => <figure key={item.name}
        className={`${styles.quote} max-[560px]:sticky! max-[560px]:top-(--stack-top) max-[560px]:shadow-[0_-6px_18px_#183c3014]!`}
        style={{ "--stack-top": `${88 + index * 12}px` } as React.CSSProperties}>
        <span className={styles.quoteMark} aria-hidden="true">“</span>
        <blockquote><p>{item.msg}</p></blockquote>
        <figcaption><Image src={item.img} alt="" width={48} height={48} /><div><strong>{item.name}</strong><span>{item.location}</span></div></figcaption>
      </figure>)}</div>
    </div>
  </section>;
}
