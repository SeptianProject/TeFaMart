import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "../../../../../generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kategoriParam = searchParams.get("kategori");
    const jenisParam = searchParams.get("jenis");
    const whereClause: Prisma.ProductWhereInput = {};

    if (kategoriParam) {
      const categories = kategoriParam.split(",");
      whereClause.categoryId = { in: categories };
    }

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
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        isAvailable: true,
        imageUrl: true,
        categoryId: true,
        saleType: true,
        tefaId: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
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
