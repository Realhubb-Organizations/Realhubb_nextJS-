"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/types/seo";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={cn(
              "bg-white rounded-2xl border transition-all duration-350 overflow-hidden",
              isOpen
                ? "border-gold/30 shadow-lg shadow-gold/5 bg-gradient-to-b from-white to-gold/[0.01]"
                : "border-gray-150 hover:border-gold/20 hover:shadow-md"
            )}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              suppressHydrationWarning
              className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none group"
            >
              <span className="text-navy font-heading text-[15px] sm:text-base font-normal pr-4 group-hover:text-gold transition-colors duration-200">
                {item.question}
              </span>
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  isOpen ? "bg-gold/15 text-gold" : "bg-gray-50 text-gray-400 group-hover:bg-gold/5 group-hover:text-gold"
                )}
              >
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-300",
                    isOpen ? "rotate-180" : "rotate-0"
                  )}
                />
              </div>
            </button>
            
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="px-6 pb-6 pt-1 text-gray-500 text-sm sm:text-base leading-relaxed font-light border-t border-gray-50/50">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
