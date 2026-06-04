"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    q: "Apakah Kekawinan benar-benar gratis?",
    a: "Ya, 100% gratis selamanya. Kamu bisa membuat undangan pernikahan digital lengkap — pilih tema, isi konten, kelola tamu, terima RSVP, hingga kirim via WhatsApp — tanpa biaya apapun.",
  },
  {
    q: "Berapa banyak tema undangan yang tersedia?",
    a: "Saat ini tersedia 16+ tema undangan yang bisa dicoba gratis. Mulai dari modern minimalis, romantic floral, classic elegant, hingga dark romance. Tim kami terus menambahkan tema baru secara rutin.",
  },
  {
    q: "Apakah saya bisa mengubah isi undangan setelah dikirim?",
    a: "Bisa! Semua konten undangan bisa diubah kapan saja melalui dashboard. Perubahan langsung tampil real-time — tamu yang membuka ulang link akan melihat versi terbaru.",
  },
  {
    q: "Bagaimana cara mengelola konfirmasi kehadiran (RSVP)?",
    a: "Setiap tamu yang menerima link undangan bisa mengisi konfirmasi kehadiran langsung di halaman undangan. Semua konfirmasi masuk ke dashboard-mu secara real-time — kamu bisa pantau jumlah tamu hadir, tidak hadir, dan masih menunggu konfirmasi.",
  },
  {
    q: "Apakah undangan bisa dibuka di semua perangkat?",
    a: "Ya, undangan Kekawinan responsif di semua perangkat — HP, tablet, maupun laptop. Tampilannya otomatis menyesuaikan layar tamu.",
  },
  {
    q: "Berapa banyak tamu yang bisa ditambahkan?",
    a: "Tidak ada batasan jumlah tamu. Kamu bisa menambahkan ratusan bahkan ribuan tamu, membuat link undangan personal untuk masing-masing tamu, dan mengirim semuanya sekaligus via WhatsApp.",
  },
  {
    q: "Apakah ada fitur kado digital?",
    a: "Ada! Kamu bisa menambahkan rekening bank, e-wallet (GoPay, OVO, Dana, dll.), dan daftar wishlist ke halaman undangan. Tamu bisa melihat dan memilih cara memberikan kado langsung dari undangan.",
  },
  {
    q: "Bisakah orang lain (keluarga/WO) ikut mengelola undangan?",
    a: "Bisa. Fitur Kolaborator memungkinkan kamu mengundang anggota keluarga atau Wedding Organizer untuk ikut mengelola undangan, tamu, dan RSVP — dengan akses yang bisa kamu atur.",
  },
];

export default function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-16 md:py-28 overflow-hidden bg-white">
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="faq-dots"
              patternUnits="userSpaceOnUse"
              width="28"
              height="28"
            >
              <circle cx="2" cy="2" r="1.5" fill="#16a34a" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#faq-dots)" />
        </svg>
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-green-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] bg-emerald-100/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-green-50 border border-green-200/60 rounded-full px-4 py-1.5 mb-5"
            >
              <span className="w-2 h-2 rounded-full bg-green-kwn" />
              <span className="text-sm font-semibold text-green-800">
                Pertanyaan Umum
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-gray-900 text-3xl md:text-4xl font-bold mb-4 leading-tight"
            >
              Ada Pertanyaan tentang{" "}
              <span className="text-green-kwn">Kekawinan?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-600 text-base"
            >
              Jawaban untuk pertanyaan yang paling sering ditanyakan. Tidak
              menemukan jawabanmu?{" "}
              <Link
                href="/faq"
                className="text-green-kwn font-semibold hover:underline underline-offset-2"
              >
                Lihat FAQ lengkap
              </Link>
              .
            </motion.p>
          </div>

          {/* Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col gap-3"
          >
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  openIndex === i
                    ? "border-green-200 bg-green-50/50 shadow-sm"
                    : "border-gray-100 bg-white hover:border-green-100"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span
                    className={`font-semibold text-sm md:text-base leading-snug ${
                      openIndex === i ? "text-green-800" : "text-gray-900"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      openIndex === i
                        ? "bg-green-kwn text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {openIndex === i ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <p className="px-6 pb-5 text-sm md:text-base text-gray-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <p className="text-gray-500 text-sm mb-3">
              Masih ada pertanyaan lain?
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-green-kwn font-semibold text-sm border border-green-200 rounded-full px-5 py-2.5 hover:bg-green-50 transition-colors"
            >
              Lihat semua FAQ
              <span className="text-xs bg-green-kwn text-white rounded-full px-2 py-0.5">
                Lengkap
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
