import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const getText = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" ? value : "";
    };
    const fullName = getText("fullName");
    const phone = getText("phone");
    const address = getText("address");
    const city = getText("city");
    const state = getText("state");
    const pincode = getText("pincode");

    if ([fullName, phone, address, city, state, pincode].some((value) => value.length > 500)) {
      return NextResponse.json({ message: "Profile fields are too long" }, { status: 400 });
    }

    // Validate required fields
    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { message: "Full name is required" },
        { status: 400 }
      );
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: user.id },
      data: {
        fullName: fullName.trim(),
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        pincode: pincode?.trim() || null,
      },
      include: {
        orders: {
          select: { id: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
