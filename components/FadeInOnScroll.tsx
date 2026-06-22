"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

export function FadeInOnScroll({
  children,
  delay = 0,
  duration = 0.6,
  direction = "up",
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -50px 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const offset = direction === "none" ? "0px" : "40px";
  const axis =
    direction === "left" || direction === "right" ? "translateX" : "translateY";
  const sign = direction === "down" || direction === "right" ? "" : "-";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : `${axis}(${sign}${offset})`,
        transition: `opacity ${duration}s ease ${delay / 1000}s, transform ${duration}s cubic-bezier(0.25,0.46,0.45,0.94) ${delay / 1000}s`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
