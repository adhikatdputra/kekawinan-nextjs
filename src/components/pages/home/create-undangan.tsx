"use client";

import { motion } from "motion/react";
import Image from "next/image";

const boxFlow = [
  {
    img: "/images/icon-daftar.png",
    name: "Buat Akun",
    desc: "Cinta dimulai dari sini — daftar cepat dalam 1 menit aja 💖",
  },
  {
    img: "/images/icon-undangan.png",
    name: "Buat Undangan",
    desc: "Tulis kisah kalian, pilih tema, dan aktifkan semua fitur romantis — semuanya gratis 🌸",
  },
  {
    img: "/images/icon-publish.png",
    name: "Publish",
    desc: "Sekali klik, undangan digitalmu langsung aktif dan siap dibagikan ✨",
  },
  {
    img: "/images/icon-whatsapp.png",
    name: "Sebar via Whatsapp",
    desc: "Bagikan undangan penuh cinta ke keluarga & sahabat. Sekali klik, langsung sampai 💌",
  },
];

export default function CreateUndangan() {
  return (
    <div className="container">
      <div className="bg-[#DFEBDD] py-16 md:py-24 rounded-3xl px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="text-black text-center text-4xl md:text-5xl mb-4 font-bold"
        >
          Bikin Undangan Romantis dalam Sekejap
        </motion.h2>
        <motion.div
          className="text-center font-medium text-black text-lg md:text-xl w-full max-w-[600px] mx-auto"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p
            dangerouslySetInnerHTML={{
              __html:
                "Bikin undangan digital semudah scroll TikTok. Gak ribet, gak bikin pusing, tinggal klik-klik aja 💃",
            }}
          ></p>
        </motion.div>
        <div className="flex flex-wrap pt-10">
          {boxFlow.map((item, index) => (
            <div className="w-full md:w-1/2 lg:w-1/4" key={index}>
              <motion.div
                className="bg-white p-6 rounded-tl-[32px] rounded-br-[32px] min-h-[300px] text-center flex flex-col justify-center gap-4 m-2 bg-[url('/images/bg-box.png')] bg-cover bg-center"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  delay: 0.6 + index * 0.2,
                }}
                viewport={{ once: true }}
              >
                <Image
                  src={item.img}
                  alt=""
                  className="w-[90px] mx-auto"
                  width={90}
                  height={90}
                />
                <div className="text-black font-bold text-xl">{item.name}</div>
                <div
                  className="text-sm text-black"
                  dangerouslySetInnerHTML={{ __html: item.desc }}
                ></div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
