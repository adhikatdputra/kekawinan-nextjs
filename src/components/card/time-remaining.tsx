import React, { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: string;
}

export default function TimeRemaining({
  targetDate: targetDateString,
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

  if (!isExpired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Time&apos;s Up!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            The countdown has reached zero. Whatever you were waiting for should
            be happening now!
          </p>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <strong>Event Time Reached!</strong>
            <br />
            <span className="text-sm">
              Target: {targetDate.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-md text-center">
      <p className="text-gray-600 text-sm">
        <strong>Time Remaining:</strong>
        <br />
        {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes}{" "}
        minutes, {timeLeft.seconds} seconds
      </p>
    </div>
  );
}
