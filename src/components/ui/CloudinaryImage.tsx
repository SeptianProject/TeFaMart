"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

/**
 * CloudinaryImage - Direct img tag (bypasses Next.js Image optimization)
 * Use this if OptimizedImage causes timeout issues
 *
 * This component directly uses <img> tag instead of Next.js Image,
 * avoiding the /_next/image proxy which might cause timeouts with Cloudinary.
 */
export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className = "",
  objectFit = "cover",
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fallbackSrc = "/assets/placeholder-product.png";

  return (
    <div className="relative w-full h-full">
      {isLoading && !hasError && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      )}
      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        style={{
          objectFit,
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "100%",
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        loading="lazy"
      />
    </div>
  );
}
