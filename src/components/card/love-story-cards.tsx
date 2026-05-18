"use client";

import { LoveStory } from "@/frontend/interface/undangan";
import { motion } from "motion/react";
import { IconMapPin, IconClock } from "@tabler/icons-react";

interface LoveStoryCardsProps {
  loveStories: LoveStory[];
  /** Tailwind text color for primary accent, e.g. "text-theme12-primary" */
  primaryColor?: string;
  /** Tailwind bg for accent dot/pill, e.g. "bg-theme12-primary" */
  accentBg?: string;
  /** Tailwind text color for body text */
  textColor?: string;
  /** Tailwind text color for muted/secondary text */
  mutedColor?: string;
  /** Tailwind classes for each card background */
  cardBg?: string;
  /** Section title */
  sectionTitle?: string;
  /** Tailwind classes for section wrapper background */
  sectionBg?: string;
}

export default function LoveStoryCards({
  loveStories,
  primaryColor = "text-theme12-primary",
  accentBg = "bg-theme12-primary",
  textColor = "text-white",
  mutedColor = "text-white/50",
  cardBg = "bg-white/8 backdrop-blur-md border border-white/10",
  sectionTitle = "Love Story",
  sectionBg = "",
}: LoveStoryCardsProps) {
  if (!loveStories || loveStories.length === 0) return null;

  return (
    <div className={`py-16 px-5 relative overflow-hidden ${sectionBg}`}>
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: false }}
        className="text-center mb-10"
      >
        <p className={`text-[10px] uppercase tracking-[0.25em] font-medium mb-2 ${mutedColor}`}>
          Our Journey
        </p>
        <h2 className={`text-3xl font-recoleta-alt font-semibold ${textColor}`}>
          {sectionTitle}
        </h2>
        <div className={`w-10 h-0.5 mx-auto mt-3 ${accentBg} opacity-80`} />
      </motion.div>

      {/* Story cards */}
      <div className="flex flex-col gap-4">
        {loveStories.map((story, i) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }}
            viewport={{ once: false }}
            className={`relative rounded-2xl p-5 overflow-hidden ${cardBg}`}
          >
            {/* Watermark rank number */}
            <span className="absolute right-3 bottom-2 text-[72px] font-black leading-none select-none pointer-events-none font-recoleta-alt"
              style={{ color: "rgba(255,255,255,0.04)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="flex gap-4 relative z-10">
              {/* Left: content */}
              <div className="flex-1 min-w-0">
                {/* Index badge + time */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${accentBg}`}
                    style={{ opacity: 0.9 }}
                  >
                    <span className="text-white text-[10px] font-bold leading-none">
                      {i + 1}
                    </span>
                  </div>
                  {story.waktu && (
                    <div className="flex items-center gap-1">
                      <IconClock size={10} className={mutedColor} />
                      <span className={`text-[10px] font-medium ${mutedColor}`}>
                        {story.waktu}
                      </span>
                    </div>
                  )}
                </div>

                {/* Story text */}
                <p className={`text-sm leading-relaxed ${textColor}`}>
                  {story.story}
                </p>

                {/* Location chip */}
                {story.lokasi && (
                  <div className="flex items-center gap-1.5 mt-3">
                    <IconMapPin size={11} className={primaryColor} />
                    <span className={`text-xs ${mutedColor}`}>{story.lokasi}</span>
                  </div>
                )}
              </div>

              {/* Right: photo */}
              {story.image && (
                <div className="shrink-0">
                  <img
                    src={story.image}
                    alt=""
                    className="w-[72px] h-[72px] rounded-xl object-cover border border-white/10"
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
