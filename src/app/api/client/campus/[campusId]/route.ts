import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ campusId: string }> }
) {
    try {

        const { campusId } = await params;

        const campus = await prisma.campus.findUnique({
            where: { id: campusId },
            include: {
                tefas: {
                    select: {
                        id: true,
                        name: true,
                        major: true,
                        description: true,
                        products: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                price: true,
                                isAvailable: true,
                                imageUrl: true
                            }
                        }
                    }
                }
            },
        });

        if (!campus) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(campus);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
