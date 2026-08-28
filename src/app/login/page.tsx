"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function redirectIfAuthenticated() {
      if (searchParams.get("confirmed") === "1") {
        await supabase.auth.signOut();
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!active || !data.session) return;

      router.replace(searchParams.get("next") ?? "/account");
      router.refresh();
    }

    redirectIfAuthenticated();
    return () => {
      active = false;
    };
  }, [router, searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(searchParams.get("next") ?? "/account");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-20 md:px-8">
      <p className="text-center font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
        Welcome Back
      </p>
      <h1 className="mt-2 text-center font-display text-3xl text-maroon">Sign In</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-1.5 w-full rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring"
          />
        </label>
        <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
          Password
          <input
            name="password"
            type="password"
            required
            className="mt-1.5 w-full rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring"
          />
        </label>

        {error && (
          <p className="rounded-lg bg-terracotta/10 px-4 py-2 font-body text-sm text-terracotta">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-maroon px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-ivory hover:bg-maroon-dark disabled:opacity-60"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-ink/60">
        New here?{" "}
        <Link href="/register" className="font-semibold text-maroon hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-5 py-20 text-center font-body text-sm text-ink/60 md:px-8">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
