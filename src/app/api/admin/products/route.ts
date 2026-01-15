import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@/types";
import prisma from "@/lib/prisma";
import { fileToBase64 } from "@/helper/image-converter";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.campusId) {
      return NextResponse.json(
        { error: "No campus associated with this admin" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        tefa: {
          campusId: session.user.campusId,
        },
      },
      include: {
        tefa: {
          select: {
            name: true,
            major: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.campusId) {
      return NextResponse.json(
        { error: "No campus associated with this admin" },
        { status: 400 }
      );
    }

    const body = await req.formData();
    const name = body.get("name") as string;
    const description = body.get("description") as string;
    const price = Number(body.get("price"));
    const stock = Number(body.get("stock"));
    const image = body.get("imageUrl") as File;
    let imageUrl = "";

    if (image && image.size > 0) {
      try {
        const base64Image = await fileToBase64(image);

        const uploadImage = await cloudinary.uploader.upload(`data:${image.type};base64,${base64Image}`, {
          folder: "tefamart_products",
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

    if (!name || !price || !stock) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tefa = await prisma.tefa.findFirst({
      where: { campusId: session.user.campusId },
    });

    if (!tefa) {
      return NextResponse.json(
        { error: "No TEFA found for this campus" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        stock,
        imageUrl: imageUrl || null,
        tefaId: tefa.id,
      },
      include: {
        tefa: {
          select: {
            name: true,
            major: true,
          },
        },
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
