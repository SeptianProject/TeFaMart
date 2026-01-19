import { Product } from "./product";
import { User } from "./user";

export interface Comment {
  id: string;
  content: string;
  rating: number | null;
  images: string[];
  productId: string;
  product?: Product;
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}
