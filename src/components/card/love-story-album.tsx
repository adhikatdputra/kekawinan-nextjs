"use client";

import { motion, useReducedMotion } from "motion/react";
import { IconMapPin } from "@tabler/icons-react";
import type { LoveStory } from "@/frontend/interface/undangan";
import { cn } from "@/lib/utils";

interface LoveStoryAlbumProps {
  loveStories: LoveStory[];
  className?: string;
  frameClassName?: string;
  accentClassName?: string;
  textClassName?: string;
  tapeClassName?: string;
}

/** Album-style chapters; the caller owns the section heading and surrounding theme. */
export default function LoveStoryAlbum({
  loveStories,
  className,
  frameClassName,
  accentClassName,
  textClassName,
  tapeClassName,
}: LoveStoryAlbumProps) {
  const reduced = useReducedMotion();
  if (!loveStories.length) return null;

  return <ol className={cn("mx-auto grid max-w-2xl list-none gap-12 p-0 text-left", className)}>
    {loveStories.map((story, index) => {
      const alternate = index % 2 !== 0;
      const chapter = String(index + 1).padStart(2, "0");
      return <motion.li key={story.id}
        initial={reduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: .15 }}
        transition={{ duration: .7, ease: "easeOut" }}>
        <div className={cn("mb-5 flex items-center gap-3 text-brand-leaf", accentClassName)}>
          <span className="font-recoleta-alt text-3xl leading-none tabular-nums" aria-hidden="true">{chapter}</span>
          <span className="h-px flex-1 bg-current opacity-30" aria-hidden="true" />
          <span className="text-[10px] font-medium uppercase tracking-[.18em]">Bagian {chapter}</span>
        </div>

        {story.image && <figure className={cn("relative mb-7 w-[92%] border border-brand-line bg-brand-cream p-2 pb-5 shadow-sm", alternate ? "ml-auto motion-safe:rotate-1" : "mr-auto motion-safe:-rotate-1", frameClassName)}>
          <span aria-hidden="true" className={cn("pointer-events-none absolute -top-2 left-1/2 z-10 h-4 w-14 -translate-x-1/2 -rotate-3 bg-brand-yellow/50", tapeClassName)} />
          <img src={story.image} alt={story.waktu ? `Kenangan ${story.waktu}` : `Kenangan bagian ${index + 1}`} width={640} height={480} loading="lazy" className="aspect-[4/3] w-full object-cover" />
          {story.lokasi && <figcaption className={cn("mt-3 flex items-center justify-center gap-1.5 px-2 text-xs text-brand-muted [overflow-wrap:anywhere]", textClassName)}><IconMapPin size={13} className="shrink-0" aria-hidden="true" />{story.lokasi}</figcaption>}
        </figure>}

        <div className={cn("w-[94%]", alternate ? "mr-auto" : "ml-auto")}>
          <h3 className={cn("font-recoleta-alt text-2xl leading-tight font-normal text-brand-ink [overflow-wrap:anywhere]", accentClassName)}>{story.waktu || `Kenangan ${index + 1}`}</h3>
          {!story.image && story.lokasi && <p className={cn("mt-3 flex items-center gap-1.5 text-xs text-brand-muted [overflow-wrap:anywhere]", textClassName)}><IconMapPin size={13} className="shrink-0" aria-hidden="true" />{story.lokasi}</p>}
          <p className={cn("mt-4 text-sm leading-7 whitespace-pre-line text-brand-muted [overflow-wrap:anywhere]", textClassName)}>{story.story}</p>
        </div>
      </motion.li>;
    })}
  </ol>;
}
