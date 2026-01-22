import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ campusId: string }> },
) {
  try {
    const { campusId } = await params;

    // Ambil semua tefa dari campus ini
    const tefas = await prisma.tefa.findMany({
      where: { campusId: campusId },
      select: { id: true },
    });

    const tefaIds = tefas.map((t) => t.id);

    // Ambil semua produk dari tefa-tefa tersebut
    const products = await prisma.product.findMany({
      where: { tefaId: { in: tefaIds } },
      select: { id: true },
    });

    const productIds = products.map((p) => p.id);

    // Ambil semua komentar untuk produk-produk tersebut
    const comments = await prisma.comment.findMany({
      where: {
        productId: { in: productIds },
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        product: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Hitung statistik
    const totalReviews = comments.length;
    const averageRating =
      totalReviews > 0
        ? comments.reduce((sum, c) => sum + (c.rating || 0), 0) / totalReviews
        : 0;

    return NextResponse.json(
      {
        comments,
        stats: {
          totalReviews,
          averageRating,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching campus reviews:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
