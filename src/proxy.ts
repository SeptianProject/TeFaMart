import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const isPublicRoute =
      path === "/" ||
      path.startsWith("/auth/login") ||
      path.startsWith("/auth/register") ||
      path === "/api/auth";

    if (token && isPublicRoute) {
      const role = token.role as string;

      if (role === "SUPER_ADMIN") {
        return NextResponse.redirect(
          new URL("/dashboard/super-admin", req.url)
        );
      } else if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    if (token) {
      const role = token.role as string;

      if (path.startsWith("/dashboard/super-admin") && role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      if (path.startsWith("/dashboard/admin") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        if (
          path === "/" ||
          path.startsWith("/auth/login") ||
          path.startsWith("/auth/register") ||
          path.startsWith("/api/auth")
        ) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
