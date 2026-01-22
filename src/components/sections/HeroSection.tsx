"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Handbag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  tefa: {
    name: string;
    campus: {
      name: string;
    };
  };
}

interface HeroData {
  categoryProducts: Product[];
  categoryInfo: {
    id: string;
    name: string;
    slug: string;
  };
  featuredProduct: Product | null;
}

const HeroSection = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch hero products
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch("/api/client/products/hero");
        const result = await response.json();
        if (result.success) {
          setHeroData(result.data);
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (!heroData?.categoryProducts.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === heroData.categoryProducts.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroData?.categoryProducts.length]);

  const handlePrevious = () => {
    if (!heroData?.categoryProducts.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? heroData.categoryProducts.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    if (!heroData?.categoryProducts.length) return;
    setCurrentIndex((prev) =>
      prev === heroData.categoryProducts.length - 1 ? 0 : prev + 1,
    );
  };

  const currentProduct = heroData?.categoryProducts[currentIndex];
  const featuredProduct = heroData?.featuredProduct;

  if (isLoading) {
    return (
      <section className="flex flex-col lg:flex-row items-center gap-3 sm:gap-4 lg:gap-5 w-full h-auto lg:h-140">
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-full flex items-start rounded-lg overflow-hidden bg-muted animate-pulse"></div>
        <div className="w-full lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-full flex items-center rounded-lg overflow-hidden bg-muted animate-pulse"></div>
      </section>
    );
  }

  return (
    <section className="flex flex-col lg:flex-row items-center gap-3 sm:gap-4 lg:gap-5 w-full h-auto lg:h-140">
      {/* Left Card - Category Products Carousel */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-full flex items-start rounded-lg overflow-hidden group">
        <Image
          src={currentProduct?.imageUrl || "/assets/digital1.png"}
          alt={currentProduct?.name || "Hero Image"}
          width={1600}
          height={400}
          className="object-cover w-full h-full"
        />
        <div className="bg-foreground/40 size-full absolute transition duration-300"></div>
        <div className="absolute translate-x-0 transition duration-300 ease-in-out top-3 left-3 sm:top-4 sm:left-4 lg:top-5 lg:left-5">
          <div className="flex items-center gap-2 sm:gap-3 w-4/5 lg:w-3/4">
            <div className="size-10 sm:size-12 lg:size-15 bg-background/20 p-2 sm:p-2.5 lg:p-3 rounded-lg">
              <Handbag className="text-background size-full" />
            </div>
            <h3 className="text-background font-medium text-sm sm:text-base lg:text-xl w-full">
              Belanja dan dukung produk hasil pembelajaran vokasi.
            </h3>
          </div>
        </div>
        {/* card product */}
        {currentProduct && (
          <div className="translate-y-0 absolute w-full bottom-0 left-0 px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5 transition duration-300 ease-in-out">
            <div className="bg-linear-to-r to-foreground from-muted-foreground opacity-90 w-full h-20 sm:h-24 lg:h-28 rounded-xl flex items-center justify-between px-3 sm:px-4 lg:px-5">
              {/* product image */}
              <Link
                href={`/products/${currentProduct.slug}`}
                className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition">
                <div className="size-14 sm:size-16 lg:size-20 flex items-center rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={currentProduct.imageUrl || "/assets/digital2.png"}
                    alt={currentProduct.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-background text-xs sm:text-sm lg:text-base font-semibold truncate">
                    {currentProduct.name}
                  </h3>
                  <h4 className="text-background text-xs sm:text-xs lg:text-sm truncate">
                    {currentProduct.tefa.campus.name}
                  </h4>
                </div>
              </Link>
              {/* arrow */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button
                  onClick={handlePrevious}
                  className="rounded-full p-1 sm:p-1.5 lg:p-2 border-background/20 border flex items-center justify-center hover:border-background cursor-pointer transition"
                  aria-label="Previous product">
                  <ChevronLeft className="text-background w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>
                <div className="hidden sm:block">
                  <span className="text-background text-xs sm:text-sm">
                    {currentIndex + 1}/{heroData?.categoryProducts.length || 0}
                  </span>
                </div>
                <button
                  onClick={handleNext}
                  className="rounded-full p-1 sm:p-1.5 lg:p-2 border-background/20 border flex items-center justify-center hover:border-background cursor-pointer transition"
                  aria-label="Next product">
                  <ChevronRight className="text-background w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Card - Featured Product */}
      {featuredProduct && (
        <div className="w-full lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-full flex items-center rounded-lg overflow-hidden group relative">
          <Image
            src={featuredProduct.imageUrl || "/assets/digital2.png"}
            alt={featuredProduct.name}
            width={800}
            height={400}
            className="object-cover w-full h-full"
          />
          <div className="bg-foreground/40 size-full absolute transition duration-300"></div>
          <div className="absolute bottom-0 left-0 flex items-center justify-between w-full h-16 sm:h-18 lg:h-20 px-3 sm:px-4 lg:px-5 translate-y-0 bg-transparent transition ease-in-out duration-300">
            <div className="text-background w-1/2 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold truncate">
                {featuredProduct.name}
              </h3>
              <h4 className="text-xs sm:text-sm truncate">
                {featuredProduct.tefa.campus.name}
              </h4>
            </div>
            <Link href={`/products/${featuredProduct.slug}`}>
              <Button className="rounded-full px-4 sm:px-6 lg:px-10 text-xs sm:text-sm h-8 sm:h-9 lg:h-10">
                Lihat Detail
              </Button>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
