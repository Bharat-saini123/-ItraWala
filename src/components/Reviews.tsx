"use client";

import { useState } from "react";

type Review = { id: string; name: string; rating: number; comment: string };

export function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus(null);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit review.");
      setComment("");
      setStatus("Thank you! Your review will appear after approval.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not submit review.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gold/20 bg-paper p-6">
      <h3 className="font-display text-2xl text-maroon">Share your experience</h3>
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
      <button type="submit" disabled={isLoading} className="mt-4 rounded-full bg-maroon px-6 py-3 font-body text-sm font-semibold uppercase tracking-wider text-ivory hover:bg-maroon-dark disabled:cursor-not-allowed disabled:opacity-60">
        {isLoading ? "Submitting..." : "Submit review"}
      </button>
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