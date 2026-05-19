"use client";

import { Heart } from "lucide-react";

const items = [
  "Undangan Digital",
  "Gratis Selamanya",
  "30+ Tema Eksklusif",
  "Kirim via WhatsApp",
  "RSVP Online",
  "Musik Favorit",
  "Daftar Kado",
  "Love Story",
  "QR Absen Tamu",
  "Kolaborator",
];

function MarqueeRow({
  direction = "left",
  dark = false,
}: {
  direction?: "left" | "right";
  dark?: boolean;
}) {
  const repeated = [...items, ...items, ...items, ...items];
  const animClass =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className={`overflow-hidden py-3 ${dark ? "bg-green-kwn" : "bg-white/80"}`}>
      <div className={`flex whitespace-nowrap ${animClass}`}>
        {repeated.map((item, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-2 mx-5 text-xs font-semibold uppercase tracking-widest ${
              dark ? "text-white" : "text-green-kwn"
            }`}
          >
            <Heart className="w-2.5 h-2.5 fill-current opacity-60 flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MarqueeRibbon() {
  return (
    <div className="relative bg-green-soft-kwn">
      {/* Clip-path diagonal container — cuts top-left to bottom-right */}
      <div
        className="relative overflow-hidden"
        style={{
          clipPath: "polygon(0 18%, 100% 0%, 100% 82%, 0% 100%)",
          paddingTop: "2.5rem",
          paddingBottom: "2.5rem",
          marginTop: "-0.5rem",
          marginBottom: "-0.5rem",
          backgroundColor: "transparent",
        }}
      >
        <div className="flex flex-col gap-0.5">
          <MarqueeRow direction="left" dark />
          <MarqueeRow direction="right" />
        </div>
      </div>
    </div>
  );
}
