import { NextRequest, NextResponse } from "next/server";

// Groq API — https://console.groq.com
// OpenAI-compatible endpoint, fast inference
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-20b"; // Active Groq free-tier model (Aug 2026)

const SYSTEM_PROMPT = `You are a helpful customer assistant for तोरणद्वार ItraWala, a traditional Indian perfumery store based in Narnaul, Haryana.
You help customers with:
- Information about our attars, oudh, eau de parfum, bakhoor, and gift sets
- Product recommendations based on preferences (floral, woody, musky, oriental, etc.)
- Order queries and shipping information
- Store timings: Open 9 AM - 9 PM, Mon-Sun
- Store address: Opposite Polytechnic, Seka, Narnaul, Haryana - 123001
- Contact: +91 96141 48000 | hello@itrawala.in
- Owner: Rajneesh Saini

Be warm, friendly, and knowledgeable about traditional Indian perfumery. Keep answers concise (2-3 sentences max unless more detail is needed). You can respond in Hindi, English, or Hinglish based on what the customer uses.`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Groq API key not configured. Please add GROQ_API_KEY to your .env file (get it from https://console.groq.com/keys).",
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          // Keep last 10 messages for context window
          ...messages.slice(-10).map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        max_tokens: 512,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[chat] Groq API error:", response.status, errText);
      return NextResponse.json(
        { error: `AI service error (${response.status}). Please try again shortly.` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content?.trim() ??
      "Sorry, I couldn't generate a response. Please call us at +91 96141 48000.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[chat] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
