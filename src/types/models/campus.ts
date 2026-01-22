import { User } from "./user";
import { Tefa } from "./tefa";

export interface Campus {
  id: string;
  name: string;
  logo?: string | null;
  image?: string | null;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  phoneNumber?: string | null;
  whatsappNumber?: string | null;
  website?: string | null;
  users?: User[];
  tefas?: Tefa[];
  createdAt: Date;
  updatedAt: Date;
}
