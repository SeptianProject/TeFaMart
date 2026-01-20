"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Ensure we have at least one image
  const imageList =
    images.length > 0 ? images : ["/assets/placeholder-product.png"];

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Thumbnail list - Vertical on desktop, horizontal on mobile */}
      <div className="flex lg:flex-col gap-2 order-2 lg:order-1 overflow-x-auto lg:overflow-y-auto max-w-full lg:max-w-[100px]">
        {imageList.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === index
                ? "border-blue-600 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300"
            }`}>
            <Image
              src={image}
              alt={`${productName} - ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative w-full lg:flex-1 aspect-square order-1 lg:order-2 rounded-lg overflow-hidden border border-gray-200 bg-white">
        <Image
          src={imageList[selectedImage]}
          alt={productName}
          fill
          className="object-contain p-4"
          priority
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>
    </div>
  );
}
