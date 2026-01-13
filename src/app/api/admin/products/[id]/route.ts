import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@/types";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        tefa: {
          select: {
            campusId: true,
          },
        },
      },
    });

    if (!product || product.tefa.campusId !== session.user.campusId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, description, price, stock, image } = body;

    if (!name || !price || !stock) {
      return NextResponse.json(
        { error: "Name, price, and stock are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
      select: { tefaId: true },
    });

    const tefa = await prisma.tefa.findFirst({
      where: { campusId: session.user.campusId! },
    });

    if (!product || product.tefaId !== tefa?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || null,
        price,
        stock,
        imageUrl: image || null,
      },
      include: {
        tefa: {
          select: {
            name: true,
            major: true,
          },
        },
      },
    });

    return NextResponse.json(updateProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tefa = await prisma.tefa.findFirst({
      where: { campusId: session.user.campusId! },
    });

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        tefa: {
          select: {
            name: true,
            major: true,
          },
        },
      },
    });

    if (!product || product.tefaId !== tefa?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
