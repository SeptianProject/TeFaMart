"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteChangeLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Start loading
    setLoading(true);

    // Complete loading after a short delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <>
      {/* Top Loading Bar */}
      <div className="fixed top-0 left-0 right-0 z-[9998] h-1 bg-gray-200">
        <div className="h-full bg-primary animate-loading-bar"></div>
      </div>

      {/* Optional: Full screen overlay with fade */}
      <div className="fixed inset-0 z-[9997] bg-white/50 backdrop-blur-sm animate-fade-in"></div>
    </>
  );
}
