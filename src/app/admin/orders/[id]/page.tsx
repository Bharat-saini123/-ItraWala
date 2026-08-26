import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div>
      <Link href="/admin/orders" className="mb-4 flex items-center gap-1.5 font-body text-sm text-ink/60 hover:text-maroon">
        <ArrowLeft size={15} /> Back to orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-ink">Order #{order.orderNumber}</h1>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-gold/20 bg-paper p-6">
          <h2 className="mb-4 font-display text-lg text-ink">Items</h2>
          <ul className="divide-y divide-gold/10">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ivory">
                  <Image
                    src={item.productImage ?? "/placeholder-bottle.svg"}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-body text-sm font-medium text-ink">{item.productName}</p>
                  <p className="font-body text-xs text-ink/50">
                    {formatINR(Number(item.unitPrice))} × {item.quantity}
                  </p>
                </div>
                <p className="font-body text-sm font-semibold text-maroon">
                  {formatINR(Number(item.unitPrice) * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-1 border-t border-gold/15 pt-4">
            <div className="flex justify-between font-body text-sm text-ink/65">
              <span>Subtotal</span>
              <span>{formatINR(Number(order.subtotal))}</span>
            </div>
            <div className="flex justify-between font-body text-sm text-ink/65">
              <span>Shipping</span>
              <span>{Number(order.shippingFee) === 0 ? "Free" : formatINR(Number(order.shippingFee))}</span>
            </div>
            <div className="flex justify-between font-display text-base text-ink">
              <span>Total</span>
              <span>{formatINR(Number(order.total))}</span>
            </div>
          </div>

          {order.notes && (
            <div className="mt-4 rounded-lg bg-ivory p-3">
              <p className="font-body text-xs font-semibold uppercase tracking-wide text-ink/50">
                Order Notes
              </p>
              <p className="mt-1 font-body text-sm text-ink/75">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="h-fit rounded-2xl border border-gold/20 bg-paper p-6">
          <h2 className="mb-4 font-display text-lg text-ink">Customer</h2>
          <dl className="space-y-3 font-body text-sm">
            <Row label="Name" value={order.customerName} />
            <Row label="Email" value={order.customerEmail} />
            <Row label="Phone" value={order.customerPhone} />
            <Row
              label="Shipping Address"
              value={`${order.shippingAddress}, ${order.city}, ${order.state} - ${order.pincode}`}
            />
            <Row
              label="Order Date"
              value={order.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            />
          </dl>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-body text-xs uppercase tracking-wide text-ink/45">{label}</dt>
      <dd className="mt-0.5 text-ink/80">{value}</dd>
    </div>
  );
}
