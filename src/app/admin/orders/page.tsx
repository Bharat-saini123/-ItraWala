import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-gold/20 text-gold-dark",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-terracotta/15 text-terracotta",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status;
  const orders = await prisma.order.findMany({
    where: status === "PENDING" ? { status: "PENDING" } : undefined,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink">
            {status === "PENDING" ? "Pending Orders" : "Orders"}
          </h1>
          <p className="mt-1 font-body text-sm text-ink/60">
            {orders.length} {status === "PENDING" ? "pending" : "total"} order{orders.length === 1 ? "" : "s"}
          </p>
        </div>
        {status === "PENDING" && (
          <Link
            href="/admin/orders"
            className="rounded-full border border-maroon/40 px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-wide text-maroon hover:bg-maroon/5"
          >
            Clear Filter
          </Link>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gold/20 bg-paper">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gold/15 font-body text-xs uppercase tracking-wide text-ink/50">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-gold/10 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-body text-sm font-semibold text-maroon hover:underline">
                    #{o.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-body text-sm text-ink/80">{o.customerName}</p>
                  <p className="font-body text-xs text-ink/45">{o.customerPhone}</p>
                </td>
                <td className="px-4 py-3 font-body text-sm text-ink/65">{o.items.length} item(s)</td>
                <td className="px-4 py-3 font-body text-sm text-ink/65">
                  {o.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 font-body text-xs font-semibold ${STATUS_STYLES[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-body text-sm font-semibold text-ink/80">{formatINR(Number(o.total))}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center font-body text-sm text-ink/50">
                  No orders placed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
