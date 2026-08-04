"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  IconHeart,
  IconSparkles,
  IconUsersGroup,
  IconRocket,
  IconGift,
  IconDeviceMobile,
  IconShieldCheck,
  IconMoodSmile,
} from "@tabler/icons-react";

const stats = [
  { value: "16+", label: "Tema Undangan" },
  { value: "100%", label: "Gratis Selamanya" },
  { value: "∞", label: "Tanpa Batas Tamu" },
  { value: "2022", label: "Sejak Tahun" },
];

const values = [
  {
    icon: IconHeart,
    title: "Untuk Semua Pasangan",
    desc: "Kami percaya setiap pasangan berhak punya undangan yang indah — tanpa harus mahal atau ribet.",
  },
  {
    icon: IconSparkles,
    title: "Sederhana & Elegan",
    desc: "Desain modern, mudah dibuat dalam hitungan menit, tanpa perlu keahlian desain atau coding.",
  },
  {
    icon: IconShieldCheck,
    title: "Aman & Terpercaya",
    desc: "Data kamu dan tamu tersimpan aman. Kami tidak pernah membagikannya ke pihak ketiga.",
  },
  {
    icon: IconMoodSmile,
    title: "Selalu Berkembang",
    desc: "Kami terus menambahkan tema dan fitur baru berdasarkan masukan dari pengguna kami.",
  },
];

const features = [
  {
    icon: IconDeviceMobile,
    title: "Undangan Digital Responsif",
    desc: "Tampil sempurna di HP, tablet, maupun laptop tamu kamu.",
  },
  {
    icon: IconUsersGroup,
    title: "Kelola Tamu & RSVP",
    desc: "Pantau kehadiran tamu real-time, lengkap dengan QR Code absensi di hari H.",
  },
  {
    icon: IconGift,
    title: "Kado & Amplop Digital",
    desc: "Tamu bisa memberi kado lewat rekening, e-wallet, atau wishlist langsung dari undangan.",
  },
  {
    icon: IconRocket,
    title: "Kirim via WhatsApp",
    desc: "Bagikan link undangan personal ke tamu secara massal hanya dengan sekali klik.",
  },
];

export default function AboutPageContent() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-green-soft-kwn via-emerald-50 to-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.05]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="aboutpage-lines"
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
            <rect width="100%" height="100%" fill="url(#aboutpage-lines)" />
          </svg>
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-green-200/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-[300px] h-[300px] bg-emerald-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-kwn transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>

          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/70 border border-green-200/60 rounded-full px-4 py-1.5 mb-5 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-green-kwn" />
              <span className="text-sm font-semibold text-green-800">
                Tentang Kekawinan
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
            >
              Undangan Pernikahan Digital,{" "}
              <span className="text-green-kwn">Gratis untuk Semua</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 text-base md:text-lg"
            >
              Kekawinan lahir dari keyakinan sederhana: momen paling berharga
              dalam hidup tak seharusnya mahal untuk dibagikan. Kami membantu
              pasangan Indonesia membuat undangan digital yang indah, personal,
              dan mudah — tanpa biaya.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 -mt-8 md:-mt-12 relative z-20">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center"
            >
              <p className="text-2xl md:text-3xl font-bold text-green-kwn mb-1">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-6"
          >
            Cerita Kami
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-600 text-base md:text-lg leading-relaxed space-y-4 text-left md:text-center"
          >
            <p>
              Merencanakan pernikahan itu melelahkan — dan seringkali mahal.
              Kami melihat banyak pasangan harus merogoh kocek dalam hanya untuk
              undangan digital. Padahal, membagikan kabar bahagia seharusnya
              menyenangkan, bukan membebani.
            </p>
            <p>
              Maka sejak 2022, kami membangun Kekawinan: platform undangan
              pernikahan digital yang benar-benar gratis, indah, dan mudah
              digunakan. Dari pemilihan tema, kelola tamu, RSVP, hingga kado
              digital — semuanya bisa diatur sendiri dalam hitungan menit.
            </p>
            <p>
              Hari ini, ribuan pasangan telah mempercayakan momen istimewa
              mereka kepada Kekawinan. Dan kami baru saja memulai. 💚
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-green-soft-kwn/40 border-y border-green-100/60 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Nilai yang Kami Pegang
            </h2>
            <p className="text-gray-600">
              Prinsip yang menjadi fondasi setiap keputusan kami.
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
            {values.map((val, i) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-soft-kwn flex items-center justify-center">
                    <Icon size={24} className="text-green-kwn" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1.5">
                      {val.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Yang Kami Tawarkan
          </h2>
          <p className="text-gray-600">
            Semua yang kamu butuhkan untuk undangan pernikahan digital — dalam
            satu platform.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex gap-4 rounded-2xl border border-gray-100 p-6 hover:border-green-100 hover:shadow-sm transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-kwn flex items-center justify-center">
                  <Icon size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1.5">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl bg-green-kwn px-8 py-14 md:px-16 md:py-20 text-center"
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Siap Membuat Undangan Impianmu?
            </h2>
            <p className="text-green-50 text-base md:text-lg mb-8 max-w-xl mx-auto">
              Bergabung dengan ribuan pasangan yang telah membuat undangan
              digital gratis di Kekawinan. Mulai sekarang, tanpa biaya.
            </p>
            <Link
              href="/auth/register"
              className="inline-block bg-white text-green-kwn font-bold text-sm md:text-base rounded-full px-8 py-3.5 hover:bg-green-50 transition-colors shadow-lg"
            >
              Mulai Gratis Sekarang
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
