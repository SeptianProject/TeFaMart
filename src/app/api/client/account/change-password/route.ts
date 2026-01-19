import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 });
        }
        const getUser = await prisma.user.findUnique({
            where: {
                id: session.user.id
            }
        });
        if (!getUser || getUser?.password === null) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 404 });
        }
        const { current_password, new_password, confirm_new_password } = await req.json();
        if (!current_password || !new_password) {
            return NextResponse.json({
                error: "All input is required"
            }, { status: 400 });
        }
        if (new_password != confirm_new_password) {
            return NextResponse.json({
                error: "New password and confirm new password is not match"
            }, { status: 400 });
        }
        const matchPassword = await bcrypt.compare(current_password, getUser.password);
        if (!matchPassword) {
            return NextResponse.json({
                error: "Current password is not valid"
            }, { status: 400 });
        }
        const hashedNewPassword = await bcrypt.hash(new_password, 10);
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                password: hashedNewPassword
            }
        });
        return NextResponse.json({
            error: "Success change password!"
        }, { status: 200 });
    } catch (error) {
        console.error("Error update user: ", error);
        return NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 });
    }
}