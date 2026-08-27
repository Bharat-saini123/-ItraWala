import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export default async function AdminDashboard() {
  const [productCount, hiddenCount, lowStockCount, orders, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isVisible: false } }),
    prisma.product.count({ where: { stock: { lte: 5 } } }),
    prisma.order.findMany(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const revenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  const stats = [
    { label: "Total Products", value: productCount, href: "/admin/products?filter=all" },
    { label: "Hidden Products", value: hiddenCount, href: "/admin/products?filter=hidden" },
    { label: "Low Stock (≤5)", value: lowStockCount, href: "/admin/products?filter=low-stock" },
    { label: "Pending Orders", value: pendingOrders, href: "/admin/orders?status=PENDING" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Dashboard</h1>
      <p className="mt-1 font-body text-sm text-ink/60">
        Total revenue (excluding cancelled): <strong className="text-maroon">{formatINR(revenue)}</strong>
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-gold/20 bg-paper p-5 transition hover:shadow-soft"
          >
            <p className="font-display text-3xl text-maroon">{s.value}</p>
            <p className="mt-1 font-body text-xs uppercase tracking-wide text-ink/55">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">Recent Orders</h2>
          <Link href="/admin/orders" className="font-body text-xs font-semibold uppercase text-maroon hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gold/20 bg-paper">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gold/15 font-body text-xs uppercase tracking-wide text-ink/50">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-gold/10 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-body text-sm font-semibold text-maroon hover:underline">
                      #{o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-ink/75">{o.customerName}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-maroon/10 px-2.5 py-1 font-body text-xs font-semibold text-maroon">
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-ink/75">{formatINR(Number(o.total))}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center font-body text-sm text-ink/50">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
