"use client";

import Navbar from "@/components/layout_client/Navbar";
import Footer from "@/components/layout_client/Footer";
import HeroSection from "@/components/sections/HeroSection";
import PopularProduct from "@/components/sections/PopularProduct";
import ProductCategory from "@/components/sections/ProductCategory";
import ProductAuction from "@/components/sections/ProductAuction";
import VocationalEducation from "@/components/sections/VocationalEducation";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
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
      <div className="flex flex-col items-center w-full px-20 space-y-20 py-20">
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
        <ProductCategory />

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
