import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * POST /api/admin/update-popular-categories
 * Temporary endpoint untuk update popular categories (development only)
 * ⚠️ HAPUS ATAU PROTECT ENDPOINT INI SEBELUM PRODUCTION!
 */
export async function POST() {
  // Uncomment untuk production security
  // if (process.env.NODE_ENV === 'production') {
  //   return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  // }

  const updates = [
    {
      name: "Digital & Jasa IT",
      alternativeNames: ["Digital", "Jasa IT"],
      imageUrl:
        "https://res.cloudinary.com/djlqeh6as/image/upload/v1769073502/tefamart/products/digital1_bikbck.png",
    },
    {
      name: "Elektronika & IOT",
      alternativeNames: ["Elektronik & IOT", "Elektronik", "IOT"],
      imageUrl:
        "https://res.cloudinary.com/djlqeh6as/image/upload/v1769073502/tefamart/products/iot1_bikbck.png",
    },
    {
      name: "Fashion & Tekstil",
      alternativeNames: ["Fashion", "Tekstil"],
      imageUrl:
        "https://res.cloudinary.com/djlqeh6as/image/upload/v1769073502/tefamart/products/fashion1_bikbck.png",
    },
    {
      name: "Kreatif & Media",
      alternativeNames: ["Kreatif", "Media"],
      imageUrl:
        "https://res.cloudinary.com/djlqeh6as/image/upload/v1769073502/tefamart/products/kreatif1_bikbck.png",
    },
    {
      name: "Manufaktur",
      alternativeNames: [],
      imageUrl:
        "https://res.cloudinary.com/djlqeh6as/image/upload/v1769073502/tefamart/products/manufaktur1_bikbck.png",
    },
    {
      name: "Tataboga & Agribisnis",
      alternativeNames: ["Tata Boga & Agribisnis", "Tataboga", "Agribisnis"],
      imageUrl:
        "https://res.cloudinary.com/djlqeh6as/image/upload/v1769073502/tefamart/products/tataboga1_bikbck.png",
    },
  ];

  const results = [];

  try {
    for (const update of updates) {
      // Try to find category with multiple name variations
      const searchNames = [update.name, ...update.alternativeNames];
      let category = null;

      for (const searchName of searchNames) {
        category = await prisma.category.findFirst({
          where: {
            name: { contains: searchName, mode: "insensitive" },
          },
        });
        if (category) break; // Found it!
      }

      if (category) {
        await prisma.category.update({
          where: { id: category.id },
          data: {
            isPopular: true,
            imageUrl: update.imageUrl,
          },
        });
        results.push({
          success: true,
          name: update.name,
          id: category.id,
        });
      } else {
        results.push({
          success: false,
          name: update.name,
          message: "Category not found",
        });
      }
    }

    // Get all popular categories
    const popularCategories = await prisma.category.findMany({
      where: { isPopular: true },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        isPopular: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Popular categories updated",
      results,
      popularCategories,
    });
  } catch (error) {
    console.error("Error updating popular categories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update popular categories",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
