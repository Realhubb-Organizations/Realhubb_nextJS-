"use client";

import { useEffect, useRef, useState } from "react";

interface GridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * RevealGrid — stagger container using CSS transitions + IntersectionObserver.
 * No framer-motion dependency.
 */
export function RevealGrid({ children, className }: GridProps) {
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
      { rootMargin: "0px 0px -80px 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-reveal-visible={visible ? "true" : "false"}>
      {children}
    </div>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

/**
 * RevealCard — individual card wrapper, slides in from left with stagger.
 */
export function RevealCard({ children, className, index = 0 }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Check if parent RevealGrid is already visible
    const parent = el.closest("[data-reveal-visible]");
    if (parent?.getAttribute("data-reveal-visible") === "true") {
      setTimeout(() => setVisible(true), index * 80);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 80);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateX(-40px)",
        transition: `opacity 0.6s cubic-bezier(0.25,0.46,0.45,0.94) ${index * 80}ms, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94) ${index * 80}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
