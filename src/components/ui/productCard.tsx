"use client";

import Image, { StaticImageData } from "next/image";
import { Wishlist } from "@/components/ui/wishlist";

export type Product = {
  id: number;
  title: string;
  category: string;
  price: string;
  image: string | StaticImageData;
};

type ProductCardProps = {
  product: Product;
  isWishlisted: boolean;
  isSidebar?: boolean;
  onToggleWishlist: (id: number) => void;
};

export function ProductCard({
  product,
  isSidebar,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border bg-white hover:shadow-md transition">
      {/* img */}
      <div
        className={`relative h-40 lg:h-50 ${isSidebar ? "h-50 lg:h-70" : ""} overflow-hidden`}>
        {/* wishlist */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-2 right-2 z-10 bg-white/90 rounded-full p-1.5 shadow">
          <Wishlist active={isWishlisted} />
        </button>

        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
        />

        {/* hover price (desktop) */}
        <div
          className="
            hidden lg:flex
            absolute bottom-0 left-0 right-0
            bg-blue-700/60 text-white
            text-sm font-semibold
            px-3 py-2
            translate-y-full opacity-0
            group-hover:translate-y-0
            group-hover:opacity-100
            transition-all duration-300
          ">
          {product.price}
        </div>
      </div>

      {/* content */}
      <div className="p-2 space-y-1">
        <h3 className="text-[13px] font-medium line-clamp-2">
          {product.title}
        </h3>

        {/* mobile price */}
        <p className="text-[13px] font-semibold lg:hidden">{product.price}</p>

        <p className="text-[11px] text-gray-500">{product.category}</p>
      </div>
    </div>
  );
}
