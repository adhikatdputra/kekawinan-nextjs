"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import { IconArrowDown, IconArrowRight, IconMapPin, IconVideo } from "@tabler/icons-react";
import type Theme16 from "./theme16";
import { formatDateId } from "@/helper/date";
import GaleriEditorial from "../card/galeri-editorial";
import LoveStoryAlbum from "../card/love-story-album";
import UcapanConfirm from "../card/ucapan-confirm";
import DialogGift from "../card/dialog-gift";
import { FloatingMusicGift } from "../card/floating-music-gift";
import { FloatingQrButton } from "../card/floating-qr-button";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.8, ease: "easeOut" as const },
};
const section = "px-7 py-16 text-center min-[400px]:px-9";
const eyebrow = "text-[10px] font-semibold uppercase tracking-[.24em] text-sunda-muted";
const heading = "font-recoleta-alt text-4xl leading-tight font-normal text-sunda-ink [overflow-wrap:anywhere]";
const action = "inline-flex min-h-12 items-center justify-center gap-2 border border-sunda-gold bg-sunda-forest px-6 py-3 text-sm font-medium text-sunda-paper motion-safe:transition-colors hover:bg-sunda-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sunda-gold";

function Siger({ className = "w-40", floating = true }: { className?: string; floating?: boolean }) {
  const reduced = useReducedMotion();
  return <motion.img src="/images/theme19/siger-melati.webp" alt="" aria-hidden="true" width={900} height={450} loading="lazy"
    className={`pointer-events-none mx-auto h-auto object-contain ${className}`}
    initial={false} whileInView={reduced || !floating ? undefined : { y: [0, -5, 0], rotate: [-.7, .7, -.7] }}
    viewport={{ once: true, amount: .4 }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />;
}

function Divider({ light = false }: { light?: boolean }) {
  return <div aria-hidden="true" className={`mx-auto my-7 flex w-36 items-center gap-4 ${light ? "text-sunda-paper/50" : "text-sunda-gold/60"}`}>
    <span className="h-px flex-1 bg-current" /><span className="size-1.5 rotate-45 border border-current" /><span className="h-px flex-1 bg-current" />
  </div>;
}

function Countdown({ date }: { date?: string }) {
  const target = date ? new Date(date).getTime() : NaN;
  const [seconds, setSeconds] = useState<number | null>(null);
  useEffect(() => {
    if (!Number.isFinite(target)) return;
    const update = () => {
      const next = Math.max(0, Math.floor((target - Date.now()) / 1000));
      setSeconds(next);
      return next;
    };
    if (update() === 0) return;
    const timer = window.setInterval(() => { if (update() === 0) window.clearInterval(timer); }, 1000);
    return () => window.clearInterval(timer);
  }, [target]);
  if (!Number.isFinite(target)) return null;
  const values = seconds === null ? null : [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
  return <div className="my-9">
    <div role="timer" aria-label="Hitung mundur menuju pernikahan" className="grid grid-cols-4 gap-2">
      {["Hari", "Jam", "Menit", "Detik"].map((label, i) => <div key={label} className="border-y border-sunda-gold/50 py-4">
        <strong className="block font-recoleta-alt text-3xl font-normal tabular-nums">{values ? String(values[i]).padStart(2, "0") : "--"}</strong>
        <span className="mt-2 block text-[10px] tracking-wider text-sunda-paper/70">{label}</span>
      </div>)}
    </div>
    {seconds === 0 && <p className="mt-4 text-sm">Hari bahagia telah tiba.</p>}
  </div>;
}

export default function Theme19({ undanganData, tamuData, onPlayMusic, isPlayMusic, onSubmitUcapan, isSubmitting, ucapan, giftLength, slug }: ComponentProps<typeof Theme16>) {
  const [opened, setOpened] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const reduced = useReducedMotion();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const c = undanganData.content;
  const weddingDate = c?.dateWedding ? formatDateId(c.dateWedding) : "";
  const people = [
    { label: "Mempelai Putri", name: c?.nameFemale, image: c?.imgFemale, child: `Putri ${c?.femaleNo || ""}`, father: c?.fatherFemale, mother: c?.motherFemale },
    { label: "Mempelai Putra", name: c?.nameMale, image: c?.imgMale, child: `Putra ${c?.maleNo || ""}`, father: c?.fatherMale, mother: c?.motherMale },
  ];
  const qr = <FloatingQrButton tamu={tamuData} tamuId={tamuData?.id ?? ""} slug={slug} content={c ?? null} bgColor="bg-sunda-forest" iconColor="text-sunda-paper" />;

  return <MotionConfig reducedMotion="user"><main className="overflow-hidden bg-sunda-paper font-maison text-[15px] leading-relaxed text-sunda-ink selection:bg-sunda-mist">
    <AnimatePresence mode="wait">
      {!opened ? <motion.section key="cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -30 }} transition={{ duration: .8 }}
        className="relative isolate flex min-h-svh flex-col items-center justify-center px-10 pt-16 pb-60 text-center">
        <img src="/images/theme19/priangan.webp" width={900} height={1350} alt="" aria-hidden="true" fetchPriority="high" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-60 w-full object-cover object-bottom" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-4 border border-sunda-gold/50" />
        <p className={eyebrow}>Undangan Pernikahan</p>
        <Siger className="my-7 w-48" />
        <p className="mb-3 font-recoleta-alt text-xl italic text-sunda-muted">Dina bagja urang</p>
        <h1 className={`${heading} text-[clamp(2.6rem,10vw,4.2rem)]`}>{c?.title || "Nama Mempelai"}</h1>
        {weddingDate && <p className="mt-5 text-sm">{weddingDate}</p>}
        <Divider />
        <p className="text-xs text-sunda-muted">Kepada Yth. Bapak/Ibu/Saudara/i</p>
        <strong className="mt-2 mb-6 text-lg font-medium [overflow-wrap:anywhere]">{tamuData?.name || "Tamu Spesial"}</strong>
        <button type="button" className={action} onClick={() => { setOpened(true); if (!isPlayMusic) onPlayMusic(); }}>Buka undangan <IconArrowRight size={16} aria-hidden="true" /></button>
        {qr}
      </motion.section> : <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .9 }} onAnimationComplete={() => titleRef.current?.focus({ preventScroll: true })}>
        <motion.section {...reveal} className="bg-sunda-paper text-center">
          <div className="bg-sunda-forest px-8 pt-12 pb-24 text-sunda-paper">
            <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-sunda-paper/75">Wilujeng sumping</p>
            <Siger className="my-6 w-56 max-w-full" />
            <h1 ref={titleRef} tabIndex={-1} className="font-recoleta-alt text-[clamp(2.6rem,10vw,3.6rem)] leading-tight font-normal text-sunda-paper outline-none [overflow-wrap:anywhere]">{c?.title}</h1>
            <Divider light /><p className="text-sm text-sunda-paper/80">{weddingDate}</p>
          </div>
          <div className="relative isolate -mt-14 px-8 pb-12">
            <img src="/images/theme19/priangan.webp" alt="" aria-hidden="true" width={900} height={1350} loading="lazy" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-72 w-full object-cover object-bottom" />
            {c?.imgBg ? <motion.div {...reveal} className="mx-auto w-[84%] max-w-72 rounded-t-full border border-sunda-gold bg-sunda-paper p-2 shadow-lg shadow-sunda-forest/10">
              <img src={c.imgBg} alt={`Foto pasangan ${c?.title || "mempelai"}`} width={500} height={650} className="aspect-[4/5] w-full rounded-t-full object-cover" />
            </motion.div> : <div className="h-48" />}
          </div>
          <div className="px-8 pt-7 pb-12">
            <p className="mx-auto max-w-72 font-recoleta-alt text-xl leading-relaxed text-sunda-ink">Dengan cinta dan doa restu,<br />kami memulai cerita baru.</p>
            <a href="#theme19-mempelai" className="mx-auto mt-5 inline-flex min-h-11 items-center gap-2 text-xs text-sunda-muted underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-sunda-gold"
              onClick={event => { event.preventDefault(); document.getElementById("theme19-mempelai")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); }}>Mengenal mempelai <IconArrowDown size={14} aria-hidden="true" /></a>
          </div>
        </motion.section>

        <motion.section {...reveal} id="theme19-mempelai" className={`${section} scroll-mt-5 bg-sunda-mist`}>
          <p className={eyebrow}>Dengan penuh rasa syukur</p><h2 className={`${heading} mt-3`}>Mempelai</h2>
          <p className="mx-auto mt-5 max-w-80 text-sm leading-7 text-sunda-muted">Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu dalam pernikahan kami.</p>
          <div className="mt-10 space-y-5">{people.map((person, i) => <div key={person.label}>
            {i > 0 && <p aria-hidden="true" className="mb-5 font-recoleta-alt text-4xl italic text-sunda-gold">&amp;</p>}
            <motion.article {...reveal} className="relative border border-sunda-gold/50 bg-sunda-paper px-6 pt-7 pb-9">
              <p className={eyebrow}>{person.label}</p><Siger className="mt-3 mb-1 w-28" />
              {person.image && <img src={person.image} alt={person.name || person.label} loading="lazy" width={240} height={300} className="mx-auto h-56 w-44 rounded-t-full border border-sunda-gold/60 object-cover p-1.5" />}
              <h3 className="mt-7 font-recoleta-alt text-[clamp(1.65rem,7vw,2.2rem)] leading-tight [overflow-wrap:anywhere]">{person.name}</h3>
              <Divider /><p className="text-sm leading-7 text-sunda-muted">{person.child} dari<br />Bpk. {person.father}<br />&amp; Ibu {person.mother}</p>
            </motion.article>
          </div>)}</div>
        </motion.section>

        <motion.section {...reveal} className={`${section} bg-sunda-forest text-sunda-paper`}>
          <p className="text-[10px] uppercase tracking-[.24em] text-sunda-paper/65">Simpen tanggalna</p>
          <h2 className="mt-4 font-recoleta-alt text-4xl font-normal">Hari Bahagia</h2><p className="mt-4 text-sm text-sunda-paper/80">{weddingDate}</p>
          <Countdown date={c?.dateWedding} />
          {[{ title: "Akad Nikah", time: c?.akadTime, place: c?.akadPlace }, { title: "Resepsi", time: c?.resepsiTime, place: c?.resepsiPlace }].map(event => <motion.article {...reveal} key={event.title} className="border-b border-sunda-gold/30 py-7 last:border-0">
            <h3 className="font-recoleta-alt text-3xl font-normal">{event.title}</h3><p className="mt-3 text-sm font-medium text-sunda-paper">{event.time}</p><p className="mt-4 text-sm leading-7 whitespace-pre-line text-sunda-paper/80">{event.place}</p>
          </motion.article>)}
          <div className="mt-7 flex flex-col items-center gap-3">
            {c?.gmaps && <a href={c.gmaps} target="_blank" rel="noopener noreferrer" className={action}><IconMapPin size={17} aria-hidden="true" /> Petunjuk lokasi</a>}
            {c?.streamLink && <a href={c.streamLink} target="_blank" rel="noopener noreferrer" className={action}><IconVideo size={17} aria-hidden="true" /> Live streaming</a>}
          </div>
        </motion.section>

        {!!undanganData.loveStories?.length && <motion.section {...reveal} className={section}>
          <p className={eyebrow}>Dua hati bertemu</p><h2 className={`${heading} mt-3`}>Cerita Kami</h2><Divider />
          <LoveStoryAlbum
            loveStories={undanganData.loveStories}
            frameClassName="border-sunda-gold/40 bg-sunda-paper"
            accentClassName="text-sunda-ink"
            textClassName="text-sunda-muted"
            tapeClassName="bg-sunda-gold/30"
          />
        </motion.section>}
        {!!undanganData.gallery?.length && <motion.section {...reveal} className={`${section} bg-sunda-mist`}><p className={eyebrow}>Kenangan yang tinggal</p><h2 className={`${heading} mt-3 mb-8`}>Bingkai Cinta</h2><Siger className="mb-7 w-28" floating={false} /><GaleriEditorial galeri={undanganData.gallery} frameClassName="border-sunda-gold/50 bg-sunda-paper" label={`Kenangan ${c?.title || "mempelai"}`} /></motion.section>}

        <motion.section {...reveal} className={`${section} pb-2`}><Siger className="mb-4 w-36" /><h2 className={heading}>Doa & Kehadiran</h2><p className="mx-auto mt-5 max-w-80 text-sm leading-7 text-sunda-muted">Kehadiran dan doa restu Bapak/Ibu/Saudara/i akan melengkapi kebahagiaan kami.</p></motion.section>
        <UcapanConfirm tamu={tamuData} isLoading={isSubmitting} onSubmit={({ data }) => onSubmitUcapan(data)} bgColor="bg-sunda-paper" fontHeading="font-recoleta-alt" bgButton="bg-sunda-forest" colorButton="text-sunda-paper" colorHeading="text-sunda-ink" labelColor="text-sunda-ink" />
        <motion.section {...reveal} className={`${section} bg-sunda-mist`}><p className={eyebrow}>Dari orang tersayang</p><h2 className={`${heading} mt-3`}>Titipan Doa</h2><Divider />
          {!ucapan?.length && <p className="text-sm text-sunda-muted">Jadilah yang pertama menitipkan doa untuk kami.</p>}
          <div className="space-y-4">{ucapan?.map((item, index) => <motion.article {...reveal} key={index} className="border border-sunda-gold/40 bg-sunda-paper p-6 text-left">
            <strong className="block border-b border-sunda-gold/25 pb-3 font-recoleta-alt text-xl font-normal [overflow-wrap:anywhere]">{item.name}</strong><p className="mt-4 text-sm leading-7 whitespace-pre-line text-sunda-muted [overflow-wrap:anywhere]">{item.message}</p>
          </motion.article>)}</div>
        </motion.section>
        <motion.footer {...reveal} className="relative bg-sunda-paper px-8 pt-14 pb-64 text-center">
          <Siger className="relative z-10 mb-5 w-40" /><h2 className={`${heading} relative z-10`}>Hatur nuhun</h2><p className="relative z-10 mt-5 text-sm text-sunda-muted">Atas kehadiran dan doa restunya.</p><p className="relative z-10 mt-5 font-recoleta-alt text-2xl">{c?.title}</p>
          <a href="https://kekawinan.com" className="relative z-10 mx-auto mt-8 block w-fit focus-visible:outline-2 focus-visible:outline-sunda-gold"><img src="/images/kekawinan-logo.png" alt="Kekawinan" width={120} height={30} loading="lazy" className="h-auto w-28" /></a>
          <img src="/images/theme19/priangan.webp" alt="" aria-hidden="true" width={900} height={1350} loading="lazy" className="pointer-events-none absolute inset-x-0 bottom-0 h-60 w-full object-cover object-bottom" />
        </motion.footer>
        <FloatingMusicGift onPlayMusic={onPlayMusic} isPlayMusic={isPlayMusic} onOpenGift={() => setGiftOpen(true)} bgColor="bg-sunda-forest" giftLength={giftLength} slug={slug} tamuId={tamuData?.id} />
        {qr}<DialogGift gifts={undanganData.gifts} isOpen={giftOpen} setIsOpen={setGiftOpen} giftLength={giftLength} slug={slug} buttonBg="bg-sunda-forest" />
      </motion.div>}
    </AnimatePresence>
  </main></MotionConfig>;
}
