"use client";

import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import themeApi from "@/frontend/api/theme";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

interface Theme {
  thumbnail: string;
  componentName: string;
}

export default function Themes() {
  const { data: themes, isLoading } = useQuery({
    queryKey: ["themes"],
    queryFn: () => themeApi.getTheme(),
    select: (data) => data.data.data?.rows,
  });

  return (
    <section
      id="themes"
      className="relative py-16 md:py-28 overflow-hidden bg-white"
    >
      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="theme-lines"
              patternUnits="userSpaceOnUse"
              width="40"
              height="40"
              patternTransform="rotate(30)"
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
          <rect width="100%" height="100%" fill="url(#theme-lines)" />
        </svg>

        {/* Curved ribbon */}
        <svg
          className="absolute -bottom-10 -right-10 w-[500px] h-[350px] opacity-[0.06]"
          viewBox="0 0 500 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M500 350 Q350 250 250 150 Q150 60 0 0"
            stroke="#16a34a"
            strokeWidth="70"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <div className="absolute top-1/3 left-1/2 w-80 h-80 bg-green-50/60 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Section header */}
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
              Selalu Diperbarui
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-900 text-3xl md:text-4xl font-bold mb-4 max-w-lg mx-auto"
          >
            Template Undangan{" "}
            <span className="text-green-kwn">Pilihan Pasangan Indonesia</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto"
          >
            Dari desain modern minimalis hingga klasik elegan — semua template
            undangan pernikahan bisa kamu coba secara gratis sebelum memilih.
          </motion.p>
        </div>

        {/* Desktop grid — flex-wrap so last row is always centered */}
        <motion.div
          className="hidden md:flex flex-wrap justify-center gap-4 pt-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true }}
        >
          {themes?.map((theme: Theme, index: number) => (
            <Link
              key={index}
              href={`/${theme?.componentName.toLowerCase()}/demo`}
              className="w-[calc(16.66%-14px)] min-w-[120px]"
            >
              <div className="relative group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <Image
                  src={theme?.thumbnail}
                  alt={`Template undangan digital pernikahan ${theme?.componentName}`}
                  className="w-full h-auto"
                  width={200}
                  height={300}
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-white/90 text-gray-900 text-xs font-bold px-3 py-2 rounded-full shadow-lg">
                    Lihat Demo
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Mobile swiper */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="pt-4 md:hidden"
        >
          {!isLoading && themes?.length > 0 && (
            <Swiper
              loop={true}
              modules={[Autoplay, Navigation]}
              spaceBetween={16}
              slidesPerView={1.5}
              centeredSlides={true}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              navigation={true}
              className="mySwiper"
              style={
                {
                  "--swiper-navigation-color": "#5BA878",
                } as React.CSSProperties
              }
            >
              {themes?.map((theme: Theme, index: number) => (
                <SwiperSlide key={index}>
                  <Link href={`/${theme?.componentName.toLowerCase()}/demo`}>
                    <div className="relative group rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                      <Image
                        src={theme?.thumbnail}
                        alt={`Template undangan digital ${theme?.componentName}`}
                        className="w-full h-auto"
                        width={200}
                        height={300}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-white/90 text-gray-900 text-xs font-bold px-3 py-2 rounded-full">
                          Lihat Demo
                        </span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-10 md:mt-12"
        >
          <Link href="/auth/login">
            <Button
              size="lg"
              className="text-white bg-green-kwn hover:bg-green-kwn/90 shadow-lg shadow-green-200/50 inline-flex items-center gap-2"
            >
              Pilih Template & Buat Undangan Gratis
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
