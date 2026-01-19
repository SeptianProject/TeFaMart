"use client";

import Navbar from "@/components/layout_client/Navbar";
import Footer from "@/components/layout_client/Footer";
import HeroSection from "@/components/sections/HeroSection";
import PopularProduct from "@/components/sections/PopularProduct";
import ProductCategory from "@/components/sections/ProductCategory";
import ProductAuction from "@/components/sections/ProductAuction";
import VocationalEducation from "@/components/sections/VocationalEducation";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api/products";
import { useEffect } from "react";

const HomePage = () => {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });

  useEffect(() => {
    console.log("Fetched products:", products);
  }, [products]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center w-full px-20 space-y-20 py-20">
        {/* hero section */}
        <HeroSection />

        {/* Popular Product */}
        <PopularProduct />

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
