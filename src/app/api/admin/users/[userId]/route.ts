import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    if (!profile || profile.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId } = params;
    const body = await request.json();

    const updatedUser = await prisma.profile.update({
      where: { id: userId },
      data: {
        fullName: body.fullName ?? undefined,
        phone: body.phone ?? undefined,
        role: body.role ?? undefined,
        address: body.address ?? undefined,
        city: body.city ?? undefined,
        state: body.state ?? undefined,
        pincode: body.pincode ?? undefined,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
