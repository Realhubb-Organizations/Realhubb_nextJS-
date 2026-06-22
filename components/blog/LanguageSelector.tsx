"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe, Loader2 } from "lucide-react";

export const LANGUAGES = [
  { code: "original", label: "Original" },
  { code: "hi", label: "Hindi" },
  { code: "kn", label: "Kannada" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "ml", label: "Malayalam" },
  { code: "mr", label: "Marathi" },
  { code: "bn", label: "Bengali" },
  { code: "gu", label: "Gujarati" },
  { code: "pa", label: "Punjabi" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "ar", label: "Arabic" },
  { code: "zh", label: "Chinese" },
  { code: "ja", label: "Japanese" },
];

interface LanguageSelectorProps {
  currentLang: string;
  translating: boolean;
  onLanguageChange: (code: string, label: string) => void;
  dark?: boolean;
}

export default function LanguageSelector({
  currentLang,
  translating,
  onLanguageChange,
  dark = false,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentLabel = LANGUAGES.find((l) => l.code === currentLang)?.label ?? "Original";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={translating}
        className={`flex items-center gap-2 min-w-[130px] border rounded-full px-4 py-1.5 text-sm transition-all duration-200 disabled:opacity-60 shadow-sm ${
          dark
            ? "border-white/30 hover:border-white text-white bg-white/5 hover:bg-white/10"
            : "border-gold/30 hover:border-gold text-navy bg-white hover:bg-cream/40"
        }`}
      >
        {translating ? (
          <Loader2 className="h-4 w-4 animate-spin text-gold" />
        ) : (
          <Globe className="h-4 w-4 text-gold shrink-0" />
        )}
        <span className="flex-1 text-left font-light">{translating ? "Translating…" : currentLabel}</span>
        {!translating && (
          <ChevronDown
            className={`h-3 w-3 shrink-0 transition-transform duration-300 ${
              dark ? "text-white/60" : "text-navy/50"
            } ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 max-h-80 overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                onLanguageChange(lang.code, lang.label);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-cream transition-colors ${
                currentLang === lang.code ? "text-navy font-medium bg-gold/5" : "text-navy/70"
              }`}
            >
              {lang.label}
              {currentLang === lang.code && <Check className="h-3.5 w-3.5 text-gold" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
