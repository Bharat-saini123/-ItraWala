"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { generateOrderNumber } from "@/lib/utils";

export type CheckoutItem = {
  productId: string;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
};

export type CheckoutInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
  items: CheckoutItem[];
};

export async function placeOrder(input: CheckoutInput) {
  if (!input.items.length) {
    return { success: false, error: "Your cart is empty." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const subtotal = input.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = subtotal >= 999 ? 0 : 79;
  const total = subtotal + shippingFee;

  // Verify stock server-side before committing the order.
  const products = await prisma.product.findMany({
    where: { id: { in: input.items.map((i) => i.productId) } },
  });

  for (const item of input.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || !product.isVisible) {
      return { success: false, error: `${item.name} is no longer available.` };
    }
    if (product.stock < item.quantity) {
      return { success: false, error: `${item.name} only has ${product.stock} left in stock.` };
    }
  }

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        profileId: user?.id ?? null,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        shippingAddress: input.shippingAddress,
        city: input.city,
        state: input.state,
        pincode: input.pincode,
        notes: input.notes,
        subtotal,
        shippingFee,
        total,
        items: {
          create: input.items.map((i) => ({
            productId: i.productId,
            productName: i.name,
            productImage: i.image,
            unitPrice: i.price,
            quantity: i.quantity,
          })),
        },
      },
    });

    for (const item of input.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  return { success: true, orderNumber: order.orderNumber, orderId: order.id };
}
