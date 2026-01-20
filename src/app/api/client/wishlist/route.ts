import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 });
        }
        const wishlists = await prisma.wishlist.findMany({
            where: { userId: session.user.id },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        imageUrl: true
                    }
                }
            }
        });
        return NextResponse.json(wishlists, { status: 200 });
    } catch (error) {
        console.error("Error while add or delete wishlist product: ", error);
        return NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 });
        }

        const { productId } = await req.json();

        if (!productId) {
            return NextResponse.json({
                message: "ID Product is missing"
            }, { status: 400 });
        }

        const checkWishlist = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId: productId
                }
            }
        });

        if (checkWishlist) {
            await prisma.wishlist.delete({
                where: {
                    id: checkWishlist.id,
                }
            });
            const wishlistProducts = await prisma.wishlist.findMany({
                where: {
                    userId: session.user.id,
                    productId: productId
                }, 
                select: {
                    id: true
                }
            });
            return NextResponse.json({
                data: wishlistProducts
            }, { status: 200 });
        } else {
            await prisma.wishlist.create({
                data: {
                    userId: session.user.id,
                    productId: productId
                }
            });
            const wishlistProducts = await prisma.wishlist.findMany({
                where: {
                    userId: session.user.id,
                    productId: productId
                }, 
                select: {
                    id: true
                }
            });
            return NextResponse.json({
               data: wishlistProducts
            }, { status: 201 });
        }
    } catch (error) {
        console.error("Error while add or delete wishlist product: ", error);
        return NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 });
    }
}