import { Product } from "./product";
import { Bid } from "./bid";

export interface Auction {
  id: string;
  productId: string;
  product?: Product;
  startPrice: number;
  currentBid: number;
  startTime: Date;
  endTime: Date;
  status: string;
  bids?: Bid[];
  createdAt: Date;
  updatedAt: Date;
}
