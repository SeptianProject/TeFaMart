"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      // Belum login, redirect ke login page
      router.push("/auth/login");
    } else {
      // Sudah login, redirect berdasarkan role
      const role = session.user.role;

      if (role === "SUPER_ADMIN") {
        router.push("/dashboard/super-admin");
      } else if (role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [session, status, router]);

  // Loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}