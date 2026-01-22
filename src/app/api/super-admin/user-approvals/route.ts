import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET: Mendapatkan list user pending approval
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Hanya SUPER_ADMIN yang bisa akses
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING";
    const role = searchParams.get("role");

    interface WhereClause {
      status: string;
      role?: string | { in: string[] };
    }

    const whereClause: WhereClause = { status };

    // Filter by role jika ada
    if (role && ["INDUSTRI", "ADMIN"].includes(role)) {
      whereClause.role = role;
    } else {
      // Default hanya tampilkan INDUSTRI dan ADMIN
      whereClause.role = { in: ["INDUSTRI", "ADMIN"] };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        campus: {
          select: {
            id: true,
            name: true,
          },
        },
        industry: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data" },
      { status: 500 },
    );
  }
}

// PATCH: Approve atau reject user
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Hanya SUPER_ADMIN yang bisa akses
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, action } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: "userId dan action harus diisi" },
        { status: 400 },
      );
    }

    if (!["APPROVED", "REJECTED"].includes(action)) {
      return NextResponse.json(
        { error: "Action harus APPROVED atau REJECTED" },
        { status: 400 },
      );
    }

    // Update status user
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: action },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json(
      {
        message: `User berhasil ${action === "APPROVED" ? "disetujui" : "ditolak"}`,
        user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengupdate status user" },
      { status: 500 },
    );
  }
}
