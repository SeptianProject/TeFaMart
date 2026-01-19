export interface CreateUserInput {
  name?: string;
  email: string;
  password?: string;
  image?: string;
  role?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  province?: string;
  campusId?: string;
  industryId?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  image?: string;
  role?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  province?: string;
  campusId?: string;
  industryId?: string;
}
