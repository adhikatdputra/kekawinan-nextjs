import Link from "next/link";
import BrandVisual, { BrandCharacter } from "../home/brand-visual";
import brand from "../home/home-brand.module.css";
import styles from "./about.module.css";

const values = [
  { title: "Terbuka untuk semua pasangan", text: "Undangan digital gratis, supaya kalian bisa fokus menyiapkan hari bahagia bersama orang-orang terdekat." },
  { title: "Bisa diatur sendiri", text: "Pilih tema, isi detail acara, dan perbarui cerita kalian lewat dashboard. Tidak perlu menulis kode." },
  { title: "Ruang untuk gaya kalian", text: "Dari warna dan foto sampai musik pengiring, setiap pasangan punya cara sendiri untuk menyampaikan kabar bahagia." },
  { title: "Tumbuh lewat masukan", text: "Kami terus mengembangkan tema dan fitur dengan mendengarkan pengalaman pasangan yang menggunakan Kekawinan." },
];

export default function AboutPageContent() {
  return <main className={styles.page}>
    <section className={`${brand.section} ${styles.hero}`}>
      <div className={brand.container}>
        <div className={brand.split}>
          <div className={brand.copy}>
            <p className={brand.kicker}>Tentang Kekawinan</p>
            <h1>Kabar bahagia,<br /><em>dibagikan dengan senang hati.</em></h1>
            <p>Kami membantu pasangan Indonesia membuat undangan pernikahan digital yang personal dan mudah dibagikan. Gratis, supaya lebih banyak orang bisa ikut merayakan.</p>
            <Link href="/tema" className={brand.secondary}>Kenali pilihan tema kami</Link>
          </div>
          <div className={styles.family} aria-hidden="true">
            <div className={styles.familyBackdrop} />
            <BrandCharacter character="host" className={styles.host} />
            <BrandCharacter character="courier" className={styles.courier} />
            <BrandCharacter character="gift" className={styles.gift} />
          </div>
        </div>
      </div>
    </section>
    <section className={`${brand.section} ${styles.story}`}>
      <div className={`${brand.container} ${styles.storyLayout}`}>
        <div className={brand.copy}><p className={brand.kicker}>Cerita kami</p><h2>Menyiapkan pernikahan<br /><em>sudah banyak urusannya.</em></h2></div>
        <div className={styles.prose}>
          <p>Ada tanggal yang harus disepakati, tempat yang perlu disiapkan, dan orang-orang yang ingin kalian ajak hadir. Kami ingin bagian mengundang terasa lebih ringan.</p>
          <p>Sejak 2022, kami membangun Kekawinan sebagai tempat membuat undangan pernikahan digital gratis. Kalian bisa memilih tampilan, memasukkan detail acara, dan membagikan undangan lewat satu link.</p>
          <p>Bagi kami, undangan juga tempat bercerita. Foto, musik, dan perjalanan kalian memberi alasan bagi setiap tamu untuk ikut tersenyum sebelum hari pernikahan tiba.</p>
        </div>
      </div>
    </section>
    <section className={`${brand.section} ${styles.values}`}>
      <div className={brand.container}>
        <div className={brand.copy}><h2>Yang kami jaga<br /><em>dalam setiap langkah.</em></h2></div>
        <div className={styles.valueList}>{values.map(value => <article key={value.title}><h3>{value.title}</h3><p>{value.text}</p></article>)}</div>
      </div>
    </section>
    <section className={`${brand.section} ${styles.productSection}`}>
      <div className={`${brand.container} ${brand.split}`}>
        <BrandVisual kind="dashboard" />
        <div className={brand.copy}>
          <h2>Dari menulis nama,<br /><em>sampai menyambut tamu.</em></h2>
          <p>Kekawinan menemani persiapan undangan kalian dalam satu tempat.</p>
          <ul className={brand.benefits}>
            <li>Undangan yang menyesuaikan layar HP, tablet, dan laptop.</li>
            <li>Daftar tamu, konfirmasi kehadiran, dan QR untuk absensi.</li>
            <li>Wishlist kado, rekening, dan e-wallet di halaman undangan.</li>
            <li>Link personal untuk dibagikan melalui WhatsApp.</li>
          </ul>
          <Link href="/auth/register" className={brand.primary}>Mulai buat undangan</Link>
        </div>
      </div>
    </section>
    <section className={`${brand.section} ${styles.closing}`}>
      <div className={`${brand.container} ${styles.closingInner}`}>
        <BrandCharacter character="host" className={styles.closingCharacter} />
        <div className={brand.copy}><h2>Kami siapkan tempatnya.<br /><em>Kalian isi ceritanya.</em></h2><p>Lihat tema yang tersedia dan temukan tampilan untuk hari bahagia kalian.</p><div className={brand.actions}><Link href="/tema" className={brand.primary}>Cari tema undangan</Link><Link href="/faq" className={brand.secondary}>Masih ada pertanyaan?</Link></div></div>
      </div>
    </section>
  </main>;
}
