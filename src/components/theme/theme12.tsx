"use client";

import { useEffect, useState } from "react";
import {
  UndanganDetail,
  UndanganTamu,
  UndanganUcapan,
} from "@/frontend/interface/undangan";
import { Button } from "../ui/button";
import { IconDeviceTvOld, IconMapPin, IconSparkles } from "@tabler/icons-react";

import DialogGift from "@/components/card/dialog-gift";
import GaleriMasonry from "@/components/card/galeri-masonry";
import LoveStoryCards from "@/components/card/love-story-cards";
import { FloatingMusicGift } from "../card/floating-music-gift";
import { FloatingQrButton } from "@/components/card/floating-qr-button";
import SaveTheDate from "@/components/card/save-the-date";
import UcapanConfirm from "@/components/card/ucapan-confirm";
import { motion } from "motion/react";
import { formatDateId } from "@/helper/date";
import { nl2br } from "@/helper/text";
import Link from "next/link";

// ─── Gradient orb background decoration ───────────────────────────
function GradientOrbs() {
  return (
    <>
      <div className="pointer-events-none absolute top-0 right-[-40px] w-[280px] h-[280px] rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)" }}
      />
      <div className="pointer-events-none absolute bottom-0 left-[-40px] w-[220px] h-[220px] rounded-full blur-[80px]"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)" }}
      />
    </>
  );
}

// ─── Glass card wrapper ─────────────────────────────────────────────
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(124,58,237,0.06) 100%)",
        backdropFilter: "blur(16px)",
      }}
    >
      {children}
    </div>
  );
}

const T12_BG = "#0F0824";

export default function Theme12({
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

  useEffect(() => {
    setUndangan(undanganData);
  }, [undanganData]);

  useEffect(() => {
    setTamu(tamuData);
  }, [tamuData]);

  // ── COVER ──────────────────────────────────────────────────────────
  if (isCoverUndangan) {
    return (
      <div
        className="relative h-screen flex flex-col justify-between items-center overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${T12_BG} 0%, #1A0A3E 40%, #2A0A3E 70%, #0F0824 100%)`,
        }}
      >
        {/* Background orbs */}
        <div className="absolute top-[-60px] right-[-60px] w-[340px] h-[340px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)" }}
        />
        <div className="absolute bottom-[100px] left-[-60px] w-[280px] h-[280px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.28) 0%, transparent 70%)" }}
        />
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)" }}
        />

        {/* Floating sparkles */}
        {Array(8).fill(null).map((_, i) => (
          <div className="snowflake z-9" key={i}>
            <IconSparkles
              size={i % 2 === 0 ? 10 : 7}
              className="text-theme12-secondary opacity-40"
            />
          </div>
        ))}

        {/* Top content */}
        <div className="relative z-10 text-center pt-16 px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: false }}
            className="flex flex-col items-center gap-4"
          >
            {/* Badge */}
            <div className="flex items-center gap-2 rounded-full px-4 py-1.5 border border-theme12-primary/30"
              style={{ background: "rgba(124,58,237,0.12)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-theme12-secondary animate-pulse" />
              <span className="text-theme12-secondary text-[10px] font-medium tracking-widest uppercase">
                Undangan Pernikahan
              </span>
            </div>

            {/* BG photo circle */}
            {undanganData?.content?.imgBg && (
              <div className="relative mt-2">
                <div className="absolute inset-[-4px] rounded-full"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899, #6366F1)", padding: "2px" }}
                />
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-transparent relative z-10"
                  style={{ background: `linear-gradient(135deg, #7C3AED, #EC4899) padding-box, linear-gradient(135deg, #7C3AED, #EC4899) border-box` }}
                >
                  <img
                    src={undanganData?.content?.imgBg}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className="absolute inset-0 rounded-full"
                    style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(236,72,153,0.2) 100%)" }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col items-center gap-1 mt-1">
              <h1 className="text-4xl font-bold text-white font-recoleta-alt leading-tight">
                {undanganData?.content?.title}
              </h1>
              <p className="text-white/40 text-xs tracking-[0.2em] uppercase">
                {formatDateId(undanganData?.content?.dateWedding ?? "")}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom: guest card + button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: false }}
          className="relative z-10 w-full px-5 mb-14 flex flex-col gap-3"
        >
          <GlassCard className="p-5">
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-1">Kepada Yth.</p>
            <p className="text-white/50 text-xs mb-2">Bapak/Ibu/Saudara/i</p>
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 rounded-full"
                style={{ background: "linear-gradient(to bottom, #7C3AED, #EC4899)" }}
              />
              <p className="text-white text-xl font-semibold font-recoleta-alt">
                {tamuData?.name || "Tamu Spesial"}
              </p>
            </div>
          </GlassCard>

          <button
            className="w-full h-12 rounded-xl font-bold text-white text-sm tracking-wide"
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)",
              boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
            }}
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
          bgColor="bg-theme12-primary"
          iconColor="text-white"
        />
      </div>
    );
  }

  // ── MAIN CONTENT ───────────────────────────────────────────────────
  return (
    <div style={{ background: T12_BG }}>

      {/* ── Hero Section ── */}
      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-5 py-12 gap-8"
        style={{ background: "linear-gradient(160deg, #0F0824 0%, #1A0840 45%, #0F0824 100%)" }}
      >
        {/* Background orbs */}
        <div className="pointer-events-none absolute top-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full blur-[110px]"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)" }}
        />
        <div className="pointer-events-none absolute bottom-[80px] left-[-60px] w-[260px] h-[260px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.22) 0%, transparent 70%)" }}
        />

        {/* Photo card with glow ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: false }}
          className="relative z-10 w-full"
          style={{ maxWidth: "300px" }}
        >
          {/* Glow blur behind the card */}
          <div
            className="absolute inset-[-8px] rounded-[34px] blur-2xl pointer-events-none opacity-70"
            style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)" }}
          />
          {/* Gradient border ring */}
          <div
            className="absolute inset-[-2px] rounded-[28px] pointer-events-none"
            style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7, #EC4899)" }}
          />
          {/* Photo */}
          <div className="relative rounded-[26px] overflow-hidden" style={{ aspectRatio: "3/4" }}>
            <img
              src={undangan?.content?.imgBg}
              alt=""
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(15,8,36,0.5) 100%)" }}
            />
          </div>
        </motion.div>

        {/* Text block — centered under photo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
          viewport={{ once: false }}
          className="relative z-10 flex flex-col items-center gap-3 text-center"
        >
          {/* Badge pill */}
          <div
            className="flex items-center gap-1.5 rounded-full px-4 py-1.5"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-theme12-secondary animate-pulse shrink-0" />
            <span className="text-theme12-secondary text-[9px] tracking-[0.25em] uppercase font-semibold">
              Undangan Pernikahan
            </span>
          </div>

          {/* Couple name */}
          <h2
            className="text-[2.6rem] font-bold font-recoleta-alt leading-tight"
            style={{ background: "linear-gradient(135deg, #ffffff 30%, #DDD6FE 70%, #F9A8D4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {undangan?.content?.title}
          </h2>

          {/* Thin divider */}
          <div className="w-10 h-px opacity-40"
            style={{ background: "linear-gradient(to right, #7C3AED, #EC4899)" }}
          />

          {/* Date */}
          <p className="text-white/55 text-xs tracking-widest font-medium">
            {formatDateId(undangan?.content?.dateWedding ?? "")}
          </p>

          {/* Ayat */}
          <p className="text-white/25 text-[10px] leading-relaxed max-w-[240px]">
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
            istri-istri dari jenismu sendiri." — Q.S Ar-Rum: 21
          </p>
        </motion.div>
      </div>

      {/* ── Mempelai Section ── */}
      <div className="relative px-5 py-16 overflow-hidden" style={{ background: T12_BG }}>
        <GradientOrbs />

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-6 h-px"
            style={{ background: "linear-gradient(to right, #7C3AED, #EC4899)" }}
          />
          <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-white/50">
            Mempelai
          </span>
        </motion.div>

        {/* Bismillah */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: false }}
          className="text-center mb-10"
        >
          <img
            src="/images/theme1/bismillah.png"
            alt=""
            className="h-10 mx-auto contrast-0 brightness-200 opacity-50"
          />
          <p className="text-white/40 text-xs mt-3">
            Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="text-white/30 text-xs mt-2 leading-relaxed px-4">
            Dengan rahmat Allah SWT, kami mengundang Bapak/Ibu untuk menghadiri
            pernikahan kami.
          </p>
        </motion.div>

        {/* Couple photos + names */}
        <div className="flex flex-col gap-5">
          {/* Female */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: false }}
          >
            <GlassCard className="p-5 flex items-center gap-4">
              {/* Photo with gradient ring */}
              <div className="relative shrink-0">
                <div className="absolute inset-[-2px] rounded-xl"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)" }}
                />
                <img
                  src={undangan?.content?.imgFemale}
                  alt=""
                  className="w-20 h-20 object-cover rounded-xl relative z-10"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">Mempelai Wanita</p>
                <h5 className="text-white font-bold text-lg font-recoleta-alt leading-tight">
                  {undangan?.content?.nameFemale}
                </h5>
                <p className="text-white/35 text-xs mt-1 leading-relaxed">
                  Putri {undangan?.content?.femaleNo}
                  <br />
                  {undangan?.content?.fatherFemale} &amp; {undangan?.content?.motherFemale}
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* And divider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: false }}
            className="flex items-center justify-center gap-4"
          >
            <div className="flex-1 h-px"
              style={{ background: "linear-gradient(to right, transparent, rgba(124,58,237,0.4))" }}
            />
            <span
              className="text-4xl font-bold font-recoleta-alt"
              style={{ background: "linear-gradient(135deg, #A78BFA, #F472B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              &amp;
            </span>
            <div className="flex-1 h-px"
              style={{ background: "linear-gradient(to left, transparent, rgba(236,72,153,0.4))" }}
            />
          </motion.div>

          {/* Male */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: false }}
          >
            <GlassCard className="p-5 flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-[-2px] rounded-xl"
                  style={{ background: "linear-gradient(135deg, #EC4899, #7C3AED)" }}
                />
                <img
                  src={undangan?.content?.imgMale}
                  alt=""
                  className="w-20 h-20 object-cover rounded-xl relative z-10"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">Mempelai Pria</p>
                <h5 className="text-white font-bold text-lg font-recoleta-alt leading-tight">
                  {undangan?.content?.nameMale}
                </h5>
                <p className="text-white/35 text-xs mt-1 leading-relaxed">
                  Putra {undangan?.content?.maleNo}
                  <br />
                  {undangan?.content?.fatherMale} &amp; {undangan?.content?.motherMale}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* ── Event / Acara Section ── */}
      <div className="relative px-5 py-16 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0F0824 0%, #130929 50%, #0F0824 100%)" }}
      >
        {/* Orbs */}
        <div className="pointer-events-none absolute top-8 right-0 w-[220px] h-[220px] rounded-full blur-[90px]"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)" }}
        />
        <div className="pointer-events-none absolute bottom-8 left-0 w-[200px] h-[200px] rounded-full blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)" }}
        />

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-6 h-px"
            style={{ background: "linear-gradient(to right, #7C3AED, #EC4899)" }}
          />
          <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-white/50">
            Detail Acara
          </span>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: false }}
          className="mb-8"
        >
          <SaveTheDate
            targetDate={undangan?.content?.dateWedding ?? ""}
            primaryColor="text-theme12-secondary"
            secondaryColor="text-white"
            cardBg="bg-white/5 border border-white/10 backdrop-blur-md"
            accentBg="bg-theme12-primary"
          />
        </motion.div>

        {/* Event cards */}
        <div className="flex flex-col gap-4 relative z-10">
          {/* Akad */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: false }}
            className="relative rounded-2xl p-5 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(255,255,255,0.03) 100%)",
              borderLeft: "2px solid rgba(124,58,237,0.6)",
              border: "1px solid rgba(124,58,237,0.2)",
              borderLeftWidth: "2px",
              borderLeftColor: "rgba(124,58,237,0.7)",
            }}
          >
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[72px] font-black leading-none select-none pointer-events-none font-recoleta-alt"
              style={{ color: "rgba(124,58,237,0.07)" }}
            >
              01
            </span>
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 text-theme12-primary">
              Akad Nikah
            </p>
            <p className="text-white font-semibold text-base leading-snug">
              {undangan?.content?.akadTime}
            </p>
            <div
              className="text-white/40 text-xs mt-2 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: nl2br(undangan?.content?.akadPlace) }}
            />
          </motion.div>

          {/* Resepsi */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: false }}
            className="relative rounded-2xl p-5 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(236,72,153,0.2)",
              borderLeftWidth: "2px",
              borderLeftColor: "rgba(236,72,153,0.6)",
            }}
          >
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[72px] font-black leading-none select-none pointer-events-none font-recoleta-alt"
              style={{ color: "rgba(236,72,153,0.07)" }}
            >
              02
            </span>
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2 text-theme12-secondary">
              Resepsi Pernikahan
            </p>
            <p className="text-white/85 font-semibold text-base leading-snug">
              {undangan?.content?.resepsiTime}
            </p>
            <div
              className="text-white/40 text-xs mt-2 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: nl2br(undangan?.content?.resepsiPlace) }}
            />
          </motion.div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 mt-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: false }}
          >
            <Link href={undangan?.content?.gmaps ?? ""} target="_blank">
              <button
                className="w-full h-11 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
                }}
              >
                <IconMapPin size={16} />
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
                <Button
                  className="w-full bg-white/6 hover:bg-white/10 text-white border border-white/10 font-semibold rounded-xl h-11"
                >
                  <IconDeviceTvOld size={16} />
                  Live Streaming
                </Button>
              </Link>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: false }}
            className="text-white/25 text-xs text-center leading-relaxed mt-1"
          >
            Sebuah kehormatan apabila Bapak/Ibu berkenan hadir
            <br />
            dan memberikan doa restu.
          </motion.p>
        </div>
      </div>

      {/* ── Love Story ── */}
      <LoveStoryCards
        loveStories={undanganData.loveStories ?? []}
        primaryColor="text-theme12-primary"
        accentBg="bg-theme12-primary"
        textColor="text-white/85"
        mutedColor="text-white/45"
        cardBg="border border-white/8"
        sectionTitle="Love Story"
        sectionBg="relative overflow-hidden"
      />

      {/* ── Gallery ── */}
      <div className="py-14 relative overflow-hidden" style={{ background: T12_BG }}>
        <GradientOrbs />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="flex items-center gap-3 px-5 mb-8"
        >
          <div className="w-6 h-px"
            style={{ background: "linear-gradient(to right, #7C3AED, #EC4899)" }}
          />
          <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-white/50">
            Galeri
          </span>
        </motion.div>

        <GaleriMasonry
          galeri={undanganData.gallery}
          roundedClass="rounded-xl"
          overlayClass="bg-gradient-to-t from-purple-900/30 to-transparent"
        />
      </div>

      {/* ── Ucapan Form ── */}
      <UcapanConfirm
        tamu={tamu ?? tamuData}
        isLoading={isSubmitting}
        onSubmit={({ data }) => onSubmitUcapan(data)}
        bgColor="bg-[#130929]"
        fontHeading="font-recoleta-alt"
        bgButton="bg-theme12-primary"
        colorButton="text-white"
        colorHeading="text-white"
        labelColor="text-white/60"
      />

      {/* ── Ucapan List ── */}
      <div className="py-14 px-5 relative overflow-hidden" style={{ background: T12_BG }}>
        <GradientOrbs />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-6 h-px"
            style={{ background: "linear-gradient(to right, #7C3AED, #EC4899)" }}
          />
          <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-white/50">
            Doa &amp; Ucapan
          </span>
        </motion.div>

        <div className="flex flex-col gap-3 relative z-10">
          {ucapan?.length === 0 && (
            <p className="text-white/30 text-sm text-center py-8">
              Jadilah yang pertama mengirimkan doa
              <br />
              untuk calon pengantin
            </p>
          )}
          {ucapan?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: false }}
            >
              <GlassCard className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-sm"
                    style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.5), rgba(236,72,153,0.4))" }}
                  >
                    {item.name.charAt(0)}
                  </div>
                  <span className="text-white font-semibold text-sm font-recoleta-alt">
                    {item.name}
                  </span>
                </div>
                <div
                  className="text-white/45 text-xs leading-relaxed pl-11"
                  dangerouslySetInnerHTML={{ __html: nl2br(item.message) }}
                />
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-white/6 flex flex-col items-center gap-1">
          <img
            src="/images/kekawinan-logo.png"
            alt=""
            className="w-[36%] mx-auto contrast-0 brightness-200 opacity-30"
          />
          <p className="text-white/20 text-xs">Part of CTRL Spark</p>
        </div>
      </div>

      {/* ── Floating Controls ── */}
      <FloatingMusicGift
        onPlayMusic={onPlayMusic}
        isPlayMusic={isPlayMusic}
        onOpenGift={() => setIsOpenGift(true)}
        bgColor="bg-theme12-primary"
        darkMode={true}
        giftLength={giftLength}
        slug={slug}
      />

      <DialogGift
        gifts={undanganData.gifts}
        isOpen={isOpenGift}
        setIsOpen={setIsOpenGift}
        giftLength={giftLength}
        slug={slug}
        buttonBg="bg-theme12-primary"
      />
    </div>
  );
}
