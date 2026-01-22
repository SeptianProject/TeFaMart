"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import SidebarFilter from "@/components/ui/sidebarFilter";
import { ProductCard, ProductPagination } from "@/components/ui/productCard";
import { Product } from "@/types";
import { useParams } from "next/navigation";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import StoreLayoutHeader from "@/components/store/StoreLayoutHeader";

export default function StoreProductsPage() {
  const params = useParams();
  const campusId = params.campusId;

  const [wishlist, setWishlist] = useState<string[]>([]);
  const [openFilter, setOpenFilter] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
        throw Error("Failed to update wishlist");
      } else {
        setWishlist((prev) => {
          if (prev.includes(id)) {
            return prev.filter((itemId) => itemId !== id);
          } else {
            return [...prev, id];
          }
        });
      }
    } catch (error) {
      console.error("Error update wishlist product: ", error);
    }
  };

  // Fetch products data
  useEffect(() => {
    if (!campusId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (filterCategories.length > 0) {
          params.append("kategori", filterCategories.join(","));
        }
        if (filterTypes.length > 0) {
          params.append("jenis", filterTypes.join(","));
        }

        const response = await fetch(
          `/api/client/campus/${campusId}?${params.toString()}`,
        );
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterCategories, filterTypes, campusId]);

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch("/api/client/wishlist");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const ids = data.map(
              (item: { product: { id: string } }) => item.product.id,
            );
            setWishlist(ids);
          }
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    fetchWishlist();
  }, []);

  // Auto close filter saat scroll
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
          <StoreLayoutHeader
            initialStats={{
              totalProducts: products.length,
              totalReviews: 0,
              averageRating: 0,
            }}
          />

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
            {/* SIDEBAR DESKTOP */}
            <aside className="hidden lg:block">
              <SidebarFilter
                selectedCategories={filterCategories}
                selectedTypes={filterTypes}
                onCategoryChange={handleCategoryChange}
                onTypeChange={handleTypeChange}
                onReset={handleReset}
              />
            </aside>

            {/* MAIN */}
            <main ref={gridRef} className="space-y-4">
              {/* HEADER INFO */}
              <div className="flex items-center justify-between">
                <p className="text-[12px] text-gray-600">
                  Menampilkan {products.length} produk
                </p>

                {/* FILTER MOBILE */}
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full lg:hidden"
                  onClick={() => setOpenFilter(true)}>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M7 12h10M10 18h4"
                    />
                  </svg>
                </Button>

                {/* SORT DESKTOP */}
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
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
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
                <div className="flex min-h-100 items-center justify-center rounded-lg border border-gray-200 bg-background">
                  <div className="text-center">
                    <p className="text-gray-600">Tidak ada produk ditemukan</p>
                  </div>
                </div>
              )}

              {/* PAGINATION */}
              <ProductPagination />
            </main>
          </div>
        </div>
      </div>

      <Footer />

      {/* MOBILE FILTER */}
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
