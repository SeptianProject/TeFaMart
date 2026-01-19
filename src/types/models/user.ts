import { Campus } from "./campus";
import { Industry } from "./industry";
import { Account } from "./auth";
import { Session } from "./auth";
import { Comment } from "./comment";
import { Wishlist } from "./wishlist";
import { Bid } from "./bid";
import { Request } from "./request";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  password: string | null;
  image: string | null;
  role: string;
  phoneNumber: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  campusId: string | null;
  campus?: Campus | null;
  industryId: string | null;
  industry?: Industry | null;
  accounts?: Account[];
  sessions?: Session[];
  comments?: Comment[];
  wishlists?: Wishlist[];
  bids?: Bid[];
  requests?: Request[];
  createdAt: Date;
  updatedAt: Date;
}
