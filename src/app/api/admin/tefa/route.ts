import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@/types";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.campusId) {
      return NextResponse.json(
        { error: "No campus associated with this admin" },
        { status: 400 }
      );
    }

    const tefas = await prisma.tefa.findMany({
      where: {
        campusId: session.user.campusId,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tefas);
  } catch (error) {
    console.error("Error fetching tefas:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.campusId) {
      return NextResponse.json(
        { error: "No campus associated with this admin" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, major, description } = body;

    // Validasi input
    if (!name || !major) {
      return NextResponse.json(
        { error: "Name and major are required" },
        { status: 400 }
      );
    }

    const newTefa = await prisma.tefa.create({
      data: {
        name,
        major,
        description: description || null,
        campusId: session.user.campusId,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json(newTefa, { status: 201 });
  } catch (error) {
    console.error("Error creating tefa:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
