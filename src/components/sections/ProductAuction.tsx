import React from "react";
import DigitalImage from "../../../public/assets/digital1.png";
import IotImage from "../../../public/assets/iot2.png";
import KreatifImage from "../../../public/assets/kreatif1.png";
import Image from "next/image";
import { Button } from "../ui/button";

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
    <section className="flex flex-col w-full gap-10">
      <h2 className="text-[28px] font-semibold">Produk Lelang</h2>
      <div className="relative flex gap-5">
        {auctionProducts.map((item, index) => {
          const styleClasses = index === 0 ? "w-full h-160" : "w-1/2 h-80";

          return (
            <>
              <div
                key={index}
                className={`rounded-xl overflow-hidden border ${styleClasses}`}>
                <Image
                  src={item.image}
                  alt={item.category}
                  className="w-full h-full object-cover"
                />
              </div>
            </>
          );
        })}
        <div className="absolute bottom-0 left-1/2 space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">
              Website Profile Company | Digital & Jasa IT
            </h2>
            <div className="flex items-center gap-1.5">
              {productTags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-accent text-background text-sm rounded-full px-5 py-1">
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div className="flex flex-col gap-4 w-fit">
              <div className="text-foreground">
                <h4 className="text-lg font-medium">Status</h4>
                <p className="text-sm">Lelang Akif</p>
              </div>
              <div className="text-foreground">
                <h4 className="text-lg font-medium">Sisa Waktu</h4>
                <p className="text-sm">12 Jam</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-fit">
              <div className="text-foreground">
                <h4 className="text-lg font-medium">Harga Awal Lelang</h4>
                <p className="text-sm">Rp 3.500.000</p>
              </div>
              <div className="text-foreground">
                <h4 className="text-lg font-medium">Estimasi Harga Akhir</h4>
                <p className="text-sm">Rp 5.000.000 - Rp 7.000.000</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Button variant="default" className="rounded-full px-10 h-10">
              Ikuti Lelang
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-10 h-10 hover:border-primary hover:bg-primary/10 hover:text-primary">
              Lihat Detail
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductAuction;
