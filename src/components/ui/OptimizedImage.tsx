"use client";

import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

/**
 * OptimizedImage - Image component with lazy loading skeleton
 * Automatically shows skeleton while image is loading
 */
export function OptimizedImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  sizes,
  priority = false,
  objectFit = "cover",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fallbackSrc = "/assets/placeholder-product.png";

  if (fill) {
    return (
      <div className="relative w-full h-full">
        {isLoading && !hasError && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
        )}
        <Image
          src={hasError ? fallbackSrc : src}
          alt={alt}
          fill
          className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
          sizes={sizes}
          priority={priority}
          style={{ objectFit }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      </div>
    );
  }

  if (!width || !height) {
    console.warn("OptimizedImage requires width and height when fill is false");
    return null;
  }

  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && !hasError && (
        <Skeleton
          className="absolute inset-0 rounded-none"
          style={{ width, height }}
        />
      )}
      <Image
        src={hasError ? fallbackSrc : src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        sizes={sizes}
        priority={priority}
        style={{ objectFit }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
