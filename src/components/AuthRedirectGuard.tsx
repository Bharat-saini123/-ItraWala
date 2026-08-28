"use client";

import { useEffect } from "react";

export function AuthRedirectGuard() {
  useEffect(() => {
    if (!window.location.hash.includes("access_token=")) return;
    if (window.location.pathname === "/auth/confirmed") return;

    window.location.replace(`/auth/confirmed${window.location.hash}`);
  }, []);

  return null;
}