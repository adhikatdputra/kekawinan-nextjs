import React, { useState, useEffect } from "react";
import { formatDateId } from "@/helper/date";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: string;
  bgColor?: string;
  textColor?: string;
  textHeadingColor?: string;
}

export default function CountdownTimer({
  targetDate: targetDateString,
  bgColor = "#000000",
  textColor = "#FFFFFF",
  textHeadingColor = "#000000",
}: CountdownTimerProps) {
  const targetDate = new Date(targetDateString);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const target = targetDate.getTime();
    const difference = target - now;

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
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Check if countdown is finished
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

    // Initial calculation
    const initialTimeLeft = calculateTimeLeft();
    setTimeLeft(initialTimeLeft);

    return () => clearInterval(timer);
  }, []);

  if (isExpired) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-4xl mb-4">🎉🎉🎉</div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            Happy Wedding Day!
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Selamat menempuh hidup baru, semoga bahagia selalu selamanya!
          </p>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <span className="text-sm">
              {formatDateId(targetDate.toISOString())}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-6 text-center">
        <h1
          className="text-4xl font-medium mb-1 font-glitten"
          style={{ color: textHeadingColor }}
        >
          Save the Date
        </h1>
        <p className="text-base font-glitten" style={{ color: textHeadingColor }}>
          {formatDateId(targetDate.toISOString())}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 w-full">
        {/* Days */}
        <BoxTime
          timeLeft={timeLeft.days}
          title="Hari"
          bgColor={bgColor}
          textColor={textColor}
        />

        {/* Hours */}
        <BoxTime
          timeLeft={timeLeft.hours}
          title="Jam"
          bgColor={bgColor}
          textColor={textColor}
        />

        {/* Minutes */}
        <BoxTime
          timeLeft={timeLeft.minutes}
          title="Menit"
          bgColor={bgColor}
          textColor={textColor}
        />

        {/* Seconds */}
        <BoxTime
          timeLeft={timeLeft.seconds}
          title="Detik"
          bgColor={bgColor}
          textColor={textColor}
        />
      </div>
    </div>
  );
}

export const BoxTime = ({
  timeLeft,
  title,
  bgColor,
  textColor,
}: {
  timeLeft: number;
  title: string;
  bgColor: string;
  textColor: string;
}) => {
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };
  return (
    <div
      className="rounded-2xl p-2 text-center flex flex-col justify-center items-center aspect-square"
      style={{
        boxShadow: `4px 3pt 0pt ${textColor}`,
        backgroundColor: bgColor,
      }}
    >
      <div className="text-3xl font-bold" style={{ color: textColor }}>
        {formatNumber(timeLeft)}
      </div>
      <div
        className="text-xs font-medium tracking-wider"
        style={{ color: textColor }}
      >
        {title}
      </div>
    </div>
  );
};
