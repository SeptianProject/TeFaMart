"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Role } from "@/types";
import {
     LayoutDashboard,
     GraduationCap,
     Package,
     FileText,
     LogOut,
     Menu,
     X,
} from "lucide-react";

interface AdminLayoutProps {
     children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
     const { data: session, status } = useSession();
     const router = useRouter();
     const pathname = usePathname();
     const [sidebarOpen, setSidebarOpen] = useState(false);

     useEffect(() => {
          if (status === "loading") return;

          if (!session) {
               router.push("/auth/login");
               return;
          }

          if (session.user?.role !== Role.ADMIN) {
               router.push("/dashboard");
               return;
          }
     }, [session, status, router]);

     if (status === "loading" || !session || session.user?.role !== Role.ADMIN) {
          return (
               <div className="min-h-screen flex items-center justify-center">
                    <div className="text-lg">Memuat...</div>
               </div>
          );
     }

     const handleLogout = async () => {
          await signOut({ callbackUrl: "/auth/login" });
     };

     const menuItems = [
          {
               name: "Overview",
               href: "/dashboard/admin",
               icon: LayoutDashboard,
          },
          {
               name: "Kelola TEFA",
               href: "/dashboard/admin/tefa",
               icon: GraduationCap,
          },
          {
               name: "Kelola Product",
               href: "/dashboard/admin/products",
               icon: Package,
          },
          {
               name: "Kelola Permintaan",
               href: "/dashboard/admin/requests",
               icon: FileText,
          },
     ];

     return (
          <div className="lg:flex items-center min-h-screen bg-gray-50">
               {/* Mobile sidebar backdrop */}
               {sidebarOpen && (
                    <div
                         className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                         onClick={() => setSidebarOpen(false)}
                    />
               )}

               {/* Sidebar */}
               <aside
                    className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w- lg:h-screen ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                         }`}
               >
                    <div className="flex flex-col h-full">
                         {/* Logo */}
                         <div className="flex items-center justify-between h-16 px-6 border-b">
                              <h1 className="text-xl font-bold text-gray-900">Admin Kampus</h1>
                              <button
                                   onClick={() => setSidebarOpen(false)}
                                   className="lg:hidden text-gray-500 hover:text-gray-700"
                              >
                                   <X size={24} />
                              </button>
                         </div>

                         {/* Navigation */}
                         <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                              {menuItems.map((item) => {
                                   const Icon = item.icon;
                                   const isActive = pathname === item.href;

                                   return (
                                        <Link
                                             key={item.href}
                                             href={item.href}
                                             className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                                  ? "bg-blue-50 text-blue-700"
                                                  : "text-gray-700 hover:bg-gray-100"
                                                  }`}
                                             onClick={() => setSidebarOpen(false)}
                                        >
                                             <Icon size={20} className="mr-3" />
                                             {item.name}
                                        </Link>
                                   );
                              })}
                         </nav>

                         {/* User section */}
                         <div className="p-4 border-t">
                              <div className="flex items-center mb-3">
                                   <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                             {session.user?.name || "Admin"}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                             {session.user?.email}
                                        </p>
                                   </div>
                              </div>
                              <button
                                   onClick={handleLogout}
                                   className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                   <LogOut size={20} className="mr-3" />
                                   Logout
                              </button>
                         </div>
                    </div>
               </aside>

               {/* Main content */}
               <div className="flex-1">
                    {/* Mobile header */}
                    <header className="lg:hidden bg-white shadow-sm">
                         <div className="flex items-center justify-between h-16 px-4">
                              <button
                                   onClick={() => setSidebarOpen(true)}
                                   className="text-gray-500 hover:text-gray-700"
                              >
                                   <Menu size={24} />
                              </button>
                              <h1 className="text-lg font-semibold text-gray-900">
                                   Admin Dashboard
                              </h1>
                              <div className="w-6" /> {/* Spacer */}
                         </div>
                    </header>

                    {/* Page content */}
                    <main className="p-6 h-screen w-full">{children}</main>
               </div>
          </div>
     );
}
