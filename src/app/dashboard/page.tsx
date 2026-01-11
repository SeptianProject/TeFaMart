"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
     const { data: session, status } = useSession();
     const router = useRouter();

     if (status === "loading") {
          return (
               <div className="min-h-screen flex items-center justify-center">
                    <div className="text-lg">Memuat...</div>
               </div>
          );
     }

     if (!session) {
          router.push("/auth/login");
          return null;
     }

     const handleLogout = async () => {
          await signOut({ callbackUrl: "/auth/login" });
     };

     return (
          <div className="min-h-screen bg-gray-50">
               <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="flex justify-between h-16">
                              <div className="flex items-center">
                                   <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                              </div>
                              <div className="flex items-center">
                                   <button
                                        onClick={handleLogout}
                                        className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                   >
                                        Logout
                                   </button>
                              </div>
                         </div>
                    </div>
               </nav>

               <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                         <div className="bg-white shadow rounded-lg p-6">
                              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                   Selamat Datang!
                              </h2>
                              <div className="space-y-3">
                                   <p className="text-gray-700">
                                        <span className="font-semibold">Nama:</span>{" "}
                                        {session.user?.name || "Tidak ada"}
                                   </p>
                                   <p className="text-gray-700">
                                        <span className="font-semibold">Email:</span>{" "}
                                        {session.user?.email}
                                   </p>
                                   {session.user?.image && (
                                        <div>
                                             <span className="font-semibold">Foto:</span>
                                             <Image src={session.user.image} alt="Profile" width={80} height={80} className="mt-2 rounded-full" />
                                        </div>
                                   )}
                              </div>
                         </div>
                    </div>
               </main>
          </div>
     );
}

