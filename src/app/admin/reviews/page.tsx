import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReviewsList from "./ReviewsList";

export const metadata = { title: "Customer Reviews — Admin" };

export default async function ReviewsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/reviews");

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (profile?.role !== "ADMIN") redirect("/account");

  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-maroon">Customer Reviews</h1>
        <p className="mt-2 font-body text-sm text-ink/60">Approve reviews before they appear on the About page.</p>
      </div>
      <ReviewsList initialReviews={reviews} />
    </div>
  );
}