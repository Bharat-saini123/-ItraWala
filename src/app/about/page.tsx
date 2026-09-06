import Image from "next/image";
import Link from "next/link";
import { ArchDivider } from "@/components/ArchDivider";
import { ReviewForm, ReviewList } from "@/components/Reviews";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const COLLECTION_ITEMS = [
  { image: "image1.jpg", label: "Gift Set · 5 Piece · 6ml" },
  { image: "image2.jpg", label: "Gift Set · 5 Piece · 12ml" },
  { image: "image3.jpg", label: "Gift Set · 10 Piece · 12ml" },
  { image: "image4.jpg", label: "Gift Set · 25 Piece · 12ml" },
  { image: "image5.jpg", label: "Gift Set · 30 Piece · 6ml" },
  { image: "image6.jpg", label: "Car Diffuser" },
  { image: "image7.jpg", label: "Premium Ittar" },
];

export const metadata = { title: "Our Story — तोरणद्वार Itra Wala" };

export default async function AboutPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [reviews, userReview] = await Promise.all([
    prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, rating: true, comment: true },
    }),
    user
      ? prisma.review.findFirst({
          where: { profileId: user.id },
          select: { id: true, name: true, rating: true, comment: true },
        })
      : null,
  ]);

  return (
    <div>
      <section className="bg-arch-pattern">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_0.8fr] md:items-center md:px-8 md:py-24">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">Our Story</p>
            <h1 className="mt-4 max-w-xl font-display text-4xl leading-tight text-maroon md:text-6xl">
              A gateway between tradition and today
            </h1>
            <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-ink/70">
              तोरणद्वार means &ldquo;gateway&rdquo; — a threshold you pass through into
              somewhere meaningful. That is exactly what we want तोरणद्वार Itra Wala to be: a
              doorway back to the slow, careful perfumery of Kannauj, made easy to
              bring into modern life.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 font-body text-xs font-semibold uppercase tracking-wider text-maroon">
              <span className="rounded-full border border-gold/40 bg-paper px-4 py-2">Kannauj craft</span>
              <span className="rounded-full border border-gold/40 bg-paper px-4 py-2">Small-batch care</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-3 rounded-[2rem] border border-gold/30" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-maroon shadow-soft">
              <Image src="/images/image3.jpg" alt="Traditional तोरणद्वार Itra Wala fragrance bottles" fill className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon/90 to-transparent p-6 pt-20">
                <p className="font-display text-2xl text-ivory">Scent with a soul</p>
                <p className="mt-1 font-body text-sm text-ivory/70">From our family to yours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative mx-auto aspect-[16/7] max-w-6xl overflow-hidden rounded-3xl px-5 md:px-8">
        <Image
          src="/images/shop.jpg"
          alt="The तोरणद्वार Itra Wala shop and its attar collection"
          fill
          className="rounded-3xl object-cover"
        />
      </div>

      <section className="mx-auto max-w-4xl px-5 py-16 md:px-8">
        <div className="mb-16 grid gap-8 rounded-3xl border border-gold/20 bg-paper p-6 shadow-soft sm:grid-cols-[180px_1fr] sm:items-center sm:p-8">
          <div className="relative mx-auto aspect-square w-44 overflow-hidden rounded-full border-4 border-gold/30 shadow-lg">
            <Image src="/images/owner.jpg" alt="Rajneesh Saini, owner of तोरणद्वार Itra Wala" fill sizes="176px" className="object-cover" />
          </div>
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">The person behind तोरणद्वार Itra Wala</p>
            <h2 className="mt-2 font-display text-3xl text-maroon">Rajneesh Saini, Owner</h2>
            <p className="mt-3 font-body text-sm leading-relaxed text-ink/70">A personal passion for India&apos;s fragrance traditions, shared from our shop at Opposite Polytechnic, Seka, Narnaul, Haryana - 123001.</p>
            <p className="mt-4 font-body text-sm leading-relaxed text-ink/70">
              खाटू श्याम बाबा के प्रति अपनी श्रद्धा के रूप में, राजनेश जी बाबा के
              लिए इत्र भी भेजते हैं। सुगंध और भक्ति से जुड़ा यह भाव तोरणद्वार Itra Wala की
              यात्रा का एक खास हिस्सा है।
            </p>
            <Link href="https://www.facebook.com/neeraj.saini.397" target="_blank" className="mt-5 inline-flex rounded-full bg-maroon px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-ivory transition hover:bg-maroon-dark">
              Meet us on Facebook
            </Link>
          </div>
        </div>

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

        <div className="mt-16">
          <div className="mb-6">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">From our customers</p>
            <h2 className="mt-2 font-display text-3xl text-maroon">Fragrance stories</h2>
          </div>
          {reviews.length > 0 && <ReviewList reviews={reviews} />}
          <div className="mt-8">
            {user ? (
              <ReviewForm existingReview={userReview} />
            ) : (
              <div className="rounded-2xl border border-gold/20 bg-paper p-6 text-center">
                <p className="font-body text-sm text-ink/70">Sign in to share your fragrance experience.</p>
                <Link href="/login?next=/about" className="mt-4 inline-block rounded-full bg-maroon px-6 py-3 font-body text-sm font-semibold uppercase tracking-wider text-ivory hover:bg-maroon-dark">
                  Sign in to write a review
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-gold/20 bg-gold/20 text-center sm:grid-cols-3">
          {[
            { n: "1000+", label: "Years of Kannauj perfumery heritage" },
            { n: "40+", label: "Attars, oudhs & blends in our collection" },
            { n: "10,000+", label: "Bottles shipped across India" },
          ].map((s) => (
            <div key={s.label} className="bg-paper px-4 py-6">
              <p className="font-display text-3xl text-maroon">{s.n}</p>
              <p className="mt-2 font-body text-xs uppercase tracking-wide text-ink/55">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="mb-8 flex flex-col gap-4 border-y border-gold/20 py-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">Inside तोरणद्वार Itra Wala</p>
              <h2 className="mt-2 font-display text-3xl text-maroon md:text-4xl">Our fragrance collection</h2>
              <p className="mt-2 max-w-lg font-body text-sm leading-relaxed text-ink/60">A closer look at the bottles, rituals and craft behind every तोरणद्वार Itra Wala fragrance.</p>
            </div>
            <a href="https://www.instagram.com/torandwar_itrawala/" target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 border-b border-maroon/40 pb-1 font-body text-sm font-semibold text-maroon transition hover:border-maroon">Follow our journey <span aria-hidden="true">↗</span></a>
          </div>
          <div className="marquee-gallery" aria-label="Moving fragrance collection gallery">
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <div key={copy} className="marquee-group" aria-hidden={copy === 1}>
                  {COLLECTION_ITEMS.map((item) => (
                    <div key={`${copy}-${item.image}`} className="marquee-card group relative overflow-hidden rounded-2xl bg-paper">
                      <Image src={`/images/${item.image}`} alt={copy === 0 ? `तोरणद्वार Itra Wala ${item.label}` : ""} fill sizes="(min-width: 768px) 260px, 72vw" className="object-cover transition duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-maroon/65 via-transparent to-transparent opacity-70 transition duration-500 group-hover:opacity-100" />
                      <p className="absolute bottom-3 left-3 max-w-[85%] font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory/90 sm:bottom-4 sm:left-4">{item.label}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
