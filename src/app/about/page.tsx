import Image from "next/image";
import Link from "next/link";
import { ArchDivider } from "@/components/ArchDivider";
import { ReviewForm, ReviewList } from "@/components/Reviews";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Our Story — ItraWala" };

export default async function AboutPage() {
  const supabase = createClient();
  const [{ data: { user } }, reviews] = await Promise.all([
    supabase.auth.getUser(),
    prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, rating: true, comment: true },
    }),
  ]);

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
          src="/images/shop.jpg"
          alt="The ItraWala shop and its attar collection"
          fill
          className="rounded-3xl object-cover"
        />
      </div>

      <section className="mx-auto max-w-4xl px-5 py-16 md:px-8">
        <div className="mb-16 grid gap-8 sm:grid-cols-[180px_1fr] sm:items-center">
          <div className="relative mx-auto aspect-square w-44 overflow-hidden rounded-full border-4 border-gold/30">
            <Image src="/images/owner.jpg" alt="Rajneesh Saini, owner of ItraWala" fill sizes="176px" className="object-cover" />
          </div>
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">The person behind ItraWala</p>
            <h2 className="mt-2 font-display text-3xl text-maroon">Rajneesh Saini, Owner</h2>
            <p className="mt-3 font-body text-sm leading-relaxed text-ink/70">A personal passion for India&apos;s fragrance traditions, shared from our shop at Opposite Polytechnic, Seka, Narnaul, Haryana - 123001.</p>
            <p className="mt-4 font-body text-sm leading-relaxed text-ink/70">
              खाटू श्याम बाबा के प्रति अपनी श्रद्धा के रूप में, राजनेश जी बाबा के
              लिए इत्र भी भेजते हैं। सुगंध और भक्ति से जुड़ा यह भाव ItraWala की
              यात्रा का एक खास हिस्सा है।
            </p>
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
              <ReviewForm />
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

        <div className="mt-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">Inside ItraWala</p>
              <h2 className="mt-2 font-display text-3xl text-maroon">Our fragrance collection</h2>
            </div>
            <a href="https://www.instagram.com/torandwar_itrawala/" target="_blank" rel="noreferrer" className="font-body text-sm font-semibold text-maroon hover:underline">Instagram</a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {["image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg", "image6.jpg", "image7.jpg", "image8.jpg", "image10.jpg", "image11.jpg", "image12.webp", "image13.webp"].map((image, index) => (
              <div key={image} className={`relative overflow-hidden rounded-xl bg-paper ${index === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}>
                <Image src={`/images/${image}`} alt={`ItraWala fragrance collection ${index + 1}`} fill sizes="(min-width: 768px) 200px, 50vw" className="object-cover transition duration-500 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
