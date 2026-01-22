import { Product } from "./product";

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null; // URL gambar kategori dari Cloudinary
  isPopular?: boolean; // Flag untuk kategori populer
  products?: Product[];
  _count?: {
    products: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
