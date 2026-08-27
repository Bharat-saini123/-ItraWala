import Link from "next/link";

type LegalSection = {
  title: string;
  content: string;
  items?: string[];
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalPage({ eyebrow, title, intro, sections }: LegalPageProps) {
  return (
    <div className="bg-arch-pattern">
      <header className="mx-auto max-w-4xl px-5 pb-12 pt-16 md:px-8 md:pt-20">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl text-maroon md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-ink/70">{intro}</p>
        <p className="mt-4 font-body text-xs uppercase tracking-wider text-ink/50">
          Last updated: 27 August 2026
        </p>
      </header>

      <article className="mx-auto max-w-4xl px-5 pb-20 md:px-8">
        <div className="divide-y divide-gold/20 border-y border-gold/20 bg-paper/70">
          {sections.map((section) => (
            <section key={section.title} className="px-6 py-8 md:px-10">
              <h2 className="font-display text-2xl text-maroon">{section.title}</h2>
              <p className="mt-3 font-body text-sm leading-7 text-ink/70">{section.content}</p>
              {section.items && (
                <ul className="mt-4 list-disc space-y-2 pl-5 font-body text-sm leading-6 text-ink/70">
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-8 border-l-2 border-gold px-5 py-2">
          <p className="font-body text-sm leading-6 text-ink/70">
            Need help? Contact us at <a href="mailto:hello@itrawala.in" className="font-semibold text-maroon hover:underline">hello@itrawala.in</a> or call <a href="tel:+919614148000" className="font-semibold text-maroon hover:underline">9614148000</a>.
          </p>
          <Link href="/contact" className="mt-2 inline-block font-body text-sm font-semibold text-maroon hover:underline">
            Go to contact page
          </Link>
        </div>
      </article>
    </div>
  );
}