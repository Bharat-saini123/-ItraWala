import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { ArchDivider } from "@/components/ArchDivider";

export const revalidate = 30;

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product || !product.isVisible) return null;
  return {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: {
      isVisible: true,
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    include: { category: true },
    take: 4,
  });
  const relatedDto = related.map((p) => ({
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
  }));

  const image = product.images[0] ?? "/placeholder-bottle.svg";

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="arch-frame relative aspect-square w-full overflow-hidden bg-ivory">
          <Image src={image} alt={product.name} fill className="object-cover" priority />
        </div>

        <div>
          {product.category && (
            <p className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
              {product.category.name}
            </p>
          )}
          <h1 className="font-display text-4xl text-maroon">{product.name}</h1>
          {product.shortSummary && (
            <p className="mt-3 font-body text-base text-ink/70">{product.shortSummary}</p>
          )}

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl text-ink">{formatINR(product.price)}</span>
            {product.compareAtPrice && (
              <span className="font-body text-lg text-ink/40 line-through">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
            {product.volumeMl && (
              <span className="font-body text-sm text-ink/50">/ {product.volumeMl}ml</span>
            )}
          </div>

          <p className="mt-2 font-body text-sm text-ink/60">
            {product.stock > 0 ? `${product.stock} in stock` : "Currently out of stock"}
          </p>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          {product.scentNotes.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-2 font-body text-xs font-semibold uppercase tracking-widest text-gold-dark">
                Scent Notes
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.scentNotes.map((note) => (
                  <span
                    key={note}
                    className="rounded-full border border-gold/40 px-3 py-1 font-body text-xs text-ink/70"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          <ArchDivider className="my-8" />

          <div>
            <h3 className="mb-2 font-body text-xs font-semibold uppercase tracking-widest text-gold-dark">
              Description
            </h3>
            <p className="whitespace-pre-line font-body text-sm leading-relaxed text-ink/75">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {relatedDto.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-2xl text-maroon">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {relatedDto.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
