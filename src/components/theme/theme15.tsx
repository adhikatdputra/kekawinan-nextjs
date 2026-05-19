"use client";

import { useEffect, useState } from "react";
import {
  UndanganDetail,
  UndanganTamu,
  UndanganUcapan,
} from "@/frontend/interface/undangan";
import { IconMapPin, IconDeviceTvOld, IconHeart, IconClock } from "@tabler/icons-react";
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

// ─── Color constants ────────────────────────────────────────────────
const TEAL = "#4A7B70";
const DARK_TEAL = "#1E3D36";
const MID_TEAL = "#2D5E53";
const GOLD = "#C49A3C";
const LIGHT_GOLD = "#D4B060";

// ─── Zigzag / batik chevron pattern (SVG background) ───────────────
function ZigzagPattern({ opacity = 0.18 }: { opacity?: number }) {
  // SVG chevron tile 80×40px
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='40' viewBox='0 0 80 40'>
    <polyline points='0,20 20,0 40,20 60,0 80,20' fill='none' stroke='${encodeURIComponent(LIGHT_GOLD)}' stroke-width='1.5'/>
    <polyline points='0,40 20,20 40,40 60,20 80,40' fill='none' stroke='${encodeURIComponent(LIGHT_GOLD)}' stroke-width='1.5'/>
    <polygon points='40,6 44,12 40,18 36,12' fill='${encodeURIComponent("#8B6914")}' fill-opacity='0.5'/>
  </svg>`;
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,${svg}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "80px 40px",
        opacity,
      }}
    />
  );
}

// ─── SVG Palm tree silhouette ───────────────────────────────────────
function PalmTree({
  height = 260,
  flip = false,
  opacity = 0.28,
}: {
  height?: number;
  flip?: boolean;
  opacity?: number;
}) {
  return (
    <svg
      width={height * 0.5}
      height={height}
      viewBox="0 0 100 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity, transform: flip ? "scaleX(-1)" : undefined, flexShrink: 0 }}
    >
      {/* Trunk */}
      <path d="M48 200 C46 160 50 120 52 80 C54 120 50 160 52 200Z" fill={DARK_TEAL} />
      <path d="M48 200 C47 175 49 150 50 125 C51 150 53 175 52 200Z" fill={MID_TEAL} />
      {/* Large fronds */}
      <path d="M52 80 C30 70 5 50 0 30 C20 45 40 60 52 80Z" fill={DARK_TEAL} />
      <path d="M52 80 C70 60 95 35 100 10 C80 30 62 55 52 80Z" fill={DARK_TEAL} />
      <path d="M52 80 C35 55 20 25 25 0 C38 28 48 55 52 80Z" fill={MID_TEAL} />
      <path d="M52 80 C68 55 82 28 78 5 C65 30 55 55 52 80Z" fill={MID_TEAL} />
      <path d="M52 80 C20 75 -5 70 -5 55 C15 62 35 70 52 80Z" fill={DARK_TEAL} />
      <path d="M52 80 C82 72 108 65 110 50 C90 58 70 68 52 80Z" fill={DARK_TEAL} />
      {/* Coconuts */}
      <circle cx="44" cy="88" r="5" fill="#8B5E2A" />
      <circle cx="54" cy="92" r="5" fill="#7A5222" />
      <circle cx="50" cy="84" r="4" fill="#9B6B32" />
    </svg>
  );
}

// ─── Gold arch frame SVG border ─────────────────────────────────────
function ArchFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Arch-shaped clip container */}
      <div
        className="overflow-hidden"
        style={{
          borderRadius: "48% 48% 4px 4px / 30% 30% 4px 4px",
          border: `4px solid ${GOLD}`,
          boxShadow: `0 0 0 2px ${DARK_TEAL}, 0 0 0 6px ${GOLD}`,
        }}
      >
        {children}
      </div>
      {/* Gold corner ornaments */}
      <div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-semibold tracking-widest"
        style={{ color: GOLD, background: TEAL }}
      >
        ✦ ✦ ✦
      </div>
    </div>
  );
}

// ─── Section label (gold serif, with flanking lines) ────────────────
function GoldLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-px" style={{ background: light ? "rgba(196,154,60,0.5)" : GOLD }} />
        <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: light ? "rgba(196,154,60,0.8)" : GOLD }}>
          ✦
        </span>
        <div className="w-10 h-px" style={{ background: light ? "rgba(196,154,60,0.5)" : GOLD }} />
      </div>
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.28em]"
        style={{ color: light ? "rgba(255,255,255,0.65)" : GOLD }}
      >
        {children}
      </p>
    </div>
  );
}

export default function Theme15({
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
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: TEAL }}
      >
        <ZigzagPattern opacity={0.15} />

        {/* Palm trees on both sides */}
        <div className="absolute top-0 left-[-10px] pointer-events-none z-0">
          <PalmTree height={300} opacity={0.35} />
        </div>
        <div className="absolute top-0 right-[-10px] pointer-events-none z-0">
          <PalmTree height={300} flip opacity={0.35} />
        </div>

        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center pt-14 px-6 pb-4"
        >
          <p className="text-sm tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "Georgia, serif" }}>
            Wedding Invitation
          </p>
          <h1
            className="text-5xl font-bold leading-tight mt-1 font-recoleta-alt"
            style={{ color: GOLD, textShadow: `0 2px 8px rgba(0,0,0,0.2)` }}
          >
            {undanganData?.content?.title}
          </h1>
          {undanganData?.content?.hashtag && (
            <p className="text-sm mt-2" style={{ color: DARK_TEAL, fontStyle: "italic" }}>
              #{undanganData.content.hashtag}
            </p>
          )}
          <p className="text-xs mt-1 tracking-widest" style={{ color: "rgba(255,255,255,0.6)" }}>
            {formatDateId(undanganData?.content?.dateWedding ?? "")}
          </p>
        </motion.div>

        {/* Couple photo in arch frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative z-10 px-20 pb-2 flex flex-col items-center"
        >
          <ArchFrame>
            <div className="w-full aspect-[3/4] relative">
              <img
                src={undanganData?.content?.imgBg}
                alt="couple"
                className="w-full h-full object-cover"
              />
              {/* Inner gradient overlay at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1/3"
                style={{ background: `linear-gradient(to top, ${TEAL}CC, transparent)` }}
              />
            </div>
          </ArchFrame>
        </motion.div>

        {/* Bottom chevron area + guest card + button */}
        <div className="relative z-10 mt-8 pb-10 px-5 flex flex-col gap-3">
          {/* Guest card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="rounded-2xl p-4"
            style={{
              background: `linear-gradient(135deg, ${DARK_TEAL}EE, ${MID_TEAL}EE)`,
              border: `1px solid ${GOLD}55`,
            }}
          >
            <p className="text-[10px] uppercase tracking-[0.22em] mb-0.5" style={{ color: `${GOLD}99` }}>Kepada Yth.</p>
            <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>Bapak/Ibu/Saudara/i</p>
            <div className="flex items-center gap-2">
              <div className="w-1 h-7 rounded-full" style={{ background: GOLD }} />
              <p className="text-lg font-bold font-recoleta-alt text-white">
                {tamuData?.name || "Tamu Spesial"}
              </p>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="w-full h-12 rounded-2xl font-bold text-sm"
            style={{ background: GOLD, color: DARK_TEAL }}
            onClick={() => {
              setIsCoverUndangan(false);
              onPlayMusic();
            }}
          >
            Buka Undangan
          </motion.button>
        </div>

        <FloatingQrButton
          tamu={tamu}
          tamuId={tamu?.id ?? ""}
          slug={slug}
          content={undangan?.content ?? null}
          bgColor="bg-white"
          iconColor="text-theme15-secondary"
        />
      </div>
    );
  }

  // ── MAIN CONTENT ──────────────────────────────────────────────────
  return (
    <div style={{ background: TEAL }}>

      {/* ── Hero ── */}
      <div
        className="relative min-h-screen bg-cover bg-center overflow-hidden flex flex-col justify-end"
        style={{ backgroundImage: `url(${undangan?.content?.imgBg})` }}
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${TEAL}22 0%, transparent 40%, ${DARK_TEAL}CC 80%, ${DARK_TEAL} 100%)`,
          }}
        />

        <ZigzagPattern opacity={0.08} />

        {/* Botanical on sides */}
        <div className="absolute bottom-32 left-0 pointer-events-none z-10">
          <img src="/images/theme3/daunkiri.png" alt="" className="w-28 object-contain opacity-90" />
        </div>
        <div className="absolute bottom-32 right-0 pointer-events-none z-10">
          <img src="/images/theme3/daunkanan.png" alt="" className="w-28 object-contain opacity-90" />
        </div>

        <div className="relative z-20 text-center px-6 pb-12 flex flex-col items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="rounded-full px-4 py-1.5"
              style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}55` }}
            >
              <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: GOLD }}>
                Undangan Pernikahan
              </span>
            </div>
            <h2 className="text-4xl font-bold font-recoleta-alt text-white leading-tight">
              {undangan?.content?.title}
            </h2>
            <p className="text-sm tracking-wider" style={{ color: "rgba(255,255,255,0.65)" }}>
              {formatDateId(undangan?.content?.dateWedding ?? "")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Ayat Section ── */}
      <div className="relative px-5 py-14 overflow-hidden" style={{ background: TEAL }}>
        <ZigzagPattern opacity={0.18} />

        {/* Palm trees flanking */}
        <div className="absolute top-0 left-[-15px] pointer-events-none z-0">
          <PalmTree height={220} opacity={0.3} />
        </div>
        <div className="absolute top-0 right-[-15px] pointer-events-none z-0">
          <PalmTree height={220} flip opacity={0.3} />
        </div>

        {/* Dark teal quote card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="relative z-10"
        >
          <div
            className="rounded-3xl p-7 text-center relative overflow-hidden"
            style={{ background: DARK_TEAL, border: `1px solid ${GOLD}40` }}
          >
            <p className="text-4xl leading-none mb-2" style={{ color: `${GOLD}40` }}>&ldquo;</p>
            <p className="text-sm leading-7 text-white/80 italic">
              Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
              untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung
              dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu
              rasa kasih dan sayang.
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="w-6 h-px" style={{ background: `${GOLD}55` }} />
              <p className="text-xs font-semibold tracking-widest" style={{ color: GOLD }}>
                Q.S. Ar-Rum: 21
              </p>
              <div className="w-6 h-px" style={{ background: `${GOLD}55` }} />
            </div>
          </div>

          {/* Flower clusters at corners of card */}
          <div className="absolute -bottom-8 -left-4 pointer-events-none z-10">
            <img src="/images/theme3/bunga.png" alt="" className="w-28 object-contain" style={{ filter: "saturate(1.1)" }} />
          </div>
          <div className="absolute -bottom-8 -right-4 pointer-events-none z-10">
            <img src="/images/theme3/bunga.png" alt="" className="w-28 object-contain" style={{ transform: "scaleX(-1)", filter: "saturate(1.1)" }} />
          </div>
        </motion.div>

        {/* "The Wedding Of" heading below card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: false }}
          className="relative z-0 text-center mt-16 px-4"
        >
          <h2
            className="text-4xl font-bold font-recoleta-alt"
            style={{ color: GOLD }}
          >
            The Wedding Of
          </h2>
          <h3 className="text-2xl font-bold font-recoleta-alt text-white/90 mt-1">
            {undangan?.content?.title}
          </h3>
          <div className="mt-5 space-y-1">
            <p className="text-white/65 text-xs leading-relaxed">
              Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
            </p>
            <p className="text-white/55 text-xs leading-relaxed px-4">
              Dengan rahmat Allah SWT, kami mengundang Bapak/Ibu untuk
              menghadiri pernikahan kami.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Mempelai ── */}
      <div className="relative px-5 py-14 overflow-hidden" style={{ background: MID_TEAL }}>
        <ZigzagPattern opacity={0.12} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-center mb-10 relative z-10"
        >
          <GoldLabel light>Mempelai</GoldLabel>
        </motion.div>

        {/* Bismillah */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false }}
          className="text-center mb-10 relative z-10"
        >
          <img
            src="/images/theme1/bismillah.png"
            alt=""
            className="h-9 mx-auto opacity-40"
            style={{ filter: "invert(1)" }}
          />
        </motion.div>

        {/* Couple cards — side-by-side portrait style */}
        <div className="flex gap-4 relative z-10">
          {/* Female */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: false }}
            className="flex-1"
          >
            <div
              className="rounded-3xl overflow-hidden"
              style={{ background: DARK_TEAL, border: `1px solid ${GOLD}40` }}
            >
              {/* Portrait photo */}
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <img
                  src={undangan?.content?.imgFemale}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-1/2"
                  style={{ background: `linear-gradient(to top, ${DARK_TEAL}, transparent)` }}
                />
              </div>
              {/* Info */}
              <div className="px-3 pt-1 pb-4 text-center -mt-6 relative z-10">
                <p className="text-[8px] uppercase tracking-[0.2em] font-semibold" style={{ color: GOLD }}>
                  Mempelai Wanita
                </p>
                <h5 className="text-white font-bold text-base font-recoleta-alt leading-tight mt-0.5">
                  {undangan?.content?.nameFemale}
                </h5>
                <p className="text-white/45 text-[10px] mt-1 leading-relaxed">
                  Putri {undangan?.content?.femaleNo}
                  <br />
                  {undangan?.content?.fatherFemale} &amp; {undangan?.content?.motherFemale}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="flex flex-col items-center justify-center gap-2 shrink-0">
            <div className="flex-1 w-px" style={{ background: `${GOLD}30` }} />
            <span className="text-2xl font-bold font-recoleta-alt" style={{ color: GOLD }}>&amp;</span>
            <div className="flex-1 w-px" style={{ background: `${GOLD}30` }} />
          </div>

          {/* Male */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: false }}
            className="flex-1"
          >
            <div
              className="rounded-3xl overflow-hidden"
              style={{ background: DARK_TEAL, border: `1px solid ${GOLD}40` }}
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <img
                  src={undangan?.content?.imgMale}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-1/2"
                  style={{ background: `linear-gradient(to top, ${DARK_TEAL}, transparent)` }}
                />
              </div>
              <div className="px-3 pt-1 pb-4 text-center -mt-6 relative z-10">
                <p className="text-[8px] uppercase tracking-[0.2em] font-semibold" style={{ color: LIGHT_GOLD }}>
                  Mempelai Pria
                </p>
                <h5 className="text-white font-bold text-base font-recoleta-alt leading-tight mt-0.5">
                  {undangan?.content?.nameMale}
                </h5>
                <p className="text-white/45 text-[10px] mt-1 leading-relaxed">
                  Putra {undangan?.content?.maleNo}
                  <br />
                  {undangan?.content?.fatherMale} &amp; {undangan?.content?.motherMale}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Acara / Event (Image #12 style) ── */}
      <div className="relative px-5 py-14 overflow-hidden" style={{ background: TEAL }}>
        <ZigzagPattern opacity={0.18} />

        {/* Botanical on upper sides */}
        <div className="absolute top-4 left-0 pointer-events-none z-0">
          <img src="/images/theme3/flower1.png" alt="" className="w-32 object-contain opacity-90" style={{ filter: "saturate(1.1) brightness(0.95)" }} />
        </div>
        <div className="absolute top-4 right-0 pointer-events-none z-0">
          <img src="/images/theme3/flower2.png" alt="" className="w-32 object-contain opacity-90" style={{ filter: "saturate(1.1) brightness(0.95)", transform: "scaleX(-1)" }} />
        </div>

        {/* "It's Wedding Day" heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false }}
          className="relative z-10 text-center mb-4 pt-8"
        >
          <h2 className="text-4xl font-bold font-recoleta-alt" style={{ color: GOLD }}>
            It&apos;s Wedding Day
          </h2>
          <p className="text-white/60 text-xs mt-2 tracking-wider">
            We cordially invite you to attend our wedding
          </p>
        </motion.div>

        {/* Date */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: false }}
          className="relative z-10 text-center mb-10"
        >
          <SaveTheDate
            targetDate={undangan?.content?.dateWedding ?? ""}
            primaryColor="text-white"
            secondaryColor="text-white"
            cardBg="bg-white/10 border border-white/20"
            accentBg="bg-white"
          />
        </motion.div>

        {/* Akad Nikah — dark arch card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: false }}
          className="relative z-10 mb-4"
        >
          <div
            className="rounded-[40px] p-7 text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(160deg, ${DARK_TEAL} 0%, ${MID_TEAL} 100%)`,
              border: `1px solid ${GOLD}30`,
            }}
          >
            {/* Ring icon */}
            <div className="flex justify-center mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ border: `2px solid ${GOLD}60` }}
              >
                <span style={{ color: GOLD, fontSize: "22px" }}>💍</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold font-recoleta-alt mb-3" style={{ color: GOLD }}>
              Akad Nikah
            </h3>
            <div className="space-y-2">
              <p className="text-white/80 text-sm font-semibold">
                {undangan?.content?.akadTime}
              </p>
              <div
                className="text-white/60 text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: nl2br(undangan?.content?.akadPlace) }}
              />
            </div>
          </div>
        </motion.div>

        {/* Resepsi card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: false }}
          className="relative z-10 mb-6"
        >
          <div
            className="rounded-[40px] p-7 text-center relative overflow-hidden"
            style={{
              background: `linear-gradient(160deg, ${DARK_TEAL} 0%, ${MID_TEAL} 100%)`,
              border: `1px solid ${GOLD}30`,
            }}
          >
            <div className="flex justify-center mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ border: `2px solid ${GOLD}60` }}
              >
                <IconHeart size={22} style={{ color: GOLD }} />
              </div>
            </div>
            <h3 className="text-2xl font-bold font-recoleta-alt mb-3" style={{ color: GOLD }}>
              Resepsi Pernikahan
            </h3>
            <div className="space-y-2">
              <p className="text-white/80 text-sm font-semibold">
                {undangan?.content?.resepsiTime}
              </p>
              <div
                className="text-white/60 text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: nl2br(undangan?.content?.resepsiPlace) }}
              />
            </div>
          </div>
        </motion.div>

        {/* Botanical flanking the bottom arch */}
        <div className="absolute bottom-28 left-0 pointer-events-none z-0">
          <img src="/images/theme3/bunga1.png" alt="" className="w-32 object-contain" style={{ filter: "saturate(1.1)" }} />
        </div>
        <div className="absolute bottom-28 right-0 pointer-events-none z-0">
          <img src="/images/theme3/bunga2.png" alt="" className="w-32 object-contain" style={{ filter: "saturate(1.1)", transform: "scaleX(-1)" }} />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 relative z-10">
          <Link href={undangan?.content?.gmaps ?? ""} target="_blank">
            <button
              className="w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
              style={{ background: GOLD, color: DARK_TEAL }}
            >
              <IconMapPin size={15} />
              View Maps
            </button>
          </Link>
          {undangan?.content?.streamLink && (
            <Link href={undangan?.content?.streamLink ?? ""} target="_blank">
              <button
                className="w-full h-11 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{
                  border: `1px solid ${GOLD}55`,
                  color: GOLD,
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                <IconDeviceTvOld size={15} />
                Live Streaming
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* ── Love Story ── */}
      <div style={{ background: DARK_TEAL }}>
        <div className="px-5 pt-14 pb-4 text-center relative">
          <ZigzagPattern opacity={0.08} />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            className="relative z-10"
          >
            <GoldLabel>Love Story</GoldLabel>
          </motion.div>
        </div>
        <LoveStoryCards
          loveStories={undanganData.loveStories ?? []}
          primaryColor="text-theme15-primary"
          accentBg="bg-theme15-primary"
          textColor="text-white/80"
          mutedColor="text-white/40"
          cardBg="bg-white/8 shadow-md border border-white/10"
          sectionTitle=""
          sectionBg="bg-[#1E3D36]"
        />
      </div>

      {/* ── Gallery ── */}
      <div className="py-14 relative overflow-hidden" style={{ background: MID_TEAL }}>
        <ZigzagPattern opacity={0.12} />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="px-5 mb-8 text-center relative z-10"
        >
          <GoldLabel light>Galeri</GoldLabel>
        </motion.div>
        <div className="relative z-10">
          <GaleriCards
            galeri={undanganData.gallery}
            accentColor={GOLD}
          />
        </div>
      </div>

      {/* ── Ucapan Form ── */}
      <div className="relative overflow-hidden" style={{ background: DARK_TEAL }}>
        <ZigzagPattern opacity={0.08} />
        <div className="relative z-10">
          <UcapanConfirm
            tamu={tamu ?? tamuData}
            isLoading={isSubmitting}
            onSubmit={({ data }) => onSubmitUcapan(data)}
            bgColor="bg-transparent"
            fontHeading="font-recoleta-alt"
            bgButton="bg-theme15-primary"
            colorButton="text-white"
            colorHeading="text-white"
            labelColor="text-white/70"
          />
        </div>
      </div>

      {/* ── Ucapan List ── */}
      <div className="py-14 px-5 relative overflow-hidden" style={{ background: TEAL }}>
        <ZigzagPattern opacity={0.15} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-center mb-8 relative z-10"
        >
          <GoldLabel>Doa &amp; Ucapan</GoldLabel>
        </motion.div>

        <div className="flex flex-col gap-4 relative z-10">
          {ucapan?.length === 0 && (
            <p className="text-white/40 text-sm text-center py-8">
              Jadilah yang pertama mengirimkan doa
              <br />
              untuk calon pengantin
            </p>
          )}
          {ucapan?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: false }}
            >
              <div
                className="rounded-3xl p-5"
                style={{
                  background: `${DARK_TEAL}CC`,
                  border: `1px solid ${GOLD}25`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{ background: `${GOLD}30`, color: GOLD }}
                  >
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm font-recoleta-alt leading-tight">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <IconClock size={9} style={{ color: `${GOLD}80` }} />
                      <p className="text-[10px]" style={{ color: `${GOLD}80` }}>Ucapan</p>
                    </div>
                  </div>
                </div>
                <div
                  className="text-white/55 text-xs leading-relaxed pl-12"
                  dangerouslySetInnerHTML={{ __html: nl2br(item.message) }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="mt-10 pt-6 flex flex-col items-center gap-2 relative z-10"
          style={{ borderTop: `1px solid ${GOLD}20` }}
        >
          <img
            src="/images/kekawinan-logo.png"
            alt=""
            className="w-[36%] mx-auto"
            style={{ opacity: 0.3, filter: "brightness(2)" }}
          />
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Part of CTRL Spark</p>
        </div>
      </div>

      {/* ── Floating Controls ── */}
      <FloatingMusicGift
        onPlayMusic={onPlayMusic}
        isPlayMusic={isPlayMusic}
        onOpenGift={() => setIsOpenGift(true)}
        bgColor="bg-theme15-primary"
        iconColor="text-white"
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
        buttonBg="bg-theme15-primary"
      />
    </div>
  );
}
