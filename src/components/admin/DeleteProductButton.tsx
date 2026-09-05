"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/actions";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const [pending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleDelete() {
    startTransition(() => deleteProduct(productId));
    setDialogOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setDialogOpen(true)}
        disabled={pending}
        aria-label={`Delete ${productName}`}
        className="text-ink/40 hover:text-terracotta disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>
      <ConfirmDialog
        open={dialogOpen}
        title="Delete product?"
        description={`Are you sure you want to delete "${productName}"? This action cannot be undone.`}
        pending={pending}
        onConfirm={handleDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  );
}
