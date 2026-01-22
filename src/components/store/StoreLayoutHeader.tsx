"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import DetailStore from "@/components/ui/detailStore";
import StoreTabs from "@/components/store/StoreTabs";

interface Campus {
  id: string;
  name: string;
  users: [{ city: string }];
}

interface StoreLayoutHeaderProps {
  initialStats?: {
    totalProducts: number;
    totalReviews: number;
    averageRating: number;
  };
}

export default function StoreLayoutHeader({
  initialStats,
}: StoreLayoutHeaderProps) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const campusId = params.campusId as string;

  const [campus, setCampus] = useState<Campus>({
    id: "",
    name: "",
    users: [{ city: "" }],
  });

  const [stats, setStats] = useState({
    totalProducts: initialStats?.totalProducts || 0,
    totalReviews: initialStats?.totalReviews || 0,
    averageRating: initialStats?.averageRating || 0,
  });

  // Determine active tab from pathname
  const getActiveTab = (): "beranda" | "produk" | "ulasan" => {
    if (pathname.includes("/products")) return "produk";
    if (pathname.includes("/comments")) return "ulasan";
    return "beranda";
  };

  const activeTab = getActiveTab();

  // Fetch campus data
  useEffect(() => {
    if (!campusId) return;

    const fetchCampusData = async () => {
      try {
        const response = await fetch(`/api/client/campus/${campusId}`);
        if (response.ok) {
          const data = await response.json();
          setCampus(data.campus);
          setStats({
            totalProducts: data.products?.length || 0,
            totalReviews: initialStats?.totalReviews || 0,
            averageRating: initialStats?.averageRating || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching campus data:", error);
      }
    };

    fetchCampusData();
  }, [campusId, initialStats]);

  // Fetch reviews stats
  useEffect(() => {
    if (!campusId) return;

    const fetchReviewsStats = async () => {
      try {
        const response = await fetch(`/api/client/campus/${campusId}/reviews`);
        if (response.ok) {
          const data = await response.json();
          setStats((prev) => ({
            ...prev,
            totalReviews: data.stats.totalReviews,
            averageRating: data.stats.averageRating,
          }));
        }
      } catch (error) {
        console.error("Error fetching reviews stats:", error);
      }
    };

    fetchReviewsStats();
  }, [campusId]);

  return (
    <>
      {/* Dynamic Breadcrumb */}
      <DynamicBreadcrumb
        customLabels={{
          [campusId]: campus.name || "Toko",
          products: "Produk",
          comments: "Ulasan",
        }}
      />

      {/* Store Detail */}
      <DetailStore
        name={campus.name}
        location={campus.users[0]?.city}
        rating={stats.averageRating}
        reviews={stats.totalReviews}
        sold={stats.totalProducts}
        logo="/assets/logo-nav-client.png"
      />

      {/* Store Tabs */}
      <StoreTabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          const routes = {
            beranda: `/store/${campusId}`,
            produk: `/store/${campusId}/products`,
            ulasan: `/store/${campusId}/comments`,
          };
          router.push(routes[tab]);
        }}
        reviewCount={stats.totalReviews}
        productCount={stats.totalProducts}
      />
    </>
  );
}
