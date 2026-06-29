"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Bot, X, Send } from "lucide-react";
import { trackWhatsApp, trackLead } from "@/lib/ga";
import { submitLead } from "@/lib/leads";
import { company } from "@/data/company";
import { generalFaq } from "@/data/faqData";
import { cn } from "@/lib/utils";

const WHATSAPP_MESSAGE = "Hi, I found your website and I'm interested in properties.";
const MAX_QUESTIONS = 3;

type ChatMessage = { role: "bot" | "user"; text: string };

const INITIAL_MESSAGE: ChatMessage = {
  role: "bot",
  text: "Hi! I'm the RealHubb assistant. Tap a question below and I'll help you out 👇",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [askedQuestions, setAskedQuestions] = useState<number[]>([]);
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

  const handleAsk = (index: number) => {
    const faq = generalFaq[index];
    const updatedAsked = [...askedQuestions, index];
    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: "user", text: faq.question },
      { role: "bot", text: faq.answer },
    ];

    if (updatedAsked.length >= MAX_QUESTIONS) {
      updatedMessages.push({
        role: "bot",
        text: "Looks like you've got a few more questions! Share your number below and our advisor will personally reach out to help.",
      });
      setShowLeadForm(true);
    }

    setMessages(updatedMessages);
    setAskedQuestions(updatedAsked);
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
        trackLead("chatbot");
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
    .filter((faq) => !askedQuestions.includes(faq.index))
    .slice(0, 4);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 max-w-[calc(100vw-3rem)] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
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
                onClick={trackWhatsApp}
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
              <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                    msg.role === "user" ? "bg-gold text-navy rounded-br-sm" : "bg-cream text-navy rounded-bl-sm"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}

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
          {!showLeadForm && suggestions.length > 0 && (
            <div className="border-t border-gray-100 p-3 space-y-1.5 shrink-0 max-h-44 overflow-y-auto">
              {suggestions.map((faq) => (
                <button
                  key={faq.index}
                  onClick={() => handleAsk(faq.index)}
                  className="w-full text-left text-xs text-navy bg-cream hover:bg-gold/10 rounded-lg px-3 py-2 transition-colors line-clamp-1"
                >
                  {faq.question}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        className="w-14 h-14 rounded-full bg-gold shadow-lg hover:bg-gold/90 hover:scale-110 transition-all duration-200 flex items-center justify-center"
      >
        {open ? <X className="w-6 h-6 text-navy" /> : <Bot className="w-7 h-7 text-navy" />}
      </button>
    </div>
  );
}
