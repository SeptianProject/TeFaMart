import { NextRequest, NextResponse } from "next/server";
import {
  searchTefas,
  searchProducts,
  searchCategories,
  getSimilarResults,
  generateSuggestions,
  getDefaultSearchData,
} from "@/services/searchService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    // Return default data when no query
    if (!query || query.trim() === "") {
      const { categories, recentProducts } = await getDefaultSearchData();

      return NextResponse.json({
        success: true,
        data: {
          categories,
          recentProducts,
          suggestions: [],
          tefas: [],
        },
      });
    }

    // Search with query
    const searchQuery = query.trim().toLowerCase();

    // Parallel search for tefas, products, categories
    const [tefas, products, categories] = await Promise.all([
      searchTefas(searchQuery),
      searchProducts(searchQuery),
      searchCategories(searchQuery),
    ]);

    let suggestions: string[] = [];

    // If no exact results, generate smart suggestions
    if (
      tefas.length === 0 &&
      products.length === 0 &&
      categories.length === 0
    ) {
      const { similarTefas, similarProducts, similarCategories } =
        await getSimilarResults(searchQuery);

      suggestions = generateSuggestions(
        similarTefas,
        similarProducts,
        similarCategories,
      );
    } else {
      // Generate suggestions from exact results
      suggestions = generateSuggestions(tefas, products, categories);
    }

    return NextResponse.json({
      success: true,
      data: {
        tefas,
        products,
        categories,
        suggestions,
        query: searchQuery,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search products",
      },
      { status: 500 },
    );
  }
}
