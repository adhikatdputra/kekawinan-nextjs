"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type FaqItem = { q: string; a: string };
type FaqCategory = { category: string; items: FaqItem[] };

export default function FaqPageContent({
  faqs,
}: {
  faqs: FaqCategory[];
}) {
  const [openKey, setOpenKey] = useState<string | null>("0-0");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = faqs
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(
      (cat) =>
        cat.items.length > 0 &&
        (activeCategory === null || activeCategory === cat.category)
    );

  const totalQuestions = faqs.reduce((acc, c) => acc + c.items.length, 0);

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
                id="faqpage-lines"
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
            <rect width="100%" height="100%" fill="url(#faqpage-lines)" />
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
                {totalQuestions} Pertanyaan & Jawaban
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
            >
              Pusat Bantuan &{" "}
              <span className="text-green-kwn">FAQ Lengkap</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 text-base md:text-lg mb-8"
            >
              Semua jawaban seputar membuat undangan pernikahan digital di
              Kekawinan — dari cara daftar hingga fitur lanjutan.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative max-w-lg mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pertanyaan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-kwn/30 focus:border-green-kwn transition-all"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Sidebar — Category Filter */}
            <aside className="lg:w-56 flex-shrink-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Kategori
              </p>
              <div className="flex flex-row lg:flex-col gap-2 flex-wrap">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`text-left text-sm px-4 py-2.5 rounded-xl transition-all font-medium ${
                    activeCategory === null
                      ? "bg-green-kwn text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  Semua
                </button>
                {faqs.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() =>
                      setActiveCategory(
                        activeCategory === cat.category ? null : cat.category
                      )
                    }
                    className={`text-left text-sm px-4 py-2.5 rounded-xl transition-all font-medium ${
                      activeCategory === cat.category
                        ? "bg-green-kwn text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>

              {/* CTA */}
              <div className="hidden lg:block mt-10 p-5 bg-green-50 rounded-2xl border border-green-100">
                <div className="w-10 h-10 bg-green-kwn rounded-xl flex items-center justify-center mb-3">
                  <span className="text-xl">💌</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Siap buat undangan?
                </p>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Daftar gratis dan buat undangan digital pertamamu dalam menit.
                </p>
                <Link
                  href="/auth/register"
                  className="block text-center text-xs font-bold text-white bg-green-kwn rounded-xl px-4 py-2.5 hover:bg-green-kwn/90 transition-colors"
                >
                  Mulai Gratis
                </Link>
              </div>
            </aside>

            {/* FAQ Accordions */}
            <div className="flex-1 min-w-0">
              {search && filtered.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-4">🔍</p>
                  <p className="text-gray-500 text-sm">
                    Tidak ada hasil untuk &quot;{search}&quot;
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-10">
                  {filtered.map((cat, catIdx) => (
                    <div key={cat.category}>
                      <motion.h2
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="text-base font-bold text-green-800 mb-4 flex items-center gap-2"
                      >
                        <span className="w-1 h-5 bg-green-kwn rounded-full inline-block" />
                        {cat.category}
                        <span className="text-xs font-normal text-gray-400">
                          ({cat.items.length})
                        </span>
                      </motion.h2>

                      <div className="flex flex-col gap-2.5">
                        {cat.items.map((item, itemIdx) => {
                          const key = `${catIdx}-${itemIdx}`;
                          const isOpen = openKey === key;

                          return (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, y: 8 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.3,
                                delay: itemIdx * 0.04,
                              }}
                              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                                isOpen
                                  ? "border-green-200 bg-green-50/40 shadow-sm"
                                  : "border-gray-100 bg-white hover:border-green-100"
                              }`}
                            >
                              <button
                                onClick={() =>
                                  setOpenKey(isOpen ? null : key)
                                }
                                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                              >
                                <span
                                  className={`font-semibold text-sm leading-snug ${
                                    isOpen
                                      ? "text-green-800"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {item.q}
                                </span>
                                <span
                                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                    isOpen
                                      ? "bg-green-kwn text-white"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  {isOpen ? (
                                    <Minus className="w-3.5 h-3.5" />
                                  ) : (
                                    <Plus className="w-3.5 h-3.5" />
                                  )}
                                </span>
                              </button>

                              <AnimatePresence initial={false}>
                                {isOpen && (
                                  <motion.div
                                    key="answer"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                      duration: 0.25,
                                      ease: "easeInOut",
                                    }}
                                  >
                                    <p className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
                                      {item.a}
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mobile CTA */}
              <div className="lg:hidden mt-12 p-5 bg-green-50 rounded-2xl border border-green-100 text-center">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Siap membuat undangan?
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Daftar gratis dan mulai dalam hitungan menit.
                </p>
                <Link
                  href="/auth/register"
                  className="inline-block text-sm font-bold text-white bg-green-kwn rounded-xl px-6 py-3 hover:bg-green-kwn/90 transition-colors"
                >
                  Mulai Gratis Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
