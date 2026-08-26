import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { ArchDivider, GatewayMark } from "@/components/ArchDivider";
import type { ProductDTO } from "@/types";

export const revalidate = 60;

async function getFeatured(): Promise<ProductDTO[]> {
  const products = await prisma.product.findMany({
    where: { isVisible: true, isFeatured: true },
    include: { category: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
  return products.map((p) => ({
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
  }));
}

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([getFeatured(), getCategories()]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-arch-pattern">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <div className="relative order-2 md:order-1">
            <GatewayMark className="absolute -left-6 -top-10 h-40 w-40 opacity-30 md:h-56 md:w-56" />
            <p className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.35em] text-gold-dark">
              Gateway to Traditional Perfumery
            </p>
            <h1 className="font-display text-4xl leading-tight text-maroon md:text-6xl">
              Fragrance, distilled
              <br /> the way it was meant to be.
            </h1>
            <p className="mt-6 max-w-md font-body text-base leading-relaxed text-ink/70">
              तोरणद्वार ItraWala brings you pure attars, oudh and bakhoor —
              hand-crafted using centuries-old techniques from Kannauj, the
              perfume capital of India.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="rounded-full bg-maroon px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-ivory transition hover:bg-maroon-dark focus-ring"
              >
                Shop the Collection
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-maroon/40 px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-maroon transition hover:bg-maroon/5 focus-ring"
              >
                Our Story
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="arch-frame relative mx-auto aspect-[3/4] w-full max-w-md">
              <Image
                src="https://images.unsplash.com/photo-1615368144592-05b3d6d4d5c3?w=900"
                alt="Attar bottles arranged on a tray"
                fill
                sizes="(min-width: 768px) 420px, 90vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <ArchDivider className="py-2" />
      </div>

      {/* Category strip */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <h2 className="text-center font-display text-3xl text-maroon">Shop by Category</h2>
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="group rounded-2xl border border-gold/20 bg-paper p-6 text-center transition hover:-translate-y-1 hover:shadow-soft focus-ring"
            >
              <h3 className="font-display text-lg text-ink group-hover:text-maroon">{c.name}</h3>
              {c.description && (
                <p className="mt-2 font-body text-xs leading-relaxed text-ink/55">
                  {c.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="bg-paper py-16">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
                  Curated for you
                </p>
                <h2 className="font-display text-3xl text-maroon">Bestsellers</h2>
              </div>
              <Link
                href="/shop"
                className="hidden font-body text-sm font-semibold uppercase tracking-wider text-maroon hover:underline md:block"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust strip */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-8 rounded-2xl border border-gold/20 bg-maroon/5 p-8 text-center sm:grid-cols-3">
          {[
            { title: "100% Authentic", body: "Sourced directly from Kannauj's perfumers." },
            { title: "Alcohol-Free Attars", body: "Traditional oil-based, skin-friendly formulas." },
            { title: "Pan-India Delivery", body: "Carefully packed, shipped across India." },
          ].map((f) => (
            <div key={f.title}>
              <h3 className="font-display text-lg text-maroon">{f.title}</h3>
              <p className="mt-2 font-body text-sm text-ink/60">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
