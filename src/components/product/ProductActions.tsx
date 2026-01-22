"use client";

import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  MessageCircle,
  Gavel,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import { Product } from "@/types";
import { useState } from "react";
import BidModal from "@/components/BidModal";
import { useCountdown, formatTimeLeft } from "@/hooks/useCountdown";
import { formatCurrency } from "@/helper/format-currency";

interface ProductActionsProps {
  product: Product;
  onRefetch?: () => void;
}

export function ProductActions({ product, onRefetch }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const isAuction = product.saleType === "auction";
  const isAvailable = product.isAvailable === "Tersedia";

  // Get auction info if product is auction
  const activeAuction = product.auctions?.[0];
  const highestBid =
    activeAuction?.bids?.[0]?.amount || activeAuction?.startPrice || 0;
  const minimumBid = highestBid + 10000; // Increment Rp 10,000
  const timeLeft = activeAuction ? useCountdown(activeAuction.endTime) : null;

  // Count total bids from auction
  const totalBids = activeAuction?.bids?.length || 0;

  const handleBidSuccess = () => {
    // Refetch data without reloading page
    if (onRefetch) {
      onRefetch();
    }
  };

  // Format WhatsApp message
  const getWhatsAppUrl = (action: "buy" | "chat") => {
    const whatsappNumber =
      product.tefa?.campus?.whatsappNumber || product.tefa?.campus?.phoneNumber;

    if (!whatsappNumber) {
      alert("Nomor WhatsApp tidak tersedia");
      return null;
    }

    const phoneNumber = whatsappNumber.replace(/[^0-9]/g, "");
    let message = "";

    if (action === "buy") {
      message = `Halo, saya tertarik untuk membeli produk:\n\n`;
      message += `*${product.name}*\n`;
      message += `Harga: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(product.price)}\n`;
      if (!isAuction) {
        message += `Jumlah: ${quantity}\n`;
        message += `Total: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(product.price * quantity)}\n`;
      }
      message += `\nMohon informasi lebih lanjut.`;
    } else {
      message = `Halo, saya ingin bertanya tentang produk *${product.name}*`;
    }

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleBuyNow = () => {
    if (!isAvailable) {
      alert("Produk tidak tersedia");
      return;
    }
    const url = getWhatsAppUrl("buy");
    if (url) window.open(url, "_blank");
  };

  const handleChatSeller = () => {
    const url = getWhatsAppUrl("chat");
    if (url) window.open(url, "_blank");
  };

  const handleBidClick = () => {
    if (!isAvailable) {
      alert("Produk tidak tersedia");
      return;
    }
    setIsBidModalOpen(true);
  };

  return (
    <div className="sticky top-4 space-y-4 p-6 border border-gray-200 rounded-lg bg-background shadow-sm">
      {/* Auction Info Section */}
      {isAuction && activeAuction && (
        <div className="space-y-4 pb-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg">Informasi Lelang</h3>

          {/* Highest Bid */}
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Bid Tertinggi</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(highestBid)}
            </p>
          </div>

          {/* Additional Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Start Price */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <span>Harga Awal</span>
              </div>
              <p className="text-sm font-semibold">
                {formatCurrency(activeAuction.startPrice)}
              </p>
            </div>

            {/* Total Bids */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Users className="w-3 h-3" />
                <span>Total Bid</span>
              </div>
              <p className="text-sm font-semibold">{totalBids} Bid</p>
            </div>
          </div>

          {/* Countdown Timer */}
          {timeLeft && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg p-3 border border-orange-200 dark:border-orange-900">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Clock className="w-3 h-3" />
                <span>Berakhir Dalam</span>
              </div>
              <p
                className={`text-base font-bold ${
                  timeLeft.isExpired
                    ? "text-red-600 dark:text-red-400"
                    : "text-orange-600 dark:text-orange-400"
                }`}>
                {timeLeft.isExpired
                  ? "Lelang Berakhir"
                  : formatTimeLeft(timeLeft)}
              </p>
            </div>
          )}

          {/* Minimum Bid Notice */}
          <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
            <span className="font-medium">Bid Minimal: </span>
            <span className="text-primary font-semibold">
              {formatCurrency(minimumBid)}
            </span>
          </div>
        </div>
      )}

      {/* Quantity Selector - Only for direct/pre-order */}
      {!isAuction && (
        <>
          <h3 className="font-semibold text-lg">Atur Jumlah</h3>
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
        </>
      )}

      {/* Action Buttons */}
      <div className={`space-y-3 ${!isAuction ? "pt-4" : ""}`}>
        {isAuction ? (
          <>
            <Button
              onClick={handleBidClick}
              disabled={!isAvailable}
              className="w-full h-12 text-base font-semibold"
              variant="default">
              <Gavel className="w-5 h-5 mr-2" />
              Ikuti Lelang
            </Button>
            <Button
              onClick={handleChatSeller}
              disabled={!isAvailable}
              variant="outline"
              className="w-full h-12 text-base font-semibold">
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat Penjual
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleBuyNow}
              disabled={!isAvailable}
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Beli Sekarang
            </Button>
            <Button
              onClick={handleChatSeller}
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

      {/* Bid Modal for Auction Products */}
      {isAuction && activeAuction && (
        <BidModal
          isOpen={isBidModalOpen}
          onClose={() => setIsBidModalOpen(false)}
          productName={product.name}
          productSlug={product.slug}
          currentBid={highestBid}
          minimumBid={minimumBid}
          onBidSuccess={handleBidSuccess}
        />
      )}
    </div>
  );
}
