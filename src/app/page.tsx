"use client";

import Navbar from "@/components/layout_client/Navbar";
import Footer from "@/components/layout_client/Footer";
import HeroSection from "@/components/sections/HeroSection";
import PopularProduct from "@/components/sections/PopularProduct";
import ProductCategory from "@/components/sections/ProductCategory";
import ProductAuction from "@/components/sections/ProductAuction";
import VocationalEducation from "@/components/sections/VocationalEducation";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { Product } from "@/types";
import { fetchProducts } from "@/services/productService";
import { fetchCategories } from "@/services/categoryService";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  // Auto-select first category with products on mount
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      const firstCategoryWithProducts = categories.find(
        (cat) => cat._count && cat._count.products > 0,
      );
      if (firstCategoryWithProducts) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedCategory(firstCategoryWithProducts.id);
      }
    }
  }, [categories, selectedCategory]);

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter(
      (product) => product.categoryId === selectedCategory,
    );
  }, [products, selectedCategory]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-25 space-y-10 sm:space-y-12 md:space-y-16 lg:space-y-20 py-6 sm:py-8 md:py-10 lg:py-15">
        {/* hero section */}
        <HeroSection />

        {/* Popular Product */}
        <PopularProduct
          products={filteredProducts}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Product Category */}
        <ProductCategory categories={categories} />

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
