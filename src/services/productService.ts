export async function fetchProducts() {
  const response = await fetch("/api/client/product");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function fetchProductBySlug(slug: string) {
  const response = await fetch(`/api/client/product/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
}

/**
 * Fetch popular products berdasarkan kategori
 * @param categoryId - Optional category ID untuk filter
 * @returns Array of products (maksimal 6)
 */
export async function fetchPopularProducts(categoryId?: string) {
  const url = categoryId
    ? `/api/client/products/popular?categoryId=${categoryId}`
    : "/api/client/products/popular";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch popular products");
  }

  const data = await response.json();
  return data.data;
}
