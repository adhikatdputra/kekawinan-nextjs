"use client";

import Image from "next/image";
import { UndanganGaleri } from "@/frontend/interface/undangan";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";

interface GaleriMasonryProps {
  galeri: UndanganGaleri[];
  /** Tailwind rounded class for each image tile */
  roundedClass?: string;
  /** Tailwind gap class between columns */
  gapClass?: string;
  /** Tailwind classes applied on hover overlay */
  overlayClass?: string;
}

export default function GaleriMasonry({
  galeri,
  roundedClass = "rounded-xl",
  gapClass = "gap-2",
  overlayClass = "bg-black/20",
}: GaleriMasonryProps) {
  if (!galeri || galeri.length === 0) return null;

  return (
    <Gallery>
      <div className={`columns-2 ${gapClass} px-4`}>
        {galeri.map((item, i) => (
          <Item
            key={item.id}
            original={item.image}
            width={1000}
            height={1000}
          >
            {({ ref, open }) => (
              <button
                ref={ref as unknown as React.RefObject<HTMLButtonElement>}
                onClick={open}
                className={`block w-full break-inside-avoid mb-2 overflow-hidden ${roundedClass} group relative`}
              >
                <Image
                  src={item.image}
                  alt={`galeri ${i + 1}`}
                  width={500}
                  height={500}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{
                    // Slight stagger: odd images are slightly taller for natural masonry feel
                    aspectRatio: i % 3 === 0 ? "4/5" : i % 3 === 1 ? "1/1" : "3/4",
                  }}
                />
                {/* Hover overlay */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${overlayClass}`}
                />
              </button>
            )}
          </Item>
        ))}
      </div>
    </Gallery>
  );
}
