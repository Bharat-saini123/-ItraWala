"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatBot({ adminEmail }: { adminEmail: string }) {
  const ownerPhone = process.env.NEXT_PUBLIC_OWNER_PHONE ?? "";
  const whatsappNumber = ownerPhone.replace(/\D/g, "");
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello, ItraWala ke products ke baare mein jaankari chahiye.")}`
    : "https://wa.me/";
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste! 🌸 Main ItraWala ka AI assistant hoon. Attars, oudh, ya kisi bhi product ke baare mein poochhein. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [messages, isOpen]);

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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to get response");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: msg.includes("API key")
            ? `⚙️ Chatbot abhi setup ho raha hai. Kripya ${ownerPhone} pe call karein.`
            : `Sorry, kuch problem aayi. Please ${ownerPhone} pe call karein ya ${adminEmail} pe email karein.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-105 hover:bg-[#1ebe5d] active:scale-95"
      >
        <MessageCircle size={21} strokeWidth={2.5} />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-ivory bg-[#25D366]" />
      </a>

      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-maroon text-ivory shadow-lg transition-all hover:scale-105 hover:bg-maroon-dark active:scale-95"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[340px] flex-col overflow-hidden rounded-2xl border border-gold/20 bg-paper shadow-2xl sm:w-[380px]">
          {/* Header */}
          <div className="flex items-center gap-3 bg-maroon px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory/10">
              <Bot size={18} className="text-gold-light" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-ivory">
                ItraWala Assistant
              </p>
              <p className="font-body text-[11px] text-ivory/60">
                AI • Powered by Groq
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto text-ivory/50 hover:text-ivory"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex flex-col gap-3 overflow-y-auto p-4"
            style={{ maxHeight: "320px", minHeight: "180px" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2 font-body text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-sm bg-maroon text-ivory"
                      : "rounded-bl-sm border border-gold/20 bg-ivory/80 text-ink"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-gold/20 bg-ivory/80 px-4 py-3">
                  <span
                    className="h-2 w-2 rounded-full bg-maroon/60 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-maroon/60 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-maroon/60 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="flex items-center gap-2 border-t border-gold/20 bg-paper px-3 py-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Kuch poochein…"
              disabled={loading}
              className="flex-1 rounded-full border border-gold/30 bg-ivory px-4 py-1.5 font-body text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-maroon/30 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon text-ivory transition hover:bg-maroon-dark disabled:opacity-40"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
