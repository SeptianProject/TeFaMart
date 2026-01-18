import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "../../../../../generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kategoriParam = searchParams.get("kategori");
    const jenisParam = searchParams.get("jenis");
    const whereClause: Prisma.ProductWhereInput = {};
    if(kategoriParam) {
      const categories = kategoriParam.split(",");
      whereClause.category = { in: categories };
    }
    if(jenisParam) {
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
        tefa: {
          select: {
            name: true,
            major: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
