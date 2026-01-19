"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Wishlist } from "@/components/ui/wishlist";

{/* data dummy*/}
export type Product = {
  id: number;
  title: string;
  category: string;
  price: string;
  image: string;
};

type ProductCardProps = {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: number) => void;
};

{/* product */}
export function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border bg-white transition hover:shadow-md">
      {/* IMAGE */}
      <div className="relative h-[160px] lg:h-[200px] overflow-hidden">
        {/* wishlist */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 shadow"
        >
          <Wishlist active={isWishlisted} />
        </button>

        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
        />

        {/* harga hover (dekstoop) */}
        <div
          className="
            absolute bottom-0 left-0 right-0
            hidden translate-y-full bg-blue-700/70
            px-3 py-2 text-sm font-semibold text-white opacity-0
            transition-all duration-300
            group-hover:translate-y-0 group-hover:opacity-100
            lg:flex
          "
        >
          {product.price}
        </div>
      </div>

      {/* CONTENT */}
      <div className="space-y-1 p-2">
        <h3 className="line-clamp-2 text-[13px] font-medium">
          {product.title}
        </h3>

        {/* HARGA MOBILE */}
        <p className="text-[13px] font-semibold lg:hidden">{product.price}</p>

        <p className="text-[11px] text-gray-500">{product.category}</p>
      </div>
    </div>
  );
}

{/* pagination */ }
export function ProductPagination() {
  return (
    <div className="flex justify-center items-center gap-1 pt-6">
      <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
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
          className="h-9 w-9 p-0"
        >
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
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
}
