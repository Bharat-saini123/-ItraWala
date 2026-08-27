"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export default function ContactForm({ adminEmail }: { adminEmail: string }) {
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !subject || !message) {
      setStatus("Please fill in all fields before sending your message.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("✅ Message sent successfully! We'll get back to you soon.");
        form.reset();
      } else {
        setStatus(`❌ Error: ${data.error || "Failed to send message"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("❌ Failed to send message. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-14 grid gap-10 md:grid-cols-[1fr_1.2fr]">
      <div className="space-y-6">
        <ContactRow icon={<Phone size={18} />} label="Phone" value="+91 96141 48000" />
        <ContactRow icon={<Mail size={18} />} label="Email" value={adminEmail} />
        <ContactRow
          icon={<MapPin size={18} />}
          label="Visit Us"
          value={
            <a
              href="https://www.google.com/maps/dir/28.039725,76.1010138/Torandwar+itra-wala,+opposite+Polytechnic,+Seka,+Narnaul,+Haryana+123001/@28.0370157,76.0968326,16.45z/am=t/data=!4m10!4m9!1m1!4e1!1m5!1m1!1s0x3912b5ed78ba8365:0x125c3b30524937c3!2m2!1d76.0974958!2d28.0335847!3e0?entry=ttu&g_ep=EgoyMDI2MDQwMS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noreferrer"
              className="text-maroon hover:underline"
            >
              Opposite Polytechnic, Seka, Narnaul, Haryana - 123001
            </a>
          }
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gold/20 bg-paper p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput label="Name" name="name" required />
          <FormInput label="Email" name="email" type="email" required />
        </div>
        <FormInput label="Subject" name="subject" required />
        <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
          Message
          <textarea
            name="message"
            rows={5}
            required
            className="mt-1.5 w-full rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-full bg-maroon px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-ivory hover:bg-maroon-dark disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send Message"}
        </button>
        {status && (
          <div className={`rounded-lg p-3 font-body text-sm ${status.includes("✅") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {status}
          </div>
        )}
      </form>
    </div>
  );
}

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gold/20 bg-paper p-5">
      <span className="rounded-full bg-maroon/10 p-2.5 text-maroon">{icon}</span>
      <div>
        <p className="font-body text-xs uppercase tracking-wide text-ink/50">{label}</p>
        <p className="font-body text-sm text-ink">{value}</p>
      </div>
    </div>
  );
}

function FormInput({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1.5 w-full rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring"
      />
    </label>
  );
}
