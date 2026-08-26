import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { Filters } from "@/components/Filters";
import type { Prisma } from "@prisma/client";

export const revalidate = 30;

type Search = {
  category?: string;
  sort?: string;
  inStock?: string;
  featured?: string;
};

function buildOrderBy(sort?: string): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "name-asc":
      return { name: "asc" };
    default:
      return { createdAt: "desc" };
  }
}

export default async function ShopPage({ searchParams }: { searchParams: Search }) {
  const where: Prisma.ProductWhereInput = { isVisible: true };
  if (searchParams.category) where.category = { slug: searchParams.category };
  if (searchParams.inStock === "1") where.stock = { gt: 0 };
  if (searchParams.featured === "1") where.isFeatured = true;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: buildOrderBy(searchParams.sort),
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const dto = products.map((p) => ({
    ...p,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
  }));

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="mb-10">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
          The Collection
        </p>
        <h1 className="font-display text-4xl text-maroon">Shop All Fragrances</h1>
        <p className="mt-2 font-body text-sm text-ink/60">{dto.length} products</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className="md:sticky md:top-24 md:h-fit">
          <Filters categories={categories} />
        </aside>

        <div>
          {dto.length === 0 ? (
            <div className="rounded-2xl border border-gold/20 bg-paper p-12 text-center">
              <p className="font-display text-xl text-ink">No products match these filters.</p>
              <p className="mt-2 font-body text-sm text-ink/60">
                Try clearing a filter to see more of the collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {dto.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
