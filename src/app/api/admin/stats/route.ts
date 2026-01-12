import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/types";

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

    const [totalTefa, totalProducts, pendingRequests, approvedRequests] =
      await Promise.all([
        prisma.tefa.count({ where: { campusId: session.user.campusId } }),
        prisma.product.count({
          where: { tefa: { campusId: session.user.campusId } },
        }),
        prisma.request.count({
          where: {
            product: { tefa: { campusId: session.user.campusId } },
            status: "PENDING",
          },
        }),
        prisma.request.count({
          where: {
            product: { tefa: { campusId: session.user.campusId } },
            status: "APPROVED",
          },
        }),
      ]);

    return NextResponse.json({
      totalTefa,
      totalProducts,
      pendingRequests,
      approvedRequests,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
