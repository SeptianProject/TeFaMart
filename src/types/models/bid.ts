import { User } from "./user";
import { Auction } from "./auction";

export interface Bid {
  id: string;
  amount: number;
  userId: string;
  user?: User;
  auctionId: string;
  auction?: Auction;
  status: string;
  createdAt: Date;
}
