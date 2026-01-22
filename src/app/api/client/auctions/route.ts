import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/client/auctions
 * Mengambil semua lelang aktif dari semua kategori
 */
export async function GET(req: NextRequest) {
  try {
    console.log("=== Fetching Auctions ===");

    // DEBUG: Cek semua produk dengan saleType auction
    const allAuctionProducts = await prisma.product.findMany({
      where: {
        saleType: {
          in: ["auction", "Lelang"],
        },
      },
      select: {
        id: true,
        name: true,
        saleType: true,
        isAvailable: true,
        _count: {
          select: {
            auctions: true,
          },
        },
      },
    });
    console.log(
      `DEBUG: Total products with saleType auction/Lelang: ${allAuctionProducts.length}`,
    );
    allAuctionProducts.forEach((p) => {
      console.log(
        `  - ${p.name}: saleType=${p.saleType}, available=${p.isAvailable}, auctions=${p._count.auctions}`,
      );
    });

    // DEBUG: Cek semua auction records
    const allAuctions = await prisma.auction.findMany({
      select: {
        id: true,
        status: true,
        endTime: true,
        product: {
          select: {
            name: true,
            saleType: true,
          },
        },
      },
    });
    console.log(`DEBUG: Total auction records: ${allAuctions.length}`);
    allAuctions.forEach((a) => {
      const isExpired = new Date(a.endTime) < new Date();
      console.log(
        `  - ${a.product.name}: status=${a.status}, expired=${isExpired}, saleType=${a.product.saleType}`,
      );
    });

    // Ambil SEMUA produk yang punya lelang aktif (tidak dibatasi kategori)
    let activeAuctions = await prisma.auction.findMany({
      where: {
        status: "active",
        endTime: {
          gte: new Date(), // Hanya lelang yang belum berakhir
        },
        product: {
          isAvailable: "Tersedia",
          saleType: {
            in: ["auction", "Lelang"], // HANYA produk dengan tipe lelang
          },
        },
      },
      include: {
        product: {
          include: {
            tefa: {
              select: {
                name: true,
                campus: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        bids: {
          orderBy: {
            amount: "desc",
          },
          take: 1, // Ambil bid tertinggi
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            bids: true,
          },
        },
      },
      orderBy: {
        endTime: "asc", // Urutkan berdasarkan yang paling dekat berakhir
      },
      take: 10, // Ambil 10 lelang teratas
    });

    console.log(
      `Found ${activeAuctions.length} active auctions with auction records`,
    );

    // Fallback: Jika tidak ada auction aktif, ambil produk dengan saleType auction atau Lelang
    if (activeAuctions.length === 0) {
      console.log(
        "No active auctions found, checking products with saleType auction/Lelang",
      );

      const auctionProducts = await prisma.product.findMany({
        where: {
          saleType: {
            in: ["auction", "Lelang"],
          },
          isAvailable: "Tersedia",
        },
        include: {
          tefa: {
            select: {
              name: true,
              campus: {
                select: {
                  name: true,
                },
              },
            },
          },
          category: {
            select: {
              name: true,
            },
          },
          auctions: {
            include: {
              bids: {
                orderBy: {
                  amount: "desc",
                },
                take: 1,
                include: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  bids: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      });

      console.log(
        `Found ${auctionProducts.length} products with saleType auction/Lelang`,
      );

      // Transform product data to auction format
      activeAuctions = auctionProducts
        .filter((product) => product.auctions.length > 0)
        .map((product) => {
          const auction = product.auctions[0];
          return {
            ...auction,
            product: {
              ...product,
              auctions: undefined,
            },
          };
        }) as any;

      console.log(
        `After filtering, ${activeAuctions.length} products have auction records`,
      );
    }

    // Format response
    const formattedAuctions = activeAuctions.map((auction) => ({
      id: auction.id,
      product: {
        id: auction.product.id,
        name: auction.product.name,
        slug: auction.product.slug,
        description: auction.product.description,
        imageUrl: auction.product.imageUrl,
        category: auction.product.category?.name,
        tefa: {
          name: auction.product.tefa.name,
          campus: auction.product.tefa.campus.name,
        },
      },
      startPrice: auction.startPrice,
      currentBid: auction.currentBid,
      highestBid: auction.bids[0]?.amount || auction.startPrice,
      highestBidder: auction.bids[0]?.user.name || null,
      totalBids: auction._count.bids,
      startTime: auction.startTime,
      endTime: auction.endTime,
      status: auction.status,
    }));

    console.log(`Returning ${formattedAuctions.length} formatted auctions`);

    return NextResponse.json({
      success: true,
      data: formattedAuctions,
      count: formattedAuctions.length,
    });
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch auctions",
      },
      { status: 500 },
    );
  }
}
