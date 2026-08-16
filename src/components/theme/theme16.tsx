"use client";

import { useEffect, useState } from "react";
import {
  UndanganDetail,
  UndanganTamu,
  UndanganUcapan,
} from "@/frontend/interface/undangan";
import { Button } from "../ui/button";
import { IconDeviceTvOld, IconMapPin } from "@tabler/icons-react";

import DialogGift from "@/components/card/dialog-gift";
import GaleriCards from "@/components/card/galeri-cards";
import LoveStoryTimeline from "@/components/card/love-story-timeline";
import { FloatingMusicGift } from "../card/floating-music-gift";
import { FloatingQrButton } from "@/components/card/floating-qr-button";
import CountdownFloral from "@/components/card/countdown-floral";
import UcapanConfirm from "@/components/card/ucapan-confirm";
import { motion } from "motion/react";
import { formatDateId } from "@/helper/date";
import { nl2br } from "@/helper/text";
import Link from "next/link";

const DARK_GREEN = "#2A3728";
const CARD_GREEN = "#1E2B1C";
const DEEP_GREEN = "#16221A";
const GOLD = "#B8975A";
const GOLD_MUTED = "#B8975A99";

export default function Theme16({
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

  /* ──────────────────────────────────────────────
     COVER PAGE
  ────────────────────────────────────────────── */
  if (isCoverUndangan) {
    return (
      <div
        className="relative h-screen overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: DARK_GREEN }}
      >
        {/* Card + flowers wrapper — flowers positioned relative to card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative z-10"
          style={{ width: "72%", maxWidth: "280px" }}
        >
          {/* Top-right: pink dahlia (flower-cover.png) */}
          <motion.img
            initial={{ opacity: 0, x: 40, y: -40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            src="/images/assets/flower-cover.png"
            alt=""
            className="absolute -top-16 -right-14 w-40 z-1 pointer-events-none"
          />

          {/* Left-center: dark red dahlia (flower-cover-2.png) */}
          <motion.img
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            src="/images/assets/flower-cover-2.png"
            alt=""
            className="absolute -left-16 top-[18%] w-48 z-1 pointer-events-none"
          />

          {/* Bottom-left: large pink dahlia (flower-cover.png) */}
          <motion.img
            initial={{ opacity: 0, x: -40, y: 40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            src="/images/assets/flower-cover.png"
            alt=""
            className="absolute -bottom-16 -left-12 w-40 z-30 pointer-events-none"
          />

          {/* Bottom-right: dark red dahlia (flower-cover-2.png) */}
          <motion.img
            initial={{ opacity: 0, x: 40, y: 40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
            src="/images/assets/flower-cover-2.png"
            alt=""
            className="absolute -bottom-12 -right-12 w-44 z-1 pointer-events-none"
          />

          {/* Center pill card */}
          <div
            className="relative z-10 w-full rounded-[44px] flex flex-col items-center gap-4 px-8 py-14"
            style={{
              backgroundColor: CARD_GREEN,
              border: `1px solid ${GOLD}`,
            }}
          >
            {/* Gold star top */}
            <span className="text-2xl leading-none" style={{ color: GOLD }}>
              ✦
            </span>

            <h1
              className="font-glitten text-3xl text-center leading-tight"
              style={{ color: GOLD }}
            >
              {undanganData?.content?.title || "Nama Mempelai"}
            </h1>

            <p
              className="text-[10px] tracking-[0.25em] text-center"
              style={{ color: GOLD_MUTED }}
            >
              Undangan Pernikahan
            </p>

            {/* Gold star bottom */}
            <span className="text-2xl leading-none" style={{ color: GOLD }}>
              ✦
            </span>
          </div>
        </motion.div>

        {/* Guest name + button at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.8 }}
          className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-4 px-8 z-30"
        >
          <div
            className="rounded-2xl px-6 py-3 text-center w-[80%]"
            style={{
              backgroundColor: CARD_GREEN,
              border: `1px solid ${GOLD}40`,
            }}
          >
            <p className="text-[10px] mb-1" style={{ color: GOLD_MUTED }}>
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>
            <p className="font-semibold" style={{ color: GOLD }}>
              {tamuData?.name || "Tamu Spesial"}
            </p>
          </div>
          <Button
            className="animate-bounce font-semibold px-8"
            style={{ backgroundColor: GOLD, color: DARK_GREEN }}
            onClick={() => {
              setIsCoverUndangan(false);
              onPlayMusic();
            }}
          >
            Lihat Undangan
          </Button>
        </motion.div>

        <FloatingQrButton
          tamu={tamu}
          tamuId={tamu?.id ?? ""}
          slug={slug}
          content={undangan?.content ?? null}
          bgColor="bg-theme16-dark"
          iconColor="text-theme16-secondary"
        />
      </div>
    );
  }

  /* ──────────────────────────────────────────────
     MAIN INVITATION CONTENT
  ────────────────────────────────────────────── */
  return (
    <div className="relative">
      {/* ── HERO SECTION ── */}
      <div className="relative h-screen overflow-hidden flex flex-col items-center justify-center">
        {/* Background image from API */}
        <img
          src={undangan?.content?.imgBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0 opacity-80"
          style={{ backgroundColor: `${DARK_GREEN}CC` }}
        />

        {/* Bottom flower strip */}
        <img
          src="/images/assets/flowers-long.png"
          alt=""
          className="absolute -bottom-10 left-0 w-full z-10 pointer-events-none object-cover"
        />

        <div className="relative z-20 flex flex-col items-center gap-4 px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: false }}
            className="text-[10px] tracking-[0.35em] uppercase"
            style={{ color: GOLD }}
          >
            The Wedding of
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: false }}
            className="flex items-center gap-4 w-full justify-center"
          >
            <div className="h-px flex-1" style={{ backgroundColor: GOLD }} />
            <span style={{ color: GOLD }}>✦</span>
            <div className="h-px flex-1" style={{ backgroundColor: GOLD }} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: false }}
            className="font-glitten text-5xl text-white leading-tight"
          >
            {undangan?.content?.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: false }}
            className="text-sm text-white/80"
          >
            {formatDateId(undangan?.content?.dateWedding ?? "")}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            viewport={{ once: false }}
            className="text-xs text-white/60 leading-relaxed mt-2"
          >
            &ldquo;Maha Suci Allah SWT yang telah menciptakan
            <br />
            makhluk-Nya berpasang-pasangan&rdquo;
            <br />
            <span style={{ color: GOLD_MUTED }}>– Q.S. Yasin : 36</span>
          </motion.p>
        </div>
      </div>

      {/* ── MEMPELAI SECTION ── */}
      <div
        className="relative py-16 px-6 overflow-hidden"
        style={{ backgroundColor: DARK_GREEN }}
      >
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: false }}
          className="flex flex-col items-center gap-2 mb-6 text-center"
        >
          <span style={{ color: GOLD }}>✦</span>
          <p
            className="text-[10px] tracking-[0.3em]"
            style={{ color: GOLD_MUTED }}
          >
            BISMILLAHIRRAHMANIRRAHIM
          </p>
          <p className="text-white/70 text-sm px-8 mt-2">
            Dengan rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu untuk
            menghadiri pernikahan kami,
          </p>
        </motion.div>

        {/* Mempelai cards */}
        <div className="flex flex-col gap-5 relative z-10">
          {/* Female */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
            viewport={{ once: false }}
            className="relative rounded-3xl p-6 flex gap-5 items-center overflow-hidden"
            style={{
              backgroundColor: CARD_GREEN,
              border: `1px solid ${GOLD}40`,
            }}
          >
            {/* Flower corner */}
            <img
              src="/images/assets/flower-decor-2.png"
              alt=""
              className="absolute -top-5 -right-3 w-16 opacity-90 pointer-events-none"
            />

            <img
              src="/images/assets/flower-decor-2.png"
              alt=""
              className="absolute -bottom-5 -left-3 w-16 opacity-90 pointer-events-none rotate-180"
            />
            <img
              src={undangan?.content?.imgFemale}
              alt=""
              className="w-24 h-24 object-cover rounded-full flex-shrink-0"
              style={{ border: `2px solid ${GOLD}` }}
            />
            <div className="flex flex-col gap-1 min-w-0">
              <h6
                className="font-recoleta-alt text-lg font-bold"
                style={{ color: GOLD }}
              >
                {undangan?.content?.nameFemale}
              </h6>
              <p className="text-xs text-white/60 leading-relaxed">
                Putri {undangan?.content?.femaleNo} dari pasangan
                <br />
                Bpk. {undangan?.content?.fatherFemale}
                <br />
                dan Ibu {undangan?.content?.motherFemale}
              </p>
            </div>
          </motion.div>

          {/* Ampersand divider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: false }}
            className="text-center"
          >
            <span className="font-glitten text-5xl" style={{ color: GOLD }}>
              &amp;
            </span>
          </motion.div>

          {/* Male */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
            viewport={{ once: false }}
            className="relative rounded-3xl p-6 flex gap-5 items-center overflow-hidden"
            style={{
              backgroundColor: CARD_GREEN,
              border: `1px solid ${GOLD}40`,
            }}
          >
            {/* Flower corner */}
            <img
              src="/images/assets/flower-decor-2.png"
              alt=""
              className="absolute -top-5 -right-3 w-16 opacity-90 pointer-events-none"
            />
            <img
              src="/images/assets/flower-decor-2.png"
              alt=""
              className="absolute -bottom-5 -left-3 w-16 opacity-90 pointer-events-none rotate-180"
            />
            <img
              src={undangan?.content?.imgMale}
              alt=""
              className="w-24 h-24 object-cover rounded-full flex-shrink-0"
              style={{ border: `2px solid ${GOLD}` }}
            />
            <div className="flex flex-col gap-1 min-w-0">
              <h6
                className="font-recoleta-alt text-lg font-bold"
                style={{ color: GOLD }}
              >
                {undangan?.content?.nameMale}
              </h6>
              <p className="text-xs text-white/60 leading-relaxed">
                Putra {undangan?.content?.maleNo} dari pasangan
                <br />
                Bpk. {undangan?.content?.fatherMale}
                <br />
                dan Ibu {undangan?.content?.motherMale}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── COUNTDOWN + EVENT INFO ── */}
      <div
        className="relative py-16 px-6 overflow-hidden"
        style={{ backgroundColor: DEEP_GREEN }}
      >
        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: false }}
          className="mb-12"
        >
          <CountdownFloral targetDate={undangan?.content?.dateWedding ?? ""} />
        </motion.div>

        {/* Event info cards */}
        <div className="flex flex-col gap-4">
          {/* Akad */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
            viewport={{ once: false }}
            className="rounded-3xl p-6 text-center"
            style={{
              backgroundColor: CARD_GREEN,
              border: `1px solid ${GOLD}40`,
            }}
          >
            <p
              className="text-[10px] tracking-[0.25em] mb-3"
              style={{ color: GOLD_MUTED }}
            >
              AKAD NIKAH
            </p>
            <p
              className="font-recoleta-alt text-xl font-semibold mb-2"
              style={{ color: GOLD }}
            >
              {undangan?.content?.akadTime}
            </p>
            <div
              className="h-px w-12 mx-auto mb-3"
              style={{ backgroundColor: `${GOLD}50` }}
            />
            <div
              className="text-sm text-white/70"
              dangerouslySetInnerHTML={{
                __html: nl2br(undangan?.content?.akadPlace),
              }}
            />
          </motion.div>

          {/* Resepsi */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
            viewport={{ once: false }}
            className="rounded-3xl p-6 text-center"
            style={{
              backgroundColor: CARD_GREEN,
              border: `1px solid ${GOLD}40`,
            }}
          >
            <p
              className="text-[10px] tracking-[0.25em] mb-3"
              style={{ color: GOLD_MUTED }}
            >
              RESEPSI NIKAH
            </p>
            <p
              className="font-recoleta-alt text-xl font-semibold mb-2"
              style={{ color: GOLD }}
            >
              {undangan?.content?.resepsiTime}
            </p>
            <div
              className="h-px w-12 mx-auto mb-3"
              style={{ backgroundColor: `${GOLD}50` }}
            />
            <div
              className="text-sm text-white/70"
              dangerouslySetInnerHTML={{
                __html: nl2br(undangan?.content?.resepsiPlace),
              }}
            />
          </motion.div>

          {/* Maps + Streaming buttons */}
          <div className="flex flex-col items-center gap-3 mt-2">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              viewport={{ once: false }}
            >
              <Link href={undangan?.content?.gmaps ?? ""} target="_blank">
                <Button
                  className="font-semibold"
                  style={{ backgroundColor: GOLD, color: DARK_GREEN }}
                >
                  <IconMapPin size={16} />
                  <span>Lihat di Google Maps</span>
                </Button>
              </Link>
            </motion.div>
            {undangan?.content?.streamLink && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                viewport={{ once: false }}
              >
                <Link
                  href={undangan?.content?.streamLink ?? ""}
                  target="_blank"
                >
                  <Button
                    variant="outline"
                    className="font-semibold"
                    style={{ borderColor: GOLD, color: GOLD }}
                  >
                    <IconDeviceTvOld size={16} />
                    <span>Live Streaming</span>
                  </Button>
                </Link>
              </motion.div>
            )}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              viewport={{ once: false }}
              className="text-xs text-white/50 text-center mt-2 px-6"
            >
              Sebuah kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu
              berkenan hadir dan memberikan doa restu.
            </motion.p>
          </div>
        </div>
      </div>

      {/* ── LOVE STORY ── */}
      <LoveStoryTimeline
        loveStories={undanganData.loveStories ?? []}
        bgImage="/images/assets/background.png"
        accentColor="bg-theme16-secondary"
        headingColor="text-white"
        textColor="text-white"
      />

      {/* ── GALLERY ── */}
      <div
        className="py-16 relative overflow-hidden"
        style={{ backgroundColor: DARK_GREEN }}
      >
        {/* Flower decorations */}
        <img
          src="/images/assets/flowers-long.png"
          alt=""
          className="absolute right-0 -bottom-20 w-full opacity-100 pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: false }}
          className="flex flex-col items-center gap-2 mb-10"
        >
          <span style={{ color: GOLD }}>✦</span>
          <h2
            className="font-glitten text-3xl text-center"
            style={{ color: GOLD }}
          >
            Galeri Kami
          </h2>
          <div className="h-px w-12" style={{ backgroundColor: `${GOLD}60` }} />
        </motion.div>

        <GaleriCards galeri={undanganData.gallery} accentColor={GOLD} />
      </div>

      {/* ── UCAPAN & KONFIRMASI ── */}
      <UcapanConfirm
        tamu={tamu ?? tamuData}
        isLoading={isSubmitting}
        onSubmit={({ data }) => {
          onSubmitUcapan(data);
        }}
        bgColor="bg-theme16-primary"
        fontHeading="font-glitten"
        bgButton="bg-theme16-secondary"
        colorButton="text-white"
        colorHeading="text-white"
        labelColor="text-white"
      />

      {/* ── DOA LIST ── */}
      <div className="py-16 px-6" style={{ backgroundColor: DEEP_GREEN }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: false }}
          className="flex flex-col mb-8 items-center gap-2"
        >
          <span style={{ color: GOLD }}>✦</span>
          <h3 className="font-glitten text-3xl" style={{ color: GOLD }}>
            Doa Terbaik
          </h3>
          <p className="text-xs text-white/50">
            untuk {undangan?.content?.title}
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {ucapan?.length === 0 && (
            <div className="text-center text-sm text-white/50">
              Jadilah yang pertama untuk mengirimkan
              <br />
              doa ke calon pengantin
            </div>
          )}
          {ucapan?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * Math.min(index, 5) }}
              viewport={{ once: false }}
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{
                backgroundColor: CARD_GREEN,
                border: `1px solid ${GOLD}30`,
              }}
            >
              <div className="flex gap-3 items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0"
                  style={{ backgroundColor: GOLD, color: DARK_GREEN }}
                >
                  {item.name.charAt(0)}
                </div>
                <h6
                  className="font-recoleta-alt font-semibold"
                  style={{ color: GOLD }}
                >
                  {item.name}
                </h6>
              </div>
              <div
                className="text-sm text-white/70"
                dangerouslySetInnerHTML={{ __html: nl2br(item.message) }}
              />
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center mt-10 gap-1">
          <img
            src="/images/kekawinan-logo.png"
            alt=""
            className="w-[40%] mx-auto"
          />
          <p className="text-xs text-center text-green-kwn">
            Part of CTRL Spark
          </p>
        </div>
      </div>

      {/* ── FLOATING CONTROLS ── */}
      <FloatingMusicGift
        onPlayMusic={onPlayMusic}
        isPlayMusic={isPlayMusic}
        onOpenGift={() => setIsOpenGift(true)}
        bgColor="bg-theme16-dark"
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
        buttonBg="bg-theme16-secondary"
      />
    </div>
  );
}
