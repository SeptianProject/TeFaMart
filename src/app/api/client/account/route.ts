import { getPublicIdFromUrl } from "@/helper/cloudinary-helper";
import { fileToBase64 } from "@/helper/image-converter";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
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
        const getUser = await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            select: {
                name: true,
                email: true, 
                image: true,
                phoneNumber: true,
                address: true,
                city: true,
                province: true
            }
        });
        if (!getUser) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 404 });
        }
        return NextResponse.json(getUser, { status: 200 });
    } catch (error) {
        console.error("Error get user: ", error);
        return NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 });
    }
}

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
        const body = await req.formData();
        const name = body.get("name") as string ?? getUser?.name;
        const image = body.get("image") as File | null;
        const phoneNumber = body.get("phoneNumber") as string ?? getUser?.phoneNumber;
        const address = body.get("address") as string ?? getUser?.address;
        const city = body.get("city") as string ?? getUser?.city;
        const province = body.get("province") as string ?? getUser?.province;

        if (!name || !phoneNumber || !address || !city || !province) {
            return NextResponse.json({
                message: "All input is required"
            }, { status: 400 });
        }

        let imageUrl = getUser?.image;

        if (image && image.size > 0) {
            if (imageUrl) {
                const publicId = getPublicIdFromUrl(imageUrl);

                if (publicId) {
                    try {
                        await cloudinary.uploader.destroy(publicId);
                        console.log(`Success deleted image from Cloudinary: ${publicId}`);
                    } catch (error) {
                        console.log(`Failed deleted image from Cloudinary: ${error}`);
                    }
                }
            }
            try {
                const base64Image = await fileToBase64(image);

                const uploadImage = await cloudinary.uploader.upload(`data:${image.type};base64,${base64Image}`, {
                    folder: "tefamarts_user",
                    resource_type: "image",
                    quality: "auto"
                });

                imageUrl = uploadImage.secure_url;
            } catch (error) {
                console.error("Error upload image: ", error);
                return NextResponse.json(
                    { error: "Failed to upload image" },
                    { status: 500 }
                );
            }
        }

        const updateUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: name ?? getUser?.name,
                image: imageUrl ?? getUser?.image,
                phoneNumber: phoneNumber ?? getUser?.phoneNumber,
                address: address ?? getUser?.address,
                city: city ?? getUser?.city,
                province: province ?? getUser?.province
            }, 
            select: {
                name: true,
                email: true, 
                image: true,
                phoneNumber: true,
                address: true,
                city: true,
                province: true
            }
        });

        return NextResponse.json(updateUser, { status: 200 });
    } catch (error) {
        console.error("Error update user: ", error);
        return NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 });
    }
}