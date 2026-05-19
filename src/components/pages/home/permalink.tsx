"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Link2, Lock, ArrowRight, Globe } from "lucide-react";

const highlights = [
  {
    icon: Globe,
    title: "URL Unik Pasangan",
    desc: "Dapatkan link undangan eksklusif seperti kekawinan.com/arga-nabila yang mudah diingat.",
  },
  {
    icon: Lock,
    title: "Amankan Sebelum Diambil",
    desc: "Setiap permalink hanya bisa dimiliki satu pasangan — daftarkan namamu sekarang.",
  },
];

export default function Permalink() {
  return (
    <section className="relative py-16 md:py-28 overflow-hidden bg-gradient-to-br from-emerald-50/80 via-green-50 to-white">
      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="perm-lines"
              patternUnits="userSpaceOnUse"
              width="40"
              height="40"
              patternTransform="rotate(-45)"
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
          <rect width="100%" height="100%" fill="url(#perm-lines)" />
        </svg>

        <div className="absolute -top-20 -left-20 w-[480px] h-[380px] bg-emerald-200/20 rounded-full blur-3xl" />

        <div className="absolute left-1/3 bottom-1/4 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Left: Text */}
          <motion.div
            className="w-full md:w-1/2 flex flex-col gap-5 text-center md:text-left order-2 md:order-1"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Tag */}
            <div className="inline-flex items-center justify-center md:justify-start">
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                <Link2 className="w-3 h-3" />
                Custom Permalink
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 font-bold leading-tight">
              Alamat Undangan{" "}
              <span className="text-green-kwn">Eksklusif</span> untuk{" "}
              Kisah Cinta Kalian
            </h2>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Buat link undangan pernikahan yang personal dan mudah diingat.
              Amankan URL unik pasangan kamu sebelum diambil orang lain —
              karena cerita cinta kalian layak punya alamatnya sendiri.
            </p>

            {/* URL preview glass card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-md border border-green-200/60 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-3 max-w-sm mx-auto md:mx-0"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 font-mono truncate">
                kekawinan.com/
                <span className="text-green-kwn font-semibold">arga-nabila</span>
              </div>
            </motion.div>

            {/* Highlights */}
            <div className="flex flex-col gap-4 mt-1">
              {highlights.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3 text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-base font-semibold text-green-kwn hover:text-green-700 transition-colors group"
              >
                Klaim Permalink-mu Sekarang
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            className="w-full md:w-1/2 relative order-1 md:order-2"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-tl from-green-100/50 to-emerald-50/50 rounded-3xl backdrop-blur-sm border border-green-200/40" />
              <Image
                src="/images/dashboard.png"
                alt="Custom permalink undangan digital pernikahan di Kekawinan.com"
                width={800}
                height={800}
                className="relative w-[85%] mx-auto rounded-2xl"
              />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute top-4 left-4 md:left-8 bg-white/80 backdrop-blur-md border border-white/80 rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Link2 className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 leading-none mb-0.5">
                  Link Personal
                </p>
                <p className="text-[11px] text-gray-500">Hanya milik kalian</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
