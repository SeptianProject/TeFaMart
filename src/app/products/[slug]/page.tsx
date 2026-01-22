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
import { Home } from "lucide-react";
import Link from "next/link";
import ProductReviews from "@/components/product/ProductReviews";
import ProductRecommendations from "@/components/product/ProductRecommendations";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";

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
          {/* Dynamic Breadcrumb */}
          <DynamicBreadcrumb
            customLabels={{
              [slug]: product.name,
            }}
          />

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

          {/* Reviews Section */}
          <ProductReviews productSlug={slug} />

          {/* Product Recommendations */}
          <ProductRecommendations productSlug={slug} />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DetailProductPage;
