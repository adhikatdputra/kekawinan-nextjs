import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { WeddingDuoArtwork } from "./brand-visual";
import brand from "./home-brand.module.css";
import styles from "./features.module.css";

const features = [
  {
    name: "Tema Undangan Eksklusif",
    desc: "Pilih dari template modern, klasik, rustic, hingga floral — selalu hadir tema baru, gratis.",
    img: "/images/features/theme-brand.webp",
  },
  {
    name: "Edit Konten Sesuka Hati",
    desc: "Ubah nama, tanggal, venue, dan foto prewed langsung dari dashboard. Tanpa keahlian desain.",
    img: "/images/features/CUSTOMIZE.jpg",
  },
  {
    name: "Musik Latar Favorit",
    desc: "Tambahkan lagu kesukaan sebagai pengiring undangan — buat tamu merasakan momen spesialmu.",
    img: "/images/features/music-brand.webp",
  },
  {
    name: "Daftar Kado & Hadiah",
    desc: "Tampilkan wishlist, rekening, dan e-wallet — tamu pilih kado langsung dari undanganmu.",
    img: "/images/features/gift-brand.webp",
  },
  {
    name: "Nama Tamu Otomatis",
    desc: "Tiap link undangan menampilkan nama tamu secara personal — buat mereka merasa istimewa.",
    img: "/images/features/guest-brand.webp",
  },
  {
    name: "Kirim via WhatsApp Massal",
    desc: "Siapkan dan bagikan undangan dengan nama tamu melalui WhatsApp.",
    img: "/images/features/whatsapp-brand.webp",
  },
  {
    name: "RSVP & Ucapan Tamu",
    desc: "Konfirmasi kehadiran dan ucapan tamu — terintegrasi langsung di dalam undangan digital.",
    img: "/images/features/rsvp-brand.webp",
  },
  {
    name: "Halaman Love Story",
    desc: "Ceritakan perjalanan cinta kamu dan pasangan dalam halaman eksklusif yang menyentuh hati.",
    img: "/images/features/love-story-brand.webp",
  },
  {
    name: "Dashboard Kehadiran Tamu",
    desc: "Pantau siapa hadir, baca ucapan, dan kelola seluruh tamu dari satu dashboard yang rapi.",
    img: "/images/features/attendance-brand.webp",
  },
  {
    name: "Absen via Scan QR Code",
    desc: "Tamu absen kehadiran cukup dengan scan QR Code unik — cepat, akurat, tanpa antre di meja resepsi.",
    img: "/images/features/qr-checkin-brand.webp",
  },
  {
    name: "Kolaborator — Member & Crew",
    desc: "Undang keluarga atau WO sebagai kolaborator — kelola undangan, tamu, dan RSVP bersama.",
    img: "/images/features/collaborators-brand.webp",
  },
];

export default function Features() {
  const highlights = [features[6], features[9]];
  const supporting = features.filter((_, index) => ![1, 6, 9].includes(index));

  return <section id="fitur" className={`${brand.section} ${styles.section} scroll-mt-[90px]`} aria-labelledby="features-heading">
    <div className={brand.container}>
      <div className={styles.heading}>
        <div className={brand.copy}><h2 id="features-heading">Bukan cuma undangan.<br /><em>Persiapan kalian, satu tempat.</em></h2></div>
        <p>Desain yang bisa kalian atur sendiri, kabar dari tamu yang mudah dipantau, sampai absensi di hari pernikahan.</p>
      </div>
      <article className={styles.editor}>
        <div className={styles.editorVisual}>
          <WeddingDuoArtwork className={styles.dashboard} />
        </div>
        <div className={styles.editorCopy}>
          <p className={`${styles.label} ${styles.editorLabel}`}>Kalian yang pegang kendali</p>
          <h3>Nama, foto, musik.<br /><span>Semuanya tentang kalian.</span></h3>
          <p>Mulai dari tema favorit, lalu isi detail acara dan cerita kalian melalui dashboard. Ingin mengganti foto atau memperbarui jadwal? Tinggal edit undangannya.</p>
          <ul className={styles.editorSteps}>
            <li><span aria-hidden="true">01</span><p>Pilih tema dan lihat tampilannya sebelum dibagikan.</p></li>
            <li><span aria-hidden="true">02</span><p>Isi informasi mempelai, lokasi, dan jadwal acara.</p></li>
            <li><span aria-hidden="true">03</span><p>Tambahkan galeri foto, musik, dan cerita cinta kalian.</p></li>
          </ul>
          <Link href="/auth/login" className={`${brand.primary} ${styles.editorAction}`}>Coba buat undangan <IconArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </article>
      <div className={styles.highlights}>{highlights.map((feature, index) => <article key={feature.name} className={styles.highlight}>
        <div className={styles.highlightImage}><Image src={feature.img} alt={index === 0 ? "Pasangan Indonesia memeriksa konfirmasi kehadiran tamu dari ponsel bersama maskot clover Kekawinan" : "Petugas resepsi memindai QR dari ponsel tamu bersama maskot clover Kekawinan"} width={1200} height={800} sizes="(max-width: 760px) 90vw, 550px" /></div>
        <div className={styles.highlightCopy}><p className={styles.label}>{index === 0 ? "Sebelum hari bahagia" : "Saat hari bahagia tiba"}</p><h3>{index === 0 ? "Tahu siapa yang akan datang." : "Sambut tamu lewat scan QR."}</h3><p>{index === 0 ? "Tamu bisa mengisi konfirmasi kehadiran dan menitipkan ucapan langsung di undangan. Kalian bisa memantaunya dari dashboard." : "Gunakan QR unik tamu untuk mencatat kehadiran di resepsi. Keluarga atau crew bisa membantu melalui akses kolaborator."}</p></div>
      </article>)}</div>
      <div className={styles.supportingHeading}><h3>Detail kecil yang ikut disiapkan.</h3><p>Semua ini juga tersedia untuk melengkapi undangan kalian.</p></div>
      {/* Mobile: a swipeable row instead of a long 2-column grid. The next card
          peeks in from the right so it's clear there is more. `!` beats the
          unlayered module CSS. The row bleeds to the screen edge (-mx-6 px-6). */}
      <div
        className={`${styles.supporting} max-[760px]:-mx-6! max-[760px]:flex! max-[760px]:snap-x max-[760px]:snap-mandatory max-[760px]:gap-4! max-[760px]:overflow-x-auto max-[760px]:scroll-px-6 max-[760px]:px-6 max-[760px]:pb-2 max-[760px]:[scrollbar-width:none] max-[760px]:[&::-webkit-scrollbar]:hidden focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-focus`}
        role="region"
        aria-label="Fitur lainnya, geser untuk melihat semua"
        tabIndex={0}
      >{supporting.map(feature => <article key={feature.name} className="max-[760px]:w-[72%] max-[760px]:shrink-0 max-[760px]:snap-start max-[380px]:w-[82%]">
        <Image src={feature.img} alt="" width={480} height={320} sizes="(max-width: 560px) 42vw, (max-width: 900px) 28vw, 260px" />
        <h4>{feature.name}</h4><p>{feature.desc}</p>
      </article>)}</div>
    </div>
  </section>;
}
