"use client";

import { useEffect, useState } from "react";
import {
  UndanganDetail,
  UndanganTamu,
  UndanganUcapan,
} from "@/frontend/interface/undangan";
import { Button } from "../ui/button";
import { IconDeviceTvOld, IconMapPin, IconHeart } from "@tabler/icons-react";
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

// ─── Decorative flower blob (white, abstract 5-petal) ──────────────
function FlowerBlob({
  size = 120,
  opacity = 0.22,
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
      style={{ opacity, transform: `rotate(${rotate}deg)` }}
    >
      <path
        d="M50 10 C58 10 72 20 72 32 C72 44 62 50 50 50 C38 50 28 44 28 32 C28 20 42 10 50 10Z"
        fill={color}
      />
      <path
        d="M90 50 C90 58 80 72 68 72 C56 72 50 62 50 50 C50 38 56 28 68 28 C80 28 90 42 90 50Z"
        fill={color}
      />
      <path
        d="M50 90 C42 90 28 80 28 68 C28 56 38 50 50 50 C62 50 72 56 72 68 C72 80 58 90 50 90Z"
        fill={color}
      />
      <path
        d="M10 50 C10 42 20 28 32 28 C44 28 50 38 50 50 C50 62 44 72 32 72 C20 72 10 58 10 50Z"
        fill={color}
      />
      <circle cx="50" cy="50" r="14" fill={color} />
    </svg>
  );
}

// ─── Section label pill ─────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded-full bg-theme13-primary/15 flex items-center justify-center shrink-0">
        <IconHeart size={10} className="text-theme13-primary" />
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-theme13-primary">
        {children}
      </span>
    </div>
  );
}

// ─── Light card wrapper ─────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-3xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

const BG = "#FFF5F8";
const COVER_GRADIENT = "linear-gradient(170deg, #C2185B 0%, #E91E8C 25%, #F06292 55%, #F48FB1 80%, #FCE4EC 100%)";

export default function Theme13({
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
        {/* Pink gradient overlay on top of photo */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(194,24,91,0.18) 0%, rgba(233,30,140,0.30) 30%, rgba(240,98,146,0.60) 65%, rgba(233,30,140,0.88) 85%, rgba(194,24,91,0.95) 100%)",
          }}
        />

        {/* Flower blobs on top of overlay */}
        <div className="absolute top-[-20px] left-[-35px] pointer-events-none">
          <FlowerBlob size={180} opacity={0.22} rotate={-20} />
        </div>
        <div className="absolute top-[8%] right-[-45px] pointer-events-none">
          <FlowerBlob size={145} opacity={0.18} rotate={40} />
        </div>
        <div className="absolute top-[35%] left-[-20px] pointer-events-none">
          <FlowerBlob size={110} opacity={0.14} rotate={15} />
        </div>
        <div className="absolute top-[50%] right-[-15px] pointer-events-none">
          <FlowerBlob size={90} opacity={0.14} rotate={-30} />
        </div>
        <div className="absolute bottom-[28%] left-[15%] pointer-events-none">
          <FlowerBlob size={55} opacity={0.18} rotate={60} />
        </div>
        <div className="absolute bottom-[-30px] right-[-25px] pointer-events-none">
          <FlowerBlob size={170} opacity={0.16} rotate={-10} />
        </div>

        {/* Top spacer to push content down a bit */}
        <div className="pt-14" />

        {/* Middle: name + date (centered) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          viewport={{ once: false }}
          className="relative z-10 text-center px-6 flex flex-col items-center gap-2"
        >
          <p className="text-white/65 text-[10px] uppercase tracking-[0.3em] font-medium">
            Undangan Pernikahan
          </p>
          <h1 className="text-[2.8rem] font-bold text-white font-recoleta-alt leading-tight">
            {undanganData?.content?.title}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-8 h-px bg-white/40" />
            <p className="text-white/65 text-xs tracking-widest">
              {formatDateId(undanganData?.content?.dateWedding ?? "")}
            </p>
            <div className="w-8 h-px bg-white/40" />
          </div>
        </motion.div>

        {/* Bottom: gradient guest card + button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: false }}
          className="relative z-10 w-full px-5 mb-14 flex flex-col gap-3"
        >
          {/* Pink gradient guest card */}
          <div
            className="rounded-3xl p-5"
            style={{
              background: "linear-gradient(135deg, #C2185B 0%, #E91E8C 50%, #F48FB1 100%)",
              boxShadow: "0 8px 32px rgba(194,24,91,0.35)",
            }}
          >
            <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] mb-0.5">Kepada Yth.</p>
            <p className="text-white/70 text-xs mb-3">Bapak/Ibu/Saudara/i</p>
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 rounded-full bg-white/50" />
              <p className="text-white text-xl font-bold font-recoleta-alt">
                {tamuData?.name || "Tamu Spesial"}
              </p>
            </div>
          </div>

          <button
            className="w-full h-12 rounded-2xl font-bold text-theme13-primary text-sm bg-white shadow-md"
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
          iconColor="text-theme13-primary"
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
        {/* Pink gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(255,107,173,0.2) 0%, transparent 40%, rgba(255,245,248,0.9) 80%, #FFF5F8 100%)",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 flex flex-col items-center gap-3 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-theme13-primary animate-pulse" />
              <span className="text-theme13-primary text-[10px] font-semibold tracking-widest uppercase">
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
      <div
        className="relative px-8 py-12 text-center overflow-hidden"
        style={{ background: BG }}
      >
        {/* Subtle flower decorations */}
        <div className="absolute top-[-10px] left-[-20px] pointer-events-none opacity-10">
          <FlowerBlob size={120} color="#E91E8C" rotate={20} opacity={1} />
        </div>
        <div className="absolute bottom-[-10px] right-[-20px] pointer-events-none opacity-10">
          <FlowerBlob size={100} color="#E91E8C" rotate={-15} opacity={1} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false }}
          className="relative z-10"
        >
          <p className="text-gray-500 text-[11px] italic leading-7">
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
            untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung
            dan merasa tenteram kepadanya."
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="w-8 h-px bg-theme13-primary/30" />
            <p className="text-theme13-primary text-[10px] font-medium tracking-widest">
              Q.S Ar-Rum: 21
            </p>
            <div className="w-8 h-px bg-theme13-primary/30" />
          </div>
        </motion.div>
      </div>

      {/* ── Mempelai ── */}
      <div className="px-5 py-14" style={{ background: BG }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="mb-8"
        >
          <SectionLabel>Mempelai</SectionLabel>
        </motion.div>

        {/* Bismillah */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: false }}
          className="text-center mb-10"
        >
          <img
            src="/images/theme1/bismillah.png"
            alt=""
            className="h-9 mx-auto opacity-30"
            style={{ filter: "sepia(1) saturate(2) hue-rotate(290deg)" }}
          />
          <p className="text-gray-400 text-xs mt-3">
            Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="text-gray-400 text-xs mt-2 leading-relaxed px-4">
            Dengan rahmat Allah SWT, kami mengundang Bapak/Ibu untuk menghadiri
            pernikahan kami.
          </p>
        </motion.div>

        {/* Couple cards */}
        <div className="flex flex-col gap-4">
          {/* Female */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: false }}
          >
            <Card className="p-5 flex items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={undangan?.content?.imgFemale}
                  alt=""
                  className="w-20 h-20 object-cover rounded-2xl"
                />
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-theme13-primary flex items-center justify-center shadow-sm">
                  <span className="text-white text-[9px] font-black">♀</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-widest text-theme13-primary font-semibold mb-0.5">
                  Mempelai Wanita
                </p>
                <h5 className="text-gray-900 font-bold text-lg font-recoleta-alt leading-tight">
                  {undangan?.content?.nameFemale}
                </h5>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  Putri {undangan?.content?.femaleNo}
                  <br />
                  {undangan?.content?.fatherFemale} &amp; {undangan?.content?.motherFemale}
                </p>
              </div>
            </Card>
          </motion.div>

          {/* And divider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: false }}
            className="flex items-center justify-center gap-4"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-theme13-primary/25" />
            <div className="w-10 h-10 rounded-full bg-theme13-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-theme13-primary font-recoleta-alt">&amp;</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-theme13-secondary/25" />
          </motion.div>

          {/* Male */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: false }}
          >
            <Card className="p-5 flex items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={undangan?.content?.imgMale}
                  alt=""
                  className="w-20 h-20 object-cover rounded-2xl"
                />
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-theme13-secondary flex items-center justify-center shadow-sm">
                  <span className="text-white text-[9px] font-black">♂</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-widest text-theme13-secondary font-semibold mb-0.5">
                  Mempelai Pria
                </p>
                <h5 className="text-gray-900 font-bold text-lg font-recoleta-alt leading-tight">
                  {undangan?.content?.nameMale}
                </h5>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  Putra {undangan?.content?.maleNo}
                  <br />
                  {undangan?.content?.fatherMale} &amp; {undangan?.content?.motherMale}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* ── Acara / Event ── */}
      <div
        className="relative px-5 py-14 overflow-hidden"
        style={{ background: "linear-gradient(170deg, #C2185B 0%, #E91E8C 30%, #F06292 70%, #F48FB1 100%)" }}
      >
        {/* Flower blobs in bg */}
        <div className="absolute top-[-20px] right-[-30px] pointer-events-none opacity-20">
          <FlowerBlob size={160} rotate={30} />
        </div>
        <div className="absolute bottom-[-30px] left-[-20px] pointer-events-none opacity-15">
          <FlowerBlob size={140} rotate={-15} />
        </div>

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center shrink-0">
            <IconHeart size={10} className="text-white" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">
            Detail Acara
          </span>
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
            cardBg="bg-white/20 border border-white/30 backdrop-blur-sm"
            accentBg="bg-white"
          />
        </motion.div>

        {/* Event cards */}
        <div className="flex flex-col gap-4 relative z-10">
          {/* Akad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: false }}
          >
            <Card className="p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-5">
                <FlowerBlob size={80} color="#FF6BAD" rotate={20} opacity={1} />
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-theme13-primary mb-2">
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

          {/* Resepsi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: false }}
          >
            <Card className="p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-5">
                <FlowerBlob size={80} color="#C084FC" rotate={-20} opacity={1} />
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-theme13-secondary mb-2">
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

        {/* Action buttons */}
        <div className="flex flex-col gap-3 mt-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: false }}
          >
            <Link href={undangan?.content?.gmaps ?? ""} target="_blank">
              <button className="w-full h-11 rounded-2xl font-bold text-theme13-primary text-sm bg-white shadow-sm flex items-center justify-center gap-2">
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

      {/* ── Love Story ── */}
      <LoveStoryCards
        loveStories={undanganData.loveStories ?? []}
        primaryColor="text-theme13-primary"
        accentBg="bg-theme13-primary"
        textColor="text-gray-700"
        mutedColor="text-gray-400"
        cardBg="bg-white shadow-sm border-0"
        sectionTitle="Love Story"
        sectionBg="bg-[#FFF5F8]"
      />

      {/* ── Gallery ── */}
      <div className="py-14" style={{ background: BG }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="px-5 mb-8"
        >
          <SectionLabel>Galeri</SectionLabel>
        </motion.div>
        <GaleriCards
          galeri={undanganData.gallery}
          accentColor="#E91E8C"
        />
      </div>

      {/* ── Ucapan Form ── */}
      <UcapanConfirm
        tamu={tamu ?? tamuData}
        isLoading={isSubmitting}
        onSubmit={({ data }) => onSubmitUcapan(data)}
        bgColor="bg-white"
        fontHeading="font-recoleta-alt"
        bgButton="bg-theme13-primary"
        colorButton="text-white"
        colorHeading="text-gray-900"
        labelColor="text-gray-500"
      />

      {/* ── Ucapan List ── */}
      <div className="py-14 px-5" style={{ background: BG }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="mb-8"
        >
          <SectionLabel>Doa &amp; Ucapan</SectionLabel>
        </motion.div>

        <div className="flex flex-col gap-3">
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
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-2xl bg-theme13-primary/10 flex items-center justify-center shrink-0 text-theme13-primary font-bold text-sm">
                    {item.name.charAt(0)}
                  </div>
                  <span className="text-gray-900 font-semibold text-sm font-recoleta-alt">
                    {item.name}
                  </span>
                </div>
                <div
                  className="text-gray-400 text-xs leading-relaxed pl-11"
                  dangerouslySetInnerHTML={{ __html: nl2br(item.message) }}
                />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-theme13-primary/10 flex flex-col items-center gap-2">
          <img
            src="/images/kekawinan-logo.png"
            alt=""
            className="w-[36%] mx-auto opacity-30"
            style={{ filter: "sepia(1) saturate(2) hue-rotate(290deg)" }}
          />
          <p className="text-gray-300 text-xs">Part of CTRL Spark</p>
        </div>
      </div>

      {/* ── Floating Controls ── */}
      <FloatingMusicGift
        onPlayMusic={onPlayMusic}
        isPlayMusic={isPlayMusic}
        onOpenGift={() => setIsOpenGift(true)}
        bgColor="bg-theme13-primary"
        giftLength={giftLength}
        slug={slug}
      />

      <DialogGift
        gifts={undanganData.gifts}
        isOpen={isOpenGift}
        setIsOpen={setIsOpenGift}
        giftLength={giftLength}
        slug={slug}
        buttonBg="bg-theme13-primary"
      />
    </div>
  );
}
