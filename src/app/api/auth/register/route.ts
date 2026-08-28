import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendAuthConfirmationEmail, siteUrl } from "@/lib/email";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/security";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(`register:${getClientIp(request)}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfter);

    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email) || password.length < 8 || password.length > 128) {
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
        redirectTo: `${siteUrl}/auth/confirmed`,
      },
    });

    if (error || !data.properties?.action_link) {
      return NextResponse.json(
        { error: "Unable to create your account. Please check your details and try again." },
        { status: 400 },
      );
    }

    const confirmationLink = new URL(data.properties.action_link);
    confirmationLink.searchParams.set("redirect_to", `${siteUrl}/auth/confirmed`);

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