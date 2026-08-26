"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatINR } from "@/lib/utils";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center md:px-8">
        <h1 className="font-display text-3xl text-maroon">Your cart is empty</h1>
        <p className="mt-3 font-body text-sm text-ink/60">
          Explore our attars and oudh to find your next fragrance.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-maroon px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-ivory hover:bg-maroon-dark"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8">
      <h1 className="mb-8 font-display text-3xl text-maroon">Your Cart</h1>

      <div className="grid gap-10 md:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-gold/15">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-5">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ivory">
                <Image
                  src={item.image ?? "/placeholder-bottle.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-2">
                  <Link href={`/shop/${item.slug}`} className="font-display text-base text-ink hover:text-maroon">
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    aria-label="Remove item"
                    className="text-ink/40 hover:text-terracotta"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-gold/40">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-2 text-ink/70 hover:text-maroon"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-6 text-center font-body text-sm">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, Math.min(item.stock, item.quantity + 1))
                      }
                      className="p-2 text-ink/70 hover:text-maroon"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="font-body text-sm font-semibold text-maroon">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-2xl border border-gold/20 bg-paper p-6">
          <h2 className="mb-4 font-display text-lg text-ink">Order Summary</h2>
          <div className="flex justify-between font-body text-sm text-ink/70">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between font-body text-sm text-ink/70">
            <span>Shipping</span>
            <span>{subtotal >= 999 ? "Free" : formatINR(79)}</span>
          </div>
          <div className="my-4 h-px bg-gold/20" />
          <div className="flex justify-between font-display text-lg text-ink">
            <span>Total</span>
            <span>{formatINR(subtotal >= 999 ? subtotal : subtotal + 79)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-maroon px-8 py-3 text-center font-body text-sm font-semibold uppercase tracking-wider text-ivory hover:bg-maroon-dark"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
