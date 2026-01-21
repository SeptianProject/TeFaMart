"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import SidebarFilter from "@/components/ui/sidebarFilter";
import { ProductCard, ProductPagination } from "@/components/ui/productCard";
import { Product } from "@/types";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";

function ProductFilterContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");
  const categorySlug = searchParams.get("category");

  const [openFilter, setOpenFilter] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const handleCategoryChange = (id: string) => {
    setFilterCategories((prev) =>
      prev?.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const handleTypeChange = (type: string) => {
    setFilterTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type],
    );
  };

  const handleReset = () => {
    setFilterCategories([]);
    setFilterTypes([]);
  };
  const toggleWishlist = async (id: string) => {
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
        throw Error(`Failed get data product: ${response.message}`);
      } else {
        setWishlist((prev) => {
          if (prev.includes(id)) {
            // Kalau sudah ada, hapus (Unlike)
            return prev.filter((itemId) => itemId !== id);
          } else {
            // Kalau belum ada, tambah (Like)
            return [...prev, id];
          }
        });
      }
    } catch (error) {
      console.error("Error update wishlist product: ", error);
      throw new Error("Error update wishlist product!");
    }
  };

  useEffect(() => {
    const fetchDataProducts = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        // Add search query if exists
        if (searchQuery) {
          params.append("search", searchQuery);
        }

        // Add category slug if exists
        if (categorySlug) {
          params.append("categorySlug", categorySlug);
        }

        if (filterCategories!.length > 0) {
          params.append("kategori", filterCategories!.join(","));
        }
        if (filterTypes!.length > 0) {
          params.append("jenis", filterTypes!.join(","));
        }

        const products = await fetch(
          `/api/client/product?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const dataProducts = await products.json();
        if (Array.isArray(dataProducts)) {
          setProducts(dataProducts);
        } else {
          setProducts([]);
          console.error("Format data salah: ", dataProducts);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataProducts();
  }, [filterCategories, filterTypes, searchQuery, categorySlug]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch("/api/client/wishlist");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const ids = data.map((item: any) => item.product.id);
            setWishlist(ids);
          } else {
            setWishlist([]);
            console.error("Format data salah: ", data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchWishlist();
  }, []);

  useEffect(() => {
    if (!openFilter) return;

    const handleScroll = () => {
      if (!gridRef.current) return;
      const rect = gridRef.current.getBoundingClientRect();
      if (rect.top < -80) setOpenFilter(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [openFilter]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen">
        <div className="container mx-auto px-5 py-5">
          {/* header title page */}
          <div className="mb-4 flex items-center gap-2 text-[13px] text-gray-500">
            <span>Beranda</span>
            <span>›</span>
            <span className="font-medium text-black">Produk</span>
            {searchQuery && (
              <>
                <span>›</span>
                <span className="font-medium text-blue-600">
                  &quot;{searchQuery}&quot;
                </span>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
            {/* sidebar desktop */}
            <aside className="hidden lg:block">
              <SidebarFilter
                selectedCategories={filterCategories}
                selectedTypes={filterTypes}
                onCategoryChange={handleCategoryChange}
                onTypeChange={handleTypeChange}
                onReset={handleReset}
              />
            </aside>

            {/* main */}
            <main ref={gridRef} className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[12px] text-gray-600">
                  Menampilkan
                  <span className="font-semibold mx-1 text-black">
                    {products.length}
                  </span>
                  produk
                </p>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full lg:hidden"
                  onClick={() => setOpenFilter(true)}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M7 12h10M10 18h4"
                    />
                  </svg>
                </Button>

                <div className="hidden items-center gap-2 lg:flex">
                  <span className="text-sm font-medium">Urutkan</span>
                  <select className="rounded-lg border px-3 py-2 text-sm">
                    <option>Paling sesuai</option>
                    <option>Terbaru</option>
                    <option>Terpopuler</option>
                  </select>
                </div>
              </div>

              {/* GRID PRODUK */}
              {loading ? (
                <div className="grid grid-cols-3 gap-3">
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                  <ProductCardSkeleton />
                </div>
              )}
              <ProductPagination />
            </main>
          </div>
        </div>
      </div>

      <Footer />

      {/* mobile filter */}
      {openFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenFilter(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto">
            <SidebarFilter
              isMobile
              onClose={() => setOpenFilter(false)}
              selectedCategories={filterCategories}
              selectedTypes={filterTypes}
              onCategoryChange={handleCategoryChange}
              onTypeChange={handleTypeChange}
              onReset={handleReset}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default function ProductFilter() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        </div>
      }
    >
      <ProductFilterContent />
    </Suspense>
  );
}
