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

        const body = await req.json();

        const quantity = Number(body.quantity) || 1;
        const notes = body.notes || "-";

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                tefa: {
                    include: {
                        campus: true
                    }
                }
            }
        });

        if (!product) {
            return NextResponse.json({
                error: "Product not found"
            }, { status: 404 });
        }

        const admin = await prisma.user.findFirst({
            where: {
                campusId: product.tefa.campusId,
                role: "admin",
                phoneNumber: {
                    not: null
                }
            }
        });

        if (admin?.phoneNumber == null) {
            return NextResponse.json({
                error: "Admin TEFA not available"
            }, { status: 400 });
        }

        let adminPhoneNumber = admin.phoneNumber;
        if (adminPhoneNumber.startsWith("0")) {
            adminPhoneNumber = "62" + adminPhoneNumber.slice(1);
        }

        const totalPrice = product.price * quantity;
        const formattedPrice = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalPrice);
        const message = [
            `Halo Admin TEFA *${product.tefa.name}*.`,
            `Saya *${session.user.name}* ingin memesan produk:`,
            ``,
            `📦 *${product.name}*`,
            `🔢 Qty: ${quantity}`,
            `💰 Total: ${formattedPrice}`,
            `📝 Catatan: ${notes}`,
            ``,
            `Mohon info ketersediannya. Terimakasih!`
        ].join('\n');
        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;

        return NextResponse.json({
            url: waUrl,
        }, { status: 200 });
    } catch (error) {
        console.error("Error creating request: ", error);
        return NextResponse.json({
            error: "Internal Server Error"
        }, { status: 500 });
    }
}