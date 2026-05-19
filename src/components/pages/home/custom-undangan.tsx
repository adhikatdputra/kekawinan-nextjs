"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Palette, Sparkles } from "lucide-react";

const perks = [
  {
    icon: Palette,
    text: "Desain sesuai tema pernikahan — dari warna hingga layout",
  },
  {
    icon: Sparkles,
    text: "Animasi dan efek eksklusif yang tidak ada di template biasa",
  },
  {
    icon: MessageCircle,
    text: "Konsultasi langsung dengan tim desainer via WhatsApp",
  },
];

export default function CustomUndangan() {
  return (
    <section className="relative py-16 md:py-28 overflow-hidden bg-green-900">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Diagonal green lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.07]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="custom-lines"
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
                stroke="#86efac"
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#custom-lines)" />
        </svg>

        <div className="absolute -top-20 -right-20 w-[500px] h-[400px] bg-green-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[350px] bg-emerald-400/10 rounded-full blur-3xl" />

        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Left: Text */}
          <motion.div
            className="w-full md:w-1/2 flex flex-col gap-6 text-center md:text-left order-2 md:order-1"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Tag */}
            <div className="inline-flex items-center justify-center md:justify-start">
              <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold px-3 py-1 rounded-full">
                Custom Design
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl text-white font-bold leading-tight max-w-lg">
              Undangan Digital{" "}
              <span className="text-green-300">Sepenuhnya Custom</span>{" "}
              Sesuai Gaya Kamu
            </h2>

            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
              Template tidak selalu cukup untuk mengekspresikan keunikan cerita
              cintamu. Tim desainer Kekawinan.com siap membuatkan undangan
              digital pernikahan yang benar-benar personal — dari nol, sesuai
              visi kamu.
            </p>

            {/* Perks */}
            <ul className="flex flex-col gap-3">
              {perks.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3 text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-sm text-gray-300">{item.text}</span>
                  </motion.li>
                );
              })}
            </ul>

            {/* CTA */}
            <div className="mt-2">
              <Link
                href="https://wa.me/085772193242?text=Halo%20Kekawinan.com%2C%20saya%20ingin%20membuat%20undangan%20digital%20custom%20untuk%20pernikahan%20kami."
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="inline-flex items-center gap-2.5 bg-green-500 hover:bg-green-400 text-gray-900 font-bold px-8 py-4 rounded-full shadow-lg shadow-green-500/20 transition-all duration-200 hover:-translate-y-0.5">
                  <MessageCircle className="w-5 h-5" />
                  Konsultasi Gratis via WhatsApp
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            className="w-full md:w-1/2 relative order-1 md:order-2"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <div className="relative">
              {/* Glass frame */}
              <div className="absolute -inset-3 bg-gradient-to-br from-green-500/20 to-emerald-400/10 rounded-3xl border border-green-500/20" />
              <Image
                src="/images/image-banner-2.webp"
                alt="Layanan custom undangan digital pernikahan Kekawinan.com"
                className="relative w-[85%] mx-auto rounded-2xl"
                width={500}
                height={500}
              />
            </div>

            {/* Floating glass card */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute top-4 right-4 md:right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none mb-0.5">
                  100% Sesuai Keinginan
                </p>
                <p className="text-[11px] text-gray-300">
                  Desain eksklusif untukmu
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
