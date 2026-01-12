"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Package, FileText, CheckCircle } from "lucide-react";

interface Stats {
     totalTefa: number;
     totalProducts: number;
     pendingRequests: number;
     approvedRequests: number;
}

export default function AdminOverviewPage() {
     const [stats, setStats] = useState<Stats>({
          totalTefa: 0,
          totalProducts: 0,
          pendingRequests: 0,
          approvedRequests: 0,
     });
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          fetchStats();
     }, []);

     const fetchStats = async () => {
          try {
               const response = await fetch("/api/admin/stats");
               if (response.ok) {
                    const data = await response.json();
                    setStats(data);
               }
          } catch (error) {
               console.error("Error fetching stats:", error);
          } finally {
               setLoading(false);
          }
     };

     const statCards = [
          {
               title: "Total TEFA",
               value: stats.totalTefa,
               icon: GraduationCap,
               color: "blue",
          },
          {
               title: "Total Product",
               value: stats.totalProducts,
               icon: Package,
               color: "green",
          },
          {
               title: "Permintaan Pending",
               value: stats.pendingRequests,
               icon: FileText,
               color: "orange",
          },
          {
               title: "Permintaan Disetujui",
               value: stats.approvedRequests,
               icon: CheckCircle,
               color: "purple",
          },
     ];

     return (
          <div className="space-y-6">
               <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="mt-1 text-sm text-gray-500">
                         Ringkasan statistik kampus Anda
                    </p>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => {
                         const Icon = stat.icon;
                         return (
                              <div
                                   key={stat.title}
                                   className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                              >
                                   <div className="flex items-center justify-between">
                                        <div>
                                             <p className="text-sm font-medium text-gray-600">
                                                  {stat.title}
                                             </p>
                                             <p className="mt-2 text-3xl font-semibold text-gray-900">
                                                  {loading ? "..." : stat.value}
                                             </p>
                                        </div>
                                        <div
                                             className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}
                                        >
                                             <Icon size={24} />
                                        </div>
                                   </div>
                              </div>
                         );
                    })}
               </div>

               {/* Quick Actions */}
               <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                         Aksi Cepat
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <a
                              href="/dashboard/admin/tefa"
                              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                         >
                              <GraduationCap className="text-blue-600 mb-2" size={24} />
                              <h3 className="font-medium text-gray-900">Kelola TEFA</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                   Tambah atau edit TEFA jurusan
                              </p>
                         </a>
                         <a
                              href="/dashboard/admin/products"
                              className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                         >
                              <Package className="text-green-600 mb-2" size={24} />
                              <h3 className="font-medium text-gray-900">Kelola Product</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                   Tambah atau edit product TEFA
                              </p>
                         </a>
                         <a
                              href="/dashboard/admin/requests"
                              className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                         >
                              <FileText className="text-orange-600 mb-2" size={24} />
                              <h3 className="font-medium text-gray-900">Kelola Permintaan</h3>
                              <p className="text-sm text-gray-500 mt-1">
                                   Review permintaan dari client
                              </p>
                         </a>
                    </div>
               </div>

               {/* Recent Activity */}
               <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                         Aktivitas Terkini
                    </h2>
                    <div className="space-y-4">
                         <p className="text-sm text-gray-500">Belum ada aktivitas terkini</p>
                    </div>
               </div>
          </div>
     );
}
