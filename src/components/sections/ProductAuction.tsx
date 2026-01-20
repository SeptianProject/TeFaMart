import React from "react";
import DigitalImage from "../../../public/assets/digital1.png";
import IotImage from "../../../public/assets/iot2.png";
import KreatifImage from "../../../public/assets/kreatif1.png";
import Image from "next/image";
import { Button } from "../ui/button";
import TitleLanding from "../ui/titleLanding";

const ProductAuction = () => {
  const auctionProducts = [
    {
      category: "Digital & Jasa IT",
      image: DigitalImage,
    },
    {
      category: "Elektronika & IOT",
      image: IotImage,
    },
    {
      category: "Kreatif & Media",
      image: KreatifImage,
    },
  ];

  const productTags = [
    "Terbaru",
    "Populer",
    "Terdekat",
    "Diskon",
    "Rekomendasi",
  ];

  return (
    <section className="flex flex-col w-full gap-6 sm:gap-8 lg:gap-10">
      <TitleLanding name="Produk Lelang" />
      <div className="relative flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-5">
        {auctionProducts.map((item, index) => {
          const styleClasses =
            index === 0
              ? "w-full h-64 sm:h-80 md:h-96 lg:h-160"
              : "w-full lg:w-1/2 h-48 sm:h-64 md:h-72 lg:h-80";

          return (
            <div
              key={index}
              className={`rounded-xl overflow-hidden border ${styleClasses} ${index === 0 ? "order-1" : index === 1 ? "order-2 lg:order-2" : "order-3 lg:order-3"}`}>
              <Image
                src={item.image}
                alt={item.category}
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
        <div className="static lg:absolute lg:bottom-0 lg:left-1/2 space-y-4 sm:space-y-5 lg:space-y-6 mt-4 lg:mt-0 p-4 sm:p-5 lg:p-0 bg-background lg:bg-transparent rounded-xl lg:rounded-none border lg:border-0 order-4">
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
              Website Profile Company | Digital & Jasa IT
            </h2>
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
              {productTags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-accent text-background text-xs sm:text-sm rounded-full px-3 sm:px-4 lg:px-5 py-1">
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 lg:gap-10">
            <div className="flex flex-col gap-3 sm:gap-4 w-full sm:w-fit">
              <div className="text-foreground">
                <h4 className="text-base sm:text-lg font-medium">Status</h4>
                <p className="text-sm">Lelang Akif</p>
              </div>
              <div className="text-foreground">
                <h4 className="text-base sm:text-lg font-medium">Sisa Waktu</h4>
                <p className="text-sm">12 Jam</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4 w-full sm:w-fit">
              <div className="text-foreground">
                <h4 className="text-base sm:text-lg font-medium">
                  Harga Awal Lelang
                </h4>
                <p className="text-sm">Rp 3.500.000</p>
              </div>
              <div className="text-foreground">
                <h4 className="text-base sm:text-lg font-medium">
                  Estimasi Harga Akhir
                </h4>
                <p className="text-sm">Rp 5.000.000 - Rp 7.000.000</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5">
            <Button
              variant="default"
              className="rounded-full px-6 sm:px-8 lg:px-10 h-10 text-sm sm:text-base w-full sm:w-auto">
              Ikuti Lelang
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-6 sm:px-8 lg:px-10 h-10 text-sm sm:text-base hover:border-primary hover:bg-primary/10 hover:text-primary w-full sm:w-auto">
              Lihat Detail
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductAuction;
