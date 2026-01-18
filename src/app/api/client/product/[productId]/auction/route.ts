import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 });
        }

        const { productId } = await params;
        if (!productId) {
            return NextResponse.json({
                error: "Product is not found"
            }, { status: 400 });
        }

        const body = await req.json();
        const amount = parseFloat(body.amount);

        if (isNaN(amount)) {
            return NextResponse.json({
                error: "Amount is not valid"
            }, { status: 400 });
        }

        const auction = await prisma.auction.findFirst({
            where: {
                productId: productId,
                status: "active"
            },
        });

        if (!auction) {
            return NextResponse.json({
                error: "Active auction is not found"
            }, { status: 400 });
        }

        const now = new Date();

        if (auction.status != "active" || now < auction.startTime || now > auction.endTime) {
            return NextResponse.json({
                error: "Auction is not active"
            }, { status: 400 });
        }

        const transactionBid = await prisma.$transaction(async (tx) => {
            const currentAuction = await tx.auction.findUniqueOrThrow({
                where: { id: auction.id }
            });
            const highestBid = currentAuction.currentBid;
            if (highestBid === 0 && amount < currentAuction.startPrice) {
                throw new Error(`Minimal amount must be Rp ${currentAuction.startPrice.toLocaleString()}`);
            } else if(amount <= highestBid) {
                throw new Error(`Minimal amount must be greater by Rp ${highestBid.toLocaleString()}`);
            }
            const newBid = await tx.bid.create({
                data: {
                    amount,
                    auctionId: auction.id,
                    userId: session.user.id,
                    status: "active"
                }
            });

            await tx.auction.update({
                where: { id: auction.id },
                data: {
                    currentBid: amount
                }
            });

            return newBid;
        });

        return NextResponse.json(transactionBid, { status: 201 });
    } catch (error) {
        console.error("Error creating request: ", error);
        return NextResponse.json({
            error: `Error creating request: ${error}`
        }, { status: 500 });
    }
}