"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { X, Send } from "lucide-react";
import { trackWhatsApp, trackLead, trackAction } from "@/lib/ga";
import { submitLead } from "@/lib/leads";
import { company } from "@/data/company";
import { generalFaq } from "@/data/faqData";
import { cn } from "@/lib/utils";

const WHATSAPP_MESSAGE = "Hi, I found your website and I'm interested in properties.";
const MAX_QUESTIONS = 3;

interface ChatLink {
  title: string;
  url?: string;
}

type ChatMessage = { role: "bot" | "user"; text: string; links?: ChatLink[] };

const INITIAL_MESSAGE: ChatMessage = {
  role: "bot",
  text: "Hi! I'm the RealHubb assistant. Ask me anything about our properties, or tap a question below 👇",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  // Tracks total questions asked this session (typed or tapped) — drives the
  // 3-question cap. Separate from tappedSuggestions, which is UI-only (which
  // suggestion buttons to hide after they've been used).
  const [queryCount, setQueryCount] = useState(0);
  const [tappedSuggestions, setTappedSuggestions] = useState<number[]>([]);
  const [input, setInput] = useState("");
  const [asking, setAsking] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMount = () => setMounted(true);
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(handleMount, { timeout: 3000 });
      } else {
        setTimeout(handleMount, 3000);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showLeadForm, mounted]);

  const handleSend = async (question: string, suggestionIndex?: number) => {
    const q = question.trim();
    if (!q || asking || queryCount >= MAX_QUESTIONS) return;

    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    if (suggestionIndex !== undefined) {
      setTappedSuggestions((prev) => [...prev, suggestionIndex]);
    }
    setAsking(true);

    const nextCount = queryCount + 1;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json();
      const botMessage: ChatMessage = {
        role: "bot",
        text: data.reply ?? "Sorry, something went wrong. Please try again.",
        links: data.link ? [{ title: "Learn more", url: data.link }] : data.links,
      };

      setMessages((prev) => {
        const next = [...prev, botMessage];
        if (nextCount >= MAX_QUESTIONS) {
          next.push({
            role: "bot",
            text: "Looks like you've got a few more questions! Share your number below and our advisor will personally reach out to help.",
          });
        }
        return next;
      });

      trackAction("chat_question_asked", "engagement", data.source);
      if (nextCount >= MAX_QUESTIONS) {
        setShowLeadForm(true);
        trackAction("chat_lead_form_shown", "engagement");
      }
    } catch (err) {
      console.error("Error asking chatbot:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, I couldn't reach our system just now. Please try again in a moment." },
      ]);
    } finally {
      setQueryCount(nextCount);
      setAsking(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSubmitting(true);
    try {
      const res = await submitLead({
        name,
        phone,
        type: "chatbot",
      });

      if (res.success) {
        setSubmitted(true);
        trackLead("chatbot", phone);
      } else {
        console.error("Submission failed");
      }
    } catch (err) {
      console.error("Error submitting chatbot lead:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const suggestions = generalFaq
    .map((faq, index) => ({ ...faq, index }))
    .filter((faq) => !tappedSuggestions.includes(faq.index))
    .slice(0, 4);

  const canAskMore = queryCount < MAX_QUESTIONS && !showLeadForm;

  if (!mounted) return null;

  return (
    <>
      {open && (
        // Independently fixed, anchored above the launcher button — keeping
        // both in one flex stack made their combined height exceed the
        // viewport, pushing the panel's top off-screen and cramming the
        // button against it.
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] max-h-[min(70dvh,600px)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-navy px-5 py-4 flex items-center justify-between shrink-0">
            <div>
              <p className="text-white font-normal text-sm">RealHubb Assistant</p>
              <p className="text-white/50 text-xs mt-0.5">Ask a question to get started</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsApp("chatbot")}
                aria-label="Chat on WhatsApp"
              >
                <Image src="/whatsapp.png" alt="WhatsApp icon" width={20} height={20} unoptimized className="w-5 h-5" />
              </a>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex flex-col", msg.role === "user" ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                    msg.role === "user" ? "bg-gold text-navy rounded-br-sm" : "bg-cream text-navy rounded-bl-sm"
                  )}
                >
                  {msg.text}
                </div>
                {msg.links && msg.links.length > 0 && (
                  <div className="max-w-[85%] mt-1 flex flex-wrap gap-1.5">
                    {msg.links.filter((l) => l.url).map((l, li) => (
                      <a
                        key={li}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-gold underline underline-offset-2 hover:text-gold/80"
                      >
                        {l.title} →
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {asking && (
              <div className="flex justify-start">
                <div className="bg-cream text-navy rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-navy/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-navy/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-navy/40 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            {showLeadForm && (
              submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                  <p className="text-green-700 text-sm font-normal mb-1">Thanks, {name.split(" ")[0]}!</p>
                  <p className="text-green-600 text-xs">Our advisor will call you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="bg-cream rounded-2xl p-3 space-y-2">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold text-navy placeholder-gray-400"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold text-navy placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-navy text-white py-2.5 rounded-lg text-sm hover:bg-navy/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting ? "Sending…" : <>Talk to our team <Send className="w-3.5 h-3.5" /></>}
                  </button>
                </form>
              )
            )}
            <div ref={endRef} />
          </div>

          {/* Suggested questions */}
          {canAskMore && suggestions.length > 0 && (
            <div className="border-t border-gray-100 p-3 space-y-1.5 shrink-0 max-h-32 overflow-y-auto">
              {suggestions.map((faq) => (
                <button
                  key={faq.index}
                  onClick={() => handleSend(faq.question, faq.index)}
                  disabled={asking}
                  className="w-full text-left text-xs text-navy bg-cream hover:bg-gold/10 rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
                >
                  <span className="block line-clamp-1">
                    {faq.question}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Free-text input */}
          {canAskMore && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="border-t border-gray-100 p-3 shrink-0 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question…"
                disabled={asking}
                className="flex-1 min-w-0 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-gold text-navy placeholder-gray-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={asking || !input.trim()}
                aria-label="Send question"
                className="shrink-0 w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center hover:bg-gold/90 transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}

      <button
        onClick={() => {
          setOpen(!open);
          if (!open) trackAction("chat_widget_open", "engagement");
        }}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center transition-all duration-200 hover:scale-110",
          open
            ? "w-14 h-14 rounded-full bg-gold shadow-lg hover:bg-gold/90"
            : "w-20 h-20 drop-shadow-lg"
        )}
      >
        {open ? (
          <X className="w-6 h-6 text-navy" />
        ) : (
          <DotLottieReact
            // Self-hosted, recolored copy of the source animation — the
            // original's sky-blue circle was baked into the artwork itself
            // (not CSS), so it's swapped for the site gold directly in the
            // JSON. Also avoids a network round-trip to lottie.host.
            src="/lottie/chatbot-gold.json"
            loop
            autoplay
            renderConfig={{ devicePixelRatio: 3 }}
            style={{ width: 80, height: 80 }}
          />
        )}
      </button>
    </>
  );
}
