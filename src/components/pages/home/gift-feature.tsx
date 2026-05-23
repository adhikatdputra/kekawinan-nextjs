"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, Gift, ArrowRight } from "lucide-react";

const benefits = [
  "Tamu pilih kado dari daftar yang sudah kamu buat — tidak ada kado dobel",
  "Tambahkan nomor rekening, e-wallet, atau alamat pengiriman hadiah",
  "Tamu konfirmasi kado yang dipilih langsung dari undangan digital",
  "Semua daftar kado terintegrasi dalam satu halaman undangan pernikahan",
];

export default function GiftFeature() {
  return (
    <section className="relative py-16 md:py-28 overflow-hidden bg-gray-50">
      {/* Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-green-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[300px] bg-emerald-100/40 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Left: Image */}
          <motion.div
            className="w-full md:w-1/2 relative"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* White card frame — provides contrast for the green-toned image */}
            <div className="relative bg-white rounded-3xl shadow-xl p-4 border border-gray-100 py-12">
              <Image
                src="/images/gift-image.webp"
                alt="Fitur daftar kado pernikahan digital di Kekawinan.com"
                width={800}
                height={800}
                className="w-[80%] mx-auto rounded-2xl"
              />
            </div>

            {/* Floating glass badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -top-8 md:top-15 right-4 md:-right-12 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Gift className="w-4 h-4 text-green-700" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 leading-none mb-0.5">
                  Kado Tepat Sasaran
                </p>
                <p className="text-[11px] text-gray-500">Tidak ada yang dobel</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            className="w-full md:w-1/2 flex flex-col gap-5 text-center md:text-left"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            {/* Tag */}
            <div className="inline-flex items-center justify-center md:justify-start">
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                Fitur Daftar Kado
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 font-bold leading-tight">
              Daftar Kado Pernikahan{" "}
              <span className="text-green-kwn">yang Bermakna,</span>{" "}
              Bukan yang Mubazir
            </h2>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Buat wishlist kado pernikahan dan bagikan ke tamu undangan. Mereka
              memilih langsung dari daftar yang kamu siapkan — jadi setiap hadiah
              punya makna dan benar-benar dibutuhkan.
            </p>

            {/* Benefit list */}
            <ul className="flex flex-col gap-3">
              {benefits.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3 text-left"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-gray-700">
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-base font-semibold text-green-kwn hover:text-green-700 transition-colors group"
              >
                Buat Undangan dengan Daftar Kado
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
