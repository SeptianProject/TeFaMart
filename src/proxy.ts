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

    // Redirect admin/super-admin dari public routes ke dashboard mereka
    if (token && isPublicRoute && path !== "/") {
      const role = token.role as string;

      if (role === "SUPER_ADMIN") {
        return NextResponse.redirect(
          new URL("/dashboard/super-admin", req.url),
        );
      } else if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      }
      // USER biasa biarkan akses auth pages, akan di-redirect otomatis oleh NextAuth
    }

    // Redirect admin/super-admin dari homepage ke dashboard mereka
    if (token && path === "/") {
      const role = token.role as string;

      if (role === "SUPER_ADMIN") {
        return NextResponse.redirect(
          new URL("/dashboard/super-admin", req.url),
        );
      } else if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      }
      // USER biasa biarkan akses homepage
    }

    if (token) {
      const role = token.role as string;

      // Redirect non-super-admin dari halaman super-admin ke homepage atau dashboard mereka
      if (path.startsWith("/dashboard/super-admin") && role !== "SUPER_ADMIN") {
        return NextResponse.redirect(
          new URL(role === "ADMIN" ? "/dashboard/admin" : "/", req.url),
        );
      }

      // Redirect non-admin dari halaman admin ke homepage atau dashboard mereka
      if (path.startsWith("/dashboard/admin") && role !== "ADMIN") {
        return NextResponse.redirect(
          new URL(
            role === "SUPER_ADMIN" ? "/dashboard/super-admin" : "/",
            req.url,
          ),
        );
      }

      // Redirect USER dari /dashboard ke homepage
      if (path === "/dashboard" && role === "USER") {
        return NextResponse.redirect(new URL("/", req.url));
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
  },
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
