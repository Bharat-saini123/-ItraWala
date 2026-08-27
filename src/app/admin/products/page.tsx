import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { StockEditor } from "@/components/admin/StockEditor";
import { VisibilityToggle } from "@/components/admin/VisibilityToggle";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const filter = searchParams.filter;
  const where =
    filter === "hidden"
      ? { isVisible: false }
      : filter === "low-stock"
        ? { stock: { lte: 5 } }
        : undefined;

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const heading =
    filter === "hidden"
      ? "Hidden Products"
      : filter === "low-stock"
        ? "Low Stock Products"
        : "Products";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">{heading}</h1>
          <p className="mt-1 font-body text-sm text-ink/60">
            {products.length} product{products.length === 1 ? "" : "s"} shown. Toggle visibility, edit stock, or open a product to edit full details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {filter && filter !== "all" && (
            <Link
              href="/admin/products"
              className="rounded-full border border-maroon/40 px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-wide text-maroon hover:bg-maroon/5"
            >
              Clear Filter
            </Link>
          )}
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 rounded-full bg-maroon px-5 py-2.5 font-body text-sm font-semibold text-ivory hover:bg-maroon-dark"
          >
            <Plus size={16} /> New Product
          </Link>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gold/20 bg-paper">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gold/15 font-body text-xs uppercase tracking-wide text-ink/50">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Visible</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gold/10 last:border-0">
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-ivory">
                    <Image
                      src={p.images[0] ?? "/placeholder-bottle.svg"}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Link href={`/admin/products/${p.id}`} className="font-body text-sm font-medium text-ink hover:text-maroon">
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3 font-body text-sm text-ink/65">{p.category?.name ?? "—"}</td>
                <td className="px-4 py-3 font-body text-sm text-ink/75">{formatINR(Number(p.price))}</td>
                <td className="px-4 py-3">
                  <StockEditor productId={p.id} stock={p.stock} />
                </td>
                <td className="px-4 py-3">
                  <VisibilityToggle productId={p.id} isVisible={p.isVisible} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/products/${p.id}`} className="font-body text-xs font-semibold text-maroon hover:underline">
                      Edit
                    </Link>
                    <DeleteProductButton productId={p.id} productName={p.name} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center font-body text-sm text-ink/50">
                  No products yet. Create your first product to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
