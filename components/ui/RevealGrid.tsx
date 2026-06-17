"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * SSR guard — returns false on the server and true after hydration.
 * Prevents the "flash of hidden content" where SSR renders visible HTML
 * but the Framer Motion initial state (opacity:0) briefly shows before animating.
 */
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}

// ── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      // 80ms between each card — fast enough to feel live, slow enough to read
      staggerChildren: 0.08,
    },
  },
};

// Explicit tuple type so TypeScript accepts the bezier values
const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const cardVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: EASE,
    },
  },
};

// ── RevealGrid ───────────────────────────────────────────────────────────────

interface GridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * RevealGrid — stagger container.
 * Applies the grid CSS via `className`. Wrap each card in <RevealCard>.
 *
 * Scroll trigger fires when the grid is 80px inside the viewport from the
 * bottom — cards are clearly visible before animation begins.
 */
export function RevealGrid({ children, className }: GridProps) {
  const isClient = useIsClient();

  // Before hydration: render children without any motion wrapper so there is
  // no flash of invisible content caused by framer-motion's initial state.
  if (!isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        // Negative bottom margin — animation fires only when the grid is
        // at least 80px inside the visible viewport from the bottom.
        // Cards are already in clear sight before the animation begins.
        margin: "0px 0px -80px 0px",
      }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

// ── RevealCard ───────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * RevealCard — individual card wrapper.
 * Must be a direct child of <RevealGrid>.
 * Slides in from the left with a smooth ease-out curve.
 */
export function RevealCard({ children, className }: CardProps) {
  return (
    <motion.div
      className={className}
      variants={cardVariants}
      // Ensure the card stays in its natural position in the layout
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
