import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "../../../../../generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kategoriParam = searchParams.get("kategori");
    const jenisParam = searchParams.get("jenis");
    const searchQuery = searchParams.get("search");
    const categorySlug = searchParams.get("categorySlug");

    const whereClause: Prisma.ProductWhereInput = {};

    // Search by text
    if (searchQuery) {
      whereClause.OR = [
        {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        },
        {
          tefa: {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    // Filter by category slug
    if (categorySlug) {
      whereClause.category = {
        slug: categorySlug,
      };
    }

    // Filter by category IDs
    if (kategoriParam) {
      const categories = kategoriParam.split(",");
      whereClause.categoryId = { in: categories };
    }

    // Filter by sale type
    if (jenisParam) {
      const saleType = jenisParam.split(",");
      const sale = saleType.map((item) => {
        if (item == "Pre Order") return "direct";
        if (item == "Lelang") return "auction";
        return item;
      });
      whereClause.saleType = { in: sale };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            id: true,
            name: true,
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
