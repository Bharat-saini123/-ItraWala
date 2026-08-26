"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { CategoryDTO } from "@/types";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

export function Filters({ categories }: { categories: CategoryDTO[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";
  const activeSort = searchParams.get("sort") ?? "newest";
  const inStockOnly = searchParams.get("inStock") === "1";
  const featuredOnly = searchParams.get("featured") === "1";

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-gold/15 bg-paper p-5">
      <div>
        <h3 className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-gold-dark">
          Category
        </h3>
        <ul className="space-y-1.5">
          <li>
            <button
              onClick={() => setParam("category", null)}
              className={`w-full rounded-lg px-2 py-1.5 text-left font-body text-sm transition ${
                !activeCategory ? "bg-maroon text-ivory" : "text-ink/75 hover:bg-ivory"
              }`}
            >
              All Products
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setParam("category", c.slug)}
                className={`w-full rounded-lg px-2 py-1.5 text-left font-body text-sm transition ${
                  activeCategory === c.slug ? "bg-maroon text-ivory" : "text-ink/75 hover:bg-ivory"
                }`}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-gold-dark">
          Sort By
        </h3>
        <select
          value={activeSort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="w-full rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-gold-dark">
          Availability
        </h3>
        <label className="flex items-center gap-2 font-body text-sm text-ink/80">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setParam("inStock", e.target.checked ? "1" : null)}
            className="h-4 w-4 accent-maroon"
          />
          In stock only
        </label>
        <label className="mt-2 flex items-center gap-2 font-body text-sm text-ink/80">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(e) => setParam("featured", e.target.checked ? "1" : null)}
            className="h-4 w-4 accent-maroon"
          />
          Featured only
        </label>
      </div>

      {(activeCategory || inStockOnly || featuredOnly || activeSort !== "newest") && (
        <button
          onClick={() => router.push(pathname)}
          className="font-body text-xs font-semibold uppercase tracking-wider text-terracotta hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
