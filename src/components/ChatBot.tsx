"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are a helpful customer assistant for तोरणद्वार ItraWala, a traditional Indian perfumery store based in Narnaul, Haryana. 
You help customers with:
- Information about our attars, oudh, eau de parfum, bakhoor, and gift sets
- Product recommendations based on preferences
- Order queries and shipping information
- Store timings (Open 9 AM - 9 PM, Mon-Sun)
- Store address: Opposite Polytechnic, Seka, Narnaul, Haryana - 123001
- Contact: +91 96141 48000 | hello@itrawala.in
- Owner: Rajneesh Saini

Be warm, friendly, and knowledgeable about traditional Indian perfumery. Keep answers concise and helpful.`;

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Aadaab! 🌸 मैं ItraWala का AI सहायक हूं। Attars, oudh, या किसी भी product के बारे में पूछें। How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to get response");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please call us at +91 96141 48000 or email hello@itrawala.in for help.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-maroon text-ivory shadow-lg transition hover:scale-105 hover:bg-maroon-dark"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[340px] flex-col overflow-hidden rounded-2xl border border-gold/20 bg-paper shadow-2xl sm:w-[380px]">
          {/* Header */}
          <div className="flex items-center gap-3 bg-maroon px-4 py-3">
            <Bot size={20} className="text-gold-light" />
            <div>
              <p className="font-display text-sm font-semibold text-ivory">
                ItraWala Assistant
              </p>
              <p className="font-body text-[11px] text-ivory/60">
                Powered by Grok AI
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" style={{ maxHeight: "340px" }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 font-body text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-maroon text-ivory"
                      : "bg-ivory/80 text-ink border border-gold/20"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-ivory/80 border border-gold/20 px-3 py-2">
                  <Loader2 size={16} className="animate-spin text-maroon" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-gold/20 bg-paper px-3 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about our attars..."
              className="flex-1 rounded-full border border-gold/30 bg-ivory px-3 py-1.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-maroon/30"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon text-ivory transition hover:bg-maroon-dark disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
