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
  IconBrandSnowflake,
  IconMapPin,
} from "@tabler/icons-react";

import DialogGift from "@/components/card/dialog-gift";
import Galeri from "@/components/card/galeri";
import { FloatingMusicGift } from "../card/floating-music-gift";

import CountdownTimer from "@/components/card/counting-down";
import UcapanConfirm from "@/components/card/ucapan-confirm";
import { motion } from "motion/react";
import { formatDateId } from "@/helper/date";
import Link from "next/link";

export default function Theme5({
  onPlayMusic,
  onSubmitUcapan,
  isPlayMusic,
  isSubmitting,
  undanganData,
  tamuData,
  ucapan,
}: {
  onPlayMusic: () => void;
  isPlayMusic: boolean;
  undanganData: UndanganDetail;
  tamuData: UndanganTamu;
  isSubmitting: boolean;
  onSubmitUcapan: (data: {
    name: string;
    attend: string;
    attend_total: string;
    message: string;
  }) => void;
  ucapan: UndanganUcapan[];
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
        className="relative h-screen p-6 py-8 pb-24 flex flex-col justify-between items-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${undanganData?.undangan_content?.img_bg})`,
        }}
      >
        {Array(10)
          .fill(null)
          .map((_, i) => (
            <div className="snowflake z-9" key={i}>
              <IconBrandSnowflake size={20} className="text-green-soft-kwn" />
            </div>
          ))}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black to-theme7-primary opacity-80"></div>
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              delay: 0.2,
            }}
            viewport={{ once: false }}
          >
            <Badge className="text-xs rounded-full bg-white text-black px-4">
              Undangan Pernikahan
            </Badge>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              delay: 0.4,
            }}
            viewport={{ once: false }}
          >
            <h1 className="text-4xl font-glitten text-white mt-4">
              {undanganData?.undangan_content?.title}
            </h1>
          </motion.div>
        </div>
        <div>
          <div className="relative z-10 w-full max-w-[250px] mx-auto">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4">
              <img
                src={undangan?.undangan_content?.img_thumbnail}
                alt=""
                className="w-18 h-18 object-cover rounded-full border-2 border-theme7-primary"
              />
            </div>
            <img src="/images/theme7/amplop.webp" alt="" className="w-full" />
            <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-white/50 px-2">
              <div className="flex flex-col items-center">
                <p className="text-sm font-semibold">Kepada Yth.</p>
                <p className="text-xs">Bapak/Ibu/Saudara/i</p>
              </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full px-2">
              <div className="text-center line-clamp-2">
                <p className="font-semibold text-lg mt-2">
                  {tamuData?.name || "Tamu Spesial"}
                </p>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button
              className="bg-white text-black hover:bg-white hover:text-black animate-bounce"
              onClick={() => {
                setIsCoverUndangan(false);
                onPlayMusic();
              }}
            >
              Lihat Undangan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Cover Undangan */}
      <div
        className="relative h-screen p-6 py-8 flex flex-col items-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${undangan?.undangan_content?.img_bg})`,
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black to-transparent opacity-80"></div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            delay: 0.4,
          }}
          viewport={{ once: false }}
          className="absolute top-0 right-0 w-[200px]"
        >
          <img src="/images/theme7/bunga2.png" alt="" className="w-[200px]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            delay: 0.4,
          }}
          viewport={{ once: false }}
          className="absolute -bottom-4 left-0 w-[200px]"
        >
          <img src="/images/theme7/bunga1.png" alt="" className="w-[200px]" />
        </motion.div>
        <div className="flex flex-col gap-3 items-center mt-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              delay: 0.2,
            }}
            viewport={{ once: false }}
          >
            <Badge className="text-xs rounded-full bg-theme7-primary text-white px-4">
              Undangan Pernikahan
            </Badge>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              delay: 0.4,
            }}
            viewport={{ once: false }}
          >
            <h2 className="text-4xl font-semibold text-white font-recoleta-alt">
              {undangan?.undangan_content?.title}
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              delay: 0.7,
            }}
            viewport={{ once: false }}
          >
            <p className="text-white text-center">
              {formatDateId(undangan?.undangan_content?.date_wedding ?? "")}
            </p>
            <p className="text-white text-center text-xs mt-8">
              “Lalu Dia menjadikan darinya sepasang <br /> laki-laki dan
              perempuan.” <br />— Q.S Al-Qiyamah:39
            </p>
          </motion.div>
        </div>
      </div>
      {/* Informasi Mempelai */}
      <div className="py-16 px-6 text-black relative z-10">
        <div className="flex flex-col gap-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              delay: 0.2,
            }}
            viewport={{ once: false }}
          >
            <Badge className="text-xs rounded-full bg-theme7-primary text-white px-4">
              Undangan Pernikahan
            </Badge>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              delay: 0.4,
            }}
            viewport={{ once: false }}
          >
            <img
              src="/images/theme1/bismillah.png"
              alt=""
              className="h-12 mx-auto"
            />
            <p className="font-semibold mt-4 text-sm">
              Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              delay: 0.6,
            }}
            viewport={{ once: false }}
          >
            <p className="text-sm">
              Dengan rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu dan
              teman-teman untuk menghadiri pernikahan kami,
            </p>
          </motion.div>
          <div className="px-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 0.7,
              }}
              className="flex flex-col gap-6 w-full text-center py-12 px-6 mt-8 bg-theme7-primary text-theme7-secondary rounded-4xl"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
                viewport={{ once: false }}
              >
                <img
                  src={undangan?.undangan_content?.img_female}
                  alt=""
                  className="w-[150px] h-[150px] object-cover rounded-full mx-auto"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
                viewport={{ once: false }}
              >
                <h6 className="font-recoleta-alt text-xl font-bold">
                  {undangan?.undangan_content?.name_female}
                </h6>
                <p className="text-sm pt-1">
                  Putri {undangan?.undangan_content?.female_no} dari pasangan
                  <br />
                  Bpk. {undangan?.undangan_content?.father_female} dan Ibu{" "}
                  {undangan?.undangan_content?.mother_female}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  delay: 0.9,
                }}
                viewport={{ once: false }}
              >
                <p className="font-black text-4xl">&</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
                viewport={{ once: false }}
              >
                <img
                  src={undangan?.undangan_content?.img_male}
                  alt=""
                  className="w-[150px] h-[150px] object-cover rounded-full mx-auto"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
                viewport={{ once: false }}
              >
                <h6 className="font-recoleta-alt text-xl font-bold">
                  {undangan?.undangan_content?.name_male}
                </h6>
                <p className="text-sm pt-1">
                  Putra {undangan?.undangan_content?.male_no} dari pasangan
                  <br />
                  Bpk. {undangan?.undangan_content?.father_male} dan Ibu{" "}
                  {undangan?.undangan_content?.mother_male}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Informasi Resepsi */}
      <div className="relative pb-12 bg-gradient-to-b from-theme7-primary/10 to-theme7-primary rounded-t-3xl">
        <div className="pt-[380px] py-12 -mt-[400px] px-6 bg-[url('/images/theme3/bg1.png')] bg-cover bg-center rounded-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              delay: 0.2,
            }}
            viewport={{ once: false }}
          >
            <CountdownTimer
              targetDate={undangan?.undangan_content?.date_wedding ?? ""}
              textHeadingColor="text-theme7-secondary"
              bgColor="bg-theme7-secondary"
              textColor="text-white"
              shadowColor="bg-theme7-primary"
            />
          </motion.div>
        </div>
        <div className="relative z-10 px-6">
          <div className="py-12 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 0.6,
              }}
              viewport={{ once: false }}
              className="p-3 bg-white rounded-2xl relative shadow-md text-center"
            >
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full">
                <div className="w-full">
                  <img
                    src="/images/theme7/bunga.png"
                    alt=""
                    className="w-[220px] mx-auto"
                  />
                </div>
              </div>
              <div className="p-4 border-2 border-theme7-primary rounded-2xl pb-12">
                <p className="text-xl font-semibold font-recoleta uppercase">
                  Akad Nikah
                </p>
                <p className="text-sm font-medium text-theme7-primary">
                  {undangan?.undangan_content?.akad_time}
                </p>
                <div
                  className="text-sm mt-2"
                  dangerouslySetInnerHTML={{
                    __html: undangan?.undangan_content?.akad_place ?? "",
                  }}
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 0.8,
              }}
              viewport={{ once: false }}
              className="p-3 bg-white rounded-2xl relative shadow-md"
            >
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full">
                <div className="w-full">
                  <img
                    src="/images/theme7/bunga.png"
                    alt=""
                    className="w-[220px] mx-auto"
                  />
                </div>
              </div>
              <div className="p-4 border-2 border-theme7-primary rounded-2xl pb-12">
                <p className="text-xl font-semibold font-recoleta uppercase">
                  Resepsi Pernikahan
                </p>
                <p className="text-sm font-medium text-theme7-primary">
                  {undangan?.undangan_content?.resepsi_time}
                </p>
                <div
                  className="text-sm mt-2"
                  dangerouslySetInnerHTML={{
                    __html: undangan?.undangan_content?.resepsi_place ?? "",
                  }}
                />
              </div>
            </motion.div>
          </div>
          <div className="flex flex-col gap-6 items-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 0.9,
              }}
              viewport={{ once: false }}
            >
              <Link
                href={undangan?.undangan_content?.gmaps ?? ""}
                target="_blank"
              >
                <Button className="bg-theme7-primary hover:bg-theme7-primary text-white hover:text-white font-semibold">
                  <IconMapPin size={16} />
                  <span>Lihat di Google Maps</span>
                </Button>
              </Link>
            </motion.div>
            {undangan?.undangan_content?.stream_link && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  delay: 1.2,
                }}
                viewport={{ once: false }}
              >
                <p className="text-sm text-black font-semibold text-center pb-3">
                  Virtual Akad session:
                </p>
                <Link
                  href={undangan?.undangan_content?.stream_link ?? ""}
                  target="_blank"
                >
                  <Button className="bg-theme7-primary hover:bg-theme7-primary text-white hover:text-white font-semibold">
                    <IconDeviceTvOld size={16} />
                    <span>Live Streaming</span>
                  </Button>
                </Link>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 1.3,
              }}
              viewport={{ once: false }}
            >
              <p className="text-sm text-black text-center pb-3">
                Sebuah kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu
                dan teman-teman berkenan hadir dan memberikan doa restu.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Galeri */}
      <div className="py-16 bg-[url('/images/theme7/bg1.png')] bg-cover bg-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            delay: 0.2,
          }}
          viewport={{ once: false }}
          className="pb-8"
        >
          <h2 className="text-3xl font-medium text-center font-recoleta-alt text-black">
            Galeri Kami
          </h2>
        </motion.div>
        <Galeri
          galeri={undanganData.undangan_gallery}
          view={1.2}
          color="#df9d99"
        />
      </div>
      {/* Reservasi Ucapan Doa */}
      <UcapanConfirm
        tamu={tamu ?? tamuData}
        isLoading={isSubmitting}
        onSubmit={({ data }) => {
          onSubmitUcapan(data);
        }}
        bgColor="bg-white"
        fontHeading="font-recoleta-alt"
        bgButton="bg-theme7-primary"
        colorButton="text-white"
        colorHeading="text-black"
      />
      {/* Ucapan Doa List */}
      <div className="py-16 px-6 bg-white border-t border-theme7-primary">
        <div className="flex flex-col mb-8 items-center justify-center text-black">
          <h3 className="font-glitten text-3xl">Doa Terbaik</h3>
          <p className="text-sm">untuk {undangan?.undangan_content?.title}</p>
        </div>
        <div className="flex flex-col gap-6">
          {ucapan?.length === 0 && (
            <div className="text-center text-sm">
              Jadilah yang pertama untuk mengirimkan
              <br />
              doa ke calon pengantin
            </div>
          )}
          {ucapan?.map((item, index) => (
            <div
              className="bg-white border-l-3 border-theme7-primary rounded-br-4xl p-4 flex flex-col gap-3 bg-gradient-to-br from-white to-theme7-primary/15 shadow-lg"
              key={index}
            >
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-theme7-primary rounded-full flex items-center justify-center font-semibold text-white">
                  {item.name.charAt(0)}
                </div>
                <div className="flex-wrap">
                  <h6 className="font-semibold font-recoleta-alt mb-2 mt-1">
                    {item.name}
                  </h6>
                </div>
              </div>
              <div>
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: item.message,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center mt-8 gap-1">
          <img
            src="/images/kekawinan-logo.png"
            alt=""
            className="w-[40%] mx-auto"
          />
          <p className="text-xs text-center text-green-kwn">
            Part of Partnerinaja
          </p>
        </div>
      </div>

      {/* Floating Music Gift */}
      <FloatingMusicGift
        onPlayMusic={onPlayMusic}
        isPlayMusic={isPlayMusic}
        onOpenGift={() => setIsOpenGift(true)}
        bgColor="bg-theme7-primary"
      />

      {/* Open Dialog Gift */}
      <DialogGift
        gift={undanganData.undangan_gift}
        isOpen={isOpenGift}
        setIsOpen={setIsOpenGift}
      />
    </div>
  );
}
