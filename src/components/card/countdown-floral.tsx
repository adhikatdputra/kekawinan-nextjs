"use client";

import React, { useState, useEffect } from "react";
import { formatDateId } from "@/helper/date";
import { motion } from "motion/react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownFloral({
  targetDate: targetDateString,
}: {
  targetDate: string;
}) {
  const targetDate = new Date(targetDateString);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  const calculateTimeLeft = (): TimeLeft => {
    const difference = targetDate.getTime() - new Date().getTime();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        setIsExpired(true);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeUnits = [
    { value: timeLeft.days, label: "Hari" },
    { value: timeLeft.hours, label: "Jam" },
    { value: timeLeft.minutes, label: "Menit" },
    { value: timeLeft.seconds, label: "Detik" },
  ];

  if (isExpired) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p
          className="font-glitten text-3xl text-center"
          style={{ color: "#B8975A" }}
        >
          Happy Wedding Day!
        </p>
        <p className="text-sm mt-2 text-white/60">
          {formatDateId(targetDate.toISOString())}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Heading with side flower decorations */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
        viewport={{ once: false }}
        className="relative w-full flex items-center justify-center mb-8"
      >
        <img
          src="/images/assets/flower-decor-left.png"
          alt=""
          className="absolute left-0 w-20 opacity-50 pointer-events-none"
        />
        <img
          src="/images/assets/flower-decor-right.png"
          alt=""
          className="absolute right-0 w-20 opacity-50 pointer-events-none"
        />
        <div className="text-center">
          <p
            className="text-xs tracking-[0.3em] mb-2"
            style={{ color: "#B8975A99" }}
          >
            MENUJU HARI BAHAGIA
          </p>
          <h2
            className="font-glitten text-4xl"
            style={{ color: "#B8975A" }}
          >
            Save the Date
          </h2>
          <p className="text-sm mt-1" style={{ color: "#B8975A99" }}>
            {formatDateId(targetDate.toISOString())}
          </p>
        </div>
      </motion.div>

      {/* Countdown boxes */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.4 }}
        viewport={{ once: false }}
        className="grid grid-cols-4 gap-3 w-full"
      >
        {timeUnits.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center">
            <div
              className="relative rounded-2xl w-full aspect-square flex flex-col items-center justify-center"
              style={{
                backgroundColor: "#1E2B1C",
                border: "1px solid #B8975A50",
              }}
            >
              {/* Gold corner accents */}
              <span
                className="absolute top-1 left-2 text-[10px] leading-none"
                style={{ color: "#B8975A40" }}
              >
                ✦
              </span>
              <span
                className="absolute bottom-1 right-2 text-[10px] leading-none"
                style={{ color: "#B8975A40" }}
              >
                ✦
              </span>
              <span
                className="text-2xl font-bold tabular-nums"
                style={{ color: "#B8975A" }}
              >
                {value.toString().padStart(2, "0")}
              </span>
              <span
                className="text-[10px] mt-1 tracking-wider"
                style={{ color: "#B8975A80" }}
              >
                {label}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
