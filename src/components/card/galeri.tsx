import Image from "next/image";
import { UndanganGaleri } from "@/frontend/interface/undangan";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Galeri({
  galeri,
  navigation = true,
  pagination = true,
  color = "#4A763E",
  view = 1.5,
}: {
  galeri: UndanganGaleri[];
  navigation?: boolean;
  pagination?: boolean;
  color?: string;
  view?: number;
}) {
  return (
    <div>
      <Swiper
        loop={true}
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={view}
        centeredSlides={true}
        navigation={navigation}
        pagination={pagination}
        className="w-full"
        style={
          {
            "--swiper-navigation-color": color,
            "--swiper-navigation-size": "32px",
            "--swiper-pagination-color": color,
            "--swiper-pagination-bullet-size": "5px",
            paddingBottom: "40px",
          } as React.CSSProperties
        }
      >
        {galeri.map((item) => (
          <SwiperSlide key={item.id}>
            <Image
              src={item.image}
              alt="galeri"
              width={500}
              height={500}
              className="w-full rounded-2xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
