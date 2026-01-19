import { Product } from "./product";

export interface Category {
  id: string;
  name: string;
  slug: string;
  products?: Product[];
  _count?: {
    products: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
