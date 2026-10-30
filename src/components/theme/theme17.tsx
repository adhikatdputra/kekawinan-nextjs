"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { motion, MotionConfig } from "motion/react";
import type Theme16 from "./theme16";
import { formatDateId } from "@/helper/date";
import { Button } from "../ui/button";
import GaleriCards from "../card/galeri-cards";
import LoveStoryTimeline from "../card/love-story-timeline";
import UcapanConfirm from "../card/ucapan-confirm";
import DialogGift from "../card/dialog-gift";
import { FloatingMusicGift } from "../card/floating-music-gift";
import { FloatingQrButton } from "../card/floating-qr-button";
import styles from "./theme17.module.css";

function Countdown({ date }: { date?: string }) {
  const target = date ? new Date(date).getTime() : NaN;
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!Number.isFinite(target)) return;
    const update = () => {
      const seconds = Math.max(0, Math.floor((target - Date.now()) / 1000));
      setRemaining(seconds);
      return seconds;
    };
    if (update() === 0) return;
    const timer = window.setInterval(() => {
      if (update() === 0) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  if (!Number.isFinite(target)) return null;
  const values = remaining === null ? null : [Math.floor(remaining / 86400), Math.floor(remaining / 3600) % 24, Math.floor(remaining / 60) % 60, remaining % 60];
  return <div className={styles.countdownWrap}>
    <div className={styles.countdown} role="timer" aria-label="Hitung mundur menuju tanggal pernikahan">
      {["Hari", "Jam", "Menit", "Detik"].map((label, index) => <div key={label}><strong>{values ? String(values[index]).padStart(2, "0") : "--"}</strong><span>{label}</span></div>)}
    </div>
    {remaining === 0 && <p>Hari bahagia telah tiba!</p>}
  </div>;
}

function CharacterDecoration({ couple = false }: { couple?: boolean }) {
  return <div className={styles.characterDecoration} aria-hidden="true">
    <span>✦</span>
    <img src={`/images/theme17/${couple ? "wedding-duo" : "love-letter"}.webp`} alt="" loading="lazy" width={couple ? 1536 : 1024} height={couple ? 1024 : 1280} />
    <span>♡</span>
  </div>;
}

export default function Theme17({ undanganData, tamuData, onPlayMusic, isPlayMusic, onSubmitUcapan, isSubmitting, ucapan, giftLength, slug }: ComponentProps<typeof Theme16>) {
  const [opened, setOpened] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const c = undanganData.content;
  const duo = <img src="/images/theme17/wedding-duo.webp" width={1536} height={1024} alt="Pasangan karakter biru dan pink bergandengan tangan" className={styles.duo} />;
  const qr = <FloatingQrButton tamu={tamuData} tamuId={tamuData?.id ?? ""} slug={slug} content={c ?? null} bgColor="bg-blue-700" iconColor="text-white" />;

  return <MotionConfig reducedMotion="user"><main className={styles.theme}>
    {!opened ? <section className={styles.cover}>
      <p className={styles.eyebrow}>UNDANGAN PERNIKAHAN</p>
      <p className={styles.sticker}>A little love. A lot of fun!</p>
      <h1>{c?.title || "Nama Mempelai"}</h1>
      <p>{c?.dateWedding && formatDateId(c.dateWedding)}</p>
      <motion.div initial={{ scale: .9 }} animate={{ scale: 1 }} transition={{ duration: .5 }}>{duo}</motion.div>
      <div className={styles.guest}><p>Teruntuk kamu yang istimewa,</p><strong>{tamuData?.name || "Tamu Spesial"}</strong></div>
      <Button className={styles.button} onClick={() => { setOpened(true); if (!isPlayMusic) onPlayMusic(); }}>Buka undangan ↗</Button>
      {qr}
    </section> : <>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>KAMI AKAN MENIKAH!</p>
        <h1>{c?.title}</h1>
        <p className={styles.date}>{c?.dateWedding && formatDateId(c.dateWedding)}</p>
        {duo}
        <p>Satu hari bahagia.<br />Lebih seru kalau ada kamu.</p>
        <a
          href="#theme17-couple"
          className={styles.down}
          onClick={(e) => {
            // Smooth scroll without adding #theme17-couple to the guest's link
            e.preventDefault();
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            document.getElementById("theme17-couple")?.scrollIntoView({
              behavior: reduceMotion ? "auto" : "smooth",
              block: "start",
            });
          }}
        >
          Kenalan dengan kami ↓
        </a>
      </section>
      <section id="theme17-couple" className={styles.section}>
        <p className={styles.eyebrow}>DUA ORANG, SATU CERITA</p>
        <h2>We’re better together.</h2>
        <p>Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk merayakan pernikahan kami.</p>
        <div className={styles.people}>
          <article className={styles.pink}>
            <div className={styles.portraitGroup}>
              {c?.imgFemale && <img loading="lazy" src={c.imgFemale} alt={c.nameFemale || "Mempelai"} />}
              <img className={styles.coupleMascot} src="/images/theme17/bride.webp" alt="" aria-hidden="true" loading="lazy" width={420} height={420} />
            </div>
            <h3>{c?.nameFemale}</h3><p>Putri {c?.femaleNo} dari<br />Bpk. {c?.fatherFemale}<br />&amp; Ibu {c?.motherFemale}</p>
          </article>
          <span className={styles.amp}>&amp;</span>
          <article className={styles.blue}>
            <div className={styles.portraitGroup}>
              {c?.imgMale && <img loading="lazy" src={c.imgMale} alt={c.nameMale || "Mempelai"} />}
              <img className={styles.coupleMascot} src="/images/theme17/groom.webp" alt="" aria-hidden="true" loading="lazy" width={420} height={420} />
            </div>
            <h3>{c?.nameMale}</h3><p>Putra {c?.maleNo} dari<br />Bpk. {c?.fatherMale}<br />&amp; Ibu {c?.motherMale}</p>
          </article>
        </div>
      </section>
      <section className={`${styles.section} ${styles.yellow}`}>
        <p className={styles.eyebrow}>CATAT TANGGALNYA</p><h2>Let’s celebrate!</h2>
        <p>{c?.dateWedding && formatDateId(c.dateWedding)}</p>
        <Countdown key={c?.dateWedding} date={c?.dateWedding} />
        {[{ title: "Akad Nikah", time: c?.akadTime, place: c?.akadPlace }, { title: "Resepsi", time: c?.resepsiTime, place: c?.resepsiPlace }].map(event => <article className={styles.event} key={event.title}><h3>{event.title}</h3><strong>{event.time}</strong><p className="whitespace-pre-line">{event.place}</p></article>)}
        {c?.gmaps && <a className={styles.link} href={c.gmaps} target="_blank" rel="noopener noreferrer">Buka Google Maps ↗</a>}
        {c?.streamLink && <a className={styles.link} href={c.streamLink} target="_blank" rel="noopener noreferrer">Tonton live streaming ↗</a>}
        <CharacterDecoration couple />
      </section>
      <LoveStoryTimeline loveStories={undanganData.loveStories ?? []} sectionTitle="Cerita kecil kami" accentColor="bg-yellow-300" />
      {!!undanganData.gallery?.length && <section className={styles.section}><p className={styles.eyebrow}>MOMEN FAVORIT</p><h2>Us, being us.</h2><GaleriCards galeri={undanganData.gallery} accentColor="#2459ce" /></section>}
      <section className={styles.rsvp}>
        <img src="/images/theme17/love-letter.webp" width={1024} height={1280} loading="lazy" alt="Karakter hijau membawa surat cinta" />
        <h2>Kamu datang, kan?</h2><p>Kabari kami dan titipkan doa terbaikmu.</p>
      </section>
      <UcapanConfirm tamu={tamuData} isLoading={isSubmitting} onSubmit={({ data }) => onSubmitUcapan(data)} bgColor="bg-[#e5f3ea]" fontHeading="font-recoleta-alt" bgButton="bg-blue-700" colorButton="text-white" colorHeading="text-slate-900" labelColor="text-slate-900" />
      <section className={styles.section}><CharacterDecoration /><h2>Love notes.</h2>
        {!ucapan?.length && <p>Jadilah yang pertama mengirimkan doa untuk kami.</p>}
        {ucapan?.map((item, index) => <article key={index} className={styles.note}><strong>{item.name}</strong><p className="whitespace-pre-line">{item.message}</p></article>)}
      </section>
      <footer className={styles.footer}><CharacterDecoration couple /><h2>See you on<br />our happy day!</h2><p>{c?.title}</p><a href="https://kekawinan.com"><img src="/images/kekawinan-logo.png" alt="Kekawinan" width={140} height={40} loading="lazy" /></a></footer>
      <FloatingMusicGift onPlayMusic={onPlayMusic} isPlayMusic={isPlayMusic} onOpenGift={() => setGiftOpen(true)} bgColor="bg-blue-700" giftLength={giftLength} slug={slug} tamuId={tamuData?.id} />
      <DialogGift gifts={undanganData.gifts} isOpen={giftOpen} setIsOpen={setGiftOpen} giftLength={giftLength} slug={slug} buttonBg="bg-blue-700" />
    </>}
  </main></MotionConfig>;
}
