"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import StoreLayoutHeader from "@/components/store/StoreLayoutHeader";
import StoreReviews from "@/components/store/StoreReviews";

interface Comment {
  id: string;
  content: string;
  rating: number;
  images: string[];
  createdAt: string;
  user: {
    name: string;
    image: string | null;
  };
  product: {
    name: string;
    slug: string;
  };
}

export default function CommentsPage() {
  const params = useParams();
  const campusId = params.campusId;

  const [reviews, setReviews] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
  });

  // Fetch reviews data
  useEffect(() => {
    if (!campusId) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/client/campus/${campusId}/reviews`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.comments);
          setStats({
            totalReviews: data.stats.totalReviews,
            averageRating: data.stats.averageRating,
          });
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [campusId]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen">
        <div className="container mx-auto px-5 py-5">
          <StoreLayoutHeader
            initialStats={{
              totalProducts: 0,
              totalReviews: stats.totalReviews,
              averageRating: stats.averageRating,
            }}
          />

          {/* Tab Content: Ulasan */}
          <StoreReviews reviews={reviews} loading={loading} />
        </div>
      </div>

      <Footer />
    </>
  );
}
