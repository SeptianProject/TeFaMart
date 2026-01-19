import Image from "next/image";
import React from "react";
import DigitalImage from "../../../public/assets/digital1.png";
import IotImage from "../../../public/assets/iot2.png";
import ManufakturImage from "../../../public/assets/manufaktur1.png";
import TekstilImage from "../../../public/assets/tekstil2.png";
import KreatifImage from "../../../public/assets/kreatif1.png";
import AgbImage from "../../../public/assets/agb1.png";

const ProductCategory = () => {
  const bentoGridItem = [
    {
      category: "Digital & Jasa IT",
      image: DigitalImage,
    },
    {
      category: "Elektronika & IOT",
      image: IotImage,
    },
    {
      category: "Manufaktur",
      image: ManufakturImage,
    },
    {
      category: "Fashion & Tekstil",
      image: TekstilImage,
    },
    {
      category: "Kreatif & Media",
      image: KreatifImage,
    },
    {
      category: "Tata Boga & Agribisnis",
      image: AgbImage,
    },
  ];

  return (
    <section className="w-full flex flex-col gap-10">
      <h2 className="text-[28px] font-semibold">Kategori Produk Populer</h2>
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-rows-2
               lg:grid-cols-4 md:h-[calc(100vh-100px)] w-full transition-all duration-700">
        {bentoGridItem.map((item, index) => {
          return (
            <div
              key={index}
              className={`relative rounded-xl overflow-hidden h-64 md:h-auto w-full
                              ${
                                index === 0 || index === 5
                                  ? "md:col-span-2"
                                  : index === 1 ||
                                      index === 2 ||
                                      index === 3 ||
                                      index === 4
                                    ? "md:col-span-1"
                                    : ""
                              }`}>
              <Image
                className="absolute inset-0 w-full h-full object-cover border"
                width={1200}
                height={400}
                src={item.image}
                alt={item.category}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductCategory;
