"use client";

import { useState, useTransition } from "react";
import { updateStock } from "@/app/admin/actions";

export function StockEditor({ productId, stock }: { productId: string; stock: number }) {
  const [value, setValue] = useState(stock);
  const [pending, startTransition] = useTransition();

  function commit() {
    if (value === stock) return;
    startTransition(() => {
      updateStock(productId, value);
    });
  }

  return (
    <input
      type="number"
      min={0}
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      onBlur={commit}
      disabled={pending}
      className={`w-20 rounded-lg border px-2 py-1 font-body text-sm focus-ring ${
        value <= 5 ? "border-terracotta/60 text-terracotta" : "border-gold/30 text-ink"
      }`}
    />
  );
}
