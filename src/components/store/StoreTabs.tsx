"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StoreTabsProps {
  activeTab: "beranda" | "produk" | "ulasan";
  onTabChange: (tab: "beranda" | "produk" | "ulasan") => void;
  reviewCount?: number;
  productCount?: number;
}

export default function StoreTabs({
  activeTab,
  onTabChange,
  reviewCount = 0,
  productCount = 0,
}: StoreTabsProps) {
  const tabs = [
    { id: "beranda" as const, label: "Beranda" },
    { id: "produk" as const, label: "Produk", count: productCount },
    { id: "ulasan" as const, label: "Ulasan", count: reviewCount },
  ];

  return (
    <div className="border-b border-gray-200 bg-background mb-6">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative py-4 px-2 text-sm font-medium transition-colors",
              "hover:text-primary",
              activeTab === tab.id ? "text-primary" : "text-gray-600",
            )}>
            <span className="flex items-center gap-2">
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="text-xs text-gray-500">({tab.count})</span>
              )}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
