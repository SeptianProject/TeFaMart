import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/client/categories/popular
 * Mengambil maksimal 6 kategori populer untuk ditampilkan di landing page
 * Fallback: Jika tidak ada kategori populer, ambil 6 kategori dengan produk terbanyak
 */
export async function GET() {
  try {
    // Coba ambil kategori yang ditandai populer
    let popularCategories = await prisma.category.findMany({
      where: {
        isPopular: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 6, // Limit maksimal 6 kategori populer
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        isPopular: true,
        _count: {
          select: {
            products: true,
          },
        },
        products: {
          where: {
            isAvailable: "Tersedia",
            imageUrl: {
              not: null,
            },
          },
          select: {
            id: true,
            imageUrl: true,
          },
          take: 5, // Ambil max 5 produk untuk carousel
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    // Fallback: Jika tidak ada kategori populer, ambil kategori dengan produk terbanyak
    if (popularCategories.length === 0) {
      console.log(
        "⚠️  No popular categories found, falling back to categories with most products",
      );

      const allCategories = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
          isPopular: true,
          _count: {
            select: {
              products: true,
            },
          },
          products: {
            where: {
              isAvailable: "Tersedia",
              imageUrl: {
                not: null,
              },
            },
            select: {
              id: true,
              imageUrl: true,
            },
            take: 5, // Ambil max 5 produk untuk carousel
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      // Sort by product count dan ambil 6 teratas
      popularCategories = allCategories
        .filter((cat) => cat._count.products > 0)
        .sort((a, b) => b._count.products - a._count.products)
        .slice(0, 6);
    }

    return NextResponse.json(
      {
        success: true,
        data: popularCategories,
        count: popularCategories.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching popular categories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch popular categories",
      },
      { status: 500 },
    );
  }
}
