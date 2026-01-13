"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "@/types";

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
                    // CLIENT stays on /dashboard
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
                         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                         <p className="mt-4 text-gray-600">Memuat dashboard...</p>
                    </div>
               </div>
          );
     }

     // If CLIENT role, show dashboard content
     if (session?.user?.role === Role.CLIENT) {
          return (
               <div className="space-y-6">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                         <p className="mt-1 text-sm text-gray-500">
                              Selamat datang, {session.user.name || session.user.email}
                         </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                         <h2 className="text-lg font-semibold text-gray-900 mb-4">
                              Fitur Client
                         </h2>
                         <p className="text-gray-600">
                              Dashboard untuk user client akan ditambahkan di sini.
                         </p>
                    </div>
               </div>
          );
     }

     return null;
}