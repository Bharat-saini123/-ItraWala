"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      options: { data: { full_name: String(formData.get("name")) } },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center md:px-8">
        <h1 className="font-display text-2xl text-maroon">Check your email</h1>
        <p className="mt-3 font-body text-sm text-ink/65">
          We&apos;ve sent a confirmation link to finish setting up your account.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mt-6 rounded-full bg-maroon px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-ivory hover:bg-maroon-dark"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-20 md:px-8">
      <p className="text-center font-body text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">
        Join ItraWala
      </p>
      <h1 className="mt-2 text-center font-display text-3xl text-maroon">Create Account</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block font-body text-xs font-semibold uppercase tracking-wide text-ink/60">
          Full Name
          <input
            name="name"
            required
            className="mt-1.5 w-full rounded-lg border border-gold/30 bg-ivory px-3 py-2 font-body text-sm text-ink focus-ring"
          />
        </label>
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
            minLength={6}
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
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-ink/60">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-maroon hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
