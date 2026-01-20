"use client";

import { Product } from "@/types";
import { Wishlist } from "@/components/ui/wishlist";
import { formatCurrency } from "@/helper/format-currency";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Package } from "lucide-react";

interface ProductInfoProps {
  product: Product;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  averageRating?: number;
  totalReviews?: number;
}

export function ProductInfo({
  product,
  isWishlisted = false,
  onToggleWishlist,
  averageRating = 0,
  totalReviews = 0,
}: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Category Badge */}
      {product.category && (
        <div>
          <Badge variant="secondary" className="text-xs">
            {product.category.name}
          </Badge>
        </div>
      )}

      {/* Title and Wishlist */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex-1">
          {product.name}
        </h1>
        <button
          onClick={onToggleWishlist}
          className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition"
          aria-label="Toggle wishlist">
          <Wishlist active={isWishlisted} />
        </button>
      </div>

      {/* Rating, Reviews, and Stock */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-900">
            {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
          </span>
          <span className="text-gray-500">
            ({totalReviews} {totalReviews === 1 ? "ulasan" : "ulasan"})
          </span>
        </div>

        <span className="text-gray-300">•</span>

        {/* Stock Status */}
        <div className="flex items-center gap-1">
          <Package className="w-4 h-4 text-gray-500" />
          <span
            className={`font-medium ${
              product.isAvailable === "Tersedia"
                ? "text-green-600"
                : "text-red-600"
            }`}>
            {product.isAvailable}
          </span>
        </div>

        {/* Campus Location */}
        {product.tefa?.campus && (
          <>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{product.tefa.campus.name}</span>
            </div>
          </>
        )}
      </div>

      {/* Price */}
      <div className="py-4 border-y border-gray-200">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl lg:text-4xl font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>
        </div>
      </div>

      {/* Sale Type Badge */}
      {product.saleType && (
        <div>
          <Badge
            variant={product.saleType === "auction" ? "destructive" : "default"}
            className="text-xs">
            {product.saleType === "auction" ? "🔨 Lelang" : "🛒 Pre Order"}
          </Badge>
        </div>
      )}
    </div>
  );
}
