"use client";

import Navbar from "@/components/layout_client/Navbar";
import Footer from "@/components/layout_client/Footer";
import { Product } from "@/types";
import WishlistTable from "@/components/ui/wishlistTable";

/* data dummy */
const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Website Company Profile",
    price: 1500000,
    stock: 10,
    imageUrl: "/assets/logo/logo-poliwangi.png",
  },
  {
    id: "2",
    name: "Aplikasi Kasir UMKM",
    price: 2500000,
    stock: 0,
    imageUrl: "/assets/logo/logo-smea.png",
  },
  {
    id: "3",
    name: "Desain UI/UX Mobile App",
    price: 1200000,
    stock: 5,
    imageUrl: "/assets/logo/logo-polinema.png",
  },
  {
    id: "4",
    name: "Landing Page Produk",
    price: 800000,
    stock: 0,
    imageUrl: "/assets/logo/logo-pens.png",
  },
];

export default function WishlistPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-5 py-6">
          {/* breadcrumb */}
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <span>Beranda</span>
            <span>›</span>
            <span className="font-medium text-black">Wishlist</span>
          </div>

          <h1 className="mb-5 text-xl font-semibold lg:text-2xl">
            Wishlist
          </h1>

          {/* TABLE COMPONENT */}
          <WishlistTable products={dummyProducts} />
        </div>
      </div>

      <Footer />
    </>
  );
}