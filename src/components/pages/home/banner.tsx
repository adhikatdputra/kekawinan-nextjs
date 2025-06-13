"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

const desc = `Bikin undangan digital gak perlu ribet!Pilih desain sesuai selera,
              atur sendiri isinya, dan kirim ke tamu lewat WhatsApp.Gratis,
              praktis, dan pastinya bikin momen kamu makin berkesan 💫
              <br />
              <br />
              💌 Mulai sekarang di Kekawinan.com
              <br />
              Karena undangan juga bagian dari cerita cintamu 💖`;

export default function Banner() {
  return (
    <div className="bg-[url('/images/background-banner.png')] bg-cover bg-center min-h-screen flex items-center justify-center py-16 md:py-0">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-2/5 md:order-last">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 0.4,
              }}
              viewport={{ once: true }}
            >
              <Image
                src="/images/image-banner.png"
                alt=""
                className="w-[70%] md:w-[80%] mx-auto"
                width={1000}
                height={1000}
              />
            </motion.div>
          </div>
          <div className="w-full md:w-3/5">
            <motion.h1
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 0.2,
              }}
              viewport={{ once: true }}
              className="text-black text-4xl md:text-7xl mb-6 mt-6 md:mt-0 font-bold w-full md:w-[90%]"
            >
              Buat Undangan Digital Tanpa Ribet Gratis!
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 0.4,
              }}
              viewport={{ once: true }}
              className="text-lg text-black w-full md:w-[90%]"
              dangerouslySetInnerHTML={{ __html: desc }}
            ></motion.div>
            <motion.div
              className="mt-6 md:mt-8"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 0.6,
              }}
              viewport={{ once: true }}
            >
              <Link href="/auth/login">
                <Button size="lg" className="text-white">
                  Daftar Sekarang
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
