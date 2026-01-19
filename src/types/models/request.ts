import { Product } from "./product";
import { User } from "./user";

export interface Request {
  id: string;
  productId: string;
  product?: Product;
  userId: string;
  user?: User;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
