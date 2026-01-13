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

    const tefa = await prisma.tefa.findUnique({
      where: { id },
      select: { campusId: true },
    });

    if (!tefa || tefa.campusId !== session.user.campusId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.tefa.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tefa:", error);
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
    const { name, major, description } = body;

    // Validasi input
    if (!name || !major) {
      return NextResponse.json(
        { error: "Name and major are required" },
        { status: 400 }
      );
    }

    const tefa = await prisma.tefa.findUnique({
      where: { id },
      select: { campusId: true },
    });

    if (!tefa || tefa.campusId !== session.user.campusId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedTefa = await prisma.tefa.update({
      where: { id },
      data: {
        name,
        major,
        description: description || null,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json(updatedTefa);
  } catch (error) {
    console.error("Error updating tefa:", error);
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

    const tefa = await prisma.tefa.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!tefa || tefa.campusId !== session.user.campusId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(tefa);
  } catch (error) {
    console.error("Error fetching tefa:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
