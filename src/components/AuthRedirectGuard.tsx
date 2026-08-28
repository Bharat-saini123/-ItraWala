"use client";

import { useEffect } from "react";

const productionOrigin = process.env.NEXT_PUBLIC_SITE_URL!;

export function AuthRedirectGuard() {
  useEffect(() => {
    if (!window.location.hash.includes("access_token=")) return;
    if (window.location.origin === productionOrigin) return;

    window.location.replace(`${productionOrigin}/login${window.location.hash}`);
  }, []);

  return null;
}