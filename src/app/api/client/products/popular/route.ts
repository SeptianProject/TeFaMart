import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "../../../../../../generated/prisma/client";

/**
 * GET /api/client/products/popular?categoryId=xxx
 * Mengambil produk populer berdasarkan kategori yang populer
 * - Jika categoryId disediakan: ambil 6 produk dari kategori tersebut
 * - Jika tidak: ambil 6 produk dari semua kategori populer
 * Fallback: Jika tidak ada kategori populer, ambil produk dari kategori apa saja
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    // Query produk berdasarkan kategori populer
    const whereClause: Prisma.ProductWhereInput = {
      isAvailable: "Tersedia", // Hanya produk yang tersedia
    };

    if (categoryId) {
      // Filter berdasarkan kategori tertentu (prioritas kategori populer, fallback ke semua)
      whereClause.categoryId = categoryId;

      // Cek apakah kategori ini populer
      const categoryCheck = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { isPopular: true },
      });

      // Jika kategori tidak populer, warning tapi tetap ambil produknya
      if (categoryCheck && !categoryCheck.isPopular) {
        console.log(
          `⚠️  Category ${categoryId} is not marked as popular, but fetching products anyway`,
        );
      }
    } else {
      // Cek dulu apakah ada kategori populer
      const popularCategoryCount = await prisma.category.count({
        where: { isPopular: true },
      });

      if (popularCategoryCount > 0) {
        // Jika ada kategori populer, filter hanya dari mereka
        whereClause.category = {
          isPopular: true,
        };
      } else {
        // Fallback: Tidak ada kategori populer, ambil dari semua kategori
        console.log(
          "⚠️  No popular categories found, fetching products from all categories",
        );
        // whereClause tetap hanya dengan isAvailable
      }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      take: 6, // Limit maksimal 6 produk
      orderBy: [
        {
          createdAt: "desc", // Produk terbaru
        },
      ],
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            isPopular: true,
          },
        },
        tefa: {
          select: {
            id: true,
            name: true,
            major: true,
            campus: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            comment: true,
            wishlists: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: products,
        count: products.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch popular products",
      },
      { status: 500 },
    );
  }
}
