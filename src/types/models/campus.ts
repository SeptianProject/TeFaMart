import { User } from "./user";
import { Tefa } from "./tefa";

export interface Campus {
  id: string;
  name: string;
  users?: User[];
  tefas?: Tefa[];
  createdAt: Date;
  updatedAt: Date;
}
