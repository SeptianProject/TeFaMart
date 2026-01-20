"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageCircle, Gavel } from "lucide-react";
import { Product } from "@/types";
import { useState } from "react";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);

  const handleBuy = async () => {
    if (product.isAvailable !== "Tersedia") {
      alert("Produk tidak tersedia");
      return;
    }

    try {
      const response = await fetch(`/api/client/product/${product.slug}/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity,
          notes: "",
        }),
      });

      const data = await response.json();

      if (response.ok && data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank");
      } else {
        alert(data.error || "Gagal memproses pembelian");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan");
    }
  };

  const handleAuction = () => {
    // Redirect to auction page or open modal
    alert("Fitur lelang akan segera hadir");
  };

  const isAvailable = product.isAvailable === "Tersedia";

  return (
    <div className="sticky top-4 space-y-4 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
      <h3 className="font-semibold text-lg">Atur Jumlah</h3>

      {/* Quantity Selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Jumlah:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={!isAvailable}
            className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            disabled={!isAvailable}
            className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none disabled:opacity-50"
            min="1"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            disabled={!isAvailable}
            className="px-4 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
            +
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
        <span className="text-sm text-gray-600">Subtotal:</span>
        <span className="text-xl font-bold text-gray-900">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(product.price * quantity)}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        {product.saleType === "auction" ? (
          <Button
            onClick={handleAuction}
            disabled={!isAvailable}
            className="w-full h-12 text-base font-semibold"
            variant="default">
            <Gavel className="w-5 h-5 mr-2" />
            Ikut Lelang
          </Button>
        ) : (
          <>
            <Button
              onClick={handleBuy}
              disabled={!isAvailable}
              className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Beli Sekarang
            </Button>
            <Button
              onClick={handleBuy}
              disabled={!isAvailable}
              variant="outline"
              className="w-full h-12 text-base font-semibold">
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat Penjual
            </Button>
          </>
        )}
      </div>

      {!isAvailable && (
        <p className="text-sm text-red-600 text-center pt-2">
          Produk sedang tidak tersedia
        </p>
      )}
    </div>
  );
}
