"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandCharacter } from "../home/brand-visual";
import brand from "../home/home-brand.module.css";
import styles from "./faq.module.css";

type FaqCategory = { category: string; items: { q: string; a: string }[] };

export default function FaqPageContent({ faqs }: { faqs: FaqCategory[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const term = search.trim().toLocaleLowerCase("id");
  const filtered = faqs.filter(cat => activeCategory === null || cat.category === activeCategory)
    .map(cat => ({ ...cat, items: cat.items.filter(item => `${item.q} ${item.a}`.toLocaleLowerCase("id").includes(term)) }))
    .filter(cat => cat.items.length > 0);
  const count = filtered.reduce((total, cat) => total + cat.items.length, 0);

  return <main className={styles.page}>
    <header className={`${brand.section} ${styles.header}`}>
      <div className={brand.container}>
        <div className={styles.hero}>
          <div className={brand.copy}>
            <h1>Mau tanya apa?<br /><em>Kita mulai dari sini.</em></h1>
            <p>Cari jawaban tentang membuat undangan, mengelola tamu, sampai menyiapkan daftar kado.</p>
            <div className={styles.search}>
              <label htmlFor="faq-search">Cari pertanyaan atau topik</label>
              <div className={styles.searchField}><input id="faq-search" type="search" placeholder="Misalnya: musik, RSVP, masa aktif" value={search} onChange={event => setSearch(event.target.value)} aria-controls="faq-results" />{search && <button type="button" onClick={() => setSearch("")}>Hapus</button>}</div>
            </div>
          </div>
          <div className={styles.heroArt} aria-hidden="true"><div className={styles.backdrop} /><BrandCharacter character="host" className={styles.host} /><BrandCharacter character="courier" className={styles.courier} /></div>
        </div>
      </div>
    </header>
    <section className={`${brand.section} ${styles.content}`} aria-label="Pertanyaan dan jawaban">
      <div className={`${brand.container} ${styles.layout}`}>
        <nav className={styles.categories} aria-label="Kategori pertanyaan">
          <h2>Pilih topik</h2>
          <div className={styles.categoryButtons}>
            {[null, ...faqs.map(cat => cat.category)].map(category => <button type="button" key={category ?? "all"} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category ?? "Semua pertanyaan"}</button>)}
          </div>
        </nav>
        <div id="faq-results" className={styles.results}>
          <p className={styles.resultCount} role="status">{count} pertanyaan{activeCategory ? ` · ${activeCategory}` : ""}</p>
          {filtered.length ? filtered.map(cat => <section key={cat.category} className={styles.group} aria-label={cat.category}>
            <h2>{cat.category}</h2>
            <div className={brand.faqList}>{cat.items.map(item => <details key={item.q}>
              <summary>{item.q}<span className={brand.faqToggle} aria-hidden="true" /></summary><p>{item.a}</p>
            </details>)}</div>
          </section>) : <div className={styles.empty}>
            <h2>Belum ketemu jawabannya.</h2><p>Coba kata yang lebih singkat, atau tampilkan lagi semua topik.</p><button type="button" className={brand.primary} onClick={() => { setSearch(""); setActiveCategory(null); }}>Tampilkan semua pertanyaan</button>
          </div>}
        </div>
      </div>
    </section>
    <section className={`${brand.section} ${styles.closing}`}>
      <div className={`${brand.container} ${styles.closingInner}`}>
        <BrandCharacter character="gift" className={styles.closingCharacter} />
        <div className={brand.copy}><h2>Sudah lebih jelas?<br /><em>Yuk, mulai undangannya.</em></h2><p>Temukan tema yang kalian suka, lalu isi dengan cerita dan detail hari bahagia kalian.</p><div className={brand.actions}><Link href="/tema" className={brand.primary}>Lihat pilihan tema</Link><Link href="/auth/register" className={brand.secondary}>Buat akun gratis</Link></div></div>
      </div>
    </section>
  </main>;
}
