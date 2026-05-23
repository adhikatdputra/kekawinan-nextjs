"use client";

import { useEffect, useState } from "react";
import {
  UndanganDetail,
  UndanganTamu,
  UndanganUcapan,
} from "@/frontend/interface/undangan";
import { IconMapPin, IconDeviceTvOld, IconMessageCircle } from "@tabler/icons-react";
import DialogGift from "@/components/card/dialog-gift";
import GaleriCards from "@/components/card/galeri-cards";
import LoveStoryCards from "@/components/card/love-story-cards";
import { FloatingMusicGift } from "../card/floating-music-gift";
import { FloatingQrButton } from "@/components/card/floating-qr-button";
import SaveTheDate from "@/components/card/save-the-date";
import UcapanConfirm from "@/components/card/ucapan-confirm";
import { motion } from "motion/react";
import { formatDateId } from "@/helper/date";
import { nl2br } from "@/helper/text";
import Link from "next/link";

// ─── Colors ────────────────────────────────────────────────────────
const BG = "#F4F3FF";
const PRIMARY_HEX = "#6C52D9";   // matches --theme14-primary
const EVENT_GRADIENT =
  "linear-gradient(155deg, #4A3BB8 0%, #6C52D9 45%, #9B8FE0 80%, #C8C1F0 100%)";

// ─── Decorative blossom petal (5 rounded petals, distinct from theme13) ───
function Blossom({
  size = 100,
  opacity = 0.18,
  rotate = 0,
  color = "white",
}: {
  size?: number;
  opacity?: number;
  rotate?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity, transform: `rotate(${rotate}deg)`, flexShrink: 0 }}
    >
      {/* 5 elongated petals rotated around center */}
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="28"
          rx="10"
          ry="22"
          fill={color}
          transform={`rotate(${deg}, 50, 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="10" fill={color} />
    </svg>
  );
}

// ─── Unique section heading for theme14 ────────────────────────────
// Centered with decorative dot-line divider above, distinct from all other themes
function SectionHeading({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  const color = light ? "bg-white/50" : "bg-theme14-primary/25";
  const textColor = light ? "text-white/75" : "text-theme14-primary/70";
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Three-dot row */}
      <div className="flex items-center gap-1.5">
        <div className={`w-1 h-1 rounded-full ${color}`} />
        <div className={`w-1.5 h-1.5 rounded-full ${light ? "bg-white/70" : "bg-theme14-primary/50"}`} />
        <div className={`w-1 h-1 rounded-full ${color}`} />
      </div>
      {/* Thin line */}
      <div className={`w-14 h-px ${color}`} />
      {/* Label */}
      <p className={`text-[11px] font-semibold uppercase tracking-[0.32em] ${textColor}`}>
        {children}
      </p>
    </div>
  );
}

// ─── White card ─────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-3xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export default function Theme14({
  onPlayMusic,
  onSubmitUcapan,
  isPlayMusic,
  isSubmitting,
  undanganData,
  tamuData,
  ucapan,
  giftLength,
  slug,
}: {
  onPlayMusic: () => void;
  isPlayMusic: boolean;
  undanganData: UndanganDetail;
  tamuData: UndanganTamu;
  isSubmitting: boolean;
  onSubmitUcapan: (data: {
    name: string;
    attend: string;
    attendTotal: string;
    message: string;
  }) => void;
  ucapan: UndanganUcapan[];
  giftLength: number;
  slug: string;
}) {
  const [undangan, setUndangan] = useState<UndanganDetail | null>(null);
  const [tamu, setTamu] = useState<UndanganTamu | null>(null);
  const [isCoverUndangan, setIsCoverUndangan] = useState(true);
  const [isOpenGift, setIsOpenGift] = useState(false);

  useEffect(() => { setUndangan(undanganData); }, [undanganData]);
  useEffect(() => { setTamu(tamuData); }, [tamuData]);

  // ── COVER ────────────────────────────────────────────────────────
  if (isCoverUndangan) {
    return (
      <div
        className="relative h-screen flex flex-col justify-between overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${undanganData?.content?.imgBg})` }}
      >
        {/* Lavender gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(74,59,184,0.12) 0%, rgba(108,82,217,0.25) 30%, rgba(108,82,217,0.55) 65%, rgba(74,59,184,0.92) 85%, rgba(58,46,160,0.98) 100%)",
          }}
        />

        {/* Blossom decorations — cover */}
        <div className="absolute top-[-25px] left-[-25px] pointer-events-none">
          <Blossom size={200} opacity={0.18} rotate={20} />
        </div>
        <div className="absolute top-[5%] right-[-40px] pointer-events-none">
          <Blossom size={160} opacity={0.14} rotate={-35} />
        </div>
        <div className="absolute top-[38%] left-[-15px] pointer-events-none">
          <Blossom size={90} opacity={0.12} rotate={10} />
        </div>
        <div className="absolute top-[50%] right-[-10px] pointer-events-none">
          <Blossom size={75} opacity={0.13} rotate={50} />
        </div>
        <div className="absolute bottom-[30%] left-[20%] pointer-events-none">
          <Blossom size={45} opacity={0.18} rotate={30} />
        </div>
        <div className="absolute bottom-[-25px] right-[-20px] pointer-events-none">
          <Blossom size={165} opacity={0.15} rotate={-10} />
        </div>

        <div className="pt-14" />

        {/* Middle: name + date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          viewport={{ once: false }}
          className="relative z-10 text-center px-6 flex flex-col items-center gap-3"
        >
          {/* Decorative divider top */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-white/35" />
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-white/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <div className="w-1 h-1 rounded-full bg-white/50" />
            </div>
            <div className="w-8 h-px bg-white/35" />
          </div>
          <p className="text-white/60 text-[10px] uppercase tracking-[0.32em] font-medium">
            Undangan Pernikahan
          </p>
          <h1 className="text-[2.8rem] font-bold text-white font-recoleta-alt leading-tight">
            {undanganData?.content?.title}
          </h1>
          <p className="text-white/60 text-xs tracking-widest">
            {formatDateId(undanganData?.content?.dateWedding ?? "")}
          </p>
        </motion.div>

        {/* Bottom: frosted glass guest card + button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: false }}
          className="relative z-10 w-full px-5 mb-14 flex flex-col gap-3"
        >
          <div
            className="rounded-3xl p-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.07) 100%)",
              border: "1px solid rgba(255,255,255,0.22)",
              backdropFilter: "blur(14px)",
            }}
          >
            <p className="text-white/50 text-[10px] uppercase tracking-[0.22em] mb-0.5">Kepada Yth.</p>
            <p className="text-white/55 text-xs mb-3">Bapak/Ibu/Saudara/i</p>
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 rounded-full bg-white/35" />
              <p className="text-white text-xl font-bold font-recoleta-alt">
                {tamuData?.name || "Tamu Spesial"}
              </p>
            </div>
          </div>

          <button
            className="w-full h-12 rounded-2xl font-bold text-theme14-primary text-sm bg-white shadow-md"
            onClick={() => {
              setIsCoverUndangan(false);
              onPlayMusic();
            }}
          >
            Buka Undangan
          </button>
        </motion.div>

        <FloatingQrButton
          tamu={tamu}
          tamuId={tamu?.id ?? ""}
          slug={slug}
          content={undangan?.content ?? null}
          bgColor="bg-white"
          iconColor="text-theme14-primary"
        />
      </div>
    );
  }

  // ── MAIN CONTENT ──────────────────────────────────────────────────
  return (
    <div style={{ background: BG }}>

      {/* ── Hero ── */}
      <div
        className="relative h-screen bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${undangan?.content?.imgBg})` }}
      >
        {/* Lavender overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(108,82,217,0.15) 0%, transparent 35%, rgba(244,243,255,0.82) 75%, #F4F3FF 100%)",
          }}
        />

        {/* Blossom decorations — hero */}
        <div className="absolute top-6 right-[-20px] pointer-events-none">
          <Blossom size={130} opacity={0.22} rotate={-20} color={PRIMARY_HEX} />
        </div>
        <div className="absolute top-[20%] left-[-15px] pointer-events-none">
          <Blossom size={80} opacity={0.15} rotate={40} color={PRIMARY_HEX} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 flex flex-col items-center gap-3 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2 bg-white/88 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-theme14-primary animate-pulse" />
              <span className="text-theme14-primary text-[10px] font-semibold tracking-widest uppercase">
                Undangan Pernikahan
              </span>
            </div>
            <h2 className="text-4xl font-bold font-recoleta-alt text-gray-900 leading-tight">
              {undangan?.content?.title}
            </h2>
            <p className="text-gray-500 text-sm tracking-wider">
              {formatDateId(undangan?.content?.dateWedding ?? "")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Ayat Section ── */}
      <div className="relative px-8 py-12 text-center overflow-hidden" style={{ background: BG }}>
        {/* Blossom corners */}
        <div className="absolute top-[-10px] left-[-15px] pointer-events-none">
          <Blossom size={110} opacity={0.12} rotate={15} color={PRIMARY_HEX} />
        </div>
        <div className="absolute bottom-[-10px] right-[-15px] pointer-events-none">
          <Blossom size={90} opacity={0.10} rotate={-20} color={PRIMARY_HEX} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="relative z-10"
        >
          <p className="text-gray-500 text-[11px] italic leading-7">
            &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
            untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung
            dan merasa tenteram kepadanya.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="w-8 h-px bg-theme14-primary/25" />
            <p className="text-theme14-primary text-[10px] font-semibold tracking-[0.2em]">
              Q.S Ar-Rum: 21
            </p>
            <div className="w-8 h-px bg-theme14-primary/25" />
          </div>
        </motion.div>
      </div>

      {/* ── Mempelai ── */}
      <div className="px-5 py-14" style={{ background: BG }}>
        {/* Unique section heading — centered, dots+line style */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-center mb-10"
        >
          <SectionHeading>Mempelai</SectionHeading>
        </motion.div>

        {/* Bismillah */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: false }}
          className="text-center mb-12"
        >
          <img
            src="/images/theme1/bismillah.png"
            alt=""
            className="h-9 mx-auto opacity-25"
            style={{ filter: "sepia(1) saturate(1.5) hue-rotate(220deg)" }}
          />
          <p className="text-gray-400 text-xs mt-3">
            Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="text-gray-400 text-xs mt-2 leading-relaxed px-4">
            Dengan rahmat Allah SWT, kami mengundang Bapak/Ibu untuk menghadiri
            pernikahan kami.
          </p>
        </motion.div>

        {/* ── Couple cards: unique "banner-top + overlapping circle photo + centered info" ── */}
        <div className="flex flex-col gap-8">
          {/* Female */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: false }}
          >
            <div className="bg-white rounded-3xl shadow-sm overflow-visible relative">
              {/* Lavender banner top */}
              <div
                className="h-20 rounded-t-3xl relative"
                style={{
                  background: "linear-gradient(135deg, #6C52D9 0%, #9B8FE0 60%, #C8C1F0 100%)",
                }}
              >
                {/* Small blossom on banner */}
                <div className="absolute top-2 right-4 pointer-events-none opacity-30">
                  <Blossom size={50} opacity={1} rotate={20} />
                </div>
                <p className="absolute bottom-3 left-5 text-[9px] uppercase tracking-[0.25em] text-white/70 font-semibold">
                  Mempelai Wanita
                </p>
              </div>
              {/* Circular photo — overlapping banner bottom */}
              <div className="flex justify-center">
                <div className="relative -mt-10 z-10 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img
                    src={undangan?.content?.imgFemale}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Info — centered below photo */}
              <div className="text-center px-5 pt-3 pb-6">
                <h5 className="text-gray-900 font-bold text-xl font-recoleta-alt leading-tight">
                  {undangan?.content?.nameFemale}
                </h5>
                <p className="text-theme14-secondary text-[11px] font-medium mt-1">
                  Putri {undangan?.content?.femaleNo}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {undangan?.content?.fatherFemale} &amp; {undangan?.content?.motherFemale}
                </p>
              </div>
            </div>
          </motion.div>

          {/* & divider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false }}
            className="flex items-center justify-center gap-3"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-theme14-primary/20" />
            <span className="text-3xl font-bold text-theme14-primary font-recoleta-alt">&amp;</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-theme14-primary/20" />
          </motion.div>

          {/* Male */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: false }}
          >
            <div className="bg-white rounded-3xl shadow-sm overflow-visible relative">
              {/* Secondary-toned banner */}
              <div
                className="h-20 rounded-t-3xl relative"
                style={{
                  background: "linear-gradient(135deg, #9B8FE0 0%, #B8B0E8 60%, #DDD8F8 100%)",
                }}
              >
                <div className="absolute top-2 right-4 pointer-events-none opacity-30">
                  <Blossom size={50} opacity={1} rotate={-30} />
                </div>
                <p className="absolute bottom-3 left-5 text-[9px] uppercase tracking-[0.25em] text-white/70 font-semibold">
                  Mempelai Pria
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative -mt-10 z-10 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img
                    src={undangan?.content?.imgMale}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center px-5 pt-3 pb-6">
                <h5 className="text-gray-900 font-bold text-xl font-recoleta-alt leading-tight">
                  {undangan?.content?.nameMale}
                </h5>
                <p className="text-theme14-primary text-[11px] font-medium mt-1">
                  Putra {undangan?.content?.maleNo}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {undangan?.content?.fatherMale} &amp; {undangan?.content?.motherMale}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Acara / Event ── */}
      <div
        className="relative px-5 py-14 overflow-hidden"
        style={{ background: EVENT_GRADIENT }}
      >
        {/* Blossom decorations on event section */}
        <div className="absolute top-[-20px] right-[-30px] pointer-events-none">
          <Blossom size={170} opacity={0.18} rotate={30} />
        </div>
        <div className="absolute bottom-[-25px] left-[-20px] pointer-events-none">
          <Blossom size={140} opacity={0.14} rotate={-15} />
        </div>
        <div className="absolute top-[45%] right-[5%] pointer-events-none">
          <Blossom size={55} opacity={0.13} rotate={60} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-center mb-10"
        >
          <SectionHeading light>Detail Acara</SectionHeading>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: false }}
          className="mb-8"
        >
          <SaveTheDate
            targetDate={undangan?.content?.dateWedding ?? ""}
            primaryColor="text-white"
            secondaryColor="text-white"
            cardBg="bg-white/15 border border-white/25 backdrop-blur-sm"
            accentBg="bg-white"
          />
        </motion.div>

        {/* Event cards */}
        <div className="flex flex-col gap-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: false }}
          >
            <Card className="p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] font-bold text-theme14-primary mb-2">
                Akad Nikah
              </p>
              <p className="text-gray-900 font-bold text-base leading-snug">
                {undangan?.content?.akadTime}
              </p>
              <div
                className="text-gray-400 text-xs mt-2 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: nl2br(undangan?.content?.akadPlace) }}
              />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: false }}
          >
            <Card className="p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] font-bold text-theme14-secondary mb-2">
                Resepsi Pernikahan
              </p>
              <p className="text-gray-900 font-bold text-base leading-snug">
                {undangan?.content?.resepsiTime}
              </p>
              <div
                className="text-gray-400 text-xs mt-2 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: nl2br(undangan?.content?.resepsiPlace) }}
              />
            </Card>
          </motion.div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: false }}
          >
            <Link href={undangan?.content?.gmaps ?? ""} target="_blank">
              <button className="w-full h-11 rounded-2xl font-bold text-theme14-primary text-sm bg-white shadow-sm flex items-center justify-center gap-2">
                <IconMapPin size={15} />
                Lihat di Google Maps
              </button>
            </Link>
          </motion.div>

          {undangan?.content?.streamLink && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: false }}
            >
              <Link href={undangan?.content?.streamLink ?? ""} target="_blank">
                <button className="w-full h-11 rounded-2xl font-semibold text-white text-sm border border-white/40 bg-white/15 backdrop-blur-sm flex items-center justify-center gap-2">
                  <IconDeviceTvOld size={15} />
                  Live Streaming
                </button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Love Story (timeline) — white bg so lavender cards contrast ── */}
      <LoveStoryCards
        loveStories={undanganData.loveStories ?? []}
        primaryColor="text-theme14-primary"
        accentBg="bg-theme14-primary"
        textColor="text-gray-700"
        mutedColor="text-gray-400"
        cardBg="bg-[#F4F3FF] shadow-md border border-violet-100"
        sectionTitle="Love Story"
        sectionBg="bg-white"
      />

      {/* ── Gallery (cards) ── */}
      <div className="py-14" style={{ background: BG }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="mb-8 text-center"
        >
          <SectionHeading>Galeri</SectionHeading>
        </motion.div>
        <GaleriCards
          galeri={undanganData.gallery}
          accentColor={PRIMARY_HEX}
        />
      </div>

      {/* ── Ucapan Form — lavender bg so disabled button is visible ── */}
      <div style={{ background: "#EDE9FF" }}>
        <UcapanConfirm
          tamu={tamu ?? tamuData}
          isLoading={isSubmitting}
          onSubmit={({ data }) => onSubmitUcapan(data)}
          bgColor="bg-transparent"
          fontHeading="font-recoleta-alt"
          bgButton="bg-theme14-primary"
          colorButton="text-white"
          colorHeading="text-gray-900"
          labelColor="text-gray-600"
        />
      </div>

      {/* ── Ucapan List — redesigned cards ── */}
      <div className="py-14 px-5" style={{ background: BG }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-center mb-8"
        >
          <SectionHeading>Doa &amp; Ucapan</SectionHeading>
        </motion.div>

        <div className="flex flex-col gap-4">
          {ucapan?.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">
              Jadilah yang pertama mengirimkan doa
              <br />
              untuk calon pengantin
            </p>
          )}
          {ucapan?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: false }}
            >
              {/* Ucapan card — quote style with gradient avatar */}
              <div className="bg-white rounded-3xl shadow-sm p-5 relative overflow-hidden">
                {/* Large faint quote mark decoration */}
                <span
                  className="absolute top-2 right-4 text-6xl font-serif leading-none text-theme14-primary/8 pointer-events-none select-none"
                  aria-hidden
                >
                  &ldquo;
                </span>
                {/* Header: gradient avatar + name */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, #6C52D9, #9B8FE0)`,
                    }}
                  >
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm font-recoleta-alt leading-tight">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <IconMessageCircle size={10} className="text-theme14-secondary" />
                      <p className="text-[10px] text-theme14-secondary font-medium">Ucapan</p>
                    </div>
                  </div>
                </div>
                {/* Message */}
                <div
                  className="text-gray-500 text-xs leading-relaxed pl-12"
                  dangerouslySetInnerHTML={{ __html: nl2br(item.message) }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-theme14-primary/10 flex flex-col items-center gap-2">
          <img
            src="/images/kekawinan-logo.png"
            alt=""
            className="w-[36%] mx-auto opacity-25"
            style={{ filter: "sepia(1) saturate(1.5) hue-rotate(220deg)" }}
          />
          <p className="text-gray-300 text-xs">Part of CTRL Spark</p>
        </div>
      </div>

      {/* ── Floating Controls ── */}
      <FloatingMusicGift
        onPlayMusic={onPlayMusic}
        isPlayMusic={isPlayMusic}
        onOpenGift={() => setIsOpenGift(true)}
        bgColor="bg-theme14-primary"
        giftLength={giftLength}
        slug={slug}
        tamuId={tamu?.id}
      />

      <DialogGift
        gifts={undanganData.gifts}
        isOpen={isOpenGift}
        setIsOpen={setIsOpenGift}
        giftLength={giftLength}
        slug={slug}
        buttonBg="bg-theme14-primary"
      />
    </div>
  );
}
