"use client";

import { useTransition } from "react";
import { toggleProductVisibility } from "@/app/admin/actions";

export function VisibilityToggle({ productId, isVisible }: { productId: string; isVisible: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => toggleProductVisibility(productId, !isVisible))}
      disabled={pending}
      role="switch"
      aria-checked={isVisible}
      aria-label={isVisible ? "Visible on storefront" : "Hidden from storefront"}
      className={`relative h-6 w-11 rounded-full transition ${
        isVisible ? "bg-maroon" : "bg-ink/20"
      } ${pending ? "opacity-60" : ""}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-ivory shadow transition ${
          isVisible ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}
