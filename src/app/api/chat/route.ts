import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/security";
import { prisma } from "@/lib/prisma";

// Groq API — https://console.groq.com
// OpenAI-compatible endpoint, fast inference
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-20b"; // Active Groq free-tier model (Aug 2026)

const adminEmail = process.env.ADMIN_EMAIL ?? "";
const ownerPhone = process.env.NEXT_PUBLIC_OWNER_PHONE ?? "";
const SYSTEM_PROMPT = `You are a helpful customer assistant for तोरणद्वार ItraWala, a traditional Indian perfumery store based in Narnaul, Haryana.
You help customers with:
- Information about our attars, oudh, eau de parfum, bakhoor, and gift sets
- Product recommendations based on preferences (floral, woody, musky, oriental, etc.)
- Order queries and shipping information
- Store timings: Open 9 AM - 9 PM, Mon-Sun
- Store address: Opposite Polytechnic, Seka, Narnaul, Haryana - 123001
- Contact: ${ownerPhone} | ${adminEmail}
- Owner: Rajneesh Saini

PRODUCT DATA RULES:
- The catalog below is the only source of truth for product names, prices, stock, sizes, descriptions, categories, and scent notes.
- Never invent or guess a product, price, discount, availability, size, scent note, delivery promise, or order detail.
- If the requested product or fact is not in the catalog, say that the information is not currently available and ask the customer to contact the store.
- Recommend only products present in the catalog. Do not mention hidden products.

Be warm, friendly, and knowledgeable about traditional Indian perfumery. Keep answers concise (2-3 sentences max unless more detail is needed).
Language rules are important: if the customer asks in Hindi or Hinglish, reply in natural Hinglish using Roman English letters only (do not use Devanagari). If the customer asks in English, reply entirely in English. Match the customer's language consistently and do not switch languages unless they do.`;

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(`chat:${getClientIp(req)}`, 20, 10 * 60 * 1000);
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfter);

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

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const validMessages = messages.slice(-10).filter(
      (message): message is { role: "user" | "assistant"; content: string } =>
        message && (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" && message.content.trim().length > 0 &&
        message.content.length <= 4000,
    );
    if (validMessages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    let products;
    try {
      products = await prisma.product.findMany({
        where: { isVisible: true },
        orderBy: { name: "asc" },
        take: 100,
        select: {
          name: true,
          description: true,
          shortSummary: true,
          price: true,
          stock: true,
          volumeMl: true,
          scentNotes: true,
          category: { select: { name: true } },
        },
      });
    } catch (error) {
      console.error("[chat] Product catalog lookup failed:", error);
      return NextResponse.json(
        { error: "Product information is temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }

    const catalog = products.map((product) => ({
      name: product.name,
      category: product.category?.name ?? null,
      price: product.price.toString(),
      stock: product.stock > 0 ? "in stock" : "out of stock",
      volumeMl: product.volumeMl,
      summary: product.shortSummary ?? product.description,
      scentNotes: product.scentNotes,
    }));

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
          {
            role: "system",
            content: `CURRENT PRODUCT CATALOG (database snapshot):\n${JSON.stringify(catalog)}`,
          },
          // Keep last 10 messages for context window
          ...validMessages.map((m) => ({
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
      `Sorry, I couldn't generate a response. Please call us at ${ownerPhone}.`;

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[chat] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
