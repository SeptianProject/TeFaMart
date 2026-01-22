"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function InitialPageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Cek apakah sudah pernah load sebelumnya (dalam session ini)
    const hasLoaded = sessionStorage.getItem("hasInitiallyLoaded");

    if (hasLoaded) {
      setIsLoading(false);
      return;
    }

    // Simulasi loading minimum 1.5 detik
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Tunggu animasi fade out selesai
      setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasInitiallyLoaded", "true");
      }, 500);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}>
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 animate-pulse">
          <Image
            src="/logo.png"
            width={64}
            height={64}
            alt="TeFaMart Logo"
            className="w-16 h-16"
            priority
          />
          <span className="text-4xl font-bold text-gray-800">
            <span className="text-primary">TeFa</span>Mart
          </span>
        </div>

        {/* Loading Spinner */}
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
