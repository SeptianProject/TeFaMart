import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * PATCH /api/admin/requests/[id]
 * Update status request (APPROVED/REJECTED)
 * @param id - Request ID
 * @body { status }
 * @requires Authentication & Admin Role
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Validasi autentikasi
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    // Validasi role admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validasi status
    const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be PENDING, APPROVED, or REJECTED" },
        { status: 400 },
      );
    }

    // Cek apakah request exists
    const existingRequest = await prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Update status request
    const updatedRequest = await prisma.request.update({
      where: { id },
      data: { status },
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Request status updated successfully",
        data: updatedRequest,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/requests/[id]
 * Hapus request
 * @param id - Request ID
 * @requires Authentication & Admin Role
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Validasi autentikasi
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    // Validasi role admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;

    // Cek apakah request exists
    const existingRequest = await prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Hapus request
    await prisma.request.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Request deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/admin/requests/[id]
 * Mendapatkan detail request berdasarkan ID
 * @param id - Request ID
 * @requires Authentication & Admin Role
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Validasi autentikasi
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    // Validasi role admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;

    // Ambil request berdasarkan ID
    const requestData = await prisma.request.findUnique({
      where: { id },
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!requestData) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(requestData, { status: 200 });
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
