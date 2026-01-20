import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/requests
 * Mengambil semua request dengan informasi lengkap
 * @requires Authentication & Admin Role
 */
export async function GET() {
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

    // Ambil semua requests dengan relasi yang diperlukan
    const requests = await prisma.request.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/requests
 * Membuat request baru
 * @body { productId, clientName, clientEmail, quantity, type, notes }
 * @requires Authentication
 */
export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { productId, clientName, clientEmail, quantity, type, notes } = body;

    // Validasi required fields
    if (!productId || !clientName || !clientEmail || !quantity) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: productId, clientName, clientEmail, quantity",
        },
        { status: 400 },
      );
    }

    // Validasi product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validasi quantity
    if (quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1" },
        { status: 400 },
      );
    }

    // Validasi type
    const validTypes = ["PURCHASE_ORDER", "INVESTMENT"];
    if (type && !validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be PURCHASE_ORDER or INVESTMENT" },
        { status: 400 },
      );
    }

    // Buat request baru
    const newRequest = await prisma.request.create({
      data: {
        productId,
        userId: user.id,
        clientName,
        clientEmail,
        quantity: parseInt(quantity),
        type: type || "PURCHASE_ORDER",
        notes: notes || null,
        status: "PENDING",
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
        message: "Request created successfully",
        data: newRequest,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
