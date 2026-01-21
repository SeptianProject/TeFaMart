import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fileToBase64 } from "@/helper/image-converter";
import cloudinary from "@/lib/cloudinary";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug: slug },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        { status: 404 },
      );
    }

    const [comments, aggregations] = await Promise.all([
      prisma.comment.findMany({
        where: { productId: product.id },
        include: {
          user: {
            select: { name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.comment.aggregate({
        where: { productId: product.id },
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
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized - Please login",
        },
        { status: 401 },
      );
    }

    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug: slug },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        { status: 404 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const content = formData.get("content") as string;
    const rating = parseInt(formData.get("rating") as string);
    const files = formData.getAll("images") as File[];

    if (!content || !rating) {
      return NextResponse.json(
        {
          error: "Content and rating are required",
        },
        { status: 400 },
      );
    }

    const imageUrls: string[] = [];

    if (files.length > 0) {
      for (const file of files) {
        if (file.size > 0) {
          try {
            const base64 = await fileToBase64(file);
            const result = await cloudinary.uploader.upload(base64, {
              folder: "tefamart/comments",
              resource_type: "auto",
            });
            imageUrls.push(result.secure_url);
          } catch (uploadError) {
            console.error(`Error uploading image:`, uploadError);
          }
        }
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        rating,
        images: imageUrls,
        userId: user.id,
        productId: product.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error(`Error creating comment:`, error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
