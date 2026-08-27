"use client";

import { useTransition } from "react";
import { updateReviewApproval } from "../actions";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
};

export default function ReviewsList({ initialReviews }: { initialReviews: Review[] }) {
  const [isPending, startTransition] = useTransition();

  function changeApproval(id: string, isApproved: boolean) {
    startTransition(async () => {
      await updateReviewApproval(id, isApproved);
    });
  }

  return (
    <div className="space-y-4">
      {initialReviews.length === 0 ? (
        <p className="rounded-2xl border border-gold/20 bg-paper p-8 text-center font-body text-sm text-ink/60">No customer reviews yet.</p>
      ) : initialReviews.map((review) => (
        <article key={review.id} className="rounded-2xl border border-gold/20 bg-paper p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-body text-base font-semibold text-ink">{review.name}</h2>
              <p className="mt-1 text-sm text-gold-dark">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
            </div>
            <span className={`rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide ${review.isApproved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
              {review.isApproved ? "Approved" : "Pending"}
            </span>
          </div>
          <p className="mt-3 font-body text-sm leading-relaxed text-ink/70">{review.comment}</p>
          <div className="mt-4 flex gap-3">
            {!review.isApproved && <button type="button" disabled={isPending} onClick={() => changeApproval(review.id, true)} className="rounded-full bg-maroon px-4 py-2 font-body text-xs font-semibold uppercase tracking-wide text-ivory disabled:opacity-60">Approve</button>}
            {review.isApproved && <button type="button" disabled={isPending} onClick={() => changeApproval(review.id, false)} className="rounded-full border border-maroon/30 px-4 py-2 font-body text-xs font-semibold uppercase tracking-wide text-maroon disabled:opacity-60">Hide review</button>}
          </div>
        </article>
      ))}
    </div>
  );
}