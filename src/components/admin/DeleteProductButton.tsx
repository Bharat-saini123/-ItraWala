"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/actions";

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return;
    startTransition(() => deleteProduct(productId));
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      aria-label={`Delete ${productName}`}
      className="text-ink/40 hover:text-terracotta disabled:opacity-50"
    >
      <Trash2 size={16} />
    </button>
  );
}
