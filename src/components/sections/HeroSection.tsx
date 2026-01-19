import React from "react";

import { ChevronLeft, ChevronRight, Handbag } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="flex items-center gap-5 w-full h-140">
      <div className="relative w-full h-full flex items-start rounded-lg overflow-hidden group">
        <Image
          src="/assets/digital1.png"
          alt="Hero Image"
          width={1600}
          height={400}
        />
        <div className="group-hover:bg-foreground bg-transparent absolute w-full h-full opacity-40 transition duration-300 ease-in-out"></div>
        <div className="absolute -translate-x-full group-hover:translate-x-0 transition duration-300 ease-in-out top-5 left-5">
          <div className="flex items-center gap-3 w-3/4">
            <div className="size-15 bg-background/20 p-3 rounded-lg">
              <Handbag className="text-background size-full" />
            </div>
            <h3 className="text-background font-medium text-xl w-full">
              Belanja dan dukung produk hasil pembelajaran vokasi.
            </h3>
          </div>
        </div>
        {/* card product */}
        <div className="group-hover:translate-y-0 translate-y-full absolute w-full bottom-0 left-0 px-5 py-5 transition duration-300 ease-in-out">
          <div className="bg-linear-to-r to-foreground from-muted-foreground opacity-90 w-full h-28 rounded-xl flex items-center justify-between px-5">
            {/* product image */}
            <div className="flex items-center gap-3">
              <div className="size-20 bg-gray-400 flex items-center rounded-lg overflow-hidden">
                <Image
                  src="/assets/digital2.png"
                  alt="Hero Image"
                  width={400}
                  height={400}
                />
              </div>
              <div>
                <h3 className="text-background text-base font-semibold">
                  Mobile Application
                </h3>
                <h4 className="text-background text-sm">
                  Politeknik Negeri Banyuwangi
                </h4>
              </div>
            </div>
            {/* arrow */}
            <div className="flex items-center gap-2">
              <div className="rounded-full p-2 border-background/20 border flex items-center justify-center hover:border-background group cursor-pointer transition">
                <ChevronLeft className="text-background" />
              </div>
              <div>
                <span className="text-background">2/5</span>
              </div>
              <div className="rounded-full p-2 border-background/20 border border-r-white flex items-center justify-center hover:border-background group cursor-pointer transition">
                <ChevronRight className="text-background" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 bg-gray-400 h-full flex items-center rounded-lg overflow-hidden group relative">
        <Image
          src="/assets/digital2.png"
          alt="Hero Image"
          width={800}
          height={400}
        />
        <div className="group-hover:bg-foreground/40 bg-transparent size-full absolute transition duration-300"></div>
        <div className="absolute bottom-0 left-0 flex items-center justify-between w-full h-20 px-5 translate-y-full group-hover:translate-y-0 bg-transparent transition ease-in-out duration-300">
          <div className="text-background w-1/2">
            <h3 className="text-base font-semibold">ToteBag</h3>
            <h4 className="text-sm">Politeknik Negeri Banyuwangi</h4>
          </div>
          <Button className="rounded-full px-10">Tambahkan</Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
