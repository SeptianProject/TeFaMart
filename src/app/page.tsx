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
import { useSession } from "next-auth/react";
import { Product, Category } from "@/types";
import { fetchPopularProducts } from "@/services/productService";
import { fetchPopularCategories } from "@/services/categoryService";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { data: session } = useSession();

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

  // Fetch wishlist data
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!session) {
        setWishlist([]);
        return;
      }

      try {
        const response = await fetch("/api/client/wishlist");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const ids = data.map(
              (item: { productId: string }) => item.productId,
            );
            setWishlist(ids);
          } else {
            setWishlist([]);
          }
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    fetchWishlist();
  }, [session]);

  // Toggle wishlist function
  const toggleWishlist = async (id: string) => {
    if (!session) {
      alert("Silakan login terlebih dahulu untuk menambahkan ke wishlist");
      return;
    }

    try {
      const res = await fetch("/api/client/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
        }),
      });

      if (!res.ok) {
        const response = await res.json();
        throw Error(`Failed to update wishlist: ${response.message}`);
      }

      setWishlist((prev) => {
        if (prev.includes(id)) {
          return prev.filter((itemId) => itemId !== id);
        } else {
          return [...prev, id];
        }
      });
    } catch (error) {
      console.error("Error update wishlist product: ", error);
      alert("Gagal mengupdate wishlist, silakan coba lagi");
    }
  };

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
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
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
