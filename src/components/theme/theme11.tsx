"use client";

import { useEffect, useState } from "react";
import {
  UndanganDetail,
  UndanganTamu,
  UndanganUcapan,
} from "@/frontend/interface/undangan";
import { Button } from "../ui/button";
import { IconDeviceTvOld, IconMapPin, IconPlus } from "@tabler/icons-react";

import DialogGift from "@/components/card/dialog-gift";
import Galeri from "@/components/card/galeri";
import LoveStoryTimeline from "@/components/card/love-story-timeline";
import { FloatingMusicGift } from "../card/floating-music-gift";
import { FloatingQrButton } from "@/components/card/floating-qr-button";
import SaveTheDate from "@/components/card/save-the-date";
import UcapanConfirm from "@/components/card/ucapan-confirm";
import { motion } from "motion/react";
import { formatDateId } from "@/helper/date";
import { nl2br } from "@/helper/text";
import Link from "next/link";

export default function Theme11({
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

  if (isCoverUndangan) {
    return (
      <div
        className="relative h-screen flex flex-col justify-between items-center bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${undanganData?.content?.imgBg})` }}
      >
        {/* Dark overlay with teal gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040C14]/90 via-[#040C14]/70 to-[#040C14]/95" />

        {/* Animated grid dots */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, #00C9B8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Floating plus icons */}
        {Array(8)
          .fill(null)
          .map((_, i) => (
            <div className="snowflake z-9" key={i}>
              <IconPlus
                size={14}
                className="text-theme11-primary opacity-50"
              />
            </div>
          ))}

        {/* Top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-theme11-primary/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 text-center pt-14 px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: false }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-2 border border-theme11-primary/40 rounded-full px-4 py-1 bg-theme11-primary/10 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-theme11-primary animate-pulse" />
              <span className="text-theme11-primary text-xs font-medium tracking-widest uppercase">
                Undangan Pernikahan
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white font-recoleta-alt leading-tight mt-1">
              {undanganData?.content?.title}
            </h1>
            <p className="text-white/50 text-xs tracking-[0.2em] uppercase">
              {formatDateId(undanganData?.content?.dateWedding ?? "")}
            </p>
          </motion.div>
        </div>

        {/* Guest card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: false }}
          className="relative z-10 w-full px-6 mb-14 flex flex-col gap-4"
        >
          {/* Glassmorphism guest card */}
          <div
            className="rounded-2xl p-5 border border-white/10"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(0,201,184,0.05) 100%)",
              backdropFilter: "blur(16px)",
            }}
          >
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-1">
              Kepada Yth.
            </p>
            <p className="text-white/60 text-xs mb-2">Bapak/Ibu/Saudara/i</p>
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 rounded-full bg-theme11-primary" />
              <p className="text-white text-xl font-semibold font-recoleta-alt">
                {tamuData?.name || "Tamu Spesial"}
              </p>
            </div>
          </div>

          <Button
            className="w-full bg-theme11-primary hover:bg-theme11-primary text-[#040C14] font-bold rounded-xl h-12 text-sm tracking-wide"
            onClick={() => {
              setIsCoverUndangan(false);
              onPlayMusic();
            }}
          >
            Buka Undangan
          </Button>
        </motion.div>

        <FloatingQrButton
          tamu={tamu}
          tamuId={tamu?.id ?? ""}
          slug={slug}
          content={undangan?.content ?? null}
          bgColor="bg-theme11-primary"
          iconColor="text-[#040C14]"
        />
      </div>
    );
  }

  return (
    <div className="relative bg-[#040C14]">
      {/* Hero / Cover */}
      <div
        className="relative h-screen bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${undangan?.content?.imgBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#040C14]/60 via-transparent to-[#040C14]" />

        {/* Grid dots overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, #00C9B8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: false }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-theme11-primary animate-pulse" />
              <span className="text-theme11-primary text-xs tracking-widest uppercase font-medium">
                Undangan Pernikahan
              </span>
            </div>
            <h2 className="text-5xl font-bold text-white font-recoleta-alt leading-none">
              {undangan?.content?.title}
            </h2>
            <p className="text-white/50 text-sm mt-3 tracking-wider">
              {formatDateId(undangan?.content?.dateWedding ?? "")}
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: false }}
            className="text-white/40 text-xs leading-relaxed"
          >
            "Dan di antara tanda-tanda kekuasaan-Nya, Dia menciptakan untukmu
            pasangan hidup dari jenismu sendiri." — Q.S Ar-Rum: 21
          </motion.p>
        </div>
      </div>

      {/* Mempelai Section */}
      <div className="px-5 py-14 bg-[#040C14]">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: false }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-6 h-px bg-theme11-primary" />
          <span className="text-theme11-primary text-xs tracking-[0.25em] uppercase font-medium">
            Mempelai
          </span>
        </motion.div>

        {/* Bismillah */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: false }}
          className="text-center mb-8"
        >
          <img
            src="/images/theme1/bismillah.png"
            alt=""
            className="h-10 mx-auto contrast-0 brightness-200 opacity-60"
          />
          <p className="text-white/50 text-xs mt-3">
            Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="text-white/40 text-xs mt-2 leading-relaxed px-4">
            Dengan rahmat Allah SWT, kami mengundang Bapak/Ibu untuk menghadiri
            pernikahan kami.
          </p>
        </motion.div>

        {/* Couple cards */}
        <div className="flex flex-col gap-4">
          {/* Female card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: false }}
            className="rounded-2xl p-4 border border-white/8 flex items-center gap-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,201,184,0.06) 100%)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="relative shrink-0">
              <img
                src={undangan?.content?.imgFemale}
                alt=""
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-theme11-primary rounded-full flex items-center justify-center">
                <span className="text-[#040C14] text-[8px] font-black">♀</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-white font-bold text-lg font-recoleta-alt leading-tight">
                {undangan?.content?.nameFemale}
              </h5>
              <p className="text-white/40 text-xs mt-1 leading-relaxed">
                Putri {undangan?.content?.femaleNo}
                <br />
                {undangan?.content?.fatherFemale} &amp;{" "}
                {undangan?.content?.motherFemale}
              </p>
            </div>
          </motion.div>

          {/* And divider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: false }}
            className="flex items-center justify-center gap-4"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-theme11-primary/30" />
            <span className="text-4xl font-bold text-theme11-primary font-recoleta-alt">
              &amp;
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-theme11-primary/30" />
          </motion.div>

          {/* Male card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: false }}
            className="rounded-2xl p-4 border border-white/8 flex items-center gap-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,201,184,0.06) 0%, rgba(255,255,255,0.04) 100%)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="relative shrink-0">
              <img
                src={undangan?.content?.imgMale}
                alt=""
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-theme11-primary rounded-full flex items-center justify-center">
                <span className="text-[#040C14] text-[8px] font-black">♂</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-white font-bold text-lg font-recoleta-alt leading-tight">
                {undangan?.content?.nameMale}
              </h5>
              <p className="text-white/40 text-xs mt-1 leading-relaxed">
                Putra {undangan?.content?.maleNo}
                <br />
                {undangan?.content?.fatherMale} &amp;{" "}
                {undangan?.content?.motherMale}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Resepsi / Event Section */}
      <div
        className="px-5 py-14 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #040C14 0%, #071620 50%, #040C14 100%)",
        }}
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-theme11-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-theme11-primary/8 rounded-full blur-3xl pointer-events-none" />

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-6 h-px bg-theme11-primary" />
          <span className="text-theme11-primary text-xs tracking-[0.25em] uppercase font-medium">
            Detail Acara
          </span>
        </motion.div>

        {/* Countdown — SaveTheDate style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: false }}
          className="mb-8"
        >
          <SaveTheDate
            targetDate={undangan?.content?.dateWedding ?? ""}
            primaryColor="text-theme11-primary"
            secondaryColor="text-white"
            cardBg="bg-white/5 border border-white/10 backdrop-blur-sm"
            accentBg="bg-theme11-primary"
          />
        </motion.div>

        {/* Event cards — numbered watermark style */}
        <div className="flex flex-col gap-4 relative z-10">
          {/* Akad Nikah */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: false }}
            className="relative rounded-2xl p-5 overflow-hidden border-l-2 border-theme11-primary"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,201,184,0.07) 0%, rgba(255,255,255,0.02) 100%)",
            }}
          >
            {/* Watermark number */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[80px] font-black text-theme11-primary/8 leading-none select-none pointer-events-none font-recoleta-alt">
              01
            </span>
            <p className="text-[10px] text-theme11-primary uppercase tracking-[0.2em] font-medium mb-2">
              Akad Nikah
            </p>
            <p className="text-white font-semibold text-base leading-snug">
              {undangan?.content?.akadTime}
            </p>
            <div
              className="text-white/45 text-xs mt-2 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: nl2br(undangan?.content?.akadPlace),
              }}
            />
          </motion.div>

          {/* Resepsi */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: false }}
            className="relative rounded-2xl p-5 overflow-hidden border-l-2 border-white/20"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            }}
          >
            {/* Watermark number */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[80px] font-black text-white/5 leading-none select-none pointer-events-none font-recoleta-alt">
              02
            </span>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium mb-2">
              Resepsi Pernikahan
            </p>
            <p className="text-white/80 font-semibold text-base leading-snug">
              {undangan?.content?.resepsiTime}
            </p>
            <div
              className="text-white/40 text-xs mt-2 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: nl2br(undangan?.content?.resepsiPlace),
              }}
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
              <Button className="w-full bg-theme11-primary hover:bg-theme11-primary text-[#040C14] font-bold rounded-xl h-11">
                <IconMapPin size={16} />
                Lihat di Google Maps
              </Button>
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
                <Button className="w-full bg-white/8 hover:bg-white/12 text-white border border-white/15 font-semibold rounded-xl h-11">
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
            className="text-white/30 text-xs text-center leading-relaxed mt-2"
          >
            Sebuah kehormatan apabila Bapak/Ibu berkenan hadir
            <br />
            dan memberikan doa restu.
          </motion.p>
        </div>
      </div>

      {/* Love Story */}
      <LoveStoryTimeline
        loveStories={undanganData.loveStories ?? []}
        bgImage={undangan?.content?.imgBg}
        accentColor="bg-theme11-primary"
        headingColor="text-theme11-secondary"
        textColor="text-white/80"
      />

      {/* Gallery */}
      <div className="py-14 bg-[#040C14]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="flex items-center gap-3 px-5 mb-8"
        >
          <div className="w-6 h-px bg-theme11-primary" />
          <span className="text-theme11-primary text-xs tracking-[0.25em] uppercase font-medium">
            Galeri
          </span>
        </motion.div>
        <Galeri
          galeri={undanganData.gallery}
          view={1.3}
          color="#00C9B8"
        />
      </div>

      {/* Ucapan form */}
      <UcapanConfirm
        tamu={tamu ?? tamuData}
        isLoading={isSubmitting}
        onSubmit={({ data }) => onSubmitUcapan(data)}
        bgColor="bg-[#071620]"
        fontHeading="font-recoleta-alt"
        bgButton="bg-theme11-primary"
        colorButton="text-[#040C14]"
        colorHeading="text-white"
        labelColor="text-white/60"
      />

      {/* Ucapan list */}
      <div className="py-14 px-5 bg-[#040C14]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-6 h-px bg-theme11-primary" />
          <span className="text-theme11-primary text-xs tracking-[0.25em] uppercase font-medium">
            Doa &amp; Ucapan
          </span>
        </motion.div>

        <div className="flex flex-col gap-3">
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
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: false }}
              className="rounded-xl p-4 border border-white/8"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,201,184,0.03) 100%)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-theme11-primary/20 border border-theme11-primary/30 flex items-center justify-center text-theme11-primary font-bold text-sm shrink-0">
                  {item.name.charAt(0)}
                </div>
                <span className="text-white font-semibold text-sm font-recoleta-alt">
                  {item.name}
                </span>
              </div>
              <div
                className="text-white/50 text-xs leading-relaxed pl-11"
                dangerouslySetInnerHTML={{ __html: nl2br(item.message) }}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-white/8 flex flex-col items-center gap-1">
          <img
            src="/images/kekawinan-logo.png"
            alt=""
            className="w-[36%] mx-auto contrast-0 brightness-200 opacity-40"
          />
          <p className="text-white/20 text-xs">Part of CTRL Spark</p>
        </div>
      </div>

      {/* Floating controls */}
      <FloatingMusicGift
        onPlayMusic={onPlayMusic}
        isPlayMusic={isPlayMusic}
        onOpenGift={() => setIsOpenGift(true)}
        bgColor="bg-theme11-primary"
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
            buttonBg="bg-theme11-primary"
      />
    </div>
  );
}
