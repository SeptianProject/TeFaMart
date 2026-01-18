"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface WishlistIconProps extends React.SVGProps<SVGSVGElement> {
  active?: boolean;
}

function Wishlist({
  active = false,
  className,
  ...props
}: WishlistIconProps) {
  return (
    <svg
      data-slot="wishlist-icon"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "w-4 h-4 transition-colors",
        active ? "text-red-500" : "text-gray-600",
        className
      )}
      {...props}
    >
      <path d="M20.8 4.6c-1.9-1.9-5-1.9-6.9 0L12 6.5l-1.9-1.9c-1.9-1.9-5-1.9-6.9 0s-1.9 5 0 6.9l1.9 1.9L12 21l6.9-6.6 1.9-1.9c1.9-1.9 1.9-5 0-6.9z" />
    </svg>
  );
}

export { Wishlist };
