import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = { title: "Contact Us — ItraWala" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 md:px-8">
      <div className="text-center">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
          Get In Touch
        </p>
        <h1 className="mt-3 font-display text-4xl text-maroon">We&apos;d Love to Hear From You</h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-sm text-ink/65">
          Questions about a fragrance, a bulk or gifting order, or anything
          else — reach out and our team will get back to you within a day.
        </p>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <ContactRow icon={<Phone size={18} />} label="Phone" value="+91 98765 43210" />
          <ContactRow icon={<Mail size={18} />} label="Email" value="hello@itrawala.in" />
          <ContactRow icon={<MapPin size={18} />} label="Workshop" value="Kannauj, Uttar Pradesh, India" />
        </div>

        <form className="space-y-4 rounded-2xl border border-gold/20 bg-paper p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput label="Name" name="name" />
            <FormInput label="Email" name="email" type="email" />
          </div>
          <FormInput label="Subject" name="subject" />
          <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
            Message
            <textarea
              name="message"
              rows={5}
              className="mt-1.5 w-full rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-maroon px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-ivory hover:bg-maroon-dark"
          >
            Send Message
          </button>
        </form>
      </div>
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

function FormInput({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
      {label}
      <input
        name={name}
        type={type}
        className="mt-1.5 w-full rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring"
      />
    </label>
  );
}
