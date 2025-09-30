import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login", "/signup"];


  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }


  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("token");
      return res;
    }


    if (publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
   runtime: "nodejs", 
};
