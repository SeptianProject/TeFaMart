import React from "react";
import { Product, Category } from "@/types";
import { ProductCard } from "../ui/productCard";

interface PopularProductProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const PopularProduct: React.FC<PopularProductProps> = ({
  products,
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  // Icons mapping untuk setiap kategori (di state, tidak di database)
  const categoryIcons: Record<string, string> = {
    digital: "💻",
    manufaktur: "⚙️",
    elektronik: "⚡",
    fashion: "👕",
    kuliner: "🍔",
    kerajinan: "🎨",
  };

  return (
    <section className="w-full flex flex-col gap-10">
      {/* header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-[28px] font-semibold">Produk Populer</h2>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onCategoryChange("")}
            className={`border font-medium rounded-full px-5 h-10 cursor-pointer transition duration-300 ${
              selectedCategory === ""
                ? "bg-foreground text-background border-foreground"
                : "border-foreground hover:bg-foreground hover:text-background"
            }`}>
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`border font-medium rounded-full px-5 h-10 cursor-pointer transition duration-300 ${
                selectedCategory === category.id
                  ? "bg-foreground text-background border-foreground"
                  : "border-foreground hover:bg-foreground hover:text-background"
              }`}>
              {categoryIcons[category.slug] || "📦"} {category.name}
            </button>
          ))}
        </div>
      </div>
      {/* Card products */}
      <div className="grid grid-cols-3 gap-5">
        {products.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-muted-foreground">
            Tidak ada produk dalam kategori ini
          </div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSidebar
              isWishlisted={false}
              showWishlist={true}
              onToggleWishlist={(id) => console.log("Toggle wishlist:", id)}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default PopularProduct;
