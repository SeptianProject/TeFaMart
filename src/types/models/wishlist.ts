import { User } from "./user";
import { Product } from "./product";

export interface Wishlist {
  id: string;
  userId: string;
  user?: User;
  productId: string;
  product?: Product;
  createdAt: Date;
}
