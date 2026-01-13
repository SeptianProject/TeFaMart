import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@/types";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.SUPER_ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalUsers, totalCampus, totalAdmins, totalClients] =
      await Promise.all([
        prisma.user.count(),
        prisma.campus.count(),
        prisma.user.count({ where: { role: Role.ADMIN } }),
        prisma.user.count({ where: { role: Role.CLIENT } }),
      ]);

    return NextResponse.json({
      totalUsers,
      totalCampus,
      totalAdmins,
      totalClients,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
