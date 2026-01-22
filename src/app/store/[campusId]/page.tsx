"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import StoreLayoutHeader from "@/components/store/StoreLayoutHeader";
import StoreOverview from "@/components/store/StoreOverview";

interface Campus {
  id: string;
  name: string;
  users: [{ city: string }];
}

export default function StoreBerandaPage() {
  const params = useParams();
  const campusId = params.campusId;

  const [campus, setCampus] = useState<Campus>({
    id: "",
    name: "",
    users: [{ city: "" }],
  });

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalReviews: 0,
    averageRating: 0,
  });

  // Fetch campus and products data
  useEffect(() => {
    if (!campusId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/client/campus/${campusId}`);
        if (response.ok) {
          const data = await response.json();
          setCampus(data.campus);
          setStats((prev) => ({
            ...prev,
            totalProducts: data.products?.length || 0,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [campusId]);

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
      <Navbar />

      <div className="min-h-screen">
        <div className="container mx-auto px-5 py-5">
          <StoreLayoutHeader initialStats={stats} />

          {/* Tab Content: Beranda */}
          <StoreOverview campus={campus} stats={stats} />
        </div>
      </div>

      <Footer />
    </>
  );
}
