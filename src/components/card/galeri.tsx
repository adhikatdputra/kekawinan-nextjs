import Image from "next/image";
import { UndanganGaleri } from "@/frontend/interface/undangan";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";

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
      <Gallery>
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
              paddingBottom: "30px",
            } as React.CSSProperties
          }
        >
          {galeri.map((item) => (
            <SwiperSlide key={item.id}>
              <Item original={item.image} width={1000} height={1000}>
                {({ ref, open }) => (
                  <button ref={ref} onClick={open} className="w-full">
                    <Image
                      src={item.image}
                      alt="galeri"
                      width={1000}
                      height={1000}
                      className="w-full rounded-2xl transition-all duration-300"
                    />
                  </button>
                )}
              </Item>
            </SwiperSlide>
          ))}
        </Swiper>
      </Gallery>
    </div>
  );
}
