"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import type { ProductDTO } from "@/types";

export function AddToCartButton({ product }: { product: ProductDTO }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0] ?? null,
        price: product.price,
        stock: product.stock,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  if (outOfStock) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-full border border-ink/20 bg-ink/10 px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-ink/40"
      >
        Sold Out
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-full border border-gold/40">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="p-2.5 text-ink/70 hover:text-maroon focus-ring"
          aria-label="Decrease quantity"
        >
          <Minus size={15} />
        </button>
        <span className="w-6 text-center font-body text-sm">{qty}</span>
        <button
          onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
          className="p-2.5 text-ink/70 hover:text-maroon focus-ring"
          aria-label="Increase quantity"
        >
          <Plus size={15} />
        </button>
      </div>
      <button
        onClick={handleAdd}
        className="flex-1 rounded-full bg-maroon px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-ivory transition hover:bg-maroon-dark focus-ring"
      >
        {added ? "Added ✓" : "Add to Cart"}
      </button>
    </div>
  );
}
