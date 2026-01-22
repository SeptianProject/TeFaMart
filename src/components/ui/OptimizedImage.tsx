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
  quality?: number; // Cloudinary quality parameter (1-100)
}

/**
 * Transform Cloudinary URL untuk optimization
 * @param url - Original Cloudinary URL
 * @param width - Target width
 * @param height - Target height
 * @param quality - Image quality (1-100)
 */
function transformCloudinaryUrl(
  url: string,
  width?: number,
  height?: number,
  quality: number = 80,
): string {
  // Check if it's a Cloudinary URL
  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  // For Cloudinary URLs, return original URL without transformation
  // Next.js Image component will handle optimization automatically
  return url;
}

/**
 * OptimizedImage - Image component with lazy loading skeleton and Cloudinary optimization
 * Automatically shows skeleton while image is loading and optimizes Cloudinary URLs
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
  quality = 80,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fallbackSrc = "/assets/placeholder-product.png";

  // Transform Cloudinary URL if applicable
  const optimizedSrc = transformCloudinaryUrl(src, width, height, quality);

  // Debug logging
  if (hasError) {
    console.error("OptimizedImage error:", {
      original: src,
      optimized: optimizedSrc,
      alt,
    });
  }

  if (fill) {
    return (
      <div className="relative w-full h-full">
        {isLoading && !hasError && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
        )}
        <Image
          src={hasError ? fallbackSrc : optimizedSrc}
          alt={alt}
          fill
          className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
          sizes={sizes}
          priority={priority}
          style={{ objectFit }}
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            console.error("Image load error:", {
              src: optimizedSrc,
              alt,
              error: e,
            });
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
        src={hasError ? fallbackSrc : optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        sizes={sizes}
        priority={priority}
        style={{ objectFit }}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          console.error("Image load error:", {
            src: optimizedSrc,
            alt,
            error: e,
          });
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
