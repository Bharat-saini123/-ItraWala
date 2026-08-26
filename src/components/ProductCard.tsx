import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/utils";
import type { ProductDTO } from "@/types";

export function ProductCard({ product }: { product: ProductDTO }) {
  const image = product.images[0] ?? "/placeholder-bottle.svg";
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-gold/15 bg-paper shadow-sm transition hover:-translate-y-1 hover:shadow-soft focus-ring"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {product.compareAtPrice && (
          <span className="absolute left-3 top-3 rounded-full bg-terracotta px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-wide text-ivory">
            Sale
          </span>
        )}
        {outOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-wide text-ivory">
            Sold Out
          </span>
        )}
      </div>
      <div className="p-4">
        {product.category && (
          <p className="mb-1 font-body text-[11px] uppercase tracking-widest text-gold-dark">
            {product.category.name}
          </p>
        )}
        <h3 className="font-display text-lg text-ink">{product.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-body text-base font-semibold text-maroon">
            {formatINR(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="font-body text-sm text-ink/40 line-through">
              {formatINR(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
