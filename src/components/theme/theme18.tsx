"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { motion, MotionConfig, AnimatePresence, useReducedMotion } from "motion/react";
import type Theme16 from "./theme16";
import { formatDateId } from "@/helper/date";
import { Button } from "../ui/button";
import GaleriCards from "../card/galeri-cards";
import UcapanConfirm from "../card/ucapan-confirm";
import DialogGift from "../card/dialog-gift";
import { FloatingMusicGift } from "../card/floating-music-gift";
import { FloatingQrButton } from "../card/floating-qr-button";
import styles from "./theme18.module.css";

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.55 },
};

function FloatingOrnament(props: ComponentProps<typeof motion.img>) {
  const reduceMotion = useReducedMotion();
  return <motion.img {...props}
    whileInView={reduceMotion ? undefined : { y: [0, -5, 0], rotate: [-1, 1, -1] }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
  />;
}

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

function OrnamentDivider() {
  return <div className={styles.characterDecoration} aria-hidden="true"><span />
    <FloatingOrnament src="/images/theme18/gunungan.webp" alt="" width={480} height={720} loading="lazy" /><span />
  </div>;
}

export default function Theme18({ undanganData, tamuData, onPlayMusic, isPlayMusic, onSubmitUcapan, isSubmitting, ucapan, giftLength, slug }: ComponentProps<typeof Theme16>) {
  const [opened, setOpened] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const c = undanganData.content;
  const duo = <FloatingOrnament src="/images/theme18/gunungan.webp" width={480} height={720} alt="Gunungan Jawa dengan ukiran pohon kehidupan" className={styles.duo} />;
  const qr = <FloatingQrButton tamu={tamuData} tamuId={tamuData?.id ?? ""} slug={slug} content={c ?? null} bgColor="bg-[#654127]" iconColor="text-white" />;

  return <MotionConfig reducedMotion="user"><main className={styles.theme}><AnimatePresence mode="wait">
    {!opened ? <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="cover" exit={{ opacity: 0, scale: 1.04, filter: "blur(6px)" }} transition={{ duration: .65 }} className={styles.cover}><div className={styles.doorLeft} aria-hidden="true" /><div className={styles.doorRight} aria-hidden="true" />
      <p className={styles.eyebrow}>UNDANGAN PERNIKAHAN</p>
      <p className={styles.sticker}>Panggih ing katresnan</p>
      <h1>{c?.title || "Nama Mempelai"}</h1>
      <p>{c?.dateWedding && formatDateId(c.dateWedding)}</p>
      <motion.div initial={{ scale: .9 }} animate={{ scale: 1 }} transition={{ duration: .5 }}>{duo}</motion.div>
      <div className={styles.guest}><p>Kepada Yth. Bapak/Ibu/Saudara/i,</p><strong>{tamuData?.name || "Tamu Spesial"}</strong></div>
      <Button className={styles.button} onClick={() => { setOpened(true); if (!isPlayMusic) onPlayMusic(); }}>Buka undangan</Button>
      {qr}
    </motion.section> : <motion.div key="invitation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7 }}>
      <motion.section {...reveal} className={styles.hero}>
        <div className={styles.heroFrame}>
        <p className={styles.eyebrow}>PAWIWAHAN</p>
        <h1>{c?.title}</h1>
        <p className={styles.date}>{c?.dateWedding && formatDateId(c.dateWedding)}</p>
        {c?.imgBg ? <div className={styles.heroPortrait}>
          <img className={styles.heroPhoto} src={c.imgBg} alt={`Foto pasangan ${c.title || "mempelai"}`} width={600} height={720} />
        </div> : duo}
        </div>
        <div className={styles.heroClosing}>
        <p>Dua hati, satu janji.<br />Bersama memulai perjalanan seumur hidup.</p>
        <a
          href="#theme18-couple"
          className={styles.down}
          onClick={(e) => {
            // Smooth scroll without adding #theme18-couple to the guest's link
            e.preventDefault();
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            document.getElementById("theme18-couple")?.scrollIntoView({
              behavior: reduceMotion ? "auto" : "smooth",
              block: "start",
            });
          }}
        >
          Mengenal mempelai ↓
        </a>
        </div>
      </motion.section>
      <motion.section {...reveal} id="theme18-couple" className={styles.section}>
        <p className={styles.eyebrow}>SANG MEMPELAI</p>
        <h2>Pinanganten</h2>
        <p>Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk merayakan pernikahan kami.</p>
        <div className={styles.people}>
          <motion.article {...reveal} className={styles.pink}>
            <p className={styles.personLabel}>MEMPELAI PUTRI</p>
            <div className={styles.portraitGroup}>
              {c?.imgFemale && <img loading="lazy" src={c.imgFemale} alt={c.nameFemale || "Mempelai"} />}
            </div>
            <OrnamentDivider />
            <h3>{c?.nameFemale}</h3><p>Putri {c?.femaleNo} dari<br />Bpk. {c?.fatherFemale}<br />&amp; Ibu {c?.motherFemale}</p>
          </motion.article>
          <span className={styles.amp}>&amp;</span>
          <motion.article {...reveal} className={styles.blue}>
            <p className={styles.personLabel}>MEMPELAI PUTRA</p>
            <div className={styles.portraitGroup}>
              {c?.imgMale && <img loading="lazy" src={c.imgMale} alt={c.nameMale || "Mempelai"} />}
            </div>
            <OrnamentDivider />
            <h3>{c?.nameMale}</h3><p>Putra {c?.maleNo} dari<br />Bpk. {c?.fatherMale}<br />&amp; Ibu {c?.motherMale}</p>
          </motion.article>
        </div>
      </motion.section>
      <motion.section {...reveal} className={`${styles.section} ${styles.yellow}`}>
        <p className={styles.eyebrow}>CATAT TANGGALNYA</p><h2>Waktu & Tempat</h2>
        <p>{c?.dateWedding && formatDateId(c.dateWedding)}</p>
        <Countdown key={c?.dateWedding} date={c?.dateWedding} />
        {[{ title: "Akad Nikah", time: c?.akadTime, place: c?.akadPlace }, { title: "Resepsi", time: c?.resepsiTime, place: c?.resepsiPlace }].map(event => <motion.article {...reveal} className={styles.event} key={event.title}><h3>{event.title}</h3><strong>{event.time}</strong><p className="whitespace-pre-line">{event.place}</p></motion.article>)}
        {c?.gmaps && <a className={styles.link} href={c.gmaps} target="_blank" rel="noopener noreferrer">Buka Google Maps ↗</a>}
        {c?.streamLink && <a className={styles.link} href={c.streamLink} target="_blank" rel="noopener noreferrer">Tonton live streaming ↗</a>}
        <OrnamentDivider />
      </motion.section>
      {!!undanganData.loveStories?.length && <motion.section {...reveal} className={styles.section}>
        <p className={styles.eyebrow}>SEBUAH PERJALANAN</p><h2>Perjalanan Kasih</h2>
        <div className={styles.stories}>{undanganData.loveStories.map(story => <motion.article {...reveal} key={story.id}>
          {story.image && <img src={story.image} alt={story.waktu || "Kenangan perjalanan kami"} loading="lazy" />}
          {story.waktu && <h3>{story.waktu}</h3>}{story.lokasi && <small>{story.lokasi}</small>}
          <p className="whitespace-pre-line">{story.story}</p>
        </motion.article>)}</div>
      </motion.section>}
      {!!undanganData.gallery?.length && <motion.section {...reveal} className={styles.section}><p className={styles.eyebrow}>KENANGAN BERSAMA</p><h2>Bingkai Bahagia</h2><GaleriCards galeri={undanganData.gallery} accentColor="#8b6337" /></motion.section>}
      <motion.section {...reveal} className={styles.rsvp}>
        <FloatingOrnament src="/images/theme18/gunungan.webp" width={480} height={720} loading="lazy" alt="" aria-hidden="true" />
        <h2>Doa & Kehadiran</h2><p>Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.</p>
      </motion.section>
      <UcapanConfirm tamu={tamuData} isLoading={isSubmitting} onSubmit={({ data }) => onSubmitUcapan(data)} bgColor="bg-[#f4ecde]" fontHeading="font-recoleta-alt" bgButton="bg-[#654127]" colorButton="text-white" colorHeading="text-[#402d20]" labelColor="text-[#402d20]" />
      <motion.section {...reveal} className={styles.section}><OrnamentDivider /><h2>Titipan Doa</h2>
        {!ucapan?.length && <p>Jadilah yang pertama mengirimkan doa untuk kami.</p>}
        <div className={styles.notes}>{ucapan?.map((item, index) => <motion.article {...reveal} key={index} className={styles.note}>
          <header className={styles.noteHeader}><img src="/images/theme18/gunungan.webp" width={26} height={39} alt="" aria-hidden="true" loading="lazy" /><strong>{item.name}</strong></header>
          <p className="whitespace-pre-line">{item.message}</p>
        </motion.article>)}</div>
      </motion.section>
      <motion.footer {...reveal} className={styles.footer}><OrnamentDivider /><h2>Matur nuwun</h2><p>{c?.title}</p><a href="https://kekawinan.com"><img src="/images/kekawinan-logo.png" alt="Kekawinan" width={140} height={40} loading="lazy" /></a></motion.footer>
      <FloatingMusicGift onPlayMusic={onPlayMusic} isPlayMusic={isPlayMusic} onOpenGift={() => setGiftOpen(true)} bgColor="bg-[#654127]" giftLength={giftLength} slug={slug} tamuId={tamuData?.id} />
      {qr}
      <DialogGift gifts={undanganData.gifts} isOpen={giftOpen} setIsOpen={setGiftOpen} giftLength={giftLength} slug={slug} buttonBg="bg-[#654127]" />
    </motion.div>}
  </AnimatePresence></main></MotionConfig>;
}
