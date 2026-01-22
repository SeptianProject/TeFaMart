"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import PopularProduct from "@/components/sections/PopularProduct";
import ProductCategory from "@/components/sections/ProductCategory";
import ProductAuction from "@/components/sections/ProductAuction";
import VocationalEducation from "@/components/sections/VocationalEducation";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Product, Category } from "@/types";
import { fetchPopularProducts } from "@/services/productService";
import { fetchPopularCategories } from "@/services/categoryService";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Fetch popular categories (maksimal 6)
  const { data: popularCategories = [], isLoading: isLoadingCategories } =
    useQuery<Category[]>({
      queryKey: ["popularCategories"],
      queryFn: () => fetchPopularCategories(),
    });

  // Fetch popular products berdasarkan selected category
  const {
    data: popularProducts = [],
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
  } = useQuery<Product[]>({
    queryKey: ["popularProducts", selectedCategory],
    queryFn: () => fetchPopularProducts(selectedCategory || undefined),
    enabled: !!selectedCategory, // Only fetch when category is selected
    placeholderData: (previousData) => previousData, // Keep old data while fetching new data
  });

  // Auto-select first popular category on mount
  useEffect(() => {
    if (!selectedCategory && popularCategories.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCategory(popularCategories[0].id);
    }
  }, [popularCategories, selectedCategory]);

  return (
    <>
      <Navbar />
      <div className="transition flex flex-col items-center w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-25 space-y-10 sm:space-y-12 md:space-y-16 lg:space-y-20 py-6 sm:py-8 md:py-10 lg:py-15">
        {/* hero section */}
        <HeroSection />

        {/* Popular Product - menggunakan popular categories dan products */}
        <PopularProduct
          products={popularProducts}
          categories={popularCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          isLoadingCategories={isLoadingCategories}
          isFetchingProducts={isFetchingProducts}
        />

        {/* Product Category - menggunakan semua popular categories (max 6) */}
        <ProductCategory
          categories={popularCategories}
          isLoading={isLoadingCategories}
        />

        {/* Product Auction */}
        <ProductAuction />
      </div>
      {/* Vocational Education */}
      <VocationalEducation />
      <Footer />
    </>
  );
};

export default HomePage;
