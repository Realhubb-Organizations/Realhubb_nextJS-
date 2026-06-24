"use client";

import React, { useEffect, useState, useRef } from "react";

interface CountingNumberProps {
  fromNumber: number;
  number: number;
  decimalPlaces?: number;
  duration?: number; // duration in ms
  className?: string;
  inView?: boolean;
  skipAnimation?: boolean;
}

export default function CountingNumber({
  fromNumber = 0,
  number,
  decimalPlaces = 0,
  duration = 2000,
  className = "",
  inView = true,
  skipAnimation = false,
}: CountingNumberProps) {
  const [displayValue, setDisplayValue] = useState(skipAnimation ? number : fromNumber);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(skipAnimation);

  useEffect(() => {
    if (skipAnimation) {
      setDisplayValue(number);
      setHasAnimated(true);
      return;
    }

    if (!inView || hasAnimated) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out quadratic function
      const easeProgress = progress * (2 - progress);
      const currentValue = fromNumber + easeProgress * (number - fromNumber);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(number);
        setHasAnimated(true);
      }
    };

    window.requestAnimationFrame(step);
  }, [number, fromNumber, duration, inView, hasAnimated, skipAnimation]);

  const formatNumber = (val: number) => {
    return val.toLocaleString(undefined, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });
  };

  return (
    <span ref={elementRef} className={`${className} tabular-nums`}>
      {formatNumber(displayValue)}
    </span>
  );
}

