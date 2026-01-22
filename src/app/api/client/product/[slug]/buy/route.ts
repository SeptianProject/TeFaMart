import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { slug } = await params;

    const body = await req.json();

    const quantity = Number(body.quantity) || 1;
    const notes = body.notes || "-";

    const product = await prisma.product.findUnique({
      where: { slug: slug },
      include: {
        tefa: {
          include: {
            campus: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        { status: 404 },
      );
    }

    const admin = await prisma.user.findFirst({
      where: {
        campusId: product.tefa.campusId,
        role: "ADMIN",
        phoneNumber: {
          not: null,
        },
      },
    });

    if (!admin || !admin.phoneNumber) {
      return NextResponse.json(
        {
          error: `Admin contact not available.`,
        },
        { status: 404 },
      );
    }

    const message = `Halo Admin ${product.tefa.campus.name}!\n\nSaya tertarik dengan produk:\n*${product.name}*\nHarga: Rp ${product.price.toLocaleString()}\nJumlah: ${quantity}\nCatatan: ${notes}\n\nMohon informasi lebih lanjut.`;

    const whatsappUrl = `https://wa.me/${admin.phoneNumber}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({
      success: true,
      whatsappUrl,
    });
  } catch (error) {
    console.error("Error processing buy request:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
