"use client";

import { LoveStory } from "@/frontend/interface/undangan";
import { motion } from "motion/react";
import { IconMapPin, IconClock } from "@tabler/icons-react";

interface LoveStoryTimelineProps {
  loveStories: LoveStory[];
  /** URL gambar background (gunakan imgBg dari cover undangan) */
  bgImage?: string;
  /** Warna aksen: garis timeline, dot, border card — misal "bg-theme9-primary" */
  accentColor?: string;
  /** Warna teks heading section */
  headingColor?: string;
  /** Warna teks story / waktu / lokasi */
  textColor?: string;
  /** Warna teks heading section — misal "Love Story" */
  sectionTitle?: string;
}

export default function LoveStoryTimeline({
  loveStories,
  bgImage,
  accentColor = "bg-gray-800",
  headingColor = "text-white",
  textColor = "text-white",
  sectionTitle = "Love Story",
}: LoveStoryTimelineProps) {
  if (!loveStories || loveStories.length === 0) return null;

  return (
    <div className="relative py-16 overflow-hidden">
      {/* Background layer */}
      {bgImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        </>
      )}
      {!bgImage && <div className="absolute inset-0 bg-black/80" />}

      {/* Content */}
      <div className="relative z-10 px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: false }}
          className="text-center mb-12"
        >
          <h2 className={`text-3xl font-recoleta-alt font-medium ${headingColor}`}>
            {sectionTitle}
          </h2>
          <div className={`w-12 h-0.5 mx-auto mt-3 ${accentColor}`} />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${accentColor} opacity-60`} />

          <div className="flex flex-col gap-10">
            {loveStories.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut", delay: index * 0.1 }}
                viewport={{ once: false }}
                className="relative pl-12"
              >
                {/* Dot */}
                <div
                  className={`absolute left-[11px] top-3 w-3 h-3 rounded-full ${accentColor} ring-2 ring-white/30`}
                />

                {/* Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20">
                  {/* Image */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.waktu ?? `Momen ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-4 flex flex-col gap-2">
                    {/* Waktu & Lokasi */}
                    {(item.waktu || item.lokasi) && (
                      <div className="flex flex-wrap gap-3">
                        {item.waktu && (
                          <span className={`flex items-center gap-1 text-xs font-medium ${textColor} opacity-80`}>
                            <IconClock size={13} />
                            {item.waktu}
                          </span>
                        )}
                        {item.lokasi && (
                          <span className={`flex items-center gap-1 text-xs font-medium ${textColor} opacity-80`}>
                            <IconMapPin size={13} />
                            {item.lokasi}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Story */}
                    <p className={`text-sm leading-relaxed ${textColor}`}>
                      {item.story}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
