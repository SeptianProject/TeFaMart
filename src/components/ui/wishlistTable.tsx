"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

type WishlistTableProps = {
  products: Product[];
};

export default function WishlistTable({ products }: WishlistTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl bg-background p-6 text-center text-sm text-gray-500 shadow">
        Belum ada produk
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-background shadow">
      {/* ===== DESKTOP TABLE ===== */}
      <div className="hidden lg:block">
        {/* Header */}
        <div className="grid grid-cols-[1fr_150px_120px_160px] border-b px-5 py-3 text-sm font-semibold">
          <div>Produk</div>
          <div>Harga</div>
          <div>Stok</div>
        </div>

        {/* Rows */}
        {products.map((product) => (
          <div
            key={product.id}
            className="grid grid-cols-[1fr_150px_120px_160px] items-center px-5 py-4 text-sm hover:bg-gray-50">
            {/* Product */}
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={product.imageUrl!}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-medium text-gray-800">{product.name}</span>
            </div>

            {/* Price */}
            <div>Rp {product.price.toLocaleString("id-ID")}</div>

            {/* Stock */}
            <div
              className={`font-medium ${
                product.isAvailable === "Tersedia"
                  ? "text-green-600"
                  : "text-red-500"
              }`}>
              {product.isAvailable}
            </div>

            {/* Action */}
            <Button
              size="sm"
              disabled={product.isAvailable !== "Tersedia"}
              className={
                product.isAvailable !== "Tersedia"
                  ? "cursor-not-allowed bg-gray-300"
                  : "bg-blue-600 hover:bg-blue-700"
              }>
              Beli Sekarang
            </Button>
          </div>
        ))}
      </div>

      {/* ===== MOBILE CARD ===== */}
      <div className="space-y-4 p-4 lg:hidden">
        {products.map((product) => (
          <div key={product.id} className="rounded-xl border p-4">
            <div className="flex gap-3">
              <div className="h-14 w-14 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={product.imageUrl!}
                  alt={product.name}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="font-medium text-gray-800">{product.name}</p>

                <p className="mt-1 text-sm text-gray-600">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>

                <p
                  className={`mt-1 text-sm font-medium ${
                    product.isAvailable === "Tersedia"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}>
                  {product.isAvailable}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              disabled={product.isAvailable !== "Tersedia"}
              className={`mt-3 w-full ${
                product.isAvailable !== "Tersedia"
                  ? "cursor-not-allowed bg-gray-300"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}>
              Beli Sekarang
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
