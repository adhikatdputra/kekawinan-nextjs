"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    img: "/images/icon-daftar.png",
    name: "Daftar Akun Gratis",
    desc: "Buat akun di Kekawinan.com dalam kurang dari 1 menit. Tidak perlu kartu kredit, langsung bisa digunakan.",
  },
  {
    number: "02",
    img: "/images/icon-undangan.png",
    name: "Buat & Sesuaikan Undangan",
    desc: "Pilih tema undangan digital favoritmu, isi data pernikahan, tambahkan foto, musik, dan aktifkan fitur RSVP.",
  },
  {
    number: "03",
    img: "/images/icon-publish.png",
    name: "Publish dengan Satu Klik",
    desc: "Undangan pernikahanmu langsung aktif dan bisa diakses lewat link personal yang sudah kamu buat.",
  },
  {
    number: "04",
    img: "/images/icon-whatsapp.png",
    name: "Sebar via WhatsApp",
    desc: "Kirim undangan digital ke semua tamu lewat WhatsApp — otomatis mencantumkan nama tiap tamu.",
  },
];

export default function CreateUndangan() {
  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-[#DFEBDD] to-emerald-100/80 py-16 md:py-24 rounded-3xl px-6 md:px-14 overflow-hidden">
          {/* Diagonal line decoration inside card */}
          <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden">
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.06]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="how-lines"
                  patternUnits="userSpaceOnUse"
                  width="40"
                  height="40"
                  patternTransform="rotate(-40)"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="40"
                    stroke="#16a34a"
                    strokeWidth="1.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#how-lines)" />
            </svg>

            <div className="absolute -top-20 -right-20 w-[400px] h-[350px] bg-green-300/15 rounded-full blur-3xl" />

            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-green-200/20 rounded-full blur-3xl" />
          </div>

          {/* Header */}
          <div className="relative z-10 text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-green-300/50 rounded-full px-4 py-1.5 mb-5"
            >
              <span className="w-2 h-2 rounded-full bg-green-kwn" />
              <span className="text-sm font-semibold text-green-800">
                4 Langkah Mudah
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true }}
              className="text-gray-900 text-3xl md:text-4xl font-bold mb-4 max-w-lg mx-auto"
            >
              Buat Undangan Digital dalam{" "}
              <span className="text-green-kwn">Hitungan Menit</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-600 text-base md:text-lg max-w-xl mx-auto"
            >
              Proses pembuatan undangan pernikahan online di Kekawinan.com
              sangat mudah — tidak perlu keahlian desain atau teknis sama sekali.
            </motion.p>
          </div>

          {/* Steps */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 0.1 * index,
                }}
                viewport={{ once: true }}
                className="group relative bg-white/75 backdrop-blur-sm border border-white/80 rounded-tl-[28px] rounded-br-[28px] rounded-tr-2xl rounded-bl-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center gap-4"
              >
                {/* Step number */}
                <span className="absolute top-4 right-5 text-4xl font-black text-green-200 leading-none select-none">
                  {item.number}
                </span>

                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-green-50 flex items-center justify-center">
                  <Image
                    src={item.img}
                    alt={item.name}
                    className="w-12 h-12 object-contain"
                    width={48}
                    height={48}
                  />
                </div>

                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>

                {/* Connector arrow (hidden on last) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-green-kwn rounded-full items-center justify-center shadow-md">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="relative z-10 text-center mt-10 md:mt-12"
          >
            <Link href="/auth/login">
              <button className="inline-flex items-center gap-2 bg-green-kwn text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-green-200/50 hover:bg-green-kwn/90 transition-colors">
                Mulai Buat Undangan Gratis
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
