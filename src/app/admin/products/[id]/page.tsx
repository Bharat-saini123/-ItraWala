import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Edit Product</h1>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          name: product.name,
          description: product.description,
          shortSummary: product.shortSummary ?? "",
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          sku: product.sku ?? "",
          stock: product.stock,
          volumeMl: product.volumeMl,
          categoryId: product.categoryId,
          isVisible: product.isVisible,
          isFeatured: product.isFeatured,
          images: product.images,
          scentNotes: product.scentNotes,
        }}
      />
    </div>
  );
}
