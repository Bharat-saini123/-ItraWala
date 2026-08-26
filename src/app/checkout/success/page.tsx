import Link from "next/link";
import { ArchDivider } from "@/components/ArchDivider";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center md:px-8">
      <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
        Order Confirmed
      </p>
      <h1 className="mt-3 font-display text-3xl text-maroon">Thank you for your order</h1>
      <p className="mt-4 font-body text-sm leading-relaxed text-ink/70">
        Your fragrance is being prepared with care. We&apos;ll reach out on the phone
        number you provided to confirm delivery details.
      </p>
      {searchParams.order && (
        <p className="mt-6 rounded-full border border-gold/40 px-6 py-2 font-body text-sm font-semibold tracking-wide text-maroon inline-block">
          Order #{searchParams.order}
        </p>
      )}
      <ArchDivider className="my-10" />
      <Link
        href="/shop"
        className="inline-block rounded-full bg-maroon px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-ivory hover:bg-maroon-dark"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
