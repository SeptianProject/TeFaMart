"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface CategoryImageCarouselProps {
  images: string[];
  categoryName: string;
  interval?: number; // in milliseconds
  priority?: boolean;
}

const CategoryImageCarousel: React.FC<CategoryImageCarouselProps> = ({
  images,
  categoryName,
  interval = 4000,
  priority = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) {
    return (
      <Image
        className="absolute inset-0 w-full h-full object-cover border transition-transform duration-300 group-hover:scale-105"
        width={1200}
        height={400}
        src="/assets/placeholder-product.png"
        alt={categoryName}
        priority={priority}
      />
    );
  }

  return (
    <>
      {images.map((image, index) => (
        <Image
          key={`${image}-${index}`}
          className={`absolute inset-0 w-full h-full object-cover border transition-all duration-1000 ease-in-out group-hover:scale-105 ${
            index === currentIndex ? "opacity-100 z-[1]" : "opacity-0 z-0"
          }`}
          width={1200}
          height={400}
          src={image}
          alt={`${categoryName} - ${index + 1}`}
          priority={priority && index === 0}
        />
      ))}
    </>
  );
};

export default CategoryImageCarousel;
