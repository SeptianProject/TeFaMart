import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Cari produk berdasarkan slug
    const product = await prisma.product.findUnique({
      where: { slug: slug },
      include: {
        category: true,
        tefa: {
          include: {
            campus: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Cari produk rekomendasi berdasarkan kategori yang sama
    // atau dari campus yang sama, dan exclude produk saat ini
    const recommendations = await prisma.product.findMany({
      where: {
        AND: [
          { id: { not: product.id } }, // Exclude current product
          {
            OR: [
              { categoryId: product.categoryId }, // Same category
              {
                tefa: {
                  campusId: product.tefa.campusId, // Same campus
                },
              },
            ],
          },
          { isAvailable: "Tersedia" }, // Only available products
        ],
      },
      include: {
        tefa: {
          include: {
            campus: {
              select: {
                name: true,
                users: {
                  select: {
                    city: true,
                  },
                },
              },
            },
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      take: 8, // Limit to 8 recommendations
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(recommendations, { status: 200 });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
