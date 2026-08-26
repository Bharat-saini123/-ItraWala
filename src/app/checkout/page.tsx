"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatINR } from "@/lib/utils";
import { placeOrder } from "./actions";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingFee = subtotal >= 999 ? 0 : 79;
  const total = subtotal + shippingFee;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const result = await placeOrder({
      customerName: String(formData.get("name")),
      customerEmail: String(formData.get("email")),
      customerPhone: String(formData.get("phone")),
      shippingAddress: String(formData.get("address")),
      city: String(formData.get("city")),
      state: String(formData.get("state")),
      pincode: String(formData.get("pincode")),
      notes: String(formData.get("notes") ?? ""),
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
      })),
    });

    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    clear();
    router.push(`/checkout/success?order=${result.orderNumber}`);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center md:px-8">
        <h1 className="font-display text-3xl text-maroon">Your cart is empty</h1>
        <p className="mt-3 font-body text-sm text-ink/60">Add a few fragrances before checking out.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8">
      <h1 className="mb-8 font-display text-3xl text-maroon">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid gap-10 md:grid-cols-[1fr_320px]">
        <div className="space-y-5 rounded-2xl border border-gold/20 bg-paper p-6">
          <h2 className="font-display text-lg text-ink">Shipping Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" name="name" required />
            <Field label="Phone Number" name="phone" required type="tel" />
          </div>
          <Field label="Email" name="email" required type="email" />
          <Field label="Address" name="address" required as="textarea" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City" name="city" required />
            <Field label="State" name="state" required />
            <Field label="Pincode" name="pincode" required />
          </div>
          <Field label="Order Notes (optional)" name="notes" as="textarea" required={false} />

          {error && (
            <p className="rounded-lg bg-terracotta/10 px-4 py-2 font-body text-sm text-terracotta">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-maroon px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-ivory transition hover:bg-maroon-dark disabled:opacity-60"
          >
            {submitting ? "Placing Order..." : `Place Order — ${formatINR(total)}`}
          </button>
          <p className="text-center font-body text-xs text-ink/50">
            Cash on delivery. Pay when your order arrives.
          </p>
        </div>

        <div className="h-fit rounded-2xl border border-gold/20 bg-paper p-6">
          <h2 className="mb-4 font-display text-lg text-ink">Order Summary</h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between font-body text-sm text-ink/70">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatINR(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="my-4 h-px bg-gold/20" />
          <div className="flex justify-between font-body text-sm text-ink/70">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between font-body text-sm text-ink/70">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? "Free" : formatINR(shippingFee)}</span>
          </div>
          <div className="my-4 h-px bg-gold/20" />
          <div className="flex justify-between font-display text-lg text-ink">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = true,
  as = "input",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  as?: "input" | "textarea";
}) {
  const className =
    "w-full rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring";
  return (
    <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
      {label}
      {as === "textarea" ? (
        <textarea name={name} required={required} rows={3} className={`mt-1.5 ${className}`} />
      ) : (
        <input name={name} type={type} required={required} className={`mt-1.5 ${className}`} />
      )}
    </label>
  );
}
