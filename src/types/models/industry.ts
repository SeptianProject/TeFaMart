import { User } from "./user";

export interface Industry {
  id: string;
  name: string;
  description: string | null;
  sector: string | null;
  status: string;
  verifiedAt: Date | null;
  users?: User[];
  createdAt: Date;
  updatedAt: Date;
}
