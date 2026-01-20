import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/requests/[id]
 * Mendapatkan detail request milik user
 * @param id - Request ID
 * @requires Authentication
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

    // Ambil data user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
      },
    });

    if (!requestData) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Validasi ownership
    if (requestData.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only view your own requests" },
        { status: 403 },
      );
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

/**
 * DELETE /api/requests/[id]
 * User dapat cancel/delete request mereka sendiri (hanya jika masih PENDING)
 * @param id - Request ID
 * @requires Authentication
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

    // Ambil data user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;

    // Cek apakah request exists
    const existingRequest = await prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Validasi ownership
    if (existingRequest.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own requests" },
        { status: 403 },
      );
    }

    // User hanya bisa delete request yang masih PENDING
    if (existingRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Cannot delete request that has been processed" },
        { status: 400 },
      );
    }

    // Hapus request
    await prisma.request.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Request cancelled successfully",
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
