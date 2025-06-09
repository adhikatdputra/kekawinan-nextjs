"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function CustomUndangan() {
  return (
    <div className="py-16 md:py-24 bg-[url('/images/bg-last.png')] bg-cover bg-center">
      <div className="container">
        <div className="flex flex-wrap items-center">
          <motion.div
            className="w-full md:w-1/2 md:order-last"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Image
              src="/images/image-banner-2.png"
              alt=""
              className="w-[80%] mx-auto"
              width={500}
              height={500}
            />
          </motion.div>
          <motion.div
            className="w-full md:w-1/2 flex flex-col gap-4 mt-10 md:mt-0 text-center md:text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl text-white font-bold mb-4">
              Custom Undangan Sesuai Gaya Kamu? Bisa Banget!
            </h2>
            <div className="text-lg text-white">
              Sesuaikan undangan digitalmu agar matching dengan tema pernikahan
              dan vibe hubungan kalian. Yuk, mulai dari sini!
            </div>
            <div className="mt-8 md:mt-12">
              <Link
                href="https://wa.me/085772193242?text=Halo%20Kekawinan.com%2C%20saya%20ingin%20membuat%20undangan%20digital%20untuk%20pernikahan%20kami."
                target="_blank"
                className="text-xl font-semibold underline underline-offset-4 text-white"
              >
                Konsultasi Sekarang
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
