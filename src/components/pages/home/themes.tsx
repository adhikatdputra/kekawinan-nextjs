"use client";

import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import themeApi from "@/frontend/api/theme";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

interface Theme {
  thumbnail: string;
  component_name: string;
}

export default function Themes() {
  const { data: themes, isLoading } = useQuery({
    queryKey: ["themes"],
    queryFn: () => themeApi.getTheme(),
    select: (data) => data.data.data?.rows,
  });

  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="text-black text-center text-4xl md:text-5xl mb-4 font-bold"
        >
          Pilih Template, Wujudkan Kisahmu
        </motion.h2>
        <motion.div
          className="text-center font-medium text-black text-lg md:text-xl w-full max-w-[600px] mx-auto"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p
            dangerouslySetInnerHTML={{
              __html:
                "Semua template undangan ini bisa kamu coba — gratis, mudah, dan siap buat hari bahagiamu makin spesial. ✨",
            }}
          ></p>
        </motion.div>
        <motion.div
          className="hidden md:flex flex-wrap justify-center gap-6 pt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
          viewport={{ once: true }}
        >
          {themes?.map((theme: Theme, index: number) => (
            <div className="w-full md:w-1/6" key={index}>
              <Link href={`/${theme?.component_name.toLowerCase()}/demo`}>
                <div className="relative group">
                  <Image
                    src={theme?.thumbnail}
                    alt=""
                    className="w-full rounded-2xl"
                    width={100}
                    height={100}
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <Button>Lihat Undangan</Button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-10 md:hidden"
        >
          {!isLoading && themes?.length > 0 && (
            <Swiper
              loop={true}
              modules={[Autoplay, Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              centeredSlides={true}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              navigation={true}
              className="mySwiper"
              style={
                {
                  "--swiper-navigation-color": "#A5BA9E",
                } as React.CSSProperties
              }
            >
              {themes?.map((theme: Theme, index: number) => (
                <SwiperSlide key={index}>
                  <div className="relative group">
                    <Image
                      src={theme?.thumbnail}
                      alt=""
                      className="w-full rounded-2xl"
                      width={100}
                      height={100}
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                      <Link
                        href={`/${theme?.component_name.toLowerCase()}/demo`}
                      >
                        <Button>Lihat Undangan</Button>
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </motion.div>
      </div>
    </div>
  );
}
