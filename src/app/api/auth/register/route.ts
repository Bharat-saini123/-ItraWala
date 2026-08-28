import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendAuthConfirmationEmail, siteUrl } from "@/lib/email";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Enter a valid email and a password of at least 6 characters." },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email,
      password,
      options: {
        data: {
          full_name: String(body.fullName ?? "").trim(),
          phone: String(body.phone ?? "").trim(),
          city: String(body.city ?? "").trim(),
          state: String(body.state ?? "").trim(),
          pincode: String(body.pincode ?? "").trim(),
        },
        redirectTo: `${siteUrl}/login`,
      },
    });

    if (error || !data.properties?.action_link) {
      return NextResponse.json(
        { error: error?.message || "Unable to create your account." },
        { status: 400 },
      );
    }

    const confirmationLink = new URL(data.properties.action_link);
    confirmationLink.searchParams.set("redirect_to", `${siteUrl}/login`);

    await sendAuthConfirmationEmail(
      email,
      String(body.fullName ?? "Customer").trim(),
      confirmationLink.toString(),
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration email error:", error);
    return NextResponse.json(
      { error: "Unable to send the confirmation email. Please try again later." },
      { status: 500 },
    );
  }
}