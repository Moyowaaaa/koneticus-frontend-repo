import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_ROUTES = ["/auth/log-in", "/auth/sign-up"];

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("authToken")?.value;
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(authToken ? "/dashboard" : "/auth/log-in", req.url),
    );
  }

  const isProtected = PROTECTED_PREFIXES.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected && !authToken) {
    const loginUrl = new URL("/auth/log-in", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/log-in", "/auth/sign-up"],
};
