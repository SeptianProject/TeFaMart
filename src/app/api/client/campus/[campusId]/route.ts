import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "../../../../../../generated/prisma/client";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ campusId: string }> }
) {
    try {

        const { campusId } = await params;
        const { searchParams } = new URL(req.url);
        const kategoriParam = searchParams.get("kategori");
        const jenisParam = searchParams.get("jenis");
        const whereClause: Prisma.ProductWhereInput = {
            tefa: {
                campusId: campusId
            }
        };

        if (kategoriParam) {
            const categories = kategoriParam.split(",");
            whereClause.categoryId = { in: categories };
        }

        if (jenisParam) {
            const saleType = jenisParam.split(",");
            const sale = saleType.map((item) => {
                if (item == "Pre Order") return "direct";
                if (item == "Lelang") return "auction";
                return item;
            });
            whereClause.saleType = { in: sale };
        }

        const dataCampus = await prisma.campus.findUnique({
            where: { id: campusId },
            include: {
                users: {
                    select: {
                        city: true
                    }
                }
            }
        });

        const dataProducts = await prisma.product.findMany({
            where: whereClause,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                tefa: {
                    select: {
                        id: true,
                        name: true,
                        major: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        if (!dataCampus || !dataProducts) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({
            campus: dataCampus,
            products: dataProducts || []
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
