"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchProductBySlug } from "@/services/productService";
import { Product } from "@/types";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductActions } from "@/components/product/ProductActions";
import { StoreInfo } from "@/components/product/StoreInfo";
import { ProductTabs } from "@/components/product/ProductTabs";
import { ProductDetailSkeleton } from "@/components/skeletons/ProductDetailSkeleton";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

const DetailProductPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="bg-background min-h-screen">
          <div className="container mx-auto px-4 py-6">
            <ProductDetailSkeleton />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Produk Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-6">
            Maaf, produk yang Anda cari tidak tersedia atau sudah dihapus.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition">
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const productImages = product.imageUrl ? [product.imageUrl] : [];

  return (
    <>
      <Navbar />

      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6 overflow-x-auto whitespace-nowrap">
            <Link
              href="/"
              className="text-gray-600 hover:text-primary transition">
              Beranda
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-primary font-medium truncate">
              {product.name}
            </span>
          </nav>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Left: Image Gallery */}
            <div className="lg:col-span-5">
              <ProductImageGallery
                images={productImages}
                productName={product.name}
              />
            </div>

            {/* Middle: Product Info */}
            <div className="lg:col-span-4">
              <ProductInfo product={product} />
            </div>

            {/* Right: Actions */}
            <div className="lg:col-span-3">
              <ProductActions product={product} />
            </div>
          </div>

          {/* Store Information */}
          <div className="mb-8">
            <StoreInfo product={product} />
          </div>

          {/* Product Details Tabs */}
          <div className="mb-8">
            <ProductTabs product={product} />
          </div>

          {/* Reviews Section - Placeholder */}
          <div className="border border-gray-200 rounded-lg bg-white p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Ulasan Pembeli</h2>
            <div className="text-center py-12 text-gray-500">
              <p>Belum ada ulasan untuk produk ini</p>
              <p className="text-sm mt-2">
                Jadilah yang pertama memberikan ulasan!
              </p>
            </div>
          </div>

          {/* Product Recommendations - Placeholder */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              Rekomendasi Produk Lainnya
            </h2>
            <div className="text-center py-12 border border-gray-200 rounded-lg bg-white text-gray-500">
              <p>Produk rekomendasi akan ditampilkan di sini</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DetailProductPage;
