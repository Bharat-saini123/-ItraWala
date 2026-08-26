"use client";

import { useState, useTransition } from "react";
import { saveProduct, type ProductFormInput } from "@/app/admin/actions";
import { ImageUploader } from "./ImageUploader";
import type { CategoryDTO } from "@/types";

type Props = {
  categories: CategoryDTO[];
  initial?: ProductFormInput;
};

export function ProductForm({ categories, initial }: Props) {
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [scentNotes, setScentNotes] = useState<string>(initial?.scentNotes.join(", ") ?? "");
  const [isVisible, setIsVisible] = useState(initial?.isVisible ?? true);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    const payload: ProductFormInput = {
      id: initial?.id,
      name: String(fd.get("name")),
      description: String(fd.get("description")),
      shortSummary: String(fd.get("shortSummary") || ""),
      price: Number(fd.get("price")),
      compareAtPrice: fd.get("compareAtPrice") ? Number(fd.get("compareAtPrice")) : null,
      sku: String(fd.get("sku") || ""),
      stock: Number(fd.get("stock")),
      volumeMl: fd.get("volumeMl") ? Number(fd.get("volumeMl")) : null,
      categoryId: String(fd.get("categoryId") || "") || null,
      isVisible,
      isFeatured,
      images,
      scentNotes: scentNotes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (!payload.name || !payload.description || !payload.price) {
      setError("Name, description and price are required.");
      return;
    }

    startTransition(() => {
      saveProduct(payload);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-gold/20 bg-paper p-6">
          <h2 className="font-display text-lg text-ink">Details</h2>
          <Field label="Product Name" name="name" defaultValue={initial?.name} required />
          <Field
            label="Short Summary"
            name="shortSummary"
            defaultValue={initial?.shortSummary ?? ""}
            hint="One line shown on product cards"
          />
          <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
            Full Description
            <textarea
              name="description"
              defaultValue={initial?.description}
              required
              rows={5}
              className="mt-1.5 w-full rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring"
            />
          </label>
          <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
            Category
            <select
              name="categoryId"
              defaultValue={initial?.categoryId ?? ""}
              className="mt-1.5 w-full rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
            Scent Notes (comma separated)
            <input
              value={scentNotes}
              onChange={(e) => setScentNotes(e.target.value)}
              placeholder="Rose, Oudh, Musk"
              className="mt-1.5 w-full rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring"
            />
          </label>
        </div>

        <div className="space-y-5">
          <div className="space-y-5 rounded-2xl border border-gold/20 bg-paper p-6">
            <h2 className="font-display text-lg text-ink">Pricing & Stock</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (₹)" name="price" type="number" defaultValue={initial?.price} required />
              <Field
                label="Compare-at Price (₹)"
                name="compareAtPrice"
                type="number"
                defaultValue={initial?.compareAtPrice ?? ""}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Stock Quantity" name="stock" type="number" defaultValue={initial?.stock ?? 0} required />
              <Field label="Volume (ml)" name="volumeMl" type="number" defaultValue={initial?.volumeMl ?? ""} />
            </div>
            <Field label="SKU (optional)" name="sku" defaultValue={initial?.sku ?? ""} />

            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2 font-body text-sm text-ink/80">
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  className="h-4 w-4 accent-maroon"
                />
                Visible on storefront
              </label>
              <label className="flex items-center gap-2 font-body text-sm text-ink/80">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 accent-maroon"
                />
                Featured (homepage)
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-gold/20 bg-paper p-6">
            <h2 className="mb-4 font-display text-lg text-ink">Images</h2>
            <ImageUploader images={images} onChange={setImages} />
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-terracotta/10 px-4 py-2 font-body text-sm text-terracotta">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-maroon px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-ivory hover:bg-maroon-dark disabled:opacity-60"
      >
        {pending ? "Saving..." : initial?.id ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required = false,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
      {label}
      <input
        name={name}
        type={type}
        step={type === "number" ? "0.01" : undefined}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="mt-1.5 w-full rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring"
      />
      {hint && <span className="mt-1 block font-body text-[11px] font-normal normal-case text-ink/40">{hint}</span>}
    </label>
  );
}
