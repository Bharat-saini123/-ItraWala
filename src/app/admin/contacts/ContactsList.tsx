"use client";

import { useState } from "react";
import type { Message } from "@prisma/client";
import { Mail, X } from "lucide-react";

export default function ContactsList({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMarkAsRead = async (messageId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        setMessages(
          messages.map((m) =>
            m.id === messageId ? { ...m, isRead: true } : m
          )
        );
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessages(messages.filter((m) => m.id !== messageId));
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Messages List */}
      <div className="md:col-span-1">
        <div className="rounded-lg border border-gold/20 bg-white">
          <div className="border-b border-gold/20 bg-paper px-6 py-4">
            <h2 className="font-body text-sm font-semibold text-ink">
              Messages ({messages.length})
            </h2>
          </div>
          <div className="divide-y divide-gold/10">
            {messages.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="font-body text-sm text-ink/60">No messages</p>
              </div>
            ) : (
              messages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message);
                    handleMarkAsRead(message.id);
                  }}
                  className={`w-full px-6 py-4 text-left transition-colors hover:bg-paper/50 ${
                    selectedMessage?.id === message.id ? "bg-paper" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {!message.isRead && (
                        <div className="h-2 w-2 rounded-full bg-maroon"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-body text-sm font-semibold text-ink">
                        {message.name}
                      </p>
                      <p className="truncate font-body text-xs text-ink/60">
                        {message.subject}
                      </p>
                      <p className="mt-1 font-body text-xs text-ink/40">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Message Detail */}
      <div className="md:col-span-2">
        {selectedMessage ? (
          <div className="rounded-lg border border-gold/20 bg-white">
            <div className="border-b border-gold/20 bg-paper px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-maroon" />
                <h2 className="font-body text-sm font-semibold text-ink">
                  Message Details
                </h2>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-ink/60 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Contact Info */}
              <div>
                <p className="font-body text-xs uppercase tracking-wide text-ink/60">
                  From
                </p>
                <p className="mt-2 font-body text-sm font-semibold text-ink">
                  {selectedMessage.name}
                </p>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="font-body text-sm text-maroon hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>

              {/* Subject */}
              <div>
                <p className="font-body text-xs uppercase tracking-wide text-ink/60">
                  Subject
                </p>
                <p className="mt-2 font-body text-sm text-ink">
                  {selectedMessage.subject}
                </p>
              </div>

              {/* Message */}
              <div>
                <p className="font-body text-xs uppercase tracking-wide text-ink/60">
                  Message
                </p>
                <div className="mt-3 rounded-lg border border-gold/20 bg-paper p-4">
                  <p className="whitespace-pre-wrap font-body text-sm text-ink">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div>
                <p className="font-body text-xs uppercase tracking-wide text-ink/60">
                  Received
                </p>
                <p className="mt-2 font-body text-sm text-ink">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="border-t border-gold/20 pt-6 flex gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="flex-1 rounded bg-maroon px-4 py-2 font-body text-sm font-semibold text-white hover:bg-maroon-dark"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  disabled={loading}
                  className="rounded bg-red-600 px-4 py-2 font-body text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-gold/20 bg-white p-12 text-center">
            <Mail size={32} className="mx-auto text-gold/40" />
            <p className="mt-4 font-body text-sm text-ink/60">
              Select a message to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
