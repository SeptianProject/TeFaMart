"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";

interface ReviewsProps {
  productSlug: string;
}

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
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export default function ProductReviews({ productSlug }: ReviewsProps) {
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [stats, setStats] = React.useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/client/product/${productSlug}/comments`,
        );
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments);
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productSlug) {
      fetchComments();
    }
  }, [productSlug]);

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-lg bg-background p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Ulasan Pembeli</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border border-gray-200 rounded-lg bg-background p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Ulasan Pembeli</h2>
          {stats.totalReviews > 0 && (
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-lg">
                {stats.averageRating.toFixed(1)}
              </span>
              <span className="text-gray-500">
                ({stats.totalReviews} ulasan)
              </span>
            </div>
          )}
        </div>

        {comments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">
              Belum ada ulasan untuk produk ini
            </p>
            <p className="text-sm">Jadilah yang pertama memberikan ulasan!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex gap-4">
                  {/* User Avatar */}
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      {comment.user.image ? (
                        <Image
                          src={comment.user.image}
                          alt={comment.user.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 font-semibold text-lg">
                          {comment.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {comment.user.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= comment.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {comment.content}
                    </p>

                    {/* Review Images */}
                    {comment.images && comment.images.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {comment.images.map((image, index) => (
                          <div
                            key={index}
                            className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition"
                            onClick={() => setSelectedImage(image)}>
                            <Image
                              src={image}
                              alt={`Review image ${index + 1}`}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Image
              src={selectedImage}
              alt="Review image"
              width={800}
              height={800}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
