"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const desc =
  "Temukan alamat undangan yang paling pas untuk nama kalian berdua. Amankan sebelum jadi milik pasangan lain — karena kisah cintakalian layak dikenang dengan indah. ✨";

export default function Permalink() {
  return (
    <div className="py-16 md:py-24 bg-[url('/images/bg-section.png')] bg-cover bg-center">
      <div className="container">
        <div className="flex flex-wrap items-center">
          <motion.div
            className="w-full md:w-1/2 md:order-last"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/images/image-create.webp"
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
              Alamat Spesial untuk Kisah Cinta Kalian
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
