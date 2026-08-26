"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-full border border-ink/20 px-5 py-2 font-body text-xs font-semibold uppercase tracking-wider text-ink/70 hover:bg-ink/5"
    >
      Sign Out
    </button>
  );
}
