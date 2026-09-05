"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Review = { id: string; name: string; rating: number; comment: string };

type ReviewFormProps = {
  existingReview?: Review | null;
};

export function ReviewForm({ existingReview }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(existingReview?.rating ?? 5);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
      setIsEditing(false);
    } else {
      setRating(5);
      setComment("");
      setIsEditing(true);
    }
  }, [existingReview]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const method = existingReview ? "PUT" : "POST";
      const response = await fetch("/api/reviews", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment,
          ...(existingReview ? { reviewId: existingReview.id } : {}),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save review.");

      setStatus(existingReview ? "Your review has been updated." : "Thank you! Your review will appear after approval.");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save review.");
    } finally {
      setIsLoading(false);
    }
  }

  const hasExistingReview = Boolean(existingReview);

  if (hasExistingReview && !isEditing) {
    const review = existingReview;
    if (!review) return null;

    return (
      <div className="rounded-2xl border border-gold/20 bg-paper p-6">
        <h3 className="font-display text-2xl text-maroon">Your review</h3>
        <p className="mt-3 font-body text-sm text-ink/70">
          You have already submitted one review. You can update it anytime.
        </p>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-gold/20 bg-ivory/60 p-3">
          <div>
            <p className="font-body text-sm font-semibold text-ink">{review.name}</p>
            <p className="mt-1 text-gold-dark">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
          </div>
          <button type="button" onClick={() => setIsEditing(true)} className="rounded-full bg-maroon px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-maroon-dark">
            Edit review
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gold/20 bg-paper p-6">
      <h3 className="font-display text-2xl text-maroon">{hasExistingReview ? "Update your review" : "Share your experience"}</h3>
      <label className="mt-5 block font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
        Rating
        <select value={rating} onChange={(event) => setRating(Number(event.target.value))} className="mt-1.5 block rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring">
          {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{"★".repeat(value)} ({value}/5)</option>)}
        </select>
      </label>
      <label className="mt-4 block font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
        Your review
        <textarea value={comment} onChange={(event) => setComment(event.target.value)} minLength={10} maxLength={500} required rows={4} placeholder="Tell us about your fragrance..." className="mt-1.5 w-full rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring" />
      </label>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={isLoading} className="rounded-full bg-maroon px-6 py-3 font-body text-sm font-semibold uppercase tracking-wider text-ivory hover:bg-maroon-dark disabled:cursor-not-allowed disabled:opacity-60">
          {isLoading ? (hasExistingReview ? "Updating..." : "Submitting...") : (hasExistingReview ? "Update review" : "Submit review")}
        </button>
        {hasExistingReview && (
          <button type="button" onClick={() => setIsEditing(false)} className="rounded-full border border-maroon/30 px-4 py-3 font-body text-xs font-semibold uppercase tracking-wider text-maroon">
            Cancel
          </button>
        )}
      </div>
      {status && <p className="mt-3 font-body text-sm text-ink/70">{status}</p>}
    </form>
  );
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {reviews.map((review) => (
        <article key={review.id} className="rounded-2xl border border-gold/20 bg-paper p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-body text-sm font-semibold text-ink">{review.name}</h3>
            <span aria-label={`${review.rating} out of 5 stars`} className="text-gold-dark">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
          </div>
          <p className="mt-3 font-body text-sm leading-relaxed text-ink/70">{review.comment}</p>
        </article>
      ))}
    </div>
  );
}