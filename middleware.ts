// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // protect /dashboard and /profile routes
  const protectedPaths = ["/dashboard", "/profile"];
  if (!protectedPaths.some(p => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Optionally: you can verify token signature using 'jose' (edge-compatible)
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"]
};
