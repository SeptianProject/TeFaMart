import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const useCountdown = (endDate: Date | string): TimeLeft => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(endDate) - +new Date();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      };
    }

    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return timeLeft;
};

export const formatTimeLeft = (timeLeft: TimeLeft): string => {
  if (timeLeft.isExpired) {
    return "Lelang Berakhir";
  }

  if (timeLeft.days > 0) {
    return `${timeLeft.days}h ${timeLeft.hours}j`;
  }

  if (timeLeft.hours > 0) {
    return `${timeLeft.hours}j ${timeLeft.minutes}m`;
  }

  return `${timeLeft.minutes}m ${timeLeft.seconds}d`;
};
