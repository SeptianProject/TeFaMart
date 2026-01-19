import { Tefa } from "./tefa";
import { Comment } from "./comment";
import { Auction } from "./auction";
import { Wishlist } from "./wishlist";
import { Request } from "./request";
import { Category } from "./category";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isAvailable: string;
  imageUrl: string | null;
  categoryId: string | null;
  category?: Category;
  saleType: string | null;
  tefaId: string;
  tefa?: Tefa;
  comment?: Comment[];
  auctions?: Auction[];
  wishlists?: Wishlist[];
  requests?: Request[];
  createdAt: Date;
  updatedAt: Date;
}
