"use client";

import { Product } from "@/types";
import { useState } from "react";
import { FileText, Info, ScrollText } from "lucide-react";

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"detail" | "spec" | "info">(
    "detail",
  );

  const tabs = [
    { id: "detail" as const, label: "Detail Produk", icon: FileText },
    { id: "spec" as const, label: "Spesifikasi", icon: ScrollText },
    { id: "info" as const, label: "Info Penting", icon: Info },
  ];

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}>
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "detail" && (
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-3">Deskripsi Produk</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {product.description || "Tidak ada deskripsi untuk produk ini."}
            </p>
          </div>
        )}

        {activeTab === "spec" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Spesifikasi</h3>
            <div className="space-y-3">
              <div className="flex py-3 border-b border-gray-100">
                <span className="w-1/3 text-gray-600">Kategori</span>
                <span className="w-2/3 font-medium">
                  {product.category?.name || "-"}
                </span>
              </div>
              <div className="flex py-3 border-b border-gray-100">
                <span className="w-1/3 text-gray-600">Tipe Penjualan</span>
                <span className="w-2/3 font-medium">
                  {product.saleType === "auction" ? "Lelang" : "Pre Order"}
                </span>
              </div>
              <div className="flex py-3 border-b border-gray-100">
                <span className="w-1/3 text-gray-600">Status</span>
                <span className="w-2/3 font-medium">{product.isAvailable}</span>
              </div>
              <div className="flex py-3 border-b border-gray-100">
                <span className="w-1/3 text-gray-600">Jurusan</span>
                <span className="w-2/3 font-medium">
                  {product.tefa?.major || "-"}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "info" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Info Penting</h3>
            <div className="space-y-4 text-gray-700">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm">
                  ℹ️ Produk ini dibuat oleh siswa/mahasiswa di program Teaching
                  Factory (TEFA).
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm">
                  ⚠️ Waktu produksi mungkin memerlukan waktu lebih lama
                  dibanding produk komersial.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm">
                  ✅ Dengan membeli produk ini, Anda mendukung pendidikan vokasi
                  Indonesia.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
