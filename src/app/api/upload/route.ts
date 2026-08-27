import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "products";

// Build an admin Supabase client using the service-role key.
// This bypasses RLS so uploads always work once the bucket exists.
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    // ── 1. Auth check: only admins can upload ─────────────────────────────
    const cookieStore = await cookies();
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized – please log in" }, { status: 401 });
    }

    const { data: profile } = await supabaseAuth
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden – admins only" }, { status: 403 });
    }

    // ── 2. Parse file ─────────────────────────────────────────────────────
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 400 });
    }

    // ── 3. Upload using admin client (bypasses RLS) ───────────────────────
    const supabaseAdmin = getAdminClient();

    // Ensure bucket exists (creates it if missing — useful on first deploy)
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.id === BUCKET);
    if (!bucketExists) {
      const { error: createErr } = await supabaseAdmin.storage.createBucket(BUCKET, {
        public: true,
        allowedMimeTypes: ["image/*"],
        fileSizeLimit: 5 * 1024 * 1024,
      });
      if (createErr) {
        console.error("[upload] Could not create bucket:", createErr);
        return NextResponse.json(
          {
            error: `Storage bucket "${BUCKET}" not found and could not be created. Check your SUPABASE_SERVICE_ROLE_KEY in .env — it must be the secret service_role key, NOT the anon key.`,
          },
          { status: 500 }
        );
      }
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `products/${crypto.randomUUID()}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, arrayBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("[upload] Supabase upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    console.error("[upload] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
