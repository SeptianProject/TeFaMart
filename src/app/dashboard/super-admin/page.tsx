"use client";

import { useEffect, useState } from "react";
import { Users, School, Activity } from "lucide-react";
import { StatsSkeleton } from "@/components/Skeleton";

interface Stats {
     totalUsers: number;
     totalCampus: number;
     totalAdmins: number;
     totalClients: number;
}

export default function SuperAdminOverviewPage() {
     const [stats, setStats] = useState<Stats>({
          totalUsers: 0,
          totalCampus: 0,
          totalAdmins: 0,
          totalClients: 0,
     });
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          fetchStats();
     }, []);

     const fetchStats = async () => {
          try {
               const response = await fetch("/api/super-admin/stats");
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
               title: "Total User",
               value: stats.totalUsers,
               icon: "Users",
               color: "primary",
          },
          {
               title: "Total Kampus",
               value: stats.totalCampus,
               icon: "School",
               color: "accent",
          },
          {
               title: "Admin Kampus",
               value: stats.totalAdmins,
               icon: "Activity",
               color: "primary",
          },
          {
               title: "Client",
               value: stats.totalClients,
               icon: "Users2",
               color: "secondary",
          },
     ];

     const getIcon = (iconName: string) => {
          switch (iconName) {
               case "Users":
                    return Users;
               case "School":
                    return School;
               case "Activity":
                    return Activity;
               case "Users2":
                    return Users;
               default:
                    return Users;
          }
     };

     const getColorClasses = (color: string) => {
          switch (color) {
               case "primary":
                    return "bg-primary/10 text-primary";
               case "secondary":
                    return "bg-secondary/10 text-secondary";
               case "accent":
                    return "bg-accent/10 text-accent";
               default:
                    return "bg-muted text-muted-foreground";
          }
     };

     return (
          <div className="space-y-6">
               <div>
                    <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                         Ringkasan statistik platform TefaMart
                    </p>
               </div>

               {/* Stats Grid */}
               {loading ? (
                    <StatsSkeleton count={4} />
               ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                         {statCards.map((stat) => {
                              const Icon = getIcon(stat.icon);
                              return (
                                   <div
                                        key={stat.title}
                                        className="bg-card rounded-lg shadow-sm p-6 border border-border"
                                   >
                                        <div className="flex items-center justify-between">
                                             <div>
                                                  <p className="text-sm font-medium text-muted-foreground">
                                                       {stat.title}
                                                  </p>
                                                  <p className="mt-2 text-3xl font-semibold text-foreground">
                                                       {stat.value}
                                                  </p>
                                             </div>
                                             <div
                                                  className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}
                                             >
                                                  <Icon size={24} />
                                             </div>
                                        </div>
                                   </div>
                              );
                         })}
                    </div>
               )}

               {/* Recent Activity */}
               <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                         Aktivitas Terkini
                    </h2>
                    <div className="space-y-4">
                         <p className="text-sm text-muted-foreground">Belum ada aktivitas terkini</p>
                    </div>
               </div>
          </div>
     );
}
