import ContactForm from "@/components/ContactForm";

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

      <ContactForm />
    </div>
  );
}
