"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/ui/productCard";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";

interface ProductRecommendationsProps {
  productSlug: string;
}

export default function ProductRecommendations({
  productSlug,
}: ProductRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/client/product/${productSlug}/recommendations`,
        );
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

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

    if (productSlug) {
      fetchRecommendations();
      fetchWishlist();
    }
  }, [productSlug]);

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
      if (res.ok) {
        setWishlist((prev) => {
          if (prev.includes(id)) {
            return prev.filter((itemId) => itemId !== id);
          } else {
            return [...prev, id];
          }
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Rekomendasi Produk Lainnya</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Don't show section if no recommendations
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Rekomendasi Produk Lainnya</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlist.includes(product.id)}
            onToggleWishlist={toggleWishlist}
          />
        ))}
      </div>
    </div>
  );
}
