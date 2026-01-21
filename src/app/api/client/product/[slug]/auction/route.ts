import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized - Please login",
        },
        { status: 401 },
      );
    }

    const { slug } = await params;
    const { bidAmount } = await req.json();

    if (!bidAmount || typeof bidAmount !== "number") {
      return NextResponse.json(
        {
          error: "Invalid bid amount",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 },
      );
    }

    const product = await prisma.product.findUnique({
      where: { slug: slug },
      include: {
        auctions: {
          where: {
            endTime: {
              gte: new Date(),
            },
          },
          include: {
            bids: {
              orderBy: {
                amount: "desc",
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        { status: 404 },
      );
    }

    const activeAuction = product.auctions[0];
    if (!activeAuction) {
      return NextResponse.json(
        {
          error: "No active auction for this product",
        },
        { status: 400 },
      );
    }

    const highestBid = activeAuction.bids[0];
    const minimumIncrement = 10000; // Default increment Rp 10,000
    const minimumBid = highestBid
      ? highestBid.amount + minimumIncrement
      : activeAuction.startPrice;

    if (bidAmount < minimumBid) {
      return NextResponse.json(
        {
          error: `Bid must be at least Rp ${minimumBid.toLocaleString()}`,
        },
        { status: 400 },
      );
    }

    const newBid = await prisma.bid.create({
      data: {
        amount: bidAmount,
        userId: user.id,
        auctionId: activeAuction.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        bid: newBid,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error placing bid:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
