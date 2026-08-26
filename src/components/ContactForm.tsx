"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !subject || !message) {
      setStatus("Please fill in all fields before sending your message.");
      return;
    }

    const mailtoBody = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const mailtoLink = `mailto:hello@itrawala.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;

    setStatus("Opening your email app with your message. Please send it to complete the contact form.");
    window.location.href = mailtoLink;
    form.reset();
  }

  return (
    <div className="mt-14 grid gap-10 md:grid-cols-[1fr_1.2fr]">
      <div className="space-y-6">
        <ContactRow icon={<Phone size={18} />} label="Phone" value="+91 98765 43210" />
        <ContactRow icon={<Mail size={18} />} label="Email" value="hello@itrawala.in" />
        <ContactRow icon={<MapPin size={18} />} label="Workshop" value="Kannauj, Uttar Pradesh, India" />
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
          className="rounded-full bg-maroon px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-ivory hover:bg-maroon-dark"
        >
          Send Message
        </button>
        {status ? <p className="font-body text-sm text-maroon-dark">{status}</p> : null}
      </form>
    </div>
  );
}

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
