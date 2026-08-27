"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { sendOrderStatusEmail } from "@/lib/email";
import type { OrderStatus } from "@prisma/client";

async function assertAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (profile?.role !== "ADMIN") throw new Error("Not authorized");
  return profile;
}

export type ProductFormInput = {
  id?: string;
  name: string;
  description: string;
  shortSummary?: string;
  price: number;
  compareAtPrice?: number | null;
  sku?: string;
  stock: number;
  volumeMl?: number | null;
  categoryId?: string | null;
  isVisible: boolean;
  isFeatured: boolean;
  images: string[];
  scentNotes: string[];
};

export async function saveProduct(input: ProductFormInput) {
  await assertAdmin();

  const data = {
    name: input.name,
    slug: slugify(input.name),
    description: input.description,
    shortSummary: input.shortSummary || null,
    price: input.price,
    compareAtPrice: input.compareAtPrice ?? null,
    sku: input.sku || null,
    stock: input.stock,
    volumeMl: input.volumeMl ?? null,
    categoryId: input.categoryId || null,
    isVisible: input.isVisible,
    isFeatured: input.isFeatured,
    images: input.images,
    scentNotes: input.scentNotes,
  };

  if (input.id) {
    await prisma.product.update({ where: { id: input.id }, data });
  } else {
    await prisma.product.create({ data });
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await assertAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function toggleProductVisibility(id: string, isVisible: boolean) {
  await assertAdmin();
  await prisma.product.update({ where: { id }, data: { isVisible } });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function updateStock(id: string, stock: number) {
  await assertAdmin();
  await prisma.product.update({ where: { id }, data: { stock } });
  revalidatePath("/admin/products");
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await assertAdmin();
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new Error("Order not found");

  if (order.status !== status) {
    const updatedOrder = await prisma.order.update({ where: { id }, data: { status } });
    await sendOrderStatusEmail({
      orderNumber: updatedOrder.orderNumber,
      customerName: updatedOrder.customerName,
      customerEmail: updatedOrder.customerEmail,
      total: Number(updatedOrder.total),
      status: updatedOrder.status,
    });
  }
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

export async function createCategory(name: string, description?: string) {
  await assertAdmin();
  await prisma.category.create({
    data: { name, slug: slugify(name), description: description || null },
  });
  revalidatePath("/admin/products");
}
