"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

const testimonial = [
  {
    img: "/images/testi/image-1.png",
    name: "Arga & Nabila",
    location: "Jakarta",
    rating: 5,
    msg: "Awalnya cuma coba-coba, ternyata hasilnya mewah banget! Tamu-tamu bilang undangannya modern dan elegan. Prosesnya gampang banget, tinggal klik langsung jadi.",
  },
  {
    img: "/images/testi/image-2.png",
    name: "Fahri & Alya",
    location: "Bandung",
    rating: 5,
    msg: "Design-nya clean, animasinya halus, dan bisa atur semuanya sendiri. Bener-bener ngebantu banget buat kita yang pengen praktis tapi tetap berkelas.",
  },
  {
    img: "/images/testi/image-3.png",
    name: "Rizky & Intan",
    location: "Surabaya",
    rating: 5,
    msg: "Nggak perlu ribet cetak-cetak lagi. Undangan online ini bikin semuanya lebih simple dan tetap terlihat eksklusif. Banyak yang kira ini custom mahal loh!",
  },
  {
    img: "/images/testi/image-4.png",
    name: "Dimas & Shafira",
    location: "Yogyakarta",
    rating: 5,
    msg: "Template-nya estetik, loading-nya cepat, dan bisa share ke mana aja. Kita jadi lebih hemat waktu dan biaya tanpa ngorbanin kualitas sama sekali.",
  },
  {
    img: "/images/testi/image-5.png",
    name: "Rafi & Zahra",
    location: "Semarang",
    rating: 5,
    msg: "Dari awal sampai launch semuanya smooth banget. Undangannya cantik, responsif di HP, dan bikin hari bahagia kita terasa makin spesial.",
  },
];

export default function Testimoni() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section
      id="testimoni"
      className="relative py-16 md:py-28 overflow-hidden bg-gradient-to-br from-green-soft-kwn via-emerald-50 to-green-soft-kwn"
    >
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="testi-lines" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(-30)">
              <line x1="0" y1="0" x2="0" y2="40" stroke="#16a34a" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testi-lines)" />
        </svg>
        <div className="absolute -top-20 -left-20 w-[450px] h-[350px] bg-green-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-[450px] h-[350px] bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-green-200/60 rounded-full px-4 py-1.5 mb-5 shadow-sm"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">600+ Pasangan Bahagia</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-900 text-3xl md:text-4xl font-bold mb-4 max-w-lg mx-auto leading-tight"
          >
            Dipercaya Ribuan Pasangan{" "}
            <span className="text-green-kwn">di Seluruh Indonesia</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-600 text-base max-w-sm mx-auto"
          >
            Lihat bagaimana Kekawinan.com membantu pasangan membuat undangan digital yang berkesan dan gratis.
          </motion.p>
        </div>

        {/* Swiper — no built-in navigation or pagination */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Swiper
            loop={true}
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            onSwiper={(s) => { swiperRef.current = s; }}
            onSlideChange={(s) => setCurrentIndex(s.realIndex)}
          >
            {testimonial.map((item, index) => (
              <SwiperSlide key={index} className="!h-auto">
                <div className="bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl p-6 flex flex-col gap-4 shadow-sm h-full">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-700 text-sm leading-relaxed flex-1">
                    &ldquo;{item.msg}&rdquo;
                  </p>

                  <div className="h-px bg-gray-100" />

                  {/* Profile */}
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.img}
                      alt={`Testimoni dari ${item.name}`}
                      width={48}
                      height={48}
                      className="w-11 h-11 object-cover rounded-full border-2 border-green-100 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.location}</p>
                    </div>
                    <div className="ml-auto w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">💍</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Custom navigation — centered, below slider */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-green-soft-kwn hover:border-green-200 hover:text-green-kwn transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {testimonial.map((_, i) => (
              <button
                key={i}
                onClick={() => swiperRef.current?.slideToLoop(i)}
                className={`rounded-full transition-all duration-300 ${
                  currentIndex % testimonial.length === i
                    ? "w-6 h-2.5 bg-green-kwn"
                    : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:bg-green-soft-kwn hover:border-green-200 hover:text-green-kwn transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
