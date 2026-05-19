"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Star, Heart, Users, Sparkles, CheckCircle2 } from "lucide-react";

export default function Banner() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-green-50 via-emerald-50 to-green-soft-kwn py-20 md:py-0">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="diagonal-lines"
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
          <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
        </svg>
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-green-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-emerald-200/25 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-4">
          {/* Left: Text Content */}
          <div className="w-full md:w-[52%]">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2.5 mb-6"
            >
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-green-200/60 rounded-full px-4 py-2 shadow-sm">
                <div className="flex items-center justify-center w-6 h-6 bg-green-kwn rounded-full">
                  <Star className="w-3.5 h-3.5 text-white fill-white" />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  600+ Undangan Dibuat
                </span>
                <span className="text-sm text-gray-400">·</span>
                <Link
                  href="#testimoni"
                  className="text-sm text-green-700 font-semibold underline underline-offset-2"
                >
                  Baca Kisah Mereka
                </Link>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              viewport={{ once: true }}
              className="text-black text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4"
            >
              Undangan
              <br />
              <span className="text-green-kwn">Digital</span>{" "}
              <span className="relative">
                Pernikahan
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="6"
                  viewBox="0 0 300 6"
                  fill="none"
                >
                  <path
                    d="M0 5 Q75 1 150 4 Q225 7 300 3"
                    stroke="#16a34a"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
              <br />
              <span className="text-3xl md:text-5xl lg:text-6xl font-semibold text-gray-700">
                Gratis & Tanpa Ribet
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="w-16 h-0.5 bg-green-kwn mb-5 origin-left"
            />

            <motion.p
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true }}
              className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed max-w-lg"
            >
              Buat undangan pernikahan digital yang elegan dalam hitungan menit.
              Pilih dari puluhan tema eksklusif, sesuaikan konten, tambahkan
              musik, kelola RSVP tamu — lalu kirim langsung via WhatsApp.{" "}
              <strong className="text-gray-800">100% gratis.</strong>
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center gap-6 mb-8 flex-wrap"
            >
              {[
                { icon: Sparkles, value: "30+", label: "Tema Pilihan" },
                { icon: Users, value: "600+", label: "Pasangan Bahagia" },
                { icon: Heart, value: "Gratis", label: "Selamanya" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <div className="w-px h-8 bg-gray-200 -ml-3 mr-3" />}
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                    <stat.icon className="w-4 h-4 text-green-700" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 leading-none">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="text-white bg-green-kwn hover:bg-green-kwn/90 shadow-lg shadow-green-200/50 px-8"
                >
                  Buat Undangan — Gratis
                </Button>
              </Link>
              <Link href="#themes">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-green-kwn text-green-700 hover:bg-green-50 bg-white/70 backdrop-blur-sm px-8"
                >
                  Lihat Contoh Tema
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right: App UI Glass Cards (Image #8 style) */}
          <div className="w-full md:w-[45%] relative">
            <div className="relative h-[520px] md:h-[600px]">
              {/* Mesh gradient blob background */}
              <div className="absolute inset-2 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/70 via-green-100/50 to-teal-200/60" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-green-300/30 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-200/40 rounded-full blur-2xl" />
              </div>

              {/* Badge: 30+ Tema — top right */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute top-24 right-2 md:right-24 z-20 bg-white/85 backdrop-blur-md border border-white/80 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-900 leading-none">
                    30+ Tema Eksklusif
                  </p>
                  <p className="text-[10px] text-gray-400">Selalu diperbarui</p>
                </div>
              </motion.div>

              {/* Main invitation preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%]   overflow-hidden"
              >
                <Image
                  src="/images/image-banner.png"
                  alt="Contoh undangan digital pernikahan dari Kekawinan.com"
                  className="w-full h-auto"
                  width={400}
                  height={500}
                />
              </motion.div>

              {/* Glass card: RSVP */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute left-0 top-[22%] bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl px-3 py-3 shadow-xl z-20 max-w-[195px]"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-xs">💌</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-800">
                    RSVP Diterima!
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  <span className="text-[11px] text-gray-600">
                    Arga & Nabila akan hadir
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  <span className="text-[11px] text-gray-600">
                    Fahri & Alya — 2 orang
                  </span>
                </div>
              </motion.div>

              {/* Glass card: WhatsApp send */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.65 }}
                viewport={{ once: true }}
                className="absolute left-0 bottom-[18%] bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl px-3 py-3 shadow-xl z-20 max-w-[205px]"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-gray-800">
                    Terkirim via WhatsApp
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-snug">
                  Kirim undangan via WhatsApp dan lihat statistik konfirmasi hadir
                </p>
              </motion.div>

              {/* Glass card: Guest stat — bottom right */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
                viewport={{ once: true }}
                className="absolute right-2 bottom-4 bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl px-4 py-3 shadow-xl z-20 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-green-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-none mb-0.5">
                    150 Tamu
                  </p>
                  <p className="text-[11px] text-gray-500">
                    98% konfirmasi hadir
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
