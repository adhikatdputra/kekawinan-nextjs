// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (
    req.nextUrl.pathname.startsWith("/user") ||
    req.nextUrl.pathname.startsWith("/admin")
  ) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return res;
}

export const config = {
  matcher: ["/user/:path*", "/admin/:path*"],
};
