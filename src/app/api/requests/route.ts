import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/requests
 * Endpoint untuk client membuat request baru (Purchase Order atau Investment)
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

    // Validasi product exists dan tersedia
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        tefa: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.isAvailable !== "Tersedia") {
      return NextResponse.json(
        { error: "Product is not available" },
        { status: 400 },
      );
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

    // Cek apakah user sudah pernah membuat request untuk product yang sama dengan status PENDING
    const existingRequest = await prisma.request.findFirst({
      where: {
        userId: user.id,
        productId,
        status: "PENDING",
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "You already have a pending request for this product" },
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
      },
    });

    return NextResponse.json(
      {
        message: "Request submitted successfully",
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

/**
 * GET /api/requests
 * Mendapatkan semua request milik user yang sedang login
 * @requires Authentication
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

    // Ambil data user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ambil semua requests milik user
    const requests = await prisma.request.findMany({
      where: {
        userId: user.id,
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

    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
