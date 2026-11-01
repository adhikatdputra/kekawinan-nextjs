"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y } from "swiper/modules";
import { IconArrowLeft, IconArrowRight, IconArrowsMaximize } from "@tabler/icons-react";
import type { UndanganGaleri } from "@/frontend/interface/undangan";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import "swiper/css";

type GaleriCarouselProps = {
  galeri: UndanganGaleri[];
  label?: string;
  className?: string;
  frameClassName?: string;
};

export default function GaleriCarousel({ galeri, label = "Kenangan pernikahan", className, frameClassName }: GaleriCarouselProps) {
  const swiper = useRef<SwiperInstance | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const thumbnails = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  if (!galeri.length) return null;
  const index = Math.min(active, galeri.length - 1);
  const move = (next: number) => {
    const target = (next + galeri.length) % galeri.length;
    swiper.current?.slideTo(target);
    setActive(target);
  };
  const arrow = "grid size-11 shrink-0 place-items-center rounded-full border border-current/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current disabled:opacity-30";

  return <section aria-label={label} aria-roledescription="carousel" className={cn("min-w-0", className)}
    onKeyDown={event => {
      if (event.key === "ArrowLeft") { event.preventDefault(); move(index - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); move(index + 1); }
    }}>
    <Swiper modules={[A11y]} slidesPerView={1} spaceBetween={16} speed={reduced ? 0 : 450}
      onSwiper={instance => { swiper.current = instance; }}
      onSlideChange={instance => {
        setActive(instance.activeIndex);
        const thumb = thumbnails.current[instance.activeIndex];
        if (thumb?.parentElement) thumb.parentElement.scrollTo({ left: thumb.offsetLeft - thumb.parentElement.offsetLeft - 16, behavior: reduced ? "instant" : "smooth" });
      }}
      a11y={{ slideLabelMessage: "Foto {{index}} dari {{slidesLength}}" }}>
      {galeri.map((photo, i) => <SwiperSlide key={photo.id}>
        <button type="button" tabIndex={i === index ? 0 : -1} aria-label={`Perbesar foto ${i + 1}: ${label}`}
          className={cn("relative block w-full border border-current/30 bg-black/10 p-2 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-current", frameClassName)}
          onClick={event => { trigger.current = event.currentTarget; setExpanded(true); }}>
          <Image src={photo.image} alt={`${label}, foto ${i + 1}`} width={700} height={900} sizes="(max-width: 450px) 85vw, 390px" loading="lazy" className="aspect-[3/4] w-full object-contain" />
          <span aria-hidden="true" className="absolute right-4 bottom-4 grid size-10 place-items-center rounded-full bg-black/60 text-white"><IconArrowsMaximize size={18} /></span>
        </button>
      </SwiperSlide>)}
    </Swiper>
    <div className="my-5 flex items-center justify-between gap-4">
      <button type="button" className={arrow} aria-label="Foto sebelumnya" disabled={galeri.length < 2} onClick={() => move(index - 1)}><IconArrowLeft size={20} /></button>
      <p aria-live="polite" aria-atomic="true" className="font-sans text-xs tabular-nums">{String(index + 1).padStart(2, "0")} <span className="mx-2 opacity-60">/</span> {String(galeri.length).padStart(2, "0")}</p>
      <button type="button" className={arrow} aria-label="Foto berikutnya" disabled={galeri.length < 2} onClick={() => move(index + 1)}><IconArrowRight size={20} /></button>
    </div>
    {galeri.length > 1 && <div className="relative flex gap-3 overflow-x-auto px-1 py-2" aria-label="Pilih foto">
      {galeri.map((photo, i) => <button key={photo.id} ref={element => { thumbnails.current[i] = element; }} type="button" aria-label={`Lihat foto ${i + 1}`} aria-current={i === index ? "true" : undefined}
        onClick={() => move(i)} className={cn("w-14 shrink-0 border-2 p-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current", i === index ? "border-current" : "border-transparent opacity-50 hover:opacity-100")}>
        <Image src={photo.image} alt="" width={80} height={100} sizes="56px" loading="lazy" className="aspect-[4/5] w-full object-cover" />
      </button>)}
    </div>}
    <Dialog open={expanded} onOpenChange={setExpanded}>
      <DialogContent className="max-h-[92svh] border-0 bg-brand-cream p-4 pt-12 text-brand-ink sm:max-w-4xl motion-reduce:animate-none"
        onCloseAutoFocus={event => { event.preventDefault(); const activeButton = swiper.current?.slides[index]?.querySelector<HTMLButtonElement>("button"); (activeButton ?? trigger.current)?.focus(); }}>
        <DialogTitle className="sr-only">{label}</DialogTitle>
        <DialogDescription className="sr-only">Foto ukuran penuh. Gunakan tombol panah untuk berpindah foto, Escape untuk menutup.</DialogDescription>
        <img src={galeri[index].image} alt={`${label}, foto ${index + 1}`} className="mx-auto max-h-[67svh] max-w-full object-contain" />
        <div className="flex items-center justify-between gap-4">
          <button type="button" className={arrow} aria-label="Foto sebelumnya" disabled={galeri.length < 2} onClick={() => move(index - 1)}><IconArrowLeft size={20} /></button>
          <p aria-live="polite" className="text-sm">{index + 1} / {galeri.length}</p>
          <button type="button" className={arrow} aria-label="Foto berikutnya" disabled={galeri.length < 2} onClick={() => move(index + 1)}><IconArrowRight size={20} /></button>
        </div>
      </DialogContent>
    </Dialog>
  </section>;
}
