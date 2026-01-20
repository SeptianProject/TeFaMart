import Image from "next/image";
import React from "react";
import TitleLanding from "../ui/titleLanding";
import { Category } from "@/types";

interface ProductCategoryProps {
  categories: Category[];
}

const ProductCategory: React.FC<ProductCategoryProps> = ({ categories }) => {
  const getCategoryImage = (category: Category): string => {
    if (category.products && category.products.length > 0) {
      const productWithImage = category.products.find(
        (product) => product.imageUrl,
      );
      return productWithImage?.imageUrl || "/assets/placeholder.jpg";
    }
    return "/assets/placeholder.jpg";
  };

  // Debug: log categories untuk cek data
  console.log(
    "Categories data:",
    categories.map((c) => ({
      name: c.name,
      productsCount: c.products?.length || 0,
      hasImages: c.products?.some((p) => p.imageUrl) || false,
    })),
  );

  return (
    <section className="w-full flex flex-col gap-10">
      <TitleLanding name="Kategori Produk Populer" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-rows-2 lg:grid-cols-4 md:h-[calc(100vh-100px)] w-full transition-all duration-700">
        {categories.map((item, index) => {
          const categoryImage = getCategoryImage(item);

          return (
            <div
              key={item.id} // Best practice: gunakan id unik daripada index
              className={`relative rounded-xl overflow-hidden h-64 md:h-auto w-full group cursor-pointer
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
              <Image
                className="absolute inset-0 w-full h-full object-cover border transition-transform duration-300 group-hover:scale-105"
                width={1200}
                height={400}
                src={categoryImage}
                alt={item.name}
                priority={index < 2} // Load first 2 images with priority
              />
              {/* Overlay dengan nama kategori */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-1">{item.name}</h3>
                  {item._count && (
                    <p className="text-sm text-gray-200">
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
