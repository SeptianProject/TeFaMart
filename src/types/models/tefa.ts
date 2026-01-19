import { Campus } from "./campus";
import { Product } from "./product";

export interface Tefa {
  id: string;
  name: string;
  major: string;
  description: string | null;
  campusId: string;
  campus?: Campus;
  products?: Product[];
  createdAt: Date;
  updatedAt: Date;
}
