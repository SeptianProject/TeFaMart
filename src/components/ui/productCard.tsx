"use client";

import { Button } from "@/components/ui/button";
import { Wishlist } from "@/components/ui/wishlist";
import { Product } from "@/types";
import Link from "next/link";
import { formatCurrency } from "@/helper/format-currency";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

type ProductCardProps = {
  product: Product;
  isWishlisted?: boolean;
  isSidebar?: boolean;
  showWishlist?: boolean;
  onToggleWishlist?: (productId: string) => void;
};

/**
 * ProductCard Component - Reusable product card untuk display product
 *
 * @param product - Product data dari database
 * @param isWishlisted - Status wishlist untuk icon
 * @param isSidebar - Variant untuk sidebar (lebih tinggi image)
 * @param showWishlist - Toggle untuk show/hide wishlist button
 * @param onToggleWishlist - Callback untuk toggle wishlist
 */
export function ProductCard({
  product,
  isSidebar = false,
  isWishlisted = false,
  showWishlist = true,
  onToggleWishlist,
}: ProductCardProps) {
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-lg border bg-white transition hover:shadow-md block">
      {/* IMAGE */}
      <div
        className={`relative overflow-hidden ${
          isSidebar ? "h-50 lg:h-70" : "h-40 lg:h-50"
        }`}>
        {/* Wishlist Button */}
        {showWishlist && (
          <button
            onClick={handleWishlistClick}
            className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 shadow hover:bg-white transition">
            <Wishlist active={isWishlisted} />
          </button>
        )}

        {/* Product Image */}
        <OptimizedImage
          src={product.imageUrl || "/assets/placeholder-product.png"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Price Overlay (Desktop) */}
        <div
          className="
            absolute bottom-0 left-0 right-0
            hidden translate-y-full bg-blue-700/70
            px-3 py-2 text-sm font-semibold text-white opacity-0
            transition-all duration-300
            group-hover:translate-y-0 group-hover:opacity-100
            lg:flex
          ">
          {formatCurrency(product.price)}
        </div>

        {/* Availability Badge */}
        {product.isAvailable === "Tidak Tersedia" && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            Tidak Tersedia
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="space-y-1 p-2">
        {/* Product Name */}
        <h3 className="line-clamp-2 text-[13px] font-medium min-h-[2.6em]">
          {product.name}
        </h3>

        {/* Price Mobile */}
        <p className="text-[13px] font-semibold lg:hidden">
          {formatCurrency(product.price)}
        </p>

        {/* Category & Campus Info */}
        <div className="flex flex-col gap-0.5">
          {product.category && (
            <p className="text-[11px] text-gray-500">{product.category.name}</p>
          )}
          {product.tefa?.campus && (
            <p className="text-[10px] text-gray-400 line-clamp-1">
              {product.tefa.campus.name}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

{
  /* pagination */
}
export function ProductPagination() {
  return (
    <div className="flex justify-center items-center gap-1 pt-6">
      <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Button>

      {[1, 2, 3, 4, 5].map((p) => (
        <Button
          key={p}
          size="sm"
          variant={p === 1 ? "default" : "outline"}
          className="h-9 w-9 p-0">
          {p}
        </Button>
      ))}

      {/* next */}
      <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
}
