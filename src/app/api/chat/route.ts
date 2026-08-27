import { NextRequest, NextResponse } from "next/server";

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";
const GROK_MODEL = "grok-3-mini"; // or "grok-3" for the full model

const SYSTEM_PROMPT = `You are a helpful customer assistant for तोरणद्वार ItraWala, a traditional Indian perfumery store based in Narnaul, Haryana.
You help customers with:
- Information about our attars, oudh, eau de parfum, bakhoor, and gift sets
- Product recommendations based on preferences (floral, woody, musky, etc.)
- Order queries and shipping information
- Store timings: Open 9 AM - 9 PM, Mon-Sun
- Store address: Opposite Polytechnic, Seka, Narnaul, Haryana - 123001
- Contact: +91 96141 48000 | hello@itrawala.in
- Owner: Rajneesh Saini

Be warm, friendly, and knowledgeable about traditional Indian perfumery. Keep answers concise (2-3 sentences max unless more detail is needed). You can respond in Hindi, English, or Hinglish based on what the customer uses.`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Grok API key not configured. Please add GROK_API_KEY to your .env file." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const response = await fetch(GROK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-10), // keep last 10 messages for context
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[chat] Grok API error:", response.status, errText);
      return NextResponse.json(
        { error: `Grok API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[chat] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
