"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Package, FileText, CheckCircle } from "lucide-react";
import { StatsSkeleton } from "@/components/Skeleton";

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
      icon: "GraduationCap",
      color: "blue",
    },
    {
      title: "Total Product",
      value: stats.totalProducts,
      icon: "Package",
      color: "green",
    },
    {
      title: "Permintaan Pending",
      value: stats.pendingRequests,
      icon: "FileText",
      color: "orange",
    },
    {
      title: "Permintaan Disetujui",
      value: stats.approvedRequests,
      icon: "CheckCircle",
      color: "purple",
    },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap":
        return GraduationCap;
      case "Package":
        return Package;
      case "FileText":
        return FileText;
      case "CheckCircle":
        return CheckCircle;
      default:
        return GraduationCap;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-primary/10 text-primary";
      case "green":
        return "bg-accent/10 text-accent";
      case "orange":
        return "bg-accent/20 text-accent";
      case "purple":
        return "bg-secondary/10 text-secondary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ringkasan statistik kampus Anda
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
                className="bg-card rounded-lg shadow-sm p-6 border border-border">
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
                    className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/admin/tefa"
            className="p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
            <GraduationCap className="text-primary mb-2" size={24} />
            <h3 className="font-medium text-foreground">Kelola TEFA</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Tambah atau edit TEFA jurusan
            </p>
          </a>
          <a
            href="/dashboard/admin/products"
            className="p-4 border border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-colors">
            <Package className="text-accent mb-2" size={24} />
            <h3 className="font-medium text-gray-900">Kelola Product</h3>
            <p className="text-sm text-gray-500 mt-1">
              Tambah atau edit product TEFA
            </p>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Aktivitas Terkini
        </h2>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Belum ada aktivitas terkini
          </p>
        </div>
      </div>
    </div>
  );
}
