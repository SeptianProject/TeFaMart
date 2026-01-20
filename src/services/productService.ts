export async function fetchProducts() {
  const response = await fetch("/api/client/product");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function fetchProductById(productId: string) {
  const response = await fetch(`/api/client/product/${productId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
}
