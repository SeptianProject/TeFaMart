import React from "react";
import { Product, Category } from "@/types";
import { ProductCard } from "../ui/productCard";
import TitleLanding from "../ui/titleLanding";
import { ProductGridSkeleton } from "../skeletons/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

interface PopularProductProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  isLoading?: boolean;
}

const PopularProduct: React.FC<PopularProductProps> = ({
  products,
  categories,
  selectedCategory,
  onCategoryChange,
  isLoading = false,
}) => {
  // Hanya tampilkan 4 kategori populer sebagai button filter
  const displayedCategories = categories.slice(0, 4);

  // Limit products to 6 items
  const displayedProducts = products.slice(0, 6);

  return (
    <section className="w-full flex flex-col gap-6 sm:gap-8 lg:gap-10">
      {/* header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-6">
        <TitleLanding name="Produk Populer" />
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap max-w-full sm:max-w-none">
          {isLoading ? (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-full" />
              ))}
            </>
          ) : (
            displayedCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`border font-medium rounded-full px-3 sm:px-4 lg:px-5 h-8 sm:h-9 lg:h-10 text-xs sm:text-sm cursor-pointer transition duration-300 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-foreground text-background border-foreground"
                    : "border-foreground hover:bg-foreground hover:text-background"
                }`}>
                {category.name}
              </button>
            ))
          )}
        </div>
      </div>
      {/* Card products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
        {isLoading ? (
          <ProductGridSkeleton count={6} isSidebar />
        ) : displayedProducts.length === 0 ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-10 text-muted-foreground">
            Tidak ada produk dalam kategori ini
          </div>
        ) : (
          displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSidebar
              isWishlisted={false}
              showWishlist={true}
              onToggleWishlist={(id) => console.log("Toggle wishlist:", id)}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default PopularProduct;
