"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const desc =
  "Buat daftar kado pernikahan sesuai kebutuhanmu, lalu bagikan link ke teman atau keluarga. Mereka bisa memilih langsung kado yang tersedia, jadi hadiah lebih bermanfaat, tidak mubazir, dan terhindar dari kado yang sama. ✨";

export default function GiftFeature() {
  return (
    <div className="py-16 md:py-24 bg-[url('/images/bg-gift-feat.png')] bg-cover bg-center">
      <div className="container">
        <div className="flex flex-wrap items-center">
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/images/image-gift.webp"
              alt=""
              width={800}
              height={800}
              className="w-[80%] mx-auto"
            />
          </motion.div>
          <motion.div
            className="w-full md:w-1/2 flex flex-col gap-4 mt-10 md:mt-0 text-center md:text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl text-black font-bold">
              Bingung Mau Kasih Kado? Sekarang Gak Lagi!
            </h2>
            <div
              className="text-lg text-black"
              dangerouslySetInnerHTML={{ __html: desc }}
            ></div>
            <div className="mt-4">
              <Link
                href="/auth/login"
                className="text-xl font-semibold underline underline-offset-4 text-green-kwn"
              >
                Buat Undangan Sekarang
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
