import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fileToBase64 } from "@/helper/image-converter";
import cloudinary from "@/lib/cloudinary";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;

    const [comments, aggregations] = await Promise.all([
      prisma.comment.findMany({
        where: { id: productId },
        include: {
          user: {
            select: { name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.comment.aggregate({
        where: { id: productId },
        _avg: { rating: true },
        _count: { id: true },
      }),
    ]);

    const stats = {
      averageRating: aggregations._avg.rating || 0,
      totalReviews: aggregations._count.id || 0,
    };

    return NextResponse.json(
      {
        stats,
        comments,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Error fetching comments: `, error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { productId } = await params;
    const formData = await req.formData();
    const content = formData.get("content") as string;
    const rating = parseInt(formData.get("rating") as string);
    const imageFiles = formData.getAll("images") as File[];
    let uploadedImageUrls: string[] = [];

    // TODO: Implement Request model to verify purchase
    // const hasPurchased = await prisma.request.findFirst({
    //     where: {
    //         userId: session.user.id,
    //         productId: productId,
    //         status: "completed"
    //     }
    // });

    // if (!hasPurchased) {
    //     return NextResponse.json(
    //         { error: "Forbidden" },
    //         { status: 403 }
    //     );
    // }

    if (!content) {
      return NextResponse.json(
        { error: "Content comment required" },
        { status: 403 },
      );
    }

    if (imageFiles && imageFiles.length > 0) {
      const uploadPromises = imageFiles.map(async (file) => {
        if (file.size > 0) {
          const base64Image = await fileToBase64(file);
          const result = await cloudinary.uploader.upload(
            `data:${file.type};base64,${base64Image}`,
            {
              folder: "tefamart_product_comments",
              resource_type: "image",
              quality: "auto",
            },
          );
          return result.secure_url;
        }
      });
      const results = await Promise.all(uploadPromises);
      uploadedImageUrls = results.filter((url): url is string => url !== null);
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        rating: rating ? Number(rating) : null,
        productId,
        userId: session.user.id,
        images: uploadedImageUrls,
      },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    });
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment: ", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
