"use client";

import { useEffect, useState } from "react";
import {
  UndanganDetail,
  UndanganTamu,
  UndanganUcapan,
} from "@/frontend/interface/undangan";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  IconDeviceTvOld,
  IconMapPin,
  IconLeaf,
} from "@tabler/icons-react";

import DialogGift from "@/components/card/dialog-gift";
import GaleriCards from "@/components/card/galeri-cards";
import LoveStoryTimeline from "@/components/card/love-story-timeline";
import { FloatingMusicGift } from "../card/floating-music-gift";
import { FloatingQrButton } from "@/components/card/floating-qr-button";

import SaveTheDate from "@/components/card/save-the-date";
import UcapanConfirm from "@/components/card/ucapan-confirm";
import { motion } from "motion/react";
import { formatDateId } from "@/helper/date";
import { nl2br } from "@/helper/text";
import Link from "next/link";

export default function Theme10({
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
        className="relative h-screen p-6 py-8 flex flex-col justify-between items-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${undanganData?.content?.imgBg})`,
        }}
      >
        {Array(10)
          .fill(null)
          .map((_, i) => (
            <div className="snowflake z-9" key={i}>
              <IconLeaf size={18} className="text-theme10-primary opacity-80" />
            </div>
          ))}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-theme10-secondary/80 via-theme10-primary/40 to-theme10-secondary/90"></div>

        <div className="relative z-10 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
            viewport={{ once: false }}
            className="flex flex-col items-center gap-3"
          >
            <img
              src="/images/theme1/daunkiri.png"
              alt=""
              className="w-[100px] opacity-70 mx-auto mb-2"
              style={{ filter: "sepia(1) saturate(1.5) hue-rotate(-10deg)" }}
            />
            <Badge className="text-xs rounded-full bg-white/90 text-theme10-secondary px-4 font-medium">
              Undangan Pernikahan
            </Badge>
            <h1 className="text-4xl font-semibold text-white mt-2 font-recoleta-alt leading-tight drop-shadow-md">
              {undanganData?.content?.title}
            </h1>
            <p className="text-white/90 text-sm mt-1 tracking-widest uppercase">
              {formatDateId(undanganData?.content?.dateWedding ?? "")}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
          viewport={{ once: false }}
          className="flex flex-col gap-5 relative z-10 w-full mb-12"
        >
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-3xl text-center w-[82%] mx-auto border border-theme10-primary/50 shadow-lg">
            <p className="text-theme10-secondary/70 text-xs uppercase tracking-wider">
              Kepada Yth.
            </p>
            <p className="text-xs text-theme10-secondary/60 mt-0.5">
              Bapak/Ibu/Saudara/i
            </p>
            <p className="font-semibold text-theme10-secondary text-lg mt-2 font-recoleta-alt">
              {tamuData?.name || "Tamu Spesial"}
            </p>
          </div>
          <div className="text-center">
            <Button
              className="bg-theme10-primary hover:bg-theme10-primary text-white hover:text-white animate-bounce rounded-full px-8 shadow-lg font-medium"
              onClick={() => {
                setIsCoverUndangan(false);
                onPlayMusic();
              }}
            >
              Lihat Undangan
            </Button>
          </div>
        </motion.div>

        <FloatingQrButton
          tamu={tamu}
          tamuId={tamu?.id ?? ""}
          slug={slug}
          content={undangan?.content ?? null}
          bgColor="bg-theme10-primary"
          iconColor="text-white"
        />
      </div>
    );
  }

  return (
    <div className="relative bg-[#FDF8F2]">
      {/* Cover Undangan */}
      <div
        className="relative h-screen p-6 py-8 flex flex-col items-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${undangan?.content?.imgBg})`,
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-theme10-secondary/70 via-theme10-primary/30 to-[#FDF8F2]"></div>

        {/* Top decorative leaves */}
        <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none">
          <img
            src="/images/theme1/daunkiri.png"
            alt=""
            className="w-[140px] opacity-60 absolute top-0 left-0"
            style={{ filter: "sepia(0.8) saturate(2) hue-rotate(-5deg)" }}
          />
          <img
            src="/images/theme1/daunkanan.png"
            alt=""
            className="w-[140px] opacity-60 absolute top-0 right-0"
            style={{ filter: "sepia(0.8) saturate(2) hue-rotate(-5deg)" }}
          />
        </div>

        <div className="flex flex-col gap-3 items-center mt-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
            viewport={{ once: false }}
          >
            <Badge className="text-xs rounded-full bg-white/90 text-theme10-secondary px-4">
              Undangan Pernikahan
            </Badge>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.4 }}
            viewport={{ once: false }}
          >
            <h2 className="text-4xl font-semibold text-white font-recoleta-alt text-center drop-shadow-md mt-2">
              {undangan?.content?.title}
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.7 }}
            viewport={{ once: false }}
            className="text-center"
          >
            <p className="text-white/90 text-sm tracking-widest uppercase">
              {formatDateId(undangan?.content?.dateWedding ?? "")}
            </p>
            <p className="text-white/80 text-xs mt-6 leading-relaxed">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
              <br />
              untukmu istri-istri dari jenismu sendiri."
              <br />
              <span className="font-semibold">— Q.S Ar-Rum: 21</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Informasi Mempelai */}
      <div className="py-16 px-6 bg-[#FDF8F2] rounded-t-3xl -mt-10 relative z-10">
        {/* Floral divider top */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-px flex-1 bg-theme10-primary/30"></div>
          <img
            src="/images/theme1/flower1.png"
            alt=""
            className="w-10 mx-3 opacity-70"
            style={{ filter: "sepia(0.6) saturate(2.5) hue-rotate(-5deg)" }}
          />
          <div className="h-px flex-1 bg-theme10-primary/30"></div>
        </div>

        <div className="flex flex-col gap-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
            viewport={{ once: false }}
          >
            <Badge className="text-xs rounded-full bg-theme10-primary text-white px-4">
              Mempelai
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.4 }}
            viewport={{ once: false }}
          >
            <img
              src="/images/theme1/bismillah.png"
              alt=""
              className="h-12 mx-auto"
              style={{ filter: "sepia(0.5) saturate(2) hue-rotate(-10deg) opacity(0.8)" }}
            />
            <p className="font-semibold mt-4 text-sm text-theme10-secondary">
              Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
            viewport={{ once: false }}
          >
            <p className="text-sm text-theme10-secondary/80">
              Dengan rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu dan
              teman-teman untuk menghadiri pernikahan kami,
            </p>
          </motion.div>

          {/* Couple Section */}
          <div className="flex flex-col gap-8 w-full text-center py-6">
            {/* Female */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
              viewport={{ once: false }}
              className="flex flex-col items-center gap-3"
            >
              <div className="relative">
                <div className="w-[150px] h-[150px] rounded-full border-4 border-theme10-primary/50 p-1 mx-auto">
                  <img
                    src={undangan?.content?.imgFemale}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <img
                  src="/images/theme1/flower2.png"
                  alt=""
                  className="w-12 absolute -top-2 -right-2 opacity-80"
                  style={{ filter: "sepia(0.5) saturate(3) hue-rotate(-5deg)" }}
                />
              </div>
              <div>
                <h6 className="font-recoleta-alt text-2xl font-bold text-theme10-secondary">
                  {undangan?.content?.nameFemale}
                </h6>
                <p className="text-sm pt-1 text-theme10-secondary/70">
                  Putri {undangan?.content?.femaleNo} dari pasangan
                  <br />
                  Bpk. {undangan?.content?.fatherFemale} &amp; Ibu{" "}
                  {undangan?.content?.motherFemale}
                </p>
              </div>
            </motion.div>

            {/* Ampersand divider */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
              viewport={{ once: false }}
              className="flex items-center justify-center gap-3"
            >
              <div className="h-px flex-1 bg-theme10-primary/30"></div>
              <p className="font-recoleta-alt text-5xl text-theme10-primary leading-none">
                &amp;
              </p>
              <div className="h-px flex-1 bg-theme10-primary/30"></div>
            </motion.div>

            {/* Male */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
              viewport={{ once: false }}
              className="flex flex-col items-center gap-3"
            >
              <div className="relative">
                <div className="w-[150px] h-[150px] rounded-full border-4 border-theme10-primary/50 p-1 mx-auto">
                  <img
                    src={undangan?.content?.imgMale}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <img
                  src="/images/theme1/flower2.png"
                  alt=""
                  className="w-12 absolute -top-2 -left-2 opacity-80 scale-x-[-1]"
                  style={{ filter: "sepia(0.5) saturate(3) hue-rotate(-5deg)" }}
                />
              </div>
              <div>
                <h6 className="font-recoleta-alt text-2xl font-bold text-theme10-secondary">
                  {undangan?.content?.nameMale}
                </h6>
                <p className="text-sm pt-1 text-theme10-secondary/70">
                  Putra {undangan?.content?.maleNo} dari pasangan
                  <br />
                  Bpk. {undangan?.content?.fatherMale} &amp; Ibu{" "}
                  {undangan?.content?.motherMale}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Floral divider bottom */}
          <div className="flex items-center justify-center mt-2">
            <div className="h-px flex-1 bg-theme10-primary/30"></div>
            <img
              src="/images/theme1/bunga.png"
              alt=""
              className="w-14 mx-3 opacity-70"
              style={{ filter: "sepia(0.6) saturate(2.5) hue-rotate(-5deg)" }}
            />
            <div className="h-px flex-1 bg-theme10-primary/30"></div>
          </div>
        </div>
      </div>

      {/* Informasi Resepsi */}
      <div className="py-14 px-6 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #F9E8D8 0%, #F5CDB5 50%, #F0B99A 100%)" }}>
        {/* Background botanical decoration */}
        <img
          src="/images/theme1/daunkiri.png"
          alt=""
          className="absolute bottom-0 left-0 w-[180px] opacity-20 pointer-events-none"
          style={{ filter: "sepia(0.8) saturate(1.5) hue-rotate(-15deg)" }}
        />
        <img
          src="/images/theme1/daunkanan.png"
          alt=""
          className="absolute bottom-0 right-0 w-[180px] opacity-20 pointer-events-none"
          style={{ filter: "sepia(0.8) saturate(1.5) hue-rotate(-15deg)" }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
          viewport={{ once: false }}
        >
          <SaveTheDate
            targetDate={undangan?.content?.dateWedding ?? ""}
          />
        </motion.div>

        <div className="py-10 flex flex-col gap-5">
          {/* Akad Nikah Card */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
            viewport={{ once: false }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-md"
          >
            <div className="bg-theme10-primary px-4 py-2 flex items-center justify-between">
              <p className="text-white text-base font-semibold font-recoleta uppercase tracking-wide">
                Akad Nikah
              </p>
              <img
                src="/images/theme1/flower1.png"
                alt=""
                className="w-8 opacity-70"
                style={{ filter: "brightness(10)" }}
              />
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-theme10-primary">
                {undangan?.content?.akadTime}
              </p>
              <div
                className="text-sm mt-2 text-theme10-secondary/80"
                dangerouslySetInnerHTML={{
                  __html: nl2br(undangan?.content?.akadPlace),
                }}
              />
            </div>
          </motion.div>

          {/* Resepsi Card */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.7 }}
            viewport={{ once: false }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-md"
          >
            <div className="bg-theme10-primary px-4 py-2 flex items-center justify-between">
              <p className="text-white text-base font-semibold font-recoleta uppercase tracking-wide">
                Resepsi Pernikahan
              </p>
              <img
                src="/images/theme1/flower2.png"
                alt=""
                className="w-8 opacity-70"
                style={{ filter: "brightness(10)" }}
              />
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-theme10-primary">
                {undangan?.content?.resepsiTime}
              </p>
              <div
                className="text-sm mt-2 text-theme10-secondary/80"
                dangerouslySetInnerHTML={{
                  __html: nl2br(undangan?.content?.resepsiPlace),
                }}
              />
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.9 }}
            viewport={{ once: false }}
          >
            <Link href={undangan?.content?.gmaps ?? ""} target="_blank">
              <Button className="bg-theme10-secondary hover:bg-theme10-secondary text-white hover:text-white font-semibold rounded-full px-6 shadow-md">
                <IconMapPin size={16} />
                <span>Lihat di Google Maps</span>
              </Button>
            </Link>
          </motion.div>

          {undangan?.content?.streamLink && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 1.1 }}
              viewport={{ once: false }}
              className="flex flex-col items-center gap-2"
            >
              <p className="text-sm text-theme10-secondary font-semibold text-center">
                Virtual Akad session:
              </p>
              <Link href={undangan?.content?.streamLink ?? ""} target="_blank">
                <Button className="bg-theme10-secondary hover:bg-theme10-secondary text-white hover:text-white font-semibold rounded-full px-6 shadow-md">
                  <IconDeviceTvOld size={16} />
                  <span>Live Streaming</span>
                </Button>
              </Link>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 1.3 }}
            viewport={{ once: false }}
          >
            <p className="text-sm text-theme10-secondary/80 text-center mt-2">
              Sebuah kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu dan
              teman-teman berkenan hadir dan memberikan doa restu.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Love Story */}
      <LoveStoryTimeline
        loveStories={undanganData.loveStories ?? []}
        bgImage={undangan?.content?.imgBg}
        accentColor="bg-theme10-primary"
        headingColor="text-theme10-primary"
        textColor="text-white"
      />

      {/* Galeri */}
      <div className="py-16 bg-[#FDF8F2]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
          viewport={{ once: false }}
          className="pb-8 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-3 justify-center">
            <div className="h-px w-12 bg-theme10-primary/40"></div>
            <img
              src="/images/theme1/flower1.png"
              alt=""
              className="w-8 opacity-70"
              style={{ filter: "sepia(0.6) saturate(2.5) hue-rotate(-5deg)" }}
            />
            <div className="h-px w-12 bg-theme10-primary/40"></div>
          </div>
          <h2 className="text-3xl font-medium text-center font-recoleta-alt text-theme10-secondary">
            Galeri Kami
          </h2>
        </motion.div>
        <GaleriCards
          galeri={undanganData.gallery}
          accentColor="#C0614A"
        />
      </div>

      {/* Reservasi Ucapan Doa */}
      <UcapanConfirm
        tamu={tamu ?? tamuData}
        isLoading={isSubmitting}
        onSubmit={({ data }) => {
          onSubmitUcapan(data);
        }}
        bgColor="bg-[#FDF8F2]"
        fontHeading="font-recoleta-alt"
        bgButton="bg-theme10-primary"
        colorButton="text-white"
        colorHeading="text-theme10-secondary"
        labelColor="text-theme10-secondary"
      />

      {/* Ucapan Doa List */}
      <div
        className="py-16 px-6"
        style={{ background: "linear-gradient(160deg, #F9E8D8 0%, #F0B99A 100%)" }}
      >
        <div className="flex flex-col mb-8 items-center justify-center gap-2">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-theme10-secondary/40"></div>
            <img
              src="/images/theme1/flower2.png"
              alt=""
              className="w-8 opacity-70"
              style={{ filter: "sepia(0.5) saturate(3) hue-rotate(-10deg)" }}
            />
            <div className="h-px w-12 bg-theme10-secondary/40"></div>
          </div>
          <h3 className="font-recoleta text-3xl font-semibold text-theme10-secondary">
            Doa Terbaik
          </h3>
          <p className="text-sm text-theme10-secondary/70">
            untuk {undangan?.content?.title}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {ucapan?.length === 0 && (
            <div className="text-center text-sm text-theme10-secondary/70">
              Jadilah yang pertama untuk mengirimkan
              <br />
              doa ke calon pengantin
            </div>
          )}
          {ucapan?.map((item, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex flex-col gap-3 shadow-sm border border-theme10-primary/20"
            >
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 bg-theme10-primary rounded-full flex items-center justify-center font-semibold text-white text-sm shrink-0">
                  {item.name.charAt(0)}
                </div>
                <h6 className="font-semibold font-recoleta-alt text-theme10-secondary">
                  {item.name}
                </h6>
              </div>
              <div
                className="text-sm text-theme10-secondary/80 pl-12"
                dangerouslySetInnerHTML={{
                  __html: nl2br(item.message),
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center mt-8 gap-1 bg-white/70 backdrop-blur-sm py-3 rounded-2xl shadow-sm">
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

      {/* Floating Music Gift */}
      <FloatingMusicGift
        onPlayMusic={onPlayMusic}
        isPlayMusic={isPlayMusic}
        onOpenGift={() => setIsOpenGift(true)}
        bgColor="bg-theme10-primary"
        darkMode={false}
        giftLength={giftLength}
        slug={slug}
      />

      {/* Open Dialog Gift */}
      <DialogGift
        gifts={undanganData.gifts}
        isOpen={isOpenGift}
        setIsOpen={setIsOpenGift}
        giftLength={giftLength}
        slug={slug}
            buttonBg="bg-theme10-primary"
      />
    </div>
  );
}
