import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Jika user sudah login dan mencoba akses halaman auth, redirect ke home
    if (token && path.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Check role-based access untuk dashboard
    if (path.startsWith("/dashboard")) {
      const role = token?.role as string;

      // Redirect /dashboard ke dashboard sesuai role
      if (path === "/dashboard") {
        if (role === "SUPER_ADMIN") {
          return NextResponse.redirect(
            new URL("/dashboard/super-admin", req.url),
          );
        } else if (role === "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard/admin", req.url));
        } else {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }

      if (path.startsWith("/dashboard/super-admin") && role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      if (
        path.startsWith("/dashboard/admin") &&
        role !== "ADMIN" &&
        role !== "SUPER_ADMIN"
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Path yang memerlukan autentikasi
        const protectedPaths = ["/wishlist", "/profile", "/dashboard"];

        const isProtectedPath = protectedPaths.some(
          (protectedPath) =>
            path === protectedPath || path.startsWith(protectedPath + "/"),
        );

        // Jika path protected dan tidak ada token, redirect ke auth
        if (isProtectedPath && !token) {
          return false;
        }

        // Semua path lainnya diizinkan
        return true;
      },
    },
    pages: {
      signIn: "/auth", // Redirect ke halaman role selection saat belum login
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|assets).*)",
  ],
};
