"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmedPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function clearConfirmedSession() {
      await supabase.auth.signOut();
      if (active) router.replace("/login?confirmed=1");
    }

    clearConfirmedSession();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center font-body text-sm text-ink/65 md:px-8">
      Confirming your email...
    </div>
  );
}