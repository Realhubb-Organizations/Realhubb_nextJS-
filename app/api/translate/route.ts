import { type NextRequest, NextResponse } from "next/server";

// Google's free translate_a/single endpoint accepts the text via a `q` query
// param, so very long blog content has to be chunked before being sent upstream.
const CHUNK_SIZE = 1800;
const CONCURRENCY = 6;

async function translateChunk(text: string, target: string): Promise<string> {
  if (!text.trim()) return text;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Upstream translate failed: ${res.status}`);
  const data = (await res.json()) as [[string, unknown][]];
  return (data[0] ?? []).map(([t]) => t).join("");
}

function splitIntoChunks(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];

  const chunks: string[] = [];
  let rest = text;
  while (rest.length > maxLen) {
    let cut = rest.lastIndexOf("\n", maxLen);
    if (cut < maxLen * 0.5) cut = rest.lastIndexOf(" ", maxLen);
    if (cut < maxLen * 0.5) cut = maxLen;
    chunks.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (rest) chunks.push(rest);
  return chunks;
}

async function translatePlainText(text: string, target: string): Promise<string> {
  const chunks = splitIntoChunks(text, CHUNK_SIZE);
  const translated = await Promise.all(chunks.map((chunk) => translateChunk(chunk, target)));
  return translated.join("");
}

async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

const TAG_SPLIT_RE = /(<[^>]+>)/g;
const IS_TAG_RE = /^<[^>]+>$/;
const HAS_LETTERS_RE = /\p{L}/u;

// Splits HTML into alternating tag / text segments so only the visible text
// between tags gets sent to the translator — tag names, attributes (e.g.
// inline `style`) and entities must survive untouched or markup breaks.
async function translateHtml(html: string, target: string): Promise<string> {
  const segments = html.split(TAG_SPLIT_RE).filter((s) => s.length > 0);

  const parts = await mapWithConcurrency(segments, CONCURRENCY, async (segment) => {
    if (IS_TAG_RE.test(segment) || !HAS_LETTERS_RE.test(segment)) return segment;
    try {
      return await translatePlainText(segment, target);
    } catch {
      return segment;
    }
  });
  return parts.join("");
}

const LOOKS_LIKE_HTML_RE = /<[a-z][\s\S]*>/i;

async function translateAny(text: string, target: string): Promise<string> {
  return LOOKS_LIKE_HTML_RE.test(text) ? translateHtml(text, target) : translatePlainText(text, target);
}

export async function POST(request: NextRequest) {
  let body: { text?: string; target?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { text, target = "en" } = body;
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

  try {
    const translated = await translateAny(text, target);
    return NextResponse.json({ translated });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text");
  const target = searchParams.get("target") ?? "en";

  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

  try {
    const translated = await translateAny(text, target);
    return NextResponse.json({ translated });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
