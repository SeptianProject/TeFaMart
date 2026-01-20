import React from "react";

import { ChevronLeft, ChevronRight, Handbag } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center gap-3 sm:gap-4 lg:gap-5 w-full h-auto lg:h-140">
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-full flex items-start rounded-lg overflow-hidden group">
        <Image
          src="/assets/digital1.png"
          alt="Hero Image"
          width={1600}
          height={400}
        />
        <div className="group-hover:bg-foreground/40 bg-transparent size-full absolute transition duration-300"></div>
        <div className="absolute -translate-x-full group-hover:translate-x-0 transition duration-300 ease-in-out top-3 left-3 sm:top-4 sm:left-4 lg:top-5 lg:left-5">
          <div className="flex items-center gap-2 sm:gap-3 w-4/5 lg:w-3/4">
            <div className="size-10 sm:size-12 lg:size-15 bg-background/20 p-2 sm:p-2.5 lg:p-3 rounded-lg">
              <Handbag className="text-background size-full" />
            </div>
            <h3 className="text-background font-medium text-sm sm:text-base lg:text-xl w-full">
              Belanja dan dukung produk hasil pembelajaran vokasi.
            </h3>
          </div>
        </div>
        {/* card product */}
        <div className="group-hover:translate-y-0 translate-y-full absolute w-full bottom-0 left-0 px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5 transition duration-300 ease-in-out">
          <div className="bg-linear-to-r to-foreground from-muted-foreground opacity-90 w-full h-20 sm:h-24 lg:h-28 rounded-xl flex items-center justify-between px-3 sm:px-4 lg:px-5">
            {/* product image */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="size-14 sm:size-16 lg:size-20 flex items-center rounded-lg overflow-hidden shrink-0">
                <Image
                  src="/assets/digital2.png"
                  alt="Hero Image"
                  width={400}
                  height={400}
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-background text-xs sm:text-sm lg:text-base font-semibold truncate">
                  Mobile Application
                </h3>
                <h4 className="text-background text-xs sm:text-xs lg:text-sm truncate">
                  Politeknik Negeri Banyuwangi
                </h4>
              </div>
            </div>
            {/* arrow */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <div className="rounded-full p-1 sm:p-1.5 lg:p-2 border-background/20 border flex items-center justify-center hover:border-background group cursor-pointer transition">
                <ChevronLeft className="text-background w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>
              <div className="hidden sm:block">
                <span className="text-background text-xs sm:text-sm">2/5</span>
              </div>
              <div className="rounded-full p-1 sm:p-1.5 lg:p-2 border-background/20 border border-r-background flex items-center justify-center hover:border-background group cursor-pointer transition">
                <ChevronRight className="text-background w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-full flex items-center rounded-lg overflow-hidden group relative">
        <Image
          src="/assets/digital2.png"
          alt="Hero Image"
          width={800}
          height={400}
        />
        <div className="group-hover:bg-foreground/40 bg-transparent size-full absolute transition duration-300"></div>
        <div className="absolute bottom-0 left-0 flex items-center justify-between w-full h-16 sm:h-18 lg:h-20 px-3 sm:px-4 lg:px-5 translate-y-full group-hover:translate-y-0 bg-transparent transition ease-in-out duration-300">
          <div className="text-background w-1/2 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold truncate">
              ToteBag
            </h3>
            <h4 className="text-xs sm:text-sm truncate">
              Politeknik Negeri Banyuwangi
            </h4>
          </div>
          <Button className="rounded-full px-4 sm:px-6 lg:px-10 text-xs sm:text-sm h-8 sm:h-9 lg:h-10">
            Tambahkan
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
