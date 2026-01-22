"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbConfig {
  [key: string]: string;
}

interface BreadcrumbItem {
  label: string;
  href: string;
  icon: React.ReactElement | null;
}

interface DynamicBreadcrumbProps {
  customLabels?: BreadcrumbConfig;
  maxLength?: number;
}

export default function DynamicBreadcrumb({
  customLabels = {},
  maxLength = 50,
}: DynamicBreadcrumbProps) {
  const pathname = usePathname();

  // Default label mapping untuk segment umum
  const defaultLabels: BreadcrumbConfig = {
    products: "Produk",
    store: "Pendidikan Vokasi",
    wishlist: "Wishlist",
    profile: "Profil Saya",
    dashboard: "Dashboard",
    auth: "Autentikasi",
    login: "Masuk",
    register: "Daftar",
    comments: "Ulasan",
    ...customLabels,
  };

  // Generate breadcrumb items dari pathname
  const generateBreadcrumbs = (): Array<{
    label: string;
    href: string;
    icon: React.ReactElement | null;
  }> => {
    const segments = pathname.split("/").filter((segment) => segment !== "");

    const breadcrumbs: Array<{
      label: string;
      href: string;
      icon: React.ReactElement | null;
    }> = [
      {
        label: "Beranda",
        href: "/",
        icon: <Home className="h-3.5 w-3.5" />,
      },
    ];

    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Cek apakah ini segment terakhir (current page)
      const isLast = index === segments.length - 1;

      // Dapatkan label dari customLabels atau defaultLabels
      let label = defaultLabels[segment] || segment;

      // Format label jika bukan dari mapping (capitalize dan replace dash/underscore)
      if (!defaultLabels[segment]) {
        label = segment
          .replace(/[-_]/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      // Truncate label jika terlalu panjang
      if (label.length > maxLength) {
        label = label.substring(0, maxLength) + "...";
      }

      breadcrumbs.push({
        label,
        href: isLast ? "" : currentPath,
        icon: null,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Jangan tampilkan breadcrumb di landing page
  if (pathname === "/") {
    return null;
  }

  return (
    <nav
      className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-500"
      aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}

            {crumb.href ? (
              <Link
                href={crumb.href}
                className="flex items-center gap-1.5 hover:text-primary transition-colors">
                {crumb.icon}
                <span>{crumb.label}</span>
              </Link>
            ) : (
              <span
                className={`flex items-center gap-1.5 ${
                  isLast ? "font-medium text-black" : ""
                }`}>
                {crumb.icon}
                <span>{crumb.label}</span>
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
