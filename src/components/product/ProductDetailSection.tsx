"use client";

import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  GraduationCap,
  MapPin,
  MessageCircle,
  Star,
  FileText,
  ScrollText,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

interface ProductDetailSectionProps {
  product: Product;
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
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export function ProductDetailSection({
  product,
  productSlug,
}: ProductDetailSectionProps) {
  const [activeTab, setActiveTab] = useState<
    "store" | "detail" | "spec"  | "reviews"
  >("store");
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Load reviews when reviews tab is active
  React.useEffect(() => {
    if (activeTab === "reviews" && loading) {
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

      fetchComments();
    }
  }, [activeTab, productSlug, loading]);

  const tabs = [
    { id: "store" as const, label: "Toko", icon: Building2 },
    { id: "detail" as const, label: "Detail Produk", icon: FileText },
    { id: "spec" as const, label: "Spesifikasi", icon: ScrollText },
    { id: "reviews" as const, label: "Ulasan", icon: Star },
  ];

  const handleChatWhatsApp = () => {
    const whatsappNumber =
      product.tefa?.campus?.whatsappNumber || product.tefa?.campus?.phoneNumber;

    if (!whatsappNumber) {
      alert("Nomor WhatsApp tidak tersedia");
      return;
    }

    const phoneNumber = whatsappNumber.replace(/[^0-9]/g, "");
    const message = `Halo, saya ingin bertanya tentang *${product.name}*`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-background overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}>
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.id === "reviews" && stats.totalReviews > 0 && (
                <span className="ml-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {stats.totalReviews}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Store Information */}
        {activeTab === "store" && product.tefa && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                {/* Store Logo/Avatar */}
                <div className="shrink-0">
                  {product.tefa.campus?.logo ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={product.tefa.campus.logo}
                        alt={product.tefa.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center border border-gray-200">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                  )}
                </div>

                {/* Store Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-xl text-gray-900">
                      {product.tefa.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      <Building2 className="w-3 h-3 mr-1" />
                      TEFA
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4" />
                      <span className="font-medium">{product.tefa.major}</span>
                    </div>
                    {product.tefa.campus && (
                      <>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{product.tefa.campus.name}</span>
                        </div>
                        {product.tefa.campus.city && (
                          <div className="text-sm text-gray-500">
                            {product.tefa.campus.city}
                            {product.tefa.campus.province &&
                              `, ${product.tefa.campus.province}`}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Store Description */}
            {product.tefa.description && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-gray-900 mb-2">
                  Tentang Toko
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.tefa.description}
                </p>
              </div>
            )}

            {/* Campus Info if available */}
            {product.tefa.campus?.description && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-gray-900 mb-2">
                  Tentang {product.tefa.campus.name}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.tefa.campus.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/store/${product.tefa.campusId}`}>
                  <Building2 className="w-4 h-4 mr-2" />
                  Kunjungi Toko
                </Link>
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleChatWhatsApp}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat Toko
              </Button>
            </div>

            {/* Rating Summary in Store Tab */}
            {stats.totalReviews > 0 && (
              <div className="bg-primary/5 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold text-gray-900">
                        {stats.averageRating.toFixed(1)}
                      </span>
                      <span className="text-gray-500">/ 5.0</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {stats.totalReviews} penilaian pembeli
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("reviews")}>
                    Lihat Semua Ulasan
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Product Description */}
        {activeTab === "detail" && (
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-4">Deskripsi Produk</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {product.description || "Tidak ada deskripsi untuk produk ini."}
            </p>
          </div>
        )}

        {/* Specifications */}
        {activeTab === "spec" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Spesifikasi</h3>
            <div className="space-y-3">
              <div className="flex py-3 border-b border-gray-100">
                <span className="w-1/3 text-gray-600">Kategori</span>
                <span className="w-2/3 font-medium">
                  {product.category?.name || "-"}
                </span>
              </div>
              <div className="flex py-3 border-b border-gray-100">
                <span className="w-1/3 text-gray-600">Tipe Penjualan</span>
                <span className="w-2/3 font-medium">
                  {product.saleType === "auction"
                    ? "Lelang"
                    : product.saleType === "direct"
                      ? "Direct Order"
                      : "Pre Order"}
                </span>
              </div>
              <div className="flex py-3 border-b border-gray-100">
                <span className="w-1/3 text-gray-600">Status</span>
                <span className="w-2/3 font-medium">{product.isAvailable}</span>
              </div>
              <div className="flex py-3 border-b border-gray-100">
                <span className="w-1/3 text-gray-600">Jurusan</span>
                <span className="w-2/3 font-medium">
                  {product.tefa?.major || "-"}
                </span>
              </div>
              <div className="flex py-3 border-b border-gray-100">
                <span className="w-1/3 text-gray-600">Harga</span>
                <span className="w-2/3 font-bold text-primary">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(product.price)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <div>
            {/* Rating Summary */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Penilaian Pembeli</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Overall Rating */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 mb-1">
                      {stats.averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(stats.averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      {stats.totalReviews} Ulasan
                    </p>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count =
                      stats.ratingDistribution?.[
                        rating as keyof typeof stats.ratingDistribution
                      ] || 0;
                    const percentage =
                      stats.totalReviews > 0
                        ? (count / stats.totalReviews) * 100
                        : 0;
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <div className="flex items-center gap-1 w-12">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{rating}</span>
                        </div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          ({count})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {loading ? (
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
            ) : comments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">
                  Belum ada ulasan untuk produk ini
                </p>
                <p className="text-sm">
                  Jadilah yang pertama memberikan ulasan!
                </p>
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
    </div>
  );
}
