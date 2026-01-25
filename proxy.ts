import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const authToken = req.cookies.get("authToken"); // Get auth token from cookies

  const protectedRoutes = ["/dashboard", "/profile", "/settings"]; // Add all protected routes

  if (
    !authToken &&
    protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/auth/log-in", req.url)); // Redirect to home if not authenticated
  }

  return NextResponse.next(); // Allow access if authenticated
}

// Apply middleware only to these routes
export const config = {
  matcher: ["/dashboard", "/profile", "/settings"], // Update with all protected pages
};
