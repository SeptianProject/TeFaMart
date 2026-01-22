import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug: slug },
      include: {
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
            description: true,
            campusId: true,
            createdAt: true,
            updatedAt: true,
            campus: {
              select: {
                id: true,
                name: true,
                phoneNumber: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        auctions: {
          where: {
            endTime: {
              gte: new Date(),
            },
          },
          include: {
            bids: {
              orderBy: {
                amount: "desc",
              },
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
