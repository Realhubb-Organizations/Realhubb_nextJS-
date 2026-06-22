"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Languages } from "lucide-react";
import LanguageSelector, { LANGUAGES } from "./LanguageSelector";
import BlogMarkdown from "./BlogMarkdown";

interface TranslatedFields {
  title: string;
  excerpt: string;
  content: string;
}

interface TranslationContextValue {
  selectedLang: string;
  translating: boolean;
  original: TranslatedFields;
  shown: TranslatedFields;
  setOriginal: () => void;
  handleLangChange: (code: string, label: string) => void;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("Blog translation components must be used within BlogTranslationProvider");
  return ctx;
}

async function translateField(text: string, target: string): Promise<string> {
  if (!text) return text;
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, target }),
  });
  if (!res.ok) throw new Error("translate failed");
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.translated as string;
}

interface ProviderProps {
  post: TranslatedFields;
  children: ReactNode;
}

export function BlogTranslationProvider({ post, children }: ProviderProps) {
  const original: TranslatedFields = { title: post.title, excerpt: post.excerpt, content: post.content };
  const [selectedLang, setSelectedLang] = useState("original");
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(false);
  const cacheRef = useRef<Record<string, TranslatedFields>>({});

  const shown = selectedLang === "original" ? original : (cacheRef.current[selectedLang] ?? original);

  const setOriginal = useCallback(() => setSelectedLang("original"), []);

  const handleLangChange = useCallback(
    async (code: string, _label: string) => {
      if (code === "original") {
        setSelectedLang("original");
        return;
      }
      if (cacheRef.current[code]) {
        setSelectedLang(code);
        return;
      }

      setTranslating(true);
      setError(false);
      try {
        const [title, excerpt, content] = await Promise.all([
          translateField(original.title, code),
          translateField(original.excerpt, code),
          translateField(original.content, code),
        ]);
        cacheRef.current[code] = { title, excerpt, content };
        setSelectedLang(code);
      } catch {
        setError(true);
      } finally {
        setTranslating(false);
      }
    },
    [original.title, original.excerpt, original.content]
  );

  return (
    <TranslationContext.Provider value={{ selectedLang, translating, original, shown, setOriginal, handleLangChange }}>
      {error && (
        <div className="mb-4 text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
          Translation failed. Please try again.
        </div>
      )}
      {children}
    </TranslationContext.Provider>
  );
}

export function LanguageControl({ dark = false }: { dark?: boolean }) {
  const { selectedLang, translating, setOriginal, handleLangChange } = useTranslation();
  const currentLabel = LANGUAGES.find((l) => l.code === selectedLang)?.label ?? "Original";

  return (
    <div className="flex flex-col items-end gap-2">
      <LanguageSelector
        currentLang={selectedLang}
        translating={translating}
        onLanguageChange={handleLangChange}
        dark={dark}
      />
      {selectedLang !== "original" && !translating && (
        <div
          className={`flex items-center gap-2 text-xs rounded-xl px-3 py-1.5 ${
            dark ? "bg-white/10 text-white/70" : "bg-white border border-gray-100 text-gray-400"
          }`}
        >
          <Languages className="h-3.5 w-3.5 shrink-0 text-gold" />
          <span>
            Translated to <strong className={dark ? "text-white" : "text-navy"}>{currentLabel}</strong> by AI.{" "}
            <button type="button" onClick={setOriginal} className="underline hover:text-gold transition-colors">
              View original
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

export function TranslatedTitle({ className }: { className?: string }) {
  const { shown, original, translating, selectedLang } = useTranslation();
  return (
    <h1 key={selectedLang + "-title"} className={className}>
      {translating ? original.title : shown.title}
    </h1>
  );
}

export function TranslatedExcerpt({ className }: { className?: string }) {
  const { shown, original, translating, selectedLang } = useTranslation();
  return (
    <p key={selectedLang + "-excerpt"} className={className}>
      {translating ? original.excerpt : shown.excerpt}
    </p>
  );
}

export function TranslatedContent() {
  const { shown, translating, selectedLang } = useTranslation();

  if (translating) {
    return (
      <div className="space-y-3 animate-pulse">
        {[100, 90, 95, 85, 100, 80, 92].map((w, i) => (
          <div key={i} className="h-4 bg-gray-100 rounded" style={{ width: `${w}%` }} />
        ))}
        <div className="h-4 bg-gray-100 rounded w-1/2 mt-6" />
        {[100, 88, 94].map((w, i) => (
          <div key={`b-${i}`} className="h-4 bg-gray-100 rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
    );
  }

  return (
    <div key={selectedLang + "-content"} className="translated-content">
      <BlogMarkdown content={shown.content} />
    </div>
  );
}
