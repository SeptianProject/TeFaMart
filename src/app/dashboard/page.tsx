"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "@/types";
import HomePage from "../page";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Redirect based on role
    switch (session.user?.role) {
      case Role.SUPER_ADMIN:
        router.push("/dashboard/super-admin");
        break;
      case Role.ADMIN:
        router.push("/dashboard/admin");
        break;
      case Role.CLIENT:
        router.push("/");
        break;
      default:
        router.push("/auth/login");
    }
  }, [session, status, router]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // If CLIENT role, show dashboard content
  if (session?.user?.role === Role.CLIENT) {
    return <HomePage />;
  }

  return null;
}
