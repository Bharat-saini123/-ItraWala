import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

function getReviewPayload(body: any) {
  const rating = Number(body.rating);
  const comment = String(body.comment ?? "").trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Please choose a rating from 1 to 5.");
  }

  if (comment.length < 10 || comment.length > 500) {
    throw new Error("Review must be between 10 and 500 characters.");
  }

  return { rating, comment };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to leave a review." }, { status: 401 });
    }

    const existingReview = await prisma.review.findFirst({ where: { profileId: user.id } });
    if (existingReview) {
      return NextResponse.json({ error: "You already submitted a review. Please edit it instead." }, { status: 409 });
    }

    const body = await request.json();
    const { rating, comment } = getReviewPayload(body);
    const profile = await prisma.profile.findUnique({ where: { id: user.id } });

    const review = await prisma.review.create({
      data: {
        profileId: user.id,
        name: profile?.fullName?.trim() || user.email?.split("@")[0] || "Customer",
        rating,
        comment,
      },
    });

    return NextResponse.json({ success: true, reviewId: review.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not submit your review. Please try again.";
    const status = message.includes("rating") || message.includes("Review must") ? 400 : 500;
    console.error("Review submission error:", error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to update your review." }, { status: 401 });
    }

    const body = await request.json();
    const reviewId = String(body.reviewId ?? "").trim();
    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required." }, { status: 400 });
    }

    const { rating, comment } = getReviewPayload(body);
    const profile = await prisma.profile.findUnique({ where: { id: user.id } });

    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        profileId: user.id,
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found or you cannot edit it." }, { status: 404 });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        name: profile?.fullName?.trim() || user.email?.split("@")[0] || "Customer",
        rating,
        comment,
      },
    });

    return NextResponse.json({ success: true, reviewId: updatedReview.id }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update your review. Please try again.";
    const status = message.includes("rating") || message.includes("Review must") ? 400 : 500;
    console.error("Review update error:", error);
    return NextResponse.json({ error: message }, { status });
  }
}