"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

type DetailStoreProps = {
  name: string;
  location: string;
  rating: number;
  reviews: number;
  sold: number;
  logo: string;
};

export default function DetailStore({
  name,
  location,
  rating,
  reviews,
  sold,
  logo,
}: DetailStoreProps) {
  return (
    <div className="mb-6">
      {/* card store*/}
      <div className="flex flex-col gap-4 rounded-xl border p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* content kiri */}
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-10 lg:h-24 lg:w-24 overflow-hidden rounded-full border">
            <Image
              src={logo}
              alt={name}
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>

          {/* text content */}
          <div className="flex flex-col space-y-1">
            <h2 className="lg:text-3xl text-xm font-semibold leading-tight">{name}</h2>
            <p className="lg:text-sm text-xs text-gray-500">{location}</p>

            {/* button grup */}
            <div className="flex flex-wrap gap-2 pt-1">
              <Button className="w-16 h-6 lg:h-8 lg:w-48 text-xs tlg:ext-sm">Ikuti</Button>
              <Button variant="outline" className="w-32 h-6 lg:h-8 lg:w-48 text-xs">
                Hubungi Penjual
              </Button>
            </div>
          </div>
        </div>

        {/* content kanan */}
        <div className="flex flex-wrap items-center gap-14 lg:flex-nowrap">
          <div className="flex flex-col">
            <div className="mt-1 flex items-center gap-1 text-lg font-semibold">
              <p className="text-yellow-500">
                ★ <span className="text-black">{rating}</span>
              </p>
              <span>({reviews})</span>
              <span>• {sold} terjual</span>
            </div>
            <span className="text-sm text-gray-500">rating & ulasan</span>
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-semibold">±30 menit</span>
            <span className="text-sm text-gray-500">Pesanan diproses</span>
          </div>
        </div>
      </div>

      {/* navigasi detail store*/}
      <div className="mt-4 flex items-center gap-10 border-b text-[18px] font-medium text-gray-500">
        <span className="cursor-pointer pb-2">Beranda</span>

        <span className="relative cursor-pointer pb-2 font-semibold text-black">
          Produk
          <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-black rounded-full" />
        </span>

        <span className="cursor-pointer pb-2">Ulasan</span>
      </div>
    </div>
  );
}