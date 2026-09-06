import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { OrderStatus, type Prisma } from "@prisma/client";

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
  searchParams: { status?: string; q?: string };
}) {
  const status = Object.values(OrderStatus).includes(searchParams.status as OrderStatus)
    ? (searchParams.status as OrderStatus)
    : undefined;
  const query = searchParams.q?.trim() ?? "";
  const where: Prisma.OrderWhereInput = {
    ...(status ? { status: status as Prisma.OrderWhereInput["status"] } : {}),
    ...(query
      ? {
          OR: [
            { orderNumber: { contains: query, mode: "insensitive" } },
            { customerName: { contains: query, mode: "insensitive" } },
            { customerEmail: { contains: query, mode: "insensitive" } },
            { customerPhone: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const orders = await prisma.order.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
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

      <form className="mt-6 flex flex-col gap-3 rounded-2xl border border-gold/20 bg-paper p-4 sm:flex-row" method="get">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search order number, customer, phone..."
          className="min-w-0 flex-1 rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring"
        >
          <option value="">All statuses</option>
          {Object.keys(STATUS_STYLES).map((orderStatus) => (
            <option key={orderStatus} value={orderStatus}>{orderStatus}</option>
          ))}
        </select>
        <button type="submit" className="rounded-lg bg-maroon px-5 py-2 font-body text-sm font-semibold text-ivory hover:bg-maroon-dark">
          Search
        </button>
        {(query || status) && (
          <Link href="/admin/orders" className="rounded-lg border border-maroon/30 px-5 py-2 text-center font-body text-sm font-semibold text-maroon hover:bg-maroon/5">
            Clear
          </Link>
        )}
      </form>

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
