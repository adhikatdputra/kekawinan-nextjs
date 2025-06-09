"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const testimonial = [
  {
    img: "/images/testi/aden.jpeg",
    name: "Rachman Muizzu",
    msg: "Undangannya keren banget! Desain kece, template oke, dan... GRATIS! Terbaik sih Kekawinan.com 🙌",
  },
  {
    img: "/images/testi/aden.jpeg",
    name: "Tengku Reza",
    msg: "Suka banget! Simpel, ada CMS-nya, dan timnya bantuin terus. Padahal gratis loh 😍",
  },
  {
    img: "/images/testi/aden.jpeg",
    name: "Reno & Dea",
    msg: "Nggak nyangka, template-nya cakep dan gampang banget dipakai. Bener-bener top! 👌",
  },
  {
    img: "/images/testi/aden.jpeg",
    name: "Adenda & Bella",
    msg: "Gratis tapi hasilnya estetik parah! Thank you Kekawinan.com 💕",
  },
];

export default function Testimoni() {
  return (
    <div className="py-16 md:py-24 bg-[url('/images/bg-testi.png')] bg-cover bg-center">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="text-black text-center text-4xl md:text-5xl mb-4 font-bold"
        >
          Lihat apa kata mereka
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-10"
        >
          <Swiper
            loop={true}
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            centeredSlides={true}
            breakpoints={{
              768: {
                slidesPerView: 2,
                centeredSlides: false,
              },
              1024: {
                slidesPerView: 3,
                centeredSlides: false,
              },
            }}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            className="mySwiper"
          >
            {testimonial.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-2xl p-4 flex flex-col justify-center items-center gap-4 min-h-[300px]">
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="w-[100px] h-[100px] object-cover rounded-full mx-auto"
                  />
                  <div className="font-semibold text-lg text-black">
                    {item.name}
                  </div>
                  <div className="text-black text-sm text-center">{item.msg}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </div>
  );
}
