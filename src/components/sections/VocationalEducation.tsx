"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import LogoPens from "../../../public/assets/logo/logo-pens.png";
import LogoPoliwangi from "../../../public/assets/logo/logo-poliwangi.png";
import LogoPolinema from "../../../public/assets/logo/logo-polinema.png";
import LogoSmea from "../../../public/assets/logo/logo-smea.png";
import TitleLanding from "../ui/titleLanding";

const VocationalEducation = () => {
  const scrollerLeftRef = useRef<HTMLDivElement>(null);
  const scrollerRightRef = useRef<HTMLDivElement>(null);

  const data = [
    {
      nickname: "Poliwangi",
      name: "Politeknik Negeri Banyuwangi",
      image: LogoPoliwangi,
    },
    {
      nickname: "Polinema",
      name: "Politeknik Negeri Malang",
      image: LogoPolinema,
    },
    {
      nickname: "PENS",
      name: "Politeknik Elektronika Negeri Surabaya",
      image: LogoPens,
    },
    {
      nickname: "SMEA",
      name: "SMK Negeri 1 Banyuwangi",
      image: LogoSmea,
    },
  ];

  // Duplicate data untuk seamless looping
  const duplicatedData = [...data, ...data, ...data];

  useEffect(() => {
    if (!scrollerLeftRef.current || !scrollerRightRef.current) return;

    const scrollerLeft = scrollerLeftRef.current;
    const scrollerRight = scrollerRightRef.current;

    // Calculate the width of one complete set (original data)
    const cardWidth = scrollerLeft.scrollWidth / 2;

    // Animate scroll to left (moving right to left)
    const animLeft = gsap.to(scrollerLeft, {
      x: -cardWidth,
      duration: 30,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => {
          const value = parseFloat(x);
          return value % -cardWidth;
        }),
      },
    });

    // Animate scroll to right (moving left to right)
    const tlRight = gsap.timeline({ repeat: -1 });
    tlRight.fromTo(
      scrollerRight,
      { x: -cardWidth },
      {
        x: 0,
        duration: 30,
        ease: "none",
      },
    );

    // Pause on hover - Left carousel
    const handleMouseEnterLeft = () => animLeft.pause();
    const handleMouseLeaveLeft = () => animLeft.resume();

    // Pause on hover - Right carousel
    const handleMouseEnterRight = () => tlRight.pause();
    const handleMouseLeaveRight = () => tlRight.resume();

    scrollerLeft.addEventListener("mouseenter", handleMouseEnterLeft);
    scrollerLeft.addEventListener("mouseleave", handleMouseLeaveLeft);
    scrollerRight.addEventListener("mouseenter", handleMouseEnterRight);
    scrollerRight.addEventListener("mouseleave", handleMouseLeaveRight);

    // Cleanup
    return () => {
      animLeft.kill();
      tlRight.kill();
      scrollerLeft.removeEventListener("mouseenter", handleMouseEnterLeft);
      scrollerLeft.removeEventListener("mouseleave", handleMouseLeaveLeft);
      scrollerRight.removeEventListener("mouseenter", handleMouseEnterRight);
      scrollerRight.removeEventListener("mouseleave", handleMouseLeaveRight);
    };
  }, []);

  return (
    <section className="space-y-6 sm:space-y-8 lg:space-y-10">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-25">
        <TitleLanding name="Pendidikan Vokasi Terdaftar" />
      </div>

      {/* Carousel Container */}
      <div className="w-full flex flex-col gap-1.5 sm:gap-2 mb-20 sm:mb-28 lg:mb-40">
        {/* Carousel bergerak ke kiri */}
        <div className="w-full overflow-hidden">
          <div
            ref={scrollerLeftRef}
            className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 p-1 sm:p-1.5 md:p-2">
            {duplicatedData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-2.5 justify-center w-64 sm:w-72 md:w-80 lg:w-86 shrink-0 bg-[#7c7c7c]/10 py-3 sm:py-4 md:py-5 px-4 sm:px-5 md:px-6 rounded-xl grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105 cursor-pointer">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="object-contain w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                />
                <h3 className="font-semibold text-sm sm:text-base md:text-lg">
                  {item.nickname}
                </h3>
                <p className="text-xs sm:text-sm text-center text-gray-600">
                  ({item.name})
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel bergerak ke kanan */}
        <div className="w-full overflow-hidden">
          <div
            ref={scrollerRightRef}
            className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 p-1 sm:p-1.5 md:p-2">
            {duplicatedData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-2.5 justify-center w-64 sm:w-72 md:w-80 lg:w-86 shrink-0 bg-[#7c7c7c]/10 py-3 sm:py-4 md:py-5 px-4 sm:px-5 md:px-6 rounded-xl grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105 cursor-pointer">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="object-contain w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                />
                <h3 className="font-semibold text-sm sm:text-base md:text-lg">
                  {item.nickname}
                </h3>
                <p className="text-xs sm:text-sm text-center text-gray-600">
                  ({item.name})
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VocationalEducation;
