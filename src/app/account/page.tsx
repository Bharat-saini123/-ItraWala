import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { SignOutButton } from "@/components/SignOutButton";
import { ProfileEditor } from "@/components/ProfileEditor";

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account");

  const orderSteps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

  const [profile, orders] = await Promise.all([
    prisma.profile.findUnique({ where: { id: user.id } }),
    prisma.order.findMany({
      where: { profileId: user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 md:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
            My Account
          </p>
          <h1 className="mt-1 font-display text-3xl text-maroon">
            {profile?.fullName || user.email}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {profile?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="rounded-full border border-maroon/40 px-5 py-2 font-body text-xs font-semibold uppercase tracking-wider text-maroon hover:bg-maroon/5"
            >
              Admin Panel
            </Link>
          )}
          <SignOutButton />
        </div>
      </div>

      <div className="mt-10">
        <ProfileEditor profile={profile!} email={user.email!} />
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-display text-xl text-ink">Order History</h2>
        {orders.length === 0 ? (
          <p className="rounded-2xl border border-gold/20 bg-paper p-8 text-center font-body text-sm text-ink/60">
            You haven&apos;t placed any orders yet.{" "}
            <Link href="/shop" className="text-maroon hover:underline">
              Start shopping
            </Link>
            .
          </p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="rounded-2xl border border-gold/20 bg-paper p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-body text-sm font-semibold text-ink">
                      Order #{order.orderNumber}
                    </p>
                    <p className="font-body text-xs text-ink/50">
                      {order.createdAt.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="rounded-full bg-maroon/10 px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide text-maroon">
                    {order.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 font-body text-xs text-ink/60">
                  {order.items.map((item) => (
                    <span key={item.id} className="rounded-full bg-ivory px-3 py-1">
                      {item.productName} × {item.quantity}
                    </span>
                  ))}
                </div>
                <p className="mt-3 font-body text-sm font-semibold text-maroon">
                  {formatINR(Number(order.total))}
                </p>
                {order.status === "CANCELLED" ? (
                  <div className="mt-5 rounded-lg border border-terracotta/30 bg-terracotta/10 px-3 py-2 font-body text-xs font-semibold uppercase tracking-wide text-terracotta">
                    Order cancelled
                  </div>
                ) : (
                  <div className="mt-6 px-1">
                    {(() => {
                      const currentStepIndex = orderSteps.indexOf(order.status as (typeof orderSteps)[number]);
                      return (
                    <div className="relative">
                      <div className="absolute left-2 right-2 top-2 h-1 rounded-full bg-gold/20" />
                      <div
                        className="absolute left-2 top-2 h-1 rounded-full bg-gold transition-all duration-500"
                        style={{
                          width: `${(orderSteps.indexOf(order.status) / (orderSteps.length - 1)) * 100}%`,
                        }}
                      />
                      <div className="relative flex justify-between">
                        {orderSteps.map((step, index) => {
                          const isComplete = index <= currentStepIndex;
                          return (
                            <div key={step} className="flex flex-col items-center gap-2">
                              <span
                                className={`h-5 w-5 rounded-full border-4 border-paper transition-colors duration-500 ${
                                  isComplete ? "bg-gold" : "bg-ivory"
                                }`}
                              />
                              <span
                                className={`font-body text-[10px] font-semibold uppercase tracking-wide ${
                                  isComplete ? "text-maroon" : "text-ink/40"
                                }`}
                              >
                                {step === "PENDING" ? "Placed" : step.charAt(0) + step.slice(1).toLowerCase()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                      );
                    })()}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
