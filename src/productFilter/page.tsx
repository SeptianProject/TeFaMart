"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout_client/Navbar";
import Footer from "@/components/layout_client/Footer";
import { Button } from "@/components/ui/button";
import { ProductCard, Product } from "@/components/ui/productCard";
import SidebarFilter from "@/components/ui/sidebarFilter";

{/* data dummy*/}
const products: Product[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  title: "Website Profil Perusahaan",
  category: "Politeknik Negeri Banyuwangi",
  price: "Rp 1.500.000",
  image: "/img-card1.png",
}));

export default function ProductFilter() {
  const [openFilter, setOpenFilter] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

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
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
            {/* sidebar desktop */}
            <aside className="hidden lg:block">
              <SidebarFilter />
            </aside>

            {/* main */}
            <main ref={gridRef} className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[12px] text-gray-600">
                  Menampilkan 1–20 produk dari{" "}
                  <span className="font-semibold text-black">Website</span>
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

              {/* grid produk */}
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

              {/* pagination */}
              <div className="flex justify-center gap-1 pt-4">
                <Button variant="ghost" size="sm">‹</Button>
                {[1, 2, 3, 4, 5].map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={p === 1 ? "default" : "outline"}
                  >
                    {p}
                  </Button>
                ))}
                <Button variant="ghost" size="sm">›</Button>
              </div>
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
            />
          </div>
        </div>
      )}
    </>
  );
}