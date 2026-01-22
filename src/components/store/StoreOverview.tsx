"use client";

import React from "react";
import { MapPin, Star, Package, MessageSquare } from "lucide-react";
import Image from "next/image";

interface StoreOverviewProps {
  campus: {
    name: string;
    users: { city: string }[];
  };
  stats: {
    totalProducts: number;
    totalReviews: number;
    averageRating: number;
  };
}

export default function StoreOverview({ campus, stats }: StoreOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Store Info Card */}
      <div className="bg-background rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            <Image
              src="/logo.png"
              alt={campus.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{campus.name}</h2>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {campus.users[0]?.city || "Lokasi tidak tersedia"}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">
                  {stats.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-500 text-sm">Rating</span>
              </div>

              <div className="h-6 w-px bg-gray-300" />

              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-600" />
                <span className="font-semibold">{stats.totalProducts}</span>
                <span className="text-gray-500 text-sm">Produk</span>
              </div>

              <div className="h-6 w-px bg-gray-300" />

              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <span className="font-semibold">{stats.totalReviews}</span>
                <span className="text-gray-500 text-sm">Ulasan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-background rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-3">Tentang Toko</h3>
        <p className="text-gray-600 leading-relaxed">
          {campus.name} adalah institusi pendidikan vokasi yang menyediakan
          berbagai produk berkualitas hasil karya siswa dan workshop. Kami
          berkomitmen untuk menghasilkan produk-produk terbaik yang mendukung
          pembelajaran dan keterampilan praktis siswa.
        </p>
      </div>

      {/* Additional Info */}
      <div className="bg-background rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">Informasi Toko</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Bergabung</span>
            <span className="font-medium">2024</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Lokasi</span>
            <span className="font-medium">{campus.users[0]?.city || "-"}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Waktu Operasional</span>
            <span className="font-medium">Senin - Jumat, 08:00 - 16:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
