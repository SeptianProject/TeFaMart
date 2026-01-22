import Image from "next/image";
import React from "react";
import TitleLanding from "../ui/titleLanding";
import { Category } from "@/types";
import { CategoryGridSkeleton } from "../skeletons/CategoryCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryImageCarousel from "../ui/CategoryImageCarousel";

interface ProductCategoryProps {
  categories: Category[];
  isLoading?: boolean;
}

const ProductCategory: React.FC<ProductCategoryProps> = ({
  categories,
  isLoading = false,
}) => {
  const getCategoryImages = (category: Category): string[] => {
    const images: string[] = [];

    // Jika category punya products dengan imageUrl, gunakan itu
    if (category.products && category.products.length > 0) {
      const productImages = category.products
        .filter((product) => product.imageUrl)
        .map((product) => product.imageUrl as string);

      if (productImages.length > 0) {
        return productImages;
      }
    }

    // Fallback ke imageUrl kategori jika ada
    if (category.imageUrl) {
      images.push(category.imageUrl);
    }

    return images;
  };

  // Debug: log categories untuk cek data
  console.log(
    "Categories data:",
    categories.map((c) => ({
      name: c.name,
      productsCount: c.products?.length || 0,
      hasImages: c.products?.some((p) => p.imageUrl) || false,
      imageCount: getCategoryImages(c).length,
    })),
  );

  if (isLoading) {
    return (
      <section className="w-full flex flex-col gap-6 sm:gap-8 lg:gap-10">
        <TitleLanding name="Kategori Produk Populer" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-rows-2 lg:grid-cols-4 h-auto md:h-[calc(100vh-100px)] w-full">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`rounded-xl overflow-hidden h-48 sm:h-56 md:h-auto w-full
                ${
                  index === 0 || index === 5 ? "md:col-span-2" : "md:col-span-1"
                }`}>
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col gap-6 sm:gap-8 lg:gap-10">
      <TitleLanding name="Kategori Produk Populer" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-rows-2 lg:grid-cols-4 h-auto md:h-[calc(100vh-100px)] w-full transition-all duration-700">
        {categories.map((item, index) => {
          const categoryImages = getCategoryImages(item);

          return (
            <div
              key={item.id} // Best practice: gunakan id unik daripada index
              className={`relative rounded-xl overflow-hidden h-48 sm:h-56 md:h-auto w-full group cursor-pointer
                              ${
                                index === 0 || index === 5
                                  ? "md:col-span-2"
                                  : index === 1 ||
                                      index === 2 ||
                                      index === 3 ||
                                      index === 4
                                    ? "md:col-span-1"
                                    : ""
                              }`}>
              {/* Image Carousel Component */}
              <CategoryImageCarousel
                images={categoryImages}
                categoryName={item.name}
                priority={index < 2}
              />

              {/* Overlay dengan nama kategori */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex items-end p-3 sm:p-4 md:p-6 z-[2]">
                <div className="text-white">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
                    {item.name}
                  </h3>
                  {item._count && (
                    <p className="text-xs sm:text-sm text-gray-200">
                      {item._count.products} produk
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductCategory;
