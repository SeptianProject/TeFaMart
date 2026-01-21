"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "../Skeleton";

type SidebarFilterProps = {
  isMobile?: boolean;
  onClose?: () => void;
  selectedCategories: string[];
  selectedTypes: string[];
  onCategoryChange: (id: string) => void;
  onTypeChange: (type: string) => void;
  onReset: () => void;
};

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-[14px] font-medium"
      >
        {title}
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && <div className="mt-2 space-y-2 text-[12px]">{children}</div>}
    </div>
  );
}

function FilterItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <Checkbox value={label} checked={checked} onCheckedChange={onChange} />
      {label}
    </label>
  );
}

export default function SidebarFilter({
  isMobile = false,
  onClose,
  selectedCategories = [],
  selectedTypes = [],
  onCategoryChange,
  onTypeChange,
  onReset,
}: SidebarFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataCategories = async () => {
      try {
        setLoading(true);
        const products = await fetch("/api/client/categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dataProducts = await products.json();
        setCategories(dataProducts.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataCategories();
  }, []);
  return (
    <div
      className={`${
        isMobile ? "rounded-t-2xl bg-white p-5" : "rounded-xl border p-5"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filter Produk</h2>
        {isMobile && (
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-gray-100"
          >
            ✕
          </button>
        )}
      </div>

      <FilterSection title="Kategori">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <FilterItem
              key={category.id}
              label={category.name}
              checked={selectedCategories.includes(category.id)}
              onChange={() => onCategoryChange?.(category.id)}
            />
          ))
        ) : (
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        )}
      </FilterSection>

      <FilterSection title="Jenis">
        <FilterItem
          label="Pre Order"
          checked={selectedTypes.includes("direct")}
          onChange={() => onTypeChange?.("direct")}
        />
        <FilterItem
          label="Lelang"
          checked={selectedTypes.includes("auction")}
          onChange={() => onTypeChange?.("auction")}
        />
      </FilterSection>

      {isMobile && (
        <div className="mt-4 flex gap-2">
          <Button size="sm" className="flex-1">
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}
