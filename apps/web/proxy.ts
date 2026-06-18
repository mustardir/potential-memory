import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "./lib/auth";

const protectedPaths = [
  "/dashboard",
  "/wallet",
  "/transactions",
  "/investments",
  "/profile",
  "/admin",
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const shouldProtect = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!shouldProtect) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session_token")?.value;
  const user = await getUserFromToken(token);

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/wallet",
    "/wallet/:path*",
    "/transactions",
    "/transactions/:path*",
    "/investments",
    "/investments/:path*",
    "/profile",
    "/profile/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
