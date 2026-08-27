import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Please sign in to leave a review." }, { status: 401 });

    const body = await request.json();
    const rating = Number(body.rating);
    const comment = String(body.comment ?? "").trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Please choose a rating from 1 to 5." }, { status: 400 });
    }
    if (comment.length < 10 || comment.length > 500) {
      return NextResponse.json({ error: "Review must be between 10 and 500 characters." }, { status: 400 });
    }

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
    console.error("Review submission error:", error);
    return NextResponse.json({ error: "Could not submit your review. Please try again." }, { status: 500 });
  }
}