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
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        const body = await req.json();
        const quantity = Number(body.quantity);
        const { notes, requestedBy } = body;

        if (!quantity || quantity < 1) {
            return NextResponse.json({
                error: "Quantity is required"
            }, { status: 400 });
        }

        if(!product) {
            return NextResponse.json({
                error: "Product is not found"
            }, { status: 404 });
        }

        if(product.stock < 1 || product.saleType != "direct" || product.stock < quantity) {
            return NextResponse.json({
                error: "Product is not valid"
            }, { status: 400 });
        }

        const newRequest = await prisma.request.create({
            data: {
                productId,
                quantity,
                notes: notes || "",
                requestedBy: requestedBy || session.user.name,
                userId: session.user.id
            }
        });

        return NextResponse.json(newRequest, { status: 201 });
    } catch (error) {
        console.error("Error creating request: ", error);
        return NextResponse.json({
            error: "Internal Server Error"
        }, { status: 500 });
    }
}