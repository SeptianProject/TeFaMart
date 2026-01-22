import { Category } from "@/types";

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch("/api/client/categories");

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await response.json();
  return data.data;
};

/**
 * Fetch popular categories (maksimal 6)
 */
export const fetchPopularCategories = async (): Promise<Category[]> => {
  const response = await fetch("/api/client/categories/popular");

  if (!response.ok) {
    throw new Error("Failed to fetch popular categories");
  }

  const data = await response.json();
  return data.data;
};
