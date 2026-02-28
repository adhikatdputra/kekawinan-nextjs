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
    img: "/images/testi/image-1.png",
    name: "Arga & Nabila",
    msg: "Awalnya cuma coba-coba, ternyata hasilnya mewah banget! Tamu-tamu bilang undangannya modern dan elegan. Prosesnya juga gampang banget, tinggal klik langsung jadi 💍✨",
  },
  {
    img: "/images/testi/image-2.png",
    name: "Fahri & Alya",
    msg: "Design-nya clean, animasinya halus, dan bisa atur semuanya sendiri lewat CMS. Bener-bener ngebantu banget buat kita yang pengen praktis tapi tetap berkelas 🤍",
  },
  {
    img: "/images/testi/image-3.png",
    name: "Rizky & Intan",
    msg: "Nggak perlu ribet cetak-cetak lagi. Undangan online ini bikin semuanya lebih simple dan tetap terlihat eksklusif. Banyak yang kira ini custom mahal loh! 🔥",
  },
  {
    img: "/images/testi/image-4.png",
    name: "Dimas & Shafira",
    msg: "Template-nya estetik, loading-nya cepat, dan bisa share ke mana aja. Kita jadi lebih hemat waktu dan biaya tanpa ngorbanin kualitas 💐",
  },
  {
    img: "/images/testi/image-5.png",
    name: "Rafi & Zahra",
    msg: "Dari awal sampai launch, semuanya smooth banget. Undangannya cantik, responsif di HP, dan bikin hari bahagia kita terasa makin spesial 🥂✨",
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
