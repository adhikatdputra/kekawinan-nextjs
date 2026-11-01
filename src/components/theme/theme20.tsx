"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import {
  IconArrowDown,
  IconArrowRight,
  IconMapPin,
  IconVideo,
} from "@tabler/icons-react";
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
const eyebrow =
  "font-sans text-[10px] font-semibold uppercase tracking-[.24em] text-betawi-muted";
const heading =
  "font-recoleta-alt text-4xl leading-tight font-medium text-betawi-ink [overflow-wrap:anywhere]";
const action =
  "font-sans rounded-[2px] inline-flex min-h-12 items-center justify-center gap-2 border border-betawi-gold bg-betawi-forest px-6 py-3 text-sm font-medium text-betawi-paper motion-safe:transition-colors hover:bg-betawi-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-betawi-gold";

function GigiBalang({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none h-8 w-full bg-[url('/images/theme20/gigi-balang.svg')] bg-[length:40px_32px] bg-repeat-x ${className}`}
    />
  );
}

function OndelOndel({
  className = "w-40",
  floating = true,
}: {
  className?: string;
  floating?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.img
      src="/images/theme20/ondel-ondel.webp"
      alt=""
      aria-hidden="true"
      width={720}
      height={720}
      loading="lazy"
      className={`pointer-events-none mx-auto h-auto origin-bottom object-contain ${className}`}
      initial={false}
      whileInView={
        reduced || !floating ? undefined : { rotate: [0, -2, 2, -1, 0] }
      }
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 2.8, ease: "easeInOut" }}
    />
  );
}

function RumahBetawi({ className = "" }: { className?: string }) {
  return (
    <img
      src="/images/theme20/rumah-betawi.webp"
      alt=""
      aria-hidden="true"
      width={1000}
      height={667}
      loading="lazy"
      className={`pointer-events-none h-auto w-full object-contain ${className}`}
    />
  );
}

function Divider({ light = false }: { light?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto my-7 flex w-36 items-center gap-4 ${light ? "text-betawi-paper/50" : "text-betawi-gold/60"}`}
    >
      <span className="h-px flex-1 bg-current" />
      <span className="size-1.5 rotate-45 border border-current" />
      <span className="h-px flex-1 bg-current" />
    </div>
  );
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
    const timer = window.setInterval(() => {
      if (update() === 0) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [target]);
  if (!Number.isFinite(target)) return null;
  const values =
    seconds === null
      ? null
      : [
          Math.floor(seconds / 86400),
          Math.floor(seconds / 3600) % 24,
          Math.floor(seconds / 60) % 60,
          seconds % 60,
        ];
  return (
    <div className="mt-6 border-y border-betawi-paper/25 py-4">
      <div
        role="timer"
        aria-label="Hitung mundur menuju pernikahan"
        className="grid grid-cols-4 divide-x divide-betawi-paper/25"
      >
        {["Hari", "Jam", "Menit", "Detik"].map((label, i) => (
          <div key={label} className="px-1 text-center">
            <strong className="block font-recoleta-alt text-2xl font-normal tabular-nums">
              {values ? String(values[i]).padStart(2, "0") : "--"}
            </strong>
            <span className="mt-1 block font-sans text-[10px] tracking-wider text-betawi-paper/80">
              {label}
            </span>
          </div>
        ))}
      </div>
      {seconds === 0 && (
        <p className="mt-4 text-sm">Hari bahagia telah tiba.</p>
      )}
    </div>
  );
}

export default function Theme20({
  undanganData,
  tamuData,
  onPlayMusic,
  isPlayMusic,
  onSubmitUcapan,
  isSubmitting,
  ucapan,
  giftLength,
  slug,
}: ComponentProps<typeof Theme16>) {
  const [opened, setOpened] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const reduced = useReducedMotion();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const c = undanganData.content;
  const weddingDate = c?.dateWedding ? formatDateId(c.dateWedding) : "";
  const people = [
    {
      label: "Mempelai Putri",
      name: c?.nameFemale,
      image: c?.imgFemale,
      child: `Putri ${c?.femaleNo || ""}`,
      father: c?.fatherFemale,
      mother: c?.motherFemale,
    },
    {
      label: "Mempelai Putra",
      name: c?.nameMale,
      image: c?.imgMale,
      child: `Putra ${c?.maleNo || ""}`,
      father: c?.fatherMale,
      mother: c?.motherMale,
    },
  ];
  const qr = (
    <FloatingQrButton
      tamu={tamuData}
      tamuId={tamuData?.id ?? ""}
      slug={slug}
      content={c ?? null}
      bgColor="bg-betawi-forest"
      iconColor="text-betawi-paper"
    />
  );

  return (
    <MotionConfig reducedMotion="user">
      <main className="overflow-hidden bg-betawi-paper font-[Georgia,serif] text-[15px] leading-[1.85] [&_h1]:font-medium [&_h2]:font-medium [&_h3]:font-medium text-betawi-ink selection:bg-betawi-mist">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.section
              key="cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="relative isolate flex min-h-svh flex-col items-center justify-center bg-betawi-paper bg-[url('/images/theme20/serambi-frame.webp')] bg-[length:100%_100%] bg-no-repeat px-12 pt-32 pb-24 text-center max-[360px]:px-9"
            >
              <p className={eyebrow}>Undangan Pernikahan</p>
              <RumahBetawi className="my-6 max-w-72" />
              <p className="mb-3 font-recoleta-alt text-xl italic text-betawi-muted">
                Dengan adat, dengan cinta
              </p>
              <h1 className={`${heading} text-[clamp(2.6rem,10vw,4.2rem)]`}>
                {c?.title || "Nama Mempelai"}
              </h1>
              {weddingDate && <p className="mt-5 text-sm">{weddingDate}</p>}
              <Divider />
              <p className="text-xs text-betawi-muted">
                Kepada Yth. Bapak/Ibu/Saudara/i
              </p>
              <strong className="mt-2 mb-6 text-lg font-medium [overflow-wrap:anywhere]">
                {tamuData?.name || "Tamu Spesial"}
              </strong>
              <button
                type="button"
                className={action}
                onClick={() => {
                  setOpened(true);
                  if (!isPlayMusic) onPlayMusic();
                }}
              >
                Buka undangan <IconArrowRight size={16} aria-hidden="true" />
              </button>
              <p className="mt-6 text-xs text-betawi-muted">
                Kami tunggu kehadiran dan doa restunya.
              </p>
              {qr}
            </motion.section>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9 }}
              onAnimationComplete={() =>
                titleRef.current?.focus({ preventScroll: true })
              }
            >
              <motion.section
                {...reveal}
                className="bg-betawi-paper text-center"
              >
                <div className="relative isolate bg-[url('/images/theme20/serambi-frame.webp')] bg-[length:100%_100%] bg-no-repeat px-10 pt-36 pb-24 max-[360px]:px-8">
                  <p className={eyebrow}>Selamat datang di hajatan kami</p>
                  <h1
                    ref={titleRef}
                    tabIndex={-1}
                    className="mt-5 font-recoleta-alt text-[clamp(2.5rem,9vw,3rem)] leading-tight outline-none [overflow-wrap:anywhere]"
                  >
                    {c?.title || "Nama Mempelai"}
                  </h1>
                  <p className="mt-6 text-[15px] tracking-wide">
                    {weddingDate}
                  </p>
                  {c?.imgBg ? (
                    <motion.div
                      {...reveal}
                      className="relative mx-auto mt-8 w-[86%] max-w-75 pb-28"
                    >
                      <img
                        src={c.imgBg}
                        alt={`Foto pasangan ${c?.title || "mempelai"}`}
                        width={500}
                        height={650}
                        className="aspect-[4/5] w-full rounded-t-full rounded-b-[3px] border border-betawi-gold bg-betawi-paper object-cover p-1.5"
                      />
                      <div className="pointer-events-none absolute -bottom-6 left-1/2 z-10 w-[125%] -translate-x-1/2">
                        <RumahBetawi />
                      </div>
                    </motion.div>
                  ) : (
                    <OndelOndel className="mt-8 w-44" />
                  )}
                  <img
                    src="/images/theme20/halaman-serambi.webp"
                    alt=""
                    aria-hidden="true"
                    width={1000}
                    height={334}
                    loading="lazy"
                    className="pointer-events-none absolute inset-x-[9%] bottom-12 -z-10 h-auto w-[82%] object-contain"
                  />
                </div>
                <div className="bg-betawi-paper px-8 pt-8 pb-12 text-betawi-ink">
                  <p className="mx-auto max-w-72 text-[15px] leading-[1.9]">
                    Dengan restu keluarga,
                    <br />
                    kami memulai hidup bersama.
                  </p>
                  <a
                    href="#theme20-mempelai"
                    className="mx-auto mt-5 inline-flex min-h-11 items-center gap-2 text-xs text-betawi-muted underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-betawi-gold"
                    onClick={(event) => {
                      event.preventDefault();
                      document
                        .getElementById("theme20-mempelai")
                        ?.scrollIntoView({
                          behavior: reduced ? "auto" : "smooth",
                        });
                    }}
                  >
                    Mengenal mempelai{" "}
                    <IconArrowDown size={14} aria-hidden="true" />
                  </a>
                </div>
              </motion.section>

              <motion.section
                {...reveal}
                id="theme20-mempelai"
                className={`${section} scroll-mt-5 bg-betawi-mist`}
              >
                <p className={eyebrow}>Dengan penuh rasa syukur</p>
                <h2 className={`${heading} mt-3`}>Mempelai</h2>
                <p className="mx-auto mt-5 max-w-80 text-sm leading-7 text-betawi-muted">
                  Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan
                  doa restu dalam pernikahan kami.
                </p>
                <div className="mt-10 space-y-5">
                  {people.map((person, i) => (
                    <div key={person.label}>
                      {i > 0 && (
                        <p
                          aria-hidden="true"
                          className="mb-5 font-recoleta-alt text-4xl italic text-betawi-gold"
                        >
                          &amp;
                        </p>
                      )}
                      <motion.article
                        {...reveal}
                        className="relative overflow-hidden border border-betawi-gold/60 bg-betawi-paper bg-[url('/images/theme20/serambi-frame.webp')] bg-[length:100%_100%] bg-no-repeat px-8 pt-24 pb-20 max-[360px]:px-6"
                      >
                        <p className={`${eyebrow} mb-6`}>{person.label}</p>
                        {person.image && (
                          <img
                            src={person.image}
                            alt={person.name || person.label}
                            loading="lazy"
                            width={240}
                            height={300}
                            className="mx-auto h-[210px] w-[170px] rounded-t-full rounded-b-[2px] border border-betawi-gold bg-betawi-paper object-cover p-[5px] outline outline-offset-4 outline-betawi-gold/40"
                          />
                        )}
                        <h3 className="mt-7 font-recoleta-alt text-[clamp(1.5rem,6vw,2rem)] leading-tight [overflow-wrap:anywhere]">
                          {person.name}
                        </h3>
                        <Divider />
                        <p className="text-sm leading-7 text-betawi-muted">
                          {person.child} dari
                          <br />
                          Bpk. {person.father}
                          <br />
                          &amp; Ibu {person.mother}
                        </p>
                      </motion.article>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                {...reveal}
                className="relative bg-betawi-red px-6 pt-16 pb-14 text-betawi-paper min-[400px]:px-8"
              >
                <GigiBalang className="absolute inset-x-0 top-0" />
                <div className="flex items-end gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-[10px] font-semibold uppercase tracking-[.24em] text-betawi-paper/80">
                      Kami mengundang Anda
                    </p>
                    <h2 className="mt-3 font-recoleta-alt text-[2.6rem] leading-tight">
                      Datang ke
                      <br />
                      hajatan kami.
                    </h2>
                    {weddingDate && (
                      <p className="mt-4 text-sm text-betawi-paper/85">
                        {weddingDate}
                      </p>
                    )}
                  </div>
                  <OndelOndel className="w-24 shrink-0 min-[400px]:w-28" />
                </div>
                <Countdown date={c?.dateWedding} />
                <div className="mt-9 space-y-7">
                  {[
                    {
                      title: "Akad Nikah",
                      label: "Mengikat janji",
                      time: c?.akadTime,
                      place: c?.akadPlace,
                    },
                    {
                      title: "Resepsi",
                      label: "Merayakan bersama",
                      time: c?.resepsiTime,
                      place: c?.resepsiPlace,
                    },
                  ].map((event, index) => (
                    <motion.article
                      {...reveal}
                      key={event.title}
                      className={`relative border border-betawi-gold/50 bg-betawi-paper p-5 text-betawi-ink shadow-[4px_4px_0_0] shadow-betawi-gold/20 min-[400px]:p-6 ${index === 0 ? "mr-3" : "ml-3"}`}
                    >
                      <div className="flex items-start justify-between gap-3 border-b border-betawi-gold/30 pb-5">
                        <div>
                          <p className="font-sans text-[10px] uppercase tracking-[.15em] text-betawi-muted">
                            {event.label}
                          </p>
                          <h3
                            className={`mt-2 font-recoleta-alt text-3xl ${index === 0 ? "text-betawi-forest" : "text-betawi-red"}`}
                          >
                            {event.title}
                          </h3>
                        </div>
                        <span
                          aria-hidden="true"
                          className="font-recoleta-alt text-4xl text-betawi-gold/65"
                        >
                          0{index + 1}
                        </span>
                      </div>
                      {event.time && (
                        <div className="mt-5">
                          <p className="font-sans text-[10px] uppercase tracking-[.15em] text-betawi-muted">
                            Waktu acara
                          </p>
                          <p className="mt-2 text-[15px] leading-7 whitespace-pre-line [overflow-wrap:anywhere]">
                            {event.time}
                          </p>
                        </div>
                      )}
                      {event.place && (
                        <div className="mt-5">
                          <p className="font-sans text-[10px] uppercase tracking-[.15em] text-betawi-muted">
                            Tempat
                          </p>
                          <p className="mt-2 text-sm leading-7 whitespace-pre-line [overflow-wrap:anywhere]">
                            {event.place}
                          </p>
                        </div>
                      )}
                    </motion.article>
                  ))}
                </div>
                <div className="mt-9 flex flex-col items-center gap-3">
                  {c?.gmaps && (
                    <a
                      href={c.gmaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-betawi-gold bg-betawi-paper px-5 py-3 font-sans text-sm font-semibold text-betawi-ink motion-safe:transition-colors hover:bg-betawi-mist focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-betawi-paper"
                    >
                      <IconMapPin size={18} aria-hidden="true" /> Petunjuk
                      lokasi <IconArrowRight size={16} aria-hidden="true" />
                    </a>
                  )}
                  {c?.streamLink && (
                    <a
                      href={c.streamLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center justify-center gap-2 px-4 py-3 font-sans text-sm font-medium text-betawi-paper underline decoration-betawi-paper/50 underline-offset-4 hover:decoration-betawi-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-betawi-paper"
                    >
                      <IconVideo size={18} aria-hidden="true" /> Tonton live
                      streaming
                    </a>
                  )}
                </div>
              </motion.section>

              {!!undanganData.loveStories?.length && (
                <motion.section {...reveal} className={section}>
                  <p className={eyebrow}>Dua hati bertemu</p>
                  <h2 className={`${heading} mt-3`}>Cerita Kami</h2>
                  <Divider />
                  <LoveStoryAlbum
                    loveStories={undanganData.loveStories}
                    frameClassName="border-betawi-gold/40 bg-betawi-paper"
                    accentClassName="text-betawi-ink"
                    textClassName="text-betawi-muted"
                    tapeClassName="bg-betawi-gold/30"
                  />
                </motion.section>
              )}
              {!!undanganData.gallery?.length && (
                <motion.section
                  {...reveal}
                  className={`${section} bg-betawi-forest text-betawi-paper`}
                >
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[.24em] text-betawi-paper/75">
                    Kenangan yang tinggal
                  </p>
                  <h2 className="mt-3 mb-8 font-recoleta-alt text-4xl leading-tight">
                    Bingkai Cinta
                  </h2>
                  <GaleriCarousel
                    galeri={undanganData.gallery}
                    frameClassName="border-betawi-gold/60 bg-betawi-paper/5"
                    label={`Kenangan ${c?.title || "mempelai"}`}
                  />
                </motion.section>
              )}

              <motion.section {...reveal} className={`${section} pb-2`}>
                <OndelOndel className="mb-6 w-44" />
                <h2 className={heading}>Doa & Kehadiran</h2>
                <p className="mx-auto mt-5 max-w-80 text-sm leading-7 text-betawi-muted">
                  Kehadiran dan doa restu Bapak/Ibu/Saudara/i akan melengkapi
                  kebahagiaan kami.
                </p>
              </motion.section>
              <UcapanConfirm
                tamu={tamuData}
                isLoading={isSubmitting}
                onSubmit={({ data }) => onSubmitUcapan(data)}
                bgColor="bg-betawi-paper"
                fontHeading="font-recoleta-alt"
                bgButton="bg-betawi-forest"
                colorButton="text-betawi-paper"
                colorHeading="text-betawi-ink"
                labelColor="text-betawi-ink"
              />
              <motion.section
                {...reveal}
                className={`${section} bg-betawi-mist`}
              >
                <p className={eyebrow}>Dari orang tersayang</p>
                <h2 className={`${heading} mt-3`}>Titipan Doa</h2>
                <Divider />
                {!ucapan?.length && (
                  <p className="text-sm text-betawi-muted">
                    Jadilah yang pertama menitipkan doa untuk kami.
                  </p>
                )}
                <div className="space-y-4">
                  {ucapan?.map((item, index) => (
                    <motion.article
                      {...reveal}
                      key={index}
                      className="relative isolate overflow-hidden border border-betawi-gold/60 bg-betawi-paper px-6 pt-12 pb-6 text-left after:pointer-events-none after:absolute after:inset-x-2 after:top-10 after:bottom-2 after:-z-10 after:border after:border-betawi-gold/25"
                    >
                      <GigiBalang className="absolute inset-x-0 top-0" />
                      <strong className="block border-b border-betawi-gold/25 pb-3 font-recoleta-alt text-xl font-normal [overflow-wrap:anywhere]">
                        {item.name}
                      </strong>
                      <p className="mt-4 text-sm leading-7 whitespace-pre-line text-betawi-muted [overflow-wrap:anywhere]">
                        {item.message}
                      </p>
                    </motion.article>
                  ))}
                </div>
              </motion.section>
              <motion.footer
                {...reveal}
                className="relative bg-betawi-paper px-8 pt-14 pb-8 text-center"
              >
                <OndelOndel className="relative z-10 mb-5 w-40" />
                <h2 className={`${heading} relative z-10`}>Terima kasih</h2>
                <p className="relative z-10 mt-5 text-sm text-betawi-muted">
                  Atas kehadiran dan doa restunya.
                </p>
                <p className="relative z-10 mt-5 font-recoleta-alt text-2xl">
                  {c?.title}
                </p>
                <a
                  href="https://kekawinan.com"
                  className="relative z-10 mx-auto mt-8 block w-fit focus-visible:outline-2 focus-visible:outline-betawi-gold"
                >
                  <img
                    src="/images/kekawinan-logo.png"
                    alt="Kekawinan"
                    width={120}
                    height={30}
                    loading="lazy"
                    className="h-auto w-28"
                  />
                </a>
                <RumahBetawi className="mt-9" />
              </motion.footer>
              <FloatingMusicGift
                onPlayMusic={onPlayMusic}
                isPlayMusic={isPlayMusic}
                onOpenGift={() => setGiftOpen(true)}
                bgColor="bg-betawi-forest"
                giftLength={giftLength}
                slug={slug}
                tamuId={tamuData?.id}
              />
              {qr}
              <DialogGift
                gifts={undanganData.gifts}
                isOpen={giftOpen}
                setIsOpen={setGiftOpen}
                giftLength={giftLength}
                slug={slug}
                buttonBg="bg-betawi-forest"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
