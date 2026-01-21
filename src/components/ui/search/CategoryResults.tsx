import { Tag, ArrowRight } from "lucide-react";
import { Category } from "@/types/search";

type CategoryResultsProps = {
  categories: Category[];
  searchQuery: string;
  selectedIndex: number;
  selectedItemRef: React.RefObject<HTMLDivElement | null>;
  tefasLength: number;
  productsLength: number;
  onCategoryClick: (category: Category) => void;
  highlightText: (text: string, query: string) => React.ReactNode;
};

export function CategoryResults({
  categories,
  searchQuery,
  selectedIndex,
  selectedItemRef,
  tefasLength,
  productsLength,
  onCategoryClick,
  highlightText,
}: CategoryResultsProps) {
  if (categories.length === 0) return null;

  return (
    <div className="mb-3">
      <h3 className="text-xs font-semibold text-gray-600 mb-2 px-1 flex items-center gap-1.5">
        <Tag className="w-3.5 h-3.5" />
        Kategori
      </h3>
      <div className="space-y-1">
        {categories.map((category, index) => {
          const categoryIndex = tefasLength + productsLength + index;
          return (
            <div
              key={category.id}
              ref={selectedIndex === categoryIndex ? selectedItemRef : null}
              onClick={() => onCategoryClick(category)}
              className={`flex border border-transparent items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all group ${
                selectedIndex === categoryIndex
                  ? "bg-primary/10"
                  : "hover:bg-primary/10 hover:border-primary/10"
              }`}>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {highlightText(category.name, searchQuery)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {category._count.products} produk
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
