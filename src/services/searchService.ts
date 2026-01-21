import prisma from "@/lib/prisma";

// Search Tefa/Store
export async function searchTefas(query: string) {
  return prisma.tefa.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          major: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          campus: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ],
    },
    take: 5,
    select: {
      id: true,
      name: true,
      major: true,
      description: true,
      campus: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      products: {
        _count: "desc",
      },
    },
  });
}

// Search Products
export async function searchProducts(query: string) {
  return prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
        {
          tefa: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ],
      isAvailable: "Tersedia",
    },
    take: 10,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      imageUrl: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      tefa: {
        select: {
          id: true,
          name: true,
          campus: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        name: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

// Search Categories
export async function searchCategories(query: string) {
  return prisma.category.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: 5,
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

// Get similar results for suggestions
export async function getSimilarResults(query: string) {
  const searchTerm = query.substring(0, 3);

  const [similarProducts, similarCategories, similarTefas] = await Promise.all([
    prisma.product.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
        isAvailable: "Tersedia",
      },
      take: 5,
      select: {
        name: true,
      },
    }),
    prisma.category.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      take: 3,
      select: {
        name: true,
      },
    }),
    prisma.tefa.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      take: 3,
      select: {
        name: true,
      },
    }),
  ]);

  return { similarProducts, similarCategories, similarTefas };
}

// Generate suggestions from search results
export function generateSuggestions(
  tefas: { name: string }[],
  products: { name: string }[],
  categories: { name: string }[],
  maxSuggestions = 8,
): string[] {
  const suggestions: string[] = [];

  // Add Tefa names
  tefas.forEach((tefa) => {
    if (
      !suggestions.includes(tefa.name) &&
      suggestions.length < maxSuggestions
    ) {
      suggestions.push(tefa.name);
    }
  });

  // Add Product names
  products.forEach((product) => {
    if (
      !suggestions.includes(product.name) &&
      suggestions.length < maxSuggestions
    ) {
      suggestions.push(product.name);
    }
  });

  // Add Category names
  categories.forEach((category) => {
    if (
      !suggestions.includes(category.name) &&
      suggestions.length < maxSuggestions
    ) {
      suggestions.push(category.name);
    }
  });

  return suggestions;
}

// Get popular categories and recent products
export async function getDefaultSearchData() {
  const [categories, recentProducts] = await Promise.all([
    prisma.category.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        products: {
          _count: "desc",
        },
      },
    }),
    prisma.product.findMany({
      take: 8,
      where: {
        isAvailable: "Tersedia",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        imageUrl: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
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
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return { categories, recentProducts };
}
