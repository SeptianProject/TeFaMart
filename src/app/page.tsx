"use client";

import Navbar from "@/components/layout_client/Navbar";
import Footer from "@/components/layout_client/Footer";
import HeroSection from "@/components/sections/HeroSection";
import PopularProduct from "@/components/sections/PopularProduct";
import ProductCategory from "@/components/sections/ProductCategory";
import ProductAuction from "@/components/sections/ProductAuction";
import VocationalEducation from "@/components/sections/VocationalEducation";

const HomePage = () => {
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
