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

    const requests = await prisma.request.findMany({
      where: {
        product: {
          tefa: {
            campusId: session.user.campusId,
          },
        },
      },
      include: {
        product: {
          include: {
            tefa: {
              select: {
                name: true,
                major: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
