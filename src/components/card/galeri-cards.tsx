"use client";

import { UndanganGaleri } from "@/frontend/interface/undangan";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination } from "swiper/modules";
import { Gallery, Item } from "react-photoswipe-gallery";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "photoswipe/dist/photoswipe.css";

export default function GaleriCards({
  galeri,
  accentColor = "#C0614A",
}: {
  galeri: UndanganGaleri[];
  accentColor?: string;
}) {
  if (!galeri || galeri.length === 0) return null;

  return (
    <div className="w-full flex justify-center">
      <Gallery>
        <Swiper
          effect="cards"
          grabCursor={true}
          modules={[EffectCards, Pagination]}
          pagination={{
            clickable: true,
          }}
          className="w-[72%] max-w-[320px]"
          style={
            {
              "--swiper-pagination-color": accentColor,
              "--swiper-pagination-bullet-size": "6px",
              "--swiper-pagination-bullet-inactive-color": accentColor,
              "--swiper-pagination-bullet-inactive-opacity": "0.3",
              paddingBottom: "36px",
            } as React.CSSProperties
          }
        >
          {galeri.map((item) => (
            <SwiperSlide
              key={item.id}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <Item original={item.image} width={1000} height={1000}>
                {({ ref, open }) => (
                  <button
                    ref={ref}
                    onClick={open}
                    className="w-full block"
                  >
                    <img
                      src={item.image}
                      alt="galeri"
                      className="w-full aspect-[3/4] object-cover"
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
