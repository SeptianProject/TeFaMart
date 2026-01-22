import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const popularCategories = await prisma.category.findMany({
      where: { isPopular: true },
      select: { id: true, name: true, slug: true },
    });

    let categoryId: string | undefined;
    let categoryName: string | undefined;
    let categorySlug: string | undefined;

    if (popularCategories.length > 0) {
      // Pilih kategori populer secara random
      const randomCategory =
        popularCategories[Math.floor(Math.random() * popularCategories.length)];
      categoryId = randomCategory.id;
      categoryName = randomCategory.name;
      categorySlug = randomCategory.slug;
    } else {
      // Fallback: ambil kategori pertama jika tidak ada kategori populer
      const firstCategory = await prisma.category.findFirst({
        select: { id: true, name: true, slug: true },
      });
      if (firstCategory) {
        categoryId = firstCategory.id;
        categoryName = firstCategory.name;
        categorySlug = firstCategory.slug;
      }
    }

    // Ambil produk dari kategori yang dipilih untuk carousel
    const categoryProducts = categoryId
      ? await prisma.product.findMany({
          where: {
            categoryId: categoryId,
            isAvailable: "Tersedia",
          },
          include: {
            tefa: {
              select: {
                name: true,
                campus: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          take: 6,
          orderBy: {
            createdAt: "desc",
          },
        })
      : [];

    // Ambil 1 produk random untuk featured product (card kanan)
    const totalProducts = await prisma.product.count({
      where: { isAvailable: "Tersedia" },
    });

    const randomSkip =
      totalProducts > 0 ? Math.floor(Math.random() * totalProducts) : 0;

    const featuredProduct = await prisma.product.findFirst({
      where: { isAvailable: "Tersedia" },
      include: {
        tefa: {
          select: {
            name: true,
            campus: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      skip: randomSkip,
    });

    return NextResponse.json({
      success: true,
      data: {
        categoryProducts,
        categoryInfo: {
          id: categoryId,
          name: categoryName,
          slug: categorySlug,
        },
        featuredProduct,
      },
    });
  } catch (error) {
    console.error("Error fetching hero products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch hero products",
      },
      { status: 500 },
    );
  }
}
