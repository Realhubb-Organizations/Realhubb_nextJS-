import { NextResponse } from "next/server";
import { getKnowledgeBase, searchKnowledgeBase, type ScoredDoc, STOPWORDS, tokenize } from "@/lib/chatbot/knowledgeBase";
import { askGemini } from "@/lib/chatbot/gemini";

// Confident enough to answer straight from an FAQ, no LLM call needed —
// this is the common case and costs nothing.
const LOCAL_ANSWER_THRESHOLD = 0.72;
// Below this, we don't consider a doc relevant enough to hand to the LLM as context.
const CONTEXT_THRESHOLD = 0.25;

const FALLBACK_MESSAGE =
  "I don't have a specific answer for that right now. Would you like to share your number below so a RealHubb advisor can help you directly?";

// Simple in-memory sliding-window rate limit — fine for a single persistent
// Node process (this app isn't deployed serverless); resets on restart.
const RATE_LIMIT = 20; // requests
const RATE_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes per IP
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT;
}

function buildPrompt(question: string, matches: ScoredDoc[]): string {
  const context = matches
    .map((m, i) => `[${i + 1}] ${m.doc.title}: ${m.doc.text}`)
    .join("\n");

  return `You are the RealHubb Assistant, a helpful chatbot for RealHubb Ventures, a real estate channel partner in Bangalore, Hyderabad, and Chennai (RERA-compliant, zero brokerage).

Answer the user's question in 2-4 short sentences using ONLY the CONTEXT below. Do not invent specific prices, RERA numbers, possession dates, or property facts that aren't in the context. If the context doesn't fully cover the question, answer what you can and suggest the user contact a RealHubb advisor for the rest. Do not mention "the context" — just answer naturally and conversationally.

CONTEXT:
${context || "(no specific RealHubb data matched this question — answer briefly from general real estate knowledge if you can, and suggest contacting an advisor for anything specific to RealHubb's listings.)"}

QUESTION: ${question}`;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { reply: "You've sent a lot of messages — please try again in a few minutes.", source: "rate-limited" },
        { status: 429 }
      );
    }

    const { message } = await request.json();
    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }
    const question = message.trim().slice(0, 500); // guard against absurdly long input
    const cleanQuery = question.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "");

    // Quick local greeting/thanks detection (saves API calls and handles basic conversations)
    const GREETINGS = ["hi", "hello", "hey", "hii", "hola", "hi there", "greetings", "good morning", "good afternoon", "good evening"];
    const THANKS = ["thanks", "thank you", "ok", "okay", "cool", "thankyou", "thx", "awesome", "perfect"];

    if (GREETINGS.includes(cleanQuery)) {
      return NextResponse.json({
        reply: "Hi! I'm the RealHubb assistant. Ask me anything about our properties, or tap a question below 👇",
        source: "local-greeting"
      });
    }

    if (THANKS.includes(cleanQuery)) {
      return NextResponse.json({
        reply: "You're welcome! Let me know if you need any other information about our properties.",
        source: "local-thanks"
      });
    }

    const docs = await getKnowledgeBase();
    const matches = searchKnowledgeBase(question, docs, 5);
    const top = matches[0];

    // Confident FAQ match — answer directly, no LLM call, zero cost.
    if (top && top.doc.type === "faq" && top.score >= LOCAL_ANSWER_THRESHOLD) {
      return NextResponse.json({
        reply: top.doc.answer,
        source: "local",
        link: top.doc.url,
      });
    }

    const relevant = matches.filter((m) => m.score >= CONTEXT_THRESHOLD);
    const aiReply = await askGemini(buildPrompt(question, relevant));

    if (aiReply) {
      return NextResponse.json({
        reply: aiReply,
        source: "ai",
        links: relevant.slice(0, 3).map((m) => ({ title: m.doc.title, url: m.doc.url })).filter((l) => l.url),
      });
    }

    // --- Smart Fallback when AI is unavailable/depleted ---

    // 1. If we have relevant documents locally, show them as direct suggestions first
    if (relevant.length > 0) {
      const links = relevant.slice(0, 3).map((m) => ({ title: m.doc.title, url: m.doc.url })).filter((l) => l.url);
      const docTitles = relevant.slice(0, 3).map((m) => m.doc.title).join(", ");
      
      return NextResponse.json({
        reply: `I couldn't reach my AI service, but I found some relevant information on our website regarding: ${docTitles}. Would you like to share your number below so a RealHubb advisor can help you directly?`,
        source: "fallback-relevant",
        links: links.length > 0 ? links : undefined
      });
    }

    // 2. Otherwise, check for missing unique keywords that are not present anywhere in our database
    const queryTokens = tokenize(question);
    
    // Build set of all words in our database
    const allDbWords = new Set<string>();
    docs.forEach((doc) => {
      tokenize(doc.title).forEach((w) => allDbWords.add(w));
      tokenize(doc.text).forEach((w) => allDbWords.add(w));
    });

    const GENERIC_WORDS = new Set([
      "project", "projects", "flat", "flats", "apartment", "apartments", "house", "villa", 
      "villas", "property", "properties", "buy", "sell", "rent", "price", "builder", "builders", 
      "developer", "developers", "location", "locations", "locality", "localities", "brokerage",
      "rera", "approved", "charges", "hidden", "stamp", "duty", "registration"
    ]);

    const missingTerms = queryTokens.filter((token) => !allDbWords.has(token) && !GENERIC_WORDS.has(token));

    if (missingTerms.length > 0) {
      const termDisplay = missingTerms.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ");
      return NextResponse.json({
        reply: `I don't have information about "${termDisplay}" on our website right now. Would you like to share your number below so a RealHubb advisor can help you directly?`,
        source: "fallback-unknown-term"
      });
    }

    // Default fallback
    return NextResponse.json({ reply: FALLBACK_MESSAGE, source: "fallback" });
  } catch (err) {
    console.error("[chat API] Unhandled error:", err);
    return NextResponse.json({ reply: FALLBACK_MESSAGE, source: "fallback" }, { status: 200 });
  }
}
