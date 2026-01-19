import React from "react";
import { Product, ProductCard } from "../ui/productCard";
import DigitalImage from "../../../public/assets/digital1.png";

const PopularProduct = () => {
  const categories = [
    "Tata Boga & Agribisnis",
    "Digital & Jasa IT",
    "Kreatif & Media",
    "Fashion & Tekstil",
  ];

  const products: Product[] = [
    {
      id: 1,
      category: "Politeknik Negeri Banyuwangi",
      image: DigitalImage,
      title: "Website Profil Perusahaan",
      price: "50000",
    },
    {
      id: 2,  
      category: "Politeknik Negeri Banyuwangi",
      image: DigitalImage,
      title: "Website Profil Perusahaan",
      price: "50000",
    },
    {
      id: 3,
      category: "Politeknik Negeri Banyuwangi",
      image: DigitalImage,
      title: "Website Profil Perusahaan",
      price: "50000",
    },
  ];  

  return (
    <section className="w-full flex flex-col gap-10">
      {/* header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-[28px] font-semibold">Produk Populer</h2>
        <div className="flex items-center gap-2.5">
          {categories.map((category, index) => (
            <button
              key={index}
              className="border border-foreground font-medium rounded-full px-5 h-10 cursor-pointer hover:bg-foreground hover:text-background transition duration-300">
              {category}
            </button>
          ))}
        </div>
      </div>
      {/* Card products */}
      <div className="grid grid-cols-3 gap-5">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            product={product}
            isSidebar
            onToggleWishlist={() => {}}
            isWishlisted={true}
          />
        ))}
      </div>
    </section>
  );
};

export default PopularProduct;
