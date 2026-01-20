import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@/types";
import prisma from "@/lib/prisma";
import { fileToBase64 } from "@/helper/image-converter";
import cloudinary from "@/lib/cloudinary";

// Helper function to generate unique slug
function generateSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  // Add timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36);
  return `${baseSlug}-${timestamp}`;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.campusId) {
      return NextResponse.json(
        { error: "No campus associated with this admin" },
        { status: 400 },
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
      { status: 500 },
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
        { status: 400 },
      );
    }

    const body = await req.formData();
    const name = body.get("name") as string;
    const description = body.get("description") as string;
    const price = Number(body.get("price"));
    const isAvailable = body.get("isAvailable") as string;
    const image = body.get("imageUrl") as File;
    const saleType = body.get("saleType") as string;
    let imageUrl = "";

    if (image && image.size > 0) {
      try {
        const base64Image = await fileToBase64(image);

        const uploadImage = await cloudinary.uploader.upload(
          `data:${image.type};base64,${base64Image}`,
          {
            folder: "tefamart_products",
            resource_type: "image",
            quality: "auto",
          },
        );

        imageUrl = uploadImage.secure_url;
      } catch (error) {
        console.error("Error upload image: ", error);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 },
        );
      }
    }

    if (!name || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const tefa = await prisma.tefa.findFirst({
      where: { campusId: session.user.campusId },
    });

    if (!tefa) {
      return NextResponse.json(
        { error: "No TEFA found for this campus" },
        { status: 400 },
      );
    }

    let newProduct;
    if (saleType == "direct") {
      newProduct = await prisma.product.create({
        data: {
          name,
          slug: generateSlug(name),
          description: description || null,
          price,
          isAvailable,
          saleType,
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
    } else if (saleType === "auction") {
      const startTime = body.get("startTime") as string;
      const endTime = body.get("endTime") as string;
      if (!startTime || !endTime) {
        return NextResponse.json(
          {
            error: "All input is required!",
          },
          { status: 400 },
        );
      }
      const startTimeDate = new Date(startTime);
      const endTimeDate = new Date(endTime);
      if (startTimeDate >= endTimeDate) {
        return NextResponse.json(
          {
            error: "Finish time must be greater than start time!",
          },
          { status: 400 },
        );
      }
      newProduct = await prisma.product.create({
        data: {
          name,
          slug: generateSlug(name),
          description: description || null,
          price,
          isAvailable,
          saleType,
          imageUrl: imageUrl || null,
          tefaId: tefa.id,
          auctions: {
            create: {
              startPrice: price,
              currentBid: 0,
              startTime: startTimeDate,
              endTime: endTimeDate,
              status: "coming_soon",
            },
          },
        },
        include: {
          tefa: {
            select: {
              name: true,
              major: true,
            },
          },
          auctions: true,
        },
      });
    } else {
      return NextResponse.json(
        {
          error: "Sale type is not valid!",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
