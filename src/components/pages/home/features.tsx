"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

const features = [
  {
    tag: "Desain",
    name: "30+ Tema Undangan Eksklusif",
    desc: "Pilih dari template modern, klasik, rustic, hingga floral — selalu hadir tema baru, gratis.",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    isNew: false,
    color: "from-emerald-500/20 to-green-600/30",
  },
  {
    tag: "Kustomisasi",
    name: "Edit Konten Sesuka Hati",
    desc: "Ubah nama, tanggal, venue, dan foto prewed langsung dari dashboard. Tanpa keahlian desain.",
    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
    isNew: false,
    color: "from-green-500/20 to-teal-600/30",
  },
  {
    tag: "Pengalaman",
    name: "Musik Latar Favorit",
    desc: "Tambahkan lagu kesukaan sebagai pengiring undangan — buat tamu merasakan momen spesialmu.",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80",
    isNew: false,
    color: "from-teal-500/20 to-emerald-600/30",
  },
  {
    tag: "Kado",
    name: "Daftar Kado & Hadiah",
    desc: "Tampilkan wishlist, rekening, dan e-wallet — tamu pilih kado langsung dari undanganmu.",
    img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    isNew: false,
    color: "from-emerald-400/20 to-green-500/30",
  },
  {
    tag: "Personalisasi",
    name: "Nama Tamu Otomatis",
    desc: "Tiap link undangan menampilkan nama tamu secara personal — buat mereka merasa istimewa.",
    img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
    isNew: false,
    color: "from-green-400/20 to-emerald-500/30",
  },
  {
    tag: "Distribusi",
    name: "Kirim via WhatsApp Massal",
    desc: "Undangan otomatis terkirim ke seluruh tamu via WhatsApp — personal, cepat, tak ada yang terlewat.",
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    isNew: false,
    color: "from-teal-400/20 to-green-500/30",
  },
  {
    tag: "Interaktif",
    name: "RSVP & Ucapan Tamu",
    desc: "Konfirmasi kehadiran dan ucapan tamu — terintegrasi langsung di dalam undangan digital.",
    img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80",
    isNew: false,
    color: "from-emerald-500/20 to-teal-600/30",
  },
  {
    tag: "Baru",
    name: "Halaman Love Story",
    desc: "Ceritakan perjalanan cinta kamu dan pasangan dalam halaman eksklusif yang menyentuh hati.",
    img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80",
    isNew: true,
    color: "from-green-500/20 to-emerald-600/30",
  },
  {
    tag: "Manajemen",
    name: "Dashboard Kehadiran Tamu",
    desc: "Pantau siapa hadir, baca ucapan, dan kelola seluruh tamu dari satu dashboard yang rapi.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    isNew: false,
    color: "from-teal-500/20 to-green-600/30",
  },
  {
    tag: "Baru",
    name: "Absen via Scan QR Code",
    desc: "Tamu absen kehadiran cukup dengan scan QR Code unik — cepat, akurat, tanpa antre di meja resepsi.",
    img: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=600&q=80",
    isNew: true,
    color: "from-emerald-400/20 to-teal-500/30",
  },
  {
    tag: "Baru",
    name: "Kolaborator — Member & Crew",
    desc: "Undang keluarga atau WO sebagai kolaborator — kelola undangan, tamu, dan RSVP bersama.",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    isNew: true,
    color: "from-green-400/20 to-emerald-500/30",
  },
];

export default function Features() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = features.length;

  return (
    <section className="relative bg-green-soft-kwn py-16 md:py-28 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="feat-lines" patternUnits="userSpaceOnUse" width="50" height="50" patternTransform="rotate(-30)">
              <line x1="0" y1="0" x2="0" y2="50" stroke="#16a34a" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#feat-lines)" />
        </svg>
        <div className="absolute -top-20 -right-20 w-[500px] h-[400px] bg-green-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-200/15 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-green-200/60 rounded-full px-4 py-1.5 mb-5 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-green-kwn" />
            <span className="text-sm font-semibold text-green-800">Semua Fitur, 100% Gratis</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-900 text-3xl md:text-4xl font-bold mb-4 max-w-md mx-auto leading-tight"
          >
            Semua yang Kamu Butuhkan untuk{" "}
            <span className="text-green-kwn">Undangan Digital</span> Sempurna
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-600 text-base max-w-md mx-auto"
          >
            Dari template hingga manajemen RSVP tamu — semua fitur premium tersedia gratis.
          </motion.p>
        </div>

        {/* Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Swiper
            modules={[Navigation]}
            slidesPerView={1.2}
            spaceBetween={16}
            centeredSlides={false}
            breakpoints={{
              640: { slidesPerView: 2.1, spaceBetween: 20 },
              1024: { slidesPerView: 3.1, spaceBetween: 24 },
            }}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
            className="!overflow-visible"
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index} className="!h-auto">
                <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col cursor-grab active:cursor-grabbing">
                  {/* Image area */}
                  <div className="relative h-52 overflow-hidden flex-shrink-0">
                    <Image
                      src={feature.img}
                      alt={feature.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 30vw"
                    />
                    {/* Gradient overlay bottom */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${feature.color} mix-blend-multiply`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    {/* "BARU" badge */}
                    {feature.isNew && (
                      <span className="absolute top-3 right-3 bg-green-kwn text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                        BARU
                      </span>
                    )}

                    {/* Tag at bottom of image */}
                    <span className="absolute bottom-3 left-3 bg-white/25 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/30">
                      {feature.tag}
                    </span>
                  </div>

                  {/* Text area */}
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <h3 className="text-base font-bold text-gray-900 leading-snug">
                      {feature.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Navigation: Prev / Counter / Next */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all px-5 py-2.5 rounded-full shadow-sm text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium tabular-nums">
            <span className="text-green-kwn font-bold">{String(currentIndex + 1).padStart(2, "0")}</span>
            <span className="text-gray-300">/</span>
            <span>{String(total).padStart(2, "0")}</span>
          </div>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="flex items-center gap-2 bg-green-kwn text-white hover:bg-green-kwn/90 transition-all px-5 py-2.5 rounded-full shadow-sm text-sm font-medium"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
