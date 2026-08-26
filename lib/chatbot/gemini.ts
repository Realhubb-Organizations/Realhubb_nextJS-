const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Calls Gemini's free-tier REST API. Returns null (never throws) on any
 * failure — missing key, rate limit, network error — so callers can fall
 * back to a canned response instead of breaking the chat experience.
 */
export async function askGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[chatbot] GEMINI_API_KEY is not set — AI fallback disabled");
    return null;
  }

  try {
    const res = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.3 },
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.error("[chatbot] Gemini API error:", res.status, await res.text().catch(() => ""));
      return null;
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof text === "string" && text.trim() ? text.trim() : null;
  } catch (e) {
    console.error("[chatbot] Gemini call failed:", e);
    return null;
  }
}
