import Image from "next/image";
import { ArchDivider } from "@/components/ArchDivider";

export const metadata = { title: "Our Story — ItraWala" };

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-5 py-16 text-center md:px-8">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
          Our Story
        </p>
        <h1 className="mt-3 font-display text-4xl text-maroon md:text-5xl">
          A gateway between tradition and today
        </h1>
        <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-ink/70">
          तोरणद्वार means &ldquo;gateway&rdquo; — a threshold you pass through into
          somewhere meaningful. That is exactly what we want ItraWala to be: a
          doorway back to the slow, careful perfumery of Kannauj, made easy to
          bring into modern life.
        </p>
      </section>

      <div className="relative mx-auto aspect-[16/7] max-w-6xl overflow-hidden rounded-3xl px-5 md:px-8">
        <Image
          src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=1400"
          alt="Traditional attar distillation"
          fill
          className="rounded-3xl object-cover"
        />
      </div>

      <section className="mx-auto max-w-4xl px-5 py-16 md:px-8">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-maroon">Rooted in Kannauj</h2>
            <p className="mt-3 font-body text-sm leading-relaxed text-ink/70">
              For over a thousand years, Kannauj has been India&apos;s perfume
              capital. We work with families of perfumers there who still
              distil attar the traditional way — flowers and woods steamed
              over sandalwood oil in copper deghs, exactly as their
              grandparents did.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-maroon">Made for today</h2>
            <p className="mt-3 font-body text-sm leading-relaxed text-ink/70">
              Alongside pure attars, we blend modern eau de parfums and
              curate bakhoor and gift sets — so the same fragrance heritage
              fits easily into daily life, wherever you are.
            </p>
          </div>
        </div>

        <ArchDivider className="my-14" />

        <div className="grid gap-10 text-center sm:grid-cols-3">
          {[
            { n: "1000+", label: "Years of Kannauj perfumery heritage" },
            { n: "40+", label: "Attars, oudhs & blends in our collection" },
            { n: "10,000+", label: "Bottles shipped across India" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl text-maroon">{s.n}</p>
              <p className="mt-2 font-body text-xs uppercase tracking-wide text-ink/55">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
