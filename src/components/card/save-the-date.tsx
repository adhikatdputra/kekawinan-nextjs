"use client";

import { useEffect, useState } from "react";
import { formatDateId } from "@/helper/date";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface SaveTheDateProps {
  targetDate: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function SaveTheDate({
  targetDate: targetDateString,
  primaryColor = "text-theme10-primary",
  secondaryColor = "text-theme10-secondary",
}: SaveTheDateProps) {
  const targetDate = new Date(targetDateString);

  const calculate = (): TimeLeft => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };

  const [time, setTime] = useState<TimeLeft>(calculate);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      const next = calculate();
      setTime(next);
      if (
        next.days === 0 &&
        next.hours === 0 &&
        next.minutes === 0 &&
        next.seconds === 0
      ) {
        setIsExpired(true);
        clearInterval(t);
      }
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (isExpired) {
    return (
      <div className="text-center py-6">
        <p className={`text-xl font-recoleta-alt font-semibold ${secondaryColor}`}>
          🎉 Happy Wedding Day!
        </p>
        <p className="text-sm text-theme10-secondary/60 mt-1">
          Semoga bahagia selalu!
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl mx-4 shadow-sm overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-theme10-primary to-transparent" />

        <div className="px-6 py-8 flex flex-col items-center gap-6">
          {/* Heading */}
          <div className="text-center">
            <p className={`text-xs uppercase tracking-[0.25em] font-medium ${secondaryColor} opacity-60 mb-1`}>
              Menuju Hari Bahagia
            </p>
            <h2
              className={`text-4xl font-bold font-recoleta-alt ${secondaryColor} leading-tight`}
            >
              Save the Date
            </h2>
            <p className={`text-sm mt-1 font-medium ${primaryColor}`}>
              {formatDateId(targetDate.toISOString())}
            </p>
          </div>

          {/* Countdown units */}
          <div className="flex w-full items-end justify-center gap-0">
            <CountUnit value={pad(time.days)} label="Hari" primaryColor={primaryColor} secondaryColor={secondaryColor} />
            <Separator primaryColor={primaryColor} />
            <CountUnit value={pad(time.hours)} label="Jam" primaryColor={primaryColor} secondaryColor={secondaryColor} />
            <Separator primaryColor={primaryColor} />
            <CountUnit value={pad(time.minutes)} label="Menit" primaryColor={primaryColor} secondaryColor={secondaryColor} />
            <Separator primaryColor={primaryColor} />
            <CountUnit value={pad(time.seconds)} label="Detik" primaryColor={primaryColor} secondaryColor={secondaryColor} isLast />
          </div>
        </div>

        {/* Bottom accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-theme10-primary to-transparent" />
      </div>
    </div>
  );
}

function CountUnit({
  value,
  label,
  primaryColor,
  secondaryColor,
  isLast = false,
}: {
  value: string;
  label: string;
  primaryColor: string;
  secondaryColor: string;
  isLast?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center flex-1 ${isLast ? "" : ""}`}>
      <span
        className={`text-4xl font-bold font-recoleta-alt tabular-nums leading-none ${primaryColor}`}
      >
        {value}
      </span>
      <div className="w-8 h-px bg-theme10-primary/30 my-2" />
      <span className={`text-[10px] uppercase tracking-widest font-medium ${secondaryColor} opacity-60`}>
        {label}
      </span>
    </div>
  );
}

function Separator({ primaryColor }: { primaryColor: string }) {
  return (
    <span className={`text-2xl font-bold ${primaryColor} opacity-40 mb-5 px-0.5 leading-none`}>
      :
    </span>
  );
}
