"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import { IconArrowDown, IconArrowRight, IconMapPin, IconVideo } from "@tabler/icons-react";
import type Theme16 from "./theme16";
import { formatDateId } from "@/helper/date";
import GaleriCarousel from "../card/galeri-carousel";
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
const eyebrow = "font-sans text-[10px] font-semibold uppercase tracking-[.24em] text-alpine-muted";
const heading = "font-recoleta-alt text-4xl leading-tight font-normal text-alpine-ink [overflow-wrap:anywhere]";
const action = "font-sans rounded-sm inline-flex min-h-12 items-center justify-center gap-2 border border-alpine-forest bg-alpine-forest px-6 py-3 text-sm font-medium text-alpine-paper motion-safe:transition-colors hover:bg-alpine-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-alpine-gold";

function Divider({ light = false }: { light?: boolean }) {
  return <div aria-hidden="true" className={`mx-auto my-7 flex w-36 items-center gap-4 ${light ? "text-alpine-paper/50" : "text-alpine-gold/60"}`}>
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
  return <div className="my-9 overflow-hidden rounded-t-[2.5rem] rounded-b-sm border border-alpine-paper/40 bg-alpine-paper px-5 pt-7 pb-5 text-alpine-ink min-[400px]:px-7">
    <p className="text-center text-[10px] font-medium uppercase tracking-[.2em] text-alpine-muted">Menuju hari bahagia</p>
    <div role="timer" aria-label="Hitung mundur menuju pernikahan" aria-live="off">
      <div className="flex flex-wrap items-baseline justify-center gap-x-3 py-4">
        <strong className="font-recoleta-alt text-[clamp(3.5rem,16vw,5rem)] leading-none font-normal tracking-tight tabular-nums">{values ? values[0] : "--"}</strong>
        <span className="font-recoleta-alt text-xl">hari lagi</span>
      </div>
      <div className="mt-3 grid grid-cols-3 divide-x divide-alpine-forest/15 border-t border-alpine-forest/15 pt-5 text-center">
        {["Jam", "Menit", "Detik"].map((label, i) => <div key={label} className="min-w-0 px-2">
          <strong className="block text-[clamp(1.5rem,7vw,2rem)] leading-none font-medium tabular-nums">{values ? String(values[i + 1]).padStart(2, "0") : "--"}</strong>
          <span className="mt-2 block text-[10px] uppercase tracking-[.12em] text-alpine-muted">{label}</span>
        </div>)}
      </div>
    </div>
    {seconds === 0 && <p role="status" className="mt-5 border-t border-alpine-forest/15 pt-4 text-center text-sm">Hari bahagia telah tiba.</p>}
  </div>;
}

export default function Theme21({ undanganData, tamuData, onPlayMusic, isPlayMusic, onSubmitUcapan, isSubmitting, ucapan, giftLength, slug }: ComponentProps<typeof Theme16>) {
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
  const qr = <FloatingQrButton tamu={tamuData} tamuId={tamuData?.id ?? ""} slug={slug} content={c ?? null} bgColor="bg-alpine-forest" iconColor="text-alpine-paper" />;

  return <MotionConfig reducedMotion="user"><main className="overflow-hidden bg-alpine-paper font-maison text-[15px] leading-[1.85] text-alpine-ink selection:bg-alpine-mist">
    <AnimatePresence mode="wait">
      {!opened ? <motion.section key="cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: -30 }} transition={{ duration: .8 }}
        className="relative isolate flex min-h-svh flex-col items-center justify-end overflow-hidden px-8 pt-72 pb-12 text-center text-alpine-paper">
        <motion.img src="/images/theme21/mountain-dawn.webp" width={900} height={1350} alt="" aria-hidden="true" fetchPriority="high"
          initial={reduced ? false : { scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2.5, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-alpine-forest via-alpine-forest/25 to-transparent" />
        <p className="font-sans text-[10px] uppercase tracking-[.3em] text-alpine-paper/85">Undangan Pernikahan</p>
        <h1 className="mt-6 font-recoleta-alt text-[clamp(2.8rem,11vw,4.3rem)] leading-tight [overflow-wrap:anywhere]">{c?.title || "Nama Mempelai"}</h1>
        {weddingDate && <p className="mt-5 text-sm">{weddingDate}</p>}
        <div className="mt-10 w-full border-t border-alpine-paper/30 pt-7">
          <p className="font-sans text-[10px] text-alpine-paper/80">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <strong className="mt-2 mb-6 block text-lg font-normal [overflow-wrap:anywhere]">{tamuData?.name || "Tamu Spesial"}</strong>
          <button type="button" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm border border-alpine-paper bg-alpine-paper px-7 py-3 font-sans text-sm font-semibold text-alpine-forest hover:bg-alpine-mist focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-alpine-paper" onClick={() => { setOpened(true); if (!isPlayMusic) onPlayMusic(); }}>Buka undangan <IconArrowRight size={16} aria-hidden="true" /></button>
        </div>
        {qr}
      </motion.section> : <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .9 }} onAnimationComplete={() => titleRef.current?.focus({ preventScroll: true })}>
        <motion.section {...reveal} className="bg-alpine-paper text-center">
          <div className="relative isolate flex flex-col items-center overflow-hidden px-8 pt-14 pb-20">
            <motion.img src="/images/theme21/mountain-dawn.webp" alt="" aria-hidden="true" width={900} height={1350} initial={reduced ? false : { scale: 1.06 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-alpine-paper/95 via-alpine-paper/30 to-transparent" />
            <p className={eyebrow}>The wedding of</p>
            <h1 ref={titleRef} tabIndex={-1} className="mt-7 font-recoleta-alt text-[clamp(3rem,12vw,4.3rem)] leading-[1.08] tracking-tight outline-none [overflow-wrap:anywhere]">{c?.title || "Nama Mempelai"}</h1>
            <p className="mt-7 text-sm tracking-wide">{weddingDate}</p>
            {c?.imgBg && <motion.div {...reveal}
              whileHover={reduced ? undefined : { y: -4 }} whileTap={reduced ? undefined : { scale: .99 }}
              className="relative mx-auto mt-10 mb-4 w-full max-w-80 border border-alpine-paper/70 bg-alpine-forest/15 p-2">
              <img src={c.imgBg} alt={`Foto pasangan ${c?.title || "mempelai"}`} width={600} height={720} className="aspect-[5/6] w-full object-cover" />
              <motion.img src="/images/theme21/botanical.webp" alt="" aria-hidden="true" width={720} height={480} loading="lazy"
                initial={reduced ? false : { opacity: 0, y: 12, rotate: -3 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: .2 }}
                className="pointer-events-none absolute -bottom-12 -left-[12%] w-[124%] max-w-none origin-bottom object-contain" />
            </motion.div>}
          </div>
          <div className="relative bg-alpine-forest px-8 pt-10 pb-14 text-alpine-paper">
            <p className="mx-auto max-w-72 font-recoleta-alt text-2xl leading-relaxed">Di antara banyak perjalanan,<br />kami memilih berjalan bersama.</p>
            <a href="#theme21-mempelai" className="mx-auto mt-6 inline-flex min-h-11 items-center gap-2 text-xs text-alpine-paper underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-alpine-paper"
              onClick={event => { event.preventDefault(); document.getElementById("theme21-mempelai")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); }}>Mengenal mempelai <IconArrowDown size={14} aria-hidden="true" /></a>
          </div>
        </motion.section>

        <motion.section {...reveal} id="theme21-mempelai" className={`${section} scroll-mt-5 bg-alpine-paper`}>
          <p className={eyebrow}>Dengan penuh rasa syukur</p><h2 className={`${heading} mt-3`}>Mempelai</h2>
          <p className="mx-auto mt-5 max-w-80 text-sm leading-7 text-alpine-muted">Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu dalam pernikahan kami.</p>
          <div className="mt-10 space-y-12">{people.map((person) => <motion.article {...reveal} key={person.label} className="text-left">
            <div className="relative mx-auto w-[85%] max-w-72">
              {person.image && <img src={person.image} alt={person.name || person.label} loading="lazy" width={350} height={460} className="aspect-[4/5] w-full rounded-t-full object-cover" />}
              <div aria-hidden="true" className="pointer-events-none absolute -inset-2 rounded-t-full border border-alpine-forest/25" />
            </div>
            <div className="mt-8 text-center">
              <p className={eyebrow}>{person.label}</p>
              <h3 className="mt-3 font-recoleta-alt text-[clamp(1.7rem,7vw,2.2rem)] leading-tight [overflow-wrap:anywhere]">{person.name}</h3>
              <p className="mt-4 text-sm leading-7 text-alpine-muted">{person.child} dari<br />Bpk. {person.father} &amp; Ibu {person.mother}</p>
            </div>
          </motion.article>)}</div>
        </motion.section>

        <motion.section {...reveal} className="relative isolate overflow-hidden bg-alpine-forest px-7 py-16 text-alpine-paper min-[400px]:px-9">
          <img src="/images/theme21/mountain-dawn.webp" alt="" aria-hidden="true" loading="lazy" width={900} height={1350} className="absolute inset-0 -z-20 h-full w-full object-cover object-bottom" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-alpine-forest/90" />
          <p className="text-[10px] uppercase tracking-[.24em] text-alpine-paper/75">Simpan tanggalnya</p>
          <h2 className="mt-4 font-recoleta-alt text-4xl leading-tight">Hari yang<br />kami nantikan.</h2>
          <p className="mt-4 text-sm text-alpine-paper/85">{weddingDate}</p>
          <Countdown date={c?.dateWedding} />
          <div className="border-y border-alpine-paper/30 text-alpine-paper">

            {[{ title: "Akad Nikah", time: c?.akadTime, place: c?.akadPlace }, { title: "Resepsi", time: c?.resepsiTime, place: c?.resepsiPlace }].map((event, i) => <motion.article {...reveal} key={event.title} className="relative border-b border-alpine-paper/20 py-8 pl-12 last:border-b-0">

              <p className="absolute left-0 top-9 font-recoleta-alt text-xl text-alpine-paper/50">0{i + 1}</p>
              <h3 className="mt-1 font-recoleta-alt text-3xl">{event.title}</h3>
              {event.time && <p className="mt-3 text-sm font-semibold whitespace-pre-line [overflow-wrap:anywhere]">{event.time}</p>}
              {event.place && <p className="mt-4 text-sm leading-7 whitespace-pre-line text-alpine-paper/80 [overflow-wrap:anywhere]">{event.place}</p>}
            </motion.article>)}
          </div>
          <div className="mt-6 flex flex-col gap-3">
            {c?.gmaps && <a href={c.gmaps} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-alpine-paper px-5 py-3 font-sans text-sm font-semibold text-alpine-forest hover:bg-alpine-mist focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-alpine-paper"><IconMapPin size={17} aria-hidden="true" /> Menuju lokasi</a>}
            {c?.streamLink && <a href={c.streamLink} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 font-sans text-sm text-alpine-paper underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-alpine-paper"><IconVideo size={17} aria-hidden="true" /> Ikuti live streaming</a>}
          </div>
        </motion.section>

        {!!undanganData.loveStories?.length && <motion.section {...reveal} className={section}>
          <p className={eyebrow}>Dua hati bertemu</p><h2 className={`${heading} mt-3`}>Cerita Kami</h2><Divider />
          <LoveStoryAlbum
            loveStories={undanganData.loveStories}
            frameClassName="border-alpine-gold/40 bg-alpine-paper"
            accentClassName="text-alpine-ink"
            textClassName="text-alpine-muted"
            tapeClassName="bg-alpine-gold/30"
          />
        </motion.section>}
        {!!undanganData.gallery?.length && <motion.section {...reveal} className={`${section} bg-alpine-mist`}><p className={eyebrow}>Sepanjang perjalanan</p><h2 className={`${heading} mt-3 mb-8`}>Jejak Bersama</h2><GaleriCarousel galeri={undanganData.gallery} frameClassName="border-alpine-forest/30 bg-alpine-paper" label={`Kenangan ${c?.title || "mempelai"}`} /></motion.section>}

        <motion.section {...reveal} className={`${section} pb-2`}><h2 className={heading}>Doa & Kehadiran</h2><p className="mx-auto mt-5 max-w-80 text-sm leading-7 text-alpine-muted">Kehadiran dan doa restu Bapak/Ibu/Saudara/i akan melengkapi kebahagiaan kami.</p></motion.section>
        <UcapanConfirm tamu={tamuData} isLoading={isSubmitting} onSubmit={({ data }) => onSubmitUcapan(data)} bgColor="bg-alpine-paper" fontHeading="font-recoleta-alt" bgButton="bg-alpine-forest" colorButton="text-alpine-paper" colorHeading="text-alpine-ink" labelColor="text-alpine-ink" />
        <motion.section {...reveal} className={`${section} bg-alpine-mist`}><p className={eyebrow}>Dari orang tersayang</p><h2 className={`${heading} mt-3`}>Titipan Doa</h2><Divider />
          {!ucapan?.length && <p className="text-sm text-alpine-muted">Jadilah yang pertama menitipkan doa untuk kami.</p>}
          <div className="space-y-4">{ucapan?.map((item, index) => <motion.article {...reveal} key={index} className="border-b border-alpine-forest/20 py-6 text-left">
            <strong className="block border-b border-alpine-gold/25 pb-3 font-recoleta-alt text-xl font-normal [overflow-wrap:anywhere]">{item.name}</strong><p className="mt-4 text-sm leading-7 whitespace-pre-line text-alpine-muted [overflow-wrap:anywhere]">{item.message}</p>
          </motion.article>)}</div>
        </motion.section>
        <motion.footer {...reveal} className="relative isolate bg-alpine-paper px-8 pt-14 pb-72 text-center">
          <h2 className={`${heading} relative z-10`}>Terima kasih</h2><p className="relative z-10 mt-5 text-sm text-alpine-muted">Atas kehadiran dan doa restunya.</p><p className="relative z-10 mt-5 font-recoleta-alt text-2xl">{c?.title}</p>
          <a href="https://kekawinan.com" className="relative z-10 mx-auto mt-8 block w-fit focus-visible:outline-2 focus-visible:outline-alpine-gold"><img src="/images/kekawinan-logo.png" alt="Kekawinan" width={120} height={30} loading="lazy" className="h-auto w-28" /></a>
          <img src="/images/theme21/mountain-dawn.webp" alt="" aria-hidden="true" width={900} height={1350} loading="lazy" className="pointer-events-none absolute inset-x-0 bottom-0 h-60 w-full object-cover object-bottom" />
        </motion.footer>
        <FloatingMusicGift onPlayMusic={onPlayMusic} isPlayMusic={isPlayMusic} onOpenGift={() => setGiftOpen(true)} bgColor="bg-alpine-forest" giftLength={giftLength} slug={slug} tamuId={tamuData?.id} />
        {qr}<DialogGift gifts={undanganData.gifts} isOpen={giftOpen} setIsOpen={setGiftOpen} giftLength={giftLength} slug={slug} buttonBg="bg-alpine-forest" />
      </motion.div>}
    </AnimatePresence>
  </main></MotionConfig>;
}
