import { Package, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/search";
import { formatCurrency } from "@/helper/format-currency";

type ProductResultsProps = {
  products: Product[];
  searchQuery: string;
  selectedIndex: number;
  tefasLength: number;
  onProductClick: (product: Product) => void;
  highlightText: (text: string, query: string) => React.ReactNode;
};

export function ProductResults({
  products,
  searchQuery,
  selectedIndex,
  tefasLength,
  onProductClick,
  highlightText,
}: ProductResultsProps) {
  if (products.length === 0) return null;

  return (
    <div className="mb-3">
      <h3 className="text-xs font-semibold text-gray-600 mb-2 px-1 flex items-center gap-1.5">
        <Package className="w-3.5 h-3.5" />
        Produk
      </h3>
      <div className="space-y-1">
        {products.map((product, index) => {
          const productIndex = tefasLength + index;
          return (
            <div
              key={product.id}
              onClick={() => onProductClick(product)}
              className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all group ${
                selectedIndex === productIndex
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
              }`}>
              <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {highlightText(product.name, searchQuery)}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-gray-500 truncate shrink-0">
                    {product.category?.name || "Tanpa Kategori"}
                  </p>
                  <span className="text-xs text-gray-400">•</span>
                  <p className="text-xs font-semibold text-blue-600 shrink-0">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
