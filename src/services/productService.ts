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
