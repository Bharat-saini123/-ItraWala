import { NextRequest, NextResponse } from "next/server";

type RateLimitEntry = { count: number; resetAt: number };

const rateLimits = new Map<string, RateLimitEntry>();
let rateLimitChecks = 0;

export function getClientIp(request: NextRequest) {
  const forwardedIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (forwardedIp && forwardedIp.length <= 64 ? forwardedIp : null) ||
    request.headers.get("x-real-ip") ||
    "unknown";
}

export function hasJsonRequestLimitExceeded(request: NextRequest, maxBytes: number) {
  const contentLength = Number(request.headers.get("content-length"));
  return Number.isFinite(contentLength) && contentLength > maxBytes;
}

export function isJsonRequest(request: NextRequest) {
  return request.headers.get("content-type")?.toLowerCase().startsWith("application/json") ?? false;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  rateLimitChecks += 1;
  if (rateLimitChecks >= 1000) {
    rateLimitChecks = 0;
    for (const [entryKey, entry] of rateLimits) {
      if (entry.resetAt <= now) rateLimits.delete(entryKey);
    }
  }
  const current = rateLimits.get(key);

  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: Math.ceil(windowMs / 1000) };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return {
    allowed: true,
    retryAfter: Math.ceil((current.resetAt - now) / 1000),
  };
}

export function rateLimitResponse(retryAfter: number) {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "Cache-Control": "no-store",
      },
    },
  );
}

export function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (response.url.includes("/api/")) response.headers.set("Cache-Control", "no-store");
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  }
  response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.groq.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  return response;
}
