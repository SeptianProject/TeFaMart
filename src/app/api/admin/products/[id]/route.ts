import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@/types";
import prisma from "@/lib/prisma";
import { fileToBase64 } from "@/helper/image-converter";
import cloudinary from "@/lib/cloudinary";
import { getPublicIdFromUrl } from "@/helper/cloudinary-helper";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        tefa: {
          select: {
            campusId: true,
          },
        },
      },
    });

    if (!product || product.tefa.campusId !== session.user.campusId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (product.imageUrl) {
      const publicId = getPublicIdFromUrl(product.imageUrl);

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Success deleted image from Cloudinary: ${publicId}`);
        } catch (error) {
          console.log(`Failed deleted image from Cloudinary: ${error}`);
        }
      }
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        tefa: { select: { campusId: true } },
      }
    });

    if (!product) {
      return NextResponse.json({
        error: "Product not found"
      }, { status: 404 });
    }

    if (product.tefa.campusId !== session.user.campusId) {
      console.error(`Forbidden Update: User Campus ${session.user.campusId} tries to edit Product Campus ${product.tefa.campusId}`);
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.formData();
    const name = body.get("name") as string;
    const description = body.get("description") as string;
    const price = parseFloat(body.get("price") as string);
    const stock = parseFloat(body.get("stock") as string);
    if (!name || isNaN(price) || isNaN(stock)) {
      return NextResponse.json(
        { error: "Name, price, and stock are required" },
        { status: 400 }
      );
    }
    const image = body.get("imageUrl") as File | null;
    let imageUrl = product?.imageUrl;

    if (image && image.size > 0) {
      if (product.imageUrl) {
        const publicId = getPublicIdFromUrl(product.imageUrl);

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

    const updateProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || null,
        price,
        stock,
        imageUrl: imageUrl || null,
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

    return NextResponse.json(updateProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const tefa = await prisma.tefa.findFirst({
      where: { campusId: session.user.campusId! },
    });

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        tefa: {
          select: {
            name: true,
            major: true,
          },
        },
      },
    });

    if (!product || product.tefaId !== tefa?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
