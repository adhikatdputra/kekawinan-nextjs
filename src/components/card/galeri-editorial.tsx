"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { IconArrowLeft, IconArrowRight, IconArrowsMaximize } from "@tabler/icons-react";
import type { UndanganGaleri } from "@/frontend/interface/undangan";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface GaleriEditorialProps {
  galeri: UndanganGaleri[];
  className?: string;
  frameClassName?: string;
  label?: string;
}

/** One full-width photograph followed by paired portraits, with an accessible full-image viewer. */
export default function GaleriEditorial({ galeri, className, frameClassName, label = "Kenangan pernikahan" }: GaleriEditorialProps) {
  const [active, setActive] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  if (!galeri.length) return null;
  const selected = active === null ? null : galeri[active];
  const move = (direction: number) => setActive(index => index === null ? null : (index + direction + galeri.length) % galeri.length);

  return <>
    <div className={cn("grid grid-cols-2 gap-3", className)} aria-label={label}>
      {galeri.map((photo, index) => <button key={photo.id} type="button"
        aria-label={`Buka foto ${index + 1} dari ${galeri.length}: ${label}`}
        onClick={event => { triggerRef.current = event.currentTarget; setActive(index); }}
        className={cn("group relative block min-h-11 overflow-hidden border border-brand-line bg-brand-cream p-1.5 text-inherit focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current", index % 5 === 0 && "col-span-2", frameClassName)}>
        <Image src={photo.image} alt={`${label}, foto ${index + 1}`} width={700} height={850} loading="lazy"
          sizes={index % 5 === 0 ? "(max-width: 560px) 85vw, 420px" : "(max-width: 560px) 42vw, 210px"}
          className={cn("w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.025]", index % 5 === 0 ? "aspect-[4/3]" : "aspect-[3/4]")} />
        <span aria-hidden="true" className="absolute right-3 bottom-3 grid size-8 place-items-center rounded-full bg-black/55 text-white"><IconArrowsMaximize size={15} /></span>
      </button>)}
    </div>
    <p className="mt-4 text-center text-xs opacity-70">Sentuh foto untuk melihat lebih dekat.</p>
    <Dialog open={active !== null} onOpenChange={open => { if (!open) setActive(null); }}>
      <DialogContent className="max-h-[92svh] border-none bg-brand-cream p-4 pt-12 sm:max-w-4xl motion-reduce:animate-none"
        onCloseAutoFocus={event => { event.preventDefault(); triggerRef.current?.focus(); }}
        onKeyDown={event => {
          if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
          if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
        }}>
        <DialogTitle className="sr-only">{label}</DialogTitle>
        <DialogDescription className="sr-only">Foto ukuran penuh. Gunakan tombol panah untuk berganti foto dan Escape untuk menutup.</DialogDescription>
        {selected && <img src={selected.image} alt={`${label}, foto ${(active ?? 0) + 1}`} className="mx-auto max-h-[67svh] max-w-full object-contain" />}
        <div className="flex items-center justify-between gap-4 text-brand-ink">
          <button type="button" onClick={() => move(-1)} disabled={galeri.length < 2} aria-label="Foto sebelumnya" className="grid size-11 place-items-center rounded-full border border-brand-line focus-visible:outline-2 disabled:opacity-30"><IconArrowLeft size={20} /></button>
          <p aria-live="polite" className="text-sm tabular-nums">{(active ?? 0) + 1} / {galeri.length}</p>
          <button type="button" onClick={() => move(1)} disabled={galeri.length < 2} aria-label="Foto berikutnya" className="grid size-11 place-items-center rounded-full border border-brand-line focus-visible:outline-2 disabled:opacity-30"><IconArrowRight size={20} /></button>
        </div>
      </DialogContent>
    </Dialog>
  </>;
}
