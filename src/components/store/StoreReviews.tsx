"use client";

import React from "react";
import { Star } from "lucide-react";
import Image from "next/image";

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

interface StoreReviewsProps {
  reviews: Comment[];
  loading: boolean;
}

export default function StoreReviews({ reviews, loading }: StoreReviewsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-background rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-background rounded-lg border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Belum Ada Ulasan</h3>
          <p className="text-gray-600">
            Toko ini belum memiliki ulasan dari pembeli.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-background rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex gap-4">
            {/* User Avatar */}
            <div className="shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                {review.user.image ? (
                  <Image
                    src={review.user.image}
                    alt={review.user.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 font-semibold">
                    {review.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Review Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {review.user.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Product Name */}
              <a
                href={`/products/${review.product.slug}`}
                className="text-sm text-primary hover:underline mb-2 inline-block">
                Produk: {review.product.name}
              </a>

              {/* Review Text */}
              <p className="text-gray-700 mb-3 leading-relaxed">
                {review.content}
              </p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {review.images.map((image, index) => (
                    <div
                      key={index}
                      className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={image}
                        alt={`Review image ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
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
  );
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    </svg>
  );
}
