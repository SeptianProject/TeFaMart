"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import TitleLanding from "../ui/titleLanding";
import BidModal from "../BidModal";
import { useCountdown, formatTimeLeft } from "@/hooks/useCountdown";
import { formatCurrency } from "@/helper/format-currency";
import { Skeleton } from "@/components/ui/skeleton";

interface AuctionData {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    category: string;
    tefa: {
      name: string;
      campus: string;
    };
  };
  startPrice: number;
  currentBid: number;
  highestBid: number;
  highestBidder: string | null;
  totalBids: number;
  startTime: string;
  endTime: string;
  status: string;
}

const ProductAuction = () => {
  const [auctions, setAuctions] = useState<AuctionData[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<AuctionData | null>(
    null,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const fetchAuctions = async () => {
    try {
      const response = await fetch("/api/client/auctions");
      const result = await response.json();
      console.log("Auction API Response:", result);
      console.log("Total auctions fetched:", result.data?.length);
      if (result.success && result.data.length > 0) {
        setAuctions(result.data);
        setSelectedAuction(result.data[0]);
      } else {
        console.warn("No auctions found in response");
      }
    } catch (error) {
      console.error("Error fetching auctions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  useEffect(() => {
    if (auctions.length > 0) {
      setIsTransitioning(true);
      // Delay untuk animasi smooth
      const timer = setTimeout(() => {
        setSelectedAuction(auctions[currentIndex]);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, auctions]);

  const handleBidSuccess = () => {
    fetchAuctions();
  };

  if (isLoading) {
    return (
      <section className="flex flex-col w-full gap-6 sm:gap-8 lg:gap-10">
        <TitleLanding name="Produk Lelang" />
        {/* Skeleton untuk layout baru */}
        <div className="relative flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-5">
          {/* Skeleton gambar besar kiri */}
          <div className="w-full lg:w-[calc(50%-0.625rem)] h-64 sm:h-80 md:h-96 lg:h-[600px]">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>

          {/* Skeleton kolom kanan: 2 gambar + deskripsi */}
          <div className="w-full lg:w-[calc(50%-0.625rem)] flex flex-col gap-3 sm:gap-4 lg:gap-5">
            {/* Skeleton 2 gambar kecil */}
            <div className="flex flex-row gap-3 sm:gap-4 lg:gap-5">
              <Skeleton className="flex-1 h-32 sm:h-40 rounded-xl" />
              <Skeleton className="flex-1 h-32 sm:h-40 rounded-xl" />
            </div>

            {/* Skeleton deskripsi */}
            <div className="flex-1 space-y-3 sm:space-y-4 p-4 sm:p-5 lg:p-6 bg-card rounded-xl border">
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32 rounded-full" />
                <Skeleton className="h-10 w-32 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!selectedAuction || auctions.length === 0) {
    return (
      <section className="flex flex-col w-full gap-6 sm:gap-8 lg:gap-10">
        <TitleLanding name="Produk Lelang" />
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">Tidak ada lelang aktif saat ini</p>
          <p className="text-sm mt-2">Silakan cek kembali nanti</p>
        </div>
      </section>
    );
  }

  const minimumBid = selectedAuction.highestBid + 10000;

  // Ambil 2 produk lelang lainnya untuk ditampilkan di kanan
  const sideAuctions = auctions
    .filter((a) => a.id !== selectedAuction.id)
    .slice(0, 2);

  console.log("=== ProductAuction Component ===");
  console.log("Total auctions:", auctions.length);
  console.log("Selected auction:", selectedAuction.product.name);
  console.log("Side auctions count:", sideAuctions.length);
  console.log(
    "Side auctions:",
    sideAuctions.map((a) => a.product.name),
  );

  return (
    <section className="flex flex-col w-full gap-6 sm:gap-8 lg:gap-10">
      <TitleLanding name="Produk Lelang" />
      {/* Container untuk layout gambar */}
      <div className="relative flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-5">
        {/* Image Besar Kiri - Produk Aktif */}
        <div className="w-full lg:w-[calc(50%-0.625rem)] h-64 sm:h-80 md:h-96 lg:h-[600px]">
          <div className="rounded-xl overflow-hidden border h-full relative group">
            <div
              className={`w-full h-full transition-opacity duration-300 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}>
              <Image
                key={selectedAuction.id}
                src={
                  selectedAuction.product.imageUrl ||
                  "/assets/placeholder-product.png"
                }
                alt={selectedAuction.product.name}
                width={1600}
                height={800}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            {/* Overlay dengan info singkat */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white font-semibold text-lg mb-1">
                {selectedAuction.product.name}
              </h3>
              <p className="text-white/80 text-sm">
                {selectedAuction.product.tefa.campus}
              </p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: 2 Produk + Deskripsi */}
        <div className="w-full lg:w-[calc(50%-0.625rem)] flex flex-col gap-3 sm:gap-4 lg:gap-5">
          {/* 2 Produk Kecil Atas */}
          <div className="flex flex-row gap-3 sm:gap-4 lg:gap-5">
            {sideAuctions.length > 0 ? (
              <>
                {sideAuctions.map((auction) => (
                  <div
                    key={auction.id}
                    onClick={() => {
                      setCurrentIndex(
                        auctions.findIndex((a) => a.id === auction.id),
                      );
                    }}
                    className={`flex-1 h-32 sm:h-40 cursor-pointer transition-all duration-300 rounded-xl overflow-hidden border-2 relative group ${
                      selectedAuction.id === auction.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-primary/50"
                    }`}>
                    <Image
                      src={
                        auction.product.imageUrl ||
                        "/assets/placeholder-product.png"
                      }
                      alt={auction.product.name}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <div className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2">
                        <p className="text-xs sm:text-sm line-clamp-2">
                          {auction.product.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Jika hanya 1 side auction, tambahkan placeholder untuk slot ke-2 */}
                {sideAuctions.length === 1 && (
                  <div className="flex-1 h-32 sm:h-40 rounded-xl border-2 border-dashed border-muted flex items-center justify-center text-muted-foreground text-xs sm:text-sm">
                    Segera hadir
                  </div>
                )}
              </>
            ) : (
              // Jika tidak ada side auctions, tampilkan 2 placeholder
              <>
                <div className="flex-1 h-32 sm:h-40 rounded-xl border-2 border-dashed border-muted flex items-center justify-center text-muted-foreground text-xs sm:text-sm">
                  Tidak ada lelang lain
                </div>
                <div className="flex-1 h-32 sm:h-40 rounded-xl border-2 border-dashed border-muted flex items-center justify-center text-muted-foreground text-xs sm:text-sm">
                  Tidak ada lelang lain
                </div>
              </>
            )}
          </div>

          {/* Deskripsi Produk Aktif - Di Bawah 2 Gambar Kecil */}
          <div
            className={`flex-1 transition-opacity duration-300 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}>
            <AuctionDetails
              auction={selectedAuction}
              onBidClick={() => setIsBidModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {isBidModalOpen && (
        <BidModal
          isOpen={isBidModalOpen}
          onClose={() => setIsBidModalOpen(false)}
          productName={selectedAuction.product.name}
          productSlug={selectedAuction.product.slug}
          currentBid={selectedAuction.highestBid}
          minimumBid={minimumBid}
          onBidSuccess={handleBidSuccess}
        />
      )}
    </section>
  );
};

interface AuctionDetailsProps {
  auction: AuctionData;
  onBidClick: () => void;
}

const AuctionDetails: React.FC<AuctionDetailsProps> = ({
  auction,
  onBidClick,
}) => {
  const timeLeft = useCountdown(auction.endTime);

  return (
    <div className="h-full w-full space-y-3 sm:space-y-4 p-4 sm:p-5 lg:p-6 bg-card rounded-xl border shadow-sm flex flex-col">
      <div className="space-y-2">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold line-clamp-1">
          {auction.product.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {auction.product.tefa.campus}
        </p>
        {auction.product.description && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {auction.product.description}
          </p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-accent text-accent-foreground text-xs rounded-full px-3 py-1 font-medium">
            {auction.product.category}
          </div>
          <div className="bg-primary text-primary-foreground text-xs rounded-full px-3 py-1 font-medium">
            {auction.totalBids} Bid
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-muted-foreground uppercase">
            Status
          </h4>
          <p className="text-sm font-semibold capitalize flex items-center gap-1">
            {auction.status === "active" && (
              <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            )}
            {auction.status === "active" ? "Aktif" : auction.status}
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-medium text-muted-foreground uppercase">
            Sisa Waktu
          </h4>
          <p className="text-sm font-bold text-primary">
            {formatTimeLeft(timeLeft)}
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-medium text-muted-foreground uppercase">
            Harga Awal
          </h4>
          <p className="text-sm font-semibold">
            {formatCurrency(auction.startPrice)}
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-medium text-muted-foreground uppercase">
            Bid Tertinggi
          </h4>
          <div>
            <p className="text-sm font-bold text-primary">
              {formatCurrency(auction.highestBid)}
            </p>
            {auction.highestBidder && (
              <p className="text-xs text-muted-foreground">
                {auction.highestBidder}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-2">
        <Button
          variant="default"
          onClick={onBidClick}
          disabled={timeLeft.isExpired}
          className="rounded-full px-6 h-10 text-sm font-semibold w-full sm:w-auto">
          {timeLeft.isExpired ? "Lelang Berakhir" : "Ikuti Lelang"}
        </Button>
        <Link
          href={`/products/${auction.product.slug}`}
          className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="rounded-full px-6 h-10 text-sm font-semibold hover:border-primary hover:bg-primary/10 hover:text-primary w-full">
            Lihat Detail
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductAuction;
